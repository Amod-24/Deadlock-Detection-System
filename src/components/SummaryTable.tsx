import { SystemState, DetectionResult } from "../types";

interface SummaryTableProps {
    state: SystemState;
    result: DetectionResult | null;
}

export default function SummaryTable({ state, result }: SummaryTableProps) {
    // Helpers to format matrix rows
    const formatArray = (arr: number[]) => `[${arr.join(", ")}]`;

    // Function to determine process status
    const getProcessStatus = (processIndex: number): "Deadlocked" | "Waiting" | "Running" => {
        // If we have a result and this process is in the deadlocked array
        if (result?.isDeadlocked && result.deadlockedProcesses.includes(processIndex)) {
            return "Deadlocked";
        }

        // Process is waiting if it has outstanding requests
        const hasRequests = state.request[processIndex].some((req) => req > 0);
        if (hasRequests) {
            return "Waiting";
        }

        // Otherwise, it's holding resources or has nothing to do (Running)
        return "Running";
    };

    const getStatusBadgeClass = (status: ReturnType<typeof getProcessStatus>) => {
        switch (status) {
            case "Deadlocked":
                return "bg-error/20 text-error border border-error/50";
            case "Waiting":
                return "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50";
            case "Running":
                return "bg-success/20 text-success border border-success/50";
        }
    };

    return (
        <div className="bg-surface border border-surface-border rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-border/50 text-foreground">
                            <th className="px-4 py-3 font-semibold text-sm border-b border-surface-border">Process</th>
                            <th className="px-4 py-3 font-semibold text-sm border-b border-surface-border">Allocated Resources</th>
                            <th className="px-4 py-3 font-semibold text-sm border-b border-surface-border">Requested Resources</th>
                            <th className="px-4 py-3 font-semibold text-sm border-b border-surface-border">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                        {state.allocation.map((alloc, i) => {
                            const req = state.request[i];
                            const status = getProcessStatus(i);

                            return (
                                <tr key={i} className="hover:bg-surface-border/20 transition-colors">
                                    <td className="px-4 py-3 text-sm font-medium">P{i}</td>
                                    <td className="px-4 py-3 text-sm text-foreground/80 font-mono tracking-wider">
                                        {formatArray(alloc)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-foreground/80 font-mono tracking-wider">
                                        {formatArray(req)}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>
                                            {status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
