const Discord = require('discord.js'),
    client = new Discord.Client({
        fetchAllMembers: true,
        partials: ['MESSAGE', 'REACTION']
    }),
    config = require('./config.json'),
    fs = require('fs'),
    humanizeDuration = require('humanize-duration')
    const Menu = require('discord.js-menu')
    var os = require('os')
    const ms = require('ms')
    const db = require('quick.db')
    const figlet = require("figlet")
    const recon = require('reconlx');

    client.login(config.token)
    client.commands = new Discord.Collection()
    client.db = require('./db.json')
    client.aliases = new Discord.Collection();
    
    fs.readdir('./commands', (err, files) => {
        if (err) throw err
        files.forEach(file=> {
            if (!file.endsWith('.js')) return 
            const command = require(`./commands/${file}`)
            client.commands.set(command.name, command)
        })
    })

    client.on('message', message => {
        const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
        if (message.content.match(prefixMention)){
            message.delete();
        const embed = new Discord.MessageEmbed()
        .setDescription(`Va te faire foutre !`)
        .setColor("#2F3136")
        message.channel.send(embed)
    }

    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length)) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName.slice(config.prefix.length)));

    if (!command) return
    if (command.guildOnly && !message.guild) return message.channel.send('> **:message:・Cette commande ne peut être utilisée que dans un serveur.**')
    command.run(message, args, client)
})

    console.log("🔁・Inconnu vient de démarrer");

client.on('ready', () => {
    const statuses = [
        () => `By zalku `,
    ]
    let i = 0
    setInterval(() => {
        client.user.setActivity(statuses[i](), {type: 'STREAMING', url: 'https://twitch.tv/Huzill'})
        i = ++i % statuses.length
    }, 1e4)
})

client.on('guildMemberAdd', member => {
    client.channels.cache.get('916437388820107294').send(new Discord.MessageEmbed()
     .setTitle(`✈️ - Arrivée`)
    .setDescription(`${member} Fait son apparition parmis nous !`)
    .setFooter('Copyright 2021 ©zalku#1559')
    .setColor("GREEN"))
})

client.on('guildMemberRemove', member => {
    client.channels.cache.get('916437474232922174').send(new Discord.MessageEmbed()
     .setTitle(`✈️ - Départ`)
    .setDescription(`${member} Nous quittes !`)
    .setFooter('Copyright 2021 ©zalku#1559')
    .setColor("RED"))
})

client.on('channelCreate', channel => {
    if (!channel.guild) return
    const muteRole = channel.guild.roles.cache.find(role => role.name === '🔇 • Rendu Muet')
    if (!muteRole) return
    channel.createOverwrite(muteRole, {
        SEND_MESSAGES: false,
        CONNECT: false,
        ADD_REACTIONS: false
    })
})

client.on('messageDelete', (message) => {
    if (message.channel.id == '916433312338280478') return
    if (message.mentions.members.first() && !message.mentions.members.first().user.bot && message.mentions.members.first().user.id !== message.author.id)
    if(!message.content.startsWith("!")){
  
        let embed = new Discord.MessageEmbed()   
            .setTitle('\`❗\` | Ghost Ping Détecté !')
            .setColor("RED")
            .addField('**👤 | Auteur**', `${message.author}`)
            .addField('**💬 | Message**', `${message.content}`);
  
        message.channel.send(embed)
    }
});