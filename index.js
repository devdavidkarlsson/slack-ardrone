const Bot = require('slackbots');
const arDrone = require('ar-drone');
const client  = arDrone.createClient();

// configure bot
const settings = {
    token: 'xxx',
    name: 'ocp-parrot'
};


let bot = new Bot(settings);

bot.on('start', function() {
	console.log("bot started...")
});

const _getUserById = (id) => {
    return bot.users.filter(function (user) {
        return user.id == id;
    })[0];
}


const _report = (userId, command) => {
	const user = _getUserById(userId);
	if(user !== undefined){
		console.log( "An unauthorized action: " + command + " was attempted by: ", user.name);
		bot.postMessageToUser(user.name, "This incident will be reported...");
	}
}


const _isChatMessage =  (message) => {
    return message.type === 'message' && Boolean(message.text);
};

const _handleCmd= (message) => {

	if(!_isChatMessage(message)){
		return;
	}

	if(message.text.split(" ")[0] === "ocp")
	{
		const command = message.text.substr(message.text.indexOf(" ") + 1);
		console.log("command received: ", command)
		if(command.length > 0){
			_parrot(command, message.user);
		}

	}
	else{
		_report(message.user, "(non ocp prefixed) " + message.text);
	}

}

const _parrot = (cmd, user) =>{

	switch(cmd) {

	case "go": 	
    case "start":
        client.takeoff( ()=>{bot.postMessage(user, "takeoff completed...")});
        break;

    case "kill":
    case "land":
        client.stop();
        client.land();
        break;

    case "stop":
    case "halt":
    	 client.stop();
    break;

    case "r":
    case "right":
    case "höger":
    	client.right(0.5);
    break;

    case "l":
    case "left":
    case "vänster":  
    	client.left(0.5);
    break;

    case "rr":
    case "rright":
    case "rhöger":
    	client.clockwise(0.5);
    break;

    case "rl":
    case "rleft":
    case "rvänster":  
    	client.counterClockwise(0.5);
    break;

    case "forward":
    case "fw":
    case "framåt":
    	client.front(0.5);
    break;

    case "backwards":
    case "back":
    case "reverse":
    case "bakåt":
    	client.back(0.5);
    break; 

    default:
        _report(user, cmd);
	}



}

bot.on('message', _handleCmd);


