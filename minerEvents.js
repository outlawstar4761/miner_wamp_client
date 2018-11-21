"use strict";
const EventEmitter = require('events').EventEmitter;
const net = require('net');
const MINERPORT = 4028;

class Miner extends EventEmitter{
    constructor(host){
        super();
        this.host = host;
        this.client = new net.Socket();
        this.client.on('data',this._receiveData);
        this.client.on('close',this._onClose);
        this.client.on('error',this._onError);
    }
    _receiveData(data){
        var result = data.toString();
        var obj = result.substr(0,result.length - 1);
        this.destroy();
        this.emit('minerData',JSON.parse(obj));
    }
    _onClose(){/*console.log('connection closed.');*/}
    _onError(err){console.log(err);}
    _prepArgs(command){
        return JSON.stringify({'command':command});
    }
    getConfig(){
        this.client.connect(MINERPORT,this.host.hostname,()=>{
            this.client.write(this._prepArgs('config'));
        });
    }
    getSummary(){
        this.client.connect(MINERPORT,this.host.hostname,()=>{
            this.client.write(this._prepArgs('summary'));
        });
    }
    getPools(){
        this.client.connect(MINERPORT,this.host.hostname,()=>{
            this.client.write(this._prepArgs('pools'));
        });
    }
    getDevices(){
        this.client.connect(MINERPORT,this.host.hostname,()=>{
            this.client.write(this._prepArgs('devs'));
        });
    }
    getProcessors(){
        this.client.connect(MINERPORT,this.host.hostname,()=>{
            this.client.write(this._prepArgs('procs'));
        });
    }
    getMiningCoin(){
        this.client.connect(MINERPORT,this.host.hostname,()=>{
            this.client.write(this._prepArgs('coin'));
        });
    }
    restart(){
        this.client.connect(MINERPORT,this.host.hostname,()=>{
            this.client.write(this._prepArgs('restart'));
        });
    }
}


/*var host1 = {id:0,ip_address:'192.168.1.82',hostname:'fristie-pc',os:'windows'};
var host2 = {id:1,ip_address:'192.168.1.71',hostname:'scryptminer1',os:'pi'};
var host3 = {id:2,ip_address:'192.168.1.85',hostname:'scryptminer2',os:'pi'};
var hostT = {id:0,ip_address:'127.0.0.1',hostname:'localhost',os:'pi'};
var hosts = [hostT];
hosts.forEach((host)=>{
    var miner = new Miner(host);
    miner.client.on('minerData',(minerData)=>{console.log(minerData.STATUS[0].Msg)});
    //miner.getSummary();
    //miner.getDevices();
    //miner.getPools();
});*/


module.exports = Miner;
