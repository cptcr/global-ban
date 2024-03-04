const { Interaction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const agreeSchema = require("../Schemas.js/agree");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return
        
        try{

            const data = await agreeSchema.findOne({ UserID: interaction.user.id});

            if (!data) {
                const embed = new EmbedBuilder()
                .setTitle("STOP")
                .setDescription("Before using this bot, you agree that GLOBAL BAN is not responsible for any false ban!")
                .setColor("Red")

                const buttonAgree = new ButtonBuilder({
                    customId: "agree",
                    label: "Agree",
                    style: ButtonStyle.Success
                })

                const buttonDisagree = new ButtonBuilder({
                    customId: "disagree",
                    label: "Disagree",
                    style: ButtonStyle.Danger
                })

                const row = new ActionRowBuilder().addComponents(buttonAgree, buttonDisagree)

                let message = await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

                const collector = await message.createMessageComponentCollector();

                collector.on('collect', async (i) => {

                    if (i.user.id !== interaction.user.id) {
                        return await interaction.reply({
                            content: "You are not the executor of this command!",
                            ephemeral: true
                        })
                    } else {
                        if (i.customId === "agree") {
                            const embed = new EmbedBuilder({
                                title: "Success",
                                description: "You have agreed our requirements, youre ready to go!"
                            })
    
                            await agreeSchema.create({
                                UserID: i.user.id
                            })
    
                            await interaction.editReply({components: [], embeds: [embed] })
                            await i.reply({ content: "You have agreed our terms!", ephemeral: true})
                        } else if (i.customId === "disagree") {
                            const embed = new EmbedBuilder({
                                title: "Success",
                                description: "You have disagreed our requirements, maybe see you later!"
                            })
    
                            await interaction.editReply({components: [], embeds: [embed] })
                            await i.reply({ content: "You have disagreed our terms!", ephemeral: true})
                        } else {
                            await i.reply({
                                content: "Sorry, this is not a valid option!",
                                ephemeral: true
                            })
                        }
                    }
                })
            } else {
                await command.execute(interaction, client);
            }
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: 'There was an error while executing this command!', 
                ephemeral: true
            });
        } 

    },
    


};