const Redis = require('ioredis');


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

module.exports.rd = new rd();