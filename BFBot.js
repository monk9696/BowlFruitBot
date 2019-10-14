const twitch = require("twitch-js");
const options = require("./option.json");



const client = new twitch.client(options);


client.connect();



client.on('chat', (channel, userstate, message, self) => {
	console.log(`Message "${message}" received from ${userstate['display-name']}`);
    // Do not repond if the message is from the connected identity.
	//console.log(userstate);

	if (self) return;
	
	

	if (options.identity && message === '!command') {
	// If an identity was provided, respond in channel with message.
		client.say(channel, 'Command');
	}else{
		client.say(channel, "Not Command");	
	}
});


//client.on('message', messageHandler);

client.on('connected', connectedHandler);

function connectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);

  //client.join(options.channels[0]);
}