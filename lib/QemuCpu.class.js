//define QemuCpu class
class QemuCpu {
    #xml = null;

    constructor(config = null){
        if(config != null){
            this.#xml = config;
        } else {
            this.#xml = {"$":{"mode":"host-model","check":"partial"},"topology":[{"$":{"sockets":"1","cores":"12","threads":"1"}}]};
        }
        
        if(this.#xml.topology == null){
            this.#xml.topology = [{"$":{"sockets":"1","cores":"12","threads":"1"}}];
        }

        this.#populateClass()
    }

    //CPU XML CONFIG GETTER
    get xml() {
        return this.#xml;
    }

    //CPU MODE GETTER, SETTER
    get mode() {
        return this.#xml.$.mode;
    }

    set mode(value) {
        this.#xml.$.mode = value;
        this.#populateClass();

        return this;
    }

    //CPU SOCKETS GETTER, SETTER
    get sockets() {
        return this.#xml.topology[0].$.sockets;
    }

    set sockets(value) {
        this.#xml.topology[0].$.sockets = value;
        this.#populateClass();

        return this;
    }

    //CPU CORES GETTER, SETTER
    get cores() {
        return this.#xml.topology[0].$.cores;
    }

    set cores(value) {
        this.#xml.topology[0].$.cores = value;
        this.#populateClass();

        return this;
    }

    //CPU THREADS GETTER, SETTER
    get threads() {
        return this.#xml.topology[0].$.threads;
    }

    set threads(value) {
        this.#xml.topology[0].$.threads = value;
        this.#populateClass();

        return this;
    }

    //CPU POPULATE CLASS
    #populateClass(){
        this.populatePromise = new Promise(async res=>{
                
                this.meta = {
                    mode: this.mode,
                    sockets: this.sockets,
                    cores: this.cores,
                    threads: this.threads,
                };
                
                res()
            });
        }
}

module.exports = QemuCpu;