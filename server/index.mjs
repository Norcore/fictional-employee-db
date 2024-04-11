import EmployeeModel from './db/employee.model.js';
import FavoriteBrandModel from './db/favoritebrand.model.js';
import BoardgameModel from './db/boardgame.model.js';
import ToolsModel from './db/tools.model.js';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
const secret_name = "fictional-employee-db-secret";
const client = new SecretsManagerClient({ region: 'eu-central-1' });

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,PATCH,DELETE',
};

const getSecret = async () => {
  try {
    const data = await client.send(new GetSecretValueCommand({ SecretId: secret_name }));
    if ('SecretString' in data) {
      const secret = JSON.parse(data.SecretString);
      return secret;
    } else {
      throw new Error('SecretString not found');
    }
  } catch (err) {
    console.error('Error retrieving secret:', err);
    throw err;
  }
};

const connectToDB = async () => {
  try {
    const secret = await getSecret();

    // Connection URI for MongoDB
    const uri = `mongodb://${secret.username}:${secret.password}@fictional-employee-db-cluster.cluster-cblqv8oftgm3.eu-central-1.docdb.amazonaws.com:27017/fictional-employee-db?tls=true&tlsCAFile=global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`;

    // Connect to MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Connected to MongoDB");

    // Enable change streams
    await mongoose.connection.db.admin().command({
      modifyChangeStreams: 1,
      database: 'fictional-employee-db',
      collection: 'employees',
      enable: true
    });

    console.log("Change streams enabled");

    return mongoose.connection;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
};

// Handler
export const handler = async (event) => {

  try {
    await connectToDB();
    const path = event.path;

    // Debugging
    console.log("Event BEFORE event.httpMethod if block: ", event);
    console.log("Event httpMethod BEFORE event.httpMethod if block: ", event.httpMethod);

    if (event.httpMethod === 'OPTIONS') {
      console.log("Event INSIDE event.httpMethod if block: ", event);
      console.log("Event httpMethod INSIDE event.httpMethod if block: ", event.httpMethod);
      return {
        statusCode: 200,
        headers,
      };
    }

    const basePath = '/default/fictional-employee-db/api/employees';

    if (path.startsWith(basePath + '/')) {
      const id = path.substring(basePath.length + 1);

      if (event.httpMethod === 'GET') {
        // Handle GET requests
        if (id === 'candidates') {
          return await getCandidates(event);
        } else if (id === 'sorted') {
          return await getSortedEmployees(event);
        } else if (id === 'similaremployees') {
          return await getSimilarEmployees(event);
        } else if (id === 'missing') {
          return await getMissingEmployees(event);
        } else if (id.startsWith('search')) {
          return await searchEmployees(event);
        } else {
          return await getEmployeeById(id);
        }
      } else if (event.httpMethod === 'PATCH') {
        // Handle PATCH request
        if (path.endsWith('/missing')) {
          const body = JSON.parse(event.body);
          const employee = await updateEmployeePresence(event, body.present);
          return {
            statusCode: 200,
            body: JSON.stringify(employee),
            headers,
          };
        } else {
          const body = JSON.parse(event.body);
          const employee = await updateEmployee(event, body);
          return {
            statusCode: 200,
            body: JSON.stringify(employee),
            headers,
          };
        }
      } else if (event.httpMethod === 'DELETE') {
        // Handle DELETE request
        const deleted = await deleteEmployee(event);
        return {
          statusCode: 200,
          body: JSON.stringify(deleted),
          headers,
        };
      }
    } else if (path === basePath) {
      if (event.httpMethod === 'GET') {
        return await getEmployees(event);
      } else if (event.httpMethod === 'POST') {
        // Handle POST request
        const body = JSON.parse(event.body);
        const saved = await createEmployee(body);
        return {
          statusCode: 201,
          body: JSON.stringify(saved),
          headers,
        };
      }
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify('Endpoint not found'),
        headers,
      };
    }
  } catch (error) {
    console.error('Internal server error: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers,
    };
  }
};

// Function to handle GET /api/employees/
const getEmployees = async (event) => {
  try {
    const page = parseInt(event.queryStringParameters?.page) || 1;
    const limit = parseInt(event.queryStringParameters?.limit) || 10;
    const skip = (page - 1) * 10;

    const employees = await EmployeeModel.find().skip(skip).limit(limit);

    return {
      statusCode: 200,
      body: JSON.stringify(employees),
      headers,
    };
  } catch (error) {
    console.error('Internal server error: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers,
    };
  }
};

// Function to handle GET /api/employees/:id/
const getEmployeeById = async (event) => {
  try {
    const employeeId = event.pathParameters.id;
    const employee = await EmployeeModel.findById(employeeId).populate('favoriteBrand').populate('division').populate('favGame').populate('tools');

    if (!employee) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Employee not found' }),
        headers,
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(employee),
      headers,
    };
  } catch (error) {
    console.error('Internal server error: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers,
    };
  }
};

