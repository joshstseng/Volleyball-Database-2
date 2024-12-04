
# Volleyball Players and Teams

## Database Design:

**team**(<ins>*team_id*</ins>, team_name, num_win, num_loss)

**player**(<ins>*player_id*</ins>, player_first, player_last, team_id, player_number)

**staff**(<ins>*staff_id*</ins>, staff_first, staff_last, team_id, title)

**match**(<ins>*match_id*</ins>, winning_team_id, losing_team_id, match_date, winner_set_score, loser_set_score)

## How to use:

Note: Python and Node are required to run the app.

##### Run the backend:
1. Open a new terminal window
2. `cd backend`
3. `python3 main.py` or `python main.py` (depending on your system)

##### Run the frontend:
1. Open a new terminal window
2. `cd frontend`
3. `npm run dev`
4. Open [http://localhost:5173/](http://localhost:5173/)

## Database Queries, Functions, and Endpoints:

@app.route("/create_player", methods=["POST"])

`create_player()`
-   Uses ORM
-   Takes input in the form of json (player_first player_last, team_id, player_number, player_position)
-   Returns 201 on success - 400 otherwise
-   Used when creating a player in the “Create New Player” modal


@app.route("/players", methods=["GET"])

`get_players()`
-   Uses ORM
-   Returns a list of players in json format


@app.route("/update_player/\<int:player_id\>", methods=["PATCH"])

`update_player(player_id)`
-   Uses ORM
-   Returns 200 on success - 404 if player not found - 400 otherwise
-   Used in the update modal of the Players tab


@app.route("/delete_player/\<int:player_id\>", methods=["DELETE"])

**delete_player(player_id)**
-   Uses ORM
-   Returns 200 on success - 404 if player not found
-   Used to delete players in the Players tab


@app.route("/players_filtered", methods=["GET"])

**get_filtered_players()**
-   Uses prepared statement  
-   Used to filter players by position and team in the Players tab 
-   Returns a list of players in json format
-   Used to display the correct players in the Players tab


@app.route("/create_team", methods=["POST"])

**create_team()**
-   Uses ORM
-   Takes input in the form of json (team_name, num_win, num_loss)
-   Returns 201 on success - 400 otherwise
-   Used to create Teams in the “Create New Team” modal


@app.route("/teams", methods=["GET"])

**get_teams()**
-   Uses prepared statement
-   Returns a list of teams in json format
-   Used to access teams in the Teams tab


@app.route("/update_team/\<int:team_id\>", methods=["PATCH"])

**update_team(team_id)**
-   Uses ORM
-   Takes input team_id
-   Returns 200 on success - 404 if team not found - 400 otherwise
-   Used to update a team in the update team modal


@app.route("/delete_team/\<int:team_id\>", methods=["DELETE"])

**delete_team(team_id)**
-   Uses ORM
-   Takes input team_id
-   Returns 200 on success - 404 if team not found
-   Used to delete a team in Teams tab


**getTeamByID(team_id)**
-   Used to identify the team name given a team_id
-   Returns the team name or “Unknown” if no team exists
-   Used in PlayerList.jsx, StaffList.jsx, and MatchList.jsx to display the correct team by ID


@app.route("/create_staff", methods=["POST"]

**create_staff()**
-   Uses ORM
-   Takes input in the form of json (staff_first, staff_last, team_id, title)
-   Returns 201 on success - 400 otherwise
-   Used in the “Create New Staff” modal to create a new staff


@app.route("/staff", methods=["GET"])

**get_staff()**
-   Uses prepared statement
-   Returns a list of staff in json format
-   Used in the Staff tab to access all the staff


@app.route("/update_staff/\<int:staff_id\>", methods=["PATCH"])

**update_staff(staff_id)**
-   Uses ORM
-   Takes input staff_id
-   Returns 200 on success - 404 if staff not found - 400 otherwise
-   Used in the update staff modal to update the staff


@app.route("/delete_staff/\<int:staff_id\>", methods=["DELETE"])

**delete_staff(staff_id)**
-   Uses ORM
-   Takes input staff_id
-   Returns 200 on success - 404 if staff not found
-   Used in the Staff tab to delete a staff


@app.route("/create_match", methods=["POST"])

**create_match()**
-   Uses ORM
-   Takes input in the form of json (winning_team_id, losing_team_id, match_date, winner_set_score, loser_set_score)
-   Returns 201 on success - 400 otherwise
-   Used in the “Create New Match” modal in the matches tab to create a match


@app.route("/matches", methods=["GET"])

**get_matches()**
-   Uses prepared statement
-   Returns a list of matches in json format
-   Used in the Matches modal to access all the matches
 

@app.route("/update_match/\<int:match_id\>", methods=["PATCH"])

**update_match(match_id)**
-   Uses ORM
-   Takes input match_id
-   Returns 200 on success - 404 if match not found - 400 otherwise
-   Used in the update match modal to update the match


@app.route("/delete_match/\<int:match_id\>", methods=["DELETE"])

**delete_match(match_id)**
-   Uses ORM
-   Takes input match_id
-   Returns 200 on success - 404 if match not found
-   Used in the Matches tab to delete a match
