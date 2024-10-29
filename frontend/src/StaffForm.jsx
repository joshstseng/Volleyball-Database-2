import { useState } from "react";

const StaffForm = ({ existingStaff = {}, updateCallback, teams = [] }) => {

    const [staffFirst, setStaffFirst] = useState(existingStaff.staffFirst || "");
    const [staffLast, setStaffLast] = useState(existingStaff.staffLast || "");
    const [teamId, setTeamId] = useState(existingStaff.teamId || 0);
    const [title, setTitle] = useState(existingStaff.title || "");

    const updating = Object.entries(existingStaff).length !== 0;

    const onSubmit = async (e) => {
        e.preventDefault();

        const data = {
            staffFirst,
            staffLast,
            teamId,
            title,
        };

        const url = "http://127.0.0.1:5000/" + (updating ? `update_staff/${existingStaff.staffId}` : "create_staff");
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
        <form className="staffForm" onSubmit={onSubmit}>
            <div>
                <label className="modalParameter" htmlFor="staffFirst">First Name:</label>
                <input 
                    type="text"
                    id="staffFirst" 
                    value={staffFirst} 
                    onChange={(e) => setStaffFirst(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="modalParameter" htmlFor="staffLast">Last Name:</label>
                <input 
                    type="text"
                    id="staffLast" 
                    value={staffLast} 
                    onChange={(e) => setStaffLast(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="modalParameter" htmlFor="teamId">Team:</label>
                <select
                    id="teamId"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
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
                <label className="modalParameter" htmlFor="staffTitle">Title:</label>
                <input
                    type="text"
                    id="staffTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <button type="submit">{updating ? "Update" : "Create"}</button>
        </form>
    );
};

export default StaffForm;
