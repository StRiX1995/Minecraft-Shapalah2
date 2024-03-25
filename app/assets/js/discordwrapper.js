// Work in progress
const { LoggerUtil } = require('helios-core')

const logger = LoggerUtil.getLogger('DiscordWrapper')

const { register, Client } = require('discord-rpc-patch')

const Lang = require('./langloader')

let client
let activity

let clientID = 1221892521928560784
let secret = "Z73S9qe6q_FLtMYVUa-_3ROrtEy3tM55"
exports.initRPC = function(genSettings, servSettings, initialDetails = Lang.queryJS('discord.waiting')){
    register({clientId: genSettings.clientId})
    client = new Client({ transport: 'ipc' })

    activity = {
        details: initialDetails,
        state: Lang.queryJS('discord.state', {shortId: servSettings.shortId}),
        largeImageKey: servSettings.largeImageKey,
        largeImageText: servSettings.largeImageText,
        smallImageKey: genSettings.smallImageKey,
        smallImageText: genSettings.smallImageText,
        startTimestamp: new Date().getTime(),
        instance: false
    }

    client.on('ready', () => {
        console.log('Logged in as', client.application.name);
        console.log('Authed for user', client.user.username);
        logger.info('Discord RPC Connected')
        client.setActivity(activity)
    })

    client.login({clientId: genSettings.clientId}).catch(error => {
        if(error.message.includes('ENOENT')) {
            logger.info('Unable to initialize Discord Rich Presence, no client detected.')
        } else {
            logger.info('Unable to initialize Discord Rich Presence: ' + error.message, error)
        }
    })
}

exports.updateDetails = function(details){
    activity.details = details
    client.setActivity(activity)
}

exports.shutdownRPC = function(){
    if(!client) return
    client.clearActivity()
    client.destroy()
    client = null
    activity = null
}

let discord = {}
discord.largeImageKey = "adfs"
discord.largeImageText = "adfs"
discord.smallImageKey = "adfs"
discord.smallImageText = "adfs"
discord.clientId = clientID
exports.initRPC(discord, discord)