# Python Course

# Strings
name = 'Jeremiyah Love'
position = 'RB'

# Numbers
score = 91.4
weight = 212

#Booleans (notice capital T and F - different from JS)
drafted = False # JavaScript: false;
is_active = True # JavaScript: true;

# None (JavaScript's null/undefined)
height = None

# List (JavaScript's array)
players = []
names = ['David', 'Jeremiyah', 'Fernando']

# Dictionary (JavaScript's object)
player = {
  'name': 'Jeremiyah Love',
  'position': 'RB',
  'score': 91.4,
  'drafted': False
}

# Dictionary keys use quotes
player['name'] # JavaScript: player.name
player.get('name') # Safer won't crash is missing

# String formatting uses f-strings
f"{player['name']} | {player['position']}" or f"{player.get('name')} | {player.get('position')}" # JavaScript: `${player.name} | ${player.position}`;

# Python Lesson 2 — Functions

# basic function
def get_score(player):
  return player['combined_score'] or player['rating'] or 0

# One liner (lambda = Python's arrow function)
get_score = lambda p: p.get('combined_score') or p.get('rating') or 0

# Function with default parameter
def get_top(players, position='ALL', count=25):
  if position != 'ALL':
    players = [p for p in players if p['position'] == position]
  return sorted(players, key=lambda p: p['combined_score'], reverse=True)[count]

# Python Lesson 3 — Lists (Python's Arrays)
names = ['David', 'Jeremiyah', 'Fernando']

# Same as JavaScript
names[0]  #'David'
len(names) # 3 (JavaScript: names.length)
names.append('Caleb')  #JavaScript: names.push('Caleb')

# Filter (list comprehension)
qbs = [p for p in players if p['position'] == 'QB']
#JavScript: players.filter(p => p.position === 'QB')

# Map (list comprehension)
name-list = [p['name'] for p in players]
# JavaScript: players.map(p => p.name)

# Sort
sorted_players = sorted(players, key=lambda p: p['combined_score'], reverse=True)
# JavaScript: players.sort((a, b) => b.combined_score - a.combined_score)

# Slice
top_5 = sorted_players[:5]
# JavaScript: sorted_players.slice(0, 5)

# Write the 5 challenges:

# 1. Variable called score = 91.4
score = 91.4

# 2. List called positions with QB, RB, WR
positions = ['QB', 'RB', 'WR']

# 3. Dictionary called player with name, position, score
player = {
  'name': 'John Doe',
  'position': 'EDGE',
  'score': 92
}

# 4. Function get_score that takes a player and returns combined_score or rating or 0
def get_score(player):
  return player.get('combined_score') or player.get('rating') or 0

# 5. List comprehension — get all QBs from a players list
return lambda p: p[position] == 'QB'

#correct version
qbs = [p for p in players if p['position'] == 'QB']


#Now Write These 3 From Memory

# 1. Get all undrafted players from players list
undrafted = [p for p in players p['drafted'] == False]

# Corrected
undrafted = [o for p in players if p['drafted'] == False]

# cleaner and preferred
undrafted = [p for p in players if not p['drafted']]

# 2. Get just the names of all players
#    (like JavaScript's players.map(p => p.name))
name = [p for p in players p['name']]

#correct
names = [p['name'] for p in players]

# The pattern:
# [WHAT_YOU_WANT for p in players]
#  ↑ this is what gets returned

# 3. Get the top 5 players sorted by combined_score
#    (use sorted() with key and reverse=True, then slice)
sorted[players, key= lambda p: p['combined_score'] reverse=True]

# correct 
top5 = sorted(players, key=lambda p: p['combined_score'], reverse=True)[:5]
#            ^       ^                                  ^             ^ ^^^
#         parens  comma                             comma        parens  slice

# filter
[p for p in players if CONDITION]

# transform
[p['name'] for p in players]

# Sort + slice
top5 = sorted(players, key=lambda p: p['score'], reverse=True)[:5]

#Now write all three correctly from memory. One shot:

# 1. Undrafted players
undrafted = [p in p for players if not p['drafted']]
#correct
undrafted = [p for p in players if not p['drafted']]
# memory trick - read like english
# "give me p, for each p, in players, if not drafted"

