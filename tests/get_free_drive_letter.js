const QemuManager = require("../lib/QemuManager.class");
const QemuDisk = require("../lib/QemuDisk.class");

const qemuManager = new QemuManager()

async function run(){
    const serverList = await qemuManager.getServers();
    const targetServer = serverList[0];
    const driveLetter = await targetServer.getFreeDriveLetter();

    console.log(driveLetter)
}

run()