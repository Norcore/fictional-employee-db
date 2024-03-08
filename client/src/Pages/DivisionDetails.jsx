

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const DivisionDetails = () => {
    const [displayedDivison, setDisplayedDivision] = useState([]);
    const {id} = useParams();

    useEffect(() => {
        fetch(`http://localhost:8080/api/divisions/${id}/members`)
        .then(response => response.json())
        .then(data => setDisplayedDivision(data))
        .catch(error => console.error("Error while fetching: ", error))

    }, []);

    console.log(displayedDivison);

  return (
    <div>
        <h2>Division members</h2>

        {displayedDivison.map(member => {
            return (
                <div>
                <li key={member._id}>{member.name}</li>
                </div>
            )
        })}
       

    </div>
  )
}

export default DivisionDetails;