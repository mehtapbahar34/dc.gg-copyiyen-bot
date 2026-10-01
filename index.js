const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http');

http.createServer((req, res) => {
    res.write("Bot 7/24 Aktif!");
    res.end();
}).listen(process.env.PORT || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const KANAL_ID = process.env.KANAL_ID;
const SUNUCU_ID = process.env.SUNUCU_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;

function seseBaglan() {
    try {
        joinVoiceChannel({
            channelId: KANAL_ID,
            guildId: SUNUCU_ID,
            adapterCreator: client.guilds.cache.get(SUNUCU_ID).voiceAdapterCreator,
            selfDeaf: true,
            selfMute: false
        });
        console.log('Ses kanalına başarıyla bağlandı.');
    } catch (error) {
        console.error('Bağlantı hatası:', error);
    }
}

client.once('ready', () => {
    console.log(`${client.user.tag} hazır ve sese bağlanıyor!`);
    seseBaglan();
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.member.id === client.user.id && !newState.channelId) {
        console.log('Bot sesten düştü! 5 saniye içinde tekrar bağlanılıyor...');
        setTimeout(() => seseBaglan(), 5000);
    }
});

client.login(BOT_TOKEN);