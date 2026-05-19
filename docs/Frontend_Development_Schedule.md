# 物归处 (ItemFinder) 前端开发排期表与实施注意事项

## 1. 文档目的

本文件用于衔接以下文档并指导前端落地：
- `docs/MVP.md`
- `docs/Frontend_Architecture.md`
- `docs/Database_Design.md`

目标：
- 明确前端静态页面与基础能力的开发顺序
- 明确通用能力（layout、公用方法、字典 dict）先行原则
- 预留 Figma 设计节点位置，便于后续按节点生成与开发

---

## 2. 前端排期总览（建议 4 周）

> 说明：排期优先保证“先框架、后页面、再联调”。  
> 当前 Figma 文件统一使用同一个 `fileKey`：`GfLcSHgMdqtWeFzqzSS1o9`

| 周次 | 阶段 | 目标 | 关键任务 | 交付物 | Figma fileKey | Figma nodeId |
|---|---|---|---|---|---|---|
| 第 1 周 | 基础框架搭建 | 完成可复用前端骨架 | 建立导航结构、layout、公用样式、状态与目录规范，优先完成 `BottomTabBar` | 可运行骨架工程 + 公共组件初版 | `GfLcSHgMdqtWeFzqzSS1o9` | `221:4` |
| 第 2 周 | 核心页面静态开发 | 完成 4 个 Tab 主页面静态还原 | 首页、录入页、查找页、物品列表页；接入公共组件 | 4 个主页面静态版 + 占位交互 | `GfLcSHgMdqtWeFzqzSS1o9` | `1:84` `1:1028` `1:465` `1:924` |
| 第 3 周 | 衍生页与弹窗 | 完成衍生页面与核心弹窗 | 录入表单页、详情页、储物空间页、预警弹窗、添加空间弹窗 | 业务流程静态可走通 | `GfLcSHgMdqtWeFzqzSS1o9` | `16:162` `1:168` `1:653` `1:336` `1:3293` |
| 第 4 周 | 联调与优化 | 完成数据联调和体验优化 | SQLite 数据联调、检索/筛选、异常态、空状态与 UI 细节收口 | 可演示版本（前端） | `GfLcSHgMdqtWeFzqzSS1o9` | `1:866` `1:747` `1:394` |

---

## 3. 页面级排期拆解（含 Figma 占位）

| 页面/模块 | 优先级 | 开发阶段 | 依赖组件 | 数据依赖 | Figma fileKey | Figma nodeId | 备注 |
|---|---|---|---|---|---|---|---|
| 首页 `HomeDashboard` | P0 | 第 2 周 | `BottomTabBar` `TopNavBar` `InventoryWarningModal` | `items` `item_warning_profiles` | `GfLcSHgMdqtWeFzqzSS1o9` | `1:84` | 启动时检查预警 |
| 录入页 `ItemEntrySelection` | P0 | 第 2 周 | `BottomTabBar` `TopNavBar` `EntryTypeCard` | 无（静态阶段） | `GfLcSHgMdqtWeFzqzSS1o9` | `1:1028` | 四种录入入口 |
| 查找物品页 `ItemSearch` | P0 | 第 2 周 | `BottomTabBar` `TopNavBar` `SearchBar` | `items` `storage_spaces` | `GfLcSHgMdqtWeFzqzSS1o9` | `1:465` | 手动+AI入口 |
| 查找物品页空状态 `ItemSearchEmpty` | P0 | 第 2 周 | `BottomTabBar` `TopNavBar` `SearchEmptyState` | 无（静态阶段） | `GfLcSHgMdqtWeFzqzSS1o9` | `1:866` | 需与正常态共用页面结构 |
| 物品列表页 `InventoryList` | P0 | 第 2 周 | `BottomTabBar` `TopNavBar` `FilterBar` `ItemCard` | `items` `storage_spaces` | `GfLcSHgMdqtWeFzqzSS1o9` | `1:924` | 列表/筛选/搜索 |
| 录入表单页 `ItemEntryForm` | P0 | 第 3 周 | `TopNavBar` `AddStorageModal` `FormField` | `items` `storage_spaces` | `GfLcSHgMdqtWeFzqzSS1o9` | `16:162` | 支持新增空间 |
| 录入表单下拉列表 `StorageSpaceDropdown` | P0 | 第 3 周 | `DropdownList` `DropdownOption` | `storage_spaces` | `GfLcSHgMdqtWeFzqzSS1o9` | `1:747` | 作为表单页子状态 |
| 添加存储空间弹窗 `AddStorageModal` | P0 | 第 3 周 | `ModalMask` `Input` `Button` | `storage_spaces` | `GfLcSHgMdqtWeFzqzSS1o9` | `1:168` | 多页面复用 |
| 库存预警弹窗 `InventoryWarningModal` | P0 | 第 3 周 | `ModalMask` `Button` | `item_warning_profiles` `items` | `GfLcSHgMdqtWeFzqzSS1o9` | `1:653` | 支持“不再提醒” |
| 物品详情页 `ItemDetail` | P0 | 第 3 周 | `TopNavBar` `InfoCard` `StockPanel` | `items` `item_stock_logs` | `GfLcSHgMdqtWeFzqzSS1o9` | `1:336` | 展示余量与位置 |
| 储物空间列表页 `StorageSpaceList` | P0 | 第 3 周 | `TopNavBar` `SpaceCard` `AddStorageModal` | `storage_spaces` | `GfLcSHgMdqtWeFzqzSS1o9` | `1:3293` | 底部按钮开弹窗 |
| 登录页 `AuthLogin` | P1 | 第 4 周（可延后） | `TopNavBar` `FormField` | 后续账号体系 | `GfLcSHgMdqtWeFzqzSS1o9` | `1:394` | MVP 可不启用 |
| 注册页 `AuthRegister` | P1 | 第 4 周（可延后） | `TopNavBar` `FormField` | 后续账号体系 | `未提供` | `未提供` | 待设计 |
| 管家按钮 `ButlerFAB`+交互层 | P1 | 第 4 周（预研） | `ButlerFAB` `ButlerChatMask` `ButlerResponseCard` | `butler_sessions` `butler_messages` | `未提供` | `未提供` | 待设计 |

