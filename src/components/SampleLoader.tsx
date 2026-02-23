"use client";

import { SystemState } from "@/types";
import { scenarios, ScenarioInfo } from "@/lib/sampleScenarios";

interface SampleLoaderProps {
    onLoad: (state: SystemState) => void;
}

export default function SampleLoader({ onLoad }: SampleLoaderProps) {
    const handleLoad = (scenario: ScenarioInfo) => {
        // Deep-copy so callers can mutate freely
        const copy: SystemState = {
            numProcesses: scenario.state.numProcesses,
            numResources: scenario.state.numResources,
            available: [...scenario.state.available],
            allocation: scenario.state.allocation.map((r) => [...r]),
            request: scenario.state.request.map((r) => [...r]),
        };
        onLoad(copy);
    };

    return (
        <div className="bg-surface/60 backdrop-blur-md border border-surface-border rounded-2xl p-6 md:p-8 shadow-xl space-y-4">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent/20 text-accent text-sm font-bold">
                    ★
                </span>
                Sample Scenarios
            </h2>

            <p className="text-sm text-foreground/50">
                Load a pre-configured scenario to quickly test the detection system.
            </p>

            <div className="flex flex-wrap gap-3">
                {scenarios.map((s) => {
                    const isDeadlock = s.id.startsWith("deadlock");

                    return (
                        <button
                            key={s.id}
                            id={`sample-${s.id}`}
                            onClick={() => handleLoad(s)}
                            className={`group relative px-5 py-3 rounded-xl text-left transition-all active:scale-[0.97] cursor-pointer
                                border shadow-md hover:shadow-lg
                                ${isDeadlock
                                    ? "bg-error/5 border-error/30 hover:border-error/60 hover:bg-error/10"
                                    : "bg-success/5 border-success/30 hover:border-success/60 hover:bg-success/10"
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span
                                    className={`inline-block w-2 h-2 rounded-full ${isDeadlock ? "bg-error" : "bg-success"
                                        }`}
                                />
                                <span className="text-sm font-semibold text-foreground">
                                    {s.name}
                                </span>
                            </div>
                            <span className="text-xs text-foreground/50 leading-tight">
                                {s.description}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
