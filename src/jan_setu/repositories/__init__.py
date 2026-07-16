"""Data-access layer, split by domain (see individual submodules). Re-exported
here so callers use a single stable import surface: ``from jan_setu.repositories
import X`` regardless of which submodule ``X`` actually lives in.
"""

from jan_setu.repositories.contacts import get_contact, list_contacts, upsert_contact

__all__ = [
    "get_contact",
    "list_contacts",
    "upsert_contact",
]
