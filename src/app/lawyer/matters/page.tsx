"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import {
  statusStyles,
  statusLabels,
  urgencyStyles,
  urgencyLabels,
  stageStepMap,
  MATTER_STAGES,
  TOTAL_STAGES,
} from "@/lib/utils";
import type { IMatter, MatterStatus, MatterStage } from "@/types";

type Tab = "active" | "pool" | "completed";

export default function LawyerMattersPage() {
  const [matters, setMatters] = useState<IMatter[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("active");
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/matters?limit=100");
    const data = await res.json();
    setMatters(data.matters ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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

  async function claimMatter(matterId: string) {
    setUpdating(matterId);
    await fetch(`/api/matters/${matterId}/claim`, { method: "POST" });
    setUpdating(null);
    load();
  }

  const myMatters = matters.filter(
    (m) =>
      m.status !== "unassigned" &&
      m.status !== "completed" &&
      m.status !== "archived",
  );
  const openPool = matters.filter((m) => m.status === "unassigned");
  const completed = matters.filter((m) => m.status === "completed");

  const displayed =
    tab === "active" ? myMatters : tab === "pool" ? openPool : completed;

  const emptyMessage =
    tab === "active"
      ? "No active matters assigned to you."
      : tab === "pool"
        ? "No open matters available right now."
        : "No completed matters yet.";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-medium">My matters</h1>
        <p className="text-sm text-gray-500 mt-1">
          {myMatters.length} active · {openPool.length} open ·{" "}
          {completed.length} completed
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(
          [
            { key: "active", label: `My matters (${myMatters.length})` },
            { key: "pool", label: `Open pool (${openPool.length})` },
            { key: "completed", label: `Completed (${completed.length})` },
          ] as { key: Tab; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={
              "px-4 py-2 rounded-lg text-sm font-medium transition-all " +
              (tab === key
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50")
            }
          >
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
          <p className="text-sm text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((m) => {
            const stage = m.stage as string;
            const step = stageStepMap[stage] ?? 1;
            const isUpdating = updating === m._id;

            return (
              <div key={m._id} className="card">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {m.client.firstName} {m.client.lastName}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                      <span className="font-mono">{m.referenceNumber}</span>
                      <span>·</span>
                      <span className="capitalize">
                        {m.type.replace(/_/g, " ")}
                      </span>
                      {m.client.state && (
                        <>
                          <span>·</span>
                          <span>{m.client.state}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {m.urgency !== "normal" && (
                      <span
                        className={"badge text-xs " + urgencyStyles[m.urgency]}
                      >
                        {urgencyLabels[m.urgency]}
                      </span>
                    )}
                    <span className={"badge text-xs " + statusStyles[m.status]}>
                      {statusLabels[m.status]}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">
                  {m.description}
                </p>

                {/* Active matter — stage progress + actions */}
                {tab === "active" && (
                  <>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <span>
                          {MATTER_STAGES.find((s) => s.value === stage)
                            ?.label ?? stage}
                        </span>
                        <span>
                          {step} / {TOTAL_STAGES}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {MATTER_STAGES.map(({ value, step: s }) => (
                          <div
                            key={value}
                            className={
                              "flex-1 h-1.5 rounded-full " +
                              (s < step
                                ? "bg-brand-600"
                                : s === step
                                  ? "bg-brand-300"
                                  : "bg-gray-100")
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 shrink-0">
                          Update stage:
                        </span>
                        <select
                          className="input py-1 text-xs w-44"
                          value={stage}
                          disabled={isUpdating}
                          onChange={(e) =>
                            updateStage(m._id, e.target.value as MatterStage)
                          }
                        >
                          {MATTER_STAGES.filter(
                            (s) => s.value !== "completed",
                          ).map(({ value, label }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => markComplete(m._id)}
                        disabled={isUpdating}
                        className="btn btn-primary text-xs gap-1.5 ml-auto"
                      >
                        {isUpdating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5" />
                        )}
                        Mark complete
                      </button>
                    </div>
                  </>
                )}

                {/* Open pool — claim button */}
                {tab === "pool" && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                      {m.urgency === "critical"
                        ? "⚡ Requires immediate attention"
                        : m.urgency === "urgent"
                          ? "🕐 Has an upcoming deadline"
                          : "No immediate deadline"}
                    </span>
                    <button
                      onClick={() => claimMatter(m._id)}
                      disabled={isUpdating}
                      className="btn btn-primary text-xs gap-1.5"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                          Claiming…
                        </>
                      ) : (
                        "Accept matter"
                      )}
                    </button>
                  </div>
                )}

                {/* Completed */}
                {tab === "completed" && (
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700 font-medium">
                      Resolved
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">
                      Last updated{" "}
                      {new Date(m.updatedAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
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
