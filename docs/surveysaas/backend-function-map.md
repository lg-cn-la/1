# SurveySaaS Backend Function Map

> Source: live demo admin scan on 2026-05-14, compared with `product-positioning-summary.md` and `sample-supplier-taxonomy.md`.
> Scope: menu structure, major fields, buttons, workflow hints, and website-facing value points. Permission differences were not tested. Partner cloud resources were only checked at entry level because that area is still under development.

## 1. Product Alignment

The admin backend matches the current GitHub product positioning: SurveySaaS is not a generic survey builder. It is a sample operations platform covering client management, supplier management, project delivery, API/hybrid project intake, settlement, finance, operational records, survey-station/member operations, organization permissions, and security/configuration.

The strongest website-facing product claim should remain:

**Online sample operations platform for panel providers, sample suppliers, and research subcontracting teams.**

The backend provides concrete proof for these capabilities:

- **Project delivery operations:** project list, intake, scheduling, allocation, online/offline actions, analysis, settlement.
- **Supplier network operations:** supplier profiles, supplier levels, B2B/B2C switches, country availability controls, supplier member records, supplier bills.
- **Client operations:** client profile, client assignment mode, API-client switch, project view, client analytics, invoice management.
- **Finance and settlement:** project settlement, supplier bills, customer invoices, supplier/employee finance logs, audit and approval states.
- **Risk and traceability:** operation logs, termination records, callback records, security configuration, event notification, pre-screen library.
- **Panel/survey-station mode:** survey projects, member management, member groups/levels, member finance, site settings.

## 2. Backend Menu Map

### Home

- **Data Center:** revenue, participate count, complete count, audit count, pending alerts, supplier ranking, OS distribution, audit trend, type distribution, rejection trend, collection trend.
- **Client Board / Supplier Board:** visible as dashboard-level views, not deeply tested in this pass.

### Client

- **Client List**
  - Filters: client ID, client selector, client name, company name, status.
  - Table fields: client ID, client name, short name, settlement cycle, allocation mode, status, actions.
  - Row actions: project, edit, analysis, delete.
  - Create/Edit fields: client name, short name, company name, phone, email, contact, settlement cycle, currency, payment rule, client assignment, department assignment mode, status, rebate ratio, pre-screening, API client.
  - Configuration tabs/sections: basic configuration, risk control, security check configuration, callback and redirect, invoice template.
  - Project action opens a project-view dialog with filters for project name, project ID, client source, country, and sort. This appears to show projects linked to the selected client.
  - Analysis action opens a client analytics board with project metrics, live/update/rejection data, revenue, participation, completes, audit count, audit rate, ID pass rate, invoice summary, and supplier ranking.

### Supplier

- **Supplier List**
  - Filters: supplier ID, supplier name, contact/name, company name, phone, email, level, status.
  - Table fields: supplier, level, region, available wallet, pending-review wallet, settlement cycle, B2B, status, created date, actions.
  - Create/Edit fields: account type, account name, region, phone, email, settlement cycle, level, contact, preferred currency, finance type, password.
  - Enterprise supplier fields: company name, legal representative, tax number.
  - Project controls: status, B2B switch, B2C switch, control type, default open, specified-only, country/region open list, disabled-region list.
  - Configuration sections: basic configuration, finance information, callback and redirect.
- **Sub-member List**
  - Filters: ID, UID, supplier ID, supplier member ID, local member ID, record ID, project ID.
  - Table fields: member ID, supplier, supplier member, local member, UID, created time, updated time, actions.
  - Action: view profile.
- **Supplier Level**
  - Supports supplier-level management. The live supplier list shows level names with percentage values, such as mid/high supplier levels.
- **Panel Book**
  - Listed as a supplier-side function. Not deeply tested in this pass.

### Project

- **Project List**
  - Filters: project ID, project name/alias, client, region, department, assignment object.
  - Table fields: project, participate/complete/quota/access/limit, region, CPI, IR/LOI, client, updated time, actions.
  - Top actions: create project, online, offline, project scheduling, project intake.
  - Row actions: online/offline, edit, allocate, analysis.
  - Observed project examples include project code, numeric project ID, global region, unallocated status, CPI, IR, LOI, client, owner/account, created/updated time.
  - Analysis opens project analytics with OS/browser breakdown and participate/complete/audit-pass metrics. It includes tabs/sections such as main settings and sample analysis.
- **Project Allocation**
  - Allocation action exists from the project list. It should be treated as the core supplier-allocation surface. A deeper allocation-specific field audit is still recommended because the dialog is dynamic and was partially obscured during scanning.
- **Hybrid API**
  - Filters/table fields: current pool, keyword/project ID, source, client, geography, status, project ID, project name, source, supplier, country, CPI, created time, refresh time, status, actions.
  - Actions: edit pool, create pool, refresh pool, filter.
  - Create-pool fields: pool name, source selection, API client selection, local project selection, CPI rule, between/greater-than/less-than, CPI currency, CPI range, scheduled refresh interval in minutes.
  - Edit-pool requires selecting an existing pool first.
