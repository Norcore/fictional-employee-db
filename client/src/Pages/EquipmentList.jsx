import React from "react";

const EquipmentList = ({ equipmentList, onDelete }) => {
  return (
    <div>
      <h2>Equipment List</h2>
      <ul>
        {equipmentList.map((equipment) => (
          <li key={equipment._id}>
            {equipment.name} - {equipment.type} - {equipment.amount}
            <button onClick={() => onDelete(equipment._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EquipmentList;