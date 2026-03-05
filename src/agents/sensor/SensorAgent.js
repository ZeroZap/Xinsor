// Sensor Agent - Sensor interface and protocol management
import { BaseAgent } from "../BaseAgent.js";

export class SensorAgent extends BaseAgent {
  constructor() {
    super("SensorAgent", "Sensor interface and protocol management", "sensor");
    this.capabilities = ["interface", "protocol", "configure", "read", "write"];
    
    this.supportedProtocols = ["I2C", "SPI", "UART", "GPIO", "ADC", "PWM"];
    this.sensorTypes = [
      "temperature", "humidity", "pressure", "accelerometer",
      "gyroscope", "magnetometer", "light", "distance", "gas"
    ];
  }

  async execute(command, options = {}) {
    const parts = command.split(" ");
    const action = parts[0].toLowerCase();

    switch (action) {
      case "list":
        return this._listSensors(options);
      case "interfaces":
        return this._listInterfaces();
      case "protocol":
        return this._getProtocolInfo(parts[1], options);
      case "configure":
        return this._configureSensor(parts.slice(1).join(" "), options);
      default:
        return this._executeDefault(command, options);
    }
  }

  _listSensors(options = {}) {
    const type = options.type || "all";
    return {
      agent: this.name,
      sensors: this.sensorTypes.filter(t => type === "all" || t === type),
      protocols: this.supportedProtocols,
      summary: `Listed ${this.sensorTypes.length} sensor types`
    };
  }

  _listInterfaces() {
    return {
      agent: this.name,
      interfaces: {
        I2C: { pins: ["SDA", "SCL"], speed: "100kHz - 3.4MHz", devices: "Multiple" },
        SPI: { pins: ["MOSI", "MISO", "SCK", "CS"], speed: "Up to 50MHz", devices: "Multiple with CS" },
        UART: { pins: ["TX", "RX"], speed: "Configurable baud", devices: "Point-to-point" },
        GPIO: { pins: ["Digital I/O"], speed: "MHz range", devices: "Simple sensors" },
        ADC: { pins: ["Analog Input"], resolution: "8-16 bit", devices: "Analog sensors" },
        PWM: { pins: ["PWM Output"], frequency: "Configurable", devices: "Motors, LEDs" }
      },
      summary: "Listed all supported interfaces"
    };
  }

  _getProtocolInfo(protocol, options = {}) {
    const proto = protocol?.toUpperCase() || "I2C";
    const info = {
      I2C: {
        description: "Inter-Integrated Circuit - 2-wire serial protocol",
        advantages: ["Simple wiring", "Multiple devices", "Built-in addressing"],
        limitations: ["Limited speed", "Distance constraints"],
        typicalUse: "Temperature, humidity, IMU sensors"
      },
      SPI: {
        description: "Serial Peripheral Interface - 4-wire synchronous protocol",
        advantages: ["High speed", "Full duplex", "Simple protocol"],
        limitations: ["More pins", "No built-in addressing"],
        typicalUse: "SD cards, displays, high-speed sensors"
      },
      UART: {
        description: "Universal Asynchronous Receiver-Transmitter",
        advantages: ["Simple", "Long distance", "Debug friendly"],
        limitations: ["Point-to-point only", "No clock signal"],
        typicalUse: "GPS modules, Bluetooth, serial devices"
      }
    };

    return {
      agent: this.name,
      protocol: proto,
      info: info[proto] || { description: "Protocol info not available" },
      summary: `Protocol info for ${proto}`
    };
  }

  _configureSensor(sensorConfig, options = {}) {
    return {
      agent: this.name,
      configuration: {
        sensor: sensorConfig || "generic",
        protocol: options.protocol || "I2C",
        address: options.address || "auto-detect",
        settings: options.settings || {}
      },
      summary: `Configured sensor: ${sensorConfig}`
    };
  }

  _executeDefault(command, options = {}) {
    return {
      agent: this.name,
      command,
      suggestion: "Try: !sensor list, !sensor interfaces, !sensor protocol I2C",
      summary: "Use specific commands for sensor operations"
    };
  }
}
