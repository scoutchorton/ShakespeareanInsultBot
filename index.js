const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const INSULTS = require('./insults.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

/*
 * With much <3 to Discord.js
 * Thank you for all you do to make such a great API
 * https://discord.js.org/
 */

/**
 * Misc JS setup stuff
 */

//Kill bot early if there is no token
if(process.env.YEOLDEINSULTER_TOKEN === undefined) {
	process.stderr.write('Please provide the bot token through the environment variable YEOLDEINSULTER_TOKEN.\n');
	process.exit(1);
}

//Generator to give all the insults
function* insult_gen() {
	while(true) {
		let generated_insults = [];

		//Pick insults
		for(const list of INSULTS)
			generated_insults.push(list.at(Math.random() * list.length)); // Array.at() will accept decimals, so I don't have to Math.floor() the index

		yield generated_insults;
	}
}

/**
 * Slash command setup
 */

/*
const rest = new REST({ version: '9' }).setToken('token');
async function registerSlashCommands(commands) {
	await rest.put(Routes.applicationGuildCommand)
}
*/

/**
 * Bot communication
 */

/** @todo use slash commands someday */
/*
//Handle people begging for some hot takes from the past
client.on('interactionCreate', async interaction => {
	console.dir(interaction);

	//Refuse to bow to those who do not travel the road of the slash command
	if(!interaction.isCommand()) return;

	//Bring the heat
	if(interaction.commandName === 'insult') {
		await interaction.reply('Hot takes incoming...');
	}
});
*/
//Use those old text commands from a more civilized time
const gen = insult_gen();
client.on('messageCreate', message => {
	args = message.content.split(' ');

	//Make war
	if(/^!insult/.test(args[0])) {
		let target = args[1];
		const insult = gen.next().value;

		//Be secretive by not pinging and draw by username/nickname
		/*
		if(!(/^<@![0-9]{18}>$/.test(target))) {
			const newTarget = message.channel.members.find(user => {
				return user.user.username === target || user.nickname === target;
			});
			target = newTarget ? `<@!@${newTarget.user.id}>` : undefined;
			console.log('New selected target', newTarget, target);
		}
		*/

		//Are we actually targeting a user tho? Pick a random target if not
		if(target === undefined)
			target = `<@!${message.channel.members.randomKey()}>`;

		//Make mean stinky comments, and ping whoever you're targeting!
		message.channel.send(`Hey ${target}, aren't you a ${insult.join(', ')}!`);
		console.dir(message);

		//Attempt to hide evidence
		message.delete().then(() => {}).catch(() => {});
	}
});

/**
 * Session start
 */

//Show the console that you're alive and well
client.on('ready', () => {
	console.log('Ye Olde Insulter started.');
});

const commands = [{
	name: 'insult',
	description: 'Hurls an insult toward a fellow user'
}];

//Enter the matrix
client.login(process.env.YEOLDEINSULTER_TOKEN);