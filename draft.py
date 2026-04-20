def get_score(player):
    return player.get("combined_score") or player.get("rating") or 0


def get_top_at_position(players, position, count):
    filtered = [p for p in players if p["position"] == position]
    return sorted(filtered, key=lambda p: p["combined_score"], reverse=True)[:count]


def get_undrafted(players):
    return [p for p in players if not p["drafted"]]
