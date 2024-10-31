import React, { useState } from "react";

const MatchList = ({ matches, updateMatch, updateCallBack, handleMatchChange, selectedMatch, openCreateMatchModal }) => {

    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);

    const onDelete = async (matchId) => {
        try {
            const options = {
                method: "DELETE"
            };
            const response = await fetch (`http://127.0.0.1:5000/delete_match/${matchId}`, options);
            if (response.status === 200) {
                updateCallBack();
            } else {
                console.error("Failed to delete");
            }
        } catch (error) {
            alert(error);
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            // cycle through: ascending -> descending -> none
            if (sortOrder === 'asc') {
                setSortOrder('desc');
            } else if (sortOrder === 'desc') {
                setSortOrder(null);
                setSortField(null); // Clear sorting
            } else {
                setSortOrder('asc');
            }
        } else {
            // Set new field and start with ascending
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const sortedMatches = [...matches].sort((a, b) => {
        if (!sortField || sortOrder === null) return 0; // no sorting

        return sortOrder === 'asc'
            ? a[sortField].localeCompare(b[sortField])
            : b[sortField].localeCompare(a[sortField]);
        
    });

    const renderSortArrow = (field) => {
        if (sortField !== field) return null; // no arrow if not the sorted field
        if (sortOrder === 'asc') return " ↓";
        if (sortOrder === 'desc') return " ↑";
        return null;
    };

    return (
        <div className="match-list-container">
            <div className="table-container">
                <h2>Teams</h2>
                <table>
                    <thead>
                        <tr>
                            <th>
                                <button className="match-list-header" onClick={() => handleSort("winningTeamId")}>
                                    Winning Team {renderSortArrow("winningTeamId")}
                                </button>
                            </th>
                            <th>
                                <button className="match-list-header" onClick={() => handleSort("losingTeamId")}>
                                    Losing Team {renderSortArrow("losingTeamId")}
                                </button>
                            </th>
                            <th>
                                <button className="match-list-header" onClick={() => handleSort("matchDate")}>
                                    Match Date {renderSortArrow("matchDate")}
                                </button>
                            </th>
                            <th>
                                <button className="match-list-header action-header" disabled>
                                    Set Score
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
                        {sortedMatches.map((match) => (
                            <tr key={match.matchId}>
                                <td>{match.winningTeamId}</td>
                                <td>{match.losingTeamId}</td>
                                <td>{match.matchDate}</td>
                                <td>{match.winningSetScore}-{match.losingSetScore}</td>
                                <td>
                                    <button onClick={() => updateTeam(team)}>Update</button>
                                    <button onClick={() => onDelete(team.teamId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="match-controls">
                <button onClick={openCreateMatchModal}>Create New Match</button>
            </div>
        </div>
    );
};

export default MatchList;