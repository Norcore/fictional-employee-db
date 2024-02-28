

import React, { useState, useEffect } from 'react';


const DivisionCreate = () => {
    const [divisionName, setDivisionName] = useState("");
    const [divisionBoss, setDivisionBoss] = useState("");
    const [divisionBudget, setDivisionBudget] = useState("");
    const [divisionCountry, setDivisionCountry] = useState("");
    const [divisionCity, setDivisionCity] = useState("");

    const [availableBosses, setAvailableBosses] = useState([]);



    // Fetch boss candidates
    useEffect(() => {
        fetch('/api/employees/candidates')
            .then(response => response.json())
            .then(data => setAvailableBosses(data))
            .catch(error => console.error("Failed to fetch bosses: ", error))
    }, []);


    const addDivision = async () => {

        let newDivision = {
            name: divisionName.length > 0 ? divisionName : "",
            boss: divisionBoss.length > 0 ? divisionBoss : null,
            budget: divisionBudget.length > 0  ? divisionBudget : "",
            country: divisionCountry.length ? divisionCountry : "",
            city: divisionCity.length > 0 ? divisionCity : "",
        }
        
        try {


            await fetch('/api/divisions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newDivision),
            })
                .then(setDivisionName(""))
                .then(setDivisionBudget(""))
                .then(setDivisionCountry(""))
                .then(setDivisionCity(""))

        } catch (error) {
            console.error("Error creating division", error);

        }

    };


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

    console.log(availableBosses);

    return (
        <div>
            <h2>Add new division</h2>

            <div>
                <label>Name: </label>
                <input type="text"
                    id="name"
                    value={divisionName}
                    onChange={handleDivisionName}></input>
            </div>

            <div>
                <label>Boss: </label>
                <select name="boss" id="boss" onChange={handleDivisionBoss}>
                    <option value=''>Select Boss</option>
                    {availableBosses.map(boss => {
                        return (
                            <option key={boss._id} value={boss._id}>
                                {boss.name}
                            </option>

                        )
                    })}
                </select>
            </div>

            <div>
                <label>Budget: </label>
                <input type="number"
                    id="budget"
                    value={divisionBudget}
                    onChange={handleDivisionBudget}></input>
            </div>

            <div>
                <label>Country: </label>
                <input type="text"
                    id="country"
                    value={divisionCountry}
                    onChange={handleDivisionCountry}></input>
            </div>

            <div>
                <label>City: </label>
                <input type="text"
                    id="city"
                    value={divisionCity}
                    onChange={handleDivisionCity}></input>
            </div>

            <button type="button" onClick={addDivision}>Save</button>

        </div>
    )
}

export default DivisionCreate;

