import { Link, useNavigate } from "react-router-dom";
import "./EmployeeTable.css";
import { useEffect, useState } from "react";

import Dialog from '../../Pages/Dialog';

const EmployeeTable = ({ employees, onDelete, onCheckBoxChange, checkboxToggled, currentPage}) => {
  const [filterPosition, setFilterPosition] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [isSorted, setIsSorted] = useState({
    name: 'asc',
    middleName: 'asc',
    lastName: 'asc',
    position: 'asc',
    level: 'asc'
  });

  const [sortedBy, setSortedBy] = useState("created");
  const [sortedDirection, setSortedDirection] = useState("asc");
  const [sortedEmployees, setSortedEmployees] = useState(employees);

  const navigate = useNavigate();
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // use effect and fetching
  useEffect(() => {
    fetchSortedEmployees();
  }, [filterPosition, filterLevel, sortedBy, sortedDirection, checkboxToggled, currentPage]);

  const fetchSortedEmployees = async () => {
    const sortDirection = isSorted[sortedBy] === 'asc' ? -1 : 1;

    // Fetching database and passing queries
    const response = await fetch(
      `http://localhost:3001/api/employees/sorted?position=${filterPosition}&level=${filterLevel}&sortBy=${sortedBy}&sortDir=${sortDirection}`
    );

    const data = await response.json();
    setSortedEmployees(data);
  };

  // state changes on click
  const handleSortClick = (field) => {
    const newSortDirection = isSorted[field] === "asc" ? "desc" : "asc";
    setIsSorted((prevState) => ({ ...prevState, [field]: newSortDirection }));
    setSortedBy(field);
    setSortedDirection(newSortDirection);
  };

  // Positions and levels
  const positions = [...new Set(employees.map((employee) => employee.position))];
  const levels = [...new Set(employees.map((employee) => employee.level))];


  // Delete UI popup
  const onDeleteClick = (employeeId) => {
    setEmployeeToDelete(employeeId)
    setShowDeleteDialog(true);

  }

  // Delete confirmation
  const onDeleteConfirm = async (employeeId) => {
    try {
      await onDelete(employeeId);
      setEmployeeToDelete(employeeId);
      setShowDeleteDialog(false);
      navigate('http://localhost:3000/');

    } catch (error) {
      console.error('Error deleting employee: ', error);
    };
 
  };

  // Cancelling delete
  const onDeleteCancel = () => {
    setShowDeleteDialog(false);
    setEmployeeToDelete(null);
    navigate('http://localhost:3000/');
  }


  console.log(employees[0].favGame);

  // Render Employees
  function renderEmployees() {
    const startIndex = (currentPage -1) * 10;
    const endIndex = startIndex + 10;
    const employeesToRender = sortedEmployees.length > 0 ? sortedEmployees.slice(startIndex, endIndex) : employees.slice(startIndex, endIndex);

    return (
      <tbody>
        {employeesToRender.map((employee) => (
          <tr key={employee._id}>
            <td style={{background: employee.favoriteColor}}>{employee.name}</td>
            <td style={{background: employee.favoriteColor}}>{employee.level}</td>
            <td style={{background: employee.favoriteColor}}>{employee.position}</td>
            <td style={{background: employee.favoriteColor}}>{employee.currentSalary}</td>
            <td style={{background: employee.favoriteColor}}>{employee.desiredSalary}</td>
            <td style={{background: employee.favoriteColor}}>{employee.desiredSalary - employee.currentSalary}</td>
            <td style={{background: employee.favoriteColor}}>{employee.startingDate}</td>
            <td style={{background: employee.favoriteColor}}>{employee.address ? employee.address.city : ""}</td>
            <td style={{background: employee.favoriteColor}}>{employee.favGame ? employee.favGame.maxPlayers : ""}</td>
            <td style={{background: employee.favoriteColor}}>
              
              <Link to={`http://localhost:3000/update/${employee._id}`}>
                <button type="button">Update</button>
              </Link>

              <Link to={`http://localhost:3000/kittens/${employee._id}`}>
                <button type="button">Kittens</button>
              </Link>

              <Link to={`http://localhost:3000/employee/${employee._id}/address`}>
                <button type="button">Address</button>
              </Link>

              <button type="button" onClick={() => onDeleteClick(employee._id)}>
                Delete
              </button>

              {showDeleteDialog === true && employeeToDelete === employee._id && (

                <Dialog message={"Are you sure you want to delete?"}
                onConfirm={() => onDeleteConfirm(employee._id)}
                onCancel={onDeleteCancel} />
              )}
            </td>
            <td style={{background: employee.favoriteColor}}>
              <input
                type="checkbox"
                checked={employee.present}
                onChange={() => onCheckBoxChange(employee._id, !employee.present)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    );
  }


  // Render Filtering
  function renderFiltering() {
    return (
      <div className="filters">
        <select
          value={filterPosition}
          onChange={(e) => {
            setFilterPosition(e.target.value);
          }}
        >
          <option value=""> Filter by position</option>
          {positions.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>

        <select
          value={filterLevel}
          onChange={(e) => {
            setFilterLevel(e.target.value);
          }}
        >
          <option value=""> Filter by level</option>
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Render Sorting
  function renderSorting() {
    return (
      <div className="sorting">
        <button onClick={() => handleSortClick('name')}>Sort by first name</button>
        <button onClick={() => handleSortClick('middleName')}>Sort by middle name</button>
        <button onClick={() => handleSortClick('lastName')}>Sort by last name</button>
        <button onClick={() => handleSortClick('position')}>Sort by position</button>
        <button onClick={() => handleSortClick('level')}>Sort by level</button>
      </div>
    );
  }

  // Render Main
  return (
    <div className="EmployeeTable">
      {renderFiltering()}
      {renderSorting()}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Level</th>
            <th>Position</th>
            <th>Current Salary</th>
            <th>Desired Salary</th>
            <th>Salary Difference</th>
            <th>Starting Date</th>
            <th>City</th>
            <th>Max Players</th>
            <th />
          <th>Present</th>
          </tr>
        </thead>
        {renderEmployees()}
      </table>
    </div>
  );
};

export default EmployeeTable;
