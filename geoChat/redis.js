const redis = require('redis');
const client = redis.createClient({
    socket: {
        host: '127.0.0.1',
        port: "6379"
    }
});

client.on('error', err => {
    console.log('Error ' + err)
});

async function main() {
    const err = await client.connect();
    const value = await client.get('loo');
    console.log(value);
    return;
}

main().catch(console.log)