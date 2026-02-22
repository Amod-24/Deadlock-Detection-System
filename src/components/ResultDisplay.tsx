import { DetectionResult } from "../types";

interface ResultDisplayProps {
    result: DetectionResult;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
    if (result.isDeadlocked) {
        return (
            <div className="bg-error/10 border border-error/50 rounded-lg p-6 mb-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center text-error">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-error">DEADLOCK DETECTED ✗</h2>
                </div>
                <p className="text-foreground/80 mb-3">{result.message}</p>
                <div>
                    <span className="font-medium text-foreground">Deadlocked Processes: </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {result.deadlockedProcesses.map((p) => (
                            <span key={p} className="px-3 py-1 bg-error/20 text-error rounded-md text-sm font-medium border border-error/30">
                                P{p}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-success/10 border border-success/50 rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center text-success">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-success">System is SAFE ✓</h2>
            </div>
            <p className="text-foreground/80 mb-3">{result.message}</p>
            {result.safeSequence && result.safeSequence.length > 0 && (
                <div>
                    <span className="font-medium text-foreground mb-2 block">Safe Sequence:</span>
                    <div className="flex flex-wrap items-center gap-2">
                        {result.safeSequence.map((p, index) => (
                            <div key={p} className="flex items-center">
                                <span className="px-3 py-1 bg-success/20 text-success rounded-md text-sm font-medium border border-success/30">
                                    P{p}
                                </span>
                                {index < result.safeSequence.length - 1 && (
                                    <span className="mx-2 text-success/70 font-bold">→</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
