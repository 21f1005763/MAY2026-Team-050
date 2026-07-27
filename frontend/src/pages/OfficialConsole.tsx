import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { ApiError } from "../api/client";
import { officialToken } from "./OfficialLogin";

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";
type QueueItem = { id:string; human_id:string; status:string; review_status:string|null; category_label:string; department_key:string|null; safety_level:string|null; address:string|null; created_at:string };
type Metrics = { total_visible:number; pending_review:number; immediate_safety:number; failed_ai:number; failed_dispatch:number };

async function officialRequest<T>(path:string, init:RequestInit={}):Promise<T>{
  const response=await fetch(`${API_BASE}${path}`,{...init,headers:{"Content-Type":"application/json",Authorization:`Bearer ${officialToken()}`,...(init.headers??{})}});
  if(response.status===401){sessionStorage.removeItem("jan-setu-official-token");window.location.assign("/official/login");throw new ApiError(401,"Official session expired");}
  if(!response.ok){const body=await response.json().catch(()=>({}));throw new ApiError(response.status,body.detail??response.statusText);}
  return response.json() as Promise<T>;
}

export default function OfficialConsole(){
  const token=officialToken();
  const [queue,setQueue]=useState<QueueItem[]>([]);const [metrics,setMetrics]=useState<Metrics|null>(null);const [filter,setFilter]=useState("pending_official");const [error,setError]=useState<string|null>(null);
  const profile=useMemo(()=>{try{return JSON.parse(sessionStorage.getItem("jan-setu-official-profile")??"null")}catch{return null}},[]);
  const load=async()=>{try{const suffix=filter?`?review_status=${encodeURIComponent(filter)}`:"";const [items,count]=await Promise.all([officialRequest<QueueItem[]>(`/api/official/queue${suffix}`),officialRequest<Metrics>("/api/official/metrics")]);setQueue(items);setMetrics(count)}catch(value){setError(value instanceof Error?value.message:"Could not load queue")}};
  useEffect(()=>{if(!token)return;void load();const timer=window.setInterval(()=>void load(),10000);return()=>window.clearInterval(timer)},[token,filter]);
  if(!token)return <Navigate to="/official/login" replace/>;
  return <div className="official-shell"><header className="official-header"><div><span>Government operations · {profile?.jurisdiction_id}</span><h1>Civic triage desk</h1><p>{profile?.name} · {profile?.role}</p></div><button type="button" className="app-button app-button--soft" onClick={()=>{sessionStorage.removeItem("jan-setu-official-token");sessionStorage.removeItem("jan-setu-official-profile");window.location.assign("/official/login")}}>Sign out</button></header>
    <main className="official-main" id="main-content"><section className="official-metrics" aria-label="Queue metrics">{metrics&&<><article><span>Visible cases</span><strong>{metrics.total_visible}</strong></article><article><span>Needs review</span><strong>{metrics.pending_review}</strong></article><article><span>Immediate safety</span><strong>{metrics.immediate_safety}</strong></article><article><span>AI unavailable</span><strong>{metrics.failed_ai}</strong></article><article><span>Dispatch failed</span><strong>{metrics.failed_dispatch}</strong></article></>}</section>
      <div className="official-workspace"><section className="official-queue"><div className="official-toolbar"><h2>Triage queue</h2><label>View<select value={filter} onChange={event=>setFilter(event.target.value)}><option value="pending_official">Needs official review</option><option value="awaiting_citizen">Awaiting citizen</option><option value="approved">Approved</option><option value="">All visible</option></select></label></div>{queue.length===0?<p className="app-empty">No complaints in this queue.</p>:<ol>{queue.map(item=><li key={item.id}><span><b>{item.human_id}</b><small>{item.category_label}</small></span><span className={`status-chip ${item.safety_level==="immediate"?"status-chip--warning":"status-chip--info"}`}>{item.safety_level==="immediate"?"Safety":item.review_status??item.status}</span><small>{item.address??"Location unresolved"}</small></li>)}</ol>}</section></div>{error&&<p className="app-error" role="alert">{error}</p>}</main></div>;
}
