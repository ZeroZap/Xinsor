# 📍 XinSor (芯感) - ZeroZap 传感器知识库

> **Obsidian Vault - 电子工程师 (EE) 专用知识库**

[![Obsidian](https://img.shields.io/badge/Obsidian-v1.5+-7c3aed?style=flat&logo=obsidian)](https://obsidian.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📚 关于本知识库

XinSor 是 ZeroZap 组织的传感器知识库，使用 **Obsidian** 构建，专为电子工程师设计。

### 🎯 用途
- 传感器技术文档和选型指南
- 驱动开发规范和模板
- 硬件调试手册和参考设计
- 与 XinYi 嵌入式框架的集成文档

---

## 📁 知识库结构

```
Xinsor/
├── 00-Inbox/                    # 临时笔记和待处理内容
├── 10-Sensors/                  # 传感器分类文档
│   ├── Temperature/            # 温湿度传感器
│   ├── Optical/                # 光学传感器
│   ├── IMU/                    # IMU/GSensor
│   ├── Pressure/               # 压力传感器
│   └── Gas/                    # 气体传感器
├── 20-Reference-Designs/        # 参考设计
│   ├── 驱动模板/               # 驱动开发模板
│   ├── 典型电路/               # 典型电路设计
│   └── 调试笔记/               # 调试技巧汇总
├── 30-Integration/              # XinYi 集成文档
├── 40-Datasheets/              # 数据手册
├── 99-Archives/                # 历史归档
├── 99-Templates/               # 文档模板
├── .obsidian/                  # Obsidian 配置
├── 📍XinSor 传感器知识库.md    # 🏠 知识库首页
├── 传感器选型总则.md
├── 驱动开发规范.md
└── 硬件调试手册.md
```

---

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/ZeroZap/Xinsor.git
cd Xinsor
```

### 2. 用 Obsidian 打开

1. 下载并安装 [Obsidian](https://obsidian.md/download)
2. 打开 Obsidian
3. 点击 "Open folder as vault"
4. 选择 `Xinsor` 文件夹

### 3. 推荐插件

#### 核心插件 (已启用)
- ✅ File Explorer - 文件浏览
- ✅ Graph View - 关系图谱
- ✅ Backlinks - 反向链接
- ✅ Templates - 模板系统
- ✅ Daily Notes - 每日笔记
- ✅ Command Palette - 命令面板

#### 社区插件 (推荐安装)
- [Dataview](https://github.com/blacksmithgu/obsidian-dataview) - 数据库查询
- [Templater](https://github.com/SilentVoid13/Templater) - 高级模板
- [Advanced Tables](https://github.com/tgrosinger/advanced-tables-obsidian) - 表格增强
- [Excalidraw](https://github.com/zsviczian/obsidian-excalidraw-plugin) - 绘图工具
- [Calendar](https://github.com/liamcain/obsidian-calendar-plugin) - 日历视图

---

## 📖 使用指南

### 导航
- 🏠 从 **[[📍XinSor 传感器知识库]]** 开始浏览
- 🔍 使用 `Ctrl/Cmd + O` 快速搜索笔记
- 🕸️ 查看 **关系图谱** 了解知识关联

### 标签系统
- `#传感器` - 传感器相关
- `#驱动开发` - 驱动代码开发
- `#硬件设计` - 硬件电路设计
- `#电路设计` - 具体电路方案
- `#调试` - 调试技巧
- `#选型` - 选型指南
- `#数据手册` - Datasheet

### 模板使用
1. 按 `Ctrl/Cmd + T` 打开模板选择
2. 选择合适的模板
3. 填写模板内容

---

## 🔗 ZeroZap 组织

| 仓库 | 描述 | 状态 |
|------|------|------|
| [**ZeroZap**](https://github.com/ZeroZap) | 主组织枢纽 | 🏠 |
| [**XinYi**](https://github.com/ZeroZap/XinYi) | 嵌入式系统框架 | ✅ |
| [**XinSor**](https://github.com/ZeroZap/Xinsor) | 📍 传感器知识库 (Obsidian) | ✅ |
| [**st_hal**](https://github.com/ZeroZap/st_hal) | STM32 HAL 库 | ✅ |
| [**xhsc**](https://github.com/ZeroZap/xhsc) | HC32 HAL 库 | ✅ |
| [**wch**](https://github.com/ZeroZap/wch) | CH32 HAL 库 | ✅ |

---

## 📝 贡献指南

### 添加新传感器文档

1. 在对应分类下创建新笔记
2. 使用 `[[链接]]` 关联相关笔记
3. 添加适当的标签
4. 更新 [[📍XinSor 传感器知识库]] 导航

### 命名规范
- 文件名使用中文，清晰描述内容
- 索引文件使用 `XXX 索引.md` 格式
- 模板文件放在 `99-Templates/`

### 提交规范
```bash
git add <filename>
git commit -m "docs: 添加 XXX 传感器文档"
git push
```

---

## 📄 许可证

MIT License - ZeroZap Team

---

## 📊 知识库统计

- **总笔记数**: 50+
- **传感器文档**: 20+
- **参考设计**: 10+
- **数据手册**: 15+

---

**最后更新**: 2026-03-13  
**维护者**: ZeroZap EE Team  
**Obsidian 版本**: v1.5+
