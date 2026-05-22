# Sampora Terminology Glossary

> Canonical terminology source for Sampora website copy, i18n repairs, demo scripts, handoff prompts, and review notes. Future agents that change visible language must follow this glossary before editing EN/ZH/HI copy.

## 1. Usage Rules

- Treat this file as the terminology source for visible-copy and i18n work. The handoff document only indexes it.
- When changing visible copy, update the matching EN, ZH, and HI source surfaces together unless the user's newest message explicitly grants a single-language exception.
- Chinese copy must use the canonical ZH column. Do not leave English role names inside Chinese sentences unless the term is listed as allowed English.
- Hindi copy is Devanagari-first. Retain only accepted SaaS or industry terms such as `Sampora`, `API`, `QC`, `CPI`, `IR/LOI`, `Panel`, and `SaaS` where they are clearer than a forced translation.
- Topology core node labels may stay in English system style, especially uppercase node names. Surrounding console/status/feed/explanatory copy must be localized.
- Do not introduce mojibake, question-mark placeholders, or copied-through English in ZH/HI as a substitute for translation.
- If a requested term is missing here, classify the work as a terminology strategy gap first, add the term to this file or ask for confirmation, then repair page copy.

## 2. Core Glossary

| EN term | ZH canonical | HI canonical | Allowed English in ZH/HI | Avoid / caution | Notes |
|---|---|---|---|---|---|
| Sampora | Sampora | Sampora | Sampora | Do not translate the product name. | Product name stays English. |
| Panel Provider | 自有样本运营方 | स्वामित्व वाला सैंपल ऑपरेटर | Panel | ZH: 面板服务商, 自有 Panel 供应商, Panel Provider as untranslated Chinese copy. HI: fully English `Panel Provider` in Hindi sentences unless a compact label requires it. | User-confirmed Chinese canonical. Means a team operating its own respondent/sample asset. |
| Sample Supplier | 在线样本供应商 | सैंपल आपूर्तिकर्ता | Sample Supplier when used as an English heading or product-system label | Do not treat as identical to Panel Provider. Avoid vague 样本服务商 where the narrower role matters. | Broader supply-side role that can include panel operators, aggregators, stations, subcontractors, and API-connected suppliers. |
| Panel Providers & Sample Suppliers | 自有样本运营方与在线样本供应商 | स्वामित्व वाले सैंपल ऑपरेटर और सैंपल आपूर्तिकर्ता | Panel, Sample Supplier in compact topology/system labels | ZH: Panel Provider 和样本供应商. HI: English-only role pair inside Hindi body copy. | Use for audience positioning and cross-role website claims. |
| Online Sample Operations Platform | 在线样本运营平台 | ऑनलाइन सैंपल ऑपरेशंस प्लेटफॉर्म | SaaS | Global positioning phrase. Avoid generic survey builder framing. | Sampora is operations infrastructure, not a generic survey builder. |
| Project Intake | 项目接收 | प्रोजेक्ट प्राप्ति | Project Intake in compact system labels | Avoid 项目导入 if the meaning is accepting/receiving projects. | Covers manual, API, or workspace-based project receiving. |
| Supplier Allocation | 供应商分配 | सप्लायर आवंटन | Supplier Allocation in system/table labels | Avoid 供应商调度 when the UI specifically assigns suppliers. | Assignment of a project to selected suppliers. |
| Supplier Allocation & Pricing | 供应商分配与定价 | सप्लायर आवंटन और मूल्य निर्धारण | Supplier Allocation & Pricing in EN headings | Avoid overclaiming quota/device/hourly controls unless current product evidence supports it. | Includes assign, block, and supplier-specific price controls. |
| Review & Settlement | 审核与结算 | समीक्षा और सेटलमेंट | QC, Settlement | Avoid translating review as only 审阅 when it means audit/QC. | Workflow stage after delivery tracking and before billing. |
| Review evidence | 审核证据 | समीक्षा प्रमाण | QC evidence | Avoid vague 证据链 unless traceability is being discussed. | Evidence used to audit completes, rejects, callbacks, or IDs. |
| Callback Logs | 回调日志 | कॉलबैक लॉग्स | Callback Logs, API | Avoid 回调记录 only when the UI module is named logs. | Integration callback traceability. |
| Settlement | 结算 | सेटलमेंट | Settlement | Avoid 付款 as a synonym. Payment is only one settlement state/action. | Financial settlement process. |
| Project Settlement | 项目结算 | प्रोजेक्ट सेटलमेंट | Project Settlement | Avoid 项目付款. | Settlement tied to project results and audit status. |
| Supplier Bills | 供应商账单 | सप्लायर बिल्स | Supplier Bills | Avoid 供应商发票 unless the document is actually an invoice. | Payable bills owed to suppliers. |
| Client Invoices | 客户发票 | क्लाइंट इनवॉइस | Client Invoices | Avoid 客户账单 where invoice issuance is meant. | Receivables/invoice module for clients. |
| Finance Logs | 财务日志 | फाइनेंस लॉग्स | Finance Logs | Avoid 操作日志 if the record is financial. | Supplier, employee, member, or client finance records. |
| Payment Status | 付款状态 | भुगतान स्थिति | Payment Status | Do not collapse into settlement status unless the UI combines them. | State such as pending, paid, rejected, or received. |
| Member / Respondent Portal | 会员 / 受访者门户 | सदस्य / उत्तरदाता पोर्टल | Portal | Avoid English-only respondent portal in ZH/HI body copy. | Participant-facing access surface. |
| Respondent | 受访者 | उत्तरदाता | Respondent in research-metric shorthand only | Avoid 会员 when the person is not registered as a panel member. | Person answering the survey. |
| Panel Member | 样本会员 | सैंपल सदस्य | Panel | Avoid 面板会员 in polished Chinese website copy unless mirroring a backend label. | Registered member inside an owned sample/panel asset. |
| Survey Station | 调查站 | सर्वे स्टेशन | Survey Station in system labels | Avoid Fieldwork Agency for Sampora positioning. | Execution unit or station that can run member/respondent operations. |
| Supplier Workspace | 供应商工作台 | सप्लायर वर्कस्पेस | Workspace | Avoid supplier console if the product term is workspace. | Supplier-side Sampora workspace for receiving/managing assigned projects. |
| Admin Console | 管理控制台 | एडमिन कंसोल | Console | Avoid leaving console/status/feed surrounding text in English on ZH/HI pages. | Backend/admin operating surface. |
| Workspace | 工作台 | वर्कस्पेस | Workspace | ZH must use 工作台. | User-confirmed Chinese canonical. |
| API / Workspace Receiving | API / 工作台接收 | API / वर्कस्पेस प्राप्ति | API, Workspace | Avoid treating API-only as the whole flow. | Suppliers may receive projects through API or inside Sampora workspace. |
| Tenant | 租户 | टेनेंट | Tenant | Avoid 客户 when referring to the system tenancy boundary. | Organization account boundary. |
| Department | 部门 | विभाग | Department | None. | Organization structure. |
| Role | 角色 | भूमिका | Role | None. | Permission grouping. |
| Staff permissions | 员工权限 | स्टाफ अनुमतियां | Permissions | Avoid team rights unless the UI means employee/staff permissions. | Access control for staff. |
| Operating rules | 运营规则 | संचालन नियम | Operating rules | Avoid governance if the term is day-to-day operation rules. | Policy/rules controlling project operations. |
| Governance controls | 治理控制 | गवर्नेंस नियंत्रण | Governance | Avoid risk controls if the scope is broader than risk/security. | Controls for admin, compliance, rules, and oversight. |
| Delivery Tracking | 交付追踪 | डिलीवरी ट्रैकिंग | Delivery Tracking | Avoid project management when specifically tracking delivery metrics. | Participation, completes, rejects, audit, callback, and status tracking. |
| Completes | 完成量 | Completes | Completes | Avoid 完成人数 if the metric is complete count. | Standard sample-delivery metric; English is acceptable in HI dashboards. |
| QC Pass | 质检通过 | QC पास | QC | Avoid audit pass if the local module says QC. | Accepted/valid respondent result after quality control. |
| CPI | CPI / 单个有效完成价格 | CPI | CPI | Do not introduce AI Value / Acceptance Index. | Cost per interview / cost per complete. |
| IR | IR / 命中率 | IR | IR | Do not expand to unrelated acceptance metrics. | Incidence Rate. |
| LOI | LOI / 访谈时长 | LOI | LOI | None. | Length of Interview. Use `IR/LOI` when paired. |
| Quota | 配额 | कोटा | Quota | Avoid target count if the UI means quota. | Required completes or target allocation. |
| Launch rules | 上线规则 | लॉन्च नियम | Launch rules | Avoid campaign launch language if the page is project operations. | Rules for bringing a project online. |
| Supplier pricing | 供应商定价 | सप्लायर मूल्य निर्धारण | Supplier pricing | Avoid supplier CPI unless CPI is explicitly the field. | Supplier-specific project price settings. |
| Block suppliers | 屏蔽供应商 | सप्लायर ब्लॉक करें | Block suppliers | Avoid blacklist unless the UI/policy explicitly uses blacklist. | Excluding unsuitable suppliers from a project. |
| Export controls | 导出控制 | एक्सपोर्ट नियंत्रण | Export controls | Do not confuse with geopolitical export controls; this is data/export permission control. | Data export, report export, or permission gating. |
| Partner Network | 合作网络 | पार्टनर नेटवर्क | Partner Network | Avoid generic resources if the feature is the network. | Helps clients find suppliers and suppliers find clients. |
| Panel plan / Panel version | 样本库运营版 | Panel ऑपरेशंस संस्करण | Panel in EN product plan names | ZH pricing/version cards must not leave `Panel` as the visible version name. Do not use 自有受访者团队 as the plan name. | User-confirmed Chinese version name for the homepage/pricing plan card. |
| Supplier Network plan / Supplier Network version | 供应商网络运营版 | सप्लायर नेटवर्क ऑपरेशंस संस्करण | Supplier Network in EN product plan names | ZH pricing/version cards must not leave `Supplier Network` as the visible version name. | User-confirmed Chinese version name for the homepage/pricing plan card. |
| Enterprise plan / Enterprise version | 企业版 | एंटरप्राइज संस्करण | Enterprise in EN product plan names | ZH pricing/version cards must not leave `Enterprise` as the visible version name. | User-confirmed Chinese version name for the homepage/pricing plan card. |
| SAMPLE SUPPLY POOL | SAMPLE SUPPLY POOL | SAMPLE SUPPLY POOL | Required topology node label | Do not translate the core uppercase topology node. | Core topology node may remain English. Explanatory copy around it must be localized. |
| SUPPLY SOURCES | SUPPLY SOURCES | SUPPLY SOURCES | Required topology node label | Do not translate the core uppercase topology node. | Covers owned panel, aggregator, station, subcontractor, and API supplier. |
| REVIEW | REVIEW | REVIEW | Required topology node label | Surrounding ZH/HI console copy should say 审核 / समीक्षा. | Core topology stage label may remain English. |
| SETTLE / SETTLEMENT | SETTLE / SETTLEMENT | SETTLE / SETTLEMENT | Required topology node label | Surrounding ZH/HI console copy should say 结算 / सेटलमेंट. | Core topology stage label may remain English. |
| OPERATION FEED | OPERATION FEED | OPERATION FEED | Required topology node label | Surrounding ZH/HI feed entries must be localized. | Feed title can remain English only as a topology/system node. |

