import EmployeeModel from './db/employee.model.js';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
const secret_name = "fictional-employee-db-secret";
const client = new SecretsManagerClient({ region: 'eu-central-1' });

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
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await client.connect();

    console.log("Before stream change enable stuff");
    await client.db('fictional-employee-db').admin().command({
      modifyChangeStreams: 1,
      database: 'fictional-employee-db',
      collection: 'employees',
      enable: true
    });
    
    console.log("After stream change enable stuff");
    //await client.connect();

    // Access the database and collection
    const database = client.db('fictional-employee-db');
    const collection = database.collection('employees');

    return { client, collection };
  } catch (err) {
    console.error('Error connecting to DocumentDB:', err);
    throw err;
  }
};

// Handler
export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
  };

  try {
    const { client, collection } = await connectToDB();
    const path = event.path;

    if (event.httpMethod === 'OPTIONS') {
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
          return await getCandidates(collection, event);
        } else if (id === 'sorted') {
          return await getSortedEmployees(collection, event);
        } else if (id === 'similaremployees') {
          return await getSimilarEmployees(collection, event);
        } else if (id === 'missing') {
          return await getMissingEmployees(collection, event);
        } else if (id.startsWith('search')) {
          return await searchEmployees(collection, event);
        } else {
          return await getEmployeeById(collection, event);
        }
      } else if (event.httpMethod === 'PATCH') {
        // Handle PATCH request
        const body = JSON.parse(event.body);
        const employee = await updateEmployeePresence(collection, id, body.present);
        return {
          statusCode: 200,
          body: JSON.stringify(employee),
          headers,
        };
      } else if (event.httpMethod === 'DELETE') {
        // Handle DELETE request
        const deleted = await deleteEmployee(collection, id);
        return {
          statusCode: 200,
          body: JSON.stringify(deleted),
          headers,
        };
      }
    } else if (path === basePath) {
      if (event.httpMethod === 'GET') {
        return await getEmployees(collection, event);
      } else if (event.httpMethod === 'POST') {
        // Handle POST request
        const body = JSON.parse(event.body);
        const saved = await createEmployee(collection, body);
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
const getEmployees = async (collection, event) => {
  try {
    const page = parseInt(event.queryStringParameters?.page) || 1;
    const limit = parseInt(event.queryStringParameters?.limit) || 10;
    const skip = (page - 1) * 10;

    const employees = await collection.find().skip(skip).limit(limit).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(employees),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Internal server error: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

// Function to handle GET /api/employees/:id/
const getEmployeeById = async (collection, event) => {
  try {
    const employeeId = event.pathParameters.id;
    const employee = await collection.findById(employeeId).populate('favoriteBrand').populate('division').populate('favGame').populate('tools');
    
    if (!employee) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Employee not found' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(employee),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Internal server error: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

// Function to handle GET /api/employees/candidates/
const getCandidates = async (collection, event) => {
  try {
    const { filter } = event.queryStringParameters;
    let candidates;

    if (filter) {
      candidates = await collection.find({ name: { $regex: `^${filter}` } });
    } else {
      candidates = await collection.find();
    }

    return {
      statusCode: 200,
      body: JSON.stringify(candidates),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Internal server error: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify('Internal server error'),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

// Function to handle GET /api/employees/sorted/
const getSortedEmployees = async (collection, event) => {
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

    let employees = await collection.find(query).populate('favoriteBrand').populate('favGame');

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
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (err) {
    console.error(err); // Log the error for debugging
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "An error occurred while fetching" }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};


// Function to handle GET /api/employees/similaremployees/
const getSimilarEmployees = async (collection, event) => {
  try {
    const { level, position } = event.queryStringParameters;

    const similarEmployees = await collection.find({ level, position });

    return {
      statusCode: 200,
      body: JSON.stringify(similarEmployees),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Internal server error: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify('Internal server error'),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

// Function to handle GET /api/employees/:search/
const searchEmployees = async (collection, event) => {
  try {
    const searchQuery = event.pathParameters.search;

    const employees = await collection.find({
      name: { $regex: searchQuery, $options: "i" },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(employees),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Internal server error: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

// Function to handle GET /api/employees/missing/
const getMissingEmployees = async (collection, event) => {
  try {
    const missingEmployees = await collection.find({ present: false });
    return {
      statusCode: 200,
      body: JSON.stringify(missingEmployees),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Internal server error: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

// POST employee
const createEmployee = async (collection, employeeData) => {
  try {
    const saved = await collection.insertOne(employeeData);
    return saved.ops[0];
  } catch (err) {
    throw err;
  }
};

// Update employee presence
const updateEmployeePresence = async (collection, employeeId, presence) => {
  try {
    const employee = await collection.findOneAndUpdate(
      { _id: ObjectId(employeeId) },
      { $set: { present: presence } },
      { returnDocument: 'after' }
    );
    return employee.value;
  } catch (error) {
    throw error;
  }
};

// Update employee
const updateEmployee = async (collection, employeeId, updatedData) => {
  try {
    const employee = await collection.findOneAndUpdate(
      { _id: ObjectId(employeeId) },
      { $set: { ...updatedData } },
      { returnDocument: 'after' }
    );
    return employee.value;
  } catch (err) {
    throw err;
  }
};

// Delete employee
const deleteEmployee = async (collection, employeeId) => {
  try {
    const deleted = await collection.findOneAndDelete({ _id: ObjectId(employeeId) });
    return deleted.value;
  } catch (err) {
    throw err;
  }
};