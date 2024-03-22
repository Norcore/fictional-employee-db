import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Tools = () => {
  const [availableTools, setAvailableTools] = useState([]);
  const [toolName, setToolName] = useState("");
  const [toolWeight, setToolWeight] = useState("");
  const [toolFilter, setToolFilter] = useState("");

  useEffect(() => {
    fetch(`http://${process.env.BACKEND_URL}/tools?filter=${toolFilter}`)
      .then(response => response.json())
      .then(data => setAvailableTools(data))
      .catch(error => console.error("Error fetching tools: ", error))
  }, [toolName, toolWeight, availableTools]);

  const handleToolFilter = (e) => {
    setToolFilter(e.target.value)
  };

  const handleToolName = (e) => {
    setToolName(e.target.value);
  };

  const handleToolWeight = (e) => {
    setToolWeight(e.target.value);
  };


  const handleNewTool = () => {
    fetch(`http://${process.env.BACKEND_URL}/tools`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: toolName,
        weight: toolWeight,
      }),
    })
    .then(response => response.json())
    .then(newTool => {
      setAvailableTools([...availableTools, newTool])
      setToolName('')
      setToolWeight('')
    })
    .catch(error => console.error("Error creating tool: ", error))
    
  };

  return (
    <div>
      <h2>Tools</h2>

      <label>Filter tools: </label>
      <input
        type="text"
        id="filter"
        value={toolFilter}
        onChange={handleToolFilter}
      ></input>

      <div>
        <label>Enter the tool's name: </label>
        <input type="text" id="toolName" value={toolName}
          onChange={handleToolName}></input>

        <label>Enter the tool's weight: </label>
        <input type="text" id="toolWeight" value={toolWeight}
        onChange={handleToolWeight}></input>
      </div>

      <div>
        <button type="button" onClick={handleNewTool}>Add new tool</button>
      </div>

    <div>
      {availableTools.map(tool => {
        return (
          <li key={tool._id}>
            Name: {tool.name} - Weight: {tool.weight}
            <Link to={`http://${process.env.FRONTEND_URL}/tools/${tool._id}`}>
            <button type="button">Show More</button>
            </Link>
          </li>
        )
      })}
    </div>

    </div>
  )
};

export default Tools;
