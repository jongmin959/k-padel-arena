// Bridges the window.storage.{get,set,delete} calls already used
// throughout PadelLeagueApp.jsx to our /api/kv route, which is backed
// by a shared Upstash Redis store. This runs at module-import time
// (not inside a React effect) so it's guaranteed to exist before
// PadelLeagueApp's own on-mount effects call window.storage.get(...).
//
// The `shared` flag from the original artifact-storage API is ignored
// on purpose: every visitor to this site should see the same live
// data (bookings, league, members) — that's the whole point of moving
// this off per-browser storage.

if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      const res = await fetch(`/api/kv?key=${encodeURIComponent(key)}`);
      if (res.status === 404) {
        throw new Error("not found");
      }
      if (!res.ok) {
        throw new Error("storage get failed");
      }
      const data = await res.json();
      return { key, value: data.value, shared: false };
    },

    async set(key, value) {
      const res = await fetch("/api/kv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (!res.ok) return null;
      return { key, value, shared: false };
    },

    async delete(key) {
      const res = await fetch(`/api/kv?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
      });
      if (!res.ok) return null;
      return { key, deleted: true, shared: false };
    },

    async list() {
      // Not used by PadelLeagueApp today; included for API-shape parity.
      throw new Error("list() is not implemented in this deployment");
    },
  };
}
