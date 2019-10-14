const twitch = require("twitch-js");
const options = require("./option.json");

var option = {
	options: {
		// Debugging information will be outputted to the console.
		debug: true
	},
	connection: {
		reconnect: true,
		secure: true
	},
	// If you want to connect as a certain user, provide an identity here:
	identity: {
       	username: 'bowlfruitbot',
		password: 'oauth:mnsx46b3s0e4htdc7njh9zfgzcdvcj',
	},
	channels: ["monk9696"]//,'jefmajor']
};


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