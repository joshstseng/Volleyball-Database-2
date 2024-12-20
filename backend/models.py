from config import db
from sqlalchemy import Index

class Team(db.Model):
    team_id = db.Column(db.Integer, primary_key=True)
    team_name = db.Column(db.String(50), unique=False, nullable=False)
    num_win = db.Column(db.Integer)
    num_loss = db.Column(db.Integer)

    def to_json(self):
        return {
            "teamId": self.team_id,
            "teamName": self.team_name,
            "numWin": self.num_win,
            "numLoss": self.num_loss
        }
    __table_args__ = (
        Index('idx_team_id', 'team_id'),
    )

class Player(db.Model):
    player_id = db.Column(db.Integer, primary_key=True)
    player_first = db.Column(db.String(50), unique=False, nullable=False)
    player_last = db.Column(db.String(50), unique=False, nullable=False)
    team_id = db.Column(db.Integer, unique=False)
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
    
    __table_args__ = (
        Index('idx_player_id', 'player_id'),
    )
        
class Staff(db.Model):
    staff_id = db.Column(db.Integer, primary_key=True)
    staff_first = db.Column(db.String(50), unique=False, nullable=False)
    staff_last = db.Column(db.String(50), unique=False, nullable=False)
    team_id = db.Column(db.Integer, unique=False)
    title = db.Column(db.String(50), unique=False)

    def to_json(self):
        return {
            "staffId": self.staff_id,
            "staffFirst": self.staff_first,
            "staffLast": self.staff_last,
            "teamId": self.team_id,
            "title": self.title
        }


class Match(db.Model):
    match_id = db.Column(db.Integer, primary_key=True)
    winning_team_id = db.Column(db.Integer, unique=False, nullable=False)
    losing_team_id = db.Column(db.Integer, unique=False, nullable=False)
    match_date = db.Column(db.Date, unique=False)
    winner_set_score = db.Column(db.Integer, unique=False)
    loser_set_score = db.Column(db.Integer, unique=False)

    def to_json(self):
        return {
            "matchId": self.match_id,
            "winningTeamId": self.winning_team_id,
            "losingTeamId": self.losing_team_id,
            "matchDate": self.match_date,
            "winnerSetScore": self.winner_set_score,
            "loserSetScore": self.loser_set_score
        }

