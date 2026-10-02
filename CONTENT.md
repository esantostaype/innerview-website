# InnerView — Contenido del sitio

> **Documento de contenido (v2).** Primero se aprueba este contenido; el diseño viene después.
>
> - El copy va en **inglés** (mercado EE. UU.); notas y decisiones en español.
> - Fuente: el software en `E:\inner-view\software\innerview` (revisado el 2 oct 2026), las
>   descripciones de cada página de su menú y el plan de campaña de lanzamiento.
> - Cada funcionalidad lleva una etiqueta **interna** (no se publica):
>   - **[Live]** existe en el producto con pantalla real.
>   - **[Pilot]** existe pero restringido.
>   - **[Propuesto]** la página está en el menú del software como "Coming soon"; el contenido es
>     una propuesta para diseñar, basada en la descripción del menú y en los datos que el software
>     ya carga. Se ajusta cuando la función se construya.

---

## 1. Posicionamiento

**Qué es:** la plataforma de contabilidad y finanzas para empresas de bienes raíces
multifamiliares. Reúne en un solo lugar las cuentas por pagar, los estados financieros, el
desempeño del portafolio, los presupuestos y el capital, sobre los datos de ResMan.

**Frase de posicionamiento (EN):**
> **InnerView is the accounting and finance platform for multifamily real estate.**
> Payables, financials, budgets and capital for every property, in one workspace built on your
> ResMan data.

**Cómo se organiza el producto (y el sitio):** igual que el menú del software.

| Área | Pregunta que responde | Módulos |
|---|---|---|
| **Analyze** | ¿Cómo le está yendo a cada propiedad? | Financials, Performance |
| **Plan** | ¿Hacia dónde va? | Planning (Budgets y forecast), Capital |
| **Operate** | ¿Cómo se procesa el trabajo del día a día? | AP Operations, Data Hub |
| **Administer** | ¿Quién puede ver y cambiar qué? | Settings, roles, aprobaciones, auditoría |
| *Plus* | ¿Cómo se informa a los dueños? | Investor Portal |

**Mensajes clave (en orden de importancia):**
1. **One workspace for the numbers behind every door.** Contabilidad, finanzas y operación del
   portafolio en un solo lugar, por propiedad y por período.
2. **Built on your ResMan data.** Lee los reportes, el libro mayor y los maestros de ResMan, y
   devuelve archivos en sus formatos oficiales.
3. **Control before speed.** Nada se exporta hasta estar listo, cada cambio queda registrado y las
   aprobaciones las define la empresa.
4. **Built inside a multifamily property management team.** Habla en propiedades, unidades,
   cuentas GL y cierres de mes.

**Frases a evitar:** "The future of…", "Revolutionizing…", "All-in-one solution", "Powered by AI".

---

## 2. Analyze

### 2.1 Home — Portfolio overview [Live · cifras de muestra]

*Menú:* "Your portfolio at a glance: what changed, what needs attention and what is next."

**Copy**
- **Your portfolio at a glance.**
- Net operating income against budget, occupancy, invoices processed and what needs review,
  for the whole portfolio or one property, by month, quarter or year to date.

**Contenido real de la pantalla:** Net operating income, Occupancy, Invoices processed,
Needs review · Actual vs budget · Expense breakdown · AP pipeline · Invoices per week ·
Top vendors by spend · Properties (NOI vs budget, occupancy, open invoices, last ResMan sync) ·
Needs attention · Recent activity · Data health.

---

### 2.2 Financials

**Encabezado de módulo**
- **Financials for every property, every period.**
- Income statement, balance sheet, cash flow and the general ledger, by property and period,
  against budget and prior year.

