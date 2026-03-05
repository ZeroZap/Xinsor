# MCU 开发实战 (STM32/CH32)

## 🧠 功能概述

微控制器 (MCU) 是嵌入式系统的核心。本学习文档聚焦于 ARM Cortex-M 内核的 STM32 系列和 RISC-V 内核的 CH32 系列，涵盖 GPIO、中断、定时器、DMA、ADC 等核心外设的开发实战。

## 📚 MCU 选型对比

### STM32 系列 (ARM Cortex-M)

| 系列 | 内核 | 频率 | Flash | SRAM | 应用 |
|------|------|------|-------|------|------|
| STM32F0 | Cortex-M0 | 48MHz | 16-256KB | 4-32KB | 入门/低成本 |
| STM32F1 | Cortex-M3 | 72MHz | 16-512KB | 6-64KB | 通用 (最经典) |
| STM32F4 | Cortex-M4 | 84-180MHz | 64KB-2MB | 16-512KB | DSP/浮点运算 |
| STM32G0 | Cortex-M0+ | 64MHz | 16-512KB | 8-64KB | 低功耗 |
| STM32G4 | Cortex-M4 | 170MHz | 32-512KB | 16-128KB | 混合信号 |
| STM32H7 | Cortex-M7 | 400-550MHz | 128KB-2MB | 128KB-1MB | 高性能 |

### CH32 系列 (RISC-V)

| 系列 | 内核 | 频率 | Flash | SRAM | 应用 |
|------|------|------|-------|------|------|
| CH32V103 | V2F (M3 兼容) | 72MHz | 16-64KB | 6-20KB | STM32F1 替代 |
| CH32V203 | V2F (M3 兼容) | 96MHz | 32-256KB | 12-48KB | 通用 |
| CH32V307 | V4F (M4 兼容) | 100MHz | 64-512KB | 32-64KB | 高性能 |
| CH32X035 | V2F | 48MHz | 16-32KB | 6-10KB | 低成本 |

---

## 🔌 GPIO 开发

### 1. GPIO 工作模式

```
┌─────────────────────────────────────────────────────┐
│              STM32 GPIO 八种模式                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  输出模式：                                         │
│  ┌──────────────┐  ┌──────────────┐                │
│  │ 推挽输出     │  │ 开漏输出     │                │
│  │ (Push-Pull)  │  │ (Open-Drain) │                │
│  │              │  │              │                │
│  │  0 → GND     │  │  0 → GND     │                │
│  │  1 → VDD     │  │  1 → 高阻    │                │
│  │              │  │  需上拉电阻   │                │
│  └──────────────┘  └──────────────┘                │
│                                                     │
│  输入模式：                                         │
│  ┌──────────────┐  ┌──────────────┐                │
│  │ 浮空输入     │  │ 上拉/下拉输入│                │
│  │ (Floating)   │  │ (Pull-Up/Down)│               │
│  │  高阻抗      │  │  固定电平    │                │
│  │  检测外部信号 │  │  按键检测    │                │
│  └──────────────┘  └──────────────┘                │
│                                                     │
│  复用功能：                                         │
│  • 复用推挽：UART_TX, SPI_MOSI, TIM_PWM            │
│  • 复用开漏：I2C_SDA, I2C_SCL                      │
│                                                     │
│  模拟功能：                                         │
│  • 模拟输入：ADC 采集                               │
│  • 模拟输出：DAC 输出                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. STM32 HAL GPIO 代码

```c
#include "stm32f1xx_hal.h"

// GPIO 初始化
void GPIO_Init(void) {
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  
  // 使能 GPIO 时钟
  __HAL_RCC_GPIOA_CLK_ENABLE();
  __HAL_RCC_GPIOB_CLK_ENABLE();
  
  // LED 引脚 (推挽输出)
  GPIO_InitStruct.Pin = GPIO_PIN_5;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
  
  // 按键引脚 (上拉输入)
  GPIO_InitStruct.Pin = GPIO_PIN_0;
  GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
  GPIO_InitStruct.Pull = GPIO_PULLUP;
  HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);
  
  // 复用推挽输出 (UART_TX)
  GPIO_InitStruct.Pin = GPIO_PIN_2;
  GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_HIGH;
  HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
}

