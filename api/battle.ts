import type { VercelRequest, VercelResponse } from "@vercel/node";

import {
  fetchPlayerStats,
  resolveUsernames,
  RobloxApiError,
} from "./_lib/roblox";

const CACHE_BATTLE = "public, s-maxage=300, stale-while-revalidate=600";
const CACHE_NOT_FOUND = "public, s-maxage=60";
const CACHE_NONE = "no-store";
const RETRY_AFTER_SECONDS = 10;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { username1, username2 } = req.query;

  if (typeof username1 !== "string" || typeof username2 !== "string") {
    res.setHeader("Cache-Control", CACHE_NONE);
    res.status(400).json({ error: "username1 and username2 are required." });
    return;
  }

  const requestedA = username1.trim();
  const requestedB = username2.trim();

  if (!requestedA || !requestedB) {
    res.setHeader("Cache-Control", CACHE_NONE);
    res.status(400).json({ error: "username1 and username2 are required." });
    return;
  }

  if (requestedA.toLowerCase() === requestedB.toLowerCase()) {
    res.setHeader("Cache-Control", CACHE_NONE);
    res.status(400).json({ error: "Choose two different players." });
    return;
  }

  try {
    const resolved = await resolveUsernames([requestedA, requestedB]);

    const findUser = (username: string) =>
      resolved.find(
        (user) =>
          user.requestedUsername?.toLowerCase() === username.toLowerCase(),
      );

    const userA = findUser(requestedA);
    const userB = findUser(requestedB);

    if (!userA || !userB) {
      const notFound = [
        userA ? null : requestedA,
        userB ? null : requestedB,
      ].filter(Boolean);

      res.setHeader("Cache-Control", CACHE_NOT_FOUND);
      res.status(404).json({
        error: `Player${notFound.length > 1 ? "s" : ""} not found: ${notFound.join(", ")}.`,
      });
      return;
    }

    const [playerA, playerB] = await Promise.all([
      fetchPlayerStats(userA.id, userA.name),
      fetchPlayerStats(userB.id, userB.name),
    ]);

    res.setHeader("Cache-Control", CACHE_BATTLE);
    res.status(200).json({ playerA, playerB });
  } catch (error) {
    console.error(error);
    res.setHeader("Cache-Control", CACHE_NONE);

    if (error instanceof RobloxApiError && error.status === 429) {
      res.setHeader("Retry-After", RETRY_AFTER_SECONDS);
      res.status(429).json({
        error: `Roblox is rate-limiting requests. Try again in ${RETRY_AFTER_SECONDS} seconds.`,
      });
      return;
    }

    res.status(502).json({ error: "Failed to fetch player data from Roblox." });
  }
}
