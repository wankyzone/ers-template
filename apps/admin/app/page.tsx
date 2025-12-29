"use client";

import React, { useEffect, useState, FormEvent } from "react";

type Errand = {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
};

const BACKEND_URL = "http://localhost:3000";

export default function AdminDashboard() {
  const [errands, setErrands] = useState<Errand[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const loadErrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND_URL}/errands`);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();
      setErrands(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load errands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadErrands();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setCreating(true);
      setError(null);

      const res = await fetch(`${BACKEND_URL}/errands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed to create errand: ${res.status}`);
      }

      const created = await res.json();

      // Prepend new errand to list
      setErrands((prev) => [created, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setError(err?.message || "Failed to create errand");
    } finally {
      setCreating(false);
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
        ERS Admin – Errands
      </h1>

      {/* Create Errand Form */}
      <form
        onSubmit={handleCreate}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 400,
          marginBottom: 24,
          padding: 16,
          borderRadius: 8,
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ fontSize: 18, marginBottom: 4 }}>Create new errand</h2>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          disabled={creating || !title.trim()}
          style={{
            padding: "8px 12px",
            borderRadius: 4,
            border: "none",
            backgroundColor: creating ? "#999" : "#111827",
            color: "#fff",
            cursor: creating || !title.trim() ? "not-allowed" : "pointer",
          }}
        >
          {creating ? "Creating..." : "Create errand"}
        </button>
      </form>

      {loading && <p>Loading errands…</p>}
      {error && (
        <p style={{ color: "red", marginBottom: 12 }}>Error: {error}</p>
      )}

      {!loading && errands.length === 0 && <p>No errands yet.</p>}

      {!loading && errands.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {errands.map((errand) => (
            <div
              key={errand.id}
              style={{
                padding: 12,
                borderRadius: 8,
                border: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 8,
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>{errand.title}</div>
                {errand.description && (
                  <div style={{ fontSize: 14, color: "#555" }}>
                    {errand.description}
                  </div>
                )}
                <div style={{ fontSize: 12, color: "#999" }}>
                  {new Date(errand.createdAt).toLocaleString()}
                </div>
              </div>
              <span
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {errand.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
