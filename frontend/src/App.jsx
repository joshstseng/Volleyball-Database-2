import { useState, useEffect } from 'react';
import PlayerList from './PlayerList';
import TeamList from './TeamList';
import StaffList from './StaffList';
import PlayerForm from './PlayerForm';
import TeamForm from './TeamForm';
import StaffForm from './StaffForm';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState("Players");
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [staff, setStaff] = useState([]);

  // Modal states for Players, Teams, and Staff
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [currentTeam, setCurrentTeam] = useState({});
  const [currentStaff, setCurrentStaff] = useState({});
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");

  useEffect(() => {
    if (activeTab === "Players") {
      fetchPlayers();
      fetchTeams();
    } else if (activeTab === "Teams") {
      fetchTeams();
    } else if (activeTab === "Staff") {
      fetchStaff();
      fetchTeams();
    }
  }, [selectedPosition, selectedTeamId, activeTab]);

  const fetchPlayers = async () => {
    let endpoint = `http://127.0.0.1:5000/players_filtered?position=${selectedPosition}&teamId=${selectedTeamId}`;

    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.players);
      } else {
        console.error("Failed to fetch players");
        setPlayers([]);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      setPlayers([]);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/teams");
      if (response.ok) {
        const data = await response.json();
        setTeams(data.teams);
      } else {
        console.error("Failed to fetch teams");
        setTeams([]);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      setTeams([]);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/staff");
      if (response.ok) {
        const data = await response.json();
        setStaff(data.staff);
      } else {
        console.error("Failed to fetch staff");
        setStaff([]);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      setStaff([]);
    }
  };

  // Modal Handling for Players, Teams, and Staff
  const closePlayerModal = () => {
    setIsPlayerModalOpen(false);
    setCurrentPlayer({});
  };

  const openCreatePlayerModal = () => {
    setCurrentPlayer({});
    setIsPlayerModalOpen(true);
  };

  const openEditPlayerModal = (player) => {
    setCurrentPlayer(player);
    setIsPlayerModalOpen(true);
  };

  const closeTeamModal = () => {
    setIsTeamModalOpen(false);
    setCurrentTeam({});
  };

  const openCreateTeamModal = () => {
    setCurrentTeam({});
    setIsTeamModalOpen(true);
  };

  const openEditTeamModal = (team) => {
    setCurrentTeam(team);
    setIsTeamModalOpen(true);
  };

  const closeStaffModal = () => {
    setIsStaffModalOpen(false);
    setCurrentStaff({});
  };

  const openCreateStaffModal = () => {
    setCurrentStaff({});
    setIsStaffModalOpen(true);
  };

  const openEditStaffModal = (staffMember) => {
    setCurrentStaff(staffMember);
    setIsStaffModalOpen(true);
  };

  const onUpdatePlayers = () => {
    closePlayerModal();
    fetchPlayers();
  };

  const onUpdateTeams = () => {
    closeTeamModal();
    fetchTeams();
  };

  const onUpdateStaff = () => {
    closeStaffModal();
    fetchStaff();
  };

  const handlePositionChange = (e) => {
    setSelectedPosition(e.target.value);
  };

  const handleTeamChange = (e) => {
    setSelectedTeamId(e.target.value);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Players":
        return (
          <>
            {isPlayerModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={closePlayerModal}>&times;</span>
                  <PlayerForm existingPlayer={currentPlayer} updateCallback={onUpdatePlayers} teams={teams} />
                </div>
              </div>
            )}
            <PlayerList
              players={players}
              teams={teams}
              updatePlayer={openEditPlayerModal}
              updateCallback={onUpdatePlayers}
              handlePositionChange={handlePositionChange}
              selectedPosition={selectedPosition}
              handleTeamChange={handleTeamChange}
              selectedTeamId={selectedTeamId}
              openCreateModal={openCreatePlayerModal}
            />
          </>
        );
      case "Teams":
        return (
          <>
            {isTeamModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={closeTeamModal}>&times;</span>
                  <TeamForm existingTeam={currentTeam} updateCallback={onUpdateTeams} />
                </div>
              </div>
            )}
            <TeamList
              teams={teams}
              updateTeam={openEditTeamModal}
              updateCallback={onUpdateTeams}
              openCreateTeamModal={openCreateTeamModal}
            />
          </>
        );
      case "Staff":
        return (
          <>
            {isStaffModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={closeStaffModal}>&times;</span>
                  <StaffForm existingStaff={currentStaff} updateCallback={onUpdateStaff} teams={teams} />
                </div>
              </div>
            )}
            <StaffList
              staff={staff}
              teams={teams}
              updateStaff={openEditStaffModal}
              updateCallback={onUpdateStaff}
              openCreateStaffModal={openCreateStaffModal}
            />
          </>
        );
      case "Matches":
        return <h2>Matches Page</h2>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <header className="sticky-header">
          <button onClick={() => setActiveTab("Teams")}>Teams</button>
          <button onClick={() => setActiveTab("Players")}>Players</button>
          <button onClick={() => setActiveTab("Staff")}>Staff</button>
          <button onClick={() => setActiveTab("Matches")}>Matches</button>
        </header>

        <div className="content-container">
          {renderContent()}
        </div>
      </div>
    </>
  );
}

export default App;
