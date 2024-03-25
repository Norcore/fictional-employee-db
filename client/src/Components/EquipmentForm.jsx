import React, { useState } from "react";

const EquipmentForm = ({ onSave }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);

  const [editingName, setEditingName] = useState(""); // New state variables
  const [editingType, setEditingType] = useState("");
  const [editingAmount, setEditingAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const equipmentData = { name, type, amount };

    try {
      const response = await fetch(`http://${process.env.REACT_APP_BACKEND_URL}:3001/equipment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equipmentData),
      });

      const createdEquipment = await response.json();
      onSave(createdEquipment);
    } catch (error) {
      console.error("Error creating equipment:", error);
    }
  };

  const handleShowInventory = async () => {
    try {
      const response = await fetch(`http://${process.env.REACT_APP_BACKEND_URL}:3001/equipment`);
      const fetchedInventoryData = await response.json();
      setInventoryData(fetchedInventoryData);

    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };


  const handleEditEquipment = (editedEquipment) => {
    const updatedInventory = inventoryData.map((item) => {
      if (item._id === editedEquipment._id) {
        return { ...item, ...editedEquipment };
      }
      return item;
    });

    setInventoryData(updatedInventory);
    setEditingItemId(null);
  };

  const handleDeleteEquipment = (equipmentId) => {
    fetch(`http://${process.env.REACT_APP_BACKEND_URL}:3001/equipment/${equipmentId}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedEquipmentList = inventoryData.filter((equipment) => equipment._id !== equipmentId);
        setInventoryData(updatedEquipmentList);
      })
      .catch((error) => console.error("Error deleting equipment:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text"  value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Type:</label>
        <input type="text" value={type} onChange={(e) => setType(e.target.value)} />
      </div>
      <div>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <button type="submit">Add new item</button>
      <button type="button" onClick={handleShowInventory}>Show inventory</button>
    
      <div>
      <h2>Inventory</h2>
        <ul>
          {inventoryData.map((item) => (
            <li key={item._id}>
              {editingItemId === item._id ? (
                // Render input fields for editing
                <div>
                  <input
                    type="text"
                    value={editingName} // Use separate state variables here
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <input
                    type="text"
                    value={editingType}
                    onChange={(e) => setEditingType(e.target.value)}
                  />
                  <input
                    type="number"
                    value={editingAmount}
                    onChange={(e) => setEditingAmount(e.target.value)}
                  />
                  <button
                    onClick={() =>
                      handleEditEquipment({
                        _id: item._id,
                        name: editingName,
                        type: editingType,
                        amount: editingAmount,
                      })
                    }
                  >
                    Save
                  </button>
                </div>
              ) : (
                // Render normal display with edit and delete buttons
                <>
                  Name: {item.name}, Type: {item.type}, Amount: {item.amount}
                  <button onClick={() => setEditingItemId(item._id)}>Edit</button>
                  <button onClick={() => handleDeleteEquipment(item._id)}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
};

export default EquipmentForm;