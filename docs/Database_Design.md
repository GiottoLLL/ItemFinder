# 物归处 (ItemFinder) 数据结构与 SQLite 数据库设计

## 1. 文档目标与范围

本设计基于以下输入：
- `docs/MVP.md`（MVP P0：本地优先、无账号）
- `docs/Frontend_Architecture.md`（页面结构与交互组件）

本设计输出：
- P0 阶段可落地的 SQLite 数据模型
- 面向后续迭代（登录/注册、云同步、管家对话）的扩展位
- 可直接执行的建表 SQL（初始化版本）

---

## 2. 设计原则

- 本地优先：核心功能在离线可用，数据完整存储在本地 SQLite
- 语义清晰：表名、字段名、状态码均表达业务语义
- 可扩展：通过“软删除 + 审计时间 + 扩展字段”支持后续迭代
- 性能优先：围绕检索、筛选、详情查询建立索引
- 最小耦合：AI 识别、预警、对话记录与主库存表解耦

---

## 3. 阶段划分

### 3.1 P0（本次必须实现）

- 物品管理（新增、编辑、删除、列表、详情）
- 储物空间管理（新增、编辑、删除、列表）
- 物品检索（按名称模糊、按空间筛选）
- 录入来源管理（拍照/扫码/票据/手动）
- 消耗预警基础能力（基于录入与变化记录）
- 管家会话与消息落库（为后续智能处理预留）

### 3.2 P1（后续扩展）

- 登录/注册（账号体系）
- 多端同步（云端）
- 更复杂的 OCR/语音/意图解析

---

## 4. 核心实体关系（ER 文字版）

- 一个 `storage_spaces` 可关联多个 `items`
- 一个 `items` 可关联多条 `item_stock_logs`（库存变化日志）
- 一个 `items` 可关联多条 `item_media`（图片或票据文件）
- 一个 `items` 可关联零或一条 `item_warning_profiles`（预警画像）
- 一个 `butler_sessions` 可关联多条 `butler_messages`
- `butler_messages` 可选关联 `items`（命中某个物品）

---

## 5. 数据表设计（P0）

### 5.1 `storage_spaces`（储物空间表）

用途：管理用户自定义储物空间，如“卧室衣柜”“书桌抽屉”

关键字段：
- `id`：主键
- `name`：空间名称（唯一，避免重复）
- `parent_id`：父空间 ID（支持层级空间，可为空）
- `sort_order`：排序值
- `is_deleted`：软删除标记
- `created_at`/`updated_at`：审计时间

### 5.2 `items`（物品主表）

用途：库存核心实体

关键字段：
- `id`：主键
- `name`：物品名称（支持模糊检索）
- `normalized_name`：标准化名称（小写/去空格，便于搜索）
- `category`：分类（可空）
- `is_consumable`：是否消耗品
- `quantity`：当前数量
- `unit`：单位（个/包/瓶）
- `storage_space_id`：所在空间外键
- `entry_source`：录入来源（camera/barcode/receipt/manual）
- `status`：状态（active/archived/depleted）
- `last_used_at`：最近使用时间
- `note`：备注
- `is_deleted`：软删除标记
- `created_at`/`updated_at`：审计时间

### 5.3 `item_stock_logs`（库存变化日志表）

用途：记录数量变化，为预警计算与追溯提供依据

关键字段：
- `id`：主键
- `item_id`：物品外键
- `change_type`：变化类型（add/consume/adjust/move）
- `delta_quantity`：变化量（可正可负）
- `before_quantity` / `after_quantity`：变化前后数量
- `operator`：操作来源（user/ai/system）
- `reason`：原因（可空）
- `created_at`：创建时间

### 5.4 `item_media`（物品媒体表）

用途：保存拍照图片、票据导入文件、条码图等本地 URI

关键字段：
- `id`：主键
- `item_id`：物品外键
- `media_type`：媒体类型（photo/receipt/barcode）
- `local_uri`：本地路径
- `width` / `height`：尺寸信息（可空）
- `created_at`：创建时间

### 5.5 `item_warning_profiles`（预警画像表）

