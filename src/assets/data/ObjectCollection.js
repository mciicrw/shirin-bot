/**
 * List of emoji object and array
 */


const raritymoji = ['⭐','⭐⭐','⭐⭐⭐','⭐⭐⭐⭐','⭐⭐⭐⭐⭐']

const raritycode = ['1★', '2★', '3★', '4★', '4★'];

const element = {
    "Cryo": {
        emoji: "<:Element_Cryo:888263635854569482>",
        color: '#99FFFF'
    },
    "Anemo": {
        emoji: "<:Element_Anemo:888263636211097670>",
        color: '#80FFD7'
    },
    "Geo": {
        emoji: "<:Element_Geo:888263637330976768>",
        color: '#FFE699'
    },
    "Electro": {
        emoji: "<:Element_Electro:888263636764733500>",
        color: '#FFACFF'
    },
    "Pyro": {
        emoji: "<:Element_Pyro:888263633648353360>",
        color: '#FF9999'
    },
    "Hydro": {
        emoji: "<:Element_Hydro:888263634344624149>",
        color: '#80C0FF'
    },
    "Dendro": {
        emoji: "<:Element_Dendro:888263638199197726>",
        color: '#b2ea2a'
    }
}

const rotationData = [
    {
        day: "Sunday",
        image: "./src/assets/img/sunday.png",
        mats: "Everything",
        talent: "Every talent and ascension material opened today\nYou can farm any domain that you need",
        imgtlt: "",
        imgmats:"",
        imgname: ["sunday.png","sunday-mats.png","sunday-talent.png"]
    },
    {
        day: "Monday",
        image: "./src/assets/img/monday.png",
        mats: "**Mondstadt**: Decarabian\n**Liyue**: Guyun\n**Inazuma**: Distant Sea",
        talent: "**Mondstadt**: Freedom\n**Liyue**: Prosperity\n**Inazuma**: Transience",
        imgtlt: "",
        imgmats:"",
        imgname: ["monday.png","monday-mats.png","monday-talent.png"]
    },
    {
        day: "Tuesday",
        image: "./src/assets/img/tuesday.png",
        mats: "**Mondstadt**: Boreal\n**Liyue**: Elixir\n**Inazuma**: Narukami",
        talent: "**Mondstadt**: Resistance\n**Liyue**: Diligence\n**Inazuma**: Elegance",
        imgtlt: "",
        imgmats:"",
        imgname: ["tuesday.png","tuesday-mats.png","tuesday-talent.png"]
    },
    {
        day: "Wednesday",
        image: "./src/assets/img/wednesday.png",
        mats: "**Mondstadt**: Dandelion\n**Liyue**: Aerosiderite\n**Inazuma**: Mask",
        talent: "**Mondstadt**: Ballad\n**Liyue**: Gold\n**Inazuma**: Light",
        imgtlt: "",
        imgmats:"",
        imgname: ["wednesday.png","wednesday-mats.png","wednesday-talent.png"]
    },
    {
        day: "Thursday",
        image: "./src/assets/img/monday.png",
        mats: "**Mondstadt**: Decarabian\n**Liyue**: Guyun\n**Inazuma**: Distant Sea",
        talent: "**Mondstadt**: Freedom\n**Liyue**: Prosperity\n**Inazuma**: Transience",
        imgtlt: "",
        imgmats:"",
        imgname: ["monday.png","monday-mats.png","monday-talent.png"]
    },
    {
        day: "Friday",
        image: "./src/assets/img/tuesday.png",
        mats: "**Mondstadt**: Boreal\n**Liyue**: Elixir\n**Inazuma**: Narukami",
        talent: "**Mondstadt**: Resistance\n**Liyue**: Diligence\n**Inazuma**: Elegance",
        imgtlt: "",
        imgmats:"",
        imgname: ["tuesday.png","tuesday-mats.png","tuesday-talent.png"]
    },
    {
        day: "Saturday",
        image: "./src/assets/img/wednesday.png",
        mats: "**Mondstadt**: Dandelion\n**Liyue**: Aerosiderite\n**Inazuma**: Mask",
        talent: "**Mondstadt**: Ballad\n**Liyue**: Gold\n**Inazuma**: Light",
        imgtlt: "",
        imgmats:"",
        imgname: ["wednesday.png","wednesday-mats.png","wednesday-talent.png"]
    }
]

const arteDomain = [
    {
        name: "Midsummer Courtyard",
        list: ["Adventurer", "Resolution of Sojourner", "Thundering Fury", "Thundershooter"]
    },
    {
        name: "Valley of Rememberance",
        list: ["Traveling Doctor", "Tiny Miracle", "Viridescent Venerer", "Maiden Beloved"]
    },
    {
        name: "Domain of Guyun",
        list: ["Lucky Dog", "Brave Heart", "Archaic Petra", "Retracting Bolide"]
    },
    {
        name: "Hidden Palace of Zhou Formula",
        list: ["Martial Artist", "Defender's Will", "Lavawalker", "Crimson Witch of Flames"]
    },
    {
        name: "Clear Pool and Mountain Cavern",
        list: ["Gambler", "Scholar", "Noblesse Oblige", "Bloodstained Chivalry"]
    },
    {
        name: "Peak of Vindagnyr",
        list: ["Defender's Will", "Gambler", "Blizzard Strayer", "Heart of Depth"]
    },
    {
        name: "Ridge Watch",
        list: ["Brave Heart", "Martial Artist", "Tenacity of the Millelith", "Pale Flame"]
    },
    {
        name: "Momiji-Dyed Court",
        list: ["Resolution of Sojourner", "Tiny Miracle", "Emblem of Severed Fate", "Shimenawa's Reminiscence"]
    },
    {
        name: "Trounce Domain & World Boss",
        list: ["Berserker", "Instructor", "The Exile", "Gladiator's Finale", "Wanderer's Troupe"]
    },
    {
        name: "World Boss",
        list: ["Prayers for Destiny", "Prayers for Illumination", "Prayers for Wisdom", "Prayers to Springtime"]
    }
]


module.exports = { raritymoji, element, rotationData, arteDomain }