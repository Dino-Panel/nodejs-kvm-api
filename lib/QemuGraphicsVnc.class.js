//define new QemuGraphicsVnc class
class QemuGraphicsVnc {
    #xml = null;

    constructor(config = null) {
        if (config != null) {
            this.#xml = config;
        } else {
            this.#xml = {
                $: {
                    type: "vnc",
                    port: "5900",
                    listen: "",
                    passwd: "",
                },
                listen: [{ $: { type: "address", address: "0.0.0.0" } }],
            };
        }

        this.#populateClass();
    }

    //VNC XML CONFIG GETTER
    get xml() {
        return this.#xml;
    }  

    //VNC PORT GETTER, SETTER
    get port() {
        return this.#xml.$.port;
    }

    set port(value) {
        this.#xml.$.port = value;
        this.#populateClass();

        return this;
    }

    //VNC LISTEN ADDRESS GETTER, SETTER
    get listenAddress() {
        return this.#xml.listen[0].$.address;
    }

    set listenAddress(value) {
        this.#xml.listen[0].$.address = value;
        this.#xml.$.listen = value;
        this.#populateClass();

        return this;
    }

    //VNC PASSWORD GETTER, SETTER
    get password() {
        return this.#xml.$.passwd;
    }

    set password(value) {
        this.#xml.$.passwd = value;
        this.#populateClass();

        return this;
    }
    
    #populateClass() {
        this.populatePromise = new Promise(async res=>{

            this.meta = {   
                port: this.port,
                listenAddress: this.listenAddress,
                password: this.password,
            }

            res()

        })
    }
}

module.exports = QemuGraphicsVnc;