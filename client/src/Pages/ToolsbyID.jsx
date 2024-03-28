

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const ToolsbyID = () => {
    const { id } = useParams();
    const [displayedTool, setDisplayedTool] = useState([]);

    console.log(id);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}:3001/tools/${id}`)
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
}

export default ToolsbyID;