const cds = require("@sap/cds");
const { MongoClient } = require("mongodb");

// MongoDB connection URI :- 
const uri = "mongodb://Amiya:Amiya1999@74.225.222.62:27017/";

// MongoDB Client setup :-
let client;
let mongoCollection;

async function connectToMongoDB() {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const database = client.db("Pratham"); // Specify your database name
    mongoCollection = database.collection("Account"); // Specify your collection name
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

module.exports = cds.service.impl(async function () {
  // Connect to MongoDB when the service starts
  await connectToMongoDB();

  const { deptviews } = this.entities;

  //Creating account here :-
  this.before("CREATE", deptviews, async (req) => {
    console.log("Before creating a department:", req.data);
  });
  this.on("CREATE", deptviews, async (req) => {
    try {
      // Assign the value of the 'id' field to the '_id' field
      req.data._id = req.data.id;

      // Format the creation date and time
      const now = new Date();
      const formattedDate = now.getDate().toString().padStart(2, '0') + '-' +
        (now.getMonth() + 1).toString().padStart(2, '0') + '-' +
        now.getFullYear().toString() + ',' +
        now.getHours().toString().padStart(2, '0') + ':' +
        now.getMinutes().toString().padStart(2, '0');
      // Outputs: "14-05-2024,03:54" (depending on the current date and time)

      // Add the formatted creation date and time
      req.data.createdDateTime = formattedDate;

      //Created by which user :-
      req.data.createdBy = "Super User";

      //Added Status Field :-
      req.data.status = req.data.status || "Active";

      //Added Status Criticality Field to render conditionally:-
      req.data.statusCriticality = req.data.statusCriticality || "3";

      // Insert the document into MongoDB
      const result = await mongoCollection.insertOne(req.data);
      console.log(
        `Document inserted in MongoDB with _id: ${result.insertedId}`
      );

      // Return the inserted document with the MongoDB-generated ID and formatted createdDateTime
      return {
        ...req.data,
        _id: result.insertedId,
        createdDateTime: formattedDate,
      };
    } catch (err) {
      console.error("Error inserting document into MongoDB", err);
      req.error(500, "Unable to insert data");
    }
  });

this.on("READ", deptviews, async (req) => {
  try {
     
      let query = {};      //For search operation and for update as well of particular/ Unique data

      // Extract conditions from the req.query.SELECT.where clause if it exists
      if (req.query.SELECT.where) {
          const whereClause = req.query.SELECT.where;
          for (let i = 0; i < whereClause.length; i += 2) {
              // Check for field and value pairs
              if (whereClause[i].ref && whereClause[i + 1] === '=') {
                  const field = whereClause[i].ref[0];
                  const value = whereClause[i + 2].val;
                  query[field] = value;  
                  i++; 
              }
          }
      }

      console.log('Query based on conditions:', query);

      // Fetch documents based on constructed query
      const documents = await mongoCollection.find(query).toArray();
      console.log("Fetched documents:", documents);

      // Calculate the total count of records matching the query
      const totalCount = await mongoCollection.countDocuments(query);
      console.log(totalCount, "---------------count");

      // Transform data to match expected output structure, especially handling the _id field
      const transformedDocuments = documents.map((doc) => ({
          ...doc,
          ID: doc._id, // Convert MongoDB '_id' to 'ID' expected by CAP
      }));

      transformedDocuments["$count"] = totalCount; // Include $count for CAP consumption
      return transformedDocuments;
  } catch (err) {
      console.error("Error reading documents from MongoDB", err);
      req.error(500, "Unable to fetch data");
      return [];
  }
  
});


  //Update the account record here :
  // http://localhost:4004/odata/v4/account/deptviews(id=3a56a681-f102-480f-8696-b40ba5431400)(postman id format)
  this.on("PUT", deptviews, async (req) => {
    const id = req.params[0].id;
    const { name, postalcode, applicationType, description } = req.data;
    try {
      console.log("Updating document in MongoDB with ID:", id);

      const result = await mongoCollection.updateOne(
        { _id: id },
        { $set: { name, postalcode, applicationType, description } }
      );

      if (result.matchedCount === 0) {
        console.log("No document found with ID:", id);
        req.error(404, "Document not found");
        return;
      }

      console.log("Document updated successfully");
      req.respond(200, "Document updated successfully");
    } catch (err) {
      console.error("Error updating document in MongoDB", err);
      req.error(500, "Unable to update document");
    }
  });

  // Delete account record here :-  
  this.on("DELETE", deptviews, async (req) => {
    try {
      const idToDelete = req.params[0].id; // Extract the ID from the request URL parameters
      if (!idToDelete) {
        throw new Error("ID field is missing or undefined");
      }

      const result = await mongoCollection.deleteOne({ _id: idToDelete });
      if (result.deletedCount === 1) {
        console.log(
          `Document with ID ${idToDelete} deleted successfully from MongoDB`
        );
      } else {
        console.log(`No document found with ID ${idToDelete}`);
      }
    } catch (error) {
      console.error("Error deleting document from MongoDB", error);
      req.error(500, "Unable to delete document");
    }
  });

  this.on("disconnect", async () => {
    if (client) {
      await client.close();
      console.log("Disconnected from MongoDB.");
    }
  });
});