## 3. Topology Policy

- Core topology nodes can keep system-style uppercase English: `SAMPLE SUPPLY POOL`, `SUPPLY SOURCES`, `REVIEW`, `SETTLE`, `SETTLEMENT`, and `OPERATION FEED`.
- Surrounding non-node text must be localized: console lines, status chips, captions, route descriptions, modal explanatory text, operation-feed entries, and helper copy.
- Topology supplier-source labels should represent multiple sample supply sources, not only panels. Preferred source set: owned panel, sample aggregator, survey station, subcontractor, and API supplier.
- Do not revert topology terminology to `SUPPLIER POOL` when the current positioning needs `SAMPLE SUPPLY POOL`.
- Do not use `Audience Source` or `Audience Owner` as the primary Sampora audience positioning unless the user explicitly asks for broader ecosystem language.

## 4. Front-of-Site Display Policy

- Current approved P0-2 strategy is homepage/front-of-site display terminology governance only, not a backend data-model change and not a topology/workflow animation logic change.
- Homepage and other front-of-site surfaces may use neutral supply-side display labels such as `RESP_03 / respondent ops`, `PARTNER_04 / delivery partner`, and `Supplier pool active` to reduce the visual prominence of `Survey Station` and `Subcontractor`.
- `Survey Station` and `Subcontractor` are not deleted from the business taxonomy. They may still exist as supply sources, backend business roles, or topology source concepts where the assigned task and current evidence require them.
- Future agents must not classify `RESP_03`, `respondent ops`, `PARTNER_04`, `delivery partner`, or `Supplier pool active` as a terminology regression by themselves. Treat them as allowed front-of-site display wording unless fresh current evidence shows a page-specific glossary conflict.

