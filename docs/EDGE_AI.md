# 边缘 AI 部署 (TensorFlow Lite / NCNN)

## 🧠 功能概述

边缘 AI (Edge AI) 是将训练好的深度学习模型部署到资源受限的嵌入式设备上。本学习文档涵盖模型量化、优化及在 ARM MCU/DSP 上的部署实战。

## 📚 边缘 AI 框架对比

| 框架 | 厂商 | 支持硬件 | 模型格式 | 特点 |
|------|------|----------|----------|------|
| TensorFlow Lite | Google | ARM Cortex-M, DSP, MCU | .tflite | 生态完善，工具链成熟 |
| NCNN | Tencent | ARM CPU, GPU | .param/.bin | 轻量级，无第三方依赖 |
| ONNX Runtime | Microsoft | 多平台 | .onnx | 通用格式，多后端 |
| OpenVINO | Intel | Intel CPU/VPU/MGPU | OpenVINO IR | Intel 硬件优化 |
| TensorRT | NVIDIA | NVIDIA GPU | .engine | GPU 推理最快 |
| CMSIS-NN | ARM | Cortex-M | 自定义 | ARM 官方，极致优化 |

---

## 🔵 TensorFlow Lite Micro

### 1. TFLM 架构

```
┌─────────────────────────────────────────────────────┐
│         TensorFlow Lite Micro 架构                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │          TensorFlow (训练端)                 │   │
│  │  • 模型构建 (Keras/TF)                       │   │
│  │  • 模型训练                                  │   │
│  │  • 模型导出 (.h5/.pb)                        │   │
│  └──────────────────┬──────────────────────────┘   │
│                     │                               │
│                     ▼                               │
│  ┌─────────────────────────────────────────────┐   │
│  │         TFLite Converter (转换)              │   │
│  │  • 格式转换 (.h5 → .tflite)                 │   │
│  │  • 量化优化 (FP32 → INT8)                   │   │
│  │  • 算子选择/优化                             │   │
│  └──────────────────┬──────────────────────────┘   │
│                     │                               │
│                     ▼                               │
│  ┌─────────────────────────────────────────────┐   │
│  │      TFLite Micro (嵌入式推理)               │   │
│  │  • 模型加载 (.tflite → C 数组)               │   │
│  │  • 内存分配 (静态/arena)                     │   │
│  │  • 推理执行                                  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  资源需求：                                         │
│  • Flash: 100KB+ (模型 + 运行时)                    │
│  • SRAM: 10KB+ (张量缓冲区)                         │
│  • 内核：Cortex-M4/M7 推荐                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. 模型转换与量化

```python
# Python: 模型转换和量化
import tensorflow as tf

# 加载训练好的 Keras 模型
model = tf.keras.models.load_model('my_model.h5')

# 转换为 TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)

# 全整型量化 (INT8)
converter.optimizations = [tf.lite.Optimize.DEFAULT]

# 代表性数据集 (用于量化校准)
def representative_dataset():
    for i in range(100):
        # 输入数据归一化到 [0, 1]
        data = tf.random.normal([1, 224, 224, 3])
        yield [data]

converter.representative_dataset = representative_dataset
converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
converter.inference_input_type = tf.int8
converter.inference_output_type = tf.int8

# 转换并保存
tflite_model = converter.convert()
with open('model_quantized.tflite', 'wb') as f:
    f.write(tflite_model)

# 模型大小对比
import os
print(f"Original: {os.path.getsize('my_model.h5') / 1024:.1f} KB")
print(f"FP32: {os.path.getsize('model_float32.tflite') / 1024:.1f} KB")
print(f"INT8: {os.path.getsize('model_quantized.tflite') / 1024:.1f} KB")
```

### 3. 模型转换为 C 数组

```bash
# 使用 xxd 工具将 .tflite 转为 C 数组
xxd -i model_quantized.tflite > model_data.h

