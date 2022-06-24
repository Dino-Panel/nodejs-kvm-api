const QemuManager = require("../lib/QemuManager.class");
const QemuDisk = require("../lib/QemuDisk.class");
const QemuServer = require("../lib/QemuServer.class");

const qemuManager = new QemuManager()

async function run(){
    const qemuManager = new QemuManager()
    const newServer = new QemuServer(qemuManager);

    newServer.name = "goudvis"
    newServer.cpuCores = 2;
    newServer.memory= 1024;

    await newServer.save();

    console.log(newServer)
}

run()