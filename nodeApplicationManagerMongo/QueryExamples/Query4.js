// Query4: Find 5 applicants with the most submitted application

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";

async function getMostSubmittingApplicant() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("ApplicationManager");
        const applicationCollection = database.collection("Application");

        const query = [
            {
              '$group': {
                '_id': '$applicant.applicant_id', 
                'count': {
                  '$sum': 1
                }
              }
            }, {
              '$sort': {
                'count': -1
              }
            }, {
              '$limit': 5
            }
          ];

        const result = await applicationCollection.aggregate(query).toArray();
        console.log(result);

    } catch(e) {
        console.log("Error", e);
    } finally {
        client.close();
    }
}

getMostSubmittingApplicant()