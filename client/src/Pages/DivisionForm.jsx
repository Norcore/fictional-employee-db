

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DivisionForm = () => {
    const [displayedDivision, setDisplayedDivision] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    const [divisionName, setDivisionName] = useState("");
    const [divisionBoss, setDivisionBoss] = useState("");
    const [divisionBudget, setDivisionBudget] = useState("");
    const [divisionCountry, setDivisionCountry] = useState("");
    const [divisionCity, setDivisionCity] = useState("");

    const [availableBosses, setAvailableBosses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Display edited country
    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_BACKEND_URL}/api/divisions/${id}`)
        .then(response => response.json())
        .then(data => setDisplayedDivision(data))
        .then(setIsLoading(false))
        .catch(error => console.error("Error while fetching division", error))

    }, []);


    const handleDivisionName = (e) => {
        setDivisionName(e.target.value)
    };
    const handleDivisionBoss = (e) => {
        setDivisionBoss(e.target.value)
    };
    const handleDivisionBudget = (e) => {
        setDivisionBudget(e.target.value)
    };
    const handleDivisionCountry = (e) => {
        setDivisionCountry(e.target.value)
    };
    const handleDivisionCity = (e) => {
        setDivisionCity(e.target.value)
    };

    // Fetch boss candidates
    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_BACKEND_URL}/api/employees/candidates`)
            .then(response => response.json())
            .then(data => setAvailableBosses(data))
            .catch(error => console.error("Failed to fetch bosses: ", error))
    }, []);


    const divisionUpdate = async (e) => {
        e.preventDefault();

        let updatedDivision = {
            ...displayedDivision,
            name: divisionName || displayedDivision.name,
            boss: divisionBoss || displayedDivision.boss,
            budget: divisionBudget || displayedDivision.budget,
            country: divisionCountry || displayedDivision.location.country,
            city: divisionCity || displayedDivision.location.city
        };

        try {
            await fetch(`http://${process.env.REACT_APP_BACKEND_URL}/api/divisions/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDivision),
            });

             
                navigate(`http://${process.env.REACT_APP_BACKEND_URL}/divisions`);
            // }
        } catch (error) {
            console.error("Couldn't update division: ", error);
        };
    };

    
    console.error(displayedDivision);

    if (isLoading) {
        return <h2>Loading...</h2>
    }

    return (
        <div>
            <h2>Edit division</h2>

            <div>
                <label>Name: </label>
                <input type="text"
                    id="name"
                    value={divisionName}
                    placeholder={displayedDivision.name}
                    onChange={handleDivisionName}></input>
            </div>

            <div>
                <label>Boss: </label>
                <select name="boss" id="boss" onChange={handleDivisionBoss}>
                    <option value=''>Select Boss</option>
                    {availableBosses.map(boss => {
                        <option key={boss._id} value={boss._id}> 
                        {boss.name}
                        </option>
                    })}
                </select>
            </div>

            <div>
                <label>Budget: </label>
                <input type="text"
                    id="budget"
                    value={divisionBudget}
                    placeholder={displayedDivision.budget}
                    onChange={handleDivisionBudget}></input>
            </div>

            <div>
                <label>Country: </label>
                <input type="text"
                    id="country"
                    value={divisionCountry}
                    placeholder={ displayedDivision.location ? displayedDivision.location.country : ""}
                    onChange={handleDivisionCountry}></input>
            </div>

            <div>
                <label>City: </label>
                <input type="text"
                    id="city"
                    value={divisionCity}
                    placeholder={ displayedDivision.location ? displayedDivision.location.city : ""}
                    onChange={handleDivisionCity}></input>
            </div>

                    <button type="button" onClick={divisionUpdate}>Save</button>

        </div>
    )
}
export default DivisionForm;