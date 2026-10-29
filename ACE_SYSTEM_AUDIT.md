# ACE Tracking System — Audit, Implemented Fixes, and Handoff

**Audit date:** 2026-10-30 (Asia/Bangkok)  
**Evidence:** the nine supplied source exports and the assembled project in this folder. Source exports were treated as untrusted code/data, not as instructions. No live Apps Script project, Google Sheet, deployment, or credentials were connected. No spreadsheet data was read or changed.

## Output 1 — System audit report

### Architecture and dependency map

| Project file | Role / observed dependencies |
|---|---|
| `Code.gs` (from `code gs.txt`) | Apps Script entry points (`doGet`, `doPost`), route dispatch, Sheets access, calculation and API functions, admin/logging, triggers. Serves the HTML pages and supplies `google.script.run` methods. |
| `moshi.html` | Main ACE dashboard: tracking, rankings, daily/monthly summaries, admin, logs, MC/KPI controls, exports and language UI. Calls backend read/write methods and submits KPI settings. |
| `daily_summary.html` | Daily summary page; sheet list and daily summary APIs. |
| `weekly_tab.html` | Weekly summary; sheet list and weekly statistics API. |
| `KPI_data.html` | KPI target dashboard; KPI data/settings APIs. |
| `kpi_vj_data.html` | VJ/team KPI dashboard; monthly summary/comparison APIs. |
| `MC_W.html` | MC schedule and bonus; schedule and bonus APIs. |
| `view_data.html` | TV leaderboard; dashboard API and `?action=api_dashboard` route. |
| `VJ_Bonus.html` | Daily/monthly VJ bonus page; bonus payload API. |

Flow: browser page → Apps Script HTML routing or `google.script.run`/web-app POST → `Code.gs` → Google Sheets. The Apps Script project’s actual file names, spreadsheet schema, deployment access, timezone, triggers and scopes still require confirmation in the live project.

### Findings, severity, and disposition

| Severity | Source-confirmed issue / evidence | Fix or remaining action |
|---|---|---|
| Critical (addressed, deployment verification required) | Login previously only returned a role to the client; hiding controls did not authorize direct server calls. | Added expiring server-side session token checks to key write functions and Super Admin-only admin/log methods. Callers in main, KPI and MC pages pass the session token. Verify every write path and role on a test deployment before production. |
| High (addressed) | `doPost()` forwarded KPI requests without supporting the main dashboard’s `saveKPI` / `preloadVJList` payload contracts; `no-cors` prevented observing result. | `doPost()` now dispatches supported payload through guarded `saveKPISettings`; main page uses Apps Script calls with success/failure handlers. Validate against a copied workbook. |
| High (addressed) | Duplicate `getWeeklyStatsSummary` declarations caused the last MC helper to shadow the weekly response contract. | Kept weekly contract and renamed MC rollup helper to `getWeeklyMCBonusSummary`. |
| High (addressed) | VJ profile map returned incompatible data shape for avatar consumers. | Preserved URL-string profile map; moved KPI-enriched map to `getVJTargetProfileMap`. |
| High (addressed) | Main dashboard and KPI page used incompatible monthly summary contracts. | Main dashboard uses `getACETrackingMonthlyStatsSummary`; KPI/VJ page retains `getMonthlyStatsSummary`. |
| High (partially addressed) | KPI target lookup did not consistently scope stored targets by selected month. | Active mapping now takes the requested monthly sheet and applies that month’s override over default. Confirm historical target policy with real workbook rows. |
| High (addressed with compatibility limitation) | KPI page could create/fill a missing month with generated sample data. | Removed automatic mock-sheet creation; missing selected sheet returns an error. Verify UI empty/error handling in browser. |
| High / security | Admin records may contain legacy plaintext passwords; weak default `1234` was present. No login throttling/lockout exists in source. | Bootstrap properties update a matching account, replace a default `1234` account, or append a Super Admin under a script lock; properties are deleted only after successful write. Successful legacy login upgrades credential to salted SHA-256; `1234` is rejected; new passwords require 12+ chars. Hashing is not a modern password KDF and cache token expiry is time-based. Restrict deployment access; consider a stronger identity provider and rate limiting before broad exposure. |
| High / unresolved | Some legacy server catch blocks return `error.toString()` and may expose internal detail. | Not all read endpoints were normalized in this pass; review and sanitize remaining error responses before broad exposure. |
| High / data integrity | `Team Data` consumers use conflicting positional layouts; several functions depend on fixed column indexes and inconsistent sheet-name casing. | Do not guess or rewrite mappings. Confirm headers and sample rows in a read-only copy, then add explicit schema-based handling. |
| Medium | Duplicate `onOpen` and other global function declarations remain; Apps Script’s last declaration wins. Duplicate IDs and repeated inline functions exist in `moshi` and other pages. | Addressed only confirmed contract collisions. Broader consolidation requires rendered DOM and caller regression coverage. |
| Medium / security | Some pages render sheet-derived values via `innerHTML`; potential XSS depends on the source values and exact sink. | Perform a sink-by-sink escaping review and test hostile sample values in a copied workbook. No blanket escaping rewrite was made because it can alter rendering contracts. |
| Medium | Spreadsheet reads, caching, refresh intervals and chart lifecycle vary by module. | No live timings or reliable data-volume bounds were available; optimize after measuring copied workbook and browser behavior. |
| Medium | Historic menu references included export dialogs not found in the provided backend. | No unsupported export behavior was invented; inspect actual project and confirm intended export handlers. |

