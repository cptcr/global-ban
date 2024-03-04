const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const Schema = require("../../Schemas.js/ban");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("self-check")
    .setDescription("Checks if youre found in our ban log database"),

    async execute (interaction, client) {
        const {user} = interaction;

        const data = await Schema.findOne({ UserID: user.id });

        if (data) {
            const embed = new EmbedBuilder()
            .setTitle("DATA FOUND")
            .setDescription(`You have been found as banned in **${data.BanCount} Servers**!`)
            .setColor("Red")

            return await interaction.reply({
                embeds: [embed]
            })
        } else if (!data || data.BanCount <= 1) {
            return await interaction.reply({
                content: "You havent been found in our database or your ban count equals 0! Good Job!",
                ephemeral: true
            })
        }
    }
}