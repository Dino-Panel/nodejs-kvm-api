const QemuManager = require("./QemuManager.class");
const QemuServer = require("./QemuServer.class");

const QemuDisk = require("./QemuDisk.class");
const QemuCDRom = require("./QemuCDRom.class");
const QemuNetworkInterface = require("./QemuNetworkInterface.class");
const QemuGraphicsVnc = require("./QemuGraphicsVnc.class");
const QemuGraphicsSpice = require("./QemuGraphicsSpice.class");

module.exports = {
    QemuManager,
    QemuServer,
    QemuDisk,
    QemuCDRom,
    QemuNetworkInterface,
    QemuGraphicsVnc,
    QemuGraphicsSpice
}