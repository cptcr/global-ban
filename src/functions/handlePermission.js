/**
 * Handles permission checking for commands. Replies to the interaction
 * with a message if the user lacks the specified permission.
 * 
 * @async
 * @function handlePermission
 * @param {string} permission - The permission to check.
 * @returns {Promise<void>} A promise that resolves when the reply is sent.
*/

module.exports = async (client, interaction) => {
    client.handlePermission = async (permission) => {
        const perm = `${permission}`;
        return await interaction.reply({
            content: `Sorry, you need the **${perm.toUpperCase()}** permission to execute this command!`,
            ephemeral: true
        })
    }
}