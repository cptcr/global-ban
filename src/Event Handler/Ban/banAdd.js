const { EmbedBuilder, Events } = require('discord.js');
const Ban = require('../../Schemas.js/ban');
const channellist = require("../../Schemas.js/channels_guild");
const autoban = require("../../Schemas.js/autoban");

module.exports = async (client) => {
    client.on(Events.GuildBanAdd, async (ban) => {
        const isAutobanGuild = await autoban.findOne({ Guild: ban.guild.id });

        const fetchedBan = await ban.guild.bans.fetch(ban.user.id);
        let data = await Ban.findOne({ UserID: ban.user.id });

        if (!data) {
            data = await Ban.create({
                UserID: ban.user.id,
                BanCount: 1,
            });
        } else {
            data.BanCount += 1;
            await data.save();
        }

        const embed = new EmbedBuilder()
        .setTitle("Member has been banned!")
        .addFields(
            { name: "Server:", value: `${ban.guild.name}`, inline: true },
            { name: "Server ID:", value: `${ban.guild.id}`, inline: true },
            { name: "Ban Reason:", value: `${fetchedBan.reason}`, inline: true },
            { name: "Target Info:", value: `Username: ${ban.user.username}\nUser ID: ${ban.user.id}`, inline: true },
            { name: "Ban count in database:", value: `**${data.BanCount} BAN(s)**`, inline: false }
        ).setFooter({ text: "if you'd like to ban this member, run the /ban command" });

        const channelData = await channellist.find();
        for (const d of channelData) {
            try {
                const guild = await client.guilds.fetch(d.Guild);
                const channel = await guild.channels.fetch(d.Channel);
                await channel.send({ embeds: [embed] });
            } catch (error) {
                continue;
            }
        }

        if (isAutobanGuild) {
            const autobanGuilds = await autoban.find({});
            for (const autobanGuild of autobanGuilds) {
                if (autobanGuild.Guild !== ban.guild.id) { 
                    try {
                        const otherGuild = await client.guilds.fetch(autobanGuild.Guild);
                        await otherGuild.bans.create(ban.user.id, { reason: `${fetchedBan.reason} - Automated Ban` });
                    } catch (error) {
                        continue;
                    }
                }
            }
        }
    });
};