# 2. Just the names
names = [p['name'] in p for players]
#correct
names = [p['name'] for p in players]
# memory trick - read like english
# "give me p's name, for each p, in players"

# WHAT_YOU_WANT → for → VARIABLE → in → LIST → if → CONDITION

# 3. Top 5 by combined_score
top5 = sorted(players, key=lambda p: p['combined_score'], reverse=True)[:5] 

#One final time. Write all three:

# 1. Undrafted players
undrafted = [p for p in players if not p['drafted']]

# 2. Just the names  
names = [p['name'] for p in players]

# 3. Top 5 by combined_score
top5 = sorted(players, key=lambda p: p['combined_score'], reverse=True)[:5]

# Next Step — Your First Python Function From Scratch
# Write a function called get_top_at_position
# that takes: players, position, count
# and returns: top N players at that position
# sorted by combined_score highest first

# Hint — you have all the pieces:
# - list comprehension for filtering
# - sorted() for ordering
# - [:count] for slicing

def get_top_at_position(players, position, count):
  top_player = sorted(players, key=lambda p: p['combined_score'], reverse=True)[:count]
  return [p['position'] for p in players]

def get_top_at_position(players, position, count):
  filtered = [p for p in players if p['position'] == position]
  return sorted(filtered, key=lambda p: p['combined_score'], reverse=True)[:count]

function getTopAtPosition(players, position, count) {
  let topPlayer = players.sort((a, b), => b.combined_score - a.combined_score).slice(0, count);
  return topPlayer.position;
};

function getTopAtPosition(players, position, count) {
  return players  
    .filter(p => p.position === position)
    .sort((a, b) => b.combined_score - a.combined_score)
    .slice(0, count);
}

# The three steps — always in this order:
# 1. FILTER  → narrow down to right position
# 2. SORT    → highest score first
# 3. SLICE   → take only what you need

def get_top_at_position(players, position, count):
  filtered = [p for p in players if p['position'] == position]
  return sorted(filtered, key=lambda p: p['combined_score'], reverse=True)[:count]

#pytest (Your First Python Tests)

def test_get_top_at_position():
  # 1. ARRANGE - set up test data
  players = [
    {'name': 'Tom', 'position': 'QB', 'combined_score': 90},
    {'name': 'Jerry', 'position': 'RB', 'combined_score': 85},
    {'name': 'Mike', 'position': 'QB', 'combined_score': 88},
  ] # I understand this is an object or a dictionary to serve as a database for the players variable
  
  # 2. ACT - call the function
  result = get_top_at_position(players, 'QB', 2) # i'm not exactly sure what result means and i understand the (players) is a input, but i'm not sure is the hard coding of ('QB', 2)? this im not sure about
  
  # 3. ASSERT - get_top_at_position
  assert len(result) == 2 # i'm not familiar with assert but i understand here the result length needs to be equal to 2 (but 2 what exactly? 2 characters? or 2 words, indexes...?)
  assert result[0]['name'] == 'Tom' # again not sure what assert is, but i know it means the results apparently has multiple indexes so here you are getting the one in the zero index and it's 'name' must equal 'Tom'
  assert result[0]['combined_score'] > result[1]['combined_score'] # again not sure what assert is, but i know it means the results apparently has multiple indexes so here you are getting the one in the zero index and it's 'combined_score' must be greater than that of the first index (essentially the next player, so i guess this is putting it in order from highest to lowest)
  # I just want to clarify all this before we move on please
  
  
# Now write your own test from scratch:
# Write a test for get_score()
# Your get_score function:

def get_score(player):
  return player.get('combined_score') or player.get('rating') or 0

def test_get_score():
  return player.get('combined_score') or player.get('rating') or 0
  # Arrange
  player = [
    {'name': 'Tom', 'position': 'QB', 'combined_score': 90},
    {'name': 'Jerry', 'position': 'RB', 'combined_score': 85},
    {'name': 'Mike', 'position': 'QB', 'combined_score': 88},
  ]
  
  # Act
  result = lambda p: p.get('combined_score') or p.get('rating') or 0


# Write 3 tests:
# Test 1: player WITH combined_score → returns combined_score
assert result[0] == 90 

# Test 2: player WITHOUT combined_score but WITH rating → returns rating  
assert result !=  p['combined_score'] but p['rating']


