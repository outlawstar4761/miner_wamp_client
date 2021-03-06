const autobahn = require('autobahn');
const Miner = require('./minerEvents');
const HOSTNAME = 'scryptminer2';
var connection = new autobahn.Connection({
    url:'ws://api.outlawdesigns.io:9700/ws',
    realm:'realm1'
});
var host = {id:0,ip_address:'127.0.0.1',hostname:'localhost',os:'pi'};
var miner = new Miner(host);

function getSummary(){
    miner.getSummary();
}
function getDevices(){
    miner.getDevices();
}
function getPools(){
    miner.getPools();
}
function restart(){
    miner.restart();
}

function parseMinerData(minerData){
    var patternObj = {
        summary:/Summary/,
        device:/PGA/,
        pool:/Pool/,
        restart:/RESTART/
    }
    if(minerData.STATUS[0].Msg.match(patternObj.summary)){
        return 'summary';
    }else if(minerData.STATUS[0].Msg.match(patternObj.device)){
        return 'device';
    }else if(minerData.STATUS[0].Msg.match(patternObj.pool)){
        return 'pool';
    }else if(minerData.STATUS[0].Msg.match(patternObj.restart)){
        return 'restart';
    }
    return false;
}

connection.onopen = function(session){
    console.log('Connected to WAMP router...');
    session.register(HOSTNAME + '.getSummary',getSummary).then((req)=>{console.log(HOSTNAME + '.getSummary Registered');},console.log);
    session.register(HOSTNAME + '.getDevices',getDevices).then((req)=>{console.log(HOSTNAME + '.getDevices Registered');},console.log);
    session.register(HOSTNAME + '.getPools',getDevices).then((req)=>{console.log(HOSTNAME + '.getPools Registered');},console.log);
    session.register(HOSTNAME + '.restart',restart).then((req)=>{console.log(HOSTNAME + '.restart Registered');},console.log);
    miner.client.on('minerData',(minerData)=>{
        session.publish(HOSTNAME + '.' + parseMinerData(minerData),[minerData]);
    });
};

connection.open();
