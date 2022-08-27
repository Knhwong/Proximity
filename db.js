const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'geoPoints';
const points = [{
        uid: "1",
        loc: {
            type: "Point",
            coordinates: [51.491615, -0.195135]
        }
    },
    {
        uid: "2",
        loc: {
            type: "Point",
            coordinates: [51.491411, -0.195417]
        }
    },
    {
        uid: "3",
        loc: {
            type: "Point",
            coordinates: [51.468876, -0.157163]
        }
    },
    {
        uid: "4",
        loc: {
            type: "Point",
            coordinates: [51.468876, -0.157163]
        }
    }
]

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db('geoPoints');
    const collection = db.collection('users');
    //err = await collection.insertMany(points);
    //console.log('Inserted Points =>', err);

    err = await collection.createIndex({ loc: "2dsphere" });
    console.log('Created Index =>', err);

    const firstUser = await collection.findOne({ uid: "1" });
    //console.log(firstUser);
    const near = await collection.find({
        loc: {
            $near: {
                $geometry: firstUser.loc,
                $maxDistance: 50,
                $minDistance: 0
            }
        }
    }).toArray();
    console.log("Nearest Coordinates", near);
    return 'done.';
}

//main()
//    .then(console.log)
//    .catch(console.error)
//    .finally(() => client.close());
class dbo {
    sayHello() {
        console.log("Sup bro")
    }
}

module.exports.dbo = new dbo()

module.exports.sum = function sum(...args) {
    console.log("Hello World")
}