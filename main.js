const fs = require('fs');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const token = ''; 

// Your bot token
// Create an application, attach a bot then get it's token
// https://discord.com/developers/applications

// https://discord.com/oauth2/authorize?client_id=<clientid>

const x = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const unfilteredList = fs.readFileSync('en_unfiltered.txt', 'utf-8').split('\n');
const filteredList = fs.readFileSync('en_filtered.txt', 'utf-8').split('\n');
const unfilteredRegexList = fs.readFileSync('en_regex.txt', 'utf-8').split('\n');

let isFilterEnabled = true; // default to enabled

x.on('ready', () => {
    console.log('Successfully Authenticated');
});

x.on('messageCreate', async (message) => {
    if (message.author.id === x.user.id) return;

    if (message.content.startsWith('!filter') && message.member.permissions.has('ADMINISTRATOR')) {
        isFilterEnabled = !isFilterEnabled;
        const status = isFilterEnabled ? 'enabled' : 'disabled';
        message.reply(`The filter has been ${status}.`);
        await message.delete();
        return;
    }

    if (!isFilterEnabled) return;

    let content = message.content;
    let unFiltered = false;

    unfilteredList.forEach((unfilteredWord, index) => {
        const regex = new RegExp(`\\b${unfilteredWord}\\b`, 'gi');
        if (regex.test(content)) {
            const filtered = filteredList[index];
            if (filtered !== undefined) {
                content = content.replace(regex, filtered);
                unFiltered = true;
            }
        }
    });

    unfilteredRegexList.forEach((regexString, index) => {
        const regex = new RegExp(regexString, 'gi');
        if (regex.test(content)) {
            const filtered = filteredList[unfilteredList.length + index];
            if (filtered !== undefined) {
                content = content.replace(regex, filtered);
                unFiltered = true;
            }
        }
    });

    if (unFiltered) {
            const channel = message.channel;
            const webhook = await channel.createWebhook({
                name: 'Censorship',
                reason: 'User Impersonation',
            });

            const botResponse = new EmbedBuilder()
                .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.displayAvatarURL(),
                })
                .setDescription(content)
                .setColor(message.member.displayHexColor);

            await webhook.send({
                username: message.author.username,
                avatarURL: message.author.displayAvatarURL(),
                embeds: [botResponse],
            });

            await message.delete().then(() => webhook.delete());
    }
});

x.login(token);