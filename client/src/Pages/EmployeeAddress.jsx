

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const EmployeeAddress = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [displayedAddress, setDisplayedAddress] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const [countryName, setCountryName] = useState("");
    const [cityName, setCityName] = useState("");
    const [streetName, setStreetName] = useState("");
    const [zipCode, setZipCode] = useState(null);

    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        fetch(`http://${process.env.BACKEND_URL}/employee/${id}/address`)
            .then(response => response.json())
            .then(data => setDisplayedAddress(data))
            .then(setIsLoading(false))
            .catch(error => console.error("Error while fetching the address: ", error))

    }, []);

    const handleCountryName = (e) => {
        setCountryName(e.target.value)
    };

    const handleCityName = (e) => {
        setCityName(e.target.value)
    };

    const handleStreetName = (e) => {
        setStreetName(e.target.value)
    };

    const handlezipCode = (e) => {
        setZipCode(e.target.value)
    };

    // PATCH request
    const handleAddressChange = (e) => {
        e.preventDefault();

        let updatedAddress = {
            ...displayedAddress.address,
            country: countryName || displayedAddress.address.country,
            city: cityName || displayedAddress.address.city,
            street: streetName || displayedAddress.address.street,
            zipCode: zipCode || displayedAddress.address.zipCode,
        };


        try {
            const response = fetch(`http://${process.env.BACKEND_URL}/employee/${id}/address`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    country: countryName,
                    city: cityName,
                    street: streetName,
                    zipCode: zipCode,
                }),
            })

            if (response.ok) {
                setDisplayedAddress(prevAddress => ({
                    ...prevAddress,
                    address: updatedAddress,
                }));
                setIsEditing(false);
                navigate(`http://${process.env.FRONTEND_URL}`);
            }

        } catch (error) {
            console.error("Error while updating address: ", error)
        }

    }


    console.log(displayedAddress);

    if (isLoading) {
        return <h2>Loading...</h2>
    };


        return (
            <div>
                <h2>Your Address</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th>City</th>
                            <th>Street</th>
                            <th>Zip Code</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{displayedAddress.address ? displayedAddress.address.country : ""}</td>
                        <td>{displayedAddress.address ? displayedAddress.address.city : ""}</td>
                        <td>{displayedAddress.address ? displayedAddress.address.street : ""}</td>
                        <td>{displayedAddress.address ? displayedAddress.address.zipCode : ""}</td>
                    </tr>

                    </tbody>
                    </table>

                    {!isEditing ? (
                        <>
                            <button type="button" onClick={() => setIsEditing(true)}>Edit</button>
                        </>



                    ) : (
                        <table>


                            <br />

                            <div>
                                <label>Country: </label>
                                <input type="text"
                                    id="country"
                                    value={countryName}
                                    placeholder={displayedAddress.address.country}
                                    onChange={handleCountryName}
                                ></input>
                            </div>

                            <div>
                                <label>City: </label>
                                <input type="text"
                                    id="city"
                                    value={cityName}
                                    placeholder={displayedAddress.address.city}
                                    onChange={handleCityName}
                                ></input>
                            </div>

                            <div>
                                <label>Street: </label>
                                <input type="text"
                                    id="street"
                                    value={streetName}
                                    placeholder={displayedAddress.address.street}
                                    onChange={handleStreetName}
                                ></input>
                            </div>

                            <div>
                                <label>Zip Code: </label>
                                <input type="text"
                                    id="zipCode"
                                    value={zipCode}
                                    placeholder={displayedAddress.address.zipCode}
                                    onChange={handlezipCode}
                                ></input>
                            </div>

                            <button type="button" onClick={handleAddressChange}>Save</button>
                            <button type="button" onClick={() => setIsEditing(false)}>Back</button>

                </table>
                    )}
        </div>
        )

}

export default EmployeeAddress;