- **Project Scheduling**
  - Filters: project ID, project name, scheduling type, supplier, client.
  - Table fields: project ID, project name, supplier, scheduling type, created time, updated time, status, actions.
  - Actions: batch delete, create scheduling.
- **Project Settlement**
  - Filters: project ID, project name, client, region, status, PO, remark, invoice number.
  - Table fields: project, name/identifier, completes, audit count, CPI, PO/Remark, status, date, total amount, actions.
  - Actions: create project settlement, batch invoice, export, audit, view.
  - Observed status: pending audit.
  - View dialog shows data board, completes, pass count, rejection count, rejection rate, supplier-level completes/pass/rejection/rejection rate, and settlement audit flow.
  - Audit dialog fields/actions: PO, modify price, currency unit, remark, pass IDs, audit by pass IDs, audit by rejected IDs, approve all, reject all, temporary data save.
  - Create settlement fields: project ID and project name. API projects may use a project name such as `CRAPI-6591126`.

### Finance

- **Supplier Finance Log / Employee Finance Log**
  - Listed as finance records; not deeply tested in this pass.
- **Supplier Bills**
  - Filters: bill ID, supplier, status.
  - Table fields: bill date, bill ID, supplier, currency, billing period, bill amount, fee, actual payment, bill status, actions.
  - Actions: create supplier bill, batch pay, batch reject, export.
  - Create supplier settlement fields: settlement selection, all suppliers, specified supplier, amount. Minimum settlement amount提示: 50.
  - Batch pay/reject had no rows to operate on in the demo account, so detailed status transition could not be confirmed.
- **Employee Bills**
  - Listed under finance; not deeply tested.
- **Client Invoice**
  - Filters: ID, invoice number, client, invoice status, invoice date.
  - Table fields: ID, client, invoice number, amount, amount received, fee, issuer, status, date, remarks, actions.
  - Actions: create client invoice, export.

### Records

- **Survey Records / Operation Logs / Termination Records / Callback Records**
  - These modules support traceability for delivery records, backend operations, project termination, and integration callbacks.
  - They align strongly with the product positioning around auditability, callback tracking, and operational risk control.

### Auxiliary

- **Articles / Notification Center / IP Query / UID Parsing / UID Sorting / Link Parsing**
  - These are operational support tools.
  - UID and link tools are useful website proof points for sample-delivery debugging and respondent-routing operations.

### Organization

- **Employee Management / Department Management / Role Management / Commission Rules**
  - These modules support internal team, department, permission, and commission workflows.
  - Role/permission differences were not tested in this scan.

### Survey Station

- **Data Board / Data Analysis / Project Management / Survey Records / Termination Records / Site Settings / Project Scheduling**
- **Member Management / Member Groups / Member Levels**
- **Member Finance Logs / Employee Finance Logs / Member Bills / Employee Bills**
- **Survey-station Organization: Department / Employee / Role**

This module supports the `Survey Station / Execution Unit` role described in `sample-supplier-taxonomy.md`, including member operations, survey delivery, member finance, and station-level configuration.

### Configuration

- **System Settings / Data Dictionary / Pre-screen Library / Third-party Configuration / Event Notification / Security Configuration**
  - These modules map to platform administration, integration setup, callback/event workflows, risk/security controls, and reusable pre-screen assets.
  - They were only menu-scanned; detailed field-level review remains optional.

### Partner Cloud Resources

- Entry: account dropdown -> cooperation cloud resources.
- Current page: overview with supplier onboarding and cloud-client onboarding cards.
- Actions observed: open cloud supplier service, open cloud client service.
- Not deeply reviewed because this area is still under active development.

## 3. Website-Facing Value Points

Use the backend evidence to make the website more concrete:

- **Run online sample delivery end to end:** intake projects, configure delivery, allocate suppliers, monitor participation/completes/audits, and settle results.
- **Manage clients and suppliers in one operating layer:** client profiles, supplier profiles, supplier levels, settlement cycles, assignment rules, API-client settings, and supplier availability controls.
- **Control supplier access by project and region:** supplier allocation, B2B/B2C switches, default-open/specified-only controls, and country availability lists.
- **Support API and workspace-based project flow:** hybrid API pools, API-client source selection, local project pools, CPI rules, and scheduled refresh.
- **Close the finance loop:** project settlement, audit workflow, supplier bills, client invoices, fees, payment status, and finance logs.
- **Audit and debug delivery:** operation logs, callback records, termination records, UID tools, IP lookup, and link parsing.
- **Support panel and survey-station teams:** member management, member groups/levels, member finance, station projects, and station-specific roles.

## 4. Remaining Unknowns

- Project allocation needs a focused review with a clean project state to confirm exact supplier selection, supplier blocking, and supplier-specific CPI/price fields.
- Batch supplier bill payment/rejection needs bill rows to confirm the full status flow.
- Client invoice creation was observed only at list/action level; detailed invoice-form fields were not deeply reviewed.
- Configuration pages were only scanned at menu level. Third-party configuration, event notification, pre-screen library, and security configuration can be audited later if the website needs technical proof points.
- Permission differences across roles were intentionally skipped.
- Partner cloud resources were intentionally not deep-dived because the feature is still under development.

