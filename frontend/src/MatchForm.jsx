import { useState } from "react";

const MatchForm = ({ existingMatch = {}, updateCallback, teams = [] }) => {
    const [winningTeamId, setWinningTeamId] = useState(existingMatch.winningTeamId || "");
    const [losingTeamId, setLosingTeamId] = useState(existingMatch.losingTeamId || "");
    const [matchDate, setMatchDate] = useState(existingMatch.matchDate || "");
    const [winnerSetScore, setWinnerSetScore] = useState(existingMatch.winnerSetScore || "");
    const [loserSetScore, setLoserSetScore] = useState(existingMatch.loserSetScore || "");

    const updating = Object.entries(existingMatch).length !== 0;

    const onSubmit = async (e) => {
        e.preventDefault();

        const data = {
            winningTeamId,
            losingTeamId,
            matchDate,
            winnerSetScore,
            loserSetScore
        };

        const url = "http://127.0.0.1:5000/" + (updating ? `update_match/${existingMatch.matchId}` : "create_match");
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        const response = await fetch(url, options);

        if (response.status !== 201 && response.status !== 200) {
            const responseData = await response.json();
            alert(responseData.message);
        } else {
            updateCallback();
        }
    };

    return (
        <form className="matchForm" onSubmit={onSubmit}>
            <div>
                <label className="modalParameter" htmlFor="winningTeamId">Winning Team:</label>
                <select
                    id="winningTeamId"
                    value={winningTeamId}
                    onChange={(e) => setWinningTeamId(e.target.value)}
                    required
                >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                        <option key={team.teamId} value={team.teamId}>
                            {team.teamName}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="modalParameter" htmlFor="losingTeamId">Losing Team:</label>
                <select
                    id="losingTeamId"
                    value={losingTeamId}
                    onChange={(e) => setLosingTeamId(e.target.value)}
                    required
                >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                        <option key={team.teamId} value={team.teamId}>
                            {team.teamName}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="modalParameter" htmlFor="matchDate">Match Date:</label>
                <input
                    type="date"
                    id="matchDate"
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="modalParameter" htmlFor="winnerSetScore">Winner Set Score:</label>
                <input
                    type="number"
                    id="winnerSetScore"
                    value={winnerSetScore}
                    onChange={(e) => setWinnerSetScore(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="modalParameter" htmlFor="loserSetScore">Loser Set Score:</label>
                <input
                    type="number"
                    id="loserSetScore"
                    value={loserSetScore}
                    onChange={(e) => setLoserSetScore(e.target.value)}
                    required
                />
            </div>

            <button type="submit">{updating ? "Update" : "Create"} Match</button>
        </form>
    );
};

export default MatchForm;
