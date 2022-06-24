const QemuManager = require("../lib/QemuManager.class");
const QemuDisk = require("../lib/QemuDisk.class");
const QemuServer = require("../lib/QemuServer.class");

const qemuManager = new QemuManager()

async function run(){
    const qemuManager = new QemuManager()
    const serverList = await qemuManager.getServers();
    const targetServer = serverList.find(server=> server.uuid == "c82e5eab-a83b-4ba9-9a26-aac46e0a77fa")

    // targetServer.memory = 4096;
    targetServer.delete();

    console.log(targetServer)
}

run()