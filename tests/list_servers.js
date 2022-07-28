const { QemuManager } = require('../lib/index');

const qemuManager = new QemuManager();

async function run(){
    var serverList = await qemuManager.getServers();

    console.log(serverList[4].networkInterfaces)
}

run();