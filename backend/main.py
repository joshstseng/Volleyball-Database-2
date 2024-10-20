from flask import request, jsonify
from config import app, db
from models import Player, Team



@app.route("/players", methods=["GET"])
def get_players():
    players = Player.query.all()
    json_players = list(map(lambda x: x.to_json(), players))
    return jsonify({"players": json_players})

@app.route("/create_player", methods=["POST"])
def create_player():
    player_id = request.json.get("playerId") # change this eventually?
    player_first = request.json.get("playerFirst")
    player_last = request.json.get("playerLast")
    team_id = request.json.get("teamId")
    player_number = request.json.get("playerNumber")
    player_dob = request.json.get("playerDob")
    player_position = request.json.get("playerPosition")

    if not player_first or not player_last or not team_id:
        return jsonify(({"message": "You must include first name, last name, and team ID"}), 400,)
    
    new_contact = Player(player_first=player_first,
                         player_last=player_last,
                         team_id=team_id,
                         player_number=player_number,
                         player_dob=player_dob,
                         player_position=player_position)

    try: # sldkfjdsl
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Player created!"}), 201

@app.route("/update_player/<int:player_id>", method="PATCH")
def update_player(player_id):
    player = Player.query.get(player_id)

    if not player:
        return jsonify({"message": "User not found"}), 404



if __name__ == "__main__":
    with app.app_context():
        # creates if db doesn't exist
        db.create_all()
    app.run(debug=True)