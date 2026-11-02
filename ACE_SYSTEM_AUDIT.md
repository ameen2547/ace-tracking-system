# ACE Tracking System — Audit, Implemented Fixes, and Handoff

**Audit date:** 2026-11-02 (Asia/Bangkok)  
**Evidence:** canonical `ACE_Tracking_System` source plus anonymous HTTP checks of the supplied spreadsheet and deployment URLs. No spreadsheet cell values were downloaded into the report or modified. Google OAuth for Apps Script management is expired, so live sharing and deployment settings could not be inspected or changed.

## Output 1 — System audit report

**Source of truth:** `ACE_Tracking_System` is canonical. `ACE_Tracking_GAS_Project` is an older assembled copy and must not be deployed.

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
| High / security | Admin passcodes are stored in plain text in `Admin_Users`; anyone with spreadsheet access can read them. Weak default `1234` is rejected, but login throttling/lockout is not implemented. | Bootstrap and new Admin creation write the entered passcode as plain text. Older `sha256$...` records cannot be reversed and will no longer authenticate; reset those accounts through the bootstrap flow. Limit access to the spreadsheet and do not reuse these passcodes. Plain-text storage is a deliberate security downgrade; hashing or a managed identity provider is safer. |
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
| `Code.gs` | Session issuance/validation/logout; plain-text Admin passcode comparison and bootstrap; server authorization on key write/admin methods; API request dispatch; private helper renames; KPI target month lookup; no generated KPI mock data; safer generic POST failure. | Existing sheet layout and public frontend method names are retained where possible. Test all legacy accounts and write roles in a copied project; all mutation call sites must supply a token. |
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

## Follow-up — dashboard identity, clock and load path (2026-11-02)

- The later `getDataFromSheet()` definition was the active Apps Script implementation and initialized `sheetDiamondTotal` without extracting the Diamond Total row. The active implementation now applies the same row-detection/extraction logic present in the earlier legacy implementation; the old definition is marked internal to remove the duplicate public function name.
- Dashboard user identity now updates from the validated Admin session immediately, then resolves the account's TikTok profile from the existing VJ profile source by display name, username or TikTok ID. The endpoint remains scoped to the caller's session.
- Added a Bangkok clock across Dashboard and standalone-page sidebars. Profile-heavy tables defer offscreen images and use one-shot fallback handlers.
- Increased successful monthly response cache lifetime to 60 seconds, retained invalidation for app writes, and cached the profile lookup for five minutes. Direct spreadsheet edits can therefore take up to one minute for monthly dashboard data and five minutes for profile changes to show.
- These source changes have not been tested against a live workbook or deployed Apps Script application; performance gains have not been measured.

## KPI integration, performance and security review (2026-11-02)

### TikTok profile source consistency (2026-11-02)

- The user confirmed that `VJ MC ALL` column H is the TikTok ID source. `getVJProfileDetailsMap_()` now reads that column directly, normalizes plain `@username` values and TikTok profile URLs, and derives the profile image URL from the ID.
- Authenticated app pages receive the shared ID-to-name profile map. VJ names rendered as standalone text receive an `@TikTokID` link; matching profile images use the ID-derived avatar with an initials fallback.
- Daily, weekly, TV, KPI dashboard, monthly report/comparison, VJ Bonus and legacy KPI VJ records include TikTok/profile properties where their API returns individual VJ rows.
- The source-profile cache and monthly/KPI response cache keys were versioned to avoid reusing responses built before these fields were added.
- This integration only resolves the public TikTok username/link and avatar URL. It does not fetch TikTok biography, follower counts or other account details, and it has not been verified against the live workbook/deployment.

### Live sheet facts (read-only)

- Read the user-provided spreadsheet's `KPI_Targets` tab through its CSV view. The live header is `VJ_Name`, `Target_Diamond`, `UpdatedBy`, `UpdatedAt`, `month`.
- The tab returned 100 data rows: 48 with `SEPTEMBER 2026`, 52 with `OCTOBER 2026`; 99 targets are numeric and one target cell is blank. No spreadsheet values were written or changed.
- The current production Apps Script deployment is version 53 (30 Oct 2026), executes as the owner, and allows everyone to access the Web App. The local source changes in this package are not deployed.

### Changes in the current local source

- `Code.gs` reads KPI targets by matching the actual header names rather than assuming a fixed month header spelling. It caches target rows and KPI dashboard responses for up to 60 seconds and invalidates the KPI caches after an in-app save.
- KPI name/month matching during preload and save now normalizes spaces and case. Read-only KPI calls no longer create a missing target tab as a side effect.
- `getKPIDashboardData`, the admin-facing target map and VJ/team KPI report reads now require a valid server session. Internal helpers use private Apps Script names. KPI pages pass the session token and handle failed/empty responses.
- An empty KPI month now returns the normal dashboard response shape; invalid or non-month sheet names are rejected.

### Confirmed security and reliability findings still open

