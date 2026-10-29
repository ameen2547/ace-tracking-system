# ACE Tracking System — Google Apps Script source bundle

This bundle maps the nine supplied source exports into Google Apps Script filenames and includes the source fixes described below. No spreadsheet data was accessed or changed, and KPI/bonus formulas were not altered.

## Files

- `Code.gs` — backend, routing, Sheet access and server functions
- `auth_gate.html` — shared login screen for standalone dashboard routes.
- `KPI_Targets_import.tsv` — supplied September and October 2026 VJ diamond targets, arranged for the `KPI_Targets` sheet.
- `moshi.html` — default main dashboard
- `view_data.html` — TV dashboard (`?page=tv`, `view_data`, or `viewdata`)
- `weekly_tab.html` — weekly dashboard (`?page=weekly`)
- `daily_summary.html` — daily summary (`?page=daily_summary`)
- `VJ_Bonus.html` — VJ bonus (`?page=vj_bonus` or `vjbonus`)
- `MC_W.html` — MC schedule and bonus (`?page=mc_w`)
- `kpi_vj_data.html` — VJ/team KPI (`?page=kpi_vj` or `M`)
- `KPI_data.html` — KPI target dashboard (`?page=kpi_data` or `kpi`)

## Load the supplied KPI targets

The target snapshot was provided as pasted data; this package cannot write to the connected Google Spreadsheet. To load it, open the bound spreadsheet's `KPI_Targets` tab and paste the data rows from `KPI_Targets_import.tsv` into columns A:E below the existing header. The last column is the target month (for example, `OCTOBER 2026`). Keep the source `UpdatedBy` and `UpdatedAt` values. If the tab already contains rows for the same VJ and month, review/remove those duplicate records before importing; the application resolves duplicate records by the last matching row.

The dashboard passes its selected monthly tab name to the KPI target lookup and compares month labels without case or repeated-space differences. This allows the imported month-specific rows to feed the corresponding dashboard and KPI summaries.

## Install in Apps Script

1. Back up the Google Spreadsheet and existing Apps Script project.
2. Open the spreadsheet and use **Extensions → Apps Script** so the script is bound to the intended spreadsheet. The backend uses `SpreadsheetApp.getActiveSpreadsheet()` in multiple places.
3. Create or replace the `.gs` and HTML files above. Apps Script HTML filenames omit the `.html` suffix in `createTemplateFromFile()` and `createHtmlOutputFromFile()` calls; preserve the base names and capitalization shown here.
4. Before first Admin login, set Script Properties `ACE_INITIAL_ADMIN_USERNAME` and `ACE_INITIAL_ADMIN_PASSCODE`. Use a unique passcode with at least 12 characters. On first login, the setup routine updates an account with the same username, replaces an old `1234` account, or appends a new Super Admin; it stores a salted SHA-256 hash and deletes both bootstrap properties only after the sheet write succeeds.
5. Existing Admin_Users records with passcodes other than `1234` remain usable; each is upgraded to a salted hash after its next successful login. The known weak passcode `1234` is rejected. To migrate an existing default account, set both bootstrap properties before attempting login; the first login replaces the old default row. Back up the sheet first.
6. Check project timezone, spreadsheet tab names/headers, existing triggers and deployment settings against the original project. This bundle does not include a manifest because the source does not establish the intended timezone or OAuth scopes.
7. Use a test copy first. Review and authorize requested OAuth scopes using an account with the required access.
8. Deploy a test Web App version and verify each route, reads, writes, exports, and role behavior with non-production data.
9. After the test copy passes, update the intended deployment. Retain the previous deployment and source backup for rollback.

Admin sessions use a script-cache token with a six-hour lifetime. The bootstrap write is protected by a script lock. The main dashboard and standalone report routes require a valid shared session before loading page data. New Admin passcodes must be at least 12 characters. Legacy plaintext credentials are converted on successful login; the existing Admin_Users column layout stays the same.

The main dashboard and standalone report routes validate the saved session when a page opens. Without a valid session, they require an Admin_Users login before loading page data; the login screen cannot be dismissed until authentication succeeds. Signing out from the main dashboard returns the user to that required login dialog. A valid session is reused for up to six hours.

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

- Existing legacy passcodes remain plaintext until their owners log in successfully. Configure the bootstrap properties and rotate any old default credentials before deployment.
- Login rate limiting and account lockout are not implemented; deployment access settings must still limit who can reach the Web App.
- Sheet schemas, positional columns, actual deployment filenames/settings, and KPI/bonus business rules require validation against a copied workbook and the live Apps Script project.
- Static JavaScript parsing and route checks pass. No live Google Sheets, browser functional, or deployment test has been performed.

See `ACE_SYSTEM_AUDIT.md` for the audit, issue evidence and handoff plan.
