# XinSor 作为 XinYi 子目录

**定位**: 说明 XinSor 作为 XinYi 传感器知识子目录/子模块时的边界、目录映射和维护流程  
**状态**: 探索草案  
**最后更新**: 2026-05-20

---

## 目标

XinSor 当前是独立传感器知识库，主要负责收集型号、选型、硬件注意事项和驱动要点。后续如果作为 XinYi 的子目录，应保持“知识库”和“代码框架”的职责分离：

| 项目 | 职责 |
|------|------|
| XinYi | 传感器驱动实现、组件抽象、构建系统、测试样例 |
| XinSor | 传感器型号库、选型依据、硬件 bring-up、驱动开发记录、框架适配说明 |

---

## 推荐落位

### 方案 A: 文档子目录

适合 XinYi 希望直接内置传感器知识库时使用。

```text
XinYi/
├── components/
├── drivers/
├── examples/
├── docs/
│   └── xinsor/                 # 放置当前 XinSor 内容
└── README.md
```

优点是阅读和版本管理简单，缺点是 XinSor 会跟随 XinYi 仓库体积增长。

### 方案 B: Git Submodule

适合 XinSor 仍需独立演进，并被 XinYi 引用。

```text
XinYi/
├── components/
├── drivers/
├── examples/
├── docs/
│   └── xinsor/                 # git submodule: ZeroZap/Xinsor
└── README.md
```

优点是边界清晰、可独立发布，缺点是使用者需要理解 submodule 更新流程。

### 当前建议

优先采用 **方案 B: Git Submodule**。当前 XinSor 已经是完整 Obsidian Vault，作为独立知识库维护更自然；XinYi 只需要固定引用版本即可。

---

## 目录映射

| XinSor 内容 | 对应 XinYi 内容 | 说明 |
|-------------|----------------|------|
| `10-Sensors/传感器总目录.md` | `drivers/sensors/README.md` | 驱动支持矩阵的数据来源 |
| `10-Sensors/<Category>/<Model>.md` | `drivers/sensors/<model>/` | 单型号驱动设计、寄存器和验证记录 |
| `20-Reference-Designs/典型电路/` | `boards/<board>/docs/` | 板级接线、参考电路和布局建议 |
| `30-Integration/` | `docs/sensors/` | XinYi 组件接口、适配流程和测试说明 |
| `99-Templates/驱动开发笔记模板.md` | `drivers/sensors/<model>/README.md` | 驱动 README 的来源模板 |

---

## 型号状态映射

| XinSor 状态 | XinYi 状态 | 进入条件 |
|-------------|------------|----------|
| 待收集 | backlog | 只有型号信息，还未选型 |
| 选型骨架 | candidate | 已有应用、参数和驱动关注点 |
| 已建档 | documented | 有独立型号笔记，可进入驱动设计 |
| 已验证 | verified | 有硬件测试记录和稳定读数 |
| 已集成 | integrated | 已进入 XinYi 驱动目录并通过基础测试 |

---

## 驱动落地流程

1. 在 XinSor 的分类索引确认候选型号。
2. 创建或补齐单型号笔记，至少包含选型结论、硬件要点、驱动关注点、框架适配记录。
3. 在 XinYi 中建立 `drivers/sensors/<model>/`。
4. 把型号笔记中的寄存器、初始化流程和测试要点转为驱动 README。
5. 完成最小驱动：`init`、`read`、`configure`、`self_test`。
6. 用 `30-Integration/集成测试指南.md` 的 checklist 做 bring-up 验证。
7. 验证通过后回填 XinSor：状态、硬件平台、测试记录、已知问题。

---

## 建议优先级

| 优先级 | 型号 | 原因 |
|--------|------|------|
| P0 | AHT20 / BME280 / MPU6050 / VL53L0X | 已有文档和常见驱动价值，适合做端到端样例 |
| P1 | BMP280 / LIS2DH12 / QMC5883L / CCS811 / APDS9960 | 已补型号笔记，可补 XinYi 驱动 README 和测试说明 |
| P2 | SHT40 / SCD40 / VL53L1X / LPS22HB / BME688 | 当前为选型骨架，适合进入候选驱动池 |
| P3 | DPS310 / SGP40 / ENS160 / BMI270 / LSM6DSO | 下一批待补选型笔记 |

---

## 同步规则

| 场景 | 规则 |
|------|------|
| XinYi 新增传感器驱动 | 必须回填 XinSor 总目录和对应型号笔记 |
| XinSor 新增高优先级型号 | 只进入 XinYi backlog，不直接生成驱动 |
| 硬件验证失败 | 在 XinSor 型号笔记记录问题，不直接删除型号 |
| API 或目录变更 | 先更新 `30-Integration/`，再同步单型号文档 |

---

## 下一步动作

1. 在 XinYi 仓库确认真实驱动目录结构。
2. 选择一个端到端样例型号，建议 `AHT20` 或 `BMP280`。
3. 为该型号补 `XinYi 驱动 README` 小节，形成从知识库到代码目录的样例。
4. 再批量推广到同类传感器。

---

## 相关文档

- [[XinYi 传感器组件对接]]
- [[集成测试指南]]
- [[10-Sensors/传感器总目录|传感器总目录]]
- [[驱动开发规范]]
