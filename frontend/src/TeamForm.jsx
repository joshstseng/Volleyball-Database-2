import { useState } from "react";

const TeamForm = ({ existingTeam = {}, updateCallback }) => {

    const [teamName, setTeamName] = useState(existingTeam.teamName || "");
    const [numWin, setNumWin] = useState(existingTeam.numWin || 0);
    const [numLoss, setNumLoss] = useState(existingTeam.numLoss || 0);

    const updating = Object.entries(existingTeam).length !== 0;

    const onSubmit = async (e) => {
        e.preventDefault();

        // Ensure wins and losses are non-negative integers
        const wins = Math.max(0, parseInt(numWin, 10) || 0);
        const losses = Math.max(0, parseInt(numLoss, 10) || 0);

        const data = {
            teamName,
            numWin: wins,
            numLoss: losses,
        };

        const url = "http://127.0.0.1:5000/" + (updating ? `update_team/${existingTeam.teamId}` : "create_team");
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        const response = await fetch(url, options);

        if (response.status !== 201 && response.status !== 200) {
            // fail
            const data = await response.json();
            alert(data.message);
        } else {
            // success
            updateCallback();
        }
    };

    return (
        <form className="teamForm" onSubmit={onSubmit}>
            <div>
                <label className="modalParameter" htmlFor="teamName">Team Name:</label>
                <input 
                    type="text"
                    id="teamName" 
                    value={teamName} 
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="modalParameter" htmlFor="numWin">Number of wins:</label>
                <input 
                    type="number"
                    id="numWin" 
                    value={numWin} 
                    onChange={(e) => setNumWin(e.target.value)}
                    min="0"
                    required
                />
            </div>

            <div>
                <label className="modalParameter" htmlFor="numLoss">Number of losses:</label>
                <input 
                    type="number"
                    id="numLoss" 
                    value={numLoss} 
                    onChange={(e) => setNumLoss(e.target.value)}
                    min="0"
                    required
                />
            </div>

            <button type="submit">{updating ? "Update" : "Create"}</button>
        </form>
    );
};

export default TeamForm;