# 生成的 model_data.h 内容:
# const unsigned char model_quantized_tflite[] = {
#   0x1c, 0x00, 0x00, 0x00, 0x54, 0x46, 0x4c, 0x33, ...
# };
# const unsigned int model_quantized_tflite_len = 52480;
```

### 4. STM32 部署代码

```c
// STM32 + TFLM 推理示例
#include "tensorflow/lite/micro/micro_mutable_op_resolver.h"
#include "tensorflow/lite/micro/micro_interpreter.h"
#include "tensorflow/lite/micro/system_setup.h"
#include "tensorflow/lite/schema/schema_generated.h"

#include "model_data.h"  // 模型 C 数组

// 全局变量
namespace {
  const tflite::Model* model = nullptr;
  tflite::MicroInterpreter* interpreter = nullptr;
  TfLiteTensor* input = nullptr;
  TfLiteTensor* output = nullptr;
  
  // 张量 arena (模型工作内存)
  constexpr int kTensorArenaSize = 16 * 1024;  // 16KB
  uint8_t tensor_arena[kTensorArenaSize] __attribute__((aligned(16)));
}

// 初始化模型
void Model_Init(void) {
  // 加载模型
  model = tflite::GetModel(model_quantized_tflite);
  
  // 确保模型版本兼容
  if (model->version() != TFLITE_SCHEMA_VERSION) {
    Error_Handler();
  }
  
  // 注册算子
  static tflite::MicroMutableOpResolver<5> resolver;
  resolver.AddConv2D();
  resolver.AddDepthwiseConv2D();
  resolver.AddPool2D();
  resolver.AddFullyConnected();
  resolver.AddSoftmax();
  
  // 创建解释器
  static tflite::MicroInterpreter static_interpreter(
      model, resolver, tensor_arena, kTensorArenaSize);
  interpreter = &static_interpreter;
  
  // 分配张量
  TfLiteStatus allocate_status = interpreter->AllocateTensors();
  if (allocate_status != kTfLiteOk) {
    Error_Handler();
  }
  
  // 获取输入输出张量
  input = interpreter->input(0);
  output = interpreter->output(0);
}

// 运行推理
int Model_Invoke(uint8_t* input_data, uint8_t* output_data) {
  // 复制输入数据
  for (int i = 0; i < input->bytes; i++) {
    input->data.int8[i] = input_data[i];
  }
  
  // 推理
  TfLiteStatus invoke_status = interpreter->Invoke();
  if (invoke_status != kTfLiteOk) {
    return -1;
  }
  
  // 复制输出数据
  for (int i = 0; i < output->bytes; i++) {
    output_data[i] = output->data.int8[i];
  }
  
  return 0;
}

// 使用示例 (图像分类)
void ImageClassify(uint8_t* image) {
  uint8_t output[10];  // 10 分类
  int status = Model_Invoke(image, output);
  
  if (status == 0) {
    // 找到最大概率的类别
    int max_class = 0;
    int8_t max_prob = output[0];
    for (int i = 1; i < 10; i++) {
      if (output[i] > max_prob) {
        max_prob = output[i];
        max_class = i;
      }
    }
    
    // 反量化输出 (INT8 → 概率)
    float scale = output->params.scale;
    int zero_point = output->params.zero_point;
    float probability = scale * (max_prob - zero_point);
    
    printf("Class: %d, Probability: %.2f%%\n", max_class, probability * 100);
  }
}
```

### 5. 性能优化

```c
// 使用 CMSIS-NN 优化
#include "tensorflow/lite/micro/kernels/cmsis_nn/cmsis_nn.h"

// 在创建解释器前启用优化
TfLiteStatus InitCMSISNN() {
  // 设置 CMSIS-NN 优化
  tflite::SetMicroOpResolver(
      tflite::GetMicroOpResolverWithCMSISNN());
  return kTfLiteOk;
}

// 内存优化：使用外部 SDRAM
extern SDRAM_HandleTypeDef hsdram;
uint8_t* tensor_arena_sdram = (uint8_t*)0xC0000000;  // SDRAM 地址