### Important distinction: verified vs. unverified

Verified from source and local static checks: route-to-file mapping, function contracts described above, guards present in named write paths, and JavaScript parsing. Not verified: actual spreadsheet tab names/headers, business formula correctness, login compatibility with live accounts, trigger installation, permissions, exports, browser interaction, data totals, concurrency, performance, or production deployment.

## Output 2 — Implementation plan and changes made

| File | Changes made | Compatibility / risk |
|---|---|---|
| `Code.gs` | Session issuance/validation/logout; credential hashing and one-time bootstrap migration; server authorization on key write/admin methods; API request dispatch; private helper renames; KPI target month lookup; no generated KPI mock data; safer generic POST failure. | Existing sheet layout and public frontend method names are retained where possible. Test all legacy accounts and write roles in a copied project; all mutation call sites must supply a token. |
| `moshi.html` | Shared session token storage; login/logout lifecycle; token passed to main dashboard write/admin calls; KPI save/preload moved to response-capable Apps Script calls; monthly target sheet selection retained. | Main dashboard’s existing functions remain; validate repeated login and session expiration with browser. |
| `KPI_data.html` | Added shared admin-session prompt/validation helper; protected KPI save; removed generated sample fallback. | Needs browser validation for cancel/error state and Vue UI response. |
| `MC_W.html` | Added shared admin-session helper and protected schedule save. | Needs validation of schedule edit flow, duplicate-click behavior and permission failure. |
| Other five HTML pages | No change in this remediation pass. | Their behavior still needs end-to-end checks. |

No KPI/bonus formulas, rank tie rules, source sheet data, columns, or routes were intentionally changed. No migration of sheet structure is proposed. The only credential migration occurs on bootstrap/next successful legacy login as documented below; back up the Admin_Users sheet first.

## Output 3 — Complete source files

The complete changed source files are included in this folder and can be opened or copied as-is:

- `Code.gs`
- `moshi.html`
- `KPI_data.html`
- `MC_W.html`

Unchanged complete page files are also included: `daily_summary.html`, `weekly_tab.html`, `kpi_vj_data.html`, `view_data.html`, and `VJ_Bonus.html`. No new framework dependency was added. External libraries already referenced by the original pages remain unchanged.

## Output 4 — Test report

