import aiohttp

BASE = (
    "https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2026/draft"
)


def get_score(player):
    return player.get("combined_score") or player.get("rating") or 0


def get_top_at_position(players, position, count):
    filtered = [p for p in players if p["position"] == position]
    return sorted(filtered, key=lambda p: p["combined_score"], reverse=True)[:count]


async def get_draft_status():

    async with aiohttp.ClientSession() as session:
        async with session.get(f"{BASE}/status") as response:
            data = await response.json()
            return data["type"]["state"]
