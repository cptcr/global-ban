const {EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const schema = require("../../Schemas.js/channels_guild");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Channel log setup")
    .addSubcommand(c => c
        .setName("create")
        .setDescription("create a log setup")
        .addChannelOption(o => o
            .setName("log-channel")
            .setDescription("The channel for the logged bans")
            .addChannelTypes(
                ChannelType.GuildAnnouncement, 
                ChannelType.GuildText
            )
            .setRequired(true)
        )
    )
    .addSubcommand(c => c
        .setName("delete")
        .setDescription("deletes the log")
    ),

    async execute (interaction) {
        const {options, guild} = interaction;

        const sub = options.getSubcommand();

        const data = await schema.findOne({ Guild: guild.id });

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return client.handlePermission("Administrator")
        } else {
            switch (sub) {
                case "create":
                    const channel = options.getChannel("log-channel");

                    if (data) {
                        const embedHasData = new EmbedBuilder({
                            title: "Data found",
                            description: `Looks like you already have a log channel in <#${data.Channel}>, would you like to overwrite it?`
                        }).setColor("Red")

                        const buttonHasData = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                            .setCustomId("setup-accept")
                            .setLabel("Yes")
                            .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                            .setCustomId("setup-reject")
                            .setLabel("No")
                            .setStyle(ButtonStyle.Danger)
                        )

                        const message = await interaction.reply({ components: [buttonHasData], ephemeral: false });

                        const collector = await message.createMessageComponentCollector();

                        collector.on('collect', async (i) => {
                            if (i.user.id !== interaction.user.id) {
                                client.handlePermission()
                            } else {
                                if (i.customId === "setup-accept") {
                                    data.Channel = channel.id;
                                    await data.save();

                                    const embed = new EmbedBuilder({
                                        title: "Data saved",
                                        description: `Your new channel has been set to ${channel}`
                                    }).setColor("Green")

                                    await interaction.editReply({
                                        embeds: [embed],
                                        ephemeral: false,
                                        components: []
                                    })
                                } else {
                                    const embed = new EmbedBuilder({
                                        description: `Okay, i will leave the data as it is!`
                                    }).setColor("Red")

                                    await interaction.editReply({
                                        embeds: [embed],
                                        ephemeral: false,
                                        components: []
                                    })
                                }
                            }
                        })
                    } else {
                        await schema.create({
                            Guild: interaction.guild.id,
                            Channel: channel.id
                        })

                        const embed = new EmbedBuilder({
                            title: "Data created",
                            description: `Alright, the log channel has been setup to ${channel}! Thanks for using Global Ban :)`
                        }).setColor("Green")

                        return await interaction.reply({ embeds: [embed], ephemeral: true})
                    }
                break;
    
                case "delete":
                    if (!data) {
                        return await interaction.reply({
                            content: "Sorry, i could not find any data in this server with a log channel setup!",
                            ephemeral: true
                        })
                    } else {
                        await schema.deleteMany({ Guild: guild.id })

                        const embed = new EmbedBuilder({
                            title: "Data deleted",
                            description: "I have successfully deleted the log channel",
                        }).setColor("Red")
                    }
                break;
    
                default:
                    await client.handleDefault()
                break;
            }
        }
    }
}