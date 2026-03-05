// HAL Generator Skill - HAL layer code generation
import { BaseSkill } from "./BaseSkill.js";

export class HALGeneratorSkill extends BaseSkill {
  constructor() {
    super("hal", "Hardware Abstraction Layer code generation");
  }

  async run(mcu, options = {}) {
    const peripheral = options.peripheral || "GPIO";
    
    return {
      skill: this.name,
      action: "generate",
      mcu,
      peripheral,
      output: this._generateHAL(mcu, peripheral, options)
    };
  }

  _generateHAL(mcu, peripheral, options = {}) {
    const templates = {
      GPIO: this._generateGPIO(mcu),
      UART: this._generateUART(mcu),
      SPI: this._generateSPI(mcu),
      I2C: this._generateI2C(mcu),
      ADC: this._generateADC(mcu)
    };

    return {
      header: this._generateHeader(mcu, peripheral),
      source: templates[peripheral] || templates.GPIO,
      config: this._generateConfig(options)
    };
  }

  _generateHeader(mcu, peripheral) {
    const guard = `__HAL_${mcu.toUpperCase()}_${peripheral.toUpperCase()}_H__`;
    
    return `#ifndef ${guard}
#define ${guard}

#include "${mcu.toLowerCase()}.h"

// HAL ${peripheral} Definitions
typedef struct {
  uint8_t initialized;
  void *instance;
} HAL_${peripheral}_Handle_t;

// Function Prototypes
HAL_StatusTypeDef HAL_${peripheral}_Init(HAL_${peripheral}_Handle_t *h, void *config);
HAL_StatusTypeDef HAL_${peripheral}_DeInit(HAL_${peripheral}_Handle_t *h);

#endif /* ${guard} */`;
  }

  _generateGPIO(mcu) {
    return `// GPIO HAL Implementation
HAL_StatusTypeDef HAL_GPIO_Init(HAL_GPIO_Handle_t *h, GPIO_Config_t *config) {
  if (!h || !config) return HAL_ERROR;
  
  // Configure pin mode, speed, and pull-up/down
  // Implementation depends on ${mcu}
  
  h->initialized = 1;
  return HAL_OK;
}

void HAL_GPIO_Write(HAL_GPIO_Handle_t *h, uint8_t value) {
  // Set pin output
}

uint8_t HAL_GPIO_Read(HAL_GPIO_Handle_t *h) {
  // Read pin input
  return 0;
}`;
  }

  _generateUART(mcu) {
    return `// UART HAL Implementation
HAL_StatusTypeDef HAL_UART_Init(HAL_UART_Handle_t *h, UART_Config_t *config) {
  // Configure baud rate, data bits, stop bits, parity
  return HAL_OK;
}

HAL_StatusTypeDef HAL_UART_Transmit(HAL_UART_Handle_t *h, uint8_t *data, uint16_t len) {
  // Transmit data
  return HAL_OK;
}

HAL_StatusTypeDef HAL_UART_Receive(HAL_UART_Handle_t *h, uint8_t *data, uint16_t len) {
  // Receive data
  return HAL_OK;
}`;
  }

  _generateSPI(mcu) {
    return `// SPI HAL Implementation
HAL_StatusTypeDef HAL_SPI_Init(HAL_SPI_Handle_t *h, SPI_Config_t *config) {
  // Configure mode, polarity, phase, bit order
  return HAL_OK;
}

HAL_StatusTypeDef HAL_SPI_Transfer(HAL_SPI_Handle_t *h, uint8_t *tx, uint8_t *rx, uint16_t len) {
  // Full-duplex transfer
  return HAL_OK;
}`;
  }

  _generateI2C(mcu) {
    return `// I2C HAL Implementation
HAL_StatusTypeDef HAL_I2C_Init(HAL_I2C_Handle_t *h, I2C_Config_t *config) {
  // Configure speed, addressing mode
  return HAL_OK;
}

HAL_StatusTypeDef HAL_I2C_Read(HAL_I2C_Handle_t *h, uint8_t addr, uint8_t *data, uint16_t len) {
  // Read from device
  return HAL_OK;
}

HAL_StatusTypeDef HAL_I2C_Write(HAL_I2C_Handle_t *h, uint8_t addr, uint8_t *data, uint16_t len) {
  // Write to device
  return HAL_OK;
}`;
  }

  _generateADC(mcu) {
    return `// ADC HAL Implementation
HAL_StatusTypeDef HAL_ADC_Init(HAL_ADC_Handle_t *h, ADC_Config_t *config) {
  // Configure resolution, sampling time, reference
  return HAL_OK;
}

uint16_t HAL_ADC_Read(HAL_ADC_Handle_t *h) {
  // Start conversion and read result
  return 0;
}`;
  }

  _generateConfig(options = {}) {
    return {
      optimization: options.optimization || "-O2",
      standard: options.standard || "c99",
      defines: ["USE_HAL_DRIVER", `STM32${options.series || "F1"}`]
    };
  }
}
