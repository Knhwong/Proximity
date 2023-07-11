const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'geoPoints';
// Demo code!
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

class db {
    constructor(url) {
        this.client = new MongoClient(url);
    }
    async connect() {
            try {
                await this.client.connect()
                this.db = client.db('geoPoints');
                this.collection = db.collection('users')
            } catch (err) {
                console.error("Error: ", err);
            }
        }
        // Only needed if 2d index not built in server.
    async BuildIndex() {
        try {
            info = await collection.createIndex({ loc: "2dsphere" });
            console.log('Index: ', info);
        } catch (err) {
            console.error("Build Index Error: ", err);
        }
    }

    async InsertOrUpdate(user) {
        try {
            if (90 >= user.longitude >= -90 && 180 >= user.latitude >= -180) {
                var geoUser = {
                    uid: user.uid,
                    loc: {
                        type: "Point",
                        coordinates: [user.longitude, user.latitude]
                    }
                }
                const info = await collection.updateOne({ uid: user.uid }, {
                        $set: geoUser
                    }, {
                        upsert: true
                    }

                );
                console.log('Insertion: ', info)
            } else {
                throw "Invalid Longitude or Latitude"
            }
        } catch (err) {
            console.error("Insertion Error: ", err);
        }
    }

    async find(user) {
        try {
            const user = await collection.findOne({ uid: user.uid });
            return user;
        } catch (err) {
            console.error("Find: ", err)
        }
    }
}


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


module.exports.db = new dbo()