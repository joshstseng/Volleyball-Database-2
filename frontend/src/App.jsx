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

  // Modal state for Players
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [selectedPosition, setSelectedPosition] = useState("");

  // Modal state for Teams
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState({});

  useEffect(() => {
    if (activeTab === "Players") {
      fetchPlayers();
      fetchTeams(); // Fetch teams so that team names can be shown in PlayerForm
    } else if (activeTab === "Teams") {
      fetchTeams();
    }
  }, [selectedPosition, activeTab]);

  const fetchPlayers = async () => {
    let endpoint = selectedPosition ?
      `http://127.0.0.1:5000/players_by_position?position=${selectedPosition}` :
      "http://127.0.0.1:5000/players";

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

  // Modal Handling for Players
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

  // Modal Handling for Teams
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

  const onUpdatePlayers = () => {
    closePlayerModal();
    fetchPlayers();
  };

  const onUpdateTeams = () => {
    closeTeamModal();
    fetchTeams();
  };

  const handlePositionChange = (e) => {
    setSelectedPosition(e.target.value);
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
        return <h2>Staff Page</h2>;
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
