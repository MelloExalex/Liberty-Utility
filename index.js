const Discord = require("discord.js");
const { Client, Intents } = require('discord.js');
const bot = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGE_TYPING", "GUILD_MEMBERS", "GUILD_PRESENCES"] });
const prefix = "LS!"
const { Permissions } = require('discord.js');
const bdd = require("./bdd.json");
const fs = require("fs");
const Canvas = require("canvas")

bot.login(token.token);
bot.on("ready", () => {
    console.log(`${bot.user.tag} bot is online`);
});

bot.on('ready', async () =>{
    bot.user.setStatus("online")
    bot.user.setActivity("La Liberty Squad", {type: 'WATCHING'})
});

bot.on("message", message => {
    
    if(message.content.startsWith(prefix + "clear")){
        message.delete();
        if(message.member.permissions.has(Permissions.MANAGE_MESSAGES)){
            
            let args = message.content.trim().split(/ +/g);
    
            if(args[1]){
    
                if(!isNaN(args[1]) && args[1] >= 1 && args[1] <=99){

                message.channel.bulkDelete(args[1])
                message.channel.send({content:"message correctement supprimé", ephemeral:true});
                }
                else{
                    message.channel.send('Veuillez indiquer un nombre entre 1 et 99' )
                }    

            }
            else{
                message.channel.send('Veuillez indiquer un nombre de messages à supprimer')
            }
        }
        else{
            message.channel.send('Vous n avez pas les permissions requises pour exécuter cette commande')
        }    
    }
})



var nbTicket = 0;

bot.on("messageCreate", message => {
    if(message.content === prefix + "tls") {
        var row = new Discord.MessageActionRow()
                .addComponents(new Discord.MessageButton()
                    .setCustomId("open-ticket")
                    .setLabel("Ouvrir un ticket")
                    .setStyle("PRIMARY")
                    .setEmoji("📩")
                )
        let ticketembed = new Discord.MessageEmbed()
        .setColor('#0fba06')
        .setTitle('Candidature team')
        .setDescription('Pour faire une candidature pour faire partie de la Liberty Squad réagit 📩')
        .setFooter({iconURL:"https://images-ext-1.discordapp.net/external/Hl0NYxmKMwYuWAcFsVNVbKa5W340LV7VFiinr5FS1YQ/%3Fsize%3D256/https/cdn.discordapp.com/icons/831850433378517062/1e89cfe21d3e227ebd36459c816dfc2a.png", text:"Liberty Squad e-sport"})
    message.channel.send({components:[row], embeds:[ticketembed]});
    }
})

