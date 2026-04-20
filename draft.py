# ---- Imports --------------------
import json

# ---- Helper Functions -----------
def get_score(player):
    return player.get("combined_score") or player.get("rating") or 0

def get_top_at_position(players, position, count):
    filtered = [p for p in players if p["position"] == position]
    return sorted(filtered, key=lambda p: p["combined_score"], reverse=True)[:count]

def get_undrafted(players):
    return [p for p in players if not p["drafted"]]

def calculate_draft_grade(picks):
    scores = [p["combined_score"] for p in picks]
    average = sum(scores) / len(scores)

    if average >= 90:
        return "A"
    elif average >= 80:
        return "B"
    elif average >= 70:
        return "C"
    elif average >= 60:
        return "D"
    else:
        return "F"

def load_players(filepath):
    with open(filepath) as f:
        return json.load(f)

# ----- Main ------------------------
def main():
    loaded_players = load_players("./data/players.json")
    top_5_qbs = get_top_at_position(loaded_players, "QB", 5)
    draft_grades = calculate_draft_grade(top_5_qbs)
    print(f"Top 5 QBs grade: {draft_grades}")

# ----- Execute ---------------------
if __name__ == "__main__":
    main()
