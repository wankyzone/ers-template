"use client";

import { FormEvent, useEffect, useState } from "react";

type ErrandStatus = "pending" | "accepted" | "completed";

interface Errand {
  id: string;
  title: string;
  description?: string;
  status: ErrandStatus;
  createdAt: string;
}

export default function ErrandsPage() {
  const [errands, setErrands] = useState<Errand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const loadErrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:3000/errands");
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      const data = await res.json();
      setErrands(data);
    } catch (err: any) {
      setError(err.message || "Failed to load errands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadErrands();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setCreateError("Title is required");
      return;
    }

    try {
      setCreating(true);
      setCreateError(null);

      const res = await fetch("http://localhost:3000/errands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed to create errand: ${res.status}`);
      }

      // Option 1: re-fetch the list
      await loadErrands();

      // Clear form
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setCreateError(err.message || "Failed to create errand");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Errands</h1>

      {/* Create errand form */}
      <form onSubmit={handleCreate} className="space-y-3 border rounded-md p-4">
        <h2 className="text-lg font-medium">Create new errand</h2>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Title</label>
          <input
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Buy fuel in Lekki"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Client needs 20L delivered to Admiralty Way"
            rows={3}
          />
        </div>

        {createError && (
          <div className="text-sm text-red-500">{createError}</div>
        )}

        <button
          type="submit"
          className="px-4 py-2 rounded-md text-sm font-medium border bg-black text-white disabled:opacity-60"
          disabled={creating}
        >
          {creating ? "Creating..." : "Create errand"}
        </button>
      </form>

      {/* List */}
      {loading ? (
        <div>Loading errands...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : errands.length === 0 ? (
        <div>No errands yet.</div>
      ) : (
        <ul className="space-y-2">
          {errands.map((errand) => (
            <li
              key={errand.id}
              className="border rounded-md p-3 flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{errand.title}</div>
                {errand.description && (
                  <div className="text-sm text-gray-500">
                    {errand.description}
                  </div>
                )}
                <div className="text-xs text-gray-400">
                  {new Date(errand.createdAt).toLocaleString()}
                </div>
              </div>
              <span className="text-xs uppercase">{errand.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
