import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiPostEmpty, apiPostForm } from "../api/client";
import type { ConfirmResponse, GrievanceDraftResponse } from "../api/types";

export default function NewComplaint() {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [description, setDescription] = useState("");
  const [landmark, setLandmark] = useState("");
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<GrievanceDraftResponse | null>(null);
  const [result, setResult] = useState<ConfirmResponse | null>(null);

  const create = useMutation({
    mutationFn: (data: FormData) => apiPostForm<GrievanceDraftResponse>("/api/grievances/draft", data),
    onSuccess: setDraft,
    onError: (value: Error) => setError(value.message),
  });
  const confirm = useMutation({
    mutationFn: () => apiPostEmpty<ConfirmResponse>(`/api/grievances/${draft!.id}/confirm`),
    onSuccess: setResult,
  });

  const locate = () => {
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(String(position.coords.latitude));
        setLon(String(position.coords.longitude));
        setLocating(false);
      },
      () => {
        setError("We could not read your location. Enter the coordinates instead.");
        setLocating(false);
      },
    );
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const data = new FormData();
    data.append("lat", lat);
    data.append("lon", lon);
    if (description.trim()) data.append("text", description.trim());
    if (landmark.trim()) data.append("landmark", landmark.trim());
    create.mutate(data);
  };

  if (result) {
    return <div className="wizard-page">
      <h1>{"Complaint filed"}</h1>
      <p className="filed-receipt">{result.human_id}</p>
      <Link className="app-button app-button--teal" to="/dashboard">{"Back to my complaints"}</Link>
    </div>;
  }

  if (draft) {
    return <div className="wizard-page">
      <h1>{"Check your complaint"}</h1>
      <dl>
        <div><dt>{"Ticket"}</dt><dd>{draft.human_id}</dd></div>
        <div><dt>{"Category"}</dt><dd>{draft.category ?? "Being identified"}</dd></div>
        <div><dt>{"Location"}</dt><dd>{draft.address ?? "Resolving address"}</dd></div>
        <div><dt>{"What you reported"}</dt><dd>{draft.issue_text}</dd></div>
      </dl>
      <button type="button" className="app-button app-button--orange"
        onClick={() => confirm.mutate()} disabled={confirm.isPending}>
        {confirm.isPending ? "Submitting…" : "Confirm and submit"}
      </button>
    </div>;
  }

  return <div className="wizard-page">
    <header className="wizard-header">
      <Link to="/dashboard" className="wizard-back" aria-label="Back to dashboard">‹</Link>
      <div><span>{"New complaint"}</span><h1>{"Report a civic issue"}</h1></div>
    </header>
    <form className="wizard-description" onSubmit={submit}>
      <button type="button" className="wizard-locate" onClick={locate} disabled={locating}>
        <span className="wizard-locate__icon" aria-hidden="true">⌖</span>
        {locating ? "Finding location…" : "Use my location"}
      </button>
      <div className="location-picker__coordinate-fields">
        <label>{"Latitude"}<input value={lat} onChange={(event) => setLat(event.target.value)} inputMode="decimal" required /></label>
        <label>{"Longitude"}<input value={lon} onChange={(event) => setLon(event.target.value)} inputMode="decimal" required /></label>
      </div>
      <label className="visually-hidden" htmlFor="complaint-description">{"Describe the issue"}</label>
      <textarea id="complaint-description" rows={7} maxLength={2000} value={description}
        placeholder={"Describe what is wrong, and how long it has been like this."}
        onChange={(event) => setDescription(event.target.value)} />
      <label className="wizard-landmark">
        <span>{"Nearby landmark (optional)"}</span>
        <input type="text" value={landmark} maxLength={160}
          onChange={(event) => setLandmark(event.target.value)} />
      </label>
      <button className="app-button app-button--orange" type="submit"
        disabled={create.isPending || !lat || !lon || !description.trim()}>
        {create.isPending ? "Filing…" : "File complaint"}
      </button>
      {error && <p className="app-error" role="alert">{error}</p>}
    </form>
  </div>;
}
