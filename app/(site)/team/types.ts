export enum Rank {
    Member = "Member",
    Lead = "Lead",
    OperationsLead = "Operations Lead",
    TeamLead = "Lead Project Manager",
    ProjectManager = "Project Manager",
    OperationsManager = "Operations Manager",
    TechnicalManager = "Technical Manager",
    FinancialManager = "Financial Manager",
}

export type Member = {
    name: string;
    grade: number;
    rank: Rank;
    about?: string;
    subsystem?: string;
};

export type CardInfo = {
    subsystem: string;
    title: string;
    subtitle?: string;
    linkText?: string;
    description: string;
    goodFit?: string[];
    skills?: string[];
    note?: string;
    placement?: "start" | "end";
    url?: string;
};

export function getMemberImageSrc(name: string): string {
    return `/images/members/${name.toLowerCase().replaceAll(" ", "_")}.png`;
}

export function getRole(rank: Rank, subsystem?: string): string {
    if (rank === Rank.Member) return `${subsystem ?? ""} Member`.trim();
    if (rank === Rank.Lead) return `${subsystem ?? ""} Lead`.trim();
    if (rank === Rank.OperationsLead) return "Operations Lead";
    if (rank === Rank.TeamLead) return "Lead Project Manager";
    if (rank === Rank.ProjectManager) return "Project Manager";
    if (rank === Rank.OperationsManager) return "Operations Manager";
    if (rank === Rank.TechnicalManager) return "Technical Manager";
    if (rank === Rank.FinancialManager) return "Financial Manager";
    return rank;
}

const subsystemIcons: Record<string, string> = {
    Flight: "flight.svg",
    Avionics: "avionics.svg",
    Autopilot: "autopilot.svg",
    Imaging: "imaging.svg",
    Doc: "doc.svg",
    Leadership: "board.svg",
};

export function getSubsystemIcon(subsystem?: string): string {
    if (!subsystem) return "default.svg";
    return subsystemIcons[subsystem] ?? "default.svg";
}
