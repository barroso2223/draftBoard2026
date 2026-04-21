import json

# Read the players.json file
with open("data/players.json", "r", encoding="utf-8") as file:
    players = json.load(file)

print(f"Loaded {len(players)} players")
print(f"First Player: {players[0]['name']}")