bot.on("interactionCreate", interaction => {
    if(interaction.isButton()){
        if(interaction.customId === "open-ticket"){
            nbTicket++;
            utilisateur = interaction.user.username
                bdd ["ticket"] = utilisateur
                Savebdd()
            
            interaction.guild.channels.create("ticket-" + nbTicket,{
                parent: "843114700467863582",
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [Discord.Permissions.FLAGS.VIEW_CHANNEL]
                    },
                    {
                        id: interaction.user.id,
                        allow: [Discord.Permissions.FLAGS.VIEW_CHANNEL]
                    }
                ]
            }).then(channel => {
                var row = new Discord.MessageActionRow()
                    .addComponents(new Discord.MessageButton()
                        .setCustomId("close-ticket")
                        .setLabel("Fermer le ticket")
                        .setStyle("DANGER")
                        .setEmoji("🔒")
                    )
                let createembe = new Discord.MessageEmbed()
                .setColor('#2cfc0d')
                .setDescription('Une fois que la disscussion est close, tu peux fermer ce ticket en cliquant sur 🔒 ci-dessous.')
                .setFooter({iconURL:"https://images-ext-1.discordapp.net/external/Hl0NYxmKMwYuWAcFsVNVbKa5W340LV7VFiinr5FS1YQ/%3Fsize%3D256/https/cdn.discordapp.com/icons/831850433378517062/1e89cfe21d3e227ebd36459c816dfc2a.png", text:"Liberty Squad e-sport"})
                channel.send({content:"<@" + interaction.user.id +"> veut rejoindre la Liberty Squad. Un membre du staff va s'occuper de ta demande en attendant rempli le formulaire présent dans le salon <#842339439790260224> ou obtient le en faisant la commande `-formulairels`.", embeds:[createembe], components:[row]});
                interaction.reply({content:"ticket correctement ouvert", ephemeral:true});
                
            })
        }
        else if(interaction.customId === "close-ticket"){
                var row = new Discord.MessageActionRow()
                        .addComponents(new Discord.MessageButton()
                            .setCustomId("close-ticket2")
                            .setLabel("close")
                            .setStyle("DANGER")
                        )
                        .addComponents(new Discord.MessageButton()
                            .setCustomId("cancel")
                            .setLabel("cancel")
                            .setStyle("PRIMARY")
                        );
            
            interaction.channel.send({content:"Êtes vous sûr de vouloir fermer le ticket ?", components:[row]});
                interaction.reply({content:"Veuillez confirmer le fermeture du ticket", ephemeral:true});
        }
        else if(interaction.customId === "close-ticket2"){

            interaction.channel.setParent("980501222010265640");
            interaction.reply({content:"ticket fermé", ephemeral:true});
            interaction.message.delete();


            var row = new Discord.MessageActionRow()
                    .addComponents(new Discord.MessageButton()
                        .setCustomId("Delete-ticket")
                        .setLabel("Delete")
                        .setStyle("DANGER")
                        .setEmoji("🗑")
                    )
                    .addComponents(new Discord.MessageButton()
                        .setCustomId("Archives-ticket")
                        .setLabel("Archiver")
                        .setStyle("SUCCESS")
                        .setEmoji("🗂")
                    )
                    .addComponents(new Discord.MessageButton()
                    .setCustomId("Reopen-ticket")
                    .setLabel("Reopen")
                    .setStyle("SUCCESS")
                    .setEmoji("🔓")
                    )
            interaction.channel.send({content:"Que souhaitez-vous faire maintenant ?", components:[row]});
        }
        else if(interaction.customId === "cancel"){
            interaction.message.delete();
        }
        else if(interaction.customId === "Archives-ticket"){
            const utilisateurticket = interaction.user.username
            interaction.channel.setParent("983798396672434176")
            interaction.reply({content:"Ticket archivé", ephemeral:true});
            interaction.channel.setName("Archives de " + bdd["ticket"[utilisateur]])
            console.log(utilisateurticket)
            interaction.message.delete();
        }
        else if(interaction.customId === "Reopen-ticket"){
            interaction.channel.setParent("843114700467863582")
            interaction.reply({content:"Ticket réouvert", ephemeral:true});
            interaction.message.delete();
        }
        else if(interaction.customId === "Delete-ticket"){
            interaction.message.delete()
            interaction.channel.delete();
        }
    }
})


// else if(interaction.customId === "close-ticket"){
    // interaction.channel.setParent("980501222010265640");

    // var row = new Discord.MessageActionRow()
            // .addComponents(new Discord.MessageButton()
                // .setCustomId("delete-ticket")
                // .setLabel("Supprimer le ticket")
                // .setStyle("DANGER")
            // )
    // interaction.message.delete();

    // interaction.channel.send({content:"Supprimer le ticket :", components:[row]});

    // interaction.reply({content:"ticket archivé", ephemeral:true});
// }
// else if(interaction.customId === "delete-ticket")
    // interaction.channel.delete();

function Savebdd() {
   fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
       if (err) message.channel.send("Une erreur est survenue !");
   
    });
}

// bot.on("guildMemberAdd", async member => {
//     var canvas = Canvas.createCanvas(1024, 500);

//     ctx = canvas.getContext("2d");

//     var background = await Canvas.loadImage("./1172754-developer-wallpaper-hd-1920x1080-samsung-galaxy.jpg");
//     ctx.drawImage(background, 0, 0, 1024, 500);



//     let welcomeembed = new Discord.MessageEmbed()
//     .setColor("#000000")
//     .setDescription("test")
//     .setImage(background)
//     bot.channels.cache.get("831851081545941022").send({ embeds: [welcomeembed] })
})
