const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const Schema = require("../../Schemas.js/ban");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("user-check")
    .setDescription("Checks if a user has been found in our ban log database")
    .addUserOption(o => o.setName("target").setDescription("The user you want to check").setRequired(true)),

    async execute (interaction, client) {
        const user = interaction.options.getString("target");

        const data = await Schema.findOne({ UserID: user.id });

        if (interaction.user === user) {
            return await interaction.reply({
                content: "Please use /self-check to check if youre in our database!",
                ephemeral: true
            })
        }

        if (data) {
            const embed = new EmbedBuilder()
            .setTitle("DATA FOUND")
            .setDescription(`${user.username} has been found as banned in **${data.BanCount} Servers**!`)
            .setColor("Red")

            return await interaction.reply({
                embeds: [embed]
            })
        } else if (!data || data.BanCount <= 1) {
            return await interaction.reply({
                content: `${user.username} havent been found in our database or has no bans!`,
                ephemeral: true
            })
        }
    }
}