import { getIp } from "@/lib/get-ip";

const PRUNE_INTERVAL = 60 * 1000; // 1 minute

const trackers: Record<
  string,
  {
    count: number;
    expiresAt: number;
  }
> = {};

function pruneTrackers() {
  const now = Date.now();

  for (const key in trackers) {
    if (trackers[key].expiresAt < now) {
      delete trackers[key];
    }
  }
}

setInterval(pruneTrackers, PRUNE_INTERVAL);

export async function rateLimitByIp(email: string, p0: string, {
  key = "global", limit = 1, window = 10000,
}: {
  key?: string;
  limit?: number;
  window?: number;
}) {
  const ip = getIp();

  if (!ip) {
    throw new Error("IP address not found");
  }

  await rateLimitByKey({
    key: `${ip}-${key}`,
    limit,
    window,
  });
}

export async function rateLimitByKey({
  key = "global",
  limit = 1,
  window = 10000,
}: {
  key?: string;
  limit?: number;
  window?: number;
}) {
  const tracker = trackers[key] || { count: 0, expiresAt: 0 };

  if (!trackers[key]) {
    trackers[key] = tracker;
  }

  if (tracker.expiresAt < Date.now()) {
    tracker.count = 0;
    tracker.expiresAt = Date.now() + window;
  }

  tracker.count++;

  if (tracker.count > limit) {
    throw new Error("Rate limit exceeded");
  }
}