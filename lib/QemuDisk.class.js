var fs = require("fs");
const { exec } = require("child_process");

class QemuDisk {
  #xml = null;

  constructor(config = null) {
    if (config != null) {
      this.#xml = config;

      this.fileExists = fs.existsSync(this.source);
    } else {
        this.#xml = {
            "$":{
               "type":"file",
               "device":"disk"
            },
            "driver":[
               {
                  "$":{
                     "name":"qemu",
                     "type":"qcow2"
                  }
               }
            ],
            "source":[
               {
                  "$":{
                     "file":""
                  }
               }
            ],
            "target":[
               {
                  "$":{
                     "dev":"sda",
                     "bus":"sata"
                  }
               }
            ],
            "address":[
               {
                  "$":{
                     "type":"drive",
                     "controller":"0",
                     "bus":"0",
                     "target":"0",
                     "unit":"0"
                  }
               }
            ]
         }

      this.fileExists = false;
    }

    this.#populateClass()
  }

  //DISK XML CONFIG GETTER
  get xml() {
    return this.#xml;
  }

  //DISK SOURCE GETTER, SETTER
  get source() {
    return this.#xml.source[0]["$"].file;
  }

  set source(value) {
    this.#xml.source[0]["$"].file = value;
    this.fileExists = fs.existsSync(this.source);
    this.#populateClass()
    
    return this;
  }

  //DISK TARGET GETTER, SETTER
  get target() {
    return this.#xml.target[0]["$"].dev;
  }

  set target(value) {
    this.#xml.target[0]["$"].dev = value;
    this.#populateClass()

    return this;
  }

  //DISK DRIVER GETTER, SETTER
  get driver() {
    return this.#xml.driver[0]["$"].type;
  }

  set driver(value) {
    this.#xml.driver[0]["$"].type = value;
    this.#populateClass()

    return this;
  }

  //DISK BOOT ORDER GETTER, SETTER
  get bootOrder() {
    if (this.#xml.boot) {
      return this.#xml.boot[0]["$"].order;
    } else {
      return -1;
    }
  }

  set bootOrder(value) {
    if (value > -1 && this.#xml.boot !== undefined) {
      this.#xml.boot[0]["$"].order = value;
    } else if (value > -1 && this.#xml.boot === undefined) {
      this.#xml.boot = [{ $: { order: value } }];
    } else if (value == -1 && this.#xml.boot !== undefined) {
      delete this.#xml.boot;
    }
    this.#populateClass()
    
    return this;
  }

  getSize() {
    return new Promise((res) => {
      if (fs.existsSync(this.source)) {
        runCmd(`qemu-img info ${this.source} -U`).then((qemuImgResult) => {
          var lines = qemuImgResult.split("\n");
          var sizeLine = lines.find((l) => l.startsWith("virtual size:"));

          sizeLine = sizeLine.replace("virtual size: ", "");
          sizeLine = sizeLine.split("(")[1];
          sizeLine = sizeLine.replace(" bytes)", "");
          res(parseInt(sizeLine) / (1024 * 1024));
        });
      } else {
        res(-1);
      }
    });
  }

  setSize(newSize) {
    return new Promise(async (res, rej) => {
      if (fs.existsSync(this.source)) {
        const currentSize = await this.getSize();

        if (newSize <= currentSize) {
          throw "Cannot shrink image";
          return;
        }

        await runCmd(`qemu-img resize ${this.source} ${newSize}M`);
        await this.#populateClass()

        res(this);
      } else if (this.source != null) {
        await runCmd(`qemu-img create -f qcow2 ${this.source} ${newSize}M`);
        await this.#populateClass()
        this.fileExists = true;

        res(this);
      }
    });
  }

  copyFrom(QemuDisk) {
    return new Promise(async (res) => {
      const copyFrom = QemuDisk.source;

      if (copyFrom != null && this.source != null) {
        await run_cmd(`cp ${copyFrom} ${this.source}`);
        this.fileExists = true;

        res()
      }
    });
  }

  #populateClass(){
    this.populatePromise = new Promise(async res=>{

      this.meta = {};

      this.meta.bootOrder = this.bootOrder
      this.meta.driver = this.driver;
      this.meta.source = this.source;
      this.meta.target = this.target;
  
      this.meta.size = await this.getSize();

      res()
    })

    return this.populatePromise
  }
}

function runCmd(cmd) {
  return new Promise((res) => {
    exec(cmd, (error, stdout, stderr) => {
      if (stderr) console.log(stderr);
      res(stdout);
    });
  });
}

module.exports = QemuDisk;
