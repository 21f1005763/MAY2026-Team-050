"""Schema-validated civic evidence extraction through OpenRouter free models."""

import json
import logging
import re
from dataclasses import dataclass, field
from typing import Any
from jan_setu.pipeline.taxonomy import (
    CANONICAL_CATEGORIES,
    CATEGORIES,
    canonical_category_key,
    category_or_default,
)


logger = logging.getLogger(__name__)

PROMPT_VERSION = "civic-extract-2026-07-v2"

EXTRACTION_VERSION = "2"

EXTRACTION_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "summary": {"type": "string", "maxLength": 600},
        "category_id": {"type": "string", "enum": list(CANONICAL_CATEGORIES)},
        "alternative_category_ids": {
            "type": "array",
            "items": {"type": "string", "enum": list(CANONICAL_CATEGORIES)},
            "maxItems": 3,
        },
        "confidence": {"type": "number", "minimum": 0, "maximum": 1},
        "asset_scope": {"type": "string", "enum": ["public", "private", "unknown"]},
        "owner_hint": {
            "type": "string",
            "enum": [
                "ulb",
                "water_utility",
                "discom",
                "state_road",
                "national_highway",
                "railway",
                "development_authority",
                "police",
                "health",
                "private",
                "unknown",
            ],
        },
        "safety": {"type": "string", "enum": ["none", "possible", "immediate"]},
        "requested_action": {"type": ["string", "null"]},
        "landmark": {"type": ["string", "null"]},
        "incident_time": {"type": ["string", "null"]},
        "missing_facts": {"type": "array", "items": {"type": "string"}, "maxItems": 5},
        "clarification_question": {"type": ["string", "null"]},
        "evidence": {"type": "array", "items": {"type": "string"}, "maxItems": 8},
        "image_observations": {"type": "array", "items": {"type": "string"}, "maxItems": 8},
        "contradictions": {"type": "array", "items": {"type": "string"}, "maxItems": 5},
        "multiple_issues": {"type": "boolean"},
    },
    "required": [
        "summary",
        "category_id",
        "alternative_category_ids",
        "confidence",
        "asset_scope",
        "owner_hint",
        "safety",
        "requested_action",
        "landmark",
        "incident_time",
        "missing_facts",
        "clarification_question",
        "evidence",
        "image_observations",
        "contradictions",
        "multiple_issues",
    ],
    "additionalProperties": False,
}

@dataclass(frozen=True)
class StructuredExtraction:
    summary: str
    category_id: str
    alternatives: tuple[str, ...]
    confidence: float
    asset_scope: str
    owner_hint: str
    safety: str
    requested_action: str | None = None
    landmark: str | None = None
    incident_time: str | None = None
    missing_facts: tuple[str, ...] = ()
    clarification_question: str | None = None
    evidence: tuple[str, ...] = ()
    image_observations: tuple[str, ...] = ()
    contradictions: tuple[str, ...] = ()
    multiple_issues: bool = False
    degraded: bool = False
    degradation_reason: str | None = None
    actual_model: str | None = None
    actual_provider: str | None = None
    latency_ms: int | None = None
    requested_models: tuple[str, ...] = ()
    raw: dict[str, Any] | None = field(default=None, compare=False)

@dataclass(frozen=True)
class Classification:
    category: str
    priority: str
    term: str
    confidence: float
    reasoning: str | None = None
    degraded: bool = False

@dataclass(frozen=True)
class ImageMatch:
    matches: bool
    confidence: float
    note: str | None = None
    degraded: bool = False

def _extract_json(text: str) -> dict[str, Any] | None:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return None
    try:
        value = json.loads(match.group(0))
    except json.JSONDecodeError:
        return None
    return value if isinstance(value, dict) else None

def _bounded_confidence(value: Any, default: float = 0.0) -> float:
    try:
        return max(0.0, min(1.0, float(value)))
    except (TypeError, ValueError):
        return default

def parse_extraction(raw_text: str) -> StructuredExtraction | None:
    data = _extract_json(raw_text)
    if not data:
        return None
    category_id = canonical_category_key(data.get("category_id") or data.get("category"))
    if category_id not in CANONICAL_CATEGORIES:
        return None
    asset_scope = data.get("asset_scope", "unknown")
    owner_hint = data.get("owner_hint", "unknown")
    safety = data.get("safety", "none")
    if asset_scope not in ("public", "private", "unknown"):
        asset_scope = "unknown"
    if owner_hint not in {
        "ulb",
        "water_utility",
        "discom",
        "state_road",
        "national_highway",
        "railway",
        "development_authority",
        "police",
        "health",
        "private",
        "unknown",
    }:
        owner_hint = "unknown"
    if safety not in ("none", "possible", "immediate"):
        safety = "possible"
    alternatives = tuple(
        value
        for value in (
            canonical_category_key(item) for item in data.get("alternative_category_ids", [])
        )
        if value in CANONICAL_CATEGORIES and value != category_id
    )[:3]
    return StructuredExtraction(
        summary=str(data.get("summary") or "").strip()[:600],
        category_id=category_id,
        alternatives=alternatives,
        confidence=_bounded_confidence(data.get("confidence")),
        asset_scope=asset_scope,
        owner_hint=owner_hint,
        safety=safety,
        requested_action=data.get("requested_action"),
        landmark=data.get("landmark"),
        incident_time=data.get("incident_time"),
        missing_facts=tuple(map(str, data.get("missing_facts", [])))[:5],
        clarification_question=data.get("clarification_question"),
        evidence=tuple(map(str, data.get("evidence", [])))[:8],
        image_observations=tuple(map(str, data.get("image_observations", [])))[:8],
        contradictions=tuple(map(str, data.get("contradictions", [])))[:5],
        multiple_issues=bool(data.get("multiple_issues", False)),
        raw=data,
    )

def parse_classification(raw_text: str) -> Classification | None:
    data = _extract_json(raw_text)
    if not data:
        return None
    raw_category = data.get("category")
    canonical = canonical_category_key(raw_category)
    if canonical is None:
        return None
    category = raw_category if raw_category in CATEGORIES else canonical
    default = category_or_default(canonical)
    priority = (
        data.get("priority")
        if data.get("priority") in ("priority", "normal")
        else default.default_priority
    )
    term = (
        data.get("term") if data.get("term") in ("short_term", "long_term") else default.term_hint
    )
    return Classification(
        category,
        priority,
        term,
        _bounded_confidence(data.get("confidence"), 0.5),
        data.get("reasoning"),
    )

def parse_image_match(raw_text: str) -> ImageMatch | None:
    data = _extract_json(raw_text)
    if not data or "matches" not in data:
        return None
    return ImageMatch(
        bool(data["matches"]), _bounded_confidence(data.get("confidence"), 0.5), data.get("note")
    )
