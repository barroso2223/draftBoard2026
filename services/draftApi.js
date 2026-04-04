const BASE = 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2026/draft';

export async function getDraftStatus() {
  const res = await fetch(`${BASE}/status`);
  const data = await res.json();
  return data.type.state; // "pre", "in", "post"
}

export async function getDraftPicks() {
  // Fetch all rounds
  const roundsRes = await fetch(`${BASE}/rounds`);
  const roundsData = await roundsRes.json();

  const allPicks = [];

  // Each round is a $ref — fetch each one
  for (const roundRef of roundsData.items) {
    const roundRes = await fetch(roundRef.$ref);
    const round = await roundRes.json();

    if (!round.picks) continue;

    // Each pick is also a $ref
    for (const pickRef of round.picks.items) {
      const pickRes = await fetch(pickRef.$ref);
      const pick = await pickRes.json();

      allPicks.push({
        overall: pick.overallPickNumber,
        round: pick.roundNumber,
        pick: pick.pickNumber,
        playerName: pick.athlete?.displayName || null,
        team: pick.team?.displayName || null,
        teamAbbrev: pick.team?.abbreviation || null,
      });
    }
  }

  return allPicks;
}
