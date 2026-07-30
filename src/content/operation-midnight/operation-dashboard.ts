export type OperationCountdown =
  | { status: "locked" }
  | { status: "active"; deadlineAt: string }
  | { status: "expired"; deadlineAt: string };

export type OperationDashboardData = {
  sessionStartedAt: string;
  playersConnected: number;
  maxPlayers: number;
  entry: OperationCountdown;
  extraction: OperationCountdown;
  police: OperationCountdown;
};

export type DashboardPreview = "initial" | "unlocked" | "critical";

const previewNames = new Set<DashboardPreview>(["initial", "unlocked", "critical"]);

export function getDashboardPreview(value: string | undefined): DashboardPreview | undefined {
  if (process.env.NODE_ENV !== "development" || !value || !previewNames.has(value as DashboardPreview)) {
    return undefined;
  }

  return value as DashboardPreview;
}

/** The production loader must omit a deadline until the server records its discovery. */
export function getOperationDashboard(
  roomCode: string,
  preview: DashboardPreview | undefined,
): OperationDashboardData {
  const now = Date.now();
  const common = {
    sessionStartedAt: new Date(now - 7 * 60_000 - 14_000).toISOString(),
    playersConnected: roomCode.toLowerCase() === "demo" ? 4 : 3,
    maxPlayers: 6,
  };

  if (preview === "unlocked") {
    return {
      ...common,
      entry: { status: "active", deadlineAt: new Date(now + 90_000).toISOString() },
      extraction: { status: "locked" },
      police: { status: "active", deadlineAt: new Date(now + 12 * 60_000).toISOString() },
    };
  }

  if (preview === "critical") {
    return {
      ...common,
      entry: { status: "expired", deadlineAt: new Date(now - 1_000).toISOString() },
      extraction: { status: "active", deadlineAt: new Date(now + 75_000).toISOString() },
      police: { status: "active", deadlineAt: new Date(now + 45_000).toISOString() },
    };
  }

  return {
    ...common,
    entry: { status: "locked" },
    extraction: { status: "locked" },
    police: { status: "locked" },
  };
}
