const {SlashCommandBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits} = require("discord.js");
const schema = require("../../Schemas.js/autoban");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("autoban")
    .setDescription("Autbans member in your server")
    .addSubcommand(s => s
        .setName("setup")
        .setDescription("setup the autoban system in your server")
    )
    .addSubcommand(s => s
        .setName("delete")
        .setDescription("delete the autoban system in your server")
    ),

    async execute (interaction, client) {
        const {guild, options, member} = interaction;
        
        const sub = options.getSubcommand();

        const data = await schema.findOne({ Guild: guild.id })

        if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
            return client.handlePermission("Administrator")
        } else {
            switch (sub) {
                case "setup":
                    if (data) {
                        const embed = new EmbedBuilder({
                            title: "Data found",
                            description: "I already found data for this server in my database!"
                        }).setColor("Red")

                        return await interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    } else {
                        const embed = new EmbedBuilder({
                            title: "Are you sure?",
                            description: "If you enable this option, logged ban members from other servers will be banned here automatically too. This means, if someone bans for example a user you like in this server on his server, he will get banned here too. Be careful with this option!",
                        })

                        const buttonAgree = new ButtonBuilder({
                            custom_id: "agree-autoban",
                            label: "I agree",
                            style: ButtonStyle.Success
                        })

                        const buttonDisagree = new ButtonBuilder({
                            custom_id: "disagree-autoban",
                            label: "I disagree",
                            style: ButtonStyle.Danger
                        })

                        const row = new ActionRowBuilder().addComponents(buttonAgree, buttonDisagree)

                        const msg = await interaction.reply({ embeds: [embed], components: [row]});

                        const collector = await msg.createMessageComponentCollector();

                        collector.on('collect', async (i) => {
                            if (i.user.id !== interaction.user.id) {
                                return client.buttonUsage(i)
                            } else {
                                if (i.customId === "agree-autoban") {
                                    await schema.create({ Guild: i.guild.id });

                                    return await interaction.editReply({
                                        content: "Setup successfull!",
                                        ephemeral: true,
                                        components: [],
                                        embeds: []
                                    })
                                } else {
                                    return await interaction.editReply({
                                        content: "Setup cancelled!",
                                        ephemeral: true,
                                        components: [],
                                        embeds: []
                                    })
                                }
                            }
                        })
                    }
                break;

                case "delete":
                    if (!data) {
                        const embed = new EmbedBuilder({
                            title: "No data found",
                            description: "I cant find any autoban data in my database, please try again later!"
                        }).setColor("Red")

                        return await interaction.reply({ embeds: [embed], ephemeral: true})
                    } else {
                        await schema.deleteMany({ Guild: i.guild.id });

                        const embed = new EmbedBuilder({
                            title: "Data deleted",
                            description: "Your autoban system has been deleted successfull!",
                        }).setColor("Green")

                        return await interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                break;

                default:
                    await client.handleDefault()
                break;
            }
        }
    }
}