// LED 控制
#define LED_ON()  HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET)
#define LED_OFF() HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_RESET)
#define LED_TOGGLE() HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5)

// 按键读取
uint8_t Button_Read(void) {
  return HAL_GPIO_ReadPin(GPIOB, GPIO_PIN_0) == GPIO_PIN_RESET;
}

// 按键扫描 (带消抖)
uint8_t Button_Scan(void) {
  static uint8_t last_state = 1;
  static uint32_t last_time = 0;
  uint8_t current = Button_Read();
  uint32_t now = HAL_GetTick();
  
  if (current != last_state) {
    last_time = now;
    last_state = current;
  }
  
  if (now - last_time > 50) {  // 50ms 消抖
    if (current == 0) return 1;  // 按下
  }
  return 0;
}
```

### 3. CH32 标准库 GPIO 代码

```c
#include "ch32v10x.h"

void GPIO_Init(void) {
  GPIO_InitTypeDef GPIO_InitStructure;
  
  // 使能时钟
  RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA | 
                         RCC_APB2Periph_GPIOB, ENABLE);
  
  // LED (推挽输出，50MHz)
  GPIO_InitStructure.GPIO_Pin = GPIO_Pin_5;
  GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;
  GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
  GPIO_Init(GPIOA, &GPIO_InitStructure);
  
  // 按键 (浮空输入)
  GPIO_InitStructure.GPIO_Pin = GPIO_Pin_0;
  GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IN_FLOATING;
  GPIO_Init(GPIOB, &GPIO_InitStructure);
}

// 位操作 (原子操作)
#define LED_ON()  GPIOA->BSHR = GPIO_Pin_5
#define LED_OFF() GPIOA->BCR = GPIO_Pin_5
#define LED_STATE() (GPIOA->INDR & GPIO_Pin_5)
```

---

## ⚡ 中断系统

### 1. NVIC 中断控制器

```
┌─────────────────────────────────────────────────────┐
│         Cortex-M3 NVIC 中断优先级结构                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  优先级寄存器 (8 位):                                │
│  ┌─────────┬─────────┐                              │
│  │ 抢占优先级│ 响应优先级│                             │
│  │(Preempt)│ (Sub)   │                              │
│  │  4 bits │  4 bits │                              │
│  └─────────┴─────────┘                              │
│                                                     │
│  优先级分组 (SCB->AIRCR):                           │
│  Group 0: 0 位抢占，4 位响应 (0-15 级)                │
│  Group 1: 1 位抢占，3 位响应 (0-1, 每级 0-7)          │
│  Group 2: 2 位抢占，2 位响应 (0-3, 每级 0-3)          │
│  Group 3: 3 位抢占，1 位响应 (0-7, 每级 0-1)          │
│  Group 4: 4 位抢占，0 位响应 (0-15 级)                │
│                                                     │
│  中断优先级:                                        │
│  • 数值越小，优先级越高                              │
│  • 抢占优先级可打断低优先级中断                      │
│  • 响应优先级不可打断，用于同级仲裁                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. 外部中断配置

```c
// STM32 HAL 外部中断
void EXTI_Init(void) {
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  
  // 使能时钟
  __HAL_RCC_GPIOA_CLK_ENABLE();
  __HAL_RCC_AFIO_CLK_ENABLE();
  
  // 按键引脚
  GPIO_InitStruct.Pin = GPIO_PIN_0;
  GPIO_InitStruct.Mode = GPIO_MODE_IT_FALLING;
  GPIO_InitStruct.Pull = GPIO_PULLUP;
  HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
  
  // 配置 NVIC
  HAL_NVIC_SetPriority(EXTI0_IRQn, 1, 0);
  HAL_NVIC_EnableIRQ(EXTI0_IRQn);
}

// 中断服务函数
void EXTI0_IRQHandler(void) {
  HAL_GPIO_EXTI_IRQHandler(GPIO_PIN_0);
}

// 回调函数
void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin) {
  if (GPIO_Pin == GPIO_PIN_0) {
    // 处理按键中断
    LED_TOGGLE();
  }
}
```

### 3. CH32 中断配置