# Test 3: player with NEITHER → returns 0
assert result != p['combined_score'] or p['rating'] 

# test 1
def test_get_score_uses_combined_score():
  # Arrange - ONE player, not a list
  player = {'name': 'Tom', 'position': 'QB', 'combined_score': 90}
  
  # ACT - call the actual function
  result = get_score(player)
  
  # Assert
  assert result == 90
  
  # Test 2 - correct version
  def test_get_score_falls_back_to_rating():
    # No combined_score - only rating
    player = {'name': 'Jerry', 'rating': 85}
    
    result = get_score(player)
    
    assert result == 85
    
    # Test 3 - correct version
    def test_get_score_defaults_to_zero():
      # Neither combined_score nor rating
      player = {'name': 'Jerry'}
      
      result = get_score(player)
      
      assert == 0
      
      # The pattern — memorize this structure:
      def test_WHAT_YOU_ARE_TESTING():
        # Arrange - one simple dict with only what you need
        player = {'key': 'value'}
        
        # ACT - call the real function
        result = get_score(player)
        
        # ASSERT - check the result
        assert result == EXPECTED_VALUE
        
      # Key rules:
      # 1. Each test tests ONE thing
      # 2. Arrange uses the simplest data possible
      # 3. Act calls the REAL function — not a lambda
      # 4. Assert checks ONE expected value
      # 5. assert is INSIDE the function
      
      # Now write all three tests from scratch:
      def get_score(player):
        return player.get('combined_score') or player.get('rating') or 0

      
      # Test 1: has combined_score
      def test_get_score_combined_score():
        
        player = {'name': 'Jerry', 'position': 'QB', 'combined_score': 90}
        
        result = get_score(player)
        
        assert result == 90

      # Test 2: no combined_score, has rating
      def test_get_score_rating():
        
        player = {'name': 'Jerry', 'rating': 90}
        
        result = get_score(player)
        
        assert result == 90

      # Test 3: has neither
      def test_get_score_no_combined_nor_rating():
        
        player = {"name": 'Jerry'}
        
        result = get_score(player)
        
        assert result == 0
        
        
# Drill 1 — Write these 5 functions from scratch. No looking.

# 1. A function that takes a list of numbers
#    and returns only the ones greater than 70

def greater_than_70(numbers):
  return [n for n in numbers if n > 70]
  

# 2. A function that takes a list of players
#    and returns their names as a list
def player_list(players):
  return ( p['name'] for p in players)
  
  

# 3. A function that takes a list of players
#    and returns the one with the highest combined_score
def highest_player_in_list(players):
  return sorted(players, key=lambda p: p['combined_score'], reverse = True)[0]
  
  
# 4. A function that takes a score (number)
#    and returns "pass" if >= 70, "fail" if below
def score_pass_or_fail(number):
  if number >= 70:
      return "pass"
  else: 
    return "fail"


# 5. A function that takes a list of players
#    and returns how many are undrafted

def undrafted_players(players):
  return len([p for p in players if not p['drafted']])

#Now do function 2 completely on your own. Same process:
# Function 2: Return just the names from a list of players

# Step 1 — What does it receive?
# Step 2 — What does it do?
# Step 3 — What does it return?
# Step 4 — Write it

def return_names(players):
  players = [
    {'name': 'Jayson', 'combined_score': 90, 'drafted': True },
    {'name': 'Tom', 'combined_score': 95, 'drafted': False  },
    {'name': 'Sam', 'combined_score': 85,  'drafted': True  },
  ]
  return [p['name'] for p in players]



# 1. A function that takes a list of numbers
#    and returns only the ones greater than 70
def greater_than_70(numbers):
  return [n for n in numbers if n > 70]

# 2. A function that takes a list of players
#    and returns their names as a list
def player_list(players):
  return [p['name'] for p in players]

# 3. A function that takes a list of players
#    and returns the one with the highest combined_score
def highest_combined_score(players):
  return sorted(players, key=lambda p: p['combined_score'], reverse = True)[0]

# 4. A function that takes a score (number)
#    and returns "pass" if >= 70, "fail" if below
def score_pass_or_fail(number):
  if number >= 70:
    return 'pass'
  else: 
    return 'fail'

