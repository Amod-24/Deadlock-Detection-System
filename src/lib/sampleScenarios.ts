import { SystemState } from "@/types";

/** Safe scenario: 5 processes, 3 resources, Available=[3,3,2] */
export const safeScenario: SystemState = {
    numProcesses: 5,
    numResources: 3,
    available: [3, 3, 2],
    allocation: [
        [0, 1, 0], // P0
        [2, 0, 0], // P1
        [3, 0, 2], // P2
        [2, 1, 1], // P3
        [0, 0, 2], // P4
    ],
    request: [
        [7, 4, 3], // P0
        [1, 2, 2], // P1
        [6, 0, 0], // P2
        [0, 1, 1], // P3
        [4, 3, 1], // P4
    ],
};

/** Deadlock scenario: 4 processes, 3 resources, Available=[0,0,0], circular wait */
export const deadlockScenario: SystemState = {
    numProcesses: 4,
    numResources: 3,
    available: [0, 0, 0],
    allocation: [
        [0, 1, 0], // P0
        [2, 0, 0], // P1
        [0, 0, 1], // P2
        [1, 0, 0], // P3
    ],
    request: [
        [2, 0, 0], // P0 wants R0 held by P1, P3
        [0, 0, 1], // P1 wants R2 held by P2
        [1, 0, 0], // P2 wants R0 held by P1, P3
        [0, 1, 0], // P3 wants R1 held by P0
    ],
};

/** Single-instance deadlock: 3 processes, 3 resources, 1 instance each, cycle */
export const singleInstanceDeadlock: SystemState = {
    numProcesses: 3,
    numResources: 3,
    available: [0, 0, 0],
    allocation: [
        [1, 0, 0], // P0 holds R0
        [0, 1, 0], // P1 holds R1
        [0, 0, 1], // P2 holds R2
    ],
    request: [
        [0, 1, 0], // P0 requests R1 (held by P1)
        [0, 0, 1], // P1 requests R2 (held by P2)
        [1, 0, 0], // P2 requests R0 (held by P0)   → cycle P0→P1→P2→P0
    ],
};

export interface ScenarioInfo {
    id: string;
    name: string;
    description: string;
    state: SystemState;
}

export const scenarios: ScenarioInfo[] = [
    {
        id: "safe",
        name: "Safe System",
        description: "5 processes, 3 resources — has a safe sequence",
        state: safeScenario,
    },
    {
        id: "deadlock-multi",
        name: "Multi-Instance Deadlock",
        description: "4 processes, 3 resources — circular wait, no available",
        state: deadlockScenario,
    },
    {
        id: "deadlock-single",
        name: "Single-Instance Deadlock",
        description: "3 processes, 3 resources — 1 instance each, cycle",
        state: singleInstanceDeadlock,
    },
];