| Página | Estado | Copy propuesto |
|---|---|---|
| **Profit & Loss** | [Propuesto] | **Income and expenses, against plan.** Every property's P&L by period, compared with its budget and the prior year, down to the account. |
| **Balance Sheet** | [Propuesto] | **Where each property stands.** Assets, liabilities and equity at the end of every period. |
| **Cash Flow** | [Propuesto] | **Cash in, cash out.** Operating, investing and financing movements by period. |
| **General Ledger** | [Live en Data Hub › Master Data] | **Every posted entry, searchable.** Journal entries by account, property and period, normalized from ResMan. Columnas reales: Date, Journal reference, Account name, GL account, Property, Description, Debit, Credit. |
| **Management Fees** | [Propuesto] | **Fees calculated, not keyed in.** Management fees calculated on collected revenue for every managed property. |
| **Close & Publish** | [Live] | **Close the period and share it.** Package statements, reports and decisions for each owner group, with approvals before anything goes out. |

**Base real:** el Data Hub ya carga el General Ledger, el Trailing Profit and Loss y el plan de
cuentas, y el backend ya clasifica las cuentas de resultados.

---

### 2.3 Performance

**Encabezado de módulo**
- **How every property is performing.**
- Leasing, revenue, expenses and utilities, by property, from the ResMan reports you already
  run.

| Página | Estado | Copy propuesto |
|---|---|---|
| **Leasing & Occupancy** | [Propuesto] | **Occupancy, leasing velocity and expirations.** See which properties are filling, which leases are coming due and how fast units turn. |
| **Revenue & Delinquency** | [Propuesto] | **What was charged, what was collected.** Collected revenue against charges, with delinquency and receivables trends. |
| **Expense Benchmarks** | [Propuesto] | **Cost per unit, side by side.** Operating expenses per unit compared across the portfolio. |
| **Utilities & RUBS** | [Propuesto] | **Utility cost and what's billed back.** Consumption and cost by property, and what is recovered from residents through RUBS. |

**Base real:** el Data Hub ya carga los reportes de ResMan que alimentan estas vistas
(Occupancy Trend, Rent Roll, Expiring Leases, Renewal Percentages, Make Ready Statistics,
Move Out Analysis, Transaction Collection Summary, Aged Receivables, Delinquency with Aging).

---

## 3. Plan

### 3.1 Planning

**Encabezado de módulo**
- **Budgets that start from your actuals.**
- Annual operating budgets by property, built on the posted general ledger and the leases behind
  your rent.

#### Budgets [Live] — página estrella del área Plan

**Copy**
- **Every property's budget, opened on its actuals.**
- Pick a forecast method for each account, compare methods side by side, let rent follow your
  rent roll lease by lease, and trace any number back to where it came from. When it's done,
  export the official ResMan upload or the owner workbook.

**Capacidades (todas reales):**
- **Actuals from the general ledger.** Posted months load from the governed GL; the forecast runs
  from the first open month to December.
- **A method per account.** Keep last, Use average, Percentage growth, Same as last year, Fixed
  amount, Formula (a share of another account or of the rent model) and Contract (loan interest
  from its own terms; yearly bills spread to their renewal).
- **Compare forecasts.** Preview methods side by side, including exponential smoothing,
  Holt-Winters and SARIMA, before applying one. *"More complexity does not guarantee a better
  forecast."*
- **Rent, lease by lease.** A recommended rent forecast built from Rent Roll, Renewal
  Percentages, Rent Growth, Make Ready and Move Out reports, calibrated to the ledger. Adjust
  market rent change, new lease rents, renewal increase and occupancy plan.
- **Other income that follows its drivers.** Fees, reimbursements, concessions and bad debt
  follow occupied units, move-ins and move-outs.
- **Trace.** Click a cell to see the cells its number comes from and the equation that joins them.
- **Work together.** See who else is in the budget, leave notes by account and month, lock
  accounts and track completion.
- **Versions, not overwrites.** Save, save as, undo and redo. Restoring an old version creates a
  new one; nothing is deleted.
- **Official exports.** ResMan official upload, owner workbook or ResMan flat CSV, one property or
  the whole portfolio, with a totals check.
- **Budget assistant.** Describe a change in plain language; it is applied with the same engine,
  as one step you can undo.

#### Resto de Planning

