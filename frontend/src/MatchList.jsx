import React, { useState } from "react";

const MatchList = ({ matches, updateMatch, updateCallback, openCreateMatchModal, teams }) => {
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);

    const onDelete = async (matchId) => {
        try {
            const options = {
                method: "DELETE"
            };
            const response = await fetch(`http://127.0.0.1:5000/delete_match/${matchId}`, options);
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
                return team.teamName;
            }
        }
        return "Unknown";
    };

    const sortedMatches = [...matches].sort((a, b) => {
        if (!sortField || sortOrder === null) return 0;
        return sortOrder === 'asc'
            ? a[sortField].toString().localeCompare(b[sortField].toString())
            : b[sortField].toString().localeCompare(a[sortField].toString());
    });

    const renderSortArrow = (field) => {
        if (sortField !== field) return null;
        return sortOrder === 'asc' ? " ↓" : " ↑";
    };

    return (
        <div className="match-list-container">
            <div className="table-container">
                <h2>Matches</h2>
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
                                <span className="match-list-header action-header">Set Score</span>
                            </th>
                            <th>
                                <span className="match-list-header action-header">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedMatches.map((match) => (
                            <tr key={match.matchId}>
                                <td>{getTeamByID(match.winningTeamId)}</td>
                                <td>{getTeamByID(match.losingTeamId)}</td>
                                <td>{match.matchDate}</td>
                                <td>{match.winnerSetScore}-{match.loserSetScore}</td>
                                <td>
                                    <button onClick={() => updateMatch(match)}>Update</button>
                                    <button onClick={() => onDelete(match.matchId)}>Delete</button>
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
