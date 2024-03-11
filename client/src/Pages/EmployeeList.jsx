import { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

const fetchEmployees = () => {
  return fetch("http://localhost:3001/api/employees").then((res) => res.json());
};

const deleteEmployee = (id) => {
  return fetch(`http://localhost:3001/api/employees/${id}`, { method: "DELETE" }).then((res) =>
    res.json()
  );
};

  const updateEmployeePresence = (id, present) => {
    return fetch(`http://localhost:3001/api/employees/${id}/missing`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ present }),
    }).then((res => res.json()));
  };


const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [checkboxToggled, setCheckboxToggled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  

  const handleDelete = (id) => {
    deleteEmployee(id);

    setEmployees((employees) => {
      return employees.filter((employee) => employee._id !== id);
    });
  };


  const handleCheckBoxChange = async (id, present) => {
    try {
      const updatedEmployee = await updateEmployeePresence(id, present);
      setEmployees((prevEmployees) => {
        return prevEmployees.map((employee) => 
        employee._id === id ? { ...employee, present } : employee );
      });

      setCheckboxToggled(prevValue => !prevValue);

      console.log(updatedEmployee);
    } catch (error) {
      console.error("Error updating employee presence:", error);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  }

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  }

  
  useEffect(() => {
    fetchEmployees()
    .then((employees) => {
        setLoading(false);
        setEmployees(employees);
        setTotalEmployees(employees.length)
        console.log(totalEmployees);
        
      })
    }, [totalEmployees]);
    
  if (loading) {
    return <Loading />;
  }

  return (
    <div>

      <EmployeeTable employees={employees} onDelete={handleDelete}
      onCheckBoxChange={handleCheckBoxChange} checkboxToggled={checkboxToggled}
      currentPage={currentPage} />

    <div>
      Page: {currentPage} of {Math.ceil(totalEmployees / 10)}
    </div>
    <div>
      <button onClick={handlePreviousPage} disabled={currentPage === 1} >
        Previous Page
      </button>
      <button onClick={handleNextPage} disabled={currentPage === 10}>
        Next Page
      </button>
    </div>
    </div>
  )
};

export default EmployeeList;
