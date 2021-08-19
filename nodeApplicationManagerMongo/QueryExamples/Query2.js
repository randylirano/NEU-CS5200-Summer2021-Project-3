// Query2: Show the top 15 posting by the number of submitted applications

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function getSubmittedApplicationCount() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("ApplicationManager");
        const postingCollection = database.collection("Posting");

        const query = [
            {
              '$lookup': {
                'from': 'Application', 
                'let': {
                  'id': '$posting_id'
                }, 
                'pipeline': [
                  {
                    '$match': {
                      '$expr': {
                        '$eq': [
                          '$posting_id', '$$id'
                        ]
                      }
                    }
                  }, {
                    '$count': 'count'
                  }
                ], 
                'as': 'submitted_application'
              }
            }, {
              '$sort': {
                'submitted_application': -1
              }
            }, {
                '$limit': 15
              }
          ];

        const result = await postingCollection.aggregate(query).toArray();
        console.log(result);

    } catch(e) {
        console.log("Error", e);
    } finally {
        client.close();
    }
}

getSubmittedApplicationCount()


