"""Data-access layer, split by domain (see individual submodules). Re-exported
here so callers use a single stable import surface: ``from jan_setu.repositories
import X`` regardless of which submodule ``X`` actually lives in.
"""

from jan_setu.repositories.contacts import get_contact, list_contacts, upsert_contact
from jan_setu.repositories.messages import (
    StoredIncomingMessage,
    claim_outbound,
    fetch_sweepable_outbound,
    list_messages,
    mark_outbound,
    store_incoming_messages,
    store_outgoing_message,
    store_outgoing_pending,
)
from jan_setu.repositories.webhook_events import (
    claim_event,
    fetch_unprocessed_event_ids,
    mark_event_processed,
    store_webhook_event,
)

__all__ = [
    "StoredIncomingMessage",
    "claim_event",
    "claim_outbound",
    "fetch_sweepable_outbound",
    "fetch_unprocessed_event_ids",
    "get_contact",
    "list_contacts",
    "list_messages",
    "mark_event_processed",
    "mark_outbound",
    "store_incoming_messages",
    "store_outgoing_message",
    "store_outgoing_pending",
    "store_webhook_event",
    "upsert_contact",
]
