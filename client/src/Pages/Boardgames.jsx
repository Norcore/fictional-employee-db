

import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const Boardgames = () => {
    const [gameName, setGameName] = useState("");
    const [gamePlayers, setGamePlayers] = useState("");

    const addGame = () => {
        fetch('http://process.env.BACKEND_URL/games', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: gameName,
                maxPlayers: gamePlayers,
            }),
        })
                .then(response => response.json())
                .then(setGameName(""))
                .then(setGamePlayers(""))
                .catch(error => console.error("Error fetching games: ", error))
    };

    const handleGameName = (e) => {
        setGameName(e.target.value)
    };

    const handleGamePlayers = (e) => {
        setGamePlayers(e.target.value)
    };

    return (
        <div>

            <h2>Add New Board Games</h2>

            <label>Name: </label>
            <input type="text"
                id="boardGameName"
                value={gameName}
                onChange={handleGameName}></input>


            <label>Max Players: </label>
            <input type="text"
                id="boardGamePlayers"
                value={gamePlayers}
                onChange={handleGamePlayers}></input>

            <button type="button" onClick={addGame}>Add Game</button>
            <Link to='http://process.env.FRONTEND_URL/games-list'>
                <button type="button">Show Games</button>
            </Link>
        </div>
    )

}

export default Boardgames;