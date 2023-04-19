module.exports = () => {
    return {
        "domain": {
          "$": { "type": "kvm" },
          "name": [],
          "memory": [{ "_": "0", "$": { "unit": "KiB" } }],
          "currentMemory": [{ "_": "0", "$": { "unit": "KiB" } }],
          "vcpu": [{ "_": "0", "$": { "placement": "static" } }],
          "os": [
            {
              "type": [
                { "_": "hvm", "$": { "arch": "x86_64", "machine": "pc-q35-4.2" } }
              ],
              "bootmenu": [{ "$": { "enable": "yes" } }]
            }
          ],
          "features": [
            {
              "acpi": [""],
              "apic": [""],
              "hyperv": [
                {
                  "relaxed": [{ "$": { "state": "on" } }],
                  "vapic": [{ "$": { "state": "on" } }],
                  "spinlocks": [{ "$": { "state": "on", "retries": "8191" } }]
                }
              ],
              "vmport": [{ "$": { "state": "off" } }]
            }
          ],
          "cpu": [],
          "clock": [
            {
              "$": { "offset": "localtime" },
              "timer": [
                { "$": { "name": "rtc", "tickpolicy": "catchup" } },
                { "$": { "name": "pit", "tickpolicy": "delay" } },
                { "$": { "name": "hpet", "present": "no" } },
                { "$": { "name": "hypervclock", "present": "yes" } }
              ]
            }
          ],
          "on_poweroff": ["destroy"],
          "on_reboot": ["restart"],
          "on_crash": ["destroy"],
          "pm": [
            {
              "suspend-to-mem": [{ "$": { "enabled": "no" } }],
              "suspend-to-disk": [{ "$": { "enabled": "no" } }]
            }
          ],
          "devices": [
            {
              "emulator": ["/usr/bin/qemu-system-x86_64"],
              "disk": [],
              "controller": [
                {
                  "$": {
                    "type": "usb",
                    "index": "0",
                    "model": "qemu-xhci",
                    "ports": "15"
                  },
                  "address": [
                    {
                      "$": {
                        "type": "pci",
                        "domain": "0x0000",
                        "bus": "0x02",
                        "slot": "0x00",
                        "function": "0x0"
                      }
                    }
                  ]
                },
                {
                  "$": { "type": "sata", "index": "0" },
                  "address": [
                    {
                      "$": {
                        "type": "pci",
                        "domain": "0x0000",
                        "bus": "0x00",
                        "slot": "0x1f",
                        "function": "0x2"
                      }
                    }
                  ]
                },
                { "$": { "type": "pci", "index": "0", "model": "pcie-root" } },
                {
                  "$": { "type": "pci", "index": "1", "model": "pcie-root-port" },
                  "model": [{ "$": { "name": "pcie-root-port" } }],
                  "target": [{ "$": { "chassis": "1", "port": "0x10" } }],
                  "address": [
                    {
                      "$": {
                        "type": "pci",
                        "domain": "0x0000",
                        "bus": "0x00",
                        "slot": "0x02",
                        "function": "0x0",
                        "multifunction": "on"
                      }
                    }
                  ]
                },
                {
                  "$": { "type": "pci", "index": "2", "model": "pcie-root-port" },
                  "model": [{ "$": { "name": "pcie-root-port" } }],
                  "target": [{ "$": { "chassis": "2", "port": "0x11" } }],
                  "address": [
                    {
                      "$": {
                        "type": "pci",
                        "domain": "0x0000",
                        "bus": "0x00",
                        "slot": "0x02",
                        "function": "0x1"
                      }
                    }
                  ]
                },
                {
                  "$": { "type": "pci", "index": "3", "model": "pcie-root-port" },
                  "model": [{ "$": { "name": "pcie-root-port" } }],
                  "target": [{ "$": { "chassis": "3", "port": "0x12" } }],
                  "address": [
                    {
                      "$": {
                        "type": "pci",
                        "domain": "0x0000",
                        "bus": "0x00",
                        "slot": "0x02",
                        "function": "0x2"
                      }
                    }
                  ]
                },
                {
                  "$": { "type": "pci", "index": "4", "model": "pcie-root-port" },
                  "model": [{ "$": { "name": "pcie-root-port" } }],
                  "target": [{ "$": { "chassis": "4", "port": "0x13" } }],
                  "address": [
                    {
                      "$": {
                        "type": "pci",
                        "domain": "0x0000",
                        "bus": "0x00",
                        "slot": "0x02",
                        "function": "0x3"
                      }
                    }
                  ]
                },
                {
                  "$": { "type": "pci", "index": "5", "model": "pcie-root-port" },
                  "model": [{ "$": { "name": "pcie-root-port" } }],
                  "target": [{ "$": { "chassis": "5", "port": "0x14" } }],
                  "address": [
                    {
                      "$": {
                        "type": "pci",
                        "domain": "0x0000",
                        "bus": "0x00",
                        "slot": "0x02",
                        "function": "0x4"
                      }
                    }
                  ]
                },
                {
                  "$": { "type": "virtio-serial", "index": "0" },
                  "address": [
                    {
                      "$": {
                        "type": "pci",
                        "domain": "0x0000",
                        "bus": "0x03",
                        "slot": "0x00",
                        "function": "0x0"
                      }
                    }
                  ]
                }
              ],
              "interface": [],
              "channel": [
                {
                  "$": { "type": "spicevmc" },
                  "target": [
                    { "$": { "type": "virtio", "name": "com.redhat.spice.0" } }
                  ],
                  "address": [
                    {
                      "$": {
                        "type": "virtio-serial",
                        "controller": "0",
                        "bus": "0",
                        "port": "1"
                      }
                    }
                  ]
                }
              ],
              "input": [
                {
                  "$": { "type": "tablet", "bus": "usb" },
                  "address": [{ "$": { "type": "usb", "bus": "0", "port": "1" } }]
                },
                { "$": { "type": "mouse", "bus": "ps2" } },
                { "$": { "type": "keyboard", "bus": "ps2" } }
              ],
              "graphics": [],
              "sound": [
                {
                  "$": { "model": "ich9" },
                  "address": [
                    {
                      "$": {
                        "type": "pci",
                        "domain": "0x0000",
                        "bus": "0x00",
                        "slot": "0x1b",
                        "function": "0x0"
                      }
                    }
                  ]
                }
              ],
              "video": [
                {
                  "model": [
                    {
                      "$": { "type": "virtio", "heads": "1", "primary": "yes" }
                    }
                  ],
                  "address": [
                    {
                      "$": {
                        "type": "pci",
                        "domain": "0x0000",
                        "bus": "0x00",
                        "slot": "0x01",
                        "function": "0x0"
                      }
                    }
                  ]
                }
              ],
              "serial": [
                {
                  "$": { "type": "pty" },
                  "target": [{ "$": { "port": "0" } }],
                  "address": [
                    {
                      "$": {
                        "type": "virtio-serial",
                        "controller": "0",
                        "bus": "0",
                        "port": "2"
                      }
                    }
                  ]
                }
              ],
              "tpm": [
                {
                  "$": { "model": "tpm-crb" },
                  "backend": [
                    {
                      "$": { "type": "emulator", "version": "2.0" }
                    }
                  ]
                }
              ],
              "memballoon": []
            }
          ]
        }  
      }
}