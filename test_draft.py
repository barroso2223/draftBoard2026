from draft import calculate_draft_grade


def test_grade_a():
    picks = [
        {"name": "Jerry", "combined_score": 90, "drafted": True},
        {"name": "Tom", "combined_score": 99, "drafted": True},
        {"name": "Timmy", "combined_score": 89, "drafted": True},
    ]
    result = calculate_draft_grade(picks)
    assert result == "A"


def test_grade_b():
    picks = [
        {"name": "Jerry", "combined_score": 90, "drafted": True},
        {"name": "Tom", "combined_score": 80, "drafted": True},
        {"name": "Timmy", "combined_score": 85, "drafted": True},
    ]
    result = calculate_draft_grade(picks)
    assert result == "B"


def test_grade_c():
    picks = [
        {"name": "Jerry", "combined_score": 79, "drafted": True},
        {"name": "Tom", "combined_score": 81, "drafted": True},
        {"name": "Timmy", "combined_score": 71, "drafted": True},
    ]
    result = calculate_draft_grade(picks)
    assert result == "C"


def test_grade_d():
    picks = [
        {"name": "Jerry", "combined_score": 70, "drafted": True},
        {"name": "Tom", "combined_score": 65, "drafted": True},
        {"name": "Timmy", "combined_score": 61, "drafted": True},
    ]
    result = calculate_draft_grade(picks)
    assert result == "D"


def test_grade_f():
    picks = [
        {"name": "Jerry", "combined_score": 50, "drafted": True},
        {"name": "Tom", "combined_score": 70, "drafted": True},
        {"name": "Timmy", "combined_score": 55, "drafted": True},
    ]
    result = calculate_draft_grade(picks)
    assert result == "F"
