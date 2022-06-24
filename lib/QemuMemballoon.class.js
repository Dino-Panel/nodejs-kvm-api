//define QemuMemballoon class
class QemuMemballoon {
    #xml = null;

    constructor(config = null) {
        if (config != null) {
            this.#xml = config;
        } else {
            this.#xml = {"$":{"model":"virtio"},"address":[{"$":{"type":"pci","domain":"0x0000","bus":"0x04","slot":"0x00","function":"0x0"}}]}
        }

        this.#populateClass()
    }

    //QEMU MEMBALLOON XML CONFIG GETTER
    get xml() {
        return this.#xml;
    }

    //QEMU MEMBALLOON MODEL GETTER, SETTER
    get model() {
        return this.#xml.$.model;
    }

    set model(value) {
        this.#xml.$.model = value;
        this.#populateClass();
    }
    
    //QEMU MEMBALLOON BUS GETTER, SETTER
    get bus() {
        return this.#xml.address[0].$.bus;
    }

    set bus(value) {
        this.#xml.address[0].$.bus = value;
        this.#populateClass();
    }

    //QEMU MEMBALLOON SLOT GETTER, SETTER
    get slot() {
        return this.#xml.address[0].$.slot;
    }

    set slot(value) {
        this.#xml.address[0].$.slot = value;
        this.#populateClass();
    }

    #populateClass() {
        this.populatePromise = new Promise(async res=>{

            this.meta = {
                model: this.model,
                bus: this.bus,
                slot: this.slot,
            };

            res()

        })
    }
}

module.exports = QemuMemballoon;