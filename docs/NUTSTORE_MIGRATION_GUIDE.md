# 🔧 Nutstore 链接迁移指南

> **问题**: 在 xinsor 中创建 Nutstore 链接会不会造成迁移麻烦？
> 
> **答案**: **不会**！我们有完整的迁移工具和最佳实践。

---

## 📋 目录

1. [为什么不会造成麻烦](#为什么不会造成麻烦)
2. [三种链接模式](#三种链接模式)
3. [迁移工具使用](#迁移工具使用)
4. [最佳实践](#最佳实践)
5. [团队协作](#团队协作)

---

## 为什么不会造成麻烦

### ✅ 原因

1. **Markdown 是纯文本** - 链接只是文本字符串，可以轻松批量替换
2. **有迁移脚本** - 一键更新所有链接
3. **支持多种模式** - 可根据场景选择最合适的模式
4. **可验证** - 迁移前可以验证链接有效性

### 📊 对比

| 场景 | 手动迁移 | 使用脚本 |
|------|---------|---------|
| 10 个文件 | 30 分钟 | 10 秒 |
| 100 个文件 | 5 小时 | 30 秒 |
| 路径变更 | 逐个修改 | 一键更新 |

---

## 三种链接模式

### 1️⃣ Relative (相对路径) - 推荐本地使用

```markdown
[[../../Nutstore/ESE/MCU/STM32/xxx]]
```

**优点**:
- ✅ 本地使用友好
- ✅ 不依赖绝对路径
- ✅ Obsidian 原生支持

**缺点**:
- ❌ 目录结构变化时需要更新
- ❌ 团队成员路径不同时需要调整

**适用场景**: 个人本地使用

---

### 2️⃣ Placeholder (占位符) - 推荐版本控制 ⭐

```markdown
[[{{NUTSTORE}}/ESE/MCU/STM32/xxx]]
```

**优点**:
- ✅ 版本控制友好
- ✅ 团队成员可配置自己的路径
- ✅ 迁移最简单 (只需替换占位符)
- ✅ 路径变更时影响最小

**缺点**:
- ❌ 需要配置文件或预处理脚本
- ❌ Obsidian 需要插件支持跳转

**适用场景**: 团队协作、版本控制

**配置方法**:
```json
// .obsidian/nutstore-config.json
{
  "nutstore_root": "/home/eugene/Nutstore"
}
```

---

### 3️⃣ Absolute (绝对路径) - 不推荐

```markdown
[[/home/eugene/Nutstore/ESE/MCU/STM32/xxx]]
```

**优点**:
- ✅ 简单直接

**缺点**:
- ❌ 迁移困难
- ❌ 团队协作困难
- ❌ 路径变更时需要全部更新

**适用场景**: 不推荐使用

---

## 迁移工具使用

### 🛠️ 工具位置

```
/home/eugene/zerozap/xinsor/scripts/
├── migrate_nutstore_links.py   # Python 版本 (推荐)
└── migrate-nutstore-links.sh   # Shell 版本
```

### 📖 使用方法

#### 1. 查看帮助

```bash
cd /home/eugene/zerozap/xinsor
python3 scripts/migrate_nutstore_links.py --help
```

#### 2. 验证现有链接

```bash
python3 scripts/migrate_nutstore_links.py validate
```

输出示例:
```
🔍 验证链接...
有效链接：45
无效链接：3

无效链接列表:
  SHT30.md: [[../../Nutstore/ESE/MCU/xxx]]
  ...
```

#### 3. 切换到占位符模式 (推荐)

```bash
python3 scripts/migrate_nutstore_links.py placeholder
```

#### 4. 切换回相对路径模式

```bash
python3 scripts/migrate_nutstore_links.py relative
```

#### 5. 生成迁移报告

```bash
# 自动在 docs/ 目录生成报告
python3 scripts/migrate_nutstore_links.py placeholder
```

报告位置：`docs/nutstore-migration-report.md`

---

## 最佳实践

### 📝 推荐方案

**个人使用**:
```markdown
1. 使用 relative 模式
2. 定期运行 validate 检查链接
3. 路径变更时运行 migrate 脚本
```

**团队协作**:
```markdown
1. 使用 placeholder 模式
2. 在 README 中说明配置方法
3. 提供配置文件模板
4. 成员克隆后配置自己的路径
```

### 📁 目录结构建议

```
xinsor/
├── .obsidian/
│   └── nutstore-config.json    # Nutstore 路径配置
├── scripts/
│   ├── migrate_nutstore_links.py  # 迁移脚本
│   └── validate_links.sh         # 验证脚本
├── 99-External/
│   └── Nutstore 知识库索引.md    # Nutstore 索引
└── ...
```

### 🔗 链接编写规范

**推荐**:
```markdown
<!-- 使用相对路径 -->
[[../../Nutstore/ESE/MCU/STM32/STM32U5]]

<!-- 或使用占位符 -->
[[{{NUTSTORE}}/ESE/MCU/STM32/STM32U5]]
```

**不推荐**:
```markdown
<!-- 绝对路径 -->
[[/home/eugene/Nutstore/ESE/MCU/STM32/STM32U5]]

<!-- 硬编码路径 -->
[链接](file:///home/eugene/Nutstore/...)
```

---

## 团队协作

### 🚀 新成员入职流程

1. **克隆仓库**
   ```bash
   git clone git@github.com:ZeroZap/xinsor.git
   ```

2. **配置 Nutstore 路径**
   ```bash
   # 复制配置文件模板
   cp .obsidian/nutstore-config.example.json .obsidian/nutstore-config.json
   
   # 编辑配置文件，设置自己的 Nutstore 路径
   vim .obsidian/nutstore-config.json
   ```

3. **运行迁移脚本** (如果使用 placeholder 模式)
   ```bash
   python3 scripts/migrate_nutstore_links.py relative
   ```

4. **在 Obsidian 中打开**

### 📋 配置文件模板

```json
{
  "nutstore_root": "/path/to/your/Nutstore",
  "link_mode": "relative",
  "auto_sync": false,
  "notes": "请根据实际情况修改 nutstore_root 路径"
}
```

---

## 🎯 实际案例

### 案例 1: 从 relative 切换到 placeholder

**场景**: 准备将 xinsor 推送到 GitHub，与团队共享

**步骤**:
```bash
# 1. 验证现有链接
python3 scripts/migrate_nutstore_links.py validate

# 2. 切换到 placeholder 模式
python3 scripts/migrate_nutstore_links.py placeholder

# 3. 检查迁移报告
cat docs/nutstore-migration-report.md

# 4. 提交更改
git add .
git commit -m "chore: 切换为 placeholder 链接模式，便于团队协作"
git push
```

### 案例 2: Nutstore 路径变更

**场景**: Nutstore 从 `/home/eugene/Nutstore` 迁移到 `/data/Nutstore`

**步骤**:
```bash
# 1. 更新配置文件
vim .obsidian/nutstore-config.json
# 修改 nutstore_root 为新路径

# 2. 重新生成链接 (如果需要)
python3 scripts/migrate_nutstore_links.py relative

# 3. 验证链接
python3 scripts/migrate_nutstore_links.py validate
```

---

## ⚠️ 注意事项

1. **备份**: 迁移前建议备份重要笔记
2. **测试**: 迁移后在 Obsidian 中测试链接跳转
3. **验证**: 定期运行 validate 检查链接有效性
4. **文档**: 在 README 中说明链接模式和配置方法

---

## 📞 问题排查

### 链接无法跳转

**检查**:
1. Nutstore 路径是否正确
2. 链接格式是否符合 Obsidian 语法
3. 是否使用了正确的相对路径层级

### 迁移后链接失效

**解决**:
```bash
# 1. 回滚到之前的模式
python3 scripts/migrate_nutstore_links.py relative

# 2. 或手动修复
# 使用文本编辑器的查找替换功能
```

### 团队成员路径不同

**解决**:
1. 使用 placeholder 模式
2. 每人配置自己的 `.obsidian/nutstore-config.json`
3. 或使用环境变量：`[[${NUTSTORE_PATH}}/...]`

---

## 📚 相关文档

- [xinsor README](../README.md)
- [Obsidian 使用指南](../00-Inbox/Obsidian 使用指南.md)
- [Nutstore 知识库索引](../99-External/Nutstore 知识库索引.md)

---

**最后更新**: 2026-03-12
**维护者**: ZeroZap 团队
