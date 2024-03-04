const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setName("unban")
        .setDescription("Unbans a member")
        .addStringOption(option => 
            option.setName("userid")
                .setDescription("The ID of the member you'd like to unban")
                .setRequired(true))
        .addStringOption(option => 
            option.setName("reason")
                .setDescription("The reason for the unban")
                .setRequired(false)), // Making reason optional

    async execute(interaction) {
        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString("reason") || 'No reason provided'; // Providing a default reason if none given
        const botMember = await interaction.guild.members.fetch(interaction.client.user.id);

        // Check if the bot has permissions to unban members
        if (!botMember.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: 'I do not have the permission to unban members.', ephemeral: true });
        }

        try {
            // Fetch the ban to see if the user is actually banned
            const ban = await interaction.guild.bans.fetch(userId).catch(() => null); // Catching error if user not banned
            if (!ban) {
                return interaction.reply({ content: 'This user is not banned.', ephemeral: true });
            }

            // Unban the user
            await interaction.guild.bans.remove(userId, reason);
            await interaction.reply({ content: `Successfully unbanned the user with ID ${userId}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error trying to unban this user.', ephemeral: true });
        }
    }
};
