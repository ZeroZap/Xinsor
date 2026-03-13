# Xinsor 重构说明 (2026-03-13)

## 🎯 重构目标
将 Xinsor 从 Discord Bot 项目重构为 **ZeroZap 传感器知识库 + 工具链**

## 📐 目录结构变更

### 变更前
```
Xinsor/
├── src/              # Discord Bot 代码 (agents, skills, tasks...)
├── xinsor/           # Obsidian 知识库 (重复内容)
├── docs/             # 传感器文档 (扁平结构)
├── scripts/          # 迁移脚本
├── *.bat             # Windows 启动脚本
└── start.sh          # Linux 启动脚本
```

### 变更后
```
Xinsor/
├── docs/
│   ├── sensors/      # 传感器文档 (ADC, DAC, IMU, BMS...)
│   ├── protocols/    # 通信协议 (I2C, SPI, SENSOR_FUSION...)
│   ├── reference/    # 参考设计 (PCB, MCU, Edge AI, Obsidian KB)
│   └── guides/       # 开发指南 (Roadmap, Learning...)
├── tools/            # 工具脚本
├── src/              # 工具库 (待开发)
├── templates/        # 模板
├── tests/            # 测试
└── .github/          # CI/CD
```

## 🗑️ 移除内容
- ❌ Discord Bot 相关代码 (`src/agents/`, `src/skills/`, `src/tasks/`)
- ❌ Windows 批处理文件 (`*.bat`)
- ❌ Discord 配置 (`.env.example`)
- ❌ 启动脚本 (`start.sh`, `stop.sh`)

## 📦 保留内容
- ✅ 传感器文档 (迁移至 `docs/sensors/`)
- ✅ 协议文档 (迁移至 `docs/protocols/`)
- ✅ 参考设计 (迁移至 `docs/reference/`)
- ✅ 开发指南 (迁移至 `docs/guides/`)
- ✅ Obsidian 知识库 (归档至 `docs/reference/obsidian-kb/`)
- ✅ 迁移工具 (`scripts/`)

## 🔄 迁移脚本
```bash
# 运行迁移工具
python scripts/migrate_nutstore_links.py
# 或
./scripts/migrate-nutstore-links.sh
```

## 📝 下一步
1. [ ] 更新 README.md
2. [ ] 添加 TypeScript 支持
3. [ ] 配置 ESLint + Prettier
4. [ ] 添加单元测试框架
5. [ ] 配置 GitHub Actions CI/CD
6. [ ] 开发文档解析工具
7. [ ] 开发代码生成器

---
**重构日期**: 2026-03-13  
**重构者**: Zero ⚡  
**分支**: `restructure-2026-03-13`
