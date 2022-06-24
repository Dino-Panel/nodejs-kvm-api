const { parseString } = require("xml2js");
const fs = require("fs");

const QemuDisk = require("./QemuDisk.class")
const QemuCDRom = require("./QemuCDRom.class")
const QemuNetworkInterface = require("./QemuNetworkInterface.class")
const QemuGraphicsVnc = require("./QemuGraphicsVnc.class")
const QemuGraphicsSpice = require("./QemuGraphicsSpice.class")
const QemuMemBalloon = require("./QemuMemballoon.class")
const QemuCpu = require("./QemuCpu.class")

class QemuServer{
    #xml = null; 
    #internalDiskArray = null
    #internalNetworkInterfaceArray = null;
    #internalGraphicsArray = null;
    #internalMemoryBalloonDevice;
    #internalCpuDevice;

    constructor(QemuManager, filePath = null){
        if(filePath !== null){
            const fileContentXml = fs.readFileSync(`${QemuManager.vmConfigPath()}${filePath}`, 'utf-8');

            parseString(fileContentXml, (err, fileContentJson)=>{
                this.#xml = fileContentJson;
            })
        } else {
            const qemuServerTemplate = JSON.parse(fs.readFileSync(`./lib/QemuServerTemplate.json`, 'utf-8'));
            this.#xml = qemuServerTemplate;
        }

        this.#populateClass();
    }

    //VPS XML CONFIG GETTER
    get xml(){
        return this.#xml;
    }

    //VPS TYPE SETTER, GETTER
    get type(){
        return this.#xml.domain['$'].type;
    }

    set type(value){
        this.#xml.domain['$'].type = value;
        this.#populateClass();

        return this;
    }

    //VPS NAME SETTER, GETTER
    get name(){
        return this.#xml.domain.name[0];
    }

    set name(value){
        this.#xml.domain.name[0] = value;
        this.#populateClass();

        return this;
    }

    //VPS MEMORY SETTER, GETTER
    get memory(){
        return this.#xml.domain.memory[0]['_']  / 1024;
    }

    set memory(value){
        this.#xml.domain.memory[0]['_'] = value * 1024;
        this.#xml.domain.currentMemory[0]['_'] = value * 1024;
        this.#populateClass();

        return this;
    }

    //VPS MEMORY SETTER, GETTER
    get cpuCores(){
        return this.#xml.domain.vcpu[0]['_'];
    }

    set cpuCores(value){
        const cpuObject = this.cpu;

        cpuObject.cores = value;
        cpuObject.sockets = 1;
        cpuObject.threads = 1;
        
        this.#xml.domain.vcpu[0]['_'] = value;
        this.#populateClass();

        return this;
    }

    //VPS OS SETTER, GETTER
    get os(){
        return this.#xml.domain.os[0].type[0]['_'];
    }

    set os(value){
        this.#xml.domain.os[0].type[0]['_'] = value;
        this.#populateClass();

        return this;
    }

    //VPS BOOTMENU-ENABLED SETTER, GETTER
    get bootmenuEnabled(){
        return this.#xml.domain.os[0].bootmenu[0]['$'].enable == 'yes';
    }

    set bootmenuEnabled(value){
        const bootMenuValue = value == true ? 'yes' : 'no'
        this.#xml.domain.os[0].bootmenu[0]['$'].enable = bootMenuValue;
        this.#populateClass();

        return this;
    }

    //VPS EMULATOR SETTER, GETTER
    get emulator(){
        return this.#xml.domain.devices[0].emulator[0]
    }

    set emulator(value){
        this.#xml.domain.devices[0].emulator[0] = value;
        this.#populateClass();

        return this;
    }

    //VPS DISKS GETTER
    get disks(){
        if(this.#internalDiskArray == null){
            return this.#buildInternalDiskArray()
        } else {
            return this.#internalDiskArray
        }
    }

    //VPS NETWORK INTERFACE GETTER
    get networkInterfaces(){
        if(this.#internalNetworkInterfaceArray == null){
            return this.#buildInternalNetworkInterfaceArray();
        } else {
            return this.#internalNetworkInterfaceArray;
        }
    }

    //VPS GRAPHICS GETTER
    get graphics(){
        if(this.#internalGraphicsArray == null){
            return this.#buildInternalGraphicsArray();
        } else {
            return this.#internalGraphicsArray;
        }
    }

    //VPS MEMBALLOON DEVICE GETTER
    get memballoonDevice(){
        if(this.#internalMemoryBalloonDevice == null){
            return this.#buildMemballoonDevice();
        }

        return this.#internalMemoryBalloonDevice;
    }

    //VPS CPU DEVICE GETTER
    get cpu(){
        if(this.#internalCpuDevice == null){
            return this.#buildCpuDevice();
        } else {
            return this.#internalCpuDevice;
        }

    }

