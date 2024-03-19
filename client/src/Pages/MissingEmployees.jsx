import React, { useState, useEffect } from 'react'

const MissingEmployees = () => {
    const [missingEmployees, setMissingEmployees] = useState([]);

    useEffect(() => {
        fetch('http://server:3001/api/employees/missing')
            .then((response) => response.json())
            .then((data) => setMissingEmployees(data))
            .catch((error) => console.error("Error fetching missing employees:", error))
    }, []);


    return (
        <div>Missing Employees
            <ul>
                {missingEmployees.map((employee) => {
                    return (

                    <li key={employee._id}>
                        Name: {employee.name}, Position: {employee.position}, Level: {employee.level}
                    </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default MissingEmployees;
