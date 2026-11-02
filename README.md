# ACE Tracking System — Google Apps Script source bundle

**Canonical source:** this `ACE_Tracking_System` folder is the sole source of truth. `ACE_Tracking_GAS_Project` is an older assembled copy and must not be used for deployment. No source files were synced to the live deployment in this pass.

This bundle maps the supplied source exports into Google Apps Script filenames and includes the source fixes described below. The live `KPI_Targets` tab was read-only verified on 2026-11-02; no spreadsheet data was changed. KPI/bonus formulas were not altered.

## Files

- `Code.gs` — backend, routing, Sheet access and server functions
- `auth_gate.html` — shared required login gate and sidebar navigation for standalone dashboard routes.
- `KPI_Targets_import.tsv` — supplied September and October 2026 VJ diamond targets, arranged for the `KPI_Targets` sheet.
- `moshi.html` — default main dashboard
- `view_data.html` — TV dashboard (`?page=tv`, `view_data`, or `viewdata`)
- `weekly_tab.html` — weekly dashboard (`?page=weekly`)
- `daily_summary.html` — daily summary (`?page=daily_summary`)
- `VJ_Bonus.html` — VJ bonus (`?page=vj_bonus` or `vjbonus`)
- `MC_W.html` — MC schedule and bonus (`?page=mc_w`)
- `kpi_vj_data.html` — VJ/team KPI (`?page=kpi_vj` or `M`)
- `KPI_data.html` — KPI target dashboard (`?page=kpi_data` or `kpi`)
- `HOW_TO_INSTALL_MOBILE.md` — วิธีเพิ่มทางลัด ACE Tracking ลงหน้าจอ Android/iPhone

## KPI target data source

The Apps Script reads targets directly from the bound spreadsheet's `KPI_Targets` tab. It locates the VJ name, target and month columns from the header row, including the live sheet's `month` header. It matches month labels without case or repeated-space differences and uses an unscoped row as a default target. Successful reads are cached for up to 60 seconds; saves made through the application invalidate that cache immediately.

`KPI_Targets_import.tsv` is an offline snapshot supplied for reference. Do not paste it into a spreadsheet that already contains those records without checking for duplicates. The app does not import or write this file automatically.

## Install in Apps Script

1. Back up the Google Spreadsheet and existing Apps Script project.
2. Open the spreadsheet and use **Extensions → Apps Script** so the script is bound to the intended spreadsheet. The backend uses `SpreadsheetApp.getActiveSpreadsheet()` in multiple places.
3. Create or replace the `.gs` and HTML files above. Apps Script HTML filenames omit the `.html` suffix in `createTemplateFromFile()` and `createHtmlOutputFromFile()` calls; preserve the base names and capitalization shown here.
4. Before first Admin login, set Script Properties `ACE_INITIAL_ADMIN_USERNAME` and `ACE_INITIAL_ADMIN_PASSCODE`. Use a unique passcode with at least 12 characters. On first login, the setup routine updates an account with the same username, replaces an old `1234` account, or appends a new Super Admin; the passcode is written as plain text to `Admin_Users` and both bootstrap properties are deleted only after the sheet write succeeds.
5. Admin_Users passcodes are stored and compared as plain text. Existing `sha256$...` values cannot be recovered and will not authenticate; reset each affected account through the bootstrap flow before using this version. The known weak passcode `1234` is rejected. Back up the sheet first.
6. Check project timezone, spreadsheet tab names/headers, existing triggers and deployment settings against the original project. This bundle does not include a manifest because the source does not establish the intended timezone or OAuth scopes.
7. Use a test copy first. Review and authorize requested OAuth scopes using an account with the required access.
8. Deploy a test Web App version and verify each route, reads, writes, exports, and role behavior with non-production data.
9. After the test copy passes, update the intended deployment. Retain the previous deployment and source backup for rollback.

Admin sessions use a token stored in Apps Script `CacheService` for up to six hours. The browser keeps only that opaque token in `sessionStorage` for the current tab; each page validates it with the server before loading data. This keeps the login active while navigating between system pages in the same tab. Signing out from the main dashboard or shared sidebar revokes the cached session. New Admin passcodes must be at least 12 characters. The `Admin_Users` sheet stores passcodes as readable plain text; anyone with access to that sheet can read them. Do not share the spreadsheet broadly, and do not reuse these passcodes for other services.

The main Dashboard and standalone report pages have sidebars that collapse on desktop and open as a drawer on mobile. Navigation between routes validates the existing cached session and does not ask for credentials again while it remains valid.

## Routes

- Main dashboard: deployment URL without a `page` parameter
- TV: `?page=tv`
- Weekly: `?page=weekly`
- Daily: `?page=daily_summary`
- VJ bonus: `?page=vj_bonus`
- MC: `?page=mc_w`
- VJ/team KPI: `?page=kpi_vj`
- KPI targets: `?page=kpi_data`
- TV JSON API: `?action=api_dashboard` (optional `sheet` and `day` parameters)

## Remaining checks before production

