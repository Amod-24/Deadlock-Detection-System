"use client";

import { useState } from "react";
import { SystemState, DetectionResult, ResolveResult } from "@/types";
import { resolveDeadlock } from "@/lib/deadlockDetector";

interface ResolvePanelProps {
    state: SystemState;
    result: DetectionResult;
    onResolved: (resolve: ResolveResult) => void;
}

export default function ResolvePanel({ state, result, onResolved }: ResolvePanelProps) {
    const [selectedVictim, setSelectedVictim] = useState<number | "auto">("auto");
    const [resolveLog, setResolveLog] = useState<string[]>([]);

    if (!result.isDeadlocked) return null;

    const handleAutoResolve = () => {
        const res = resolveDeadlock(state, result.deadlockedProcesses);
        setResolveLog((prev) => [...prev, res.message]);
        onResolved(res);
    };

    const handleManualResolve = () => {
        if (selectedVictim === "auto") {
            handleAutoResolve();
            return;
        }
        const res = resolveDeadlock(state, result.deadlockedProcesses, selectedVictim);
        setResolveLog((prev) => [...prev, res.message]);
        onResolved(res);
    };

    return (
        <div className="bg-error/5 border border-error/30 rounded-2xl p-6 md:p-8 shadow-xl space-y-6 animate-[fadeSlideIn_0.4s_ease-out]">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-error/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-error">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384 3.073A.75.75 0 015 17.625V4.875a.75.75 0 011.036-.618l5.384 3.073a1.5 1.5 0 010 2.579l-5.384 3.073zM15.75 4.5v15" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-error">Deadlock Resolution</h2>
                    <p className="text-sm text-foreground/50">
                        Terminate a process to break the deadlock and recover the system.
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-end gap-4">
                {/* Victim selector */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="victimSelect" className="text-sm font-medium text-foreground/70">
                        Victim Process
                    </label>
                    <select
                        id="victimSelect"
                        value={selectedVictim}
                        onChange={(e) =>
                            setSelectedVictim(
                                e.target.value === "auto" ? "auto" : Number(e.target.value)
                            )
                        }
                        className="px-4 py-2.5 rounded-lg bg-surface border border-surface-border text-foreground text-sm font-mono
                                   focus:outline-none focus:ring-2 focus:ring-error/40 transition-all cursor-pointer appearance-none
                                   min-w-[180px]"
                    >
                        <option value="auto">Auto (min allocation)</option>
                        {result.deadlockedProcesses.map((p) => (
                            <option key={p} value={p}>
                                P{p} — alloc [{state.allocation[p].join(", ")}]
                            </option>
                        ))}
                    </select>
                </div>

                {/* Buttons */}
                <button
                    id="autoResolveBtn"
                    onClick={handleAutoResolve}
                    className="px-6 py-2.5 rounded-lg bg-error/80 hover:bg-error text-white font-medium text-sm
                               transition-all active:scale-95 shadow-lg shadow-error/20 cursor-pointer
                               flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                    Auto-Resolve
                </button>

                <button
                    id="manualResolveBtn"
                    onClick={handleManualResolve}
                    className="px-6 py-2.5 rounded-lg bg-surface border border-error/40 hover:border-error text-foreground/80 hover:text-foreground
                               font-medium text-sm transition-all active:scale-95 cursor-pointer
                               flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                    </svg>
                    Resolve Selected
                </button>
            </div>

            {/* Resolution log */}
            {resolveLog.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/50">
                        Resolution Log
                    </h3>
                    <div className="bg-background/60 border border-surface-border rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                        {resolveLog.map((msg, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-error font-bold shrink-0">#{i + 1}</span>
                                <span className="text-foreground/80 font-mono text-xs leading-relaxed">
                                    {msg}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