```c
// CH32 外部中断
void EXTI_Init(void) {
  EXTI_InitTypeDef EXTI_InitStructure;
  NVIC_InitTypeDef NVIC_InitStructure;
  
  // 配置 PA0 为中断源
  GPIO_EXTILineConfig(GPIO_PortSourceGPIOA, GPIO_PinSource0);
  
  EXTI_InitStructure.EXTI_Line = EXTI_Line0;
  EXTI_InitStructure.EXTI_Mode = EXTI_Mode_Interrupt;
  EXTI_InitStructure.EXTI_Trigger = EXTI_Trigger_Falling;
  EXTI_InitStructure.EXTI_LineCmd = ENABLE;
  EXTI_Init(&EXTI_InitStructure);
  
  // NVIC 配置
  NVIC_InitStructure.NVIC_IRQChannel = EXTI0_IRQn;
  NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 1;
  NVIC_InitStructure.NVIC_IRQChannelSubPriority = 0;
  NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE;
  NVIC_Init(&NVIC_InitStructure);
}

// 中断服务函数
void EXTI0_IRQHandler(void) __attribute__((interrupt));
void EXTI0_IRQHandler(void) {
  if (EXTI_GetITStatus(EXTI_Line0) != RESET) {
    LED_TOGGLE();
    EXTI_ClearITPendingBit(EXTI_Line0);
  }
}
```

---

## ⏱️ 定时器系统

### 1. 定时器类型

```
┌─────────────────────────────────────────────────────┐
│         STM32 定时器类型                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  高级定时器 (TIM1, TIM8):                           │
│  • 16 位计数，72MHz                                  │
│  • 互补 PWM 输出，死区控制                            │
│  • 紧急刹车功能                                      │
│  应用：电机控制，数字电源                            │
│                                                     │
│  通用定时器 (TIM2-TIM5):                            │
│  • 16/32 位计数，72MHz                               │
│  • 4 路输入捕获/输出比较                            │
│  • 单脉冲模式                                        │
│  应用：PWM 生成，输入捕获，定时中断                   │
│                                                     │
│  基本定时器 (TIM6, TIM7):                           │
│  • 16 位计数                                         │
│  • 仅基本定时功能                                    │
│  应用：DAC 触发，简单定时                            │
│                                                     │
│  系统定时器 (SysTick):                              │
│  • 24 位递减计数器                                   │
│  • 与内核频率相同                                    │
│  应用：RTOS 时基，延时函数                           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. PWM 输出代码

```c
// STM32 HAL PWM 输出
TIM_HandleTypeDef htim2;
TIM_OC_InitTypeDef sConfigOC;

void PWM_Init(void) {
  // 定时器基础配置
  htim2.Instance = TIM2;
  htim2.Init.Prescaler = 71;  // 72MHz / 72 = 1MHz
  htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
  htim2.Init.Period = 999;    // 1MHz / 1000 = 1kHz PWM 频率
  htim2.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
  HAL_TIM_PWM_Init(&htim2);
  
  // PWM 通道配置
  sConfigOC.OCMode = TIM_OCMODE_PWM1;
  sConfigOC.Pulse = 500;      // 50% 占空比
  sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
  sConfigOC.OCFastMode = TIM_OCFAST_DISABLE;
  HAL_TIM_PWM_ConfigChannel(&htim2, &sConfigOC, TIM_CHANNEL_1);
}

// 启动 PWM
HAL_TIM_PWM_Start(&htim2, TIM_CHANNEL_1);

// 修改占空比
__HAL_TIM_SET_COMPARE(&htim2, TIM_CHANNEL_1, 250);  // 25%
__HAL_TIM_SET_COMPARE(&htim2, TIM_CHANNEL_1, 750);  // 75%

// 电机控制应用
void Motor_SetSpeed(float speed) {
  // speed: -1.0 ~ 1.0
  uint16_t duty;
  if (speed >= 0) {
    duty = 500 + (uint16_t)(speed * 500);
    HAL_GPIO_WritePin(DIR_GPIO, DIR_PIN, GPIO_PIN_RESET);
  } else {
    duty = 500 + (uint16_t)(speed * 500);
    HAL_GPIO_WritePin(DIR_GPIO, DIR_PIN, GPIO_PIN_SET);
  }
  __HAL_TIM_SET_COMPARE(&htim2, TIM_CHANNEL_1, duty);
}
```

### 3. 输入捕获 (测量频率/脉宽)

```c
TIM_HandleTypeDef htim3;
uint32_t captured_value = 0;