- Admin passcodes are stored as plaintext by this configuration. Limit `Admin_Users` and spreadsheet access to trusted administrators; consider reverting to one-way password hashing before production use.
- Login rate limiting and account lockout are not implemented; deployment access settings must still limit who can reach the Web App.
- Complete sheet schemas, write behavior, deployment settings and KPI/bonus business rules still require validation against a copied workbook and the live Apps Script project. The read-only `KPI_Targets` tab header and data shape were verified on 2026-11-02.
- Static JavaScript parsing and route checks pass. No live Google Sheets, browser functional, or deployment test has been performed.

## UI and login update (2026-11-02)

- Moved main Dashboard navigation into a persistent sidebar and added a mobile drawer.
- Added the same route sidebar to standalone report pages.
- Kept the session token in tab-scoped `sessionStorage` and validate it against the six-hour Apps Script cache on each route load.
- Added a logout control to standalone page navigation; it revokes the server-side session and clears the tab token.
- Reduced the Dashboard toolbar to score entry and a single “More” menu for exports, screenshot, team summary and KPI entry tools.
- Limited Dashboard editing controls to `ADMIN` and `SUPER_ADMIN`; audit history and Super Admin controls are shown only to `SUPER_ADMIN`. Backend session checks remain the authority for protected operations.
- Added desktop sidebar collapse/expand controls and fixed horizontal overflow in the navigation.
- Added shared responsive table wrappers across all routed pages; dense tables keep readable column widths and scroll horizontally on small screens.
- After a fresh successful login, show mobile home-screen installation instructions once. Dismissal is saved in local storage, and the main dashboard uses the same notice.
- Mobile install means adding the Apps Script Web App URL to the phone home screen; this source bundle does not produce APK or App Store packages. See `HOW_TO_INSTALL_MOBILE.md`.
- Added a shared operation status modal for Apps Script requests. It identifies loading, saving, exporting and access checks; the TV board suppresses the modal during background refresh after its first load.
- Added Simplified Chinese controls and interface translations to the VJ Bonus, TV Leaderboard and KPI Dashboard pages; existing language controls now also update the shared operation modal and sidebar.
- This source update has not been tested against a live Apps Script deployment. Deploy to a test copy first and verify every route and authenticated action.

## KPI target and TikTok profile integration (2026-11-02)

- Monthly KPI targets are read from the `KPI_Targets` tab using VJ name, target diamond and the optional month value in column E. Month-specific values override the default target for the same VJ, matching the existing source behavior.
- VJ profile lookup reads the `vj mc all` source tab using B (VJ name) and H (TikTok ID); profile images are resolved from the TikTok ID.
- Reports now resolve target and profile data against normalized VJ names, and profile pages receive a TikTok ID plus a profile image URL derived from that ID when no direct image URL is stored.
- The profile image URL uses the source project's existing `unavatar.io/tiktok/{id}` provider. Availability depends on that external service and TikTok profile visibility.
- This update has not been tested against a live Google Sheet or deployment.

## TikTok profile source across app pages (2026-11-02)

- The `VJ MC ALL` tab's column H is the canonical TikTok ID source. Profile resolution uses that ID to form the TikTok profile link and the existing `unavatar.io/tiktok/{id}` avatar URL.
- The authenticated shared page gate labels matching VJ names with their `@TikTokID` link and applies the ID-derived avatar to matching profile images across the Dashboard, leaderboard, daily/weekly, KPI and VJ Bonus pages.
- Daily, weekly, TV, KPI, monthly report, comparison and VJ Bonus responses now include TikTok ID/profile fields where they return individual VJ rows. The matching data cache keys were versioned to prevent serving records without these fields.
- Public TikTok fields beyond username and avatar are not fetched; the current implementation does not use a TikTok API or scrape account biography/statistics.
- These source changes have not been tested against a live workbook or deployment.

## Monthly sheet selector (2026-11-02)

- Main and report sheet selectors now list only monthly tabs recognized by the system's month-name parser (English/Thai month names and supported month-year naming), plus ISO `YYYY-MM` names.
- System tabs such as `App_Config`, logs, settings and bonus tables are omitted from month selectors.

## Shared navigation and back action (2026-11-02)

- The shared sidebar on standalone pages includes links to Dashboard, TV, daily and weekly summaries, KPI pages, VJ Bonus, and MC schedule/bonus.
- Added a “ย้อนกลับ” action to the shared sidebar and Dashboard sidebar. It returns to the previous same-origin app page and falls back to the Main Dashboard when there is no safe in-app history entry.
- Enabled the same Apps Script iframe display mode on the Daily and Weekly routes that the other report routes already use, so those pages can render inside the Apps Script panel.

## Data loading optimization (2026-11-02)

- Cached successful `getDataFromSheet()` results for 60 seconds, when the serialized response fits Apps Script CacheService limits. Cached reads skip the repeated monthly range read, profile/status/team/KPI lookups and row transformation.
- System edits to daily diamonds, status overrides, MC schedule entries and KPI targets invalidate affected cached month data immediately. Direct spreadsheet edits outside the app may take up to 60 seconds to appear.
- The TV endpoint now reuses the profile map already returned by `getDataFromSheet()` instead of reading the profile sheet again on every refresh.
- This improves repeated reads and TV refreshes that hit cache. A 50% improvement on every first load cannot be confirmed without timing the live deployment and workbook; large responses above CacheService's item limit bypass response caching.

