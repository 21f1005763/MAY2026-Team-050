import { fill } from "../lib/text";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../api/client";
import type { GrievanceDetail } from "../api/types";
import StatusChip, { metaForStatus } from "../components/StatusChip";
import StatusTimeline from "../components/StatusTimeline";
import { humanizeKey } from "../lib/text";

function languageLabel(language: string) {
  try { return new Intl.DisplayNames(["en"], { type: "language" }).of(language.split("-")[0]) ?? language; }
  catch { return language; }
}

export default function ComplaintDetail() {
  const bcp47 = "en-IN";
  const { id } = useParams<{ id?: string }>();
  const query = useQuery({ queryKey: ["grievance", id], queryFn: () => apiGet<GrievanceDetail>(`/api/grievances/${id}`), enabled: Boolean(id) });

  if (query.isLoading) return <div className="app-page detail-loading" role="status" aria-live="polite" aria-busy="true" aria-label={"Loading complaint"}><div className="detail-loading__header" /><div className="detail-loading__grid"><span /><span /></div></div>;
  if (query.isError) return <div className="app-page"><div className="app-notice app-notice--warning" role="alert"><strong>{"We couldn’t open this complaint."}</strong><span>{"Check your connection, then try again. Your complaint remains safely filed."}</span><button type="button" onClick={() => query.refetch()}>{"Try again"}</button></div></div>;
  if (!query.data) return null;

  const grievance = query.data;
  const current = metaForStatus(grievance.status);
  const facts = grievance.structured_facts;
  const summary = facts?.summary;
  const transcripts = grievance.transcript_metadata ?? [];
  const typedText = facts?.original_text || (!transcripts.length ? grievance.issue_text : undefined);

  return <div className="app-page detail-page">
    <nav className="detail-breadcrumb" aria-label="Breadcrumb"><Link to="/dashboard">{"Your complaints"}</Link><span aria-hidden="true">/</span><span aria-current="page">{grievance.human_id}</span></nav>
    <header className="detail-header"><Link to="/dashboard" className="wizard-back" aria-label={"Back to dashboard"}>‹</Link><div><span>{grievance.human_id}</span><h1>{grievance.category_label ?? humanizeKey(grievance.category) ?? "Your complaint"}</h1><p>{fill("Filed {date}", { date: new Date(grievance.created_at).toLocaleDateString(bcp47, { dateStyle: "long" }) })}</p></div><StatusChip status={grievance.status} /></header>
    <div className="detail-current" role="status"><span aria-hidden="true">✓</span><div><strong>{fill("Current status: {status}", { status: current.fallback ?? current.label })}</strong><p>{grievance.status === "submitted" ? "The responsible department has received your complaint." : "We’ll keep this page updated as your complaint moves forward."}</p></div></div>
    <div className="detail-layout"><article className="detail-summary"><h2>{"Complaint details"}</h2><dl>
      <div><dt>{"Service area"}</dt><dd>{grievance.domain_label ?? "Municipal services"}</dd></div>
      <div><dt>{"Department"}</dt><dd>{grievance.department_name ?? humanizeKey(grievance.department_key) ?? "Finding the right department"}</dd></div>
      <div><dt>{"Priority"}</dt><dd>{grievance.priority === "high" ? "Priority" : "Normal priority"}</dd></div>
      <div><dt>{"Handling"}</dt><dd>{grievance.disposition ? grievance.disposition.replace(/_/g, " ") : "Being prepared"}</dd></div>
      <div><dt>{"Filed through"}</dt><dd>{grievance.source === "whatsapp" ? "WhatsApp" : "Jan Setu web portal"}</dd></div>
      <div><dt>{"Reports grouped"}</dt><dd>{grievance.report_count > 1 ? fill("{count} citizen reports", { count: grievance.report_count }) : "This report only"}</dd></div>
      <div className="is-wide"><dt>{"Location"}</dt><dd>{grievance.address ?? "Location is being resolved"}</dd></div>
      {summary && <div className="is-wide"><dt>{"Complaint summary"}</dt><dd className="quote-block">{summary}</dd></div>}
      {typedText && <div className="is-wide"><dt>{"Your written report"}</dt><dd>{typedText}</dd></div>}
      {transcripts.map((clip, index) => <div className="is-wide" key={`${clip.language}-${index}`}><dt>{fill("Voice transcript {n}", { n: index + 1 })} <small>({languageLabel(clip.language)})</small></dt><dd>{clip.text}</dd></div>)}
      {!summary && !grievance.issue_text && <div className="is-wide"><dt>{"Description"}</dt><dd>{"No usable description was provided."}</dd></div>}
      {facts?.requested_action && <div className="is-wide"><dt>{"Requested action"}</dt><dd>{facts.requested_action}</dd></div>}
      {facts?.landmark && <div><dt>{"Reported landmark"}</dt><dd>{facts.landmark}</dd></div>}
      {grievance.routing?.sla_hours != null && <div><dt>{"Expected handling target"}</dt><dd>{fill("{count} hours", { count: grievance.routing.sla_hours })}</dd></div>}
    </dl>{grievance.report_count > 1 && <p className="detail-reports">{fill("{count} citizens have reported this issue. Grouping nearby reports gives the department one clearer case to act on.", { count: grievance.report_count })}</p>}</article><aside className="detail-history"><h2>{"Status history"}</h2><p>{"Each update is recorded here."}</p><StatusTimeline events={grievance.events} /></aside></div>
  </div>;
}