void InputCapture_Init(void) {
  htim3.Instance = TIM3;
  htim3.Init.Prescaler = 71;
  htim3.Init.CounterMode = TIM_COUNTERMODE_UP;
  htim3.Init.Period = 0xFFFF;
  HAL_TIM_IC_Init(&htim3);
  
  TIM_IC_InitTypeDef sConfigIC = {0};
  sConfigIC.ICPolarity = TIM_INPUTCHANNELPOLARITY_RISING;
  sConfigIC.ICSelection = TIM_ICSELECTION_DIRECTTI;
  sConfigIC.ICPrescaler = TIM_ICPSC_DIV1;
  sConfigIC.ICFilter = 0;
  HAL_TIM_IC_ConfigChannel(&htim3, &sConfigIC, TIM_CHANNEL_1);
  
  HAL_TIM_IC_Start_IT(&htim3, TIM_CHANNEL_1);
}

void HAL_TIM_IC_CaptureCallback(TIM_HandleTypeDef *htim) {
  if (htim->Instance == TIM3) {
    captured_value = HAL_TIM_ReadCapturedValue(htim, TIM_CHANNEL_1);
    // 计算频率：freq = 1MHz / captured_value
  }
}
```

---

## 🔄 DMA (直接存储器访问)

### 1. DMA 工作原理

```
┌─────────────────────────────────────────────────────┐
│              DMA 传输模式                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  不使用 DMA:                                        │
│  CPU → 读取外设 → 写入内存 → 处理数据               │
│  (CPU 被占用，效率低)                                │
│                                                     │
│  使用 DMA:                                          │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐        │
│  │  外设   │───→│   DMA   │───→│  内存   │        │
│  │ (UART)  │    │ 控制器  │    │ (Buffer)│        │
│  └─────────┘    └─────────┘    └─────────┘        │
│                    │                                │
│                    ▼                                │
│              CPU 继续执行其他任务                    │
│              DMA 完成后中断通知 CPU                  │
│                                                     │
│  传输模式：                                         │
│  • 普通模式：单次传输                               │
│  • 循环模式：循环缓冲 (ADC/音频)                     │
│  • 内存到内存：快速拷贝                             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. DMA + UART 接收

```c
UART_HandleTypeDef huart1;
DMA_HandleTypeDef hdma_usart1_rx;
uint8_t rx_buffer[256];

void UART_DMA_Init(void) {
  // DMA 配置
  hdma_usart1_rx.Instance = DMA1_Channel5;
  hdma_usart1_rx.Init.Direction = DMA_PERIPH_TO_MEMORY;
  hdma_usart1_rx.Init.PeriphInc = DMA_PINC_DISABLE;
  hdma_usart1_rx.Init.MemInc = DMA_MINC_ENABLE;
  hdma_usart1_rx.Init.PeriphDataAlignment = DMA_PDATAALIGN_BYTE;
  hdma_usart1_rx.Init.MemDataAlignment = DMA_MDATAALIGN_BYTE;
  hdma_usart1_rx.Init.Mode = DMA_CIRCULAR;  // 循环模式
  hdma_usart1_rx.Init.Priority = DMA_PRIORITY_HIGH;
  HAL_DMA_Init(&hdma_usart1_rx);
  
  __HAL_LINKDMA(&huart1, hdmarx, hdma_usart1_rx);
  
  // 启动 DMA 接收
  HAL_UART_Receive_DMA(&huart1, rx_buffer, 256);
}

// DMA 接收完成回调
void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart) {
  if (huart->Instance == USART1) {
    // 处理接收到的数据
    ProcessData(rx_buffer, 256);
    // 重新启动 DMA (循环模式会自动重启)
  }
}
```

### 3. DMA + ADC 多通道采集

