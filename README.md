# Roblox Kick/Ban via HTTP Requests

This code allows for kicking or banning a player in Roblox via HTTP requests. However, it requires the user to have their own domain to use as the endpoint for the requests.

## How to Use

1. Clone the repository.
2. Run `npm install` to install the required dependencies.
3. Create a `.env` file and fill it out following the format in the example.
4. Place the `handler.lua` code within a script in `ServerScriptService` in your roblox game.
5. Make sure HTTP requests are enabled in your game!
6. Run `node server.js` to run the server
7. Once the server is running, you can now make HTTP POST and GET requests to your server.