// 性能对比 (Cortex-M7 @ 400MHz):
// 模型：MobileNetV1 (224x224 输入)
// 
// | 配置          | 推理时间 | 内存   |
// |---------------|----------|--------|
// | FP32, 无优化  | 850ms    | 320KB  |
// | INT8, 无优化  | 420ms    | 160KB  |
// | INT8, CMSIS-NN| 180ms    | 160KB  |
// | INT8, +SDRAM  | 180ms    | 外部   |
```

---

## 🟡 NCNN 部署

### 1. NCNN 特点

```
┌─────────────────────────────────────────────────────┐
│              NCNN 框架特点                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  优势：                                             │
│  • 无第三方依赖 (纯 C++ 实现)                         │
│  • 支持 ARM NEON 加速                                │
│  • 支持 Vulkan GPU 加速                              │
│  • 模型精简 (仅推理，无训练)                         │
│  • 量化支持 (FP16/INT8)                             │
│                                                     │
│  适用场景：                                         │
│  • ARM 开发板 (树莓派、Jetson)                       │
│  • Android/iOS 移动端                               │
│  • 高性能 MCU (H7, A 系列)                          │
│                                                     │
│  模型转换流程：                                     │
│  PyTorch/ONNX → ncnn2mem → 推理                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. 模型转换

```bash
# 1. 从 ONNX 转换
# 导出 ONNX 模型 (PyTorch)
# python: torch.onnx.export(model, dummy_input, "model.onnx")

# 使用 ncnn 工具转换
onnx2ncnn model.onnx model.param model.bin

# 2. 优化模型
ncnnoptimize model.param model.bin model_opt.param model_opt.bin 65536

# 3. 生成 C 头文件 (嵌入固件)
ncnn2mem model_opt.param model_opt.bin model.id.h model.mem.h
```

### 3. NCNN 推理代码

```cpp
// NCNN 推理示例 (C++)
#include "net.h"
#include "model.mem.h"  // 模型数据

class ImageClassifier {
private:
  ncnn::Net net;
  ncnn::Extractor ex;
  
public:
  int init() {
    // 从内存加载模型
    net.load_param_bin(PRODUCER_BIN_DATA);
    net.load_model(CONSUMER_BIN_DATA);
    
    // 创建提取器
    ex = net.create_extractor();
    ex.set_light_mode(true);    // 轻量模式
    ex.set_num_threads(4);      // 4 线程
    
    return 0;
  }
  
  int classify(uint8_t* image, float* probs, int num_classes) {
    // 准备输入 (224x224 RGB)
    ncnn::Mat in = ncnn::Mat::from_pixels(
        image, ncnn::Mat::PIXEL_RGB, 224, 224);
    
    // 归一化
    const float mean_vals[3] = {123.68f, 116.78f, 103.94f};
    const float norm_vals[3] = {1/255.0f, 1/255.0f, 1/255.0f};
    in.substract_mean_normalize(mean_vals, norm_vals);
    
    // 输入
    ex.input("input", in);
    
    // 输出
    ncnn::Mat out;
    ex.extract("output", out);
    
    // 获取概率
    for (int i = 0; i < num_classes; i++) {
      probs[i] = out[i];
    }
    
    return 0;
  }
};

// 使用示例
ImageClassifier classifier;
classifier.init();

uint8_t image[224 * 224 * 3];
float probs[10];
camera_capture(image);  // 摄像头采集
classifier.classify(image, probs, 10);

// 找到最大概率
int max_idx = 0;
float max_prob = probs[0];
for (int i = 1; i < 10; i++) {
  if (probs[i] > max_prob) {
    max_prob = probs[i];
    max_idx = i;
  }
}
printf("Result: %d (%.2f%%)\n", max_idx, max_prob * 100);
```

---

## 📊 模型优化技术

### 1. 量化对比

