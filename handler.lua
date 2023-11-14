local HttpService = game:GetService("HttpService")
local DataStoreService = game:GetService("DataStoreService")
local dataStore = DataStoreService:GetDataStore("bannedUsers")

local function fetchRemoteData(endpointURL)
	local headers = {
		["Authorization"] = "Your_Api_Key" -- change this to your own api key
	}
	local success, response = pcall(function()
		return HttpService:GetAsync(endpointURL, false, headers)
	end)
	if success then
		return HttpService:JSONDecode(response)
	end
	return nil
end

local function checkAndKickPlayer(player, userId, reason)
	local word = dataStore:GetAsync(userId) and "banned" or "kicked"
	if player then
		player:Kick("You have been " .. word .. " from the game: " .. reason)
	end
end

game.Players.PlayerAdded:Connect(function(player)
	local bannedData = dataStore:GetAsync(player.UserId)
	if bannedData then
		player:Kick("You have been banned from the game: " .. bannedData.reason)
	end
end)

while true do
	local dataTypes = {"kick", "ban", "unban"}

	for _, dataType in ipairs(dataTypes) do
		local data = fetchRemoteData("https://xandersite.xyz/data/" .. dataType) -- Change this to your own endpoint
		if data then
			if dataType == "kick" then
				checkAndKickPlayer(game:GetService("Players"):GetPlayerByUserId(data.userid), data.userid, data.reason)
			elseif dataType == "ban" then
				if not dataStore:GetAsync(data.userid) then
					local saveData = {
						reason = data.reason
					}
					local success, errorMessage = pcall(dataStore.SetAsync, dataStore, data.userid, saveData)
					if success then
						print("Player was banned.")
					end
				end
				checkAndKickPlayer(game:GetService("Players"):GetPlayerByUserId(data.userid), data.userid, data.reason)
			elseif dataType == "unban" then
				if dataStore:GetAsync(data.userid) then
					dataStore:RemoveAsync(data.userid)
				end
			end
		end
	end

	wait(7)
end
