

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 


const ToolsbyID = () => {
    const [displayedTool, setDisplayedTool] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        fetch(`http://localhost:8080/tools/${id}`)
        .then(response => response.json())
        .then(data => setDisplayedTool(data))
        .catch(error => console.error("Failed to fetch tool: ", error))

    }, []);

  return (
    <div>
        <h2>Name: {displayedTool.name}</h2>
        <h2>Weight: {displayedTool.weight}</h2>
    </div>
  )
};

export default ToolsbyID;