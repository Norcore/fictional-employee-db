import React, { useState, useEffect } from "react";
import EquipmentForm from "../Components/EquipmentForm";
import EquipmentList from "./EquipmentList";

const EquipmentCreator = () => {
  const [equipmentList, setEquipmentList] = useState([]);

  useEffect(() => {
    fetch("http://server:3001/equipment")
      .then((response) => response.json())
      .then((data) => setEquipmentList(data))
      .catch((error) => console.error("Error fetching equipment:", error));
  }, []);

  const handleDeleteEquipment = (equipmentId) => {
    fetch(`http://server:3001/equipment/${equipmentId}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedEquipmentList = equipmentList.filter((equipment) => equipment._id !== equipmentId);
        setEquipmentList(updatedEquipmentList);
      })
      .catch((error) => console.error("Error deleting equipment:", error));
  };

  const handleCreateEquipment = (createdEquipment) => {
    setEquipmentList([...equipmentList, createdEquipment]);
  };

  return (
    <div>
      <EquipmentForm onSave={handleCreateEquipment} />
      <EquipmentList equipmentList={equipmentList} onDelete={handleDeleteEquipment} />
    </div>
  );
};

export default EquipmentCreator;