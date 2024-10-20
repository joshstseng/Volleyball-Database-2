import React from "react"

const PlayerList = ({ players, updatePlayer, updateCallback }) => {

    const onDelete = async (playerId) => {
        try {
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_player/${playerId}`, options)
            if (response.status === 200) {
                updateCallback()
            } else {
                console.error("Failed to delete")
            }
        } catch (error) {
            alert(error)
        }
        
    }

    return <div>
        <h2>Players</h2>
        <table>
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Number</th>
                    <th>Position</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {players.map((player) => (
                    <tr key={player.playerId}>
                        <td>{player.playerFirst}</td>
                        <td>{player.playerLast}</td>
                        <td>{player.playerNumber}</td>
                        <td>{player.playerPosition}</td>
                        <td>
                            <button onClick={() => updatePlayer(player)}>Update</button>
                            <button onClick={() => onDelete(player.playerId)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

export default PlayerList