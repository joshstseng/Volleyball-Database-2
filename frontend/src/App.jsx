import { useState, useEffect } from 'react';
import PlayerList from './PlayerList';
import TeamList from './TeamList';
import PlayerForm from './PlayerForm';
import TeamForm from './TeamForm';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState("Players");
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntity, setCurrentEntity] = useState({});
  const [selectedPosition, setSelectedPosition] = useState("");
  const [isTeam, setIsTeam] = useState(false);

  useEffect(() => {
    if (activeTab === "Players") {
      fetchPlayers();
    } else if (activeTab === "Teams") {
      fetchTeams();
    }
  }, [selectedPosition, activeTab]);

  const fetchPlayers = async () => {
    let endpoint = selectedPosition
      ? `http://127.0.0.1:5000/players_by_position?position=${selectedPosition}`
      : "http://127.0.0.1:5000/players";

    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.players);
      } else {
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
        setTeams([]);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      setTeams([]);
    }
  };

  const handlePositionChange = (e) => {
    setSelectedPosition(e.target.value);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEntity({});
  };

  const openCreateModal = (isTeam = false) => {
    if (!isModalOpen) {
      setIsTeam(isTeam);
      setIsModalOpen(true);
    }
  };

  const openEditModal = (entity, isTeam = false) => {
    if (isModalOpen) return;
    setIsTeam(isTeam);
    setCurrentEntity(entity);
    setIsModalOpen(true);
  };

  const onUpdate = () => {
    closeModal();
    if (isTeam) {
      fetchTeams();
    } else {
      fetchPlayers();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Players":
        return (
          <>
            {isModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={closeModal}>&times;</span>
                  <PlayerForm existingPlayer={currentEntity} updateCallback={onUpdate} />
                </div>
              </div>
            )}
            <PlayerList
              players={players}
              updatePlayer={(player) => openEditModal(player, false)}
              updateCallback={onUpdate}
              handlePositionChange={handlePositionChange}
              selectedPosition={selectedPosition}
              openCreateModal={() => openCreateModal(false)}
            />
          </>
        );
      case "Teams":
        return (
          <>
            {isModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={closeModal}>&times;</span>
                  <TeamForm existingTeam={currentEntity} updateCallback={onUpdate} />
                </div>
              </div>
            )}
            <TeamList
              teams={teams}
              updateTeam={(team) => openEditModal(team, true)}
              updateCallback={onUpdate}
              openCreateTeamModal={() => openCreateModal(true)}
            />
          </>
        );
      case "Staff":
        return <h2>Staff Page</h2>; // Placeholder for Staff page
      case "Matches":
        return <h2>Matches Page</h2>; // Placeholder for Matches page
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
