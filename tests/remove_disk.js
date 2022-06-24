const QemuManager = require("../lib/QemuManager.class");
const QemuDisk = require("../lib/QemuDisk.class");

const qemuManager = new QemuManager()

async function run(){
    const serverList = await qemuManager.getServers();
    const targetServer = serverList[0];
    const targetDisk = targetServer.disks[1]

    targetServer.removeDisk(targetDisk)

    console.log(targetServer.disks)
}

run()