const Redis = require('ioredis');

const client = new Redis()


async function InsertUser(userID, longitude, latitude) {
    console.log(userID)
    await client.geoadd("users", longitude, latitude, userID);
}
async function GetNearestUsers(userID, dist) {
    console.log(userID)
    return await client.geosearch("users", "FROMMEMBER", userID, "BYRADIUS", dist, "m");

}

async function main() {
    await InsertUser("malzel", 50, 50);
    await InsertUser("temer", 50, 50);
    await InsertUser("lastat", 51, 51);
    console.log("Starting");
    const ret = await GetNearestUsers("malzel", 10)
    console.log(ret);

}

(async() => { await main() })();