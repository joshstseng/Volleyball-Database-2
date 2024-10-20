import { useState, useEffect } from 'react'
import './App.css'
import PlayerList from './PlayerList'
import PlayerForm from './PlayerForm'

function App() {

  const [players, setPlayers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState({})

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    const response = await fetch("http://127.0.0.1:5000/players")
    const data = await response.json()
    setPlayers(data.players)
    console.log(data.players)
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

  return <><PlayerList players={players} updatePlayer={openEditModal} updateCallback={onUpdate}/>
  <button onClick={openCreateModal}>Create New Player</button>
    {
      isModalOpen && <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <PlayerForm existingPlayer={currentPlayer} updateCallback={onUpdate}/>
        </div>
      </div>
    }
  </>
}

export default App
