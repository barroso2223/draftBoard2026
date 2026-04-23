# 1. A function that takes a list of numbers
#    and returns only the ones greater than 70
def greater_than_70(numbers):
    return [n for n in numbers if n > 70]


# 2. A function that takes a list of players
#    and returns their names as a list
def player_list(players):
    return [p["name"] for p in players]


# 3. A function that takes a list of players
#    and returns the one with the highest combined_score
def highest_combined_score(players):
    return sorted(players, key=lambda p: p["combined_score"], reverse=True)[0]


# 4. A function that takes a score (number)
#    and returns "pass" if >= 70, "fail" if below
def score_pass_or_fail(number):
    if number >= 70:
        return "pass"
    else:
        return "fail"


# 5. A function that takes a list of players
#    and returns how many are undrafted
def undrafted_players_list(players):
    return len([p for p in players if not p["drafted"]])


# Now write 5 tests — one for each function.


# 1. A function that takes a list of numbers
#    and returns only the ones greater than 70
# test for def greater_than_70(numbers):
def test_greater_than_70():
    numbers = [1, 75, 80]
    result = greater_than_70(numbers)
    assert result == [75, 80]


# 2. A function that takes a list of players
#    and returns their names as a list
# test for def player_list(players):
def test_player_list():
    players = [
        {"name": "Jayson", "combined_score": 90, "drafted": True},
        {"name": "Tom", "combined_score": 95, "drafted": False},
        {"name": "Sam", "combined_score": 85, "drafted": True},
    ]
    result = player_list(players)
    assert result == ["Jayson", "Tom", "Sam"]


# 3. A function that takes a list of players
#    and returns the one with the highest combined_score
# test for def highest_combined_score(players):
def test_highest_combined_score():
    players = [
        {"name": "Jayson", "combined_score": 90, "drafted": True},
        {"name": "Tom", "combined_score": 95, "drafted": False},
        {"name": "Sam", "combined_score": 85, "drafted": True},
    ]
    result = highest_combined_score(players)
    assert result == {"name": "Tom", "combined_score": 95, "drafted": False}


# 4. A function that takes a score (number)
#    and returns "pass" if >= 70, "fail" if below
# test for def score_pass_or_fail(number):
def test_score_pass_or_fail():
    number = 75
    result = score_pass_or_fail(number)
    assert result == "pass"


# 5. A function that takes a list of players
#    and returns how many are undrafted
# test for def undrafted_players_list(players):
def test_undrafted_players_list():
    players = [
        {"name": "Jayson", "combined_score": 90, "drafted": True},
        {"name": "Tom", "combined_score": 95, "drafted": False},
        {"name": "Sam", "combined_score": 85, "drafted": True},
    ]
    result = undrafted_players_list(players)
    assert result == 1


# 1. A function that takes a list of players
#    and returns only players with combined_score >= 80
#    sorted highest to lowest
def players_over_80_sorted_high_low(players):
    over_80 = [p for p in players if p["combined_score"] >= 80]
    return sorted(over_80, key=lambda p: p["combined_score"], reverse=True)


# 2. A function that takes a grade string ("A", "B", "C")
#    and returns the minimum score needed
#    A=90, B=80, C=70, anything else returns 0
def grade_strings(grade):
    if grade == "A":
        return 90
    elif grade == "B":
        return 80
    elif grade == "C":
        return 70
    else:
        return 0


# 3. A function that takes a list of players
#    and a position string
#    and returns players at that position sorted by score
def player_by_position_sorted(players, position):
    filter = [p for p in players if p["position"] == position]
    return sorted(filter, key=lambda p: p["combined_score"], reverse=True)


# 4. A function that takes a list of scores
#    and returns their average rounded to 1 decimal
def list_of_avg_scores(scores):
    return round(((sum(scores) / len(scores))), 1)

    # never learned how to get averages or how to round


# 5. A function that takes a player dict
#    and returns True if they are draftable
#    (combined_score >= 70 AND not already drafted)
def draftable_player(player):
    if player["combined_score"] >= 70 and not player["drafted"]:
        return True
    else:
        return False


# Function TESTS


# 1. A function that takes a list of players
#    and returns only players with combined_score >= 80
#    sorted highest to lowest
# def players_over_80_sorted_high_low(players):
def test_players_over_80_sorted_high_low():
    players = [
        {"name": "Jayson", "combined_score": 70, "drafted": True},
        {"name": "Tom", "combined_score": 95, "drafted": False},
        {"name": "Sam", "combined_score": 85, "drafted": True},
    ]
    result = players_over_80_sorted_high_low(players)
    assert result == [
        {"name": "Tom", "combined_score": 95, "drafted": False},
        {"name": "Sam", "combined_score": 85, "drafted": True},
    ]


# 2. A function that takes a grade string ("A", "B", "C")
#    and returns the minimum score needed
#    A=90, B=80, C=70, anything else returns 0
# def grade_strings(grade):
def test_grade_strings():
    grade = "A"
    result = grade_strings(grade)
    assert result == 90


# 3. A function that takes a list of players
#    and a position string
#    and returns players at that position sorted by score
# def player_by_position_sorted(players, position):
def test_player_by_position_sorted():
    players = [
        {"name": "Jayson", "combined_score": 70, "drafted": True, "position": "QB"},
        {"name": "Tom", "combined_score": 95, "drafted": False, "position": "WR"},
        {"name": "Sam", "combined_score": 85, "drafted": True, "position": "QB"},
    ]
    result = player_by_position_sorted(players, "QB")
    assert result == [
        {"name": "Sam", "combined_score": 85, "drafted": True, "position": "QB"},
        {"name": "Jayson", "combined_score": 70, "drafted": True, "position": "QB"},
    ]


# 4. A function that takes a list of scores
#    and returns their average rounded to 1 decimal
# def list_of_avg_scores(scores):
def test_list_of_avg_scores():
    scores = [90.5, 95.25, 80, 70.75]
    result = list_of_avg_scores(scores)
    assert result == 84.1

    # never learned how to get averages or how to round


# 5. A function that takes a player dict
#    and returns True if they are draftable
#    (combined_score >= 70 AND not already drafted)
# def draftable_player(player):
def test_draftable_player():
    player_1 = {
        "name": "Jayson",
        "combined_score": 80,
        "drafted": False,
        "position": "QB",
    }
    player_2 = {
        "name": "Jayson",
        "combined_score": 60,
        "drafted": False,
        "position": "QB",
    }
    player_3 = {
        "name": "Jayson",
        "combined_score": 90,
        "drafted": True,
        "position": "QB",
    }

    result_1 = draftable_player(player_1)
    result_2 = draftable_player(player_2)
    result_3 = draftable_player(player_3)

    assert result_1 == True
    assert result_2 == False
    assert result_3 == False
