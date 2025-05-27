require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const si = require('systeminformation');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const CHANNEL_ID = process.env.CHANNEL_ID;

client.once('ready', () => {
  console.log(`✅ Bot online: ${client.user.tag}`);

  const channel = client.channels.cache.get(CHANNEL_ID);
  if (channel) {
    channel.send("✅ Bot đã kết nối và sẵn sàng giám sát VPS!");
  } else {
    console.error("❌ Không tìm thấy channel. Kiểm tra lại CHANNEL_ID.");
  }
  
  setInterval(async () => {
    try {
      const cpuLoad = (await si.currentLoad()).currentLoad;
      const mem = await si.mem();
      const disk = await si.fsSize();

      const ramUsage = (mem.used / mem.total) * 100;
      const diskUsage = disk[0].use; // % disk usage

      const warnings = [];

      if (cpuLoad > 80) warnings.push(`🔥 CPU cao: ${cpuLoad.toFixed(2)}%`);
      if (ramUsage > 90) warnings.push(`💾 RAM cao: ${ramUsage.toFixed(2)}%`);
      if (diskUsage > 90) warnings.push(`🗄️ Ổ đĩa đầy: ${diskUsage.toFixed(2)}%`);

      if (warnings.length > 0 && channel) {
        const alert = `🚨 *Cảnh báo hệ thống VPS:*\n` + warnings.join('\n');
        channel.send(alert);
      }
    } catch (err) {
      console.error("Lỗi khi lấy thông tin hệ thống:", err);
    }
  }, 60 * 1000); // kiểm tra mỗi phút

});
client.login(process.env.DISCORD_TOKEN);
