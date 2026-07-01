"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, CheckCircle, LogOut, AlertTriangle } from "lucide-react";
import {
  statusStyles, statusLabels, urgencyStyles, urgencyLabels,
  stageStepMap, MATTER_STAGES, TOTAL_STAGES,
} from "@/lib/utils";
import type { IMatter, MatterStatus, MatterStage } from "@/types";

// Stages where release is not allowed
const BLOCKED_RELEASE_STAGES = ["hearing", "awaiting_judgment", "completed"];

type Tab = "active" | "completed";

export default function LawyerMattersPage() {
  const [matters, setMatters]     = useState<IMatter[]>([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState<Tab>("active");
  const [updating, setUpdating]   = useState<string | null>(null);
  const [releasing, setReleasing] = useState<string | null>(null); // matterId being released
  const [releaseReason, setReleaseReason] = useState("");
  const [releaseError, setReleaseError]   = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/matters?limit=100");
    const data = await res.json();
    setMatters(data.matters ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function updateStage(matterId: string, stage: MatterStage) {
    setUpdating(matterId);
    await fetch(`/api/matters/${matterId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    setUpdating(null);
    load();
  }

  async function markComplete(matterId: string) {
    setUpdating(matterId);
    await fetch(`/api/matters/${matterId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed", stage: "completed" }),
    });
    setUpdating(null);
    load();
  }

  async function releaseMatter(matterId: string) {
    setReleaseError("");
    if (releaseReason.trim().length < 20) {
      setReleaseError("Please provide at least 20 characters explaining why you are releasing this matter.");
      return;
    }

    setUpdating(matterId);
    const res  = await fetch(`/api/matters/${matterId}/release`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: releaseReason }),
    });
    const data = await res.json();
    setUpdating(null);

    if (!res.ok) {
      setReleaseError(data.error ?? "Failed to release matter.");
      return;
    }

    setReleasing(null);
    setReleaseReason("");
    setReleaseError("");
    load();
  }

  const active    = matters.filter(m => m.status !== "completed" && m.status !== "archived");
  const completed = matters.filter(m => m.status === "completed");
  const displayed = tab === "active" ? active : completed;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-medium">My matters</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {active.length} active · {completed.length} completed
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {([
          { key: "active",    label: `Active (${active.length})`       },
          { key: "completed", label: `Completed (${completed.length})` },
        ] as { key: Tab; label: string }[]).map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={"px-4 py-2 rounded-lg text-sm font-medium transition-all " +
              (tab === key
                ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800")}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-3">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading matters…
        </div>
      ) : displayed.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-sm text-gray-400">
            {tab === "active" ? "No active matters assigned to you." : "No completed matters yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((m) => {
            const stage      = m.stage as string;
            const step       = stageStepMap[m.stage as MatterStage] ?? 1;
            const isUpdating = updating === m._id;
            const isReleasing = releasing === m._id;
            const canRelease  = !BLOCKED_RELEASE_STAGES.includes(stage) && m.status !== "completed";

            return (
              <div key={m._id} className="card">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {m.client.firstName} {m.client.lastName}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                      <span className="font-mono">{m.referenceNumber}</span>
                      <span>·</span>
                      <span className="capitalize">{m.type.replace(/_/g, " ")}</span>
                      {m.client.state && <><span>·</span><span>{m.client.state}</span></>}
                    </div>
<<<<<<< HEAD

                    {/* Client contact — only shown for claimed (non-pool) matters */}
                    {tab !== "pool" && (
                      <div className="flex flex-wrap gap-3 mt-2">
                        <a
                          href={`mailto:${m.client.email}`}
                          className="inline-flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 hover:underline"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                          {m.client.email}
                        </a>
                        {m.client.phone && (
                          <a
                            href={`tel:${m.client.phone}`}
                            className="inline-flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 hover:underline"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.56 4.87 2 2 0 0 1 3.53 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6.06 6.06l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z" />
                            </svg>
                            {m.client.phone}
                          </a>
                        )}
                        {m.client.preferredLanguage &&
                          m.client.preferredLanguage !== "English" && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3.5 h-3.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="m5 8 6 6" />
                                <path d="m4 14 6-6 2-3" />
                                <path d="M2 5h12" />
                                <path d="M7 2h1" />
                                <path d="m22 22-5-10-5 10" />
                                <path d="M14 18h6" />
                              </svg>
                              Prefers {m.client.preferredLanguage}
                            </span>
                          )}
=======
                    {tab === "active" && (
                      <div className="flex flex-wrap gap-3 mt-2">
                        <a href={`mailto:${m.client.email}`}
                          className="inline-flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 hover:underline">
                          {m.client.email}
                        </a>
                        {m.client.phone && (
                          <a href={`tel:${m.client.phone}`}
                            className="inline-flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 hover:underline">
                            {m.client.phone}
                          </a>
                        )}
>>>>>>> c966f1b42a98fd6f6f6b0946b83d6b8ee057e57f
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {m.urgency !== "normal" && (
                      <span className={"badge text-xs " + urgencyStyles[m.urgency]}>
                        {urgencyLabels[m.urgency]}
                      </span>
                    )}
                    <span className={"badge text-xs " + statusStyles[m.status]}>
                      {statusLabels[m.status]}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed line-clamp-2">
                  {m.description}
                </p>

                {/* Active matter — progress + actions */}
                {tab === "active" && (
                  <>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <span>{MATTER_STAGES.find(s => s.value === stage)?.label ?? stage}</span>
                        <span>{step} / {TOTAL_STAGES}</span>
                      </div>
                      <div className="flex gap-1">
                        {MATTER_STAGES.map(({ value, step: s }) => (
                          <div key={value}
                            className={"flex-1 h-1.5 rounded-full " +
                              (s < step ? "bg-brand-600" : s === step ? "bg-brand-300" : "bg-gray-100 dark:bg-gray-800")} />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 shrink-0">Stage:</span>
                        <select className="input py-1 text-xs w-44" value={stage}
                          disabled={isUpdating}
                          onChange={(e) => updateStage(m._id, e.target.value as MatterStage)}>
                          {MATTER_STAGES.filter(s => s.value !== "completed").map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        {canRelease && (
                          <button
                            onClick={() => {
                              setReleasing(isReleasing ? null : m._id);
                              setReleaseError("");
                              setReleaseReason("");
                            }}
                            disabled={isUpdating}
                            className="btn text-xs gap-1.5 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <LogOut className="w-3.5 h-3.5" />
                            Release matter
                          </button>
                        )}
                        <button onClick={() => markComplete(m._id)} disabled={isUpdating}
                          className="btn btn-primary text-xs gap-1.5">
                          {isUpdating
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <CheckCircle className="w-3.5 h-3.5" />}
                          Mark complete
                        </button>
                      </div>
                    </div>

                    {/* Release confirmation panel */}
                    {isReleasing && (
                      <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <div className="flex items-start gap-2 mb-3">
                          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-300">
                              Release this matter back to the open pool?
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                              The matter will return to unassigned and another lawyer can claim it.
                              The client will be notified. This cannot be undone.
                            </p>
                          </div>
                        </div>
                        <textarea
                          className="input text-xs mb-2"
                          rows={3}
                          placeholder="Please explain why you are releasing this matter (min. 20 characters)..."
                          value={releaseReason}
                          onChange={(e) => setReleaseReason(e.target.value)}
                          maxLength={500}
                        />
                        {releaseError && (
                          <p className="text-xs text-red-600 dark:text-red-400 mb-2">{releaseError}</p>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => releaseMatter(m._id)}
                            disabled={isUpdating}
                            className="btn btn-danger text-xs gap-1.5 flex-1 justify-center">
                            {isUpdating
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <LogOut className="w-3.5 h-3.5" />}
                            Confirm release
                          </button>
                          <button
                            onClick={() => { setReleasing(null); setReleaseReason(""); setReleaseError(""); }}
                            className="btn text-xs">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {tab === "completed" && (
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700 dark:text-green-400 font-medium">Resolved</span>
                    <span className="text-xs text-gray-400 ml-auto">
                      Last updated {new Date(m.updatedAt).toLocaleDateString("en-NG", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
