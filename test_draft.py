from draft import get_undrafted


def test_excludes_drafted_players():
    players = [
        {"name": "Jerry", "drafted": False},
        {"name": "Tom", "drafted": True},
        {"name": "Timmy", "drafted": False},
    ]
    result = get_undrafted(players)
    assert len(result) == 2


def test_returns_all_when_none_drafted():
    players = [
        {"name": "Jerry", "drafted": False},
        {"name": "Tom", "drafted": False},
        {"name": "Timmy", "drafted": False},
    ]
    result = get_undrafted(players)
    assert len(result) == 3
