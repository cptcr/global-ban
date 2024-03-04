const { EmbedBuilder, Events } = require('discord.js');
const Ban = require('../../Schemas.js/ban');
const channellist = require("../../Schemas.js/channels_guild");

module.exports = async (client) => {
    client.on(Events.GuildBanRemove, async (ban) => {
        const data = await Ban.findOne({UserID: ban.user.id});

        const embed = new EmbedBuilder()
        .setTitle("Member Ban Removed!")
        .addFields(
            {name: "Server:", value: `${ban.guild.name}`, inline: true},
            {name: "Server ID:", value: `${ban.guild.id}`, inline: true},
            {name: "Unbanned Member Info:", value: `Username: ${ban.user.username} \nUser ID: ${ban.user.id}`, inline: true}
        ).setFooter({ text: "If you'd like to manage bans, use the relevant commands"});

        if (data) {
            data.BanCount = Math.max(0, data.BanCount - 1);
            await data.save();
            embed.addFields({name: "Updated Ban count in database:", value: `**${data.BanCount || "0"} BAN(s)**`});
        } 

        const channelData = await channellist.find();

        for (const d of channelData) {
            const guild = await client.guilds.fetch(d.Guild); // Ensure guild is fetched
            if (!guild) continue; // Skip if guild is not found

            // Fetch the channels of the guild if necessary
            await guild.channels.fetch();

            const channel = guild.channels.cache.get(d.Channel); // Now access the cache
            if (!channel) continue; // Skip if channel is not found

            channel.send({embeds: [embed]});
        }
    });
};
