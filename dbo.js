const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';

class db {
    constructor(url) {
        this.client = new MongoClient(url);
    }
    async connect() {
            try {
                await this.client.connect()
                this.db = this.client.db('geoPoints');
                this.collection = this.db.collection('users')
            } catch (err) {
                console.error("Error: ", err);
            }
        }
        // Only needed if 2d index not built in server.
    async BuildIndex() {
        try {
            info = await this.collection.createIndex({ loc: "2dsphere" });
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
                const info = await this.collection.updateOne({ uid: user.uid }, {
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

    async FindNearest(user, range) {
        try {
            const geoUser = await this.Find(user);
            const nearest = await this.collection.find({
                loc: {
                    $near: {
                        $geometry: geoUser.loc,
                        $maxDistance: 50,
                        $minDistance: 0.1
                    }
                }
            }).toArray()
            const formattedNearest = nearest.map((u) => {
                return {
                    uid: u.uid,
                    longitude: u.loc.coordinates[0],
                    latitude: u.loc.coordinates[1]
                }
            })
            return formattedNearest;
        } catch (err) {
            console.error("Finding Nearest: ", err);
        }
    }

    async Find(user) {
        try {
            const foundUser = await this.collection.findOne({ uid: user.uid });
            return foundUser;
        } catch (err) {
            console.error("Find: ", err)
        }
    }

    async ShowAll() {
        try {
            const allUsers = await this.collection.find().toArray()
            console.log(allUsers);
        } catch (err) {
            console.error("ShowAll:", err);
        }
    }
}

module.exports.db = new db(url)