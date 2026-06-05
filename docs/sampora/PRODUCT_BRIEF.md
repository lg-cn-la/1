# Sampora Product Brief

This is the current public-facing product brief for Sampora. Older SurveySaaS and FenSvyG material in this repository is historical context unless this `docs/sampora/` set says otherwise.

## Current Brand

- Public brand: Sampora
- Public category: Online Sample Operations Platform
- Audience: panel providers, sample suppliers, sample operations teams, supplier operations teams, partner network teams, and enterprise sample operations teams
- Initial public market focus: India

Use `Survey Execution Site` or `Execution Site` for the current public execution-site concept. Do not reintroduce `Survey Station` as the current public module name.

## What Sampora Does

Sampora helps sample operations teams manage the operating path around online sample delivery:

- Project intake
- Project launch and delivery rules
- Supplier allocation and routing
- Supplier-specific pricing
- Supplier blocking
- Delivery tracking
- Delivery review and rejection records
- Review records and settlement-ready evidence
- Client invoices, supplier bills, and finance logs
- Partner and cooperation resources
- API-connected supplier handoff
- Supplier workspace handoff

The core workflow can be described as:

```text
Project intake
-> Delivery rules / project setup
-> Supplier allocation / routing
-> Delivery tracking
-> Review and rejection records
-> Settlement-ready evidence
-> Supplier bills / client invoices / finance logs
-> Partner network expansion
```

## What Sampora Is Not

Do not describe Sampora as:

- A generic survey builder
- A generic project management tool
- A traffic monetization platform
- A pure sample marketplace
- A questionnaire editor
- A research report tool
- A SurveyMonkey or Typeform equivalent

Sampora is operations infrastructure for sample delivery teams, not a general-purpose survey creation product.

## Public Product Lines

Current public and sales material may use:

- Sampora Panel
- Sampora Supplier Network
- Sampora Enterprise

These product lines should be framed around the operating responsibility of the buyer, not as separate public brands.

## Role Value

Sampora is useful for teams that need to receive projects, coordinate supply, review delivery, and prepare settlement records without splitting work across spreadsheets, chat threads, and disconnected supplier systems.

- Panel providers can manage owned sample operations, respondent/member workflows, delivery records, review evidence, and settlement checks.
- Sample suppliers can coordinate assigned projects, delivery progress, callbacks, review records, bills, and exportable finance records.
- Supplier operations teams can assign selected suppliers, block unsuitable suppliers, set supplier-specific pricing, and keep routing decisions traceable.
- Partner network teams can turn discovered cooperation resources into managed clients or suppliers.
- Enterprise sample operations teams can coordinate clients, suppliers, panels, API handoff, permissions, review records, finance, and cooperation resources in one workspace.

## Supplier Control Boundaries

Supported public wording:

- Choose assigned suppliers
- Block specific suppliers
- Set supplier-specific pricing

Do not claim supplier-level quota limits, device limits, hourly traffic limits, or hourly completion limits unless fresh product evidence explicitly supports that exact control.

## Settlement Wording

Allowed settlement descriptions:

- Sampora can generate and push bills according to customer configuration.
- Sampora can support automatic review before manual review, then move reviewed delivery into billing.

Avoid implying automatic payment, guaranteed payout, or unattended finance approval unless a specific implementation proves it.

## Partner Network Logic

Cooperation resources are not a simple directory. The current business logic is:

```text
External supplier or cooperation resource is discovered
-> Cooperation is established
-> The relationship becomes an internal supplier or client
-> Later work can be managed through the internal supplier/client workflow
```

## API And Workspace Supplier Handoff

If a supplier does not use Sampora, the supplier can receive or see assigned project work through API integration.

If the supplier also uses Sampora, the supplier can see and manage assigned projects in its own Sampora workspace.

Do not frame API-only receiving as the whole supplier handoff flow. Use `API / Workspace Receiving` where both paths are in scope.

## Contact Role Values

When documentation mentions Contact role values, use the current frontend contract:

```text
panel_provider
sample_supplier
client_side
two_sided_operations
aggregator_network
api_supplier
enterprise_multi_entity
not_sure
Other
```

`Other` remains capitalized because current frontend logic may depend on that exact value.
