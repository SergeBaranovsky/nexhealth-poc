#!/usr/bin/env python3
"""
NexHealth Sandbox Explorer
Tests the main read endpoints against your developer sandbox.

Usage:
    Set your credentials below (or via env vars), then:
    python nexhealth_sandbox.py

    To run a specific section only:
    python nexhealth_sandbox.py --only patients
    python nexhealth_sandbox.py --only appointments
    python nexhealth_sandbox.py --only providers
    python nexhealth_sandbox.py --only all  (default)
"""

import os
import sys
import json
import argparse
from datetime import datetime

import requests

from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# CONFIGURE THESE - or set as env vars NEXHEALTH_API_KEY / NEXHEALTH_SUBDOMAIN
# ---------------------------------------------------------------------------
API_KEY = os.getenv("NEXHEALTH_API_KEY", "YOUR_API_KEY_HERE")
SUBDOMAIN = os.getenv("NEXHEALTH_SUBDOMAIN", "YOUR_SUBDOMAIN_HERE")
# Location ID is shown in your developer portal under Test > Institutions
LOCATION_ID = os.getenv("NEXHEALTH_LOCATION_ID", "YOUR_LOCATION_ID_HERE")
# ---------------------------------------------------------------------------

BASE_URL = "https://nexhealth.info"
API_VERSION = "v20240412"


def headers(token=None):
    h = {"Nex-Api-Version": API_VERSION}
    if token:
        h["Authorization"] = f"Bearer {token}"
    else:
        h["Authorization"] = API_KEY
    return h


def pp(label, data, indent=2):
    """Pretty-print a labeled JSON block."""
    print(f"\n{'='*60}")
    print(f"  {label}")
    print("=" * 60)
    print(json.dumps(data, indent=indent, default=str))


def check(response, label):
    """Print status and return parsed JSON. Exits on auth failure."""
    print(f"  [{response.status_code}] {label}")
    if response.status_code == 401:
        print("  Auth failed - check your API key and subdomain.")
        sys.exit(1)
    try:
        d = response.json()
        # Normalize common sandbox shapes: lists -> {'data': [...], 'count': n}
        if isinstance(d, list):
            return {"data": d, "count": len(d)}
        # Some endpoints may return `null` -> map to empty dict
        if d is None:
            return {}
        # Otherwise assume a dict-like envelope or value and return as-is
        return d
    except Exception:
        print(f"  Non-JSON response: {response.text[:300]}")
        return {}


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------


def authenticate():
    print("\n--- Authenticating ---")
    r = requests.post(f"{BASE_URL}/authenticates", headers=headers())
    data = check(r, "POST /authenticates")
    token = data.get("data", {}).get("token")
    if not token:
        print("  No token in response. Full response:")
        pp("Response", data)
        sys.exit(1)
    exp = datetime.fromtimestamp(
        # token is a JWT; decode the payload without a library
        json.loads(
            __import__("base64").b64decode(token.split(".")[1] + "==").decode()
        ).get("exp", 0)
    ).strftime("%H:%M:%S")
    print(f"  Token acquired. Expires at {exp} local time.")
    return token


# ---------------------------------------------------------------------------
# Institution / location sanity check
# ---------------------------------------------------------------------------


def check_institution(token):
    print("\n--- Institution / Location ---")
    r = requests.get(
        f"{BASE_URL}/institutions",
        headers=headers(token),
        params={"subdomain": SUBDOMAIN},
    )
    data = check(r, "GET /institutions")
    d = data if isinstance(data, dict) else {}
    raw_data = d.get("data")

    if isinstance(raw_data, list):
        institutions = raw_data
    elif isinstance(raw_data, dict):
        institutions = raw_data.get("institutions", [])
    else:
        institutions = []

    if not institutions:
        print("  No institutions found for this subdomain.")
    else:
        for inst in institutions:
            print(f"  Institution: {inst.get('name')} (id={inst.get('id')})")
            for loc in inst.get("locations", []):
                print(f"    Location: {loc.get('name')} (id={loc.get('id')})")
    return data


# ---------------------------------------------------------------------------
# Patients
# ---------------------------------------------------------------------------


