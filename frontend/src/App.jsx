import { useState, useEffect } from 'react'
import './App.css'
import PlayerList from './PlayerList'
import PlayerForm from './PlayerForm'

function App() {

  const [players, setPlayers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState({})
  const [selectedPosition, setSelectedPosition] = useState("")

  useEffect(() => {
    fetchPlayers()
  }, [selectedPosition])

  const fetchPlayers = async () => {
    let endpoint = selectedPosition ? 
      `http://127.0.0.1:5000/players_by_position?position=${selectedPosition}` :
      "http://127.0.0.1:5000/players"; // Use /players if no position is selected    

    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        console.log(data); // Check the fetched player data
        setPlayers(data.players);
        console.log(data.players);
      } else {
        console.error("Failed to fetch players");
        setPlayers([]);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      setPlayers([]);
    }
  };

  const handlePositionChange = (e) => {
    setSelectedPosition(e.target.value);
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentPlayer({})
  }

  const openCreateModal = () => {
    if (!isModalOpen) {
      setIsModalOpen(true)
    }
  }

  const openEditModal = (player) => {
    if (isModalOpen) return
    setCurrentPlayer(player)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchPlayers()
  }

  return (
    <>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <PlayerForm existingPlayer={currentPlayer} updateCallback={onUpdate}/>
          </div>
        </div>
      )}

      <PlayerList 
        players={players} 
        updatePlayer={openEditModal} 
        updateCallback={onUpdate}
        handlePositionChange={handlePositionChange} 
        selectedPosition={selectedPosition}
        openCreateModal={openCreateModal} // Pass down the function to trigger the modal
      />
    </>
  );
}

export default App;
