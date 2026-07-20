from datetime import datetime
from typing import Any
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class ContactRead(BaseModel):
    id: UUID
    wa_id: str
    profile_name: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class MessageRead(BaseModel):
    id: UUID
    contact_id: UUID | None
    meta_message_id: str | None
    direction: str
    message_type: str
    text_body: str | None
    media_id: str | None
    media_mime_type: str | None
    location_latitude: float | None
    location_longitude: float | None
    location_name: str | None
    location_address: str | None
    location_url: str | None
    raw_payload: dict[str, Any]
    received_at: datetime
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class SendTextRequest(BaseModel):
    to: str = Field(min_length=5, max_length=32)
    body: str = Field(min_length=1, max_length=4096)

class SendTextResponse(BaseModel):
    provider_response: dict[str, Any]
    stored_message: MessageRead

class GrievanceEventRead(BaseModel):
    status: str
    note: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class GrievanceSummary(BaseModel):
    id: UUID
    human_id: str
    category: str | None
    status: str
    priority: str | None
    source: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class GrievanceDetail(GrievanceSummary):
    address: str | None
    issue_text: str | None
    department_key: str | None
    department_name: str | None
    term: str | None
    confidence: float | None
    image_match_status: str | None
    flags: list[Any]
    report_count: int
    dispatch_ref: str | None
    events: list[GrievanceEventRead]
    pdf_url: str | None
    category_id: str | None = None
    category_label: str | None = None
    domain_label: str | None = None
    safety_level: str | None = None
    asset_scope: str | None = None
    disposition: str | None = None
    review_status: str | None = None
    source_language: str | None = None
    transcript_metadata: list[dict[str, Any]] = Field(default_factory=list)
    structured_facts: dict[str, Any] | None = None
    routing: dict[str, Any] | None = None
