# Proximity
 
A lightweight anonymous messaging app to chat to anyone within your local proximity.
geoChat is the node server, client is the react app.

![demo](https://user-images.githubusercontent.com/47486931/205204061-76fcbe8b-dea4-4948-a7b7-eb375b4f7a9e.gif =250x250)

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
