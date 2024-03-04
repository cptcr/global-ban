const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Schema = require("../../Schemas.js/ban");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user-check")
        .setDescription("Checks if a user has been found in our ban log database")
        .addUserOption(option => 
            option.setName("target")
                .setDescription("The user you want to check")
                .setRequired(true)),

    async execute(interaction) {
        // Fetch the user option correctly as a User object
        const user = interaction.options.getUser("target");

        const data = await Schema.findOne({ UserID: user.id });

        // Check if the command user is the same as the target user
        if (interaction.user.id === user.id) {
            return await interaction.reply({
                content: "Please use /self-check to check if you're in our database!",
                ephemeral: true
            });
        }

        if (data && data.BanCount > 0) { // Check if data exists and BanCount is greater than 0
            const embed = new EmbedBuilder()
                .setTitle("DATA FOUND")
                .setDescription(`${user.username} has been found as banned in **${data.BanCount} Servers**!`)
                .setColor("Red");

            return await interaction.reply({ embeds: [embed] });
        } else {
            // For users not found in the database or have 0 bans
            return await interaction.reply({
                content: `${user.username} hasn't been found in our database or has no bans!`,
                ephemeral: true
            });
        }
    }
};
