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
            this.messages = this.db.collection('messages')
        } catch (err) {
            console.error("Error: ", err);
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
            await this.messages.deleteOne({ id: user.id })
            console.log("Deleted User: ", user.id);
        } catch (err) {
            console.error("Deletion Error: ", err)
        }
    }

    async RemoveAll() {
        try {
            await this.collection.deleteMany({})
        } catch (err) {
            console.error("RemoveAll Error:", err)
        }
    }

}

module.exports.db = new db(url)