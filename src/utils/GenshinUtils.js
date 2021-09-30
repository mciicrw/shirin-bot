const {MessageButton, MessageActionRow} = require('discord.js');
const botEmbed = require('./EmbedBuilder')

module.exports = class GenshinUtils {

    /**
     * send list embed
     * @param {any} message discord message event
     * @param {array} list genshin array list
     * @param {string} type list type string
     */
    async sendListEmbed(message, list, type){
        let listIndex = 0;
        if(list.length > 1) {
            const listEmbed = new botEmbed()
                .setColor(message.guild.me.displayHexColor)
                .genshinList(list[listIndex], type)

            // const buttons = listChunked.map((list,index) => {
            //     return new MessageButton({
            //         customId: `characterlist-${index}`,
            //         label: `Page ${index + 1}`,
            //         style: 'PRIMARY'
            //     })
            // })

            const bPrev = 
                new MessageButton({
                    customId: 'list-prev',
                    label: 'Prev',
                    style: 'SECONDARY'
                });
            const bNext = 
                new MessageButton({
                    customId: 'list-next',
                    label: 'Next',
                    style: 'SECONDARY'
                });
            
            if (listIndex === 0) bPrev.setDisabled(true)
            // buttons.forEach((button,index) => {
            //     button.disabled = index === listIndex;
            // });

            const row = new MessageActionRow().addComponents([bPrev,bNext]);

            const repl = await message.reply({embeds: [listEmbed], components: [row]})

            const collector = repl.createMessageComponentCollector({
                componentType: 'BUTTON',
                time: 5 * 60 * 1000
            });

            collector?.on('collect', async ind => {
                if (ind.customId === 'list-prev') {
                    listIndex -= 1;
                    const listEmbed = new botEmbed()
                        .setColor(message.guild.me.displayHexColor)
                        .genshinList(list[listIndex], type);
                        bNext.setDisabled(false)
                        if (listIndex === 0) bPrev.setDisabled(true)
                    const row = new MessageActionRow().addComponents([bPrev,bNext]);
                    await ind.update({embeds: [listEmbed], components: [row]})
                }
                if (ind.customId === 'list-next') {
                    listIndex += 1;
                    const listEmbed = new botEmbed()
                        .setColor(message.guild.me.displayHexColor)
                        .genshinList(list[listIndex], type);
                        bPrev.setDisabled(false)
                        if (listIndex === list.length - 1) bNext.setDisabled(true)
                    const row = new MessageActionRow().addComponents([bPrev,bNext]);
                    await ind.update({embeds: [listEmbed], components: [row]})
                }
            });

            collector?.on('end', async ind => {
                const listEmbed = new botEmbed()
                    .setColor(message.guild.me.displayHexColor)
                    .genshinList(list[listIndex], type);
                
                repl.edit({
                    embeds: [listEmbed], 
                    components: [
                        new MessageActionRow().addComponents(
                            new MessageButton({
                                customId: 'farmable-stop',
                                label: `type command again to refresh`,
                                style: 'SECONDARY',
                                disabled: true,
                            })
                        )
                    ]
                })
            })
        } else {
            const listEmbed = new botEmbed()
            .setColor(message.guild.me.displayHexColor)
            .genshinList( list, type);

        return message.reply({embeds: [listEmbed]});
        }
    }
}