

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Divisions = () => {
    const [availableDivisions, setAvailableDivisions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('http://procecc.env.BACKEND_URL/api/divisions')
            .then(response => response.json())
            .then(data => setAvailableDivisions(data))
            .then(setIsLoading(false))
            .catch(error => console.error("Error while fetching divisions: ", error))
    }, []);


    console.log(availableDivisions);


    if (isLoading) {
        return <h2>Loading...</h2>
    }

    return (
        <div>
            <h2>Divisions</h2>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Boss</th>
                        <th>Budget</th>
                        <th>Country</th>
                        <th>City</th>
                    </tr>
                </thead>

                <tbody>
                    {availableDivisions.map(division => {
                        return (

                            <tr key={division._id}>
                                <td>{division.name ? division.name : ""} </td>
                                <td>{division.boss ? division.boss.name : ""}</td>
                                <td>{division.budget ? division.budget : ""}</td>
                                <td>{division.location ? division.location.country : ""}</td>
                                <td>{division.location ? division.location.city : ""}</td>


                                <td>
                                    <Link to={`http://procecc.env.FRONTEND_URL/divisions/${division._id}`}>
                                        <button type="button">Edit Division</button>
                                    </Link>

                                </td>


                                <td>
                                <Link to={`http://procecc.env.FRONTEND_URL/divisions/${division._id}/details`}>
                                    <button type="button">Show more</button>
                                </Link>

                                </td>

                            </tr>




                        )
                    })}
                </tbody>
            </table>

            <Link to={'http://procecc.env.FRONTEND_URL/divisions/create'}>
                <button type="button">Add new division</button>
            </Link>

        </div>
    )
}

export default Divisions;