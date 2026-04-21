import json

with open("./data/players.json") as f:
    players = json.load(f)

# qbs = [p for p in players if p["position"] == "WR"]
top5 = sorted(players, key=lambda p: p["combined_score"], reverse=True)[:5]

for p in top5:
    print(f"{p['name']}, | {p['position']}, | {p['combined_score']}")