| Página | Estado | Copy propuesto |
|---|---|---|
| **Cash Forecast** | [Propuesto] | **Cash position, month by month.** Projected cash by property, so funding needs show up before they are urgent. |
| **Scenarios & Sensitivity** | [Propuesto · backend parcial] | **Test the plan before you commit.** Save named scenarios and see how changing an assumption moves the results. |
| **Drivers & Assumptions** | [Propuesto · backend parcial] | **Every assumption, in one place.** The drivers behind budgets and forecasts, visible and documented. |
| **Payroll & Allocation** | [Propuesto] | **Payroll, allocated fairly.** Site and shared payroll, and how it is allocated across properties. |
| **Review & Approval** | [Propuesto · backend completo] | **A second pair of eyes on every budget.** Draft, in review, approved: a different person approves, and the history stays. |
| **Forecast Accuracy** | [Propuesto] | **Learn from last year's plan.** How past forecasts compared with what actually happened. |

---

### 3.2 Capital

**Encabezado de módulo**
- **Debt, capital projects and returns, by property.**
- Loans and covenants, capex and reserves, valuations and distributions, alongside the operating
  numbers.

| Página | Estado | Copy propuesto |
|---|---|---|
| **Debt & Covenants** | [Propuesto · contratos de préstamo ya en Budgets] | **Loans and covenants under watch.** Every loan's terms and covenant compliance, by property. |
| **Capex & Reserves** | [Propuesto] | **Capital projects and how they're funded.** Projects, replacement reserves and their funding in one view. |
| **Valuation & Returns** | [Propuesto · cálculo ya en Investor Portal] | **What each property is worth and earning.** Values, cap rates, IRR and equity multiple. |
| **Distributions & Capital Calls** | [Propuesto · ya se publica vía Close & Publish] | **Cash out to owners, capital in.** Distributions and capital calls by property and period. |

---

## 4. Operate

### 4.1 AP Operations [Live] — página estrella del área Operate

**Claim:** *Invoices in. ResMan-ready out.*

**Copy**
- **Every invoice, coded and ready for ResMan.**
- Vendor bills arrive from Outlook or upload, in any format. InnerView detects the vendor, reads
  the document with that vendor's parser, matches property and unit, resolves the GL account and
  reconciles totals. Anything doubtful waits for a person. The output is one file in ResMan's
  official import template.

**Flujo real (11 etapas):** Uploading files → Detecting vendor → Reading PDF text → Running OCR →
Applying vendor rules → Matching addresses → Matching units → Resolving GL accounts → Reconciling
totals → Splitting bills → Building template.

| Página | Estado | Copy |
|---|---|---|
| **Inbox** | [Live] | **One inbox for every vendor bill.** Outlook email and uploads, classified and ready to batch. Digital PDFs, scans, photos, mixed PDFs, CSV and Excel. |
| **Batches** | [Live] | **Review before anything is posted.** Each invoice is Ready, Needs review or Blocked; corrections require a reason and every edit is versioned. |
| **Accounting rules** | [Live] | **Your accounting policy, applied the same way every time.** Approved rules, vendor identities and the GL rules that code invoice lines. |
| **Context matrix** | [Live] | **Recommendations, not surprises.** Vendor and property profiles from ResMan; recommendations never become rules without approval. |
| **Ready to post** | [Live] | **Batches ready for ResMan.** Processed batches with their vendors, properties, GL codes and lines, ready to post to ResMan for approval. |
| **Vendors** | [Live] | **Every vendor, one identity.** Vendor master records from ResMan, their parsers and payment terms. |
| **Exceptions** | [Propuesto] | **The invoices that need a person.** Everything the engine could not code or match, in one queue. |
| **Payables** | [Propuesto] | **What you owe, by vendor and due date.** Open payables by vendor, property and due date, credits included. |
| **Bill Calendar** | [Propuesto] | **Nothing paid late.** Recurring bills and due dates on a calendar. |
| **Posting Rules** | [Propuesto] | **How lines are coded, written down.** The rules that send invoice lines to GL accounts and properties. |
| *ResMan posting* | [Pilot · no publicar] | Envío por API, una factura a la vez. Solo mencionar cuando salga del piloto. |

