import React, { useState } from "react";

const TeamList = ({ teams, updateTeam, updateCallback, handleTeamChange, selectedTeam, openCreateTeamModal }) => {

    const [sortField, setSortField] = useState(null); // track current sort field
    const [sortOrder, setSortOrder] = useState(null); // track sort order: 'asc', 'desc', or 'none'

    const onDelete = async (teamId) => {
        try {
            const options = {
                method: "DELETE"
            };
            const response = await fetch(`http://127.0.0.1:5000/delete_team/${teamId}`, options);
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

    // Function to sort teams array based on field and order
    const sortedTeams = [...teams].sort((a, b) => {
        if (!sortField || sortOrder === null) return 0; // no sorting

        return sortOrder === 'asc'
            ? a[sortField].localeCompare(b[sortField])
            : b[sortField].localeCompare(a[sortField]);
        
    });
    
    // Function to render the arrow based on sortOrder
    const renderSortArrow = (field) => {
        if (sortField !== field) return null; // no arrow if not the sorted field
        if (sortOrder === 'asc') return " ↓";
        if (sortOrder === 'desc') return " ↑";
        return null;
    };

    return (
        <div className="team-list-container">
            <div className="table-container">
                <h2>Teams</h2>
                <table>
                    <thead>
                        <tr>
                            <th>
                                <button className="team-list-header" onClick={() => handleSort("teamName")}>
                                    Team {renderSortArrow("teamName")}
                                </button>
                            </th>
                            <th>
                                <button className="player-list-header action-header" disabled>
                                    Wins
                                </button>
                            </th>
                            <th>
                                <button className="player-list-header action-header" disabled>
                                    Losses
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
                        {sortedTeams.map((team) => (
                            <tr key={team.teamId}>
                                <td>{team.teamName}</td>
                                <td>{team.numWin}</td>
                                <td>{team.numLoss}</td>
                                <td>
                                    <button onClick={() => updateTeam(team)}>Update</button>
                                    <button onClick={() => onDelete(team.teamId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="team-controls">
                <button onClick={openCreateTeamModal}>Create New Team</button>
            </div>
        </div>
    );
};

export default TeamList;
