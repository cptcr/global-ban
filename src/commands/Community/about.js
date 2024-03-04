const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("a bit about me stuff :)"),

    async execute (interaction, client) {
        const owner = await client.users.cache.get(process.env.OWNER_DISCORD)

        const website = process.env.WEBSITE_OWNER;

        const embed = new EmbedBuilder({
            title: `${client.user.username}`,
            fields: [
                {name: "Bot Info:", value: `Tag: <@${client.user.id}> \nID: ${client.user.id} \nUsername: ${client.user.username}`, inline: true},
                {name: "Owner Info:", value: `Tag: ${owner} \nID: ${owner.id} \nUsername: ${owner.username} \nWebsite: ${website || "https://discord.com/developers"}`, inline: true},
                {name: "Discord Support:", value: `${process.env.DISCORD}`, inline: false}
            ]
        })

        return await interaction.reply({ embeds: [embed] });
    }
}