# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro + Tailwind CSS 4, TypeScript where needed, Astro View Transitions (ClientRouter), Locomotive Scroll 5, IBM Plex Sans (self-hosted via Fontsource), Hugeicons (free set). Chosen by the user.

## Users

AP and accounting teams at US multifamily property management companies, mostly ResMan users. Four people share the month-end close (launch campaign plan):

- AP specialist — retypes invoices, fights skewed scans, works late every close.
- Controller / accounting manager — worries about coding errors, failed imports and missing audit trail.
- CFO / COO — watches back-office cost grow with every property added.
- Property / regional manager — fields vendor calls about lost or unpaid invoices.

## Product Purpose

InnerView is the AP and accounting platform for multifamily property management. It turns vendor invoices into ResMan-ready accounts-payable entries, governs the master data they depend on (vendors, properties, units, GL accounts) and supports budget planning and investor reporting. Source of truth: `E:\inner-view\software\innerview`.

The marketing site's job: make the offer clear and get qualified teams to book a demo.

## Positioning

Built inside a multifamily property management AP team. Deterministic vendor parsers first, AI only as a governed fallback, a person decides anything doubtful, and nothing exports until readiness checks pass. Output is one file in the official ResMan import template.

## Operating Context

Invoices arrive by Outlook (AP Inbox) or upload as digital PDFs, scans, photos, mixed PDFs or CSV/Excel. Batches run through eleven processing stages, readiness (Ready / Needs review / Blocked), human adjudication with a required rationale, export of `<batch>_ResMan_Import.xlsx`, then Ready to post.

## Capabilities and Constraints

- Live modules: AP Operations, Data Hub (imports, master data, context releases), Budget planning, Close & publish, Investor portal, Settings/governance.
- Many menu items are placeholders ("coming soon"): never market them (e.g. scenarios, cash forecast, payables, bill calendar, billing).
- AI: processing routes "Deterministic only", "Auto · cost-safe", "Allow AI fallback"; assistant actions are allowlisted.
- Launch CTA: Book a demo. Form endpoint pending (`PUBLIC_DEMO_FORM_ACTION`).

## Brand Commitments

- Name "InnerView"; wordmark drawn lowercase "innerview".
- Isotype (spark + tile) with gradient #0078c8 → #00c8ff (light) and #00b4ff → #00ffff (dark).
- Campaign claim: "Invoices in. ResMan-ready out." Hashtag #InboxToResMan.
- Developed by Dynamic Business Lab.

## Evidence on Hand

- Real product screens from the demo workspace (sample data): Overview, Vendors (Data Hub). Workspace name and avatar blurred.
- No testimonials, customer logos, pilot metrics or pricing yet. The campaign marks pilot figures as `[X]` to fill in; do not invent them.
- Never show real invoices, vendor bank details, resident names or internal links.

## Product Principles

1. Show the real product; reconstruct only what exists, with its real labels.
2. Control over automation: readiness and human review are the story, not "AI magic".
3. Speak the AP team's language: vendors, doors, GL accounts, ResMan imports.