**Control real:**
- Readiness: Ready / Needs review / Blocked (Amount mismatch, GL mismatch, Property mismatch).
- *"Explain what source evidence supports this correction."* — no se guarda una corrección sin motivo.
- Procedencia por celda: Extracted, Derived, Fallback used, Learned. Marcas: Manually corrected,
  Benchmark-approved, Learning-approved, Governed by an approved rule.
- Rutas: Deterministic only · Auto · cost-safe · Allow AI fallback (por lote, documento o página).
- Parsers deterministas por vendor (utilities como CDE Lightband y Alabama Power, suministros como
  HD Supply) y un respaldo universal validado para los documentos desconocidos.

---

### 4.2 Data Hub [Live, con páginas propuestas]

**Copy**
- **One source of truth for the portfolio.**
- Data Hub brings vendors, properties and reports together, so every team works from the same
  numbers.

| Página | Estado | Copy |
|---|---|---|
| **Imports** | [Live] | **Your ResMan reports, period by period.** Report folders that feed the budget and the forecasts, versioned, with history: Forecast history, Rent forecast inputs, Other income and collections, Payables history, Portfolio reference, Leasing and risk, Optional controls. |
| **Master Data** | [Live] | **Canonical directories.** Properties and units, GL accounts, invoice history and the general ledger. |
| **Connections** | [Propuesto] | **Authorize the systems InnerView reads from.** ResMan, Microsoft, Dropbox and Arcadia. *(Outlook ya funciona hoy desde la cuenta.)* |
| **Sources** | [Propuesto] | **Scheduled loads you can see.** When each source last ran and what it brought. |
| **Documents** | [Propuesto] | **Every source document, with its lineage.** |
| **Quality** | [Propuesto] | **Data issues before they become report issues.** Validation results waiting for review. |
| **Coverage** | [Propuesto] | **Which properties and periods are complete.** |
| **Data Export** | [Propuesto] | **Governed data for other systems.** |

**Cómo se gobiernan los datos (real):** source package → mapping & validation → **immutable
snapshot** → **active context release** (activado con un motivo). Revertir = reactivar una
release anterior. Los módulos nunca leen borradores.

---

## 5. Administer — control y seguridad [Live]

**Copy**
- **Who can see it, who can change it, and when they did.**
- Roles and capabilities decide what each person can do. Property scopes decide which buildings
  they see. Approval policies decide who signs off. The audit log records every change.

| Página | Copy |
|---|---|
| **Members & Roles** | Invite people by email; they set their own password and two-step verification. Default roles: Property Manager, AP Processor, Reviewer, Accounting Administrator, Workspace Owner. Custom roles start from a system role. |
| **Access Scopes** | All properties, selected properties or none, per person. |
| **Approval Policies** | Who approves budgets, invoices and publications, and above which amounts. Several people can be required, and the author never approves their own. |
| **Audit Log** | Every change made in the workspace: who, what and when, with before and after. |
| **Support access** | InnerView's team only enters with the owner's permission, read-only, for a few hours, recorded on both sides. |

**Seguridad (hechos de `SECURITY.md`):** two-step verification (TOTP), hashed passwords,
secure sessions with expiry, encrypted credential vault, files encrypted at rest, exports
protected against formula injection, continuous dependency and secret scanning.
*No mencionar certificaciones, pentest ni SSO.*

---

## 6. Plus: Investor Portal [Live] — página interna propia

**Mención en el homepage (una línea + enlace):**
> **Owners and investors, informed.** Publish statements, distributions and decisions to each
> owner group, with approvals, in its own read-only portal. → *Investor portal*

**Contenido de la página interna `/investors`:**
- **Close & Publish:** reports, close packages, financial statements (income statement, balance
  sheet, cash flow), budget vs actual, cash outlook, distributions, contributions, valuations and
  capital decisions (capex, refinance, acquisition, disposition).
