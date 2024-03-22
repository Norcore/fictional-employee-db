import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../Components/EmployeeForm";

const createEmployee = (employee) => {
  return fetch("http://procecc.env.BACKEND_URL/api/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  }).then((res) => res.json());
};

const EmployeeCreator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreateEmployee = (employee) => {
    setLoading(true);

    createEmployee(employee)
      .then(() => {
        setLoading(false);
        navigate("http://procecc.env.FRONTEND_URL/");
      })
  };

  return (
    <EmployeeForm
      onCancel={() => navigate("http://procecc.env.FRONTEND_URL/")}
      disabled={loading}
      onSave={handleCreateEmployee}
    />
  );
};

export default EmployeeCreator;