    #buildCpuDevice(){
        const cpuConfig = this.#xml.domain.cpu[0] || null;
        const cpuDeviceObject = new QemuCpu(cpuConfig);

        this.#xml.domain.cpu[0] = cpuDeviceObject.xml;
        this.#internalCpuDevice = cpuDeviceObject;

        return cpuDeviceObject;
    }

    #buildMemballoonDevice(){
        const memballoonDevice = this.#xml.domain.devices[0].memballoon[0] || null;

        const memballoonDeviceObject = new QemuMemBalloon(memballoonDevice);

        this.#xml.domain.devices[0].memballoon[0] = memballoonDeviceObject.xml;

        this.#internalMemoryBalloonDevice = memballoonDeviceObject;
        return memballoonDeviceObject;
    }

    #buildInternalGraphicsArray(){
        const graphicsArray = this.#xml.domain.devices[0].graphics
        const graphicsList = [];
        const graphicsXml = []

        for(const graphicDevice of graphicsArray){
            if(graphicDevice['$'].type == 'vnc'){
                const graphicDeviceObject = new QemuGraphicsVnc(graphicDevice)

                graphicsList.push(graphicDeviceObject)
                graphicsXml.push(graphicDeviceObject.xml)
            } else if(graphicDevice['$'].type == 'spice'){
                const graphicDeviceObject = new QemuGraphicsSpice(graphicDevice)

                graphicsList.push(graphicDeviceObject)
                graphicsXml.push(graphicDeviceObject.xml)
            }
        }

        this.#xml.domain.devices[0].graphics = graphicsXml;
        this.#internalGraphicsArray = graphicsList;

        return graphicsList
    }


    #buildInternalNetworkInterfaceArray(){
        const networkInterfaceArray = this.#xml.domain.devices[0].interface;
        const networkInterfaceList = [];
        const networkInterfaceXml = [];

        for(const networkInterface of networkInterfaceArray){
            const networkInterfaceObject = new QemuNetworkInterface(networkInterface);

            networkInterfaceList.push(networkInterfaceObject)
            networkInterfaceXml.push(networkInterfaceObject.xml)
        }

        this.#xml.domain.devices[0].interface = networkInterfaceXml;
        this.#internalNetworkInterfaceArray = networkInterfaceList;

        return networkInterfaceList
    }

    #buildInternalDiskArray(){
        const diskArray = this.#xml.domain.devices[0].disk;
        const diskList = [];
        const diskXml = [];

        for(const disk of diskArray){

            if(disk['$'].device == "disk") {
                const diskObject = new QemuDisk(disk);

                diskList.push(diskObject)
                diskXml.push(diskObject.xml)
            } else if(disk['$'].device == 'cdrom'){
                const cdromObject = new QemuCDRom(disk);

                diskList.push(cdromObject)
                diskXml.push(cdromObject.xml)
            }
        }

        this.#xml.domain.devices[0].disk = diskXml;
        this.#internalDiskArray = diskList;

        return diskList
    }

    attachDisk(QemuDiskQemuCDRom){
        return new Promise(async (res, rej)=>{
            const currentDiskList = this.disks;
            
            const newDiskTarget = QemuDiskQemuCDRom.meta.target;
            const newDiskBootOrder = QemuDiskQemuCDRom.meta.bootOrder

            const diskWithSameTarget = currentDiskList.find(disk=> disk.meta.target == newDiskTarget)
            const diskWithSameBootOrder = currentDiskList.find(disk=> disk.meta.bootOrder == newDiskBootOrder && newDiskBootOrder !== -1)

            if(diskWithSameTarget !== undefined){
                rej("Target is already used")
                return
            }

            if(diskWithSameBootOrder !== undefined){
                rej("Boot order is already used")
                return
            }

            this.#xml.domain.devices[0].disk.push(QemuDiskQemuCDRom.xml)
            this.#internalDiskArray.push(QemuDiskQemuCDRom)

            res()
        })
    }


    #populateClass(){
        this.populatePromise = new Promise(async res=>{
    
          this.meta = {};
    
          this.meta.type = this.type;
          this.meta.name = this.name
          this.meta.cpuCores = this.cpuCores
          this.meta.memory = this.memory
          this.meta.disks = this.disks;
          this.meta.emulator = this.emulator
          this.meta.bootmenuEnabled = this.bootmenuEnabled
          this.meta.os = this.os
          this.meta.networkInterfaces = this.networkInterfaces;
          this.meta.graphics = this.graphics;
          this.meta.memballoonDevice = this.memballoonDevice;
          this.meta.cpu = this.cpu;
    
          res()
        })
    
        return this.populatePromise
      }

}
module.exports = QemuServer;