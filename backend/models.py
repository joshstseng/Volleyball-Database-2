from config import db

class Team(db.Model):
    team_id = db.Column(db.Integer, primary_key=True)
    team_name = db.Column(db.String(50), unique=False, nullable=False)
    num_win = db.Column(db.Integer)
    num_loss = db.Column(db.Integer)
    # matches?

    def to_json(self):
        return {
            "teamId": self.team_id,
            "teamName": self.team_name,
            "numWin": self.num_win,
            "numLoss": self.num_loss
        }

class Player(db.Model):
    player_id = db.Column(db.Integer, primary_key=True)
    player_first = db.Column(db.String(50), unique=False, nullable=False)
    player_last = db.Column(db.String(50), unique=False, nullable=False)
    team_id = db.Column(db.String(50), unique=False)
    player_number = db.Column(db.Integer, unique=False)
    player_position = db.Column(db.String(3), unique=False)
    
    def to_json(self):
        return {
            "playerId": self.player_id,
            "playerFirst": self.player_first,
            "playerLast": self.player_last,
            "teamId": self.team_id,
            "playerNumber": self.player_number,
            "playerPosition": self.player_position
        }