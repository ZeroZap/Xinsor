---
name: sensor-autolearn
description: Use when the user asks to 自主学习 sensor, 继续学习 sensor, 增加传感器, or expand XinSor sensor notes. Guides autonomous batches of sensor documentation, index updates, link checks, commits, and pushes.
---

# Sensor Autolearn

Use this skill when expanding the XinSor sensor knowledge base without needing step-by-step user approval.

## Scope

- Add concise sensor selection notes under `10-Sensors/<Category>/`.
- Prefer models already present in category indexes with missing `文档` links or `待验证` status.
- Update the relevant category index and `10-Sensors/传感器总目录.md` in the same batch.
- Fix newly discovered non-archive broken links that point to the model just added.
- Commit and push when the user explicitly asks to `提交`, `提交修改`, `上传`, or has granted autonomous commit permission.

## Batch Strategy

1. Start from a clean `git status --short` check.
2. Pick one coherent category per batch: IMU, Temperature, Pressure, Optical, Gas, or Power.
3. Add 4-8 sensor notes per batch to keep commits reviewable.
4. Use existing note style: frontmatter blockquote, `概述`, `快速参数`, `选型结论`, `驱动关注点`, `相关链接`.
5. Avoid claiming hardware validation unless the existing index already marks the model as verified.
6. Use `选型骨架，待硬件验证` for new notes by default.
7. Keep wording practical: application fit, risks, driver bring-up points, calibration concerns.

## Index Rules

- Preserve existing verified status if present.
- Change `-` document cells to wiki links after adding notes.
- Use `📝 选型骨架` for newly documented but unverified models.
- Remove items from `高优先级待补笔记` only after the note exists and is linked from the main catalog.
- Do not edit archived files under `99-Archives/` unless explicitly requested.

## Verification

- Grep for wiki links to all added model names under `10-Sensors/`.
- Run `git status --short` and `git diff --stat` before committing.
- For commits, inspect the staged summary and use repo-style messages such as:
  - `docs: 补充光学传感器选型笔记`
  - `docs: 补充气体传感器选型笔记`
  - `docs: 补充压力传感器选型笔记`

## Autonomy Limits

- Do not fabricate exact electrical specifications if not already known; use approximate wording like `常见`, `约`, or `以 datasheet 为准`.
- Do not add implementation code unless the user asks for drivers or examples.
- Do not run destructive git commands.
- If a change touches opencode config or skills, remind the user that opencode must be restarted for the new skill to load.