---

## 4. 前端开发必须先做的 3 件事

### 4.1 先整理框架与 layout

要求：
- 将高频复用组件统一放入 `src/layout` 或 `src/components/layout`
- 首批必须落地的 layout 组件：
  - `BottomTabBar`
  - `TopNavBar`
  - `PageContainer`
  - `ModalMask`
  - `FloatingActionContainer`

产出标准：
- 新页面默认通过 `PageContainer + TopNavBar` 组合搭建
- Tab 页面统一接入 `BottomTabBar`
- 弹窗统一走 `ModalMask`，禁止页面内重复写遮罩逻辑

### 4.2 写好常用公共方法并全局可用

要求：
- 将常用方法统一放入 `src/utils` 和 `src/services`
- 通过统一入口导出，避免页面直接散落 import 多处重复代码

建议首批公共方法：
- `normalizeKeyword`：搜索关键字标准化（去空格、小写）
- `formatQuantityText`：数量与单位格式化
- `buildStoragePathText`：储物空间路径文本拼接
- `safeParseJson`：兜底 JSON 解析
- `createPromiseTask`：统一 Promise 错误处理包装

全局使用建议：
- 页面层通过统一 `services` 访问数据，不直接拼 SQL
- 通用方法在入口文件做聚合导出，保证调用路径一致

### 4.3 建立本地字典 dict

要求：
- 在 `src/dict` 下建立本地静态字典，避免业务“魔法字符串”

建议首批字典：
- `entrySourceDict`：`camera | barcode | receipt | manual`
- `itemStatusDict`：`active | archived | depleted`
- `warningActionDict`：`remindLater | muteWarning`
- `butlerIntentDict`：`findItem | moveItem | addItem`
- `storageTypeDict`：可选，区分柜体/抽屉/桌面等空间类型

产出标准：
- 页面展示文案统一通过 dict 映射，不在页面硬编码
- 数据库存储值与 dict key 对齐，降低联调歧义

---

## 5. Figma ID 填写规范（你后续补充）

每个页面/组件至少填写：
- `fileKey`：Figma 文件 Key
- `nodeId`：目标 Frame 或组件节点 ID

当前已确认：

