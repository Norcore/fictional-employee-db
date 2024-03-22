import React, { useState, useEffect } from 'react';

const TopPaid = () => {
    const [topPaid, setTopPaid] = useState([]);

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_BACKEND_URL}/top-paid`)
        .then(result => result.json())
        .then(data => setTopPaid(data))
        .catch(error => console.error("Error fetching top paid: ", error))

    }, []);


    console.log(topPaid);


  return (
    <div>
        <h2>Top Paid Employees</h2>

        <div>
            {topPaid.map(top => {
                return (
                    <li key={top._id}>
                       Name: {top.name} - Current Salary: {top.currentSalary}

                    </li>
            )})}
        </div>

    </div>
  )
};

export default TopPaid;
