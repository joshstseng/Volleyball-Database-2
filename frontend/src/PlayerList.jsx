import React, { useState } from "react";

const PlayerList = ({ players, updatePlayer, updateCallback, handlePositionChange, selectedPosition, openCreateModal, teams }) => {
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);

    const onDelete = async (playerId) => {
        try {
            const options = {
                method: "DELETE"
            };
            const response = await fetch(`http://127.0.0.1:5000/delete_player/${playerId}`, options);
            if (response.status === 200) {
                updateCallback();
            } else {
                console.error("Failed to delete");
            }
        } catch (error) {
            alert(error);
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            if (sortOrder === 'asc') {
                setSortOrder('desc');
            } else if (sortOrder === 'desc') {
                setSortOrder(null);
                setSortField(null);
            } else {
                setSortOrder('asc');
            }
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const getTeamByID = (team_id) => {

        for (const team of teams) {
            
            if (parseInt(team.teamId) === parseInt(team_id)) {
                return team.teamName; // Return the team name if found
            }
        }
        return "Unknown"; // Default value if no match is found
    };
    

    const sortedPlayers = [...players].sort((a, b) => {
        if (!sortField || sortOrder === null) return 0;
        if (sortField === 'playerNumber') {
            return sortOrder === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
        } else {
            return sortOrder === 'asc'
                ? a[sortField].localeCompare(b[sortField])
                : b[sortField].localeCompare(a[sortField]);
        }
    });

    const renderSortArrow = (field) => {
        if (sortField !== field) return null;
        if (sortOrder === 'asc') return " ↓";
        if (sortOrder === 'desc') return " ↑";
        return null;
    };

    return (
        <div className="player-list-container">
            <div className="table-container">
                <h2>Players</h2>
                <table>
                    <thead>
                        <tr>
                            <th>
                                <button className="player-list-header" onClick={() => handleSort("playerFirst")}>
                                    First Name {renderSortArrow("playerFirst")}
                                </button>
                            </th>
                            <th>
                                <button className="player-list-header" onClick={() => handleSort("playerLast")}>
                                    Last Name {renderSortArrow("playerLast")}
                                </button>
                            </th>
                            <th>
                                <button className="player-list-header" onClick={() => handleSort("playerNumber")}>
                                    Number {renderSortArrow("playerNumber")}
                                </button>
                            </th>
                            <th>
                                <button className="player-list-header">
                                    Position
                                </button>
                            </th>
                            <th>
                                <button className="player-list-header">
                                    Team
                                </button>
                            </th>
                            <th>
                                <button className="player-list-header action-header" disabled>
                                    Actions
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPlayers.map((player) => (
                            <tr key={player.playerId}>
                                <td>{player.playerFirst}</td>
                                <td>{player.playerLast}</td>
                                <td>{player.playerNumber}</td>
                                <td>{player.playerPosition}</td>
                                <td>{getTeamByID(player.teamId)}</td>
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
                    <label className="selectPositionTitle" htmlFor="positionSelect">Select Position:</label>
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
