import React, { useState } from "react";

const StaffList = ({ staff, updateStaff, updateCallback, openCreateStaffModal, handleStaffChange, selectedStaff, teams }) => {

    const [sortField, setSortField] = useState(null); // track current sort field
    const [sortOrder, setSortOrder] = useState(null); // track sort order: 'asc', 'desc', or 'none'

    const onDelete = async (staffId) => {
        try {
            console.log(staffId)
            const options = {
                method: "DELETE"
            };
            const response = await fetch(`http://127.0.0.1:5000/delete_staff/${staffId}`, options);
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

    const getTeamByID = (team_id) => {
        for (const team of teams) {
            if (parseInt(team.teamId) === parseInt(team_id)) {
                return team.teamName;
            }
        }
        return "Unknown";
    };

    // Function to sort staff array based on field and order
    const sortedStaff = [...staff].sort((a, b) => {
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
        <div className="staff-list-container">
            <div className="table-container">
                <h2>Staff</h2>
                <table>
                    <thead>
                        <tr>
                            <th>
                                <button className="player-list-header" onClick={() => handleSort("staffFirst")}>
                                    First Name {renderSortArrow("staffFirst")}
                                </button>
                            </th>
                            <th>
                                <button className="player-list-header" onClick={() => handleSort("staffLast")}>
                                    Last Name {renderSortArrow("staffLast")}
                                </button>
                            </th>
                            <th>
                                <button className="player-list-header" onClick={() => handleSort("teamId")}>
                                    Team {renderSortArrow("teamId")}
                                </button>
                            </th>
                            <th>
                                <button className="player-list-header" onClick={() => handleSort("title")}>
                                    Title {renderSortArrow("title")}
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
                        {sortedStaff.map((staff) => (
                            <tr key={staff.staffId}>
                                <td>{staff.staffFirst}</td>
                                <td>{staff.staffLast}</td>
                                <td>{getTeamByID(staff.teamId)}</td>
                                <td>{staff.title}</td>
                                <td>
                                    <button onClick={() => updateStaff(staff)}>Update</button>
                                    <button onClick={() => onDelete(staff.staffId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="staff-controls">
                <button onClick={openCreateStaffModal}>Create New Staff</button>
            </div>
        </div>
    );
};

export default StaffList;
