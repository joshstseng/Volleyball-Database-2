import React from "react";

const PlayerList = ({ players, updatePlayer, updateCallback, handlePositionChange, selectedPosition, openCreateModal }) => {

    const onDelete = async (playerId) => {
        try {
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_player/${playerId}`, options)
            if (response.status === 200) {
                updateCallback();
            } else {
                console.error("Failed to delete");
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className="player-list-container">
            <div className="table-container">
                <h2>Players</h2>
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Number</th>
                            <th>Position</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player) => (
                            <tr key={player.playerId}>
                                <td>{player.playerFirst}</td>
                                <td>{player.playerLast}</td>
                                <td>{player.playerNumber}</td>
                                <td>{player.playerPosition}</td>
                                <td>
                                    <button onClick={() => updatePlayer(player)}>Update</button>
                                    <button onClick={() => onDelete(player.playerId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="player-controls">
                <button onClick={openCreateModal}>Create New Player</button>
                <div className="position-select-container">
                    <label htmlFor="positionSelect">Select Position:</label>
                    <select
                        id="positionSelect"
                        value={selectedPosition}
                        onChange={handlePositionChange}
                    >
                        <option value="">All Positions</option>
                        <option value="S">Setter</option>
                        <option value="OH">Outside Hitter</option>
                        <option value="MB">Middle Blocker</option>
                        <option value="L/DS">Libero/DS</option>
                        <option value="OP">Opposite Hitter</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default PlayerList;
