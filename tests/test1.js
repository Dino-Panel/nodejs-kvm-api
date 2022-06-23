const QemuManager = require("../lib/QemuManager.class");
const QemuDisk = require("../lib/QemuDisk.class");

const qemuManager = new QemuManager()

async function run(){
    const serverList = await qemuManager.getServers();
    const targetServer = serverList[0];

    // var newDisk = new QemuDisk();
    // newDisk.bootOrder = 1;
    // newDisk.target = "sdb";


    // targetServer.attachDisk(newDisk)

    console.log(targetServer.xml.domain.cpu)
}

run()