# 5. A function that takes a list of players
#    and returns how many are undrafted
def undrafted_players_list(players):
  return len([p for p in players if not p['drafted']])

# Function 2: Return just the names from a list of players

# Step 1 — What does it receive?
# Step 2 — What does it do?
# Step 3 — What does it return?
# Step 4 — Write it

def list_of_players(players):
  return [p['name'] for p in players]




# Now write 5 tests — one for each function.

# 1. A function that takes a list of numbers
#    and returns only the ones greater than 70
#test for def greater_than_70(numbers):
def test_greater_than_70():
  numbers = [1, 75, 80]
  result = greater_than_70()
  assert result == [75, 80]
  
# 2. A function that takes a list of players
#    and returns their names as a list
# test for def player_list(players):
def test_player_list():
  players = [
    {'name': 'Jayson', 'combined_score': 90, 'drafted': True },
    {'name': 'Tom', 'combined_score': 95, 'drafted': False  },
    {'name': 'Sam', 'combined_score': 85,  'drafted': True  },
  ]
  result = player_list()
  assert result == ['Jayson', 'Tom', 'Sam']
  

# 3. A function that takes a list of players
#    and returns the one with the highest combined_score
#test for def highest_combined_score(players):
def test_highest_combined_score():
  players = [
    {'name': 'Jayson', 'combined_score': 90, 'drafted': True },
    {'name': 'Tom', 'combined_score': 95, 'drafted': False  },
    {'name': 'Sam', 'combined_score': 85,  'drafted': True  },
  ]
  result = highest_combined_score()
  assert result == 95

# 4. A function that takes a score (number)
#    and returns "pass" if >= 70, "fail" if below
#test for def score_pass_or_fail(number):
def test_score_pass_or_fail():
  number = 75
  result = score_pass_or_fail()
  assert result == 'pass'

# 5. A function that takes a list of players
#    and returns how many are undrafted
#test for def undrafted_players_list(players):
def test_undrafted_players_list(): 
  players = [
    {'name': 'Jayson', 'combined_score': 90, 'drafted': True },
    {'name': 'Tom', 'combined_score': 95, 'drafted': False  },
    {'name': 'Sam', 'combined_score': 85,  'drafted': True  },
  ]
  result = undrafted_players_list()
  assert result == 2
  
  
  
# Now write 5 tests — one for each function.

# 1. A function that takes a list of numbers
#    and returns only the ones greater than 70
#test for def greater_than_70(numbers):
def test_greater_than_70():
  numbers = [1, 75, 80]
  result = greater_than_70(numbers)
  assert result == [75, 80]
  
# 2. A function that takes a list of players
#    and returns their names as a list
# test for def player_list(players):
def test_player_list():
  players = [
    {'name': 'Jayson', 'combined_score': 90, 'drafted': True },
    {'name': 'Tom', 'combined_score': 95, 'drafted': False  },
    {'name': 'Sam', 'combined_score': 85,  'drafted': True  },
  ]
  result = player_list(players)
  assert result == ['Jayson', 'Tom', 'Sam']
  

# 3. A function that takes a list of players
#    and returns the one with the highest combined_score
#test for def highest_combined_score(players):
def test_highest_combined_score():
  players = [
    {'name': 'Jayson', 'combined_score': 90, 'drafted': True },
    {'name': 'Tom', 'combined_score': 95, 'drafted': False  },
    {'name': 'Sam', 'combined_score': 85,  'drafted': True  },
  ]
  result = highest_combined_score(players)
  assert result == {'name': 'Tom', 'combined_score': 95, 'drafted': False  }

# 4. A function that takes a score (number)
#    and returns "pass" if >= 70, "fail" if below
#test for def score_pass_or_fail(number):
def test_score_pass_or_fail():
  number = 75
  result = score_pass_or_fail(number)
  assert result == 'pass'

# 5. A function that takes a list of players
#    and returns how many are undrafted
#test for def undrafted_players_list(players):
def test_undrafted_players_list(): 
  players = [
    {'name': 'Jayson', 'combined_score': 90, 'drafted': True },
    {'name': 'Tom', 'combined_score': 95, 'drafted': False  },
    {'name': 'Sam', 'combined_score': 85,  'drafted': True  },
  ]
  result = undrafted_players_list(players)
  assert result == 1