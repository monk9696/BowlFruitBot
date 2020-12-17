const twitch = require("tmi.js");

const settings = require("./config.json");

const fs = require("./filewrite.js");

let write = new fs();

const client = new twitch.client(settings.conn);

const messages = {
	"parse": ["baer"],
	"fbb": [],
	"bfb": [],
	"ban": [],
	"cheer": [],
	"filter": []
}

let Blocker = false;

let parse = messages.parse;

const { MongoClient } = require("mongodb");



client.connect();

client.on('connected', connectedHandler);


client.on('chat', (channel, userstate, message, self) => {


	
	if (self) {
		return;
	}

	logMessage(userstate, message);


//	console.log("hi " + userstate.username);

//	console.log(`Message "${message}" received from ${userstate['display-name']}`);
/*
	if (message.toLowerCase().indexOf("fbb") !== -1){
		messages.fbb.push({"username": userstate.username, "message": message});
	}else if(message.toLowerCase().indexOf("fruitbowlbot") !== -1){
		messages.fbb.push({"username": userstate.username, "message": message});
	}else if(message.toLowerCase().indexOf("fruit bowl bot") !== -1){
		messages.fbb.push({"username": userstate.username, "message": message});
	}
*/


	
	let args = message.split(" ");
	let command = args.shift();
/*
	if (command.indexOf("bfb") !== 0){
		if(message.toLowerCase().indexOf("bfb") !== -1){
			messages.bfb.push({"username": userstate.username, "message": message});
		}else if(message.toLowerCase().indexOf("bowlfruitbot") !== -1){
			messages.bfb.push({"username": userstate.username, "message": message});
		}else if(message.toLowerCase().indexOf("bowl fruit bot") !== -1){
			messages.bfb.push({"username": userstate.username, "message": message});
		}
		return 0;
	}
*/
	command = command.slice(3);

	if (settings.identity && command === 'Hi'){
	// If an identity was provided, respond in channel with message.
		//client.say(channel, 'Hello');
	}else{
		//client.say(channel, `${userstate['display-name']}, Who are you how do you know that I am a bot`);	
	}
});
/*
client.on('join', (channel, username, self) => {
	console.log("Joined: " + channel + " " + username + " " + self);
});

client.on('part', (channel, username, self) => {
	console.log("Left: " + channel + " " + username + " " + self);
});
*/
client.on('subscription', (channel, username, method, message, userstate) =>{
	if(message !== null){
		console.log("Sub: " + channel + " " + username + " " + message);
	}else{
		console.log("Sub: " + channel + " " + username);
	}
});

client.on('resub', (channel, username, months, message, userstate, methods) =>{
	if(message !== null){
		console.log("ReSub: " + channel + " " + username + " " + message);
	}else{
		console.log("ReSub: " + channel + " " + username);
	}
});

client.on('subgift', (channel,username,recipient,method,userstate) =>{
	console.log("Gift Sub: " + channel + " " + username + " To " + recipient);	
});

client.on('hosted', (channel, username, viewers, autohost) =>{
	if(autohost){
		console.log("Hosted by: " + username + " with " + viewers + "This was an autohost");
	}else{
		console.log("Hosted by: " + username + " with " + viewers);
	}
});

client.on('ban', (channel, username, reason) =>{
	let x = username + ": Banned for " + reason;
	console.log(x);
	messages.ban.push(x);

});

client.on('cheer', (channel, userstate, message) =>{
	let x = userstate.username + ": " + message + " " + userstate.bits;
	console.log(x);
	messages.cheer.push(x);
});





function connectedHandler(addr, port) {
	console.log(`* Connected to ${addr}:${port}`);
	setInterval(save, 60000);
}


/*
function save(){
	write.output(messages, "message.json");
	//console.log(dataBase.listCollections());
}
*/
async function save(){
	Blocker = true;

	let mongoCli = MongoClient(settings.database, {useUnifiedTopology: true});
	console.log("Connecting to db");
	await mongoCli.connect();

	let db = await mongoCli.db("Twitch");
	console.log("connected and uploading");
	
	let name = settings.conn.channels[0];

	let collections = await db.listCollections({},{"nameOnly": true}).toArray();
	let collection;
	if(collections.some((c) => {console.log(c.name); return c.name == name})){
		collection = db.collection(name)
	} else {
		collection = await db.createCollection(name);
	}
	if(messages.filter.length != 0)
		await collection.insertMany(messages.filter);

	messages.filter = [];

	console.log("uploaded");
	Blocker = false;
	mongoCli.close();
}


async function logMessage(userstate, message){
	while(Blocker){

	}
	Blocker = true;
	if(parse.some((x) => {return message.toLowerCase().indexOf(x) !== -1})){
		messages.filter.push({"username": userstate.username, "message": message});
		return;
	}
	Blocker = false;
}