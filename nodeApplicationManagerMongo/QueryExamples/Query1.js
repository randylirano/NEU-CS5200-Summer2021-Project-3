// Query1: Update "" position by randomly assigning between ["intern", "Software Engineer I", "Software Engineer II", "Software Engineer III"]

const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

// retrieve posting collection as an array of posting
async function getPosting() {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db("ApplicationManager");
    const postingCollection = database.collection("Posting");

    const query = {};

    return await postingCollection.find(query).toArray();
  } catch(e) {
    console.log("Error", e);
  } finally {
    client.close();
  }
}

// fix "" position
async function fixNullPosition(postingId, postingDoc) {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    // define database to be used
    const database = client.db("ApplicationManager");
    // define collection from database to be used
    const postingCollection = database.collection("Posting");

    const acceptablePositions = ["Intern", "Software Engineer I", "Software Engineer II", "Software Engineer III"];

    const randIndex = Math.floor(Math.random() * acceptablePositions.length);

    const assignPosition = acceptablePositions[randIndex];

    const filter = {"posting_id": postingId};

    const updateDoc = {
      $set: {"position": assignPosition}
    };

    const options = {
      upsert: true
    };

    const result = await postingCollection.updateOne(filter, updateDoc, options);
  } catch (e) {
    console.log("Error", e);
  } finally {
      //When we are done, close the connection
      client.close();
  }
}

async function driver() {
  const postingArray = await getPosting();

  for (let elem of postingArray) {
    if (elem.position === "") {
      await fixNullPosition(elem.posting_id, elem);
    }
  }
}

driver()