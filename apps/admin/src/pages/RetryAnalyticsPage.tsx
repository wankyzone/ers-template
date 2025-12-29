import React, { useState } from "react";
import { Button, Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui"; 


type ReplayProfile = "light" | "medium" | "heavy";

export const RetryAnalyticsPage: React.FC = () => {
  const [profile, setProfile] = useState<ReplayProfile>("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleReplayClick = async () => {
    setIsLoading(true);
    setStatusMsg(null);
    setErrorMsg(null);

    try {
      const resp = await fetch("/admin/replay-seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile }),
      });

      const json = await resp.json();

      if (!resp.ok || !json.ok) {
        throw new Error(json.error || "Replay failed");
      }

      setStatusMsg(
        `Replay triggered with "${profile}" profile. Charts will update as jobs flow.`
      );
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to trigger replay.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Control bar */}
      <div className="flex flex-wrap items-center gap-3 border-b pb-3 mb-4">
        <div className="font-semibold text-sm">
          Seed Traffic Profile (dev only)
        </div>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={profile}
          onChange={(e) =>
            setProfile(e.target.value as ReplayProfile)
          }
          disabled={isLoading}
        >
          <option value="light">Light (small, mostly success)</option>
          <option value="medium">Medium (realistic mix)</option>
          <option value="heavy">Heavy (high retries & DLQ)</option>
        </select>
        <button
          onClick={handleReplayClick}
          disabled={isLoading}
          className="px-3 py-1 text-sm rounded bg-emerald-600 text-white disabled:opacity-60"
        >
          {isLoading ? "Replaying..." : "Replay from seed"}
        </button>

        {statusMsg && (
          <span className="text-xs text-emerald-700 ml-2">
            {statusMsg}
          </span>
        )}
        {errorMsg && (
          <span className="text-xs text-red-600 ml-2">
            {errorMsg}
          </span>
        )}
      </div>

      {/* Existing Retry Analytics content below */}
      {/* <RetryAnalyticsCharts /> */}
      {/* <RetryByQueueTable /> */}
    </div>
  );
};