def list_patients(token, per_page=5):
    print("\n--- Patients ---")
    r = requests.get(
        f"{BASE_URL}/patients",
        headers=headers(token),
        params={
            "subdomain": SUBDOMAIN,
            "location_id": LOCATION_ID,
            "new_patient": "false",
            "include_upcoming_appts": "false",
            "location_strict": "false",
            "page": 1,
            "per_page": per_page,
        },
    )
    data = check(r, f"GET /patients (first {per_page})")

    # debug: show raw shape so we can fix any remaining assumptions
    d = data if isinstance(data, dict) else {}
    raw_data = d.get("data")
    print(
        f"  DEBUG data type: {type(raw_data).__name__}  keys/len: {list(raw_data.keys()) if isinstance(raw_data, dict) else len(raw_data) if isinstance(raw_data, list) else raw_data}"
    )

    if isinstance(raw_data, list):
        patients = raw_data
    elif isinstance(raw_data, dict):
        patients = raw_data.get("patients", [])
    else:
        patients = []

    total = data.get("count", "?")
    print(f"  Total in sandbox: {total}  |  Showing: {len(patients)}")
    for p in patients:
        dob = (
            p.get("bio", {}).get("date_of_birth", "n/a")
            if isinstance(p.get("bio"), dict)
            else "n/a"
        )
        name = f"{p.get('first_name', '')} {p.get('last_name', '')}".strip()
        print(f"    id={p['id']}  name={name}  dob={dob}  inactive={p.get('inactive')}")
    return patients


def get_patient(token, patient_id):
    print(f"\n--- Patient detail (id={patient_id}) ---")
    r = requests.get(
        f"{BASE_URL}/patients/{patient_id}",
        headers=headers(token),
        params={"subdomain": SUBDOMAIN, "location_id": LOCATION_ID},
    )
    data = check(r, f"GET /patients/{patient_id}")
    d = data if isinstance(data, dict) else {}
    pp("Patient record", d.get("data", data or {}))
    return data


# ---------------------------------------------------------------------------
# Appointments
# ---------------------------------------------------------------------------


def list_appointments(token, per_page=5):
    print("\n--- Appointments ---")
    from datetime import timedelta, timezone

    # Appointments endpoint requires start and end parameters
    start = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S+0000")
    end = (datetime.now(timezone.utc) + timedelta(days=30)).strftime(
        "%Y-%m-%dT%H:%M:%S+0000"
    )

    r = requests.get(
        f"{BASE_URL}/appointments",
        headers=headers(token),
        params={
            "subdomain": SUBDOMAIN,
            "location_id": LOCATION_ID,
            "start": start,
            "end": end,
            "page": 1,
            "per_page": per_page,
        },
    )
    data = check(r, f"GET /appointments (first {per_page})")
    d = data if isinstance(data, dict) else {}
    raw_data = d.get("data")

    if isinstance(raw_data, list):
        appts = raw_data
    elif isinstance(raw_data, dict):
        appts = raw_data.get("appointments", [])
    else:
        appts = []

    total = d.get("count", "?")
    print(f"  Total: {total}  |  Showing: {len(appts)}")
    for a in appts:
        print(
            f"    id={a.get('id')}  "
            f"patient_id={a.get('patient_id')}  "
            f"start={a.get('start_time', 'n/a')}  "
            f"status={a.get('did_not_come', 'n/a')}"
        )
    return appts


# ---------------------------------------------------------------------------
# Providers
# ---------------------------------------------------------------------------


def list_providers(token):
    print("\n--- Providers ---")
    r = requests.get(
        f"{BASE_URL}/providers",
        headers=headers(token),
        params={"subdomain": SUBDOMAIN, "location_id": LOCATION_ID},
    )
    data = check(r, "GET /providers")
    d = data if isinstance(data, dict) else {}
    raw_data = d.get("data")

    if isinstance(raw_data, list):
        providers = raw_data
    elif isinstance(raw_data, dict):
        providers = raw_data.get("providers", [])
    else:
        providers = []

    print(f"  Found: {len(providers)}")
    for p in providers:
        name = f"{p.get('first_name', '')} {p.get('last_name', '')}".strip()
        print(f"    id={p.get('id')}  name={name}  npi={p.get('npi', 'n/a')}")
    return providers


