const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setName("ban")
        .setDescription("Bans a member")
        .addUserOption(option => 
            option.setName("target")
                .setDescription("The member you'd like to ban")
                .setRequired(true))
        .addStringOption(option => 
            option.setName("reason")
                .setDescription("The reason for the ban")
                .setRequired(false)), // Making reason optional

    async execute(interaction) {
        // Fetch the user object instead of member object
        const user = interaction.options.getUser('target');
        const reason = interaction.options.getString("reason") || 'No reason provided'; // Providing a default reason
        const member = interaction.member; 
        const botMember = await interaction.guild.members.fetch(interaction.client.user.id); // Correct way to fetch the bot member

        // Ensure the bot has permission to ban members
        if (!botMember.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: 'I do not have the permission to ban members.', ephemeral: true });
        }

        // Check if the target user is the guild owner, skip the hierarchy check
        if (interaction.guild.ownerId !== user.id) {
          // Perform role hierarchy check only if the target is a member of the guild
          const targetMember = await interaction.guild.members.fetch(user.id).catch(() => null); // Attempt to fetch the member
          if (targetMember && (targetMember.roles.highest.position >= member.roles.highest.position || member.roles.highest.position >= botMember.roles.highest.position)) {
              return interaction.reply({ content: 'You cannot ban this user due to role hierarchy.', ephemeral: true });
          }
        }

        try {
            // Ban the user using their ID
            await interaction.guild.bans.create(user.id, { reason: reason });
            await interaction.reply({ content: `Successfully banned ${user.tag}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error trying to ban this user.', ephemeral: true });
        }
    }
};