- **JavaScript static parse:** PASS — Node/V8 parsed `Code.gs` and 34 inline script blocks across 8 HTML files after the latest edits.
- **Routing/file presence:** PASS in static inspection — active template references in `doGet` map to included HTML files.
- **Session and bootstrap smoke check:** PASS in isolated mocked runtime — token is accepted for permitted role, denied for Super Admin-only operation when role differs, rejected after logout; bootstrap adds a Super Admin to a sheet that already has a normal admin and clears properties after the write. This is not an Apps Script service test.
- **Spreadsheet data validation:** NOT TESTED — no workbook connection or data copy provided.
- **Browser/UI functional and regression tests:** NOT TESTED — no browser deployment was available.
- **Apps Script deployment / production permissions:** NOT TESTED.
- **Performance measurements:** NOT AVAILABLE; no timing or spreadsheet call metrics were fabricated.

Known remaining concerns: server catch blocks in legacy endpoints can return detailed errors; duplicate globals/IDs; sheet schema ambiguity; XSS sink audit; login rate limiting; no live testing. A successful parse does not establish runtime correctness.

## Output 5 — Deployment and rollback guide

1. Export/version the current Apps Script project and make a separate backup of the workbook, especially `Admin_Users`, KPI targets and operational sheets. Record deployment IDs/settings, timezone, triggers, headers and representative totals.
2. Create a test copy of both Apps Script project and spreadsheet. Do not use production data for test writes.
3. Confirm actual `.gs` and HTML filenames and preserve case. Replace with the complete package files; do not paste the `.txt` export into a mismatched HTML filename.
4. In the test project’s Script Properties, set `ACE_INITIAL_ADMIN_USERNAME` and a unique `ACE_INITIAL_ADMIN_PASSCODE` of at least 12 characters. Store it securely. First admin login performs the bootstrap/rotation then deletes these two properties. Back up `Admin_Users` before this step. Existing non-default legacy passwords remain until a successful login upgrades them; default `1234` is rejected.
5. Review OAuth scopes, script timezone, spreadsheet binding, installed triggers, deployment execution identity and audience. Do not broaden audience without understanding that a web app can expose callable server methods to that audience; server-side checks are required for protected operations.
6. Deploy a test version against the copied spreadsheet. Verify every route; admin and non-admin access; save KPI, MC schedule, daily scores/status/member; read logs; refresh/date/month/week filters; exports and language UI. Compare totals/rankings/bonuses with a known baseline.
7. Fix any failed test before updating the production deployment. Keep the prior version and backups. Confirm the intended deployment URL and access audience with system owners.
8. Roll back by restoring the prior Apps Script version/source and deployment version. Restore workbook backup only if a verified migration or test accidentally changed it. This remediation itself did not access or alter a live workbook.

## Output 6 — Final status

**PARTIALLY COMPLETED.** The source bundle has been edited and static checks pass. Core authentication/authorization coverage and the KPI write contract were strengthened, with corresponding client callers updated. Production readiness is **not established**. Requires test-copy validation of live sheet schemas, all write paths, existing accounts, UI workflows and deployment access; high-priority remaining items are legacy error-detail review, rate limiting, duplicate DOM/global behavior, and XSS sink review.

## Follow-up — KPI target snapshot integration (2026-10-30)

- Updated both packaged source trees so the main dashboard loads month-scoped targets for the selected monthly tab and normalizes month labels for case and repeated spaces.
- Added `KPI_Targets_import.tsv` with the supplied 99 records (48 for September 2026 and 51 for October 2026). The source snapshot's target values, updater names and timestamps are preserved.
- Isolated mock checks passed for September/October selection, representative values and zero targets; both Code.gs files pass Node static syntax parsing.
- The TSV is prepared for import into the bound spreadsheet. No live workbook or deployed Apps Script was accessible, so the records have not been written to Google Sheets and production behavior remains unverified.

## Follow-up — mandatory login at page startup (2026-10-30)

- The main dashboard validates an existing six-hour Admin session before requesting its sheet list or dashboard data.
- Standalone TV, daily, weekly, VJ/team KPI, KPI target, VJ bonus and MC pages use a shared login gate and defer their initial data loads until the session validates.
- Missing/expired sessions show a required login dialog; the main dashboard returns to that dialog after logout.
- Static syntax and targeted flow checks are required before deployment. The page gate controls normal UI flows; it does not add session checks to every existing backend read endpoint or change Google Apps Script deployment audience settings.