- **Approvals:** policies by amount and role; the author never approves their own; approvers and
  investors are notified by email; anything published can be withdrawn, and it stays in the
  audit log.
- **The portal:** each owner group (LP, fund vehicle, family office) sees only its properties:
  overview, cash outlook, capital decisions, returns and distributions, financial statements,
  budget vs actual and documents.
- **Returns calculated:** contributed, distributed, equity multiple, IRR from dated cash flows,
  trailing 12-month cash-on-cash.

---

## 7. Transversales

### 7.1 InnerView AI [Live]
- **AI that works inside the rules.**
- Ask about an invoice, a vendor or a budget line in English or Spanish. The assistant explains,
  navigates and drafts budget changes you can undo in one step. It never posts, approves or
  changes your accounting on its own, and your permissions still apply.

### 7.2 Integraciones
| Sistema | Estado | Qué decir |
|---|---|---|
| **ResMan** | [Live] reportes y maestros importados + exportaciones en formato oficial · [Pilot] posteo por API | "Built on your ResMan data" |
| **Microsoft Outlook** | [Live] | "Vendor emails flow into the AP inbox" |
| **Dropbox, Arcadia** | [Propuesto] | Solo en la página de Connections |

### 7.3 Cómo se empieza (onboarding gestionado) [Live]
- **We set up your workspace with you.**
1. We create your workspace and its roles.
2. Your team joins with their own sign-in and two-step verification.
3. Your properties, vendors and chart of accounts are loaded from ResMan.
4. Your first reports are imported, and the work starts flowing.

---

## 8. Audiencias

| Persona | Le importa | Mensaje |
|---|---|---|
| **CFO / COO** | Visión del portafolio, costo del back-office | One workspace for every property's numbers. Add doors without adding headcount. |
| **Controller / accounting manager** | Cierres, precisión, trazabilidad | Nothing exports until it's ready, and every change leaves a trail. |
| **FP&A / asset manager** | Presupuestos, forecast, capital | Budgets that start from your actuals. |
| **AP specialist** | Retipeo, escaneos, horas extra | Stop retyping. Review only what matters. |
| **Property / regional manager** | Su propiedad, sus proveedores | Every invoice visible, coded and on its way. |

---

## 9. Reglas de contenido

- Sin métricas inventadas, clientes, testimonios ni logos de terceros.
- Nunca nombrar al cliente actual.
- Capturas solo del workspace demo con datos de muestra, y etiquetadas así.
- Las funciones [Propuesto] se pueden diseñar y mostrar; antes de publicar el sitio se decide,
  una por una, si salen como disponibles, "coming soon" o se ocultan.

---

## 10. Homepage — contenido reestructurado

Orden pensado como una historia: **qué es → el problema → cómo se organiza → cada área →
control → para quién → cómo empezar → CTA.** El diseño de cada sección se define después.

### S1 · Hero
- **H1 (opción recomendada):** One workspace for the numbers behind every door.
  - *Alternativas:* "Accounting and finance for multifamily, in one place." · "Every property's
    books, budgets and payables. One workspace."
- **Sub:** InnerView is the accounting and finance platform for multifamily real estate.
  Payables, financials, budgets and capital for every property, built on your ResMan data.
- **CTA:** Book a demo · See the platform
- **Visual (referencia para diseño):** Portfolio overview real.

### S2 · El problema
- **Statement:** Most portfolios still run on a patchwork. Invoices live in an inbox, budgets in
  spreadsheets, the ledger in ResMan exports and owner reports in email attachments. Every
  month-end, someone stitches them back together by hand.

### S3 · La plataforma (mapa)
- **H2:** Analyze, plan and operate, on the same data.
- **Body:** InnerView is organized the way a real estate finance team works.
- **Cuatro áreas:**
  - **Analyze** — Financials and performance for every property, every period.
  - **Plan** — Budgets and forecasts that start from your actuals, plus debt and capital.
  - **Operate** — Payables processed from the inbox to ResMan, and the data that feeds it all.
  - **Administer** — Roles, approvals and an audit trail on every change.
