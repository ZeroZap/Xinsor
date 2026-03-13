#!/bin/bash

# ZeroZap Nutstore 链接管理 - 快速参考脚本
# 提供常用命令的快速访问

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
XINSOR_ROOT="$(dirname "$SCRIPT_DIR")"

show_help() {
    cat << EOF
🔧 ZeroZap Nutstore 链接管理 - 快速参考

用法：bash $(basename "$0") <命令>

命令:
  validate    - 验证现有链接
  to-relative - 切换到相对路径模式
  to-placeholder - 切换到占位符模式
  to-absolute - 切换到绝对路径模式
  report      - 生成迁移报告
  help        - 显示此帮助信息

示例:
  bash quick-ref.sh validate
  bash quick-ref.sh to-placeholder

快速参考:
  ┌─────────────┬──────────────────────────────────────┐
  │ 模式        │ 链接示例                             │
  ├─────────────┼──────────────────────────────────────┤
  │ relative    │ [[../../Nutstore/ESE/MCU/xxx]]      │
  │ placeholder │ [[{{NUTSTORE}}/ESE/MCU/xxx]]        │
  │ absolute    │ [[/home/eugene/Nutstore/ESE/MCU/xxx]]│
  └─────────────┴──────────────────────────────────────┘

推荐:
  - 个人使用：relative
  - 团队协作：placeholder
  - 避免使用：absolute

EOF
}

run_migrate() {
    local mode="$1"
    echo "🔧 执行迁移：$mode"
    echo ""
    python3 "$SCRIPT_DIR/migrate_nutstore_links.py" "$mode"
}

case "${1:-help}" in
    validate)
        run_migrate "validate"
        ;;
    to-relative)
        run_migrate "relative"
        ;;
    to-placeholder)
        run_migrate "placeholder"
        ;;
    to-absolute)
        run_migrate "absolute"
        ;;
    report)
        run_migrate "relative"  # 生成报告
        echo ""
        echo "📊 报告位置：$XINSOR_ROOT/docs/nutstore-migration-report.md"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ 未知命令：$1"
        echo ""
        show_help
        exit 1
        ;;
esac
