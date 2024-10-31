from flask import request, jsonify
from config import app, db
from models import Player, Team, Staff, Match
from sqlalchemy import text

@app.route("/players", methods=["GET"])
def get_players():
    players = Player.query.all()
    json_players = list(map(lambda x: x.to_json(), players))
    return jsonify({"players": json_players})

@app.route("/create_player", methods=["POST"])
def create_player():
    player_first = request.json.get("playerFirst")
    player_last = request.json.get("playerLast")
    team_id = request.json.get("teamId")
    player_number = request.json.get("playerNumber")
    player_position = request.json.get("playerPosition")

    if (not player_first or not player_last):
        return(
            jsonify({"message": "You must include a first name and last name"}), 400
        )
    new_player = Player(player_first=player_first,
                        player_last=player_last,
                        team_id=team_id,
                        player_number=player_number,
                        player_position=player_position)

    try:
        db.session.add(new_player)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Player created!"}), 201

@app.route("/update_player/<int:player_id>", methods=["PATCH"])
def update_player(player_id):
    player = Player.query.get(player_id)

    if not player:
        return jsonify({"message": "Player not found"}), 404
    
    data = request.json
    
    player.player_first = data.get("playerFirst", player.player_first)
    player.player_last = data.get("playerLast", player.player_last)
    player.team_id = data.get("teamId", player.team_id)
    player.player_number = data.get("playerNumber", player.player_number)
    player.player_position = data.get("playerPosition", player.player_position)

    if (not player.player_first or not player.player_last):
        return(
            jsonify({"message": "You must include a first name and last name"}), 400
        )

    db.session.commit()

    return jsonify({"message": "Player updated."}), 200

@app.route("/delete_player/<int:player_id>", methods=["DELETE"])
def delete_player(player_id):
    player = Player.query.get(player_id)

    if not player:
        return jsonify({"message": "Player not found"}), 404

    db.session.delete(player)
    db.session.commit()

    return jsonify({"message": "Player deleted!"}), 200

@app.route("/players_by_position", methods=["GET"])
def get_players_by_position():
    position = request.args.get("position")

    if position:
        players = Player.query.filter_by(player_position=position).all()
    else:
        # if no position is provided, return all players
        players = Player.query.all()

    json_players = list(map(lambda x: x.to_json(), players))
    return jsonify({"players": json_players})

# get
@app.route("/teams", methods=["GET"])
def get_teams():
    teams = Team.query.all()
    json_teams = list(map(lambda x: x.to_json(), teams))
    return jsonify({"teams": json_teams})

@app.route("/players_by_team", methods=["GET"])
def get_players_by_team():
    team_id = request.args.get("teamId")

    if team_id:
        players = Player.query.filter_by(team_id=team_id).all()
    else:
        # if no team is provided, return all players
        players = Player.query.all()

    json_players = list(map(lambda x: x.to_json(), players))
    return jsonify({"players": json_players})

# create
@app.route("/create_team", methods=["POST"])
def create_team():
    team_name = request.json.get("teamName")
    num_win = request.json.get("numWin")
    num_loss = request.json.get("numLoss")

    if (not team_name):
        return(
            jsonify({"message": "You must include a team name"}), 400
        )

    new_team = Team(team_name=team_name, num_win=num_win, num_loss=num_loss)

    try:
        db.session.add(new_team)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Team created!"}), 201

# update
@app.route("/update_team/<int:team_id>", methods=["PATCH"])
def update_team(team_id):
    team = Team.query.get(team_id)

    if not team:
        return jsonify({"message": "Team not found"}), 404

    data = request.json

    team.team_name = data.get("teamName", team.team_name)
    team.num_win = data.get("numWin", team.num_win)
    team.num_loss = data.get("numLoss", team.num_loss)

    if (not team.team_name):
        return(
            jsonify({"message": "You must include a team name"}), 400
        )
    
    db.session.commit()
    return jsonify({"message": "Team updated."}), 200


# delete
@app.route("/delete_team/<int:team_id>", methods=["DELETE"])
def delete_team(team_id):
    team = Team.query.get(team_id)
    
    if not team:
        return jsonify({"message": "Team not found"}), 404
    
    db.session.delete(team)
    db.session.commit()

    return jsonify({"message": "Team deleted!"}), 200