- **Línea de base:** All of it reads from one governed Data Hub, built on your ResMan reports.

### S4 · Analyze
- **H2:** How every property is doing, and why.
- **Body:** Income statement, balance sheet, cash flow and the general ledger by property and
  period, against budget and prior year. Leasing, collections, expenses per unit and utilities,
  from the ResMan reports you already run.
- **Bloques:** Financials (P&L · Balance sheet · Cash flow · General ledger · Management fees) ·
  Performance (Leasing & occupancy · Revenue & delinquency · Expense benchmarks · Utilities & RUBS).

### S5 · Plan
- **H2:** Budgets that start from your actuals.
- **Body:** Every property's budget opens on its posted general ledger. Choose a method for each
  account, compare forecasts side by side, let rent follow your rent roll lease by lease, and
  trace any number back to its source. Export the official ResMan upload when it's approved.
- **Destacados:** Actuals from the ledger · Compare forecasts · Rent lease by lease · Trace ·
  Versions, never overwrites · Official ResMan exports.
- **Línea secundaria (Capital):** Cash forecast, scenarios, debt and covenants, capex and reserves,
  and returns, alongside the operating plan.

### S6 · Operate — AP
- **H2:** Invoices in. ResMan-ready out.
- **Body:** Vendor bills arrive from Outlook or upload, in any format. InnerView reads each one
  with its vendor's parser, matches property and unit, resolves the GL account and reconciles
  totals. Clean invoices go into the file; anything doubtful waits for a person.
- **Pasos:** Inbox → Read → Code → Review → Ready to post.
- **Prueba de control:** Ready · Needs review · Blocked. *"Explain what source evidence supports
  this correction."*

### S7 · Operate — Data Hub
- **H2:** The same numbers, everywhere.
- **Body:** Upload your ResMan reports once a period. Data Hub versions them, publishes immutable
  snapshots and activates one governed context that financials, budgets and payables all read
  from.

### S8 · Origen (respiro visual)
- **H2:** Built inside a multifamily property management team.
- **Body:** InnerView started where the month-end close happens. It speaks in properties, units,
  vendors and GL accounts, because that is the job.

### S9 · Control
- **H2:** Who can see it, who can change it, and when they did.
- **Body:** Roles, property scopes, approval policies and a complete audit log. Two-step
  verification for everyone, and support access only with your permission.
- **Sub-bloque IA:** AI that works inside the rules. It explains, navigates and drafts changes you
  can undo. It never posts or approves on its own.

### S10 · Plus: inversionistas (mención breve)
- **H3:** Owners and investors, informed.
- **Body:** Publish statements, distributions and decisions to each owner group, with approvals,
  in its own read-only portal.
- **Enlace:** Explore the investor portal →

### S11 · Para quién
- **H2:** Built for the whole finance team.
- CFO / COO · Controller · FP&A / asset manager · AP specialist · Property manager (con sus
  mensajes de §8).

### S12 · Cómo se empieza
- **H2:** We set up your workspace with you.
- Los cuatro pasos de §7.3.

### S13 · CTA final
- **H2:** See your portfolio in one workspace.
- **Body:** Book a demo with the team that built InnerView, and see your own properties, ledger
  and invoices in it.
- **Formulario:** Full name · Work email · Company · Accounting system (ResMan / Other) · Units
  managed (optional).

### Navegación propuesta
**Platform** (Analyze · Plan · Operate · Administer) · **Investors** · **Security** ·
**Book a demo**

### Páginas internas a futuro
`/analyze` · `/plan` · `/operate` (AP + Data Hub) · `/investors` · `/security` · `/demo`

---

## 11. Decisiones pendientes

1. Titular del hero (S1).
2. Si las secciones Analyze y Capital se muestran con capturas reconstruidas (son [Propuesto]) o
   solo con texto.
3. Capturas reales: levantar la API local con el seed sintético para Budgets, Batches y Close &
   Publish, o reconstruirlas con HTML.
