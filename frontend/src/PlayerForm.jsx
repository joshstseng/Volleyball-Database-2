import { useState } from "react";

const PlayerForm = ({ existingPlayer = {}, updateCallback, teams = [] }) => {
    const [playerFirst, setPlayerFirst] = useState(existingPlayer.playerFirst || "");
    const [playerLast, setPlayerLast] = useState(existingPlayer.playerLast || "");
    const [playerNumber, setPlayerNumber] = useState(existingPlayer.playerNumber || "");
    const [playerPosition, setPlayerPosition] = useState(existingPlayer.playerPosition || "");
    const [teamId, setTeamId] = useState(existingPlayer.teamId || ""); // Store the teamId

    const updating = Object.entries(existingPlayer).length !== 0;

    const onSubmit = async (e) => {
        e.preventDefault();

        const data = {
            playerFirst,
            playerLast,
            playerNumber,
            playerPosition,
            teamId, // Ensure teamId is sent to the backend
        };

        const url = "http://127.0.0.1:5000/" + (updating ? `update_player/${existingPlayer.playerId}` : "create_player");
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        const response = await fetch(url, options);

        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json();
            alert(data.message);
        } else {
            updateCallback();
        }
    };

    return (
        <form className="playerForm" onSubmit={onSubmit}>
            <div>
                <label className="modalParameter" htmlFor="playerFirst">First Name:</label>
                <input
                    type="text"
                    id="playerFirst"
                    value={playerFirst}
                    onChange={(e) => setPlayerFirst(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="modalParameter" htmlFor="playerLast">Last Name:</label>
                <input
                    type="text"
                    id="playerLast"
                    value={playerLast}
                    onChange={(e) => setPlayerLast(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="modalParameter" htmlFor="playerNumber">Player Number:</label>
                <input
                    type="number"
                    id="playerNumber"
                    value={playerNumber}
                    onChange={(e) => setPlayerNumber(e.target.value)}
                />
            </div>

            <div>
                <label className="modalParameter" htmlFor="playerPosition">Position:</label>
                <select
                    id="playerPosition"
                    value={playerPosition}
                    onChange={(e) => setPlayerPosition(e.target.value)}
                >
                    <option value="">Select Position</option>
                    <option value="S">Setter</option>
                    <option value="OH">Outside Hitter</option>
                    <option value="MB">Middle Blocker</option>
                    <option value="L/DS">Libero/DS</option>
                    <option value="OP">Opposite Hitter</option>
                </select>
            </div>

            <div>
                <label className="modalParameter" htmlFor="teamId">Team:</label>
                <select
                    id="teamId"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                        <option key={team.teamId} value={team.teamId}>
                            {team.teamName}
                        </option>
                    ))}
                </select>
            </div>

            <button type="submit">{updating ? "Update" : "Create"}</button>
        </form>
    );
};

export default PlayerForm;
