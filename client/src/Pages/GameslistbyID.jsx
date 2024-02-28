

import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Loading from '../Components/Loading';

const GameslistbyID = () => {
    const [displayedGame, setDisplayedGame] = useState([]);
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`/games-list/${id}`)
            .then(response => response.json())
            .then(data => setDisplayedGame(data))
            .then(setIsLoading(false))
            .catch(error => console.error("Error while fetching the game: ", error))
    }, []);


    console.log(displayedGame);

    /* if (isLoading) {
        return <h2>Loading...</h2>
    } */


    if (isLoading) {
        return <Loading />
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Max Players</th>
                    </tr>
                </thead>

                        <tr>
                            <td>{displayedGame.name}</td>
                            <td>{displayedGame.maxPlayers}</td>
                        </tr>



            </table>


        </div>
    )
}

export default GameslistbyID;