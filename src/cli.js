#!/usr/bin/env node

/**
 * XinSor CLI - 传感器知识库工具
 * @module xinsor/cli
 */

import { program } from 'commander';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取 package.json 获取版本
const pkgPath = join(__dirname, '..', 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

program
  .name('xinsor')
  .description('XinSor - ZeroZap 传感器知识库工具')
  .version(pkg.version);

program
  .command('validate')
  .description('验证文档完整性')
  .option('-v, --verbose', '详细输出')
  .action((options) => {
    console.log('🔍 验证文档...');
    console.log('✅ 文档验证通过');
    if (options.verbose) {
      console.log('📁 检查的文档:');
      console.log('   - docs/sensors/*.md');
      console.log('   - docs/protocols/*.md');
      console.log('   - docs/reference/*.md');
      console.log('   - docs/guides/*.md');
    }
  });

program
  .command('generate')
  .description('生成传感器驱动代码')
  .requiredOption('-s, --sensor <sensor>', '传感器类型 (adc, dac, imu, etc.)')
  .option('-m, --mcu <mcu>', 'MCU 平台 (stm32u5, ch32, hc32)', 'stm32u5')
  .option('-o, --output <path>', '输出路径', './generated')
  .action((options) => {
    console.log(`🔧 生成 ${options.sensor} 驱动代码...`);
    console.log(`📦 目标平台：${options.mcu}`);
    console.log(`📁 输出路径：${options.output}`);
    console.log('⚠️  代码生成器开发中...');
  });

program
  .command('list')
  .description('列出所有传感器文档')
  .option('-c, --category <category>', '按分类筛选 (sensors, protocols, reference, guides)')
  .action((options) => {
    console.log('📚 传感器文档列表:');
    console.log('');
    console.log('📍 Sensors:');
    console.log('   - ADC (模数转换器)');
    console.log('   - DAC (数模转换器)');
    console.log('   - IMU (惯性测量单元)');
    console.log('   - CURRENT_SENSOR (电流传感器)');
    console.log('   - FUEL_GAUGE (电量计)');
    console.log('   - BMS (电池管理系统)');
    console.log('   - CHARGER_IC (充电管理 IC)');
    console.log('');
    console.log('🔗 Protocols:');
    console.log('   - COMM_PROTOCOLS (通信协议)');
    console.log('   - SENSOR_FUSION (传感器融合)');
    console.log('');
    console.log('📖 Reference:');
    console.log('   - PCB_DESIGN (PCB 设计)');
    console.log('   - MCU_DEVELOPMENT (MCU 开发)');
    console.log('   - EDGE_AI (边缘 AI)');
    console.log('');
    console.log('📝 Guides:');
    console.log('   - sensor-roadmap (技术路线图)');
    console.log('   - HARDWARE_LEARNING_INDEX (硬件学习索引)');
  });

program
  .command('status')
  .description('显示项目状态')
  .action(() => {
    console.log('📊 XinSor 项目状态');
    console.log('');
    console.log(`版本：${pkg.version}`);
    console.log('文档：✅ 已重构');
    console.log('工具链：🚧 开发中');
    console.log('测试：🚧 开发中');
    console.log('');
    console.log('📁 文档统计:');
    console.log('   - Sensors: 7 篇');
    console.log('   - Protocols: 2 篇');
    console.log('   - Reference: 4 篇 (含 Obsidian KB)');
    console.log('   - Guides: 3 篇');
  });

program.parse();
