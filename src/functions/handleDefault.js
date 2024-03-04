const {EmbedBuilder} = require('discord.js')

module.exports = (client, interaction) => {
    client.handleDefault = async () => {
        await interaction.reply({
            content: "This command is currently under development or does not exist, please try again later!",
            ephemeral: true
        })
    }
}