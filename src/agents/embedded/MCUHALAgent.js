// MCU HAL Agent - MCU Hardware Abstraction Layer generation
import { BaseAgent } from "../BaseAgent.js";

export class MCUHALAgent extends BaseAgent {
  constructor() {
    super("MCUHALAgent", "MCU Hardware Abstraction Layer generation", "embedded");
    this.capabilities = ["hal", "generate", "configure", "driver"];
    
    this.supportedMCUs = {
      STM32: ["F1", "F4", "H7", "G0", "L4"],
      CH32: ["V2", "V3", "X0"],
      ESP32: ["C3", "S3", "C6"],
      AVR: ["mega328p", "mega2560"]
    };
  }

  async execute(command, options = {}) {
    const parts = command.split(" ");
    const action = parts[0].toLowerCase();

    switch (action) {
      case "generate":
        return this._generateHAL(parts[1], options);
      case "configure":
        return this._configureMCU(parts.slice(1).join(" "), options);
      case "list":
        return this._listMCUs();
      default:
        return this._executeDefault(command, options);
    }
  }

  _generateHAL(mcuType, options = {}) {
    const [family, series] = mcuType?.split(/([A-Z]\d+)/) || ["STM32", "F1"];
    
    return {
      agent: this.name,
      hal: {
        mcu: `${family}${series || "F1"}`,
        layers: [
          "Register definitions",
          "Clock configuration",
          "GPIO abstraction",
          "Peripheral drivers (UART, SPI, I2C)",
          "Interrupt handling",
          "Power management"
        ],
        generated: {
          files: [
            `hal_${family.toLowerCase()}.h`,
            `hal_${family.toLowerCase()}.c`,
            `clock_${series.toLowerCase()}.c`,
            `peripherals.c`
          ],
          interfaces: ["GPIO", "UART", "SPI", "I2C", "ADC", "TIM"]
        }
      },
      summary: `Generated HAL for ${family}${series || "F1"}`
    };
  }

  _configureMCU(config, options = {}) {
    return {
      agent: this.name,
      configuration: {
        mcu: config || "STM32F1",
        clock: options.clock || "72MHz",
        peripherals: options.peripherals || ["GPIO", "UART"],
        pins: this._assignPins(options)
      },
      summary: `Configured MCU: ${config}`
    };
  }

  _assignPins(options = {}) {
    return {
      UART1: { TX: "PA9", RX: "PA10" },
      SPI1: { SCK: "PA5", MISO: "PA6", MOSI: "PA7" },
      I2C1: { SCL: "PB6", SDA: "PB7" },
      GPIO: { LED: "PC13", BUTTON: "PA0" }
    };
  }

  _listMCUs() {
    return {
      agent: this.name,
      mcus: this.supportedMCUs,
      summary: `Listed ${Object.keys(this.supportedMCUs).length} MCU families`
    };
  }

  _executeDefault(command, options = {}) {
    return {
      agent: this.name,
      command,
      suggestion: "Try: !hal generate STM32F4, !hal configure STM32F1 --clock=72MHz",
      summary: "Use specific commands for HAL operations"
    };
  }
}