@app.route("/players_filtered", methods=["GET"])
def get_filtered_players():
    position = request.args.get("position")
    team_id = request.args.get("teamId")
    
    query = "SELECT * FROM player"
    params = {}

    # add filters if provided
    if position:
        query += " WHERE player_position = :position"
        params['position'] = position
    else:
        query += " WHERE 1=1"
    if team_id:
        query += " AND team_id = :team_id"
        params['team_id'] = team_id

    result = db.session.execute(text(query), params).mappings()
    
    # map database columns to keys
    players = [
        {
            "playerId": row["player_id"],
            "playerFirst": row["player_first"],
            "playerLast": row["player_last"],
            "teamId": row["team_id"],
            "playerNumber": row["player_number"],
            "playerPosition": row["player_position"]
        }
        for row in result
    ]

    return jsonify({"players": players})

@app.route("/staff", methods=["GET"])
def get_staff():
    staff = Staff.query.all()
    json_staff = list(map(lambda x: x.to_json(), staff))
    return jsonify({"staff": json_staff})

@app.route("/create_staff", methods=["POST"])
def create_staff():
    staff_first = request.json.get("staffFirst")
    staff_last = request.json.get("staffLast")
    team_id = request.json.get("teamId")
    title = request.json.get("title")

    if (not staff_first or not staff_last):
        return (
            jsonify({"message": "You must include a first name and last name"}), 400
        )

    new_staff = Staff(staff_first=staff_first,
                      staff_last=staff_last,
                      team_id=team_id,
                      title=title)
    
    try:
        db.session.add(new_staff)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Staff created!"}), 201

@app.route("/update_staff/<int:staff_id>", methods=["PATCH"])
def update_staff(staff_id):
    staff = Staff.query.get(staff_id)

    if not staff:
        return jsonify({"message": "Staff not found"}), 404
    
    data = request.json

    staff.staff_first = data.get("staffFirst", staff.staff_first)
    staff.staff_last = data.get("staffLast", staff.staff_last)
    staff.team_id = data.get("teamId", staff.team_id)
    staff.title = data.get("title", staff.title)

    if (not staff.staff_first or not staff.staff_last):
        return (jsonify({"message": "You must include a first name and last name"}), 400)
    
    db.session.commit()

    return jsonify({"message": "Staff updated."}), 200

@app.route("/delete_staff/<int:staff_id>", methods=["DELETE"])
def delete_staff(staff_id):
    staff = Staff.query.get(staff_id)

    if not staff:
        return jsonify({"message": "Staff not found"}), 404
    
    db.session.delete(staff)
    db.session.commit()

    return jsonify({"message": "Staff deleted!"}), 200

@app.route("/matches", methods=["GET"])
def get_matches():
    matches = Match.query.all()
    json_matches = list(map(lambda x: x.to_json(), matches))
    return jsonify({"matches": json_matches})

@app.route("/create_match", methods=["POST"])
def create_match():
    winning_team_id = request.json.get("winningTeamId")
    losing_team_id = request.json.get("losingTeamId")
    match_date = request.json.get("matchDate")
    winner_set_score = request.json.get("winnerSetScore")
    loser_set_score = request.json.get("loserSetScore")

    if (not winning_team_id or not losing_team_id):
        return (
            jsonify({"message": "You must include a winning team and losing team"}), 400
        )
    new_match = Match(winning_team_id=winning_team_id,
                      losing_team_id=losing_team_id,
                      match_date=match_date,
                      winner_set_score=winner_set_score,
                      loser_set_score=loser_set_score)
    
    try:
        db.session.add(new_match)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "Match created!"}), 201


@app.route("/update_match/<int:match_id>", methods=["PATCH"])
def update_match(match_id):
    match = Match.query.get(match_id)

    if not match:
        return jsonify({"message": "Match not found"}), 400
    
    data = request.json

    match.winning_team_id = data.get("winningTeamId", match.winning_team_id)
    match.losing_team_id = data.get("losingTeamId", match.losing_team_id)
    match.match_date = data.get("matchDate", match.match_date)
    match.winner_set_score = data.get("winnerSetScore", match.winner_set_score)
    match.loser_set_score = data.get("loserSetScore", match.loser_set_score)

    if (not match.winning_team_id or not match.losing_team_id):
        return (
            jsonify({"message": "You must include a winning team and losing team"}), 400
        )
    
    db.session.commit()

    return jsonify({"message": "Match updated."}), 200

@app.route("/delete_match/<int:match_id>", methods=["DELETE"])
def delete_match(match_id):
    match = Match.query.get(match_id)

    if not match:
        return jsonify({"message": "Match not found"}), 404
    
    db.session.delete(match)
    db.session.commit()

    return jsonify({"message": "Match deleted!"}), 200

if __name__ == "__main__":
    with app.app_context():
        # creates if db doesn't exist
        db.create_all()
    app.run(debug=True)




