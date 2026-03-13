#!/usr/bin/env node

/**
 * 文档验证工具
 * 检查 Markdown 文档的完整性和一致性
 */

import { readdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const DOCS_ROOT = './docs';

const requiredCategories = ['sensors', 'protocols', 'reference', 'guides'];

const requiredDocs = {
  sensors: [
    'ADC.md',
    'DAC.md',
    'IMU.md',
    'CURRENT_SENSOR.md',
    'FUEL_GAUGE.md',
    'BMS.md',
    'CHARGER_IC.md'
  ],
  protocols: [
    'COMM_PROTOCOLS.md',
    'SENSOR_FUSION.md'
  ],
  reference: [
    'PCB_DESIGN.md',
    'MCU_DEVELOPMENT.md',
    'EDGE_AI.md'
  ],
  guides: [
    'sensor-roadmap.md',
    'HARDWARE_LEARNING_INDEX.md'
  ]
};

function validateCategory(category) {
  const categoryPath = join(DOCS_ROOT, category);
  
  if (!existsSync(categoryPath)) {
    console.error(`❌ 缺失分类目录：${category}`);
    return false;
  }
  
  const files = readdirSync(categoryPath);
  let valid = true;
  
  if (requiredDocs[category]) {
    for (const required of requiredDocs[category]) {
      if (!files.includes(required)) {
        console.error(`❌ 缺失文档：${category}/${required}`);
        valid = false;
      }
    }
  }
  
  if (valid) {
    console.log(`✅ ${category}: ${files.length} 个文档`);
  }
  
  return valid;
}

function validateLinks(content, filePath) {
  const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
  const links = [...content.matchAll(linkRegex)];
  const brokenLinks = [];
  
  for (const [, text, url] of links) {
    if (url.startsWith('http')) continue; // 跳过外部链接
    
    if (url.startsWith('./') || url.startsWith('../')) {
      const linkPath = join(filePath, '..', url);
      if (!existsSync(linkPath)) {
        brokenLinks.push(url);
      }
    }
  }
  
  return brokenLinks;
}

function main() {
  console.log('🔍 验证文档完整性...\n');
  
  let allValid = true;
  
  for (const category of requiredCategories) {
    if (!validateCategory(category)) {
      allValid = false;
    }
  }
  
  console.log('\n🔍 检查文档内容...');
  
  // 检查文档内容质量
  let totalDocs = 0;
  let totalSize = 0;
  
  for (const category of requiredCategories) {
    const categoryPath = join(DOCS_ROOT, category);
    if (existsSync(categoryPath)) {
      const files = readdirSync(categoryPath).filter(f => f.endsWith('.md'));
      for (const file of files) {
        const filePath = join(categoryPath, file);
        const content = readFileSync(filePath, 'utf-8');
        totalDocs++;
        totalSize += content.length;
        
        // 检查是否有标题
        if (!content.startsWith('#')) {
          console.warn(`⚠️  文档缺少标题：${category}/${file}`);
        }
      }
    }
  }
  
  console.log(`\n📊 统计:`);
  console.log(`   总文档数：${totalDocs}`);
  console.log(`   总大小：${(totalSize / 1024).toFixed(2)} KB`);
  
  if (allValid) {
    console.log('\n✅ 文档验证通过');
    process.exit(0);
  } else {
    console.log('\n❌ 文档验证失败');
    process.exit(1);
  }
}

main();
