const cds = require("@sap/cds");
const { MongoClient } = require("mongodb");

// MongoDB connection URI
const uri = "mongodb://Amiya:Amiya1999@74.225.222.62:27017/";

// MongoDB Client setup
let client;
let mongoCollection;

async function connectToMongoDB() {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const database = client.db("Pratham");
    mongoCollection = database.collection("RootApplicationManagement");
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

module.exports = cds.service.impl(async function () {
  // Connect to MongoDB when the service starts
  await connectToMongoDB();

  const { ApplicationManagement } = this.entities;

  this.on("READ", ApplicationManagement, async (req) => {
    const result = await mongoCollection
      .aggregate([
        {
          $lookup: {
            from: "ItemApplicationManagement",
            localField: "_id", // Assuming you want to match on the _id of RootApplicationManagement
            foreignField: "groupid", // Matches the groupid in the ItemApplicationManagement
            as: "children", // Renaming 'applicationid' to 'children' for clarity
          },
        },
        {
          $project: {
            // _id: 0,  Optionally, remove the _id if not needed
            GroupName: 1,
            NameSpace: 1,
            ApplicationId: 1,
            sequenceNo: 1,
            Items: "$children", // Keeping all children information
          },
        },
      ])
      .toArray();

    // Wrapping the result in an object with 'LpadData' key
    const output = {
      LpadData: result,
    };

    console.log(JSON.stringify(output, null, 2));
    result["$count"] = result.length;
    return result;
  });

  this.on("disconnect", async () => {
    if (client) {
      await client.close();
      console.log("Disconnected from MongoDB.");
    }
  });
});
