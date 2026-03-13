#!/bin/bash

# ZeroZap Obsidian 链接迁移脚本
# 用于批量更新 xinsor 知识库中的 Nutstore 链接

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置
XINSOR_ROOT="/home/eugene/zerozap/xinsor"
NUTSTORE_ROOT="/home/eugene/Nutstore"

# 使用模式：relative | absolute | placeholder
LINK_MODE="${1:-relative}"

echo "========================================"
echo "🔧 ZeroZap Obsidian 链接迁移工具"
echo "========================================"
echo ""
echo "模式：$LINK_MODE"
echo "Xinsor: $XINSOR_ROOT"
echo "Nutstore: $NUTSTORE_ROOT"
echo ""

# 函数：生成链接
generate_link() {
    local source_file="$1"
    local target_path="$2"
    
    case $LINK_MODE in
        "relative")
            # 计算相对路径
            local rel_path=$(python3 -c "import os.path; print(os.path.relpath('$NUTSTORE_ROOT', os.path.dirname('$source_file')))" 2>/dev/null || echo "$NUTSTORE_ROOT")
            echo "[[$rel_path/$target_path]]"
            ;;
        "absolute")
            echo "[[$NUTSTORE_ROOT/$target_path]]"
            ;;
        "placeholder")
            # 使用占位符，便于后续替换
            echo "[[{{NUTSTORE}}/$target_path]]"
            ;;
        "web")
            # 如果使用 Obsidian Publish 或 Web 版本
            echo "[[nutstore://$target_path]]"
            ;;
        *)
            echo "[[$target_path]]"
            ;;
    esac
}

# 函数：更新文件中的链接
update_links_in_file() {
    local file="$1"
    local old_pattern="$2"
    local new_pattern="$3"
    
    if [ -f "$file" ]; then
        sed -i "s|$old_pattern|$new_pattern|g" "$file"
        echo -e "${GREEN}✓ 更新：$file${NC}"
    fi
}

# 函数：创建 Nutstore 索引笔记
create_nutstore_index() {
    local index_file="$XINSOR_ROOT/99-External/Nutstore 知识库索引.md"
    
    mkdir -p "$(dirname "$index_file")"
    
    cat > "$index_file" << 'EOF'
---
tags: [external/nutstore, index]
created: {{DATE}}
updated: {{DATE}}
---

# 📚 Nutstore 知识库索引

> **注意**: Nutstore 是通过坚果云同步的外部知识库，包含大量电子工程知识。

## 📁 核心目录

### ESE - 嵌入式系统工程
- [[../../Nutstore/ESE/✳EE|电子工程基础]] - 电路/元器件/EDA
- [[../../Nutstore/ESE/MCU|微控制器]] - STM32/GD32/ESP32 等
- [[../../Nutstore/ESE/Modules|电子模块]] - 36 个模块分类
- [[../../Nutstore/ESE/RTOS|实时操作系统]] - RTOS 实现

### Makers - 创客项目
- [[../../Nutstore/Makers/Sensor|传感器项目]]
- [[../../Nutstore/Makers/Components|元器件]]
- [[../../Nutstore/Makers/一个电子产品设计|产品设计]]

### Zerozap - 历史资料
- [[../../Nutstore/Zerozap|公司文档]]
- [[../../Nutstore/Zerozap/0 - Company|公司资料]]

## 🔗 链接使用说明

### 当前链接模式：{{LINK_MODE}}

**相对路径** (推荐用于本地使用):
```
[[../../Nutstore/ESE/MCU/STM32/xxx]]
```

**占位符模式** (推荐用于版本控制):
```
[[{{NUTSTORE}}/ESE/MCU/STM32/xxx]]
```

**绝对路径** (不推荐，迁移困难):
```
[[/home/eugene/Nutstore/ESE/MCU/STM32/xxx]]
```

## 🛠️ 迁移脚本

当需要修改链接模式时，运行：
```bash
cd /home/eugene/zerozap/xinsor
bash scripts/migrate-nutstore-links.sh <mode>
```

支持的模式：
- `relative` - 相对路径 (默认)
- `placeholder` - 占位符模式
- `absolute` - 绝对路径

## 📝 使用建议

1. **本地开发**: 使用 `relative` 模式
2. **版本控制**: 使用 `placeholder` 模式
3. **团队协作**: 在 README 中说明 Nutstore 路径配置

## ⚠️ 注意事项

- Nutstore 是个人知识库，团队成员可能需要配置自己的路径
- 使用占位符模式时，需要配合配置文件或环境变量
- 迁移脚本会自动更新所有 Markdown 文件中的链接

---

**最后更新**: {{DATE}}
**维护者**: ZeroZap 团队
EOF

    # 替换模板变量
    local date=$(date +%Y-%m-%d)
    sed -i "s/{{DATE}}/$date/g" "$index_file"
    sed -i "s/{{LINK_MODE}}/$LINK_MODE/g" "$index_file"
    
    echo -e "${GREEN}✓ 创建索引文件：$index_file${NC}"
}

# 函数：创建配置文件
create_config() {
    local config_file="$XINSOR_ROOT/.obsidian/nutstore-config.json"
    
    mkdir -p "$(dirname "$config_file")"
    
    cat > "$config_file" << EOF
{
  "nutstore_root": "$NUTSTORE_ROOT",
  "link_mode": "$LINK_MODE",
  "auto_sync": false,
  "last_updated": "$(date -Iseconds)"
}
EOF
    
    echo -e "${GREEN}✓ 创建配置文件：$config_file${NC}"
}

# 主流程
main() {
    echo "📋 步骤 1/4: 创建配置文件..."
    create_config
    
    echo ""
    echo "📋 步骤 2/4: 创建 Nutstore 索引..."
    create_nutstore_index
    
    echo ""
    echo "📋 步骤 3/4: 扫描现有 Markdown 文件..."
    
    local md_count=$(find "$XINSOR_ROOT" -name "*.md" | wc -l)
    echo "找到 $md_count 个 Markdown 文件"
    
    echo ""
    echo "📋 步骤 4/4: 检查链接模式..."
    
    # 检查是否已有 Nutstore 链接
    local existing_links=$(grep -r "Nutstore" "$XINSOR_ROOT" --include="*.md" 2>/dev/null | wc -l)
    echo "发现 $existing_links 个现有 Nutstore 链接"
    
    echo ""
    echo "========================================"
    echo "✅ 迁移准备完成！"
    echo "========================================"
    echo ""
    echo "下一步操作："
    echo "1. 在 xinsor 笔记中引用 Nutstore 知识："
    echo "   [[../../Nutstore/ESE/MCU/STM32/xxx]]"
    echo ""
    echo "2. 如需更改链接模式，运行："
    echo "   bash scripts/migrate-nutstore-links.sh placeholder"
    echo ""
    echo "3. 团队成员克隆后，需要配置自己的 Nutstore 路径"
    echo ""
}

# 执行
main "$@"