```
┌─────────────────────────────────────────────────────┐
│              量化类型对比                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  训练后量化 (Post-Training Quantization)            │
│  ┌─────────────────────────────────────────────┐   │
│  │  • 无需重新训练                              │   │
│  │  • 使用代表性数据集校准                      │   │
│  │  • 精度损失 1-3%                             │   │
│  │  • 压缩比 4:1 (FP32→INT8)                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  量化感知训练 (Quantization-Aware Training)         │
│  ┌─────────────────────────────────────────────┐   │
│  │  • 训练时模拟量化效应                        │   │
│  │  • 模型适应量化噪声                          │   │
│  │  • 精度损失 <1%                              │   │
│  │  • 需要重新训练                              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  动态范围量化 (Dynamic Range Quantization)          │
│  ┌─────────────────────────────────────────────┐   │
│  │  • 权重 INT8，激活 FP16                      │   │
│  │  • 自动计算缩放因子                          │   │
│  │  • 精度损失 <0.5%                            │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. 模型剪枝

```python
# TensorFlow 模型剪枝
import tensorflow_model_optimization as tfmot

# 定义剪枝计划
pruning_params = tfmot.sparsity.keras.PruningParams
pruning_schedule = tfmot.sparsity.keras.PolynomialDecay(
    initial_sparsity=0.0,
    final_sparsity=0.5,  # 剪掉 50% 权重
    begin_step=0,
    end_step=1000
)

# 应用剪枝
model = tf.keras.models.load_model('original.h5')
model_for_pruning = tfmot.sparsity.keras.prune_low_magnitude(
    model,
    pruning_schedule=pruning_schedule
)

# 重新训练
model_for_pruning.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
model_for_pruning.fit(train_data, epochs=10)

# 导出剪枝后模型
model_pruned = tfmot.sparsity.keras.strip_pruning(model_for_pruning)
model_pruned.save('pruned.h5')
```

### 3. 知识蒸馏

```
┌─────────────────────────────────────────────────────┐
│              知识蒸馏流程                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐         ┌─────────────┐          │
│  │  教师模型   │         │  学生模型   │          │
│  │  (大/精确)  │         │  (小/快速)  │          │
│  │             │         │             │          │
│  │  ResNet50   │         │ MobileNetV2 │          │
│  │  100MB      │         │  10MB       │          │
│  └──────┬──────┘         └──────┬──────┘          │
│         │                       │                  │
│         │  Soft Targets         │                  │
│         │  (温度缩放)           │                  │
│         └──────────────────────→│                  │
│                                 │                  │
│  损失函数：                     │                  │
│  L = α·L_hard + (1-α)·L_distill │                  │
│                                 │                  │
│  L_hard: 真实标签的交叉熵        │                  │
│  L_distill: 教师输出的 KL 散度     │                  │
│  α: 平衡系数 (0.5 典型)           │                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📊 性能基准

### Cortex-M 系列性能 (MobileNetV1, 224x224)

| MCU | 内核 | 频率 | TFLM (INT8) | NCNN (FP16) |
|-----|------|------|-------------|-------------|
| STM32F4 | M4 | 168MHz | 2.5s | N/A |
| STM32F7 | M7 | 216MHz | 1.2s | N/A |
| STM32H7 | M7 | 400MHz | 0.45s | N/A |
| i.MX RT1170 | M7 | 1GHz | 0.18s | 0.12s |

### ARM 开发板性能 (YOLOv5s, 640x640)

| 平台 | CPU | TFLM | NCNN | TensorRT |
|------|-----|------|------|----------|
| 树莓派 4B | A72 4核 | 1.2s | 0.8s | N/A |
| Jetson Nano | A57 4核 | 0.6s | 0.4s | 0.15s |
| Jetson Orin | A78AE 8 核 | 0.15s | 0.1s | 0.03s |

---

## 📊 学习检查清单

- [ ] 理解边缘 AI 框架选型
- [ ] 掌握 TFLite 模型转换
- [ ] 理解量化原理 (FP32→INT8)
- [ ] 能够在 STM32 上部署 TFLM
- [ ] 了解 NCNN 框架使用
- [ ] 掌握模型优化技术 (剪枝/蒸馏)
- [ ] 完成一个边缘 AI 部署项目

---

*最后更新：2026 年 3 月 4 日*