用途：记录 AI 对消耗周期的估算结果与阈值参数

关键字段：
- `id`：主键
- `item_id`：物品外键（唯一）
- `avg_daily_usage`：日均消耗估计
- `warning_threshold_days`：预警阈值（预计剩余天数 <= 阈值触发）
- `is_warning_muted`：是否不再提醒（0=提醒，1=不再提醒）
- `warning_muted_at`：用户设置“不再提醒”的时间
- `last_predicted_deplete_at`：预计耗尽时间
- `last_warning_at`：最近一次预警时间
- `updated_at`：更新时间

### 5.6 `butler_sessions`（管家会话表）

用途：记录一次对话上下文

关键字段：
- `id`：主键
- `session_mode`：会话模式（text/voice）
- `status`：会话状态（active/closed）
- `started_at` / `ended_at`：会话时间

### 5.7 `butler_messages`（管家消息表）

用途：记录用户提问、系统应答、执行结果

关键字段：
- `id`：主键
- `session_id`：会话外键
- `role`：消息角色（user/assistant/system）
- `message_type`：消息类型（query/action/result/error）
- `content`：消息内容
- `intent`：意图（find_item/move_item/add_item）
- `related_item_id`：关联物品（可空）
- `created_at`：创建时间

### 5.8 `app_settings`（应用设置表）

用途：统一存储本地配置项

关键字段：
- `key_name`：键名（主键）
- `value_text`：值（字符串存储）
- `updated_at`：更新时间

示例配置：
- `privacy_accepted`
- `onboarding_completed`
- `warning_popup_enabled`

---

## 6. SQLite 初始化 SQL（v1）

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS storage_spaces (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  parent_id INTEGER NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_deleted INTEGER NOT NULL DEFAULT 0 CHECK (is_deleted IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT fk_storage_parent
    FOREIGN KEY (parent_id) REFERENCES storage_spaces(id)
      ON UPDATE CASCADE
      ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_storage_spaces_name_not_deleted
ON storage_spaces(name, is_deleted);

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  category TEXT NULL,
  is_consumable INTEGER NOT NULL DEFAULT 1 CHECK (is_consumable IN (0, 1)),
  quantity REAL NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  unit TEXT NOT NULL DEFAULT '个',
  storage_space_id INTEGER NOT NULL,
  entry_source TEXT NOT NULL CHECK (entry_source IN ('camera', 'barcode', 'receipt', 'manual')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'depleted')),
  last_used_at TEXT NULL,
  note TEXT NULL,
  is_deleted INTEGER NOT NULL DEFAULT 0 CHECK (is_deleted IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT fk_items_storage_space
    FOREIGN KEY (storage_space_id) REFERENCES storage_spaces(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_items_normalized_name
ON items(normalized_name);

CREATE INDEX IF NOT EXISTS idx_items_storage_space_id
ON items(storage_space_id);

CREATE INDEX IF NOT EXISTS idx_items_status
ON items(status);

CREATE INDEX IF NOT EXISTS idx_items_updated_at
ON items(updated_at DESC);

CREATE TABLE IF NOT EXISTS item_stock_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  change_type TEXT NOT NULL CHECK (change_type IN ('add', 'consume', 'adjust', 'move')),
  delta_quantity REAL NOT NULL,
  before_quantity REAL NULL CHECK (before_quantity >= 0),
  after_quantity REAL NULL CHECK (after_quantity >= 0),
  operator TEXT NOT NULL DEFAULT 'user' CHECK (operator IN ('user', 'ai', 'system')),
  reason TEXT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT fk_stock_logs_item
    FOREIGN KEY (item_id) REFERENCES items(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_stock_logs_item_time
ON item_stock_logs(item_id, created_at DESC);

CREATE TABLE IF NOT EXISTS item_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'receipt', 'barcode')),
  local_uri TEXT NOT NULL,
  width INTEGER NULL CHECK (width > 0),
  height INTEGER NULL CHECK (height > 0),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT fk_item_media_item
    FOREIGN KEY (item_id) REFERENCES items(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_item_media_item_id
ON item_media(item_id);

CREATE TABLE IF NOT EXISTS item_warning_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL UNIQUE,
  avg_daily_usage REAL NOT NULL DEFAULT 0 CHECK (avg_daily_usage >= 0),
  warning_threshold_days INTEGER NOT NULL DEFAULT 3 CHECK (warning_threshold_days >= 0),
  is_warning_muted INTEGER NOT NULL DEFAULT 0 CHECK (is_warning_muted IN (0, 1)),
  warning_muted_at TEXT NULL,
  last_predicted_deplete_at TEXT NULL,
  last_warning_at TEXT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT fk_warning_profile_item
    FOREIGN KEY (item_id) REFERENCES items(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS butler_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_mode TEXT NOT NULL CHECK (session_mode IN ('text', 'voice')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  ended_at TEXT NULL
);

CREATE TABLE IF NOT EXISTS butler_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  message_type TEXT NOT NULL CHECK (message_type IN ('query', 'action', 'result', 'error')),
  content TEXT NOT NULL,
  intent TEXT NULL CHECK (intent IN ('find_item', 'move_item', 'add_item')),
  related_item_id INTEGER NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT fk_butler_messages_session
    FOREIGN KEY (session_id) REFERENCES butler_sessions(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
  CONSTRAINT fk_butler_messages_item
    FOREIGN KEY (related_item_id) REFERENCES items(id)
      ON UPDATE CASCADE
      ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_butler_messages_session_time
ON butler_messages(session_id, created_at DESC);

CREATE TABLE IF NOT EXISTS app_settings (
  key_name TEXT PRIMARY KEY,
  value_text TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

## 7. 关键查询场景与索引策略

- 首页统计：`items` 过滤 `is_deleted = 0` + `status = 'active'`
- 物品检索：`normalized_name LIKE '%keyword%'` + `storage_space_id` 筛选
- 详情回溯：`item_stock_logs` 按 `item_id + created_at DESC`
- 管家会话回放：`butler_messages` 按 `session_id + created_at DESC`
- 预警扫描：`item_warning_profiles` 联表 `items.quantity`

说明：
- SQLite 对前置 `%` 的 `LIKE` 无法充分使用普通索引，后续若检索压力增加可切换 FTS5
- 当前先以简单索引方案保证实现复杂度可控

---

## 8. 数据约束与一致性规则

- 所有“删除”优先采用软删除（`is_deleted = 1`）
- 所有库存变动必须写入 `item_stock_logs`
- 当 `quantity = 0` 且为消耗品时，业务层将 `status` 置为 `depleted`
- 预警弹窗在扫描时必须过滤 `item_warning_profiles.is_warning_muted = 0`
- 迁移脚本必须开启 `PRAGMA foreign_keys = ON`
- 更新时间 `updated_at` 统一由应用层在更新语句中写入

---

## 9. P1 扩展建议（登录注册与同步）

建议新增以下表，不影响当前 P0 表结构：
- `users`：用户账号主表
- `auth_identities`：登录方式映射（密码/手机验证码）
- `sync_tasks`：本地待同步任务队列
- `sync_metadata`：同步游标与版本信息

扩展策略：
- 现有 P0 表新增 `owner_user_id` 字段即可支持多账号隔离
- 本地单用户场景下该字段可为空，不影响当前逻辑

---

## 10. 给下一位智能体的交接说明

- 直接使用“第 6 章 SQL”初始化本地 SQLite
- DAO/Repository 层先围绕以下核心能力实现：
  - `items` 的增删改查 + 检索筛选
  - `storage_spaces` 的层级读取与新增
  - `item_stock_logs` 的追加写入
  - `item_warning_profiles` 的读写与预警扫描
- 与前端页面映射关系：
  - 首页 -> `items` 统计 + `item_warning_profiles`
  - 录入/录入表单 -> `items` + `item_media` + `item_stock_logs`
  - 列表/详情 -> `items` + `storage_spaces` + `item_stock_logs`
  - 管家组件 -> `butler_sessions` + `butler_messages`
