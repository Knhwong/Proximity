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
                this.messages = this.db.collection('messages')
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
                    id: user.id,
                    loc: {
                        type: "Point",
                        coordinates: [user.longitude, user.latitude]
                    }
                }
                const info = await this.collection.updateOne({ id: user.id }, {
                        $set: geoUser
                    }, {
                        upsert: true
                    }

                );
                console.log('Insertion: ', info)
                return geoUser;
            } else {
                throw "Invalid Longitude or Latitude"
            }
        } catch (err) {
            console.error("Insertion Error: ", err);
        }
    }

    async InsertMessage(user, message, time) {
        try {
            const res = await this.messages.InsertOne({
                id: user.id,
                longitude: user.longitude,
                latitude: user.latitude,
                msg: message,
                timestamp: time
            })
            console.log(`Inserted Message "${message}": `, res);
        } catch (err) {
            console.error("Message Insertion Error: ", err)
        }
    }

    async Remove(user) {
        try {
            await this.collection.deleteOne({ id: user.id })
            console.log("Deleted User: ", user.id);
        } catch (err) {
            console.error("Deletion Error: ", err)
        }
    }

    async FindNearest(user, range) {
        try {
            const geoUser = await this.Find(user);
            const nearest = await this.collection.find({
                loc: {
                    $near: {
                        $geometry: geoUser.loc,
                        $maxDistance: range,
                        $minDistance: 0.1
                    }
                }
            }).toArray()
            const formattedNearest = nearest.map((u) => {
                return {
                    id: u.id,
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
            const foundUser = await this.collection.findOne({ id: user.id });
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