# ---------------------------------------------------------------------------
# Appointment types
# ---------------------------------------------------------------------------


def list_appointment_types(token):
    print("\n--- Appointment Types ---")
    r = requests.get(
        f"{BASE_URL}/appointment_types",
        headers=headers(token),
        params={"subdomain": SUBDOMAIN, "location_id": LOCATION_ID},
    )
    data = check(r, "GET /appointment_types")
    d = data if isinstance(data, dict) else {}
    raw_data = d.get("data")

    if isinstance(raw_data, list):
        types = raw_data
    elif isinstance(raw_data, dict):
        types = raw_data.get("appointment_types", [])
    else:
        types = []

    print(f"  Found: {len(types)}")
    for t in types:
        print(
            f"    id={t.get('id')}  name={t.get('name')}  duration={t.get('duration')}min"
        )
    return types


# ---------------------------------------------------------------------------
# Available slots (read-only, no booking)
# ---------------------------------------------------------------------------


def list_available_slots(token, provider_id=None, appt_type_id=None):
    print("\n--- Available Slots (next 7 days) ---")
    from datetime import timezone

    start = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    params = {
        "subdomain": SUBDOMAIN,
        "lids[]": LOCATION_ID,  # Required: array of location IDs
        "start_date": start,
        "days": 7,  # Required: number of days
    }
    if provider_id:
        params["pids[]"] = provider_id  # Use pids[] for provider IDs array
    if appt_type_id:
        params["appointment_type_id"] = appt_type_id

    r = requests.get(
        f"{BASE_URL}/available_slots", headers=headers(token), params=params
    )
    data = check(r, "GET /available_slots")
    d = data if isinstance(data, dict) else {}
    raw_data = d.get("data")

    if isinstance(raw_data, list):
        slot_responses = raw_data
    elif isinstance(raw_data, dict):
        slot_responses = raw_data.get("available_slots", [])
    else:
        slot_responses = []

    # The API returns an array of objects with lid, pid, and slots array
    total_slots = 0
    all_slots = []
    for resp in slot_responses:
        slots = resp.get("slots", [])
        total_slots += len(slots)
        all_slots.extend([(resp.get("lid"), resp.get("pid"), s) for s in slots])

    print(f"  Slots returned: {total_slots}")
    for lid, pid, s in all_slots[:5]:
        print(
            f"    {s.get('time')}  location={lid}  provider={pid or s.get('provider_id')}  operatory={s.get('operatory_id')}"
        )
    if total_slots > 5:
        print(f"    ... and {total_slots-5} more")
    return slot_responses


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(description="NexHealth sandbox explorer")
    parser.add_argument(
        "--only",
        choices=["patients", "appointments", "providers", "slots", "all"],
        default="all",
        help="Which section to run",
    )
    parser.add_argument(
        "--patient-detail",
        metavar="ID",
        help="Fetch and print full detail for a specific patient ID",
    )
    args = parser.parse_args()

    if "YOUR_API_KEY" in API_KEY:
        print("Set API_KEY, SUBDOMAIN, and LOCATION_ID at the top of the script")
        print(
            "or via env vars: NEXHEALTH_API_KEY, NEXHEALTH_SUBDOMAIN, NEXHEALTH_LOCATION_ID"
        )
        sys.exit(1)

    token = authenticate()
    providers = []

    if args.only in ("all",):
        check_institution(token)

    if args.only in ("patients", "all"):
        patients = list_patients(token, per_page=5)
        if args.patient_detail:
            get_patient(token, args.patient_detail)
        elif patients:
            # auto-drill into the first patient as a demo
            get_patient(token, patients[0]["id"])

    if args.only in ("appointments", "all"):
        list_appointments(token, per_page=5)

    if args.only in ("providers", "all"):
        providers = list_providers(token)

    if args.only in ("slots", "all"):
        # reuse first provider from above if we have one
        pid = providers[0]["id"] if args.only == "all" and providers else None
        list_available_slots(token, provider_id=pid)

    print("\nDone.\n")


if __name__ == "__main__":
    main()
