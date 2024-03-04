const EmbedBuilder = require("discord.js").EmbedBuilder;

module.exports = async (client) => {
    client.on('messageCreate', message => {
        const embed = new EmbedBuilder({
            title: "Hello, i am Global Ban!",
            description: "Let me tell you something about myself. So, I am a Discord Bot which has been made to manage bans easier and ban members between servers!",
            fields: [
                {name: "Invite:", value: "[Click here!](https://discord.com/oauth2/authorize?client_id=1212101526416261130&permissions=8&scope=applications.commands+bot)"}
            ]
        }).setColor("Orange")

        if (!message.author.bot && message.mentions.users.has(client.user.id)) {
            message.reply({ embeds: [embed] })
        }
    });
}