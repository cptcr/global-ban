const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setName("ban")
    .setDescription("Bans a member")
    .addUserOption(o => o.setName("target").setDescription("the member you'd like to ban").setRequired(true))
    .addStringOption(o => o.setName("reason").setDescription("the reason for the ban").setRequired(true)),

    async execute (interaction) {
        const target = interaction.options.getMember('user'); 
        const reason = interaction.options.getString("reason");
        const member = interaction.member; 
        const botMember = await interaction.guild.members.fetchMe(); 

        if (target.roles.highest.comparePositionTo(member.roles.highest) >= 0) {
          return interaction.reply({ content: 'You cannot ban this user due to role hierarchy.', ephemeral: true });
        }

        if (!botMember.permissions.has(PermissionFlagsBits.BanMembers)) {
          return interaction.reply({ content: 'I do not have the permission to ban members.', ephemeral: true });
        }

        try {
          await target.ban({ reason: reason });
          await interaction.reply({ content: `Successfully banned ${target.user.tag}.`, ephemeral: true });
        } catch (error) {
          console.error(error);
          await interaction.reply({ content: 'There was an error trying to ban this user.', ephemeral: true });
        }
    }
}