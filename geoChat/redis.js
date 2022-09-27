const Redis = require('ioredis');

//const client = new Redis()

class rd {
    constructor() {
        this.client = new Redis();
    }

    async InsertUser(userID, longitude, latitude) {
        await this.client.geoadd("users", longitude, latitude, userID);
    }

    async RemoveUser(userID) {
        await this.client.zrem("users", userID);

    }

    async GetNearestUsers(userID, dist) {
        const users = await this.client.geosearch("users", "FROMMEMBER", userID, "BYRADIUS", dist, "m");
        return users;
    }
}




async function main() {

    const redis = new rd();
    await redis.InsertUser("malzel", 50, 50);
    await redis.InsertUser("temer", 50, 50);
    await redis.InsertUser("lastat", 51, 51);
    try {
        const ret = await redis.GetNearestUsers("hzel", 10)
        console.log(ret);
    } catch (err) {
        console.error("GetNearest Error: ", err);
    }

}

//(async() => { await main() })();
module.exports.rd = new rd();