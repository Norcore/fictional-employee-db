import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EmployeeSearch = () => {
    const { search } = useParams();
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        fetch(`http://procecc.env.BACKEND_URL/employees/${search}`)
            .then((response) => response.json())
            .then((data) => setSearchResults(data))
            .catch((error) => console.error("Error fetching results", error))
    }, [search]);

    return (
        <div>
            <h2>Search results for "{search}"</h2>
            <ul>
                {searchResults.map((employee) => {
                    return (
                    <li key={employee._id}>
                        Name: {employee.name}, Position: {employee.position}, Level: {employee.level}
                    </li>
                    )
                })}
            </ul>
        </div>

    );
};

export default EmployeeSearch;