// Function to handle GET /api/employees/candidates/
const getCandidates = async (event) => {
  try {
    const { filter } = event.queryStringParameters;
    let candidates;

    if (filter) {
      candidates = await EmployeeModel.find({ name: { $regex: `^${filter}` } });
    } else {
      candidates = await EmployeeModel.find();
    }

    return {
      statusCode: 200,
      body: JSON.stringify(candidates),
      headers,
    };
  } catch (error) {
    console.error('Internal server error: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers,
    };
  }
};

// Function to handle GET /api/employees/sorted/
const getSortedEmployees = async (event) => {
  try {
    const { position, level, sortBy, sortDir } = event.queryStringParameters;
    console.log("Request query parameters:", event.queryStringParameters);

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
    console.log("-------------------------------");
    console.dir("Employee sorting Query: ", query);

    let employees = await EmployeeModel.find(query).populate('favoriteBrand').populate('favGame');

    console.log(sortField);

    // Sorting by last name
    if (sortField === "lastName") {
      employees = employees.sort((a, b) => {
        const lastNameA = a.name.split(" ").pop();
        const lastNameB = b.name.split(" ").pop();

        return sortDir * lastNameA.localeCompare(lastNameB);
      });
    } else if (sortField === "middleName") {
      // Sorting by middle name
      employees = employees.sort((a, b) => {
        const middleNameA = a.name.split(" ").length > 2 ? a.name.split(" ")[1] : "";
        const middleNameB = b.name.split(" ").length > 2 ? b.name.split(" ")[1] : "";
        return sortDir * middleNameA.localeCompare(middleNameB);
      });
    } else if (sortField === "name") {
      // Sorting by first name
      employees = employees.sort((a, b) => sortDir * a.name.localeCompare(b.name));
    } else if (sortField === "level") {
      // Sorting by level
      employees = employees.sort((a, b) => sortDir * a.level.localeCompare(b.level));
    } else if (sortField === "position") {
      // Sorting by position
      employees = employees.sort((a, b) => sortDir * a.position.localeCompare(b.position));
    }

    return {
      statusCode: 200,
      body: JSON.stringify(employees),
      headers,
    };
  } catch (err) {
    console.error(err); // Log the error for debugging
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "An error occurred while fetching" }),
      headers,
    };
  }
};


// Function to handle GET /api/employees/similaremployees/
const getSimilarEmployees = async (event) => {
  try {
    const { level, position } = event.queryStringParameters;

    const similarEmployees = await EmployeeModel.find({ level, position });

    return {
      statusCode: 200,
      body: JSON.stringify(similarEmployees),
      headers,
    };
  } catch (error) {
    console.error('Internal server error: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify('Internal server error'),
      headers,
    };
  }
};

// Function to handle GET /api/employees/:search/
const searchEmployees = async (event) => {
  try {
    const searchQuery = event.pathParameters.search;

    const employees = await EmployeeModel.find({
      name: { $regex: searchQuery, $options: "i" },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(employees),
      headers,
    };
  } catch (error) {
    console.error('Internal server error: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers,
    };
  }
};

// Function to handle GET /api/employees/missing/
const getMissingEmployees = async (collection, event) => {
  try {
    const missingEmployees = await EmployeeModel.find({ present: false });
    return {
      statusCode: 200,
      body: JSON.stringify(missingEmployees),
      headers,
    };
  } catch (error) {
    console.error('Internal server error: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers,
    };
  }
};

// POST employee
const createEmployee = async (employeeData) => {
  try {
    const saved = await EmployeeModel.create(employeeData);
    return {
      statusCode: 201,
      body: JSON.stringify(saved),
      headers,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers,
    };
  }
};

// Update employee presence
const updateEmployeePresence = async (event, presence) => {
  try {
    const employeeId = event.pathParameters.id;

    if (event.httpMethod === 'OPTIONS') {
      console.log("Event INSIDE event.httpMethod if block: ", event);
      console.log("Event httpMethod INSIDE event.httpMethod if block: ", event.httpMethod);
      return {
        statusCode: 200,
        headers,
      };
    }

    const employee = await EmployeeModel.findByIdAndUpdate(
      { _id: employeeId },
      { $set: { present: presence } },
      { new: true }
    );
    return {
      statusCode: 200,
      body: JSON.stringify(employee),
      headers,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers,
    };
  }
};

// Update employee
const updateEmployee = async (event, updatedData) => {
  try {
    const employeeId = event.pathParameters.id;
    const employee = await EmployeeModel.findByIdAndUpdate(
      employeeId,
      { $set: { ...updatedData } },
      { new: true }
    );
    return {
      statusCode: 200,
      body: JSON.stringify(employee),
      headers,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers,
    };
  }
};

// Delete employee
const deleteEmployee = async (event) => {
  try {
    const employeeId = event.pathParameters.id;
    const deleted = await EmployeeModel.findByIdAndDelete(employeeId);
    return {
      statusCode: 200,
      body: JSON.stringify(deleted),
      headers,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers,
    };
  }
};

