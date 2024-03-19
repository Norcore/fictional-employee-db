require("dotenv").config();
const mongoose = require("mongoose");
const names = require("./names.json");
const levels = require("./levels.json");
const positions = require("./positions.json");
const EmployeeModel = require("../db/employee.model");
const FavoriteBrandModel = require("../db/favoritebrand.model");
const BoardgameModel = require("../db/boardgame.model");
const DivisionModel = require("../db/division.model");

const MONGO_URI = process.env.MONGO_URI;
//const MONGO_URI = "mongodb://localhost:27017/fictional-employee-db"
//const MONGO_URI = "mongodb://mongo:27017/fictional-employee-db"

if (!MONGO_URI) {
  console.error("Missing MONGO_URI environment variable");
  process.exit(1);
}

const pick = (from) => from[Math.floor(Math.random() * from.length)];
const brands = ["Acer", "Razer", "HP"];
const colors = ["red", "ultraviolet", "aqua", "blue", "brown", "cyan", "green", "lime", "yellow", "orange", "chartreuse"];

const numbersRange = [];
for (let i = 20; i <= 60; i++) {
  numbersRange.push(i);
};

const populateEmployees = async () => {
  await EmployeeModel.deleteMany({});
  await FavoriteBrandModel.deleteMany({});
  
  const startingDate = new Date();
  
  const employees = names.map((name) => ({
    name,
    level: pick(levels),
    position: pick(positions),
    favoriteColor: pick(colors),
    currentSalary: pick(numbersRange),
    desiredSalary: pick(numbersRange),
    startingDate: startingDate.toLocaleDateString(),
  }));
  
  //await EmployeeModel.create(employees);
  
  for (const brand of brands) {
    await FavoriteBrandModel.create({ name: brand });
    console.log(`Favorite brand created: ${brand}`);
  }
  
  const allBrands = await FavoriteBrandModel.find();
  
  
  await EmployeeModel.updateMany(
    { favoriteBrand: { $exists: false } },
    { $set: { favoriteBrand: null } }
    );
    
    
    for (const employee of employees) {
      const randomBrand = pick(allBrands);
      employee.favoriteBrand = randomBrand._id;
      console.log(`Assigned ${randomBrand.name} to ${employee.name}`);
      
    }
    
    await EmployeeModel.create(employees);
    console.log("Employees created");
  };

  const populateBoardgames = async () => {
    const boardgames = [
      {
        name: "Monopoly",
        maxPlayers: 8,
      },
      {
        name: "Chess",
        maxPlayers: 2,
      },
      {
        name: "Go",
        maxPlayers: 2,
      },
    ];

    await BoardgameModel.insertMany(boardgames);

  };


  const populateAddresses = async () => {
    await EmployeeModel.updateMany(
      {address: { $exists: false } },
      {$set: {address: {country: null, city: null, street: null, zipCode: null } } },
    );

  }

  /* const populateDivision = async () => {

    const divisionArray = [

    ]

    await DivisionModel.insertMany ()
  } */

  // add tools array to each employee
  const addToolsArray = async () => {
    await EmployeeModel.updateMany(
      {tools: { $exists: false } },
      {$set: {tools: [] } },
    );
  };
  
  const main = async () => {
    await mongoose.connect(MONGO_URI);
    
    await populateAddresses();
    await populateEmployees();
    await populateBoardgames();
    await addToolsArray();
    
    await mongoose.disconnect();
  };
  
  main().catch((error) => {
    console.error(error);
  process.exit(1);
});