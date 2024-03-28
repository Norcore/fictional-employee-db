import React, { useState, useEffect } from 'react';

const EmployeeForm = ({ onSave, disabled, employee, onCancel }) => {
  const [name, setName] = useState(employee?.name || "");
  const [level, setLevel] = useState(employee?.level || "");
  const [position, setPosition] = useState(employee?.position || "");
  const [currentSalary, setCurrentSalary] = useState(employee?.currentSalary || "");
  const [desiredSalary, setDesiredSalary] = useState(employee?.desiredSalary || "");
  const [startingDate, setStartingDate] = useState(employee?.startingDate || "");

  const [tools, setTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState([]);

  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);

  const [availableBrands, setAvailableBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);

  const availableColors = ["red", "ultraviolet", "aqua", "blue", "brown", "cyan", "green", "lime", "yellow", "orange", "chartreuse"];
  const [selectedColor, setSelectedColor] = useState([]);

  const [divisions, setAvailableDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState([]);

  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState([]);


  useEffect(() => {
    fetchAvailableEquipment();
    fetchAvailableBrands();
    fetchDivisions();
    fetchGames();
    fetchTools();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    const updatedEmployee = {
      ...employee,
      name: name.length > 0 ? name : employee.name,
      level: level.length > 0 ? level : employee.level,
      position: position.length > 0 ? position : employee.position,
      favoriteBrand: selectedBrand.length > 0 ? selectedBrand : employee.favoriteBrand,
      currentSalary: currentSalary.length > 0 ? currentSalary : employee.currentSalary,
      desiredSalary: desiredSalary.length > 0 ? desiredSalary : employee.desiredSalary,
      startingDate: startingDate.length > 0 ? startingDate : employee.startingDate,
      favoriteColor: selectedColor.length > 0 ? selectedColor : employee.favoriteColor,
      favGame: selectedGame.length > 0 ? selectedGame : employee.favGame,
      division: selectedDivision.length > 0 ? selectedDivision : employee.division,
      tools: selectedTool.length > 0 ? [...employee.tools, selectedTool] : employee.tools,
    }
  

    // PATCH request
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/employees/${employee._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployee),
      });

      if (response.ok) {
        console.log("Successfully updated employee")
      } else {
        console.error("Error updating employee", response.statusText)
      }
    } catch (error) {
      console.error("Error updating employee:", error)
    }

    return onSave(updatedEmployee);
  };

  // Handle equipment changes
  const handleEquipmentChange = (e) => {
    setSelectedEquipment(e.target.value);

    console.log(e.target.value);
  }

  // Handle brand changes
  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);

    console.log(e.target.value);
  }

  // Color Changes
  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  }

  // handle division change
  const handleDivisionChange = (e) => {
    setSelectedDivision(e.target.value)
  };

  // handle game change
  const handleGameChange = (e) => {
    setSelectedGame(e.target.value)
  };


  // Fetch equipment
  const fetchAvailableEquipment = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/equipment`);
      const data = await response.json();
      setAvailableEquipment(data);
    } catch (error) {
      console.error("Error fetching equipment:", error)
    }
  };

  // Fetch brands
  const fetchAvailableBrands = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/brands`);
      const data = await response.json();
      setAvailableBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error)
    }
  }


  // Fetch divisions
  const fetchDivisions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/divisions`)
      const data = await response.json();
      setAvailableDivisions(data);

    } catch (error) {
      console.error("error fetching candidates: ", error);
    };
  };

  const fetchGames = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/games-list`);
      const data = await response.json();
      setGames(data);

    } catch (error) {
      console.error("error fetching games: ", error);
    };
  };

  const fetchTools = async () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/tools`)
    .then(response => response.json())
    .then(data => setTools(data))
    .catch(error => console.error("Failed to fetch tools: ", error))
  };

  //console.log(employee.division);

  // Rendering
  return (
    <form className="EmployeeForm" onSubmit={onSubmit}>
      {employee && (
        <input type="hidden" name="_id" defaultValue={employee._id} />
      )}

      <div className="control">
        <label htmlFor="name">Name:</label>
        <input
          defaultValue={employee ? employee.name : null}
          name="name"
          id="name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="control">
        <label htmlFor="level">Level:</label>
        <input
          defaultValue={employee ? employee.level : null}
          name="level"
          id="level"
          onChange={(e) => setLevel(e.target.value)}
        />
      </div>

      <div className="control">
        <label htmlFor="position">Position:</label>
        <input
          defaultValue={employee ? employee.position : null}
          name="position"
          id="position"
          onChange={(e) => setPosition(e.target.value)}
        />
      </div>



      <div className="control">
        <label htmlFor="brand">Favorite Brand:</label>
        <input
          defaultValue={employee ? employee.favoriteBrand.name : null}
          name="brand"
          id="brand"
          disabled={true}
        />
      </div>


      <div className="control">
        <label htmlFor="currentSalary">Current Salary:</label>
        <input
          defaultValue={employee ? employee.currentSalary : null}
          name="currentSalary"
          id="currentSalary"
          disabled={false}
          type="number"
          onChange={(e) => setCurrentSalary(e.target.value)}
        />
      </div>


      <div className="control">
        <label htmlFor="desiredSalary">Desired Salary:</label>
        <input
          defaultValue={employee ? employee.desiredSalary : null}
          name="desiredSalary"
          id="desiredSalary"
          disabled={false}
          type="number"
          onChange={(e) => setDesiredSalary(e.target.value)}
        />
      </div>


      <div className="control">
        <label htmlFor="startingDate">Starting Date:</label>
        <input
          defaultValue={employee ? employee.startingDate : null}
          name="startingDate"
          id="startingDate"
          disabled={false}
          type="date"
          onChange={(e) => setStartingDate(e.target.value)}
        />
      </div>

      <div className="control">
        <label htmlFor="favoriteColor">Favorite Color:</label>
        <input
          defaultValue={employee ? employee.favoriteColor : null}
          name="favoriteColor"
          id="favoriteColor"
          disabled={true}
          style={{ background: employee ? employee.favoriteColor : null }}
        />
      </div>

      <div className="control">
        <label htmlFor="game">Favorite Game:</label>
        <input
          defaultValue={employee ? employee.favGame.name : null}
          name="game"
          id="game"
          disabled={true}
        />
      </div>

      <div className="control">
        <label htmlFor="division">Division:</label>
        <input
          defaultValue={employee ? employee.division.name : null}
          name="division"
          id="division"
          disabled={true}
        />
      </div>

      <div className="control">
        <label htmlFor="tool">Tools:</label>
        <input
          defaultValue={employee ? employee.tools.map(tool => (
            tool.name
          )) : null}
          name="tool"
          id="tool"
          disabled={true}
        />
      </div>

      <div className="buttons">
        <button type="submit" disabled={disabled}>
          {employee ? "Update Employee" : "Create Employee"}
        </button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>

        <select name="equipment" id="equipment" onChange={handleEquipmentChange}
          value={selectedEquipment}>
          <option value=''>Select Equipment</option>
          {availableEquipment.map((equipment) => (
            <option key={equipment._id} value={equipment._id}>
              {equipment.name}
            </option>
          ))}

        </select>

        <select name="brand" id="brand" onChange={handleBrandChange}
          value={selectedBrand}>
          <option value=''>Select Brand</option>
          {availableBrands.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.name}
            </option>
          ))}
        </select>

        <select name="color" id="color" onChange={handleColorChange}
          value={selectedColor}>
          <option value=''>Select Color</option>
          {availableColors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>


        <select name="division" id="division" onChange={handleDivisionChange}
          value={selectedDivision}>
          <option value=''>Select Division</option>
          {divisions.map((division) => (
            <option key={division._id} value={division._id}>
              {division.name}
            </option>
          ))}
        </select>

        <select name="game" id="game" onChange={handleGameChange}
          value={selectedGame}>
          <option value=''>Select Game</option>
          {games.map((game) => (
            <option key={game._id} value={game._id}>
              {game.name}
            </option>
          ))}
        </select>

        <select name="tool" id="tool" onChange={(e) => setSelectedTool(e.target.value)}
          value={selectedTool}>
          <option value=''>Select Tool</option>
          {tools.map((tool) => (
            <option key={tool._id} value={tool._id}>
              {tool.name}
            </option>
          ))}
        </select>

      </div>
    </form>
  );
};

export default EmployeeForm;
