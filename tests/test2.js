const QemuDisk = require("../lib/QemuDisk.class");

async function run(){
    const newDisk = new QemuDisk();

    newDisk.bootOrder = 1;

    console.log(newDisk)

}

run()