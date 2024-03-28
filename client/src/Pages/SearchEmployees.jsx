

import React, { useState, useEffect } from 'react';
import Loading from '../Components/Loading';

const SearchEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [filterName, setFilterName] = useState("");
    const [isLoading, setIsLoading] = useState(true);


    // GET employees
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}:3001/api/employees/candidates?filter=${filterName}`)
        .then(response => response.json())
        .then(data => setEmployees(data))
        .then(setIsLoading(false))
        .catch(error => console.error("Error fetching employees: ", error))
    }, [filterName]);


    // Handle name filter
    const handleFilter = (e) => {
        setFilterName(e.target.value)
    };

    // Handle similar employees filter
    const handleSimilarEmployees = (employee) => {

        console.log("Click action:", employee);

        // hanyadik sor, hova kattintok
        fetch(`${process.env.REACT_APP_BACKEND_URL}:3001/api/employees/similaremployees?position=${employee.position}&level=${employee.level}`)
        .then(response => response.json())
        .then(data => setEmployees(data))
        .catch(error => console.error("Error fetching similar employees: ", error))
    }

    //console.log(employees);


    //console.log(employees[0]);

    if (isLoading) {
        return <Loading />
    }

  return (
    <div>
        <label>Employee Name: </label>
        <input type="text" value={filterName}
        onChange={handleFilter}></input>

        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Level</th>
                    <th>Position</th>
                </tr>
            </thead>

            <tbody>
                {employees.map(employee => {
                    return (
                        <tr key={employee._id}>
                            <td>{employee.name }</td>
                            <td>{employee.level}</td>
                            <td>{employee.position}</td>
                            <td>
                                <button type="button" onClick={() => handleSimilarEmployees(employee)}>Similar Employees</button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
  )
}

export default SearchEmployees;