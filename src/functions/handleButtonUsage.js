module.exports = async (client, interaction, i) => {
    client.buttonUsage = async (i) => {
        return await i.reply({
            content: "You are not allowed to use these buttons!"
        })
    }
}