const { Client, GatewayIntentBits } = require('discord.js');
const os = require('os');

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once('ready', () => {
  console.log(`✅ Bot online: ${client.user.tag}`);

  setInterval(() => {
    const totalMem = os.totalmem() / (1024 * 1024);
    const freeMem = os.freemem() / (1024 * 1024);
    const usedMem = totalMem - freeMem;
    const load = os.loadavg()[0];

    const msg = `📊 **VPS Monitor**
- CPU Load (1min): ${load.toFixed(2)}
- RAM Used: ${usedMem.toFixed(1)} MB / ${totalMem.toFixed(1)} MB`;

    const channel = client.channels.cache.get(CHANNEL_ID);
    if (channel) channel.send(msg);
  }, 60000); // mỗi 60 giây
});

client.login(TOKEN);