## Navigation and signed-in user panel (2026-11-02)

- Standalone-page navigation now resolves links from the Apps Script Web App deployment URL, instead of opening relative `?page=...` links inside the embedded `userCodeAppPanel` frame.
- The Back action uses safe same-origin browser history when available and falls back to the Web App's main Dashboard URL.
- Both Dashboard and standalone sidebars show the authenticated account's display name and role.
- The user panel looks for a matching VJ name or TikTok username in the existing profile sheet and uses its TikTok profile image URL. If no profile image exists or the image request fails, it shows a generated initials avatar.
- Profile lookup is limited to the authenticated user's own session and returns only that user's display name, username, role and public profile fields.
- This source update has not been tested or deployed against the live Apps Script project.

## Dashboard identity, clock and rendering (2026-11-02)

- The Dashboard now renders the signed-in name and role as soon as the session is validated, then loads the account's TikTok profile image. Profile matching checks the display name, username and TikTok ID against the existing VJ profile sheet; unmatched/failed images use an initials avatar.
- Added a live Bangkok date/time clock to Dashboard and report sidebars, formatted using the selected Thai, English or Chinese locale.
- Cached the VJ profile lookup for five minutes and extended the monthly data response cache from 20 to 60 seconds. App writes continue to invalidate monthly data cache entries; direct spreadsheet edits may take up to one minute to appear.
- Added lazy image loading and one-shot avatar fallback handlers on profile-heavy tables to reduce initial image requests and prevent repeated image error loops.
- No live performance benchmark is available, so a 100% loading-speed improvement is not claimed. Gains depend on sheet size, cache hits and external TikTok avatar service response time.

## KPI read, performance and security follow-up (2026-11-02)

- Confirmed the live `KPI_Targets` tab is readable and contains 100 data rows: 48 for September 2026, 52 for October 2026 and one blank target value. The read was read-only; the spreadsheet was not modified.
- The KPI Dashboard now reads the target tab by header, caches the target rows and dashboard response for up to 60 seconds, and invalidates those entries after an in-app KPI save. Month/name matching is normalized when checking existing rows before save.
- KPI Dashboard data and the direct admin target-map read now validate the server session. An empty monthly sheet returns the dashboard's normal empty response shape; invalid/system sheet names are rejected. KPI load errors are surfaced by the page.
- The live deployment remains version 53. These local changes have not been deployed or measured in production.
- High security finding remains: the Web App is configured to execute as its owner and be accessible to everyone. Several other server read functions and the JSON TV route still do not validate a session token, so client-side login is not sufficient to protect all spreadsheet data. Restricting these routes requires a complete client/server contract pass.
- High security finding remains: some report pages build HTML from spreadsheet-derived names/teams without HTML escaping. Review those sinks before using untrusted sheet values.
- Existing backend functions also contain duplicate public declarations and some catch blocks return detailed exception text. These require a broader compatibility-focused cleanup.

See `ACE_SYSTEM_AUDIT.md` for the audit, issue evidence and handoff plan.


## Security hardening review (2026-11-02)

- Backend session validation now accepts only `ADMIN` and `SUPER_ADMIN`; existing Super Admin-only operations retain their explicit role check. Protected Apps Script RPC calls receive the current tab session token from the shared client bridge. TV remains an explicit public, read-only exception, and its JSON dashboard accepts only recognized monthly sheet names.
- Direct `getDataFromSheet` RPC access now requires a valid session and only reads recognized monthly sheets. Sheet selector and profile/status helper RPCs are protected; their internal implementations use Apps Script private names ending in `_`. MC schedule and bonus reads require a session and restrict the requested data tab to monthly sheets.
- Anonymous checks on 2026-11-02 returned HTTP 200 for both the public `KPI_Targets` CSV export and monthly tab CSV export. Sheet sharing therefore still exposes these tabs independently of app login. Access cannot be closed from source code; change the Sheet/Drive sharing audience and verify deployment access in Google UI/API.
- XSS escaping was added to Daily, MC, TV, VJ Bonus tables and backend error strings. This is not a complete sink-by-sink audit of the large Dashboard page; do not treat XSS review as complete until every dynamic HTML sink is reviewed with hostile sheet values.
- Live anonymous response samples (3 each): deployment page 1.278–1.860 s (median 1.791 s, 588,981 bytes); selected month CSV 0.856–1.035 s (median 0.922 s, 5,262 bytes). These measure HTTP response paths, not server execution time for each `google.script.run` endpoint. No “50%/100% faster” claim is supported.
- `clasp deployments` could not read the project because the saved Google OAuth grant returned `invalid_grant` / `invalid_rapt`. No deployment version can be confirmed or updated until Google authorization is restored.
- Business calculation formulas were not intentionally changed. Source duplicate declarations remain in the legacy backend; no duplicate formula implementation was merged without comparison against live workbook results.
