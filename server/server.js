

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const EmployeeModel = require('./db/employee.model');
const Equipment = require('./db/equipment.model');
const FavoriteBrandModel = require('./db/favoritebrand.model');
const ToolsModel = require('./db/tools.model');
const KittenModel = require('./db/kitten.model');
const BoardgameModel = require('./db/boardgame.model');
const DivisionModel = require('./db/division.model');


const MONGO_URI = process.env.MONGO_URI;
const BACKEND_URL= process.env.REACT_APP_BACKEND_URL;
const PORT = process.env.PORT || 3001;

if (!MONGO_URI) {
  console.error("Missing MONGO_URI environment variable");
  process.exit(1);
}

const app = express();
app.use(express.json());

// CORS middleware
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["POST", "PATCH", "GET", "DELETE"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// Display division members
app.get(`${BACKEND_URL}/api/divisions/:id/members`, async (req, res) => {
  try {
    const divisionId = req.params.id;

    const members = await EmployeeModel.find({ division: divisionId });

    res.json(members);

  } catch (error) {
    console.error("Internal server error, ", error);
  };
});

// PATCH division
app.patch(`${BACKEND_URL}/api/divisions/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, boss, budget, country, city } = req.body;

    const updatedDivision = await DivisionModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: name,
          boss: boss,
          budget: budget,
          location: {
            country: country,
            city: city
          },
        },
      },
      { new: true },
    );

    res.json(updatedDivision);

  } catch (error) {
    console.error("Internal server error: ", error);
  };
});


// GET division by ID
app.get(`${BACKEND_URL}/api/divisions/:id`, async (req, res) => {
  try {
    const { id } = req.params;

    const division = await DivisionModel.findById(id);

    res.json(division);

  } catch (error) {
    console.error("Internal server error:", error);
  };
});

//GET similar employees
app.get(`${BACKEND_URL}/api/employees/similaremployees`, async (req, res) => {
  try {
    const { level, position } = req.query;
    console.log(level);
    console.log(position);

    const similarEmployees = await EmployeeModel.find({ level, position });

    res.json(similarEmployees);

  } catch (error) {
    console.error("Internal server error: ", error);
  };
});

// GET candidates
app.get(`${BACKEND_URL}/api/employees/candidates`, async (req, res) => {
  try {
    const { filter } = req.query;
    let candidates;
    console.log(filter);

    if (filter) {
      candidates = await EmployeeModel.find({ name: { $regex: `^${filter}` } })
    } else {

      candidates = await EmployeeModel.find();
    }

    //console.log(candidates);
    res.json(candidates);

  } catch (error) {
    console.error("internal server error: ", error);
  };
});


// GET divisions
app.get(`${BACKEND_URL}/api/divisions`, async (req, res) => {
  try {
    const divisions = await DivisionModel.find().populate('boss');

    res.json(divisions);

  } catch (error) {
    console.error("Internal server errror: ", error);
  };
});

// POST new division
app.post(`${BACKEND_URL}/api/divisions`, async (req, res) => {
  try {
    const { name, boss, budget, country, city } = req.body;

    const division = new DivisionModel({
      name: name,
      boss: boss || null,
      budget: budget,
      location: {
        country: country,
        city: city,
      },
    });

    await division.save()
    res.json(division);

  } catch (error) {
    console.error("Internal server error: ", error);
  };
});

// GET employee address
app.get(`${BACKEND_URL}/employee/:id/address`, async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await EmployeeModel.findById(id);

    res.json(employee);

  } catch (error) {
    console.error("Internal server error: ", error);
  };
});

// PATCH employee address
app.patch(`${BACKEND_URL}/employee/:id/address`, async (req, res) => {
  try {
    const { id } = req.params;
    const { country, city, street, zipCode } = req.body;

    const employee = await EmployeeModel.findById(id);

    employee.address.country = country;
    employee.address.city = city;
    employee.address.street = street;
    employee.address.zipCode = zipCode;

    await employee.save();


    res.json({ message: "address updated", employee: employee });

  } catch (error) {
    console.error("Internal server error: ", error);
  };

});


//GET Tools by ID
app.get(`${BACKEND_URL}/tools/:id`, async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    const tool = await ToolsModel.findById(id);

    res.json(tool);

  } catch (error) {
    console.error("Internal server error: ", error);
  };
});

// GET board game by ID
app.get(`${BACKEND_URL}/games-list/:id`, async (req, res) => {
  try {
    const { id } = req.params;

    const boardgame = await BoardgameModel.findById(id);

    res.json(boardgame);
  } catch (error) {
    console.error("Internal server error: ", error);
  };
});

// POST new board game
app.post(`${BACKEND_URL}/games`, async (req, res) => {
  try {
    const { name, maxPlayers } = req.body;

    const newGame = new BoardgameModel({
      name: name,
      maxPlayers: maxPlayers,
    });

    const savedGame = await newGame.save();

    res.json(savedGame);

  } catch (error) {

    console.error("Internal server error: ", error);
  };
});

// GET Board games
app.get(`${BACKEND_URL}/games-list`, async (req, res) => {
  try {

    const { maxPlayers } = req.query;
    let games;
    //let query = {};

    if (maxPlayers) {
      games = await BoardgameModel.find({ maxPlayers: { $lte: (maxPlayers) } })
    } else {
      games = await BoardgameModel.find();

    }

    res.json(games);

  } catch (error) {
    console.error("Internal server error: ", error);
  };
});


// POST new kitten
app.post(`${BACKEND_URL}/api/kittens/:employeeId`, async (req, res) => {
  try {
    const { name, weight } = req.body;
    const { employeeId } = req.params;

    console.log("Received employeeId: ", employeeId);

    const newKitten = new KittenModel({
      name: name,
      weight: weight,
      employee: employeeId,
    });

    const savedKitten = await newKitten.save();

    await EmployeeModel.findByIdAndUpdate(
      employeeId,
      { $push: { kittens: savedKitten._id } },
      { new: true }
    );

    return res.json(savedKitten);

  } catch (error) {
    console.error("Internal server error: ", error);
  };
});

// Display kittens
app.get(`${BACKEND_URL}/api/kittens/:employeeId`, async (req, res) => {
  try {
    const { employeeId } = req.params;

    const kittens = await KittenModel.find({ employee: employeeId });

    res.json(kittens);

  } catch (error) {
    console.error("Internal server error: ", error);
  };
});


// POST new tool
app.post(`${BACKEND_URL}/tools`, async (req, res) => {
  try {
    const { name, weight } = req.body;

    const newTool = new ToolsModel({
      name: name,
      weight: weight,
    });

    const savedTool = newTool.save();
    res.json(savedTool);


  } catch (error) {
    console.error("Internal server error: ", error);
  };
});


// Display tools
app.get(`${BACKEND_URL}/tools`, async (req, res) => {
  try {
    const { filter } = req.query;
    let tools;

    if (filter) {
      tools = await ToolsModel.find({ name: { $regex: filter, $options: 'i' } });
    } else {
      tools = await ToolsModel.find();
    }

    res.json(tools);

  } catch (error) {
    console.error("Internal server error: ", error);
  };

});

// Display top-paid
app.get(`${BACKEND_URL}/top-paid`, async (req, res) => {
  try {
    const topPaidEmployees = await EmployeeModel.find()
      .sort({ currentSalary: -1 })
      .limit(3)

    res.json(topPaidEmployees)
  } catch (error) {
    console.error("Internal server error: ", error)
  };
});

// Display superheroes
app.get(`${BACKEND_URL}/employees/superheroes`, async (req, res) => {
  try {
    const superheroEmployees = await EmployeeModel.find({ position: "Superhero" });
    return res.json(superheroEmployees);
  } catch (err) {
    return res.status(500).json({ error: "An error occurred while fetching superhero employees." });
  }
});


// GET all brands
app.get(`${BACKEND_URL}/brands`, async (req, res) => {
  try {
    const brand = await FavoriteBrandModel.find();
    res.json(brand);

  } catch (error) {
    res.status(500).json({ error: "internal server error" })
  }
});

// PATCH brand by ID
app.patch(`${BACKEND_URL}/brands/:id`, async (req, res) => {
  try {
    const updatedBrand = await FavoriteBrandModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBrand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.json(updatedBrand);

    console.log(updatedBrand)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


// GET all equipment
app.get(`${BACKEND_URL}/equipment`, async (req, res) => {
  try {
    const equipment = await Equipment.find();
    res.json(equipment);

    //console.log(equipment)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE equipment by ID
app.delete(`${BACKEND_URL}/equipment/:id`, async (req, res) => {
  try {
    const deletedEquipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!deletedEquipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }
    res.json(deletedEquipment);

    console.log(deletedEquipment)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST new equipment
app.post(`${BACKEND_URL}/equipment`, async (req, res) => {
  try {
    const { name, type, amount } = req.body;

    const newEquipment = new Equipment({
      name,
      type,
      amount,
    });

    const savedEquipment = await newEquipment.save();
    console.log(savedEquipment);

    res.status(201).json(savedEquipment);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH equipment by ID
app.patch(`${BACKEND_URL}/equipment/:id`, async (req, res) => {
  try {
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEquipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }
    res.json(updatedEquipment);

    console.log(updatedEquipment)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Display missing employees
app.get(`${BACKEND_URL}/api/employees/missing`, async (req, res) => {
  try {
    const missingEmployees = await EmployeeModel.find({ present: false });
    return res.json(missingEmployees);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search employees by name
app.get(`${BACKEND_URL}/employees/:search`, async (req, res) => {

  try {
    const searchQuery = req.params.search;

    const employees = await EmployeeModel.find({
      name: { $regex: searchQuery, $options: "i" },
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


// Sorting, filtering
app.get(`${BACKEND_URL}/api/employees/sorted`, async (req, res) => {
  try {
    const { position, level, sortBy, sortDir } = req.query;
    console.log("Request query parameters:", req.query);

    let query = {};

    if (position) {
      query.position = position;
    }

    if (level) {
      query.level = level;
    }

    let sortField = "created"; // Default sorting field

    // Define the allowed sorting fields
    const allowedSortFields = ["name", "middleName", "lastName", "position", "level"];

    // Check if the requested sort field is allowed
    if (allowedSortFields.includes(sortBy)) {
      sortField = sortBy;
    }

    console.log("Sort direction:", sortDir);
    console.log("-------------------------------")

    let employees = await EmployeeModel.find(query).populate({ path: 'favoriteBrand' }).populate({ path: 'favGame' });

    console.log(sortField);

    // Sorting by last name
    if (sortField === "lastName") {
      employees = employees.sort((a, b) => {
        const lastNameA = a.name.split(" ").pop();
        const lastNameB = b.name.split(" ").pop();

        return sortDir * lastNameA.localeCompare(lastNameB);
      });

      // Sorting by middle name
    } else if (sortField === "middleName") {
      employees = employees.sort((a, b) => {
        const middleNameA = a.name.split(" ").length > 2 ? a.name.split(" ")[1] : "";
        const middleNameB = b.name.split(" ").length > 2 ? b.name.split(" ")[1] : "";
        return sortDir * middleNameA.localeCompare(middleNameB);
      });


      // Sorting by first name
    } else if (sortField === "name") {
      employees = employees.sort((a, b) => {
        return sortDir * a.name.localeCompare(b.name);
      });

      // Sorting by level
    } else if (sortField === "level") {
      employees = employees.sort((a, b) => {
        return sortDir * a.level.localeCompare(b.level);
      });

      // Sorting by position
    } else if (sortField === "position") {
      employees = employees.sort((a, b) => {
        return sortDir * a.position.localeCompare(b.position);
      });
    }

    return res.json(employees);
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ success: false, message: "An error occurred while fetching" });
  }
});



// Display employees
app.get(`${BACKEND_URL}/api/employees/`, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * 10;

  const employees = await EmployeeModel.find().populate({ path: 'favoriteBrand' })
    /*   .sort({ created: "desc"}) */
    .populate({ path: 'favGame' })
    .skip(skip)
    .limit(limit);

  return res.json(employees);
});

app.get(`${BACKEND_URL}/api/employees/:id`, async (req, res) => {
  const employee = await EmployeeModel.findById(req.params.id).populate({ path: 'favoriteBrand' }).populate({ path: 'division' }).populate({ path: 'favGame' }).populate("tools");
  return res.json(employee);
});


app.post(`${BACKEND_URL}/api/employees/`, async (req, res, next) => {
  const employee = req.body;

  try {
    const saved = await EmployeeModel.create(employee);
    return res.json(saved);
  } catch (err) {
    return next(err);
  }
});



// Update employee presence
app.patch(`${BACKEND_URL}/api/employees/:id/missing`, async (req, res) => {
  try {
    const employee = await EmployeeModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { present: req.body.present } },
      { new: true }
    );
    return res.json(employee);
  } catch (error) {
    return (error)
  }
});


app.patch(`${BACKEND_URL}/api/employees/:id`, async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    return res.json(employee);
  } catch (err) {
    return next(err);
  }
});

app.delete(`${BACKEND_URL}/api/employees/:id`, async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    const deleted = await employee.delete();
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
});



const main = async () => {
  await mongoose.connect(MONGO_URI);

  // Update existing employees to include the 'present' key with default value 'false'
  await EmployeeModel.updateMany(
    { present: { $exists: false } },
    { $set: { present: false } }
  );


  // Create and populate tools collection
  const toolsArray = [
    { name: "Notebook", weight: 0.5 },
    { name: "Pencil", weight: 0.06 },
    { name: "Pen", weight: 0.12 },
    { name: "Book", weight: 1 }

  ];
  await ToolsModel.insertMany(toolsArray);

  // Updating employee documents to include kittens array
  await EmployeeModel.updateMany(
    { kittens: { $exists: false } },
    { $set: { kittens: [] } },
  );

  // Updating kitten documents to include employee array
  await KittenModel.updateMany(
    { employee: { $exists: false } },
    { $set: { employee: null } },
  );


  app.listen(PORT, () => {
    console.log("App is listening on 3001");
    console.log("Try /api/employees route right now");
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
