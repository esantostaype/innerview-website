/**
 * Every product fact on the site comes from the InnerView codebase
 * (E:\inner-view\software\innerview) or the launch campaign plan.
 * Source paths are noted so copy can be re-verified before publishing.
 */

export const site = {
  name: 'InnerView',
  claim: 'One workspace for the numbers behind every door.',
  description:
    'InnerView is the accounting and finance platform for multifamily real estate. Payables, financials, budgets and capital for every property, built on your ResMan data.',
  developer: 'Dynamic Business Lab',
  /** Set PUBLIC_DEMO_FORM_ACTION to the form endpoint (CRM / form service) before launch. */
  demoFormAction: import.meta.env.PUBLIC_DEMO_FORM_ACTION as string | undefined,
};

export const nav = [
  { label: 'Platform', href: '/#platform' },
  { label: 'Investors', href: '/#investors' },
  { label: 'Security', href: '/#security' },
];

/** apps/web/app/features/invoices/engine/routes.ts — document modes. */
export const documentModes = ['Digital PDFs', 'Scanned PDFs', 'Screenshots / Photos', 'Mixed PDFs', 'CSV / Excel'];

/** apps/web/app/features/invoices/engine/progress.ts — processing stages, in order. */
export const stages = [
  'Uploading files',
  'Detecting vendor',
  'Reading PDF text',
  'Running OCR',
  'Applying vendor rules',
  'Matching addresses',
  'Matching units',
  'Resolving GL accounts',
  'Reconciling totals',
  'Splitting bills',
  'Building template',
] as const;

export const workflow = [
  {
    id: 'intake',
    title: 'Every invoice lands in one inbox.',
    body: 'Vendor emails sync from Outlook into the AP Inbox, next to anything uploaded by hand. Each email shows its vendor, documents, pages and status, and goes into a batch when it is ready to process.',
    terms: ['Sync Outlook', 'Upload invoices', 'Add to new batch…', 'Process now'],
    stages: ['Uploading files'],
  },
  {
    id: 'read',
    title: 'Each vendor gets its own parser.',
    body: 'InnerView detects the vendor and reads the document with that vendor’s deterministic parser: PDF text first, OCR when the page is a scan. Parsers are sealed and versioned, and only active ones are ever used.',
    terms: ['Detecting vendor', 'Reading PDF text', 'Running OCR', 'Applying vendor rules'],
    stages: ['Detecting vendor', 'Reading PDF text', 'Running OCR', 'Applying vendor rules'],
  },
  {
    id: 'code',
    title: 'Every line is coded to GL, property and unit.',
    body: 'Service addresses are matched to properties and units from your ResMan data, GL accounts are resolved through approved accounting rules, totals are reconciled and PDFs that carry several bills are split apart.',
    terms: ['Matching addresses', 'Matching units', 'Resolving GL accounts', 'Reconciling totals', 'Splitting bills'],
    stages: ['Matching addresses', 'Matching units', 'Resolving GL accounts', 'Reconciling totals', 'Splitting bills'],
  },
  {
    id: 'export',
    title: 'One file, in the official ResMan template.',
    body: 'When every invoice in the batch is ready, InnerView builds the ResMan import workbook. The batch moves to Ready to post, where it is posted to ResMan and approved there.',
    terms: ['Building template', '_ResMan_Import.xlsx', 'Ready to post'],
    stages: ['Building template'],
  },
] as const;

/** Readiness — apps/web/app/features/invoices (readiness + issue labels). */
export const readiness = [
  {
    state: 'Ready',
    tone: 'ready',
    line: 'Invoice ready to export.',
    detail: 'No blocking issues. It goes into the ResMan file.',
  },
  {
    state: 'Needs review',
    tone: 'review',
    line: 'Non-blocking review notes remain.',
    detail: 'A person checks the notes before the batch moves on.',
  },
  {
    state: 'Blocked',
    tone: 'blocked',
    line: 'Amount mismatch · GL mismatch · Property mismatch',
    detail: 'It cannot be exported until someone resolves the blocker.',
  },
] as const;

/** AdjudicationDrawer.tsx — correction provenance badges. */
export const provenance = [
  { mark: 'H', label: 'Manually corrected' },
  { mark: 'B', label: 'Benchmark-approved' },
  { mark: 'L', label: 'Learning-approved' },
  { mark: 'R', label: 'Governed by an approved rule' },
] as const;

/** Extraction provenance on each cell. */
export const cellSources = ['Extracted', 'Derived', 'Fallback used', 'Learned'] as const;

/** apps/web/app/features/invoices/engine/routes.ts — processing routes (verbatim). */
export const routes = [
  {
    name: 'Deterministic only',
    body: 'Never call AI. A missing or failed parser becomes an explicit review blocker.',
  },
  {
    name: 'Auto · cost-safe',
    body: 'Registered parsers stay deterministic; only unknown documents may use AI.',
  },
  {
    name: 'Allow AI fallback',
    body: 'Run the deterministic parser first; AI is permitted only if it cannot produce a result.',
  },
] as const;

/** docs/security/AUTHORIZATION_MODEL.md — system roles. */
export const roles = [
  { name: 'AP Processor', body: 'Processes invoices, operates batches and works the review items assigned to them.' },
  { name: 'Reviewer', body: 'Adjudicates the Review Queue and reviews batches against governed context.' },
  { name: 'Accounting Administrator', body: 'Manages accounting context, governance and delivery. Cannot grant ownership.' },
  { name: 'Workspace Owner', body: 'Manages members, roles, access and settings. The last owner can never be removed.' },
] as const;

export const propertyScopes = ['All properties', 'Selected properties', 'No property access'] as const;

/** Data Hub — docs/data-hub, DatasetsView.tsx. */
export const canonicalDatasets = ['Properties & units', 'Chart of accounts', 'Vendors', 'Historical invoices', 'Posted ledger'] as const;

/** Budget planning — apps/web/app/features/budget/engine/presets.ts. */
export const forecastMethods = [
  'Keep last',
  'Use average',
  'Percentage growth',
  'Same as last year',
  'Fixed amount',
  'Rent plan',
  'Cost per unit',
  'Linked formula',
  'Exponential smoothing',
  'Annual wave · Fourier',
  'Seasonal · Holt-Winters',
  'Seasonal · SARIMA',
] as const;

/** Launch campaign plan — audience personas and their messages. */
export const audiences = [
  { role: 'AP specialist', line: 'Stop retyping. Review only what matters.' },
  { role: 'Controller', line: 'Nothing exports until it’s ready, and every change leaves a trail.' },
  { role: 'CFO / COO', line: 'Add doors without adding AP headcount.' },
  { role: 'Property manager', line: 'Every invoice visible, coded and on its way.' },
] as const;
