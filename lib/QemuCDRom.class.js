var fs = require("fs");
const { exec } = require("child_process");

class QemuCDRom {
  #xml = null;

  constructor(config = null) {
    if (config != null) {
      this.#xml = config;

      this.fileExists = fs.existsSync(this.source);
    } else {
      this.#xml = {
        $: {
          type: "file",
          device: "cdrom",
        },
        driver: [
          {
            $: {
              name: "qemu",
              type: "raw",
            },
          },
        ],
        readonly: [""],
        source: [
          {
            $: {
              file: "",
            },
          },
        ],
        target: [
          {
            $: {
              dev: "sda",
              bus: "sata",
            },
          },
        ],
        address: [
          {
            $: {
              type: "drive",
              controller: "0",
              bus: "0",
              target: "0",
              unit: "0",
            },
          },
        ],
      };

      this.fileExists = false;
    }

    this.#populateClass();
  }

  //CDROM XML CONFIG GETTER
  get xml() {
    return this.#xml;
  }

  //CDROM SOURCE GETTER, SETTER
  get source() {
    return this.#xml.source[0]["$"].file;
  }

  set source(value) {
    this.#xml.source[0]["$"].file = value;
    this.fileExists = fs.existsSync(this.source);
    this.#populateClass();

    return this;
  }

    //DISK unit GETTER, SETTER
    get unit() {
      return this.#xml.address[0]["$"].unit;
    }
  
    set unit(value) {
      this.#xml.address[0]["$"].unit = value;
      this.#populateClass()
  
      return this;
    }

  //CDROM TARGET GETTER, SETTER
  get target() {
    return this.#xml.target[0]["$"].dev;
  }

  set target(value) {
    this.#xml.target[0]["$"].dev = value;
    this.#populateClass();

    return this;
  }

  //CDROM DRIVER GETTER, SETTER
  get driver() {
    return this.#xml.driver[0]["$"].type;
  }

  set driver(value) {
    this.#xml.driver[0]["$"].type = value;
    this.#populateClass();

    return this;
  }

  //CDROM BOOT ORDER GETTER, SETTER
  get bootOrder() {
    if (this.#xml.boot) {
      return this.#xml.boot[0]["$"].order;
    } else {
      return -1;
    }
  }

  //CDROM READONLY GETTER, SETTER
  get readOnly() {
    return this.#xml.readonly !== undefined;
  }

  set readyOnly(value) {
    if (value == true) {
      this.#xml.readonly = [""];
    } else {
      delete this.#xml.readonly;
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
    this.#populateClass();

    return this;
  }

  copyFrom(QemuCDRom) {
    return new Promise(async (res) => {
      const copyFrom = QemuDisk.source;

      if (copyFrom != null && this.source != null) {
        await run_cmd(`cp ${copyFrom} ${this.source}`);
        this.fileExists = true;

        res();
      }
    });
  }

  #populateClass() {
    this.populatePromise = new Promise(async (res) => {
      this.meta = {};

      this.meta.type = 'cdrom'
      this.meta.bootOrder = this.bootOrder;
      this.meta.driver = this.driver;
      this.meta.source = this.source;
      this.meta.target = this.target;
      this.meta.readOnly = this.readOnly;

      res();
    });

    return this.populatePromise;
  }
}
module.exports = QemuCDRom;
