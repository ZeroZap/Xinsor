#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
ZeroZap Obsidian 链接迁移工具 (Python 版本)

功能:
- 批量更新 xinsor 知识库中的 Nutstore 链接
- 支持多种链接模式 (relative/placeholder/absolute)
- 提供链接验证和报告生成

使用:
    python3 migrate_nutstore_links.py [mode]
    
模式:
    relative    - 相对路径 (默认，推荐本地使用)
    placeholder - 占位符模式 (推荐版本控制)
    absolute    - 绝对路径 (不推荐)
    validate    - 仅验证链接，不修改
"""

import os
import re
import sys
from pathlib import Path
from datetime import datetime

# 配置
XINSOR_ROOT = Path("/home/eugene/zerozap/xinsor")
NUTSTORE_ROOT = Path("/home/eugene/Nutstore")

# 颜色输出
class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    NC = '\033[0m'  # No Color

def print_header():
    print("=" * 60)
    print("🔧 ZeroZap Obsidian 链接迁移工具 (Python)")
    print("=" * 60)
    print()

def get_link_format(mode):
    """获取链接格式模板"""
    formats = {
        'relative': lambda path: f"[[../../Nutstore/{path}]]",
        'placeholder': lambda path: f"[[{{{{NUTSTORE}}}}/{path}]]",
        'absolute': lambda path: f"[[{NUTSTORE_ROOT}/{path}]]",
        'web': lambda path: f"[[nutstore://{path}]]",
    }
    return formats.get(mode, formats['relative'])

def find_markdown_files(root_path):
    """查找所有 Markdown 文件"""
    md_files = []
    for root, dirs, files in os.walk(root_path):
        # 跳过 .git 和 99-Archives
        dirs[:] = [d for d in dirs if d not in ['.git', '99-Archives']]
        for file in files:
            if file.endswith('.md'):
                md_files.append(Path(root) / file)
    return md_files

def extract_nutstore_links(content):
    """提取内容中的 Nutstore 链接"""
    patterns = [
        r'\[\[.*?Nutstore.*?\]\]',
        r'\[\[.*?nutstore.*?\]\]',
        r'\[\[.*?{{NUTSTORE}}.*?\]\]',
    ]
    
    links = []
    for pattern in patterns:
        matches = re.findall(pattern, content)
        links.extend(matches)
    
    return list(set(links))  # 去重

def update_file_links(file_path, mode, dry_run=False):
    """更新文件中的链接"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        links = extract_nutstore_links(content)
        
        if not links:
            return 0  # 没有链接需要更新
        
        updated_count = 0
        
        for link in links:
            # 提取路径部分
            match = re.search(r'\[\[(.*?)\]\]', link)
            if match:
                link_path = match.group(1)
                
                # 如果是 Nutstore 链接
                if 'Nutstore' in link_path or '{{NUTSTORE}}' in link_path:
                    # 提取相对路径
                    if '{{NUTSTORE}}' in link_path:
                        rel_path = link_path.replace('{{NUTSTORE}}/', '')
                    elif 'Nutstore/' in link_path:
                        rel_path = link_path.split('Nutstore/')[-1]
                    else:
                        continue
                    
                    # 生成新链接
                    new_link = get_link_format(mode)(rel_path)
                    
                    # 替换
                    content = content.replace(link, new_link)
                    updated_count += 1
        
        if updated_count > 0 and not dry_run:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
        
        return updated_count
    
    except Exception as e:
        print(f"{Colors.RED}✗ 错误：{file_path} - {e}{Colors.NC}")
        return 0

def validate_links(md_files):
    """验证链接是否有效"""
    valid_count = 0
    invalid_links = []
    
    for file_path in md_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            links = extract_nutstore_links(content)
            for link in links:
                match = re.search(r'\[\[(.*?)\]\]', link)
                if match:
                    link_path = match.group(1)
                    if 'Nutstore' in link_path:
                        # 检查目标文件是否存在
                        if '{{NUTSTORE}}' in link_path:
                            # 占位符模式，跳过验证
                            valid_count += 1
                        else:
                            # 尝试解析路径
                            try:
                                target = Path(link_path.replace('../../', ''))
                                if target.exists():
                                    valid_count += 1
                                else:
                                    invalid_links.append((str(file_path), link))
                            except:
                                invalid_links.append((str(file_path), link))
        except Exception as e:
            pass
    
    return valid_count, invalid_links

