const { MessageEmbed, MessageAttachment } = require('discord.js');
const genshin = require('genshin-db');
const emobjects = require('./ObjectCollection');


// module.exports =
module.exports = class botEmbed extends MessageEmbed {
    
    addGenshinDetails(character) {
        const charDetails = genshin.character(character);

        this.color = emobjects.element[charDetails.element].color
        this.title = charDetails.name
        this.thumbnail = {url: charDetails.images.icon}
        this.description = [
            `${emobjects.element[charDetails.element].emoji} | ${emobjects.rarity[charDetails.rarity-1]}`,
            charDetails.description
        ].join('\n')

        return this
    }

    domainRotation(dow){
        this.color = '#FFAA00'
        if (dow === 0){
            // const attachment = new MessageAttachment('../../img/sunday.png','img.png');
            this.title = "Today's Rotation | Sunday"
            this.fields =[
                {
                    name: 'Everything', 
                    value: 'Every talent and ascension material opened today\nYou can farm any domain that you need',
                    inline: false
                }
            ]
            return this
        }
        this.title = `Today's Rotation | ${emobjects.rotationData[dow].day}`
        this.fields =[
            {
                name: 'Talent Materials', 
                value: emobjects.rotationData[dow].talent,
                inline: true
            },
            {
                name: 'Ascension Materials', 
                value: emobjects.rotationData[dow].mats,
                inline: true
            }
        ]
        return this
    }

    genshinList(listarr, type){
        this.title = `${type}s List`
        this.description = `Below are list of ${type.toLowerCase()}s that currently available`
        this.fields = [
            {
                name: '\u200b',
                value: `\`\`\`fix\n${listarr.join('\n')}\`\`\``,
                inline: false
            }
        ]

        return this
    }

    splitFields(contentOrTitle, rawContent) {
		if (typeof contentOrTitle === 'undefined') return this;

		let title;
		let content;
		if (typeof rawContent === 'undefined') {
			title = ZWS;
			content = contentOrTitle;
		} else {
			title = contentOrTitle;
			content = rawContent;
		}

		if (Array.isArray(content)) content = content.join('\n');
		if (title === ZWS && !this.description && content.length < 2048) {
			this.description = content;
			return this;
		}

		// eslint-disable-next-line id-length
		let x;
		let slice;
		while (content.length) {
			if (content.length < 1024) {
				this.fields.push({ name: title, value: content, inline: false });
				return this;
			}

			slice = content.slice(0, 1024);
			x = slice.lastIndexOf('\n');
			if (x === -1) slice.lastIndexOf('');
			if (x === -1) x = 1024;

			this.fields.push({ name: title, value: content.trim().slice(0, x), inline: false });
			content = content.slice(x + 1);
			title = ZWS;
		}
		return this;
	}
}