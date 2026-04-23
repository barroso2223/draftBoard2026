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