```c
ADC_HandleTypeDef hadc1;
DMA_HandleTypeDef hdma_adc1;
uint32_t adc_buffer[4];  // 4 通道

void ADC_DMA_Init(void) {
  // ADC 配置
  hadc1.Instance = ADC1;
  hadc1.Init.ScanConvMode = ADC_SCAN_ENABLE;
  hadc1.Init.ContinuousConvMode = ENABLE;
  hadc1.Init.ExternalTrigConv = ADC_SOFTWARE_START;
  hadc1.Init.DataAlign = ADC_DATAALIGN_RIGHT;
  hadc1.Init.NbrOfConversion = 4;
  HAL_ADC_Init(&hadc1);
  
  // 配置通道
  ADC_ChannelConfTypeDef sConfig = {0};
  sConfig.SamplingTime = ADC_SAMPLETIME_55CYCLES;
  
  sConfig.Channel = ADC_CHANNEL_0;
  HAL_ADC_ConfigChannel(&hadc1, &sConfig);
  sConfig.Channel = ADC_CHANNEL_1;
  HAL_ADC_ConfigChannel(&hadc1, &sConfig);
  sConfig.Channel = ADC_CHANNEL_2;
  HAL_ADC_ConfigChannel(&hadc1, &sConfig);
  sConfig.Channel = ADC_CHANNEL_3;
  HAL_ADC_ConfigChannel(&hadc1, &sConfig);
  
  // DMA 配置
  hdma_adc1.Instance = DMA1_Channel1;
  hdma_adc1.Init.Direction = DMA_PERIPH_TO_MEMORY;
  hdma_adc1.Init.Mode = DMA_CIRCULAR;
  hdma_adc1.Init.PeriphDataAlignment = DMA_PDATAALIGN_WORD;
  hdma_adc1.Init.MemDataAlignment = DMA_MDATAALIGN_WORD;
  HAL_DMA_Init(&hdma_adc1);
  
  __HAL_LINKDMA(&hadc1, DMA_Handle, hdma_adc1);
  
  // 启动 ADC+DMA
  HAL_ADC_Start_DMA(&hadc1, adc_buffer, 4);
}

// 读取 ADC 值 (单位：mV, 假设 3.3V 参考)
uint32_t GetADC_mV(uint8_t channel) {
  return (adc_buffer[channel] * 3300) / 4095;
}
```

---

## 📊 ADC 采集实战

### 多通道 DMA 采集完整示例

```c
// 主程序
#include "main.h"

#define ADC_CHANNELS 4
#define BUFFER_SIZE  100

ADC_HandleTypeDef hadc1;
DMA_HandleTypeDef hdma_adc1;
uint32_t adc_raw[ADC_CHANNELS][BUFFER_SIZE];
float adc_filtered[ADC_CHANNELS];

// 滑动平均滤波
void ADC_Filter(void) {
  for (int ch = 0; ch < ADC_CHANNELS; ch++) {
    uint32_t sum = 0;
    for (int i = 0; i < BUFFER_SIZE; i++) {
      sum += adc_raw[ch][i];
    }
    adc_filtered[ch] = (float)sum / BUFFER_SIZE;
  }
}

int main(void) {
  HAL_Init();
  SystemClock_Config();
  ADC_DMA_Init();
  
  while (1) {
    ADC_Filter();
    
    // 处理数据
    float voltage = adc_filtered[0] * 3.3f / 4095.0f;
    float temperature = (voltage - 0.5f) * 100.0f;  // LM35
    
    printf("CH0: %.3fV, Temp: %.1fC\n", voltage, temperature);
    HAL_Delay(100);
  }
}
```

---

## 📊 学习检查清单

### GPIO
- [ ] 理解 8 种 GPIO 模式
- [ ] 能够配置推挽/开漏输出
- [ ] 能够配置上拉/下拉输入
- [ ] 掌握按键消抖方法

### 中断
- [ ] 理解 NVIC 优先级分组
- [ ] 能够配置外部中断
- [ ] 掌握中断嵌套原理
- [ ] 理解中断延迟优化

### 定时器
- [ ] 理解三种定时器类型
- [ ] 能够生成 PWM 波形
- [ ] 能够使用输入捕获
- [ ] 掌握编码器接口

### DMA
- [ ] 理解 DMA 工作原理
- [ ] 能够配置 UART+DMA
- [ ] 能够配置 ADC+DMA
- [ ] 理解循环/普通模式

---

*最后更新：2026 年 3 月 4 日*
