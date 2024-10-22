from flask import request, jsonify
from config import app, db
from models import Player, Team
from sqlalchemy import text
from sqlalchemy.orm import Session

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

if __name__ == "__main__":
    with app.app_context():
        # creates if db doesn't exist
        db.create_all()
    app.run(debug=True)