| Priority | Evidence | Remaining work |
|---|---|---|
| Critical | Live deployment executes as owner and is accessible to everyone. `doGet?action=api_dashboard`, `getDataFromSheet`, and several non-KPI report read endpoints do not validate the login token server-side. The browser login gate can be bypassed by direct Apps Script calls. KPI endpoints were guarded in local source only; deployment version 53 is unchanged. | Review every public read/write entry point, add server authorization, and update all page callers before changing the deployment audience or publishing. |
| High | `daily_summary.html` and `moshi.html` still interpolate spreadsheet-derived names/team/sheet values into `innerHTML` in multiple render paths. The VJ/team KPI report page was updated to escape its names, team labels, sheet label and image URLs. | Continue escaping values at every HTML text/attribute sink and use safe DOM APIs for URL attributes. Validate with hostile values in a copied workbook. |
| High | Multiple catch blocks return `error.toString()` to the client. | Log detailed errors server-side and return generic messages to clients. |
| High | Admin passcodes are stored in plain text; login has no source-confirmed rate limit/lockout. | Restrict spreadsheet access; consider a managed identity provider or one-way password hashing and add throttling before broad deployment. |
| Medium | Several public functions with identical names remain in `Code.gs` (including `saveKPITarget`, `getMCSchedules`, and `getMCBonusSummary`); Apps Script uses the last declaration. | Consolidate after tracing callers and preserving the active response contracts. |
| Medium | Direct spreadsheet edits bypass app cache invalidation. | KPI and monthly reads may be up to 60 seconds stale. |

### Performance observations

- Previous live measurement on version 53: `getDataFromSheet` execution durations were 5.193, 6.953 and 6.688 seconds (median 6.688 seconds); `getSheetList` was 1.368, 2.529 and 1.872 seconds (median 1.872 seconds). Direct CSV reads measured 548 ms median for `KPI_Targets` and 897 ms for the selected November sheet. These are separate request paths and not a controlled benchmark comparison.
- The KPI cache targets repeat reads; cold-read improvement is not guaranteed. Re-measure after updating the deployment and compare the same functions/data volume across cold and warm calls.
- No production deployment was modified in this work. No full live role, malicious-input, or write regression test was run.


## Security and deployment follow-up (2026-11-02)

### Verified exposure

Anonymous HTTP requests to the spreadsheet CSV export for `KPI_Targets` and the November monthly tab returned HTTP 200 and CSV content types. This confirms that the sheet sharing settings allow direct unauthenticated reads. The app login cannot close this route. Revoke public/link access on the spreadsheet and verify with a fresh anonymous request after Google authorization is available.

### Local changes in this pass

- Session validation rejects roles outside `ADMIN` and `SUPER_ADMIN`. Protected report RPCs receive the current session token through the shared `google.script.run` bridge. TV dashboard remains the declared public read-only exception and restricts its sheet selector to monthly names.
- `getDataFromSheet` now requires a session and validates a monthly sheet; internal code calls private `getDataFromSheet_`. Monthly sheet list and sheet-derived helper maps have authenticated RPC wrappers. MC schedules and bonus endpoints require a valid session and restrict target tabs to monthly sheets.
- Added HTML escaping in daily, MC, TV and VJ Bonus table sinks and for surfaced backend/network errors in the main dashboard. This is partial; the main dashboard still has many dynamic `innerHTML` sinks requiring a complete review.
- No business formulas were changed. Duplicate global declarations remain; shadowed copies were not consolidated because the live spreadsheet result contract is unavailable for comparison.

### Performance observations

Three anonymous HTTP samples on 2026-11-02: deployed HTML response 1.278/1.791/1.860 s (median 1.791 s; 588,981 bytes); monthly CSV export 0.856/0.922/1.035 s (median 0.922 s; 5,262 bytes). These are network-level responses and do not measure Apps Script execution time per `google.script.run` endpoint. Endpoint execution timings and read-range/cache tuning are pending; a speed-up percentage is not established.

### Deployment and access limitations

- `clasp` 3.4.1 is installed, but `clasp deployments` returned Google OAuth `invalid_grant` / `invalid_rapt`. The browser UI was unavailable in this session. Therefore sharing permissions, deployment access audience and deployed version could not be inspected or changed; source is not published.
- After Google authorization is restored: inspect and restrict spreadsheet sharing; inspect the Web App execution identity/audience; deploy the canonical source; capture the new deployment version; then retest anonymous CSV and app RPC access.


### Final local verification (2026-11-02)

- `Code.gs` parsed with Node.js; all 16 inline JavaScript blocks across the HTML source files parsed after replacing Apps Script template placeholders with neutral literals for syntax checking. This is static syntax validation, not an Apps Script execution or UI test.
- No Apps Script deployment was published and no live endpoint-specific server execution timing was available.
- Source changes this pass are in `Code.gs`, `auth_gate.html`, `moshi.html`, `daily_summary.html`, `MC_W.html`, `view_data.html`, and `VJ_Bonus.html`, plus this report and `README.md`.
