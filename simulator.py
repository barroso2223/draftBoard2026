# simulator.py

import json
import random


def load_players(filepath):
    with open(filepath) as f:
        return json.load(f)


def load_draft_order(filepath):
    with open(filepath) as f:
        return json.load(f)


def auto_pick(available_players, mode):
    # sort by combined_score highest 1st
    sorted_players = sorted(
        available_players, key=lambda p: p.get("combined_score", 0), reverse=True
    )

    # pool size depends on mode
    pool_size = 2 if mode == "bpa" else 5

    # Take top N - but don't crash if fewer players remain
    pool = sorted_players[:pool_size]

    # pick randomly from pool
    return random.choice(pool)


def grade_my_draft(my_picks):
    weights = {1: 1.0, 2: 0.9, 3: 0.8, 4: 0.7, 5: 0.6, 6: 0.5, 7: 0.4}

    weighted_scores = [
        p["combined_score"] * weights.get(p["round"], 0.4) for p in my_picks
    ]

    average = sum(weighted_scores) / len(weighted_scores)

    if average >= 85:
        return "A"
    elif average >= 75:
        return "B"
    elif average >= 65:
        return "C"
    elif average >= 55:
        return "D"
    else:
        return "F"


def run_simulation(user_team, mode):
    # load data
    players = load_players("./data/players.json")
    draft_order = load_draft_order("./data/draftOrder.json")
    # track state
    available = [p for p in players if p.get("combined_score", 0) > 0]
    my_picks = []
    all_picks = []
    print(f"\n🏈 2026 NFL Draft Simulator")
    print(f"Your team: {user_team}")
    print(f"Mode: {mode.upper()}\n")
    for slot in draft_order:
        overall = slot["overall"]
        round_num = slot["round"]
        pick_num = slot["pick"]
        team = slot["team"]
        if not available:
            break
        if team == user_team:
            # show top 25 available to user
            print(f"\n{'='*50}")
            print(
                f"YOUR PICK — Round {round_num}, Pick {pick_num} (Overall #{overall})"
            )
            print(f"{'='*50}")
            # position filter
            pos_filter = (
                input("Filter by position (or press enter for all): ").strip().upper()
            )

            if pos_filter:
                top_picks = [p for p in available if p["position"] == pos_filter]
            else:
                top_picks = available

            top_picks = sorted(
                top_picks, key=lambda p: p.get("combined_score", 0), reverse=True
            )[:25]
            for i, p in enumerate(top_picks, 1):
                print(
                    f"{i}. {p['name']} | {p['position']} | {p['school']} | {p.get('combined_score', 0):.1f}"
                )

            # get user input
            while True:
                try:
                    choice = int(input("\nEnter number to pick (1-25): "))
                    if 1 <= choice <= len(top_picks):
                        picked = top_picks[choice - 1]
                        break
                    print("Invalid choice. Try again.")
                except ValueError:
                    print("Enter a number")
            picked["round"] = round_num
            my_picks.append(picked)
            print(f"\n✅ You selected: {picked['name']} ({picked['position']})")
        else:
            # auto pick for other teams
            picked = auto_pick(available, mode)
            picked["round"] = round_num
        # remove picked player from available
        available = [p for p in available if p["name"] != picked["name"]]
        all_picks.append({"team": team, "player": picked, "overall": overall})
    # show results
    print(f"\n{'='*50}")
    print(f"YOUR DRAFT RESULTS — {user_team}")
    print(f"{'='*50}")
    for p in my_picks:
        print(
            f"Round {p['round']}: {p['name']} | {p['position']} | {p.get('combined_score', 0):.1f}"
        )

    grade = grade_my_draft(my_picks)
    print(f"\n🏆 Draft Grade: {grade}")
    return my_picks, grade


def main():
    print("🏈 2026 NFL Draft Simulator\n")
    # show all 32 teams
    teams = [
        "Arizona Cardinals",
        "Atlanta Falcons",
        "Baltimore Ravens",
        "Buffalo Bills",
        "Carolina Panthers",
        "Chicago Bears",
        "Cincinnati Bengals",
        "Cleveland Browns",
        "Dallas Cowboys",
        "Denver Broncos",
        "Detroit Lions",
        "Green Bay Packers",
        "Houston Texans",
        "Indianapolis Colts",
        "Jacksonville Jaguars",
        "Kansas City Chiefs",
        "Las Vegas Raiders",
        "Los Angeles Chargers",
        "Los Angeles Rams",
        "Miami Dolphins",
        "Minnesota Vikings",
        "New England Patriots",
        "New Orleans Saints",
        "New York Giants",
        "New York Jets",
        "Philadelphia Eagles",
        "Pittsburgh Steelers",
        "San Francisco 49ers",
        "Seattle Seahawks",
        "Tampa Bay Buccaneers",
        "Tennessee Titans",
        "Washington Commanders",
    ]

    print("Select your team:")
    for i, team in enumerate(teams, 1):
        print(f"{i}. {team}")
    while True:
        try:
            choice = int(input("\nEnter team number: "))
            if 1 <= choice <= 32:
                user_team = teams[choice - 1]
                break
            print("Enter a number between 1-32.")
        except ValueError:
            print("Enter a number.")
    print("\nSelect draft mode:")
    print("1. Best Player Available (random from top 2)")
    print("2. Team Needs (random from top 5)")
    while True:
        mode_choice = input("\nEnter 1 or 2: ").strip()
        if mode_choice == "1":
            mode = "bpa"
            break
        elif mode_choice == "2":
            mode = "needs"
            break
        print("Enter 1 or 2.")
    run_simulation(user_team, mode)


if __name__ == "__main__":
    main()