| 模块名称 | fileKey | nodeId | 备注 |
|---|---|---|---|
| BottomTabBar | `GfLcSHgMdqtWeFzqzSS1o9` | `221:4` | 公共底部栏组件 |
| HomeDashboard | `GfLcSHgMdqtWeFzqzSS1o9` | `1:84` | 首页主 Frame |
| ItemEntrySelection | `GfLcSHgMdqtWeFzqzSS1o9` | `1:1028` | 录入页 |
| ItemSearch | `GfLcSHgMdqtWeFzqzSS1o9` | `1:465` | 查找物品页 |
| ItemSearchEmpty | `GfLcSHgMdqtWeFzqzSS1o9` | `1:866` | 查找空状态 |
| InventoryList | `GfLcSHgMdqtWeFzqzSS1o9` | `1:924` | 物品列表页 |
| ItemEntryForm | `GfLcSHgMdqtWeFzqzSS1o9` | `16:162` | 录入表单页 |
| StorageSpaceDropdown | `GfLcSHgMdqtWeFzqzSS1o9` | `1:747` | 下拉列表状态 |
| AddStorageModal | `GfLcSHgMdqtWeFzqzSS1o9` | `1:168` | 添加存储空间弹窗 |
| InventoryWarningModal | `GfLcSHgMdqtWeFzqzSS1o9` | `1:653` | 库存预警弹窗 |
| ItemDetail | `GfLcSHgMdqtWeFzqzSS1o9` | `1:336` | 物品详情页 |
| StorageSpaceList | `GfLcSHgMdqtWeFzqzSS1o9` | `1:3293` | 储物空间列表页 |
| AuthLogin | `GfLcSHgMdqtWeFzqzSS1o9` | `1:394` | 登录页 |
| AuthRegister | `未提供` | `未提供` | 待设计 |
| ButlerFAB / ButlerChatMask | `未提供` | `未提供` | 待设计 |

Figma MCP 使用说明：
- 最稳定的输入是 `fileKey + nodeId`
- 完整链接也可以，但我最终仍需要从链接中提取出 `fileKey` 和 `nodeId`
- 你这批链接里 `fileKey` 已统一为 `GfLcSHgMdqtWeFzqzSS1o9`
- `node-id=1-84` 这类值在文档中建议统一记为 `1:84`，便于直接传给 MCP
- 如果 MCP 返回 `403 Forbidden`，通常表示 Figma 文件权限未开放给当前 MCP 所使用的账号或 Token，而不是节点格式错误

---

## 6. 开发注意事项清单

- 先公共、后页面：未完成 `layout + utils + dict` 前，不进入批量页面开发
- 先静态、后联调：先完成布局与交互占位，再接 SQLite 数据
- 枚举值统一：页面、服务层、数据库使用同一套字典 key
- 弹窗行为统一：关闭、确认、取消、遮罩点击策略全局一致
- 预警支持静默：预警模块必须支持“不再提醒”并联动数据库字段
- 目录语义化：按 `layout/components/pages/services/utils/dict` 分层

---

## 7. 里程碑验收标准

- M1（第 1 周末）：框架与公共能力完成，至少 5 个 layout/通用模块可复用
- M2（第 2 周末）：4 个主页面静态完成，可从底部栏完整跳转
- M3（第 3 周末）：衍生页与弹窗完成，核心录入与检索流程可演示
- M4（第 4 周末）：SQLite 联调完成，搜索/筛选/预警流程可闭环

---

## 8. 下一步开发流程（按当前资料）

### 8.1 先决条件

- 确认 Figma MCP 访问权限可用
- 补齐未设计页面或先标记为延后：
  - `AuthRegister`
  - `ButlerFAB`
  - `ButlerChatMask`
  - `ButlerResponseCard`

### 8.2 建议执行顺序

1. 先生成并实现公共布局组件
   - `BottomTabBar`
   - `TopNavBar`（若设计里未单独拆出，可先按页面中重复结构抽象）
   - `PageContainer`
   - `ModalMask`
2. 再开发 4 个带底部栏主页面静态版本
   - 首页
   - 录入页
   - 查找物品页（含空状态）
   - 物品列表页
3. 再开发衍生页和弹窗
   - 录入表单页
   - 下拉列表状态
   - 添加存储空间弹窗
   - 库存预警弹窗
   - 物品详情页
   - 储物空间列表页
4. 最后接 SQLite 数据与状态流转
   - 首页统计
   - 搜索与筛选
   - 录入保存
   - 预警静默

### 8.3 你接下来给我的内容

- 若 Figma 权限打通：直接给我一句“开始生成 `BottomTabBar`，fileKey 是 `GfLcSHgMdqtWeFzqzSS1o9`，nodeId 是 `221:4`”
- 若继续补设计：优先补 `注册页` 与 `管家按钮/对话层`
- 若不补设计：我也可以先按现有页面开始搭前端静态骨架
