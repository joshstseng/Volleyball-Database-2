import { useState } from "react"

const PlayerForm = ({ existingPlayer = {}, updateCallback}) => {

    const [playerFirst, setPlayerFirst] = useState(existingPlayer.playerFirst || "")
    const [playerLast, setPlayerLast] = useState(existingPlayer.playerLast || "")
    const [playerNumber, setPlayerNumber] = useState(existingPlayer.playerNumber || "")
    const [playerPosition, setPlayerPosition] = useState(existingPlayer.playerPosition || "")

    const updating = Object.entries(existingPlayer).length !== 0

    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            playerFirst,
            playerLast,
            playerNumber,
            playerPosition
        }
        const url = "http://127.0.0.1:5000/" + (updating ? `update_player/${existingPlayer.playerId}` : "create_player")
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options)

        if (response.status !== 201 && response.status !== 200) {
            // fail
            const data = await response.json()
            alert(data.message)
        } else {
            // success
            updateCallback()
        }
    }

    return (
        <form className="playerForm" onSubmit={onSubmit}>
            <div>
                <label className="modalParameter" htmlFor="playerFirst">First Name:</label>
                <input 
                    type="text"
                    id="playerFirst" 
                    value={playerFirst} 
                    onChange={(e) => setPlayerFirst(e.target.value)}
                />
            </div>

            <div>
                <label className="modalParameter" htmlFor="playerLast">Last Name:</label>
                <input 
                    type="text"
                    id="playerLast" 
                    value={playerLast} 
                    onChange={(e) => setPlayerLast(e.target.value)}
                />
            </div>

            <div>
                <label className="modalParameter" htmlFor="playerNumber">Player Number:</label>
                <input 
                    type="text"
                    id="playerNumber" 
                    value={playerNumber} 
                    onChange={(e) => setPlayerNumber(e.target.value)}
                />
            </div>

            <div>
                <label className="modalParameter" htmlFor="playerPosition">Position:</label>
                <select 
                    id="playerPosition" 
                    value={playerPosition} 
                    onChange={(e) => setPlayerPosition(e.target.value)}
                >
                    <option value="">Select Position</option>
                    <option value="S">S</option>
                    <option value="OH">OH</option>
                    <option value="MB">MB</option>
                    <option value="L/DS">L/DS</option>
                    <option value="OP">OP</option>
                </select>
            </div>

            <button type="submit">{updating ? "Update" : "Create"}</button>
        </form>
    );
};

export default PlayerForm
