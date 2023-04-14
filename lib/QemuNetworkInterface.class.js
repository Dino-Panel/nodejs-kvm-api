//define the QemuNetworkInterface class

class QemuNetworkInterface {
  #xml = null;

  constructor(config = null) {
    if (config != null) {
      this.#xml = config;
    } else {
      this.#xml = {
        $: { type: "network" },
        mac: [{ $: { address: "" } }],
        source: [{ $: { network: "" } }],
        bandwidth: [
          {
            inbound: [
              { $: { average: "0", peak: "0", burst: "0" } },
            ],
            outbound: [
              { $: { average: "0", peak: "0", burst: "0" } },
            ],
          },
        ],
        model: [{ $: { type: "virtio" } }],
        link: [{ $: { state: "up" } }],
        address: [
          {
            $: {
              type: "pci",
              domain: "0x0000",
              bus: "0x01",
              slot: "0x00",
              function: "0x0",
            },
          },
        ],
      };
    }

    this.#populateClass();
  }

  //INTERFACE XML CONFIG GETTER
  get xml() {
    return this.#xml;
  }

  //INTERFACE MAC GETTER, SETTER
  get mac() {
    return this.#xml.mac[0].$.address;
  }

    set mac(value) {
        this.#xml.mac[0].$.address = value;
        this.#populateClass();
        return this;
    }

    //INTERFACE LINK STATE GETTER, SETTER
    get linkState() {
        if(this.#xml.link != undefined){
          return this.#xml.link[0].$.state;
        } else {
          return "up";
        }
    }

    set linkState(value) {
        this.#xml.link[0].$.state = value;
        this.#populateClass();
        return this;
    }

    //INTERFACE INBOUND BANDWITH GETTER, SETTER
    get inboundBandwith() {
        if(this.#xml.bandwidth == undefined || this.#xml?.bandwidth[0] == undefined || this.#xml?.bandwidth[0]?.inbound == undefined){
            this.#xml.bandwidth = [
                {
                  inbound: [
                    { $: { average: "0", peak: "0", burst: "0" } },
                  ],
                  outbound: [
                    { $: { average: "0", peak: "0", burst: "0" } },
                  ],
                },
              ]
        }

        return this.#xml?.bandwidth[0]?.inbound[0]?.$?.average || 0;
    }

    set inboundBandwith(value) {
        this.#xml.bandwidth[0].inbound[0].$.average = value;
        this.#xml.bandwidth[0].inbound[0].$.peak = Math.round(value * 1.1);
        this.#xml.bandwidth[0].inbound[0].$.burst = Math.round(value * 1.25);

        this.#populateClass();
        return this;
    }

    //INTERFACE OUTBOUND BANDWITH GETTER, SETTER
    get outboundBandwith() {
        return this.#xml.bandwidth[0].outbound[0].$.average;
    }

    set outboundBandwith(value) {
        this.#xml.bandwidth[0].outbound[0].$.average = value;
        this.#xml.bandwidth[0].outbound[0].$.peak = Math.round(value * 1.1);
        this.#xml.bandwidth[0].outbound[0].$.burst = Math.round(value * 1.25);

        this.#populateClass();
        return this;
    }

    //INTERFACE SOURCE GETTER, SETTER
    get source() {
        return this.#xml.source[0].$.network;
    }

    set source(value) {
        this.#xml.source[0].$.network = value;
        this.#populateClass();
        return this;
    }

    //INTERFACE MODEL GETTER, SETTER
    get model() {
        return this.#xml.model[0].$.type;
    }

    set model(value) {
        this.#xml.model[0].$.type = value;
        this.#populateClass();
        return this;
    }

    //INTERFACE BUS GETTER, SETTER
    get bus() {
        return this.#xml.address[0].$.bus;
    }

    set bus(value) {
        this.#xml.address[0].$.bus = value;
        this.#populateClass();
        return this;
    }

    //INTERFACE SLOT GETTER, SETTER
    get slot() {
        return this.#xml.address[0].$.slot;
    }

    set slot(value) {
        this.#xml.address[0].$.slot = value;
        this.#populateClass();
        return this;
    }


  #populateClass() {
    this.populatePromise = new Promise(async res=>{

        this.meta = {};

        this.meta.mac = this.mac;
        this.meta.inboundBandwith = this.inboundBandwith;
        this.meta.outboundBandwith = this.outboundBandwith;
        this.meta.source = this.source;
        this.meta.model = this.model;
        this.meta.linkState = this.linkState;
        this.meta.bus = this.bus;
        this.meta.slot = this.slot;

        res();
    })

  }
}

module.exports = QemuNetworkInterface;