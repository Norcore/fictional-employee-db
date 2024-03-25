import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";


const Kittens = () => {
    const { employeeId } = useParams();

    const [availableKittens, setAvailableKittens] = useState([]);
    const [kittenName, setKittenName] = useState('');
    const [kittenWeight, setKittenWeight] = useState('');

    // Fetch kittens
    useEffect(() => {
            fetch(`http://${process.env.REACT_APP_BACKEND_URL}:3001/api/kittens/${employeeId}`)
                .then(response => response.json())
                .then(data => setAvailableKittens(data))
                .catch(error => console.error("Failed to fetch kittens: ", error))

    }, [availableKittens, kittenName, kittenWeight]);


    // Kitten POST request
    const addKitten = () => {
        fetch(`http://${process.env.REACT_APP_BACKEND_URL}:3001/api/kittens/${employeeId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: kittenName,
                weight: kittenWeight,
            }),
        })
            .then(response => response.json())
            .then(newKitten => {
                setAvailableKittens([...availableKittens, newKitten])
                setKittenName("")
                setKittenWeight("")
            })
            .catch(error => console.error("Failed to add new kitten: ", error))
    };


    const handleKittenName = (e) => {
        setKittenName(e.target.value)
    };

    const handleKittenWeight = (e) => {
        setKittenWeight(e.target.value)
    };



    return (
        <div>
            <h2>Kittens</h2>

            <div>
                <label>Kitten name: </label>
                <input type="text" id="kittenName" value={kittenName}
                    onChange={handleKittenName}></input>
            </div>

            <div>
                <label>Kitten weight: </label>
                <input type="text" id="kittenWeight" value={kittenWeight}
                    onChange={handleKittenWeight}></input>
            </div>

            <button type="button" onClick={addKitten}>Add kitten</button>


            <table>
                <thead>
                    <tr>

                        <th>Name</th>
                        <th>Weight</th>
                    </tr>
                </thead>

                <tbody>

                    {availableKittens.map(kitten => {
                        return (
                            <tr key={kitten._id}>
                                <td>{kitten.name}</td>
                                <td>{kitten.weight}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

        </div >
    )
}

export default Kittens;