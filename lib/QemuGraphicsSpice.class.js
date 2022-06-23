//define QemuGraphicsSpice class
class QemuGraphicsSpice {
    #xml = null;

    constructor(config = null) {
        if (config != null) {
            this.#xml = config;
        } else {
            this.#xml = {"$":{"type":"spice","autoport":"yes"},"listen":[{"$":{"type":"address"}}],"image":[{"$":{"compression":"off"}}]}
        }

        this.#populateClass()
    }

    //SPICE XML CONFIG GETTER
    get xml() {
        return this.#xml;
    }

    //SPICE AUTOPORT ENABLED GETTER, SETTER
    get autoport() {
        return this.#xml.$.autoport == "yes";
    }

    set autoport(value) {
        this.#xml.$.autoport = value ? "yes" : "no";
        this.#populateClass();
    }

    //SPICE COMPRESION GETTER, SETTER
    get compression() {
        return this.#xml.image[0].$.compression == "on";
    }

    set compression(value) {
        this.#xml.image[0].$.compression = value ? "on" : "off";
        this.#populateClass();
    }

    #populateClass() {
        this.populatePromise = new Promise(async res=>{

            this.meta = {
                autoport: this.autoport,
                compression: this.compression,
            };

            res()

        })
    }
}

module.exports = QemuGraphicsSpice;