const classUtils = require("./QemuManager.utils")

const QemuServer = require("./QemuServer.class")

class QemuManager {
    constructor(options){
        this.vm_config_folder = options?.vm_config_folder || "/etc/libvirt/qemu/"
        this.networks_config_folder = options?.networks_config_folder || "/etc/libvirt/qemu/networks"
    }

    vmConfigPath(){
        return this.vm_config_folder
    }

    async getServers(){
        const fileList = await classUtils.getServerFileList(this.vm_config_folder);
        const fileListFiltered = fileList.filter(file=> file.includes(".xml"))
        const serverList = [];

        for(var serverConfigFilePath of fileListFiltered){
            const server = new QemuServer(this, serverConfigFilePath);
            serverList.push(server)
        }

        return serverList;
    }
}

module.exports = QemuManager;