

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const Gameslist = () => {
    const [availableGames, setAvailableGames] = useState([]);
    const [playerCount, setPlayerCount] = useState("");


    useEffect(() => {
        fetch(`http://process.env.BACKEND_URL/games-list?maxPlayers=${playerCount}`)
        .then(response => response.json())
        .then(data => setAvailableGames(data))
        .catch(error => error.console("Error fetching games: ", error))
    }, [playerCount]);

    const handlePlayerCount = (e) => {
        setPlayerCount(e.target.value);
    };

  return (
    <div>

<h2>Boardgames</h2>
<label>Max Player filter: </label>
<input type="number" onChange={handlePlayerCount}></input>

        <table>
            <thead>
                <tr>
                <th>Name</th>
                <th>Max Players</th>
                </tr>
            </thead>
            {availableGames.map(games => {
                return (
                    <tr>
                        <td>{games.name}</td>
                        <td>{games.maxPlayers}</td>
                        <Link to={`http://process.env.FRONTEND_URL/games-list/${games._id}`}>
                        <button type="button">Show More</button>
                        
                        </Link>
                    </tr>
                    
                )
            })}
        </table>

    </div>
  )
};

export default Gameslist;
