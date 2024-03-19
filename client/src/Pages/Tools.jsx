

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Tools = () => {
    const [availableTools, setAvailableTools] = useState([]);
    const [toolFilter, setToolFilter] = useState([]);
    const [toolName, setToolName] = useState("");
    const [toolWeight, setToolWeight] = useState("");

    // GET request /w filtering
    useEffect(() => {
        fetch(`http://localhost:3001/tools?filter=${toolFilter}`)
            .then(response => response.json())
            .then(data => setAvailableTools(data))
            .catch(error => console.error("Failed to fetch tools: ", error))
    }, [availableTools]);


    // POST request
    const addTool = () => {
        try {
            fetch('http://localhost:3001/tools', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: toolName,
                    weight: toolWeight,
                }),
            })
                .then(response => response.json())
                .then(newTool => setAvailableTools([...availableTools, newTool]))
                .then(setToolName(""))
                .then(setToolWeight(""))


        } catch (error) {
            console.error("Failed to add new tool: ", error);
        };
    };


    const handleToolFilter = (e) => {
        setToolFilter(e.target.value)
    };
    const handleToolName = (e) => {
        setToolName(e.target.value)
    };
    const handleToolWeight = (e) => {
        setToolWeight(e.target.value)
    };

    return (
        <div>
            <label>Tool Filter: </label>
            <input type="text" value={toolFilter}
                onChange={handleToolFilter}></input>

            <label>New Tool Name: </label>
            <input type="text" value={toolName}
                onChange={handleToolName}></input>

            <label>New Tool Weight: </label>
            <input type="number" value={toolWeight}
                onChange={handleToolWeight}></input>

            <button type="button" onClick={addTool}>Save Tool</button>


            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Weight</th>
                    </tr>
                </thead>

                <tbody>
                    {availableTools.map(tool => {
                        return (
                            <tr key={tool._id}>
                                <td>{tool.name}</td>
                                <td>{tool.weight}</td>

                                <td>
                                    <Link to={`http://localhost:3001/tools/${tool._id}`} >
                                        <button type="button">Show More</button>
                                    </Link>
                                </td>
                            </tr>

                        )
                    })}
                </tbody>
            </table>

        </div>
    )
}

export default Tools;