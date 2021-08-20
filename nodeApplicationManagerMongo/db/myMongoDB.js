const { MongoClient, ObjectId } = require("mongodb");
const redis = require("redis");
const { promisify } = require("util");

// global variables
const uri = process.env.MONGO_URL || "mongodb://localhost:27017";

const DB_NAME = "ApplicationManager";
const POSTING_COL = "Posting";
const APPLICATION_COL = "Application";

async function getPostings(query, page, pageSize) {
  console.log("getPostings", query);
  
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      position: { $regex: `^${query}`, $options: "i" }
    };

    return await client
      .db(DB_NAME)
      .collection(POSTING_COL)
      .find(queryObj)
      .sort({ posting_id: -1 })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .toArray();

  } finally {
    client.close();
  }
}


async function getApplications(query, page, pageSize) {
  console.log("getApplications", query);
  
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      
    };

    return await client
      .db(DB_NAME)
      .collection(APPLICATION_COL)
      .find(queryObj)
      .sort({ application_id: -1 })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .toArray();

  } finally {
    client.close();
  }
}


async function getPostingsCount(query) {
  console.log("getPostingsCount", query);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      position: { $regex: `^${query}`, $options: "i" }
    };

    return await client
      .db(DB_NAME)
      .collection(POSTING_COL)
      .find(queryObj)
      .count();

  } finally {
    client.close();
  }

}


async function getApplicationsCount(query) {
  console.log("getApplicationsCount", query);

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {};

    return await client
      .db(DB_NAME)
      .collection(APPLICATION_COL)
      .find(queryObj)
      .count();

  } finally {
    client.close();
  }

}


async function getPostingLeaderboard() {
  console.log("Retrieving Leaderboard");

  const clientMongo = new MongoClient(uri);
  const clientRedis = redis.createClient();

  clientRedis.p_zincrby = promisify(clientRedis.ZINCRBY).bind(clientRedis);
  clientRedis.p_zrevrange = promisify(clientRedis.ZREVRANGE).bind(clientRedis);
  clientRedis.p_zrevrangebyscore = promisify(clientRedis.ZREVRANGEBYSCORE).bind(clientRedis);

  clientRedis.on("error Redis", (err) => console.log(err));

  try {
    await clientMongo.connect();

    const applicationCollection = clientMongo.db(DB_NAME).collection(APPLICATION_COL);

    const cursor = await applicationCollection.find({});

    for await (let application of cursor) {
      clientRedis.p_zincrby("postingLeaderboard", 1, application.posting_id);
    }

    return clientRedis.p_zrevrange("postingLeaderboard", 0, 5);


  } catch (err) {
    console.log("Mongo Error", err);
  } finally {
    clientMongo.close();
    clientRedis.quit();
  }
}


async function getReferenceByID(reference_id) {
  console.log("getReferenceByID", reference_id);

  // const client = new MongoClient(uri);

  // try {
  //   await client.connect();

  //   const queryObj = {
  //     _id: new ObjectId(reference_id)
  //   };

  //   return await client
  //     .db(DB_NAME)
  //     .collection(COL_NAME)
  //     .findOne(queryObj);

  // } finally {
  //   client.close();
  // }
}


async function updateReferenceByID(reference_id, ref) {
  console.log("updateReferenceByID", reference_id, ref);

  // const client = new MongoClient(uri);

  // try {
  //   await client.connect();

  //   const queryObj = {
  //     _id: new ObjectId(reference_id)
  //   };

  //   // If tags is a string convert it to an array
  //   if (typeof ref.tags === "string") {
  //     ref.tags = ref.tags.split(",").map((t) => t.trim()); // removes whitespace
  //   }

  //   return await client
  //     .db(DB_NAME)
  //     .collection(COL_NAME)
  //     .updateOne(queryObj, { $set: ref });

  // } finally {
  //   client.close();
  // }
}


async function deleteReferenceByID(reference_id) {
  console.log("deleteReferenceByID", reference_id);

  // const db = await open({
  //   filename: "./db/database.db",
  //   driver: sqlite3.Database,
  // });

  // const stmt = await db.prepare(`
  //   DELETE FROM Reference
  //   WHERE
  //      reference_id = @reference_id;
  //   `);

  // const params = {
  //   "@reference_id": reference_id,
  // };

  // try {
  //   return await stmt.run(params);
  // } finally {
  //   await stmt.finalize();
  //   db.close();
  // }
}


async function insertReference(ref) {
  // const db = await open({
  //   filename: "./db/database.db",
  //   driver: sqlite3.Database,
  // });

  // const stmt = await db.prepare(`INSERT INTO
  //   Reference(title, published_on)
  //   VALUES (@title, @published_on);`);

  // try {
  //   return await stmt.run({
  //     "@title": ref.title,
  //     "@published_on": ref.published_on,
  //   });
  // } finally {
  //   await stmt.finalize();
  //   db.close();
  // }
}


async function getAuthorsByReferenceID(reference_id) {
  console.log("getAuthorsByReferenceID", reference_id);

  // const db = await open({
  //   filename: "./db/database.db",
  //   driver: sqlite3.Database,
  // });

  // const stmt = await db.prepare(`
  //   SELECT * FROM Reference_Author
  //   NATURAL JOIN Author
  //   WHERE reference_id = @reference_id;
  //   `);

  // const params = {
  //   "@reference_id": reference_id,
  // };

  // try {
  //   return await stmt.all(params);
  // } finally {
  //   await stmt.finalize();
  //   db.close();
  // }
}


async function addVenueToReferenceID(reference_id, venue) {
  console.log("addVenueToReferenceID", reference_id, venue);


  const client = new MongoClient(uri);

  try {
    await client.connect();

    const queryObj = {
      _id: new ObjectId(reference_id),
      // reference_id: +reference_id,
    };


    return await client
      .db(DB_NAME)
      .collection(COL_NAME)
      .updateOne(queryObj, { $push: { venues: venue } });
  } finally {
    client.close();
  }
}




module.exports.getPostings = getPostings;
module.exports.getApplications = getApplications;
module.exports.getPostingsCount = getPostingsCount;
module.exports.getApplicationsCount = getApplicationsCount;
module.exports.getPostingLeaderboard = getPostingLeaderboard;

module.exports.insertReference = insertReference;
module.exports.getReferenceByID = getReferenceByID;
module.exports.updateReferenceByID = updateReferenceByID;
module.exports.deleteReferenceByID = deleteReferenceByID;
module.exports.getAuthorsByReferenceID = getAuthorsByReferenceID;
module.exports.addVenueToReferenceID = addVenueToReferenceID;