def generate_report(md_files, updated_count, mode):
    """生成迁移报告"""
    report_file = XINSOR_ROOT / "docs" / "nutstore-migration-report.md"
    report_file.parent.mkdir(parents=True, exist_ok=True)
    
    date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    report = f"""# 🔧 Nutstore 链接迁移报告

**生成时间**: {date}
**迁移模式**: {mode}
**扫描文件数**: {len(md_files)}
**更新链接数**: {updated_count}

## 📊 统计

| 指标 | 数量 |
|------|------|
| Markdown 文件总数 | {len(md_files)} |
| 包含 Nutstore 链接的文件 | {updated_count} |
| 更新的链接数 | {updated_count} |

## 🔗 链接模式说明

### {mode} 模式

"""
    
    if mode == 'relative':
        report += """**优点**:
- 本地使用友好
- 不依赖绝对路径

**缺点**:
- 目录结构变化时需要更新
- 团队成员路径不同时需要调整

**示例**:
```markdown
[[../../Nutstore/ESE/MCU/STM32/xxx]]
```
"""
    elif mode == 'placeholder':
        report += """**优点**:
- 版本控制友好
- 团队成员可配置自己的路径
- 迁移最简单

**缺点**:
- 需要配置文件或预处理

**示例**:
```markdown
[[{{NUTSTORE}}/ESE/MCU/STM32/xxx]]
```

**配置方法**:
1. 创建 `.obsidian/nutstore-config.json`
2. 设置 `nutstore_root` 为实际路径
3. 使用预处理脚本替换占位符
"""
    elif mode == 'absolute':
        report += """**优点**:
- 简单直接

**缺点**:
- 迁移困难
- 团队协作困难
- 不推荐使用

**示例**:
```markdown
[[/home/eugene/Nutstore/ESE/MCU/STM32/xxx]]
```
"""
    
    report += f"""
## 📝 下一步

1. 检查更新的笔记，确保链接正确
2. 在 Obsidian 中测试链接跳转
3. 如有问题，可运行：
   ```bash
   python3 scripts/migrate_nutstore_links.py {mode}
   ```

## ⚙️ 配置文件

位置：`.obsidian/nutstore-config.json`

```json
{{
  "nutstore_root": "/home/eugene/Nutstore",
  "link_mode": "{mode}",
  "auto_sync": false
}}
```

---

**生成工具**: migrate_nutstore_links.py
**最后更新**: {date}
"""
    
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    return report_file

def main():
    print_header()
    
    # 获取模式
    mode = sys.argv[1] if len(sys.argv) > 1 else 'relative'
    
    # 验证模式
    valid_modes = ['relative', 'placeholder', 'absolute', 'validate', 'web']
    if mode not in valid_modes:
        print(f"{Colors.RED}错误：无效模式 '{mode}'{Colors.NC}")
        print(f"支持的模式：{', '.join(valid_modes)}")
        sys.exit(1)
    
    print(f"模式：{Colors.BLUE}{mode}{Colors.NC}")
    print(f"Xinsor: {XINSOR_ROOT}")
    print(f"Nutstore: {NUTSTORE_ROOT}")
    print()
    
    # 查找 Markdown 文件
    print("📋 扫描 Markdown 文件...")
    md_files = find_markdown_files(XINSOR_ROOT)
    print(f"找到 {len(md_files)} 个 Markdown 文件")
    print()
    
    # 验证模式
    if mode == 'validate':
        print("🔍 验证链接...")
        valid_count, invalid_links = validate_links(md_files)
        print(f"有效链接：{Colors.GREEN}{valid_count}{Colors.NC}")
        if invalid_links:
            print(f"无效链接：{Colors.RED}{len(invalid_links)}{Colors.NC}")
            print("\n无效链接列表:")
            for file_path, link in invalid_links[:10]:  # 只显示前 10 个
                print(f"  {file_path}: {link}")
        sys.exit(0)
    
    # 更新链接
    print("🔧 更新链接...")
    total_updated = 0
    files_updated = 0
    
    for file_path in md_files:
        count = update_file_links(file_path, mode)
        if count > 0:
            total_updated += count
            files_updated += 1
            print(f"  {Colors.GREEN}✓{Colors.NC} {file_path.name} ({count} 个链接)")
    
    print()
    print(f"更新完成：{Colors.GREEN}{files_updated}{Colors.NC} 个文件，{Colors.GREEN}{total_updated}{Colors.NC} 个链接")
    print()
    
    # 生成报告
    print("📊 生成报告...")
    report_file = generate_report(md_files, total_updated, mode)
    print(f"报告：{report_file}")
    print()
    
    print("=" * 60)
    print("✅ 迁移完成！")
    print("=" * 60)
    print()
    print("下一步:")
    print("1. 在 Obsidian 中打开 xinsor 知识库")
    print("2. 测试 Nutstore 链接是否正常跳转")
    print("3. 如有问题，运行：python3 scripts/migrate_nutstore_links.py validate")
    print()

if __name__ == '__main__':
    main()
