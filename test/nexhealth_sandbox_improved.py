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
from typing import Optional, Dict, List, Any

import requests

from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Configuration defaults - override via env vars or pass to NexHealthClient
# ---------------------------------------------------------------------------
DEFAULT_BASE_URL = "https://nexhealth.info"
DEFAULT_API_VERSION = "v20240412"


def pp(label: str, data: Any, indent: int = 2) -> None:
    """Pretty-print a labeled JSON block."""
    print(f"\n{'='*60}")
    print(f"  {label}")
    print("=" * 60)
    print(json.dumps(data, indent=indent, default=str))


def normalize_response_data(data: Dict[str, Any], key: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Normalize API response to extract the actual data array.
    
    Args:
        data: The response dict from check()
        key: Optional specific key to look for (e.g., 'patients', 'appointments')
    
    Returns:
        List of items, empty list if none found
    """
    if not isinstance(data, dict):
        return []
    
    raw_data = data.get("data")
    
    if isinstance(raw_data, list):
        return raw_data
    elif isinstance(raw_data, dict):
        if key and key in raw_data:
            return raw_data.get(key, [])
        # Try to find any list value in the dict
        for value in raw_data.values():
            if isinstance(value, list):
                return value
    
    return []


class NexHealthClient:
    """
    Centralized API client for NexHealth API interactions.
    Handles authentication, request management, and common parameters.
    """
    
    def __init__(self, api_key: str, subdomain: str, location_id: str, 
                 base_url: str = DEFAULT_BASE_URL, api_version: str = DEFAULT_API_VERSION) -> None:
        """
        Initialize the NexHealth API client.
        
        Args:
            api_key: NexHealth API key
            subdomain: Organization subdomain
            location_id: Default location ID for requests
            base_url: API base URL (default: https://nexhealth.info)
            api_version: API version to use (default: v20240412)
        """
        self.api_key: str = api_key
        self.subdomain: str = subdomain
        self.location_id: str = location_id
        self.base_url: str = base_url
        self.api_version: str = api_version
        self.token: Optional[str] = None
    
    def _headers(self) -> Dict[str, str]:
        """Build headers with authentication."""
        h = {"Nex-Api-Version": self.api_version}
        if self.token:
            h["Authorization"] = f"Bearer {self.token}"
        else:
            h["Authorization"] = self.api_key
        return h
    
    def _base_params(self) -> Dict[str, str]:
        """Common parameters for most requests."""
        return {
            "subdomain": self.subdomain,
            "location_id": self.location_id
        }
    
    def _request(self, method: str, endpoint: str, params: Optional[Dict[str, Any]] = None, **kwargs: Any) -> Dict[str, Any]:
        """
        Make an API request with error handling.
        
        Args:
            method: HTTP method (GET, POST, etc.)
            endpoint: API endpoint (without leading slash)
            params: Query parameters
            **kwargs: Additional arguments to pass to requests
        
        Returns:
            Parsed response data
        """
        url = f"{self.base_url}/{endpoint}"
        try:
            response = requests.request(
                method, url,
                headers=self._headers(),
                params=params,
                timeout=30,
                **kwargs
            )
            return check(response, f"{method.upper()} /{endpoint}")
        except requests.RequestException as e:
            print(f"  Request failed: {e}")
            return {}
    
    def authenticate(self) -> str:
        """Authenticate and store token."""
        print("\n--- Authenticating ---")
        data = self._request("POST", "authenticates")
        token = data.get("data", {}).get("token")
        if not token:
            print("  No token in response. Full response:")
            pp("Response", data)
            sys.exit(1)
        
        # Decode JWT expiration time
        exp = datetime.fromtimestamp(
            json.loads(
                __import__("base64").b64decode(token.split(".")[1] + "==").decode()
            ).get("exp", 0)
        ).strftime("%H:%M:%S")
        print(f"  Token acquired. Expires at {exp} local time.")
        
        self.token = token
        return token
    
    def check_institution(self) -> Dict[str, Any]:
        """Get institution and location information."""
        print("\n--- Institution / Location ---")
        data = self._request("GET", "institutions", params={"subdomain": self.subdomain})
        institutions = normalize_response_data(data, key="institutions")
        
        if not institutions:
            print("  No institutions found for this subdomain.")
        else:
            for inst in institutions:
                print(f"  Institution: {inst.get('name')} (id={inst.get('id')})")
                for loc in inst.get("locations", []):
                    print(f"    Location: {loc.get('name')} (id={loc.get('id')})")
        return data
    
    def list_patients(self, per_page: int = 5) -> List[Dict[str, Any]]:
        """List patients with pagination."""
        print("\n--- Patients ---")
        params = {
            **self._base_params(),
            "new_patient": "false",
            "include_upcoming_appts": "false",
            "location_strict": "false",
            "page": 1,
            "per_page": per_page,
        }
        data = self._request("GET", "patients", params=params)
        patients = normalize_response_data(data, key="patients")
        
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
    
    def get_patient(self, patient_id: str) -> Dict[str, Any]:
        """Get detailed patient information."""
        print(f"\n--- Patient detail (id={patient_id}) ---")
        data = self._request("GET", f"patients/{patient_id}", params=self._base_params())
        d = data if isinstance(data, dict) else {}
        pp("Patient record", d.get("data", data or {}))
        return data
    
    def list_appointments(self, per_page: int = 5) -> List[Dict[str, Any]]:
        """List appointments with pagination."""
        print("\n--- Appointments ---")
        from datetime import timedelta, timezone
        
        # Appointments endpoint requires start and end parameters
        start = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S+0000")
        end = (datetime.now(timezone.utc) + timedelta(days=30)).strftime(
            "%Y-%m-%dT%H:%M:%S+0000"
        )
        
        params = {
            **self._base_params(),
            "start": start,
            "end": end,
            "page": 1,
            "per_page": per_page,
        }
        data = self._request("GET", "appointments", params=params)
        appts = normalize_response_data(data, key="appointments")
        
        total = data.get("count", "?")
        print(f"  Total: {total}  |  Showing: {len(appts)}")
        for a in appts:
            print(
                f"    id={a.get('id')}  "
                f"patient_id={a.get('patient_id')}  "
                f"start={a.get('start_time', 'n/a')}  "
                f"status={a.get('did_not_come', 'n/a')}"
            )
        return appts
    
    def list_providers(self) -> List[Dict[str, Any]]:
        """List all providers."""
        print("\n--- Providers ---")
        data = self._request("GET", "providers", params=self._base_params())
        providers = normalize_response_data(data, key="providers")
        
        print(f"  Found: {len(providers)}")
        for p in providers:
            name = f"{p.get('first_name', '')} {p.get('last_name', '')}".strip()
            print(f"    id={p.get('id')}  name={name}  npi={p.get('npi', 'n/a')}")
        return providers
    
    def list_appointment_types(self) -> List[Dict[str, Any]]:
        """List all appointment types."""
        print("\n--- Appointment Types ---")
        data = self._request("GET", "appointment_types", params=self._base_params())
        types = normalize_response_data(data, key="appointment_types")
        
        print(f"  Found: {len(types)}")
        for t in types:
            print(
                f"    id={t.get('id')}  name={t.get('name')}  duration={t.get('duration')}min"
            )
        return types
    
    def list_available_slots(self, provider_id: Optional[str] = None, appt_type_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """List available appointment slots."""
        print("\n--- Available Slots (next 7 days) ---")
        from datetime import timezone
        
        start = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        params = {
            "subdomain": self.subdomain,
            "lids[]": self.location_id,  # Required: array of location IDs
            "start_date": start,
            "days": 7,  # Required: number of days
        }
        if provider_id:
            params["pids[]"] = provider_id  # Use pids[] for provider IDs array
        if appt_type_id:
            params["appointment_type_id"] = appt_type_id
        
        data = self._request("GET", "available_slots", params=params)
        slot_responses = normalize_response_data(data, key="available_slots")
        
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


def check(response: requests.Response, label: str) -> Dict[str, Any]:
    """
    Centralized error handling for API responses.
    Prints status and returns parsed JSON with helpful error details.
    """
    status = response.status_code
    print(f"  [{status}] {label}")
    
    # Handle HTTP errors with detailed messages
    if status == 401:
        print(f"  ❌ Authentication failed - check your API key and subdomain")
        sys.exit(1)
    elif status == 404:
        print(f"  ❌ Not found - endpoint or resource doesn't exist")
        try:
            error_detail = response.json()
            print(f"  Details: {error_detail}")
        except:
            pass
        return {}
    elif status == 429:
        retry_after = response.headers.get("Retry-After", "unknown")
        print(f"  ❌ Rate limit exceeded - retry after {retry_after}s")
        return {}
    elif status == 400:
        print(f"  ❌ Bad request - invalid parameters or data")
        try:
            error_detail = response.json()
            print(f"  Details: {error_detail}")
        except:
            print(f"  Details: {response.text[:200]}")
        return {}
    elif 500 <= status < 600:
        print(f"  ❌ Server error ({status}) - API may be down or having issues")
        print(f"  Details: {response.text[:200]}")
        return {}
    elif not response.ok:
        print(f"  ❌ Request failed with status {status}")
        print(f"  Details: {response.text[:200]}")
        return {}
    
    # Parse successful JSON response
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
    except Exception as e:
        print(f"  ⚠️  Could not parse JSON response: {e}")
        print(f"  Raw response: {response.text[:300]}")
        return {}


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
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

    # Load configuration from environment variables
    api_key = os.getenv("NEXHEALTH_API_KEY", "YOUR_API_KEY_HERE")
    subdomain = os.getenv("NEXHEALTH_SUBDOMAIN", "YOUR_SUBDOMAIN_HERE")
    location_id = os.getenv("NEXHEALTH_LOCATION_ID", "YOUR_LOCATION_ID_HERE")

    # Validate configuration
    if "YOUR_API_KEY" in api_key or "YOUR_SUBDOMAIN" in subdomain or "YOUR_LOCATION" in location_id:
        print("Error: Missing required configuration")
        print("Set environment variables: NEXHEALTH_API_KEY, NEXHEALTH_SUBDOMAIN, NEXHEALTH_LOCATION_ID")
        print("or create a .env file with these values")
        sys.exit(1)

    # Initialize the API client
    client = NexHealthClient(api_key, subdomain, location_id)
    
    # Authenticate and get token
    client.authenticate()
    providers = []

    if args.only in ("all",):
        client.check_institution()

    if args.only in ("patients", "all"):
        patients = client.list_patients(per_page=5)
        if args.patient_detail:
            client.get_patient(args.patient_detail)
        elif patients:
            # auto-drill into the first patient as a demo
            client.get_patient(patients[0]["id"])

    if args.only in ("appointments", "all"):
        client.list_appointments(per_page=5)

    if args.only in ("providers", "all"):
        providers = client.list_providers()

    if args.only in ("slots", "all"):
        # reuse first provider from above if we have one
        pid = providers[0]["id"] if args.only == "all" and providers else None
        client.list_available_slots(provider_id=pid)

    print("\nDone.\n")


if __name__ == "__main__":
    main()
