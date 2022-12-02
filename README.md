# Proximity
 
A lightweight anonymous messaging app to chat to anyone within your local proximity.
geoChat is the node server, client is the react app.

## Running

For server, make sure to have your redis server running first.
```
sudo service redis-server start
```
Then on /geoChat, run
```
node index.js
```

For the client, on /client, run
```
npm start
```
