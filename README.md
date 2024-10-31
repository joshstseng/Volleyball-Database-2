# Volleyball Players Database

## Database Design:

**team**(<ins>*team_id*</ins>, team_name, numWin, numLoss)

**player**(<ins>*player_id*</ins>, player_first, player_last, team_id, player_number)

**staff**(<ins>*staff_id*</ins>, staff_first, staff_last, team_id, title)

**match**(<ins>*match_id*</ins>, winning_team_id, losing_team_id, match_date, winner_set_score, loser_set_score)

## How to use:

Note: Python and Node are required to run the app.

##### Run the backend:
1. Open a terminal window
2. `cd backend`
3. `python3 main.py` (mac) - `python main.py` (windows)

#### Run the frontend:
1. Open a new terminal window
2. `cd frontend`
3. `npm run dev`
4. Open [http://localhost:5173/](http://localhost:5173/)