## 5. Hindi Style

- Use Devanagari-first Hindi for body, status, and explanatory copy.
- Keep `Sampora`, `API`, `QC`, `CPI`, `IR/LOI`, `Panel`, `SaaS`, and compact dashboard metrics in English where they are expected industry/product terms.
- Avoid full English role strings inside Hindi sentences when a canonical Hindi phrase exists. For example, prefer `स्वामित्व वाले सैंपल ऑपरेटर और सैंपल आपूर्तिकर्ता` over `Panel Provider, Sample Supplier` in a Hindi body sentence.
- Product UI terms can use common Hindi/SaaS hybrids where they read naturally: `वर्कस्पेस`, `एडमिन कंसोल`, `पार्टनर नेटवर्क`, `डिलीवरी ट्रैकिंग`, `सेटलमेंट`.
- Do not count Hinglish alone as sufficient if the visible Hindi surface is mostly English. The page should read as Hindi with retained product terms, not English with a few Hindi suffixes.

## 6. Handoff Index Text

Use this short index in handoff prompts and future worker instructions:

```text
Terminology source: read `SAMPORA_TERMINOLOGY_GLOSSARY.md` before changing any EN/ZH/HI visible copy, i18n key, topology label, workflow copy, pricing/FAQ/footer/CTA copy, dynamic sample/project data, or resource-manual language. Follow its canonical EN/ZH/HI glossary, topology policy, and Hindi style rules. If a term is missing or conflicts with the newest user instruction, classify it as a terminology strategy gap before page repair.
```

## 7. Acceptance / Ledger Linkage

- Acceptance category: `Language/i18n`.
- Related recurring ledger row: `TERMINOLOGY-001`.
- Related i18n guard: `I18N-001`.
- Validation tier for glossary-only changes: Scoped docs/strategy check.
- Completion proof should include static content checks for this file, the handoff index, `ACCEPTANCE_TESTS.md`, and `ISSUE_LEDGER.md`, plus the active handoff mojibake guard and final static audit when practical.
