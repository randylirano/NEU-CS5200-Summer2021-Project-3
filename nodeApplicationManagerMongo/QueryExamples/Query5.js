// Query5: Find average hired rate for each applicant language

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";

async function getLanguageHiredAvg() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("ApplicationManager");
        const applicationCollection = database.collection("Application");

        const query = [
            {
              '$group': {
                '_id': '$applicant_language', 
                'count': {
                  '$avg': {
                    '$cond': [
                      {
                        '$eq': [
                          '$hired', true
                        ]
                      }, 1, 0
                    ]
                  }
                }
              }
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

getLanguageHiredAvg()


