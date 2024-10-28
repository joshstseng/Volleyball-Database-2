from flask import request, jsonify
from config import app, db
from models import Player, Team
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy import select

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
    new_player = Player(
                         player_first=player_first,
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
        return jsonify({"message": "User not found"}), 404
    
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
        return jsonify({"message": "User not found"}), 404

    db.session.delete(player)
    db.session.commit()

    return jsonify({"message": "User deleted!"}), 200

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
def get_players_filtered():
    position = request.args.get("position")
    team_id = request.args.get("teamId")

    # Start with the base query
    query = Player.query

    # Apply filters if the parameters are provided
    if position:
        query = query.filter_by(player_position=position)
    if team_id:
        query = query.filter_by(team_id=team_id)

    players = query.all()
    json_players = list(map(lambda x: x.to_json(), players))
    return jsonify({"players": json_players})


if __name__ == "__main__":
    with app.app_context():
        # creates if db doesn't exist
        db.create_all()
    app.run(debug=True)