import * as SQLite from 'expo-sqlite'
import { Platform } from 'react-native'

import { normalizeKeyword } from '../../utils'

const databaseName = 'itemfinder.db'
const dbPromise = Platform.OS === 'web'
  ? SQLite.openDatabaseAsync(databaseName)
  : Promise.resolve(SQLite.openDatabaseSync(databaseName))

export function executeSql(sqlText, params = []) {
  return dbPromise
    .then(dbInstance => dbInstance.runAsync(sqlText, ...params))
    .then(result => ({
      insertId: result.lastInsertRowId,
      changes: result.changes
    }))
}

export function queryAll(sqlText, params = []) {
  return dbPromise.then(dbInstance => dbInstance.getAllAsync(sqlText, ...params))
}

export function queryFirst(sqlText, params = []) {
  return dbPromise.then(dbInstance => dbInstance.getFirstAsync(sqlText, ...params))
}

function executeBatch(statementList) {
  return statementList.reduce((promiseChain, statement) => {
    return promiseChain.then(() => executeSql(statement))
  }, Promise.resolve())
}

function getSetting(keyName) {
  return queryFirst('SELECT value_text AS valueText FROM app_settings WHERE key_name = ?', [keyName])
    .then(row => row?.valueText || null)
}

function setSetting(keyName, valueText) {
  return executeSql(
    `INSERT INTO app_settings(key_name, value_text, updated_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(key_name) DO UPDATE SET value_text = excluded.value_text, updated_at = datetime('now')`,
    [keyName, String(valueText)]
  )
}

function seedIfNeeded() {
  return getSetting('db_seeded_v1').then(flag => {
    if (flag === '1') {
      return Promise.resolve()
    }

    const seedStatements = [
      `INSERT INTO storage_spaces(name, sort_order, is_deleted)
       VALUES ('客厅边柜', 1, 0)`,
      `INSERT INTO storage_spaces(name, sort_order, is_deleted)
       VALUES ('卧室衣柜', 2, 0)`,
      `INSERT INTO storage_spaces(name, sort_order, is_deleted)
       VALUES ('书桌抽屉', 3, 0)`,
      `INSERT INTO storage_spaces(name, sort_order, is_deleted)
       VALUES ('厨房水槽下方', 4, 0)`,
      `INSERT INTO items(name, normalized_name, is_consumable, quantity, unit, storage_space_id, entry_source, status, is_deleted)
       VALUES ('抽纸', '抽纸', 1, 1, '包', 1, 'manual', 'active', 0)`,
      `INSERT INTO items(name, normalized_name, is_consumable, quantity, unit, storage_space_id, entry_source, status, is_deleted)
       VALUES ('洗衣液', '洗衣液', 1, 1, '瓶', 4, 'manual', 'active', 0)`,
      `INSERT INTO items(name, normalized_name, is_consumable, quantity, unit, storage_space_id, entry_source, status, is_deleted)
       VALUES ('咖啡豆', '咖啡豆', 1, 6, '袋', 1, 'manual', 'active', 0)`,
      `INSERT INTO items(name, normalized_name, is_consumable, quantity, unit, storage_space_id, entry_source, status, is_deleted)
       VALUES ('护手霜', '护手霜', 1, 3, '支', 2, 'manual', 'active', 0)`
    ]

    return executeBatch(seedStatements)
      .then(() => setSetting('warning_popup_enabled', '1'))
      .then(() => setSetting('db_seeded_v1', '1'))
  })
}

export function initializeDatabase() {
  const schemaStatements = [
    `PRAGMA foreign_keys = ON`,
    `CREATE TABLE IF NOT EXISTS storage_spaces (
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
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS ux_storage_spaces_name_not_deleted
     ON storage_spaces(name, is_deleted)`,
    `CREATE TABLE IF NOT EXISTS items (
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
    )`,
    `CREATE INDEX IF NOT EXISTS idx_items_normalized_name
     ON items(normalized_name)`,
    `CREATE INDEX IF NOT EXISTS idx_items_storage_space_id
     ON items(storage_space_id)`,
    `CREATE INDEX IF NOT EXISTS idx_items_status
     ON items(status)`,
    `CREATE TABLE IF NOT EXISTS item_stock_logs (
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
    )`,
    `CREATE INDEX IF NOT EXISTS idx_stock_logs_item_time
     ON item_stock_logs(item_id, created_at DESC)`,
    `CREATE TABLE IF NOT EXISTS item_media (
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
    )`,
    `CREATE INDEX IF NOT EXISTS idx_item_media_item_id
     ON item_media(item_id)`,
    `CREATE TABLE IF NOT EXISTS item_warning_profiles (
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
    )`,
    `CREATE TABLE IF NOT EXISTS butler_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_mode TEXT NOT NULL CHECK (session_mode IN ('text', 'voice')),
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      ended_at TEXT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS butler_messages (
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
    )`,
    `CREATE INDEX IF NOT EXISTS idx_butler_messages_session_time
     ON butler_messages(session_id, created_at DESC)`,
    `CREATE TABLE IF NOT EXISTS app_settings (
      key_name TEXT PRIMARY KEY,
      value_text TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`
  ]

  return executeBatch(schemaStatements).then(seedIfNeeded)
}

export function getStorageSpaceList() {
  return queryAll(
    `SELECT id, name, parent_id AS parentId, sort_order AS sortOrder
     FROM storage_spaces
     WHERE is_deleted = 0
     ORDER BY sort_order ASC, id ASC`
  )
}

export function addStorageSpace(spaceName) {
  const trimmedName = String(spaceName || '').trim()
  if (!trimmedName) {
    return Promise.reject(new Error('存储空间名称不能为空'))
  }

  return executeSql(
    `INSERT INTO storage_spaces(name, sort_order, is_deleted, created_at, updated_at)
     VALUES (?, 0, 0, datetime('now'), datetime('now'))`,
    [trimmedName]
  ).then(result => ({
    id: result.insertId,
    name: trimmedName
  }))
}

export function addItem({ name, quantity, unit, storageSpaceId }) {
  const trimmedName = String(name || '').trim()
  const numericQuantity = Number(quantity)
  const normalizedName = normalizeKeyword(trimmedName)

  if (!trimmedName) {
    return Promise.reject(new Error('物品名称不能为空'))
  }
  if (!Number.isFinite(numericQuantity) || numericQuantity < 0) {
    return Promise.reject(new Error('数量不合法'))
  }
  if (!storageSpaceId) {
    return Promise.reject(new Error('存放位置不能为空'))
  }

  return executeSql(
    `INSERT INTO items(
      name, normalized_name, is_consumable, quantity, unit, storage_space_id, entry_source, status, is_deleted, created_at, updated_at
    )
    VALUES (?, ?, 1, ?, ?, ?, 'manual', 'active', 0, datetime('now'), datetime('now'))`,
    [trimmedName, normalizedName, numericQuantity, unit || '个', storageSpaceId]
  ).then(result => {
    const itemId = result.insertId
    return executeSql(
      `INSERT INTO item_stock_logs(item_id, change_type, delta_quantity, before_quantity, after_quantity, operator, reason, created_at)
       VALUES (?, 'add', ?, 0, ?, 'user', 'manual', datetime('now'))`,
      [itemId, numericQuantity, numericQuantity]
    ).then(() => itemId)
  })
}

export function getInventoryList({ keyword, storageSpaceId }) {
  const normalized = normalizeKeyword(keyword)
  const params = []
  const whereList = ['items.is_deleted = 0', "items.status = 'active'"]

  if (normalized) {
    whereList.push('(items.normalized_name LIKE ? OR items.name LIKE ?)')
    params.push(`%${normalized}%`, `%${normalized}%`)
  }

  if (storageSpaceId) {
    whereList.push('items.storage_space_id = ?')
    params.push(storageSpaceId)
  }

  return queryAll(
    `SELECT items.id, items.name, items.quantity, items.unit,
            storage_spaces.name AS storageSpaceName,
            storage_spaces.id AS storageSpaceId
     FROM items
     JOIN storage_spaces ON storage_spaces.id = items.storage_space_id
     WHERE ${whereList.join(' AND ')}
     ORDER BY items.updated_at DESC, items.id DESC`,
    params
  )
}

export function getItemDetail(itemId) {
  if (!itemId) {
    return Promise.resolve(null)
  }

  return queryFirst(
    `SELECT items.id, items.name, items.quantity, items.unit, items.is_consumable AS isConsumable,
            storage_spaces.name AS storageSpaceName
     FROM items
     JOIN storage_spaces ON storage_spaces.id = items.storage_space_id
     WHERE items.id = ? AND items.is_deleted = 0`,
    [itemId]
  )
}

export function getInventoryWarnings() {
  return queryAll(
    `SELECT items.id, items.name, items.quantity, items.unit,
            COALESCE(item_warning_profiles.is_warning_muted, 0) AS isWarningMuted
     FROM items
     LEFT JOIN item_warning_profiles ON item_warning_profiles.item_id = items.id
     WHERE items.is_deleted = 0
       AND items.is_consumable = 1
       AND items.quantity <= 1
       AND COALESCE(item_warning_profiles.is_warning_muted, 0) = 0
     ORDER BY items.updated_at DESC`
  ).then(list =>
    list.map(item => ({
      id: item.id,
      name: item.name,
      description: `库存偏低（剩余 ${item.quantity}${item.unit}），建议补货`
    }))
  )
}

export function muteWarningForItem(itemId) {
  return executeSql(
    `INSERT INTO item_warning_profiles(
      item_id, avg_daily_usage, warning_threshold_days, is_warning_muted, warning_muted_at, updated_at
    )
    VALUES (?, 0, 3, 1, datetime('now'), datetime('now'))
    ON CONFLICT(item_id) DO UPDATE SET
      is_warning_muted = 1,
      warning_muted_at = datetime('now'),
      updated_at = datetime('now')`,
    [itemId]
  )
}
