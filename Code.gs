/**
 * ===================================================
 * Google Apps Script - Web App Backend (Code.gs)
 * ACE Tracking, VJ Performance Summary, Auto-Translate, System Logs & Super Admin Status
 * Enhanced with Individual KPI System
 * ===================================================
 */

/**
 * ===================================================
 * Google Apps Script - Web App Backend (Code.gs)
 * ACE Tracking, VJ Performance Summary & TV Real-time Dashboard
 * ===================================================
 */

// อัปเดตฟังก์ชัน doGet(e) รองรับ Page Routing & API Action
function doGet(e) {
  let page = e ? e.parameter.page : '';
  let action = e ? e.parameter.action : '';

  // 1. API Endpoint สำหรับส่งคืนข้อมูล JSON แบบ Real-time (?action=api_dashboard)
  if (action === 'api_dashboard' || page === 'api_dashboard') {
    const sheetName = e ? e.parameter.sheet : '';
    const day = e ? e.parameter.day : '';
    const data = getTVDashboardData(sheetName, day);
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Routing สำหรับ TV Monitor Dashboard (?page=tv หรือ ?page=view_data)
  if (page === 'tv' || page === 'view_data' || page === 'viewdata') {
    return HtmlService.createTemplateFromFile('view_data')
      .evaluate()
      .setTitle('ACE Tracking — TV Real-time Leaderboard')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  if (page === 'weekly') {
    return HtmlService.createTemplateFromFile('weekly_tab')
      .evaluate()
      .setTitle('ACE Tracking - Weekly Dashboard')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  
  if (page === 'daily_summary') {
    return HtmlService.createTemplateFromFile('daily_summary')
      .evaluate()
      .setTitle('ACE Tracking - Daily Summary Dashboard')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }

  if (page === 'vj_bonus' || page === 'vjbonus') {
    return HtmlService.createTemplateFromFile('VJ_Bonus').evaluate()
      .setTitle('ACE Tracking — VJ Bonus System')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  if (page === 'mc_w' || page === 'mc_w') {
    return HtmlService.createTemplateFromFile('MC_W').evaluate()
      .setTitle('ACE Tracking — VJ Bonus System')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  if (page === 'kpi_vj' || page === 'M') {
    return HtmlService.createTemplateFromFile('kpi_vj_data')
      .evaluate()
      .setTitle('ACE Tracking - VJ & Team KPI Dashboard')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

    if (page === 'kpi_data' || page === 'kpi') {
    return HtmlService.createTemplateFromFile('KPI_data')
      .evaluate()
      .setTitle('ACE Tracking - VJ & Team KPI Dashboard')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // หน้าเริ่มต้น (Default Page)
  return HtmlService.createTemplateFromFile('moshi')
    .evaluate()
    .setTitle('ACE Live Tracking Dashboard')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// function doGet(e) {
//   try {
//     return HtmlService.createTemplateFromFile('moshi')
//       .evaluate()
//       .setTitle('ACE LIVE Tracking, Team Summary & System Logs Dashboard')
//       .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
//       .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
//   } catch (error) {
//     return HtmlService.createHtmlOutput('<h3>Error loading application: ' + error.toString() + '</h3>');
//   }
// }

// อัปเดตฟังก์ชัน doGet(e) ใน Code.gs
// function doGet(e) {
//   let page = e ? e.parameter.page : '';
  
//   if (page === 'weekly') {
//     return HtmlService.createTemplateFromFile('weekly_tab')
//       .evaluate()
//       .setTitle('ACE Tracking - Weekly Dashboard')
//       .addMetaTag('viewport', 'width=device-width, initial-scale=1');
//   }
  
//   if (page === 'daily_summary') {
//     return HtmlService.createTemplateFromFile('daily_summary')
//       .evaluate()
//       .setTitle('ACE Tracking - Daily Summary Dashboard')
//       .addMetaTag('viewport', 'width=device-width, initial-scale=1');
//   }

//     // สลับการโหลดหน้าเว็บตาม parameter ?page=...
//       if (page === 'vj_bonus' || page === 'vjbonus') {
//         return HtmlService.createHtmlOutputFromFile('VJ_Bonus')
//           .setTitle('ACE Tracking — VJ Bonus System')
//           .addMetaTag('viewport', 'width=device-width, initial-scale=1')
//           .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
//       }
  
//       if (page === 'mc_w' || page === 'mc_w') {
//         return HtmlService.createHtmlOutputFromFile('MC_W')
//           .setTitle('ACE Tracking — VJ Bonus System')
//           .addMetaTag('viewport', 'width=device-width, initial-scale=1')
//           .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
//       }

//       // -----------------------------------------------------------
//   // [เพิ่มส่วนนี้] แทปใหม่สำหรับ KPI VJ Data & Ranking Dashboard
//   // -----------------------------------------------------------
//       if (page === 'KPIData' || page === 'KPIData') {
//     return HtmlService.createTemplateFromFile('KPI_data')
//     .setTitle('VJ & Team KPI Dashboard')
//     .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
//     .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
//       }

//   // หน้าเริ่มต้น (Default Page)
//   return HtmlService.createTemplateFromFile('moshi')
//     .evaluate()
//     .setTitle('ACE Live Tracking Dashbord')
//     .addMetaTag('viewport', 'width=device-width, initial-scale=1');
// }

// ฟังก์ชันดึงและประมวลผลข้อมูลรายวัน
function getDailySummaryData(targetSheetName, selectedDay) {
  return getDailyStatsSummary(targetSheetName, selectedDay);
}

// ระบบแปลภาษาอัตโนมัติผ่าน Google LanguageApp
function translateText(text, targetLang) {
  try {
    if (!text || text.trim() === '') return { success: true, translatedText: '' };
    const target = targetLang === 'zh' ? 'zh-CN' : targetLang;
    const translatedText = LanguageApp.translate(text, '', target);
    return { success: true, translatedText: translatedText };
  } catch (error) {
    return { success: false, error: error.toString(), originalText: text };
  }
}

// ดึงรายชื่อชีตทั้งหมด ยกเว้นชีตระบบ (Optimized)
function getSheetList() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    const excludeList = ['system_logs', 'admin_users', 'status_overrides', 'team data', 'team_data', 'vj mc all', 'kpi_targets', 'kpi_data'];
    const sheetNames = sheets
      .map(s => s.getName())
      .filter(name => !excludeList.includes(name.toLowerCase().trim()));
    return { success: true, sheetNames: sheetNames };
  } catch (error) {
    return { success: false, error: error.message || error.toString() };
  }
}

// ดึงรูปโปรไฟล์ VJ จากชีต vj mc all
function getVJProfilesMap() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('vj mc all') || ss.getSheetByName('VJ MC ALL') || ss.getSheetByName('vj_mc_all');
    if (!sheet) return {};

    const data = sheet.getDataRange().getValues();
    const profiles = {};

    for (let i = 1; i < data.length; i++) {
      const vjName = String(data[i][1] || '').trim();
      const tiktokVal = String(data[i][7] || '').trim();

      if (vjName && tiktokVal) {
        let imgUrl = tiktokVal;
        if (!imgUrl.startsWith('http')) {
          const cleanId = tiktokVal.replace('@', '').trim();
          imgUrl = `https://unavatar.io/tiktok/${cleanId}`;
        }
        profiles[vjName] = imgUrl;
      }
    }
    return profiles;
  } catch (e) {
    return {};
  }
}

// ดึงเวลาไลฟ์สดของแต่ละทีมจากชีต Team Data
function getTeamDataSchedules() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Team Data') || ss.getSheetByName('team data') || ss.getSheetByName('Team_Data');
    if (!sheet) return {};

    const data = sheet.getDataRange().getValues();
    const schedules = {};

    for (let i = 1; i < data.length; i++) {
      const teamName = String(data[i][0] || '').trim();
      const liveTimeStr = String(data[i][4] || '').trim();

      if (teamName) {
        schedules[teamName] = liveTimeStr;
      }
    }
    return schedules;
  } catch (e) {
    return {};
  }
}

function parseMonthYearFromSheetName(sheetName) {
  const monthsMap = {
    'january': 0, 'jan': 0, 'มกราคม': 0, 'ม.ค.': 0,
    'february': 1, 'feb': 1, 'กุมภาพันธ์': 1, 'ก.พ.': 1,
    'march': 2, 'mar': 2, 'มีนาคม': 2, 'มี.ค.': 2,
    'april': 3, 'apr': 3, 'เมษายน': 3, 'เม.ย.': 3,
    'may': 4, 'พฤษภาคม': 4, 'พ.ค.': 4,
    'june': 5, 'jun': 5, 'มิถุนายน': 5, 'มิ.ย.': 5,
    'july': 6, 'jul': 6, 'กรกฎาคม': 6, 'ก.ค.': 6,
    'august': 7, 'aug': 7, 'สิงหาคม': 7, 'ส.ค.': 7,
    'september': 8, 'sep': 8, 'กันยายน': 8, 'ก.ย.': 8,
    'october': 9, 'oct': 9, 'ตุลาคม': 9, 'ต.ค.': 9,
    'november': 10, 'nov': 10, 'พฤศจิกายน': 10, 'พ.ย.': 10,
    'december': 11, 'dec': 11, 'ธันวาคม': 11, 'ธ.ค.': 11
  };

  const now = new Date();
  let foundMonth = now.getMonth();
  let foundYear = now.getFullYear();

  if (!sheetName) return { month: foundMonth, year: foundYear };

  const nameLower = String(sheetName).toLowerCase();
  const yearMatch = nameLower.match(/\b(20\d\d)\b/);
  if (yearMatch) {
    foundYear = parseInt(yearMatch[1], 10);
  }

  for (const [key, val] of Object.entries(monthsMap)) {
    if (nameLower.includes(key)) {
      foundMonth = val;
      break;
    }
  }

  return { month: foundMonth, year: foundYear };
}

// ----------------------------------------------------
// ระบบ KPI รายบุคคล (Individual KPI Management)
// ----------------------------------------------------
function initKPITargetsSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('KPI_Targets');
  if (!sheet) {
    sheet = ss.insertSheet('KPI_Targets');
    sheet.appendRow(['VJ_Name', 'Target_Diamond', 'UpdatedBy', 'UpdatedAt']);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#4f46e5').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getKPITargetsMap() {
  try {
    const sheet = initKPITargetsSheet_();
    const data = sheet.getDataRange().getValues();
    const targetsMap = {};

    for (let i = 1; i < data.length; i++) {
      const vjName = String(data[i][0] || '').trim();
      const targetVal = parseFloat(data[i][1]);
      if (vjName && !isNaN(targetVal)) {
        targetsMap[vjName] = targetVal;
      }
    }
    return targetsMap;
  } catch (e) {
    return {};
  }
}

function saveKPITarget(vjName, targetVal, adminUser, sessionToken) {
  try {
    const session = requireAdminSession_(sessionToken);
    const sheet = initKPITargetsSheet_();
    const data = sheet.getDataRange().getValues();
    const cleanVJ = String(vjName).trim();
    const numTarget = parseFloat(targetVal) || 0;
    const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

    let updated = false;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toLowerCase() === cleanVJ.toLowerCase()) {
        sheet.getRange(i + 1, 2, 1, 3).setValues([[numTarget, session.displayName, now]]);
        updated = true;
        break;
      }
    }

    if (!updated) {
      sheet.appendRow([cleanVJ, numTarget, session.displayName, now]);
    }

    saveLog_('UPDATE_KPI_TARGET', `กำหนดเป้า KPI ของ ${cleanVJ} เป็น ${numTarget} Diamonds`, session.displayName, 'SUCCESS');
    return { success: true, message: 'บันทึกเป้าหมาย KPI สำเร็จ' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function getDataFromSheet(targetSheetName) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = targetSheetName ? ss.getSheetByName(targetSheetName) : ss.getSheets()[0];

    if (!sheet) sheet = ss.getSheets()[0];

    const activeSheetName = sheet.getName();
    const data = sheet.getDataRange().getValues();
    const vjProfilesMap = getVJProfilesMap();
    const statusOverrides = getStatusOverrides();
    const teamLiveSchedules = getTeamDataSchedules();
    const kpiTargetsMap = getKPITargetsMap();

    if (!data || data.length < 2) {
      return {
        success: true,
        sheetName: activeSheetName,
        headers: [],
        rows: [],
        activeIndices: [],
        sheetDiamondTotal: 0,
        vjProfiles: vjProfilesMap,
        statusOverrides: statusOverrides,
        teamLiveSchedules: teamLiveSchedules,
        kpiTargets: kpiTargetsMap,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        todayDay: new Date().getDate()
      };
    }

    const { month, year } = parseMonthYearFromSheetName(activeSheetName);

    let startRowIndex = 1;
    if (data.length > 2 && String(data[1][6]).toLowerCase().match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday|จันทร์|อังคาร|พุธ|พฤหัส|ศุกร์|เสาร์|อาทิตย์)/i)) {
      startRowIndex = 2;
    }

    const rawHeaders = data[0].map((h, i) => {
      let title = String(h).trim();
      if (!title && startRowIndex > 1 && data[1][i]) {
        title = String(data[1][i]).trim();
      }
      return title;
    });

    const rawRows = data.slice(startRowIndex);
    let extractedDiamondTotal = 0;
    const memberRows = [];
    let currentTeam = 'ไม่ระบุทีม';

    rawRows.forEach((row) => {
      const rowString = row.join(' ').toLowerCase();

      if (rowString.includes('diamond total') || rowString.includes('钻石总数')) {
        const colFValue = String(row[5] || '').replace(/,/g, '').trim();
        let val = parseFloat(colFValue);
        if (isNaN(val)) {
          const foundVal = row.find(cell => {
            const num = parseFloat(String(cell).replace(/,/g, ''));
            return !isNaN(num) && num > 1000;
          });
          val = parseFloat(String(foundVal).replace(/,/g, ''));
        }
        if (!isNaN(val)) extractedDiamondTotal = val;
        return;
      }

      const colA = String(row[0] || '').trim();
      if (colA !== '' && !colA.toLowerCase().includes('total')) {
        currentTeam = colA;
      } else if (currentTeam !== '') {
        row[0] = currentTeam;
      }

      const memberName = String(row[4] || '').trim();
      const lowerName = memberName.toLowerCase();
      const isBlankOrTotalRow = !memberName || lowerName.includes('total') || lowerName.includes('รวม');

      if (!isBlankOrTotalRow) {
        const cleanedRow = row.map(cell => {
          if (cell instanceof Date) {
            return Utilities.formatDate(cell, Session.getScriptTimeZone(), 'yyyy-MM-dd');
          }
          const strVal = String(cell === null || cell === undefined ? '' : cell).trim();
          return strVal === '-' ? '' : strVal;
        });
        memberRows.push(cleanedRow);
      }
    });

    const activeColumnIndices = [];
    for (let c = 0; c < rawHeaders.length; c++) {
      if (c <= 5) {
        activeColumnIndices.push(c);
      } else {
        const hasColData = memberRows.some(row => String(row[c] || '').trim() !== '');
        if (hasColData) {
          activeColumnIndices.push(c);
        }
      }
    }

    const filteredHeaders = activeColumnIndices.map(i => rawHeaders[i]);
    const filteredRows = memberRows.map(row => activeColumnIndices.map(i => row[i]));

    return {
      success: true,
      sheetName: activeSheetName,
      headers: filteredHeaders,
      rows: filteredRows,
      activeIndices: activeColumnIndices,
      sheetDiamondTotal: extractedDiamondTotal,
      vjProfiles: vjProfilesMap,
      statusOverrides: statusOverrides,
      teamLiveSchedules: teamLiveSchedules,
      kpiTargets: kpiTargetsMap,
      month: month,
      year: year,
      todayDay: new Date().getDate()
    };

  } catch (error) {
    return { success: false, error: error.message || error.toString() };
  }
}

function saveTeamDailyScores(targetSheetName, dateDay, selectedTeam, scoreList, adminUser, sessionToken) {
  try {
    const session = requireAdminSession_(sessionToken);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = targetSheetName ? ss.getSheetByName(targetSheetName) : ss.getSheets()[0];
    if (!sheet) return { success: false, error: 'ไม่พบแผ่นงานที่ต้องการบันทึก' };

    const data = sheet.getDataRange().getValues();
    const targetColIndex = 6 + parseInt(dateDay, 10);
    let updatedCount = 0;

    let items = [];
    if (Array.isArray(scoreList)) {
      items = scoreList;
    } else if (typeof scoreList === 'object' && scoreList !== null) {
      items = Object.keys(scoreList).map(key => ({ member: key, score: scoreList[key] }));
    }

    items.forEach(item => {
      const memberName = String(item.member || '').trim();
      const scoreVal = item.score;
      if (!memberName || scoreVal === undefined || scoreVal === null) return;

      let currentTeamInSheet = '';
      for (let i = 1; i < data.length; i++) {
        const colA = String(data[i][0] || '').trim();
        if (colA !== '' && !colA.toLowerCase().includes('total')) {
          currentTeamInSheet = colA;
        }

        const rowMember = String(data[i][4] || '').trim();

        if (rowMember === memberName && (currentTeamInSheet === selectedTeam || !selectedTeam)) {
          sheet.getRange(i + 1, targetColIndex).setValue(scoreVal);
          updatedCount++;
          break;
        }
      }
    });

    const loggerName = session.displayName;
    saveLog_('SAVE_DAILY_SCORES', `บันทึกคะแนนทีม ${selectedTeam} วันที่ ${dateDay} (ชีต: ${sheet.getName()}) จำนวน ${updatedCount} รายการ`, loggerName, 'SUCCESS');
    return { success: true, message: 'บันทึกคะแนนเรียบร้อยแล้ว!', updatedCount: updatedCount };

  } catch (error) {
    saveLog_('SAVE_DAILY_SCORES', `เกิดข้อผิดพลาด: ${error.message || 'บันทึกไม่สำเร็จ'}`, 'System', 'FAILED');
    return { success: false, error: error.message || 'ไม่สามารถบันทึกคะแนนได้' };
  }
}

function initStatusSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Status_Overrides');
  if (!sheet) {
    sheet = ss.insertSheet('Status_Overrides');
    sheet.appendRow(['Type', 'TargetName', 'StatusValue', 'UpdatedBy', 'UpdatedAt']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#0284c7').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function saveStatusOverride(type, targetName, statusValue, adminUser, sessionToken) {
  try {
    const session = requireAdminSession_(sessionToken);
    const sheet = initStatusSheet_();
    const data = sheet.getDataRange().getValues();
    const cleanType = String(type).trim();
    const cleanTarget = String(targetName).trim();
    const cleanValue = String(statusValue).trim();
    const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

    let updated = false;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === cleanType && String(data[i][1]).trim().toLowerCase() === cleanTarget.toLowerCase()) {
        sheet.getRange(i + 1, 3, 1, 3).setValues([[cleanValue, session.displayName, now]]);
        updated = true;
        break;
      }
    }

    if (!updated) {
      sheet.appendRow([cleanType, cleanTarget, cleanValue, session.displayName, now]);
    }

    saveLog_('UPDATE_STATUS', `ปรับเปลี่ยนสถานะ ${cleanType} ของ "${cleanTarget}" เป็น -> ${cleanValue}`, session.displayName, 'SUCCESS');
    return { success: true, message: 'อัปเดตสถานะเรียบร้อยแล้ว' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function getStatusOverrides() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Status_Overrides');
    if (!sheet) return { memberWorking: {}, memberLive: {}, teamStatus: {} };

    const data = sheet.getDataRange().getValues();
    const overrides = { memberWorking: {}, memberLive: {}, teamStatus: {} };

    for (let i = 1; i < data.length; i++) {
      const type = String(data[i][0] || '').trim();
      const target = String(data[i][1] || '').trim();
      const val = String(data[i][2] || '').trim();

      if (type === 'MEMBER_WORKING') overrides.memberWorking[target] = val;
      else if (type === 'MEMBER_LIVE') overrides.memberLive[target] = val;
      else if (type === 'TEAM_STATUS') overrides.teamStatus[target] = val;
    }
    return overrides;
  } catch (e) {
    return { memberWorking: {}, memberLive: {}, teamStatus: {} };
  }
}

function saveLog_(action, details, userInfo, status) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let logSheet = ss.getSheetByName('System_Logs');

    if (!logSheet) {
      logSheet = ss.insertSheet('System_Logs');
      logSheet.appendRow(['Timestamp', 'Action', 'Details', 'User_Info', 'Status']);
      logSheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#0f172a').setFontColor('#ffffff');
      logSheet.setFrozenRows(1);
    }

    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    const user = userInfo || Session.getActiveUser().getEmail() || 'Client Web User';

    logSheet.appendRow([timestamp, action || 'GENERAL', details || '-', user, status || 'SUCCESS']);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function getLogs_() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const logSheet = ss.getSheetByName('System_Logs');
    if (!logSheet) return { success: true, logs: [] };

    const data = logSheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, logs: [] };

    const logs = data.slice(1).map(row => ({
      timestamp: row[0] instanceof Date ? Utilities.formatDate(row[0], Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss') : String(row[0]),
      action: String(row[1] || ''),
      details: String(row[2] || ''),
      userInfo: String(row[3] || ''),
      status: String(row[4] || '')
    })).reverse();

    return { success: true, logs: logs };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function getSystemLogs(sessionToken) {
  try { requireAdminSession_(sessionToken, ['SUPER_ADMIN']); } catch (error) { return []; }
  const result = getLogs_();
  return result.success ? result.logs : [];
}

const ACE_ADMIN_SESSION_TTL_SECONDS = 21600;

function createAdminSession_(username, displayName, role) {
  const token = Utilities.getUuid() + Utilities.getUuid().replace(/-/g, '');
  const session = {
    username: String(username || '').trim().toLowerCase(),
    displayName: String(displayName || 'Admin').trim(),
    role: String(role || 'ADMIN').trim().toUpperCase(),
    createdAt: Date.now()
  };
  CacheService.getScriptCache().put('ACE_ADMIN_SESSION_' + token, JSON.stringify(session), ACE_ADMIN_SESSION_TTL_SECONDS);
  return { token: token, expiresIn: ACE_ADMIN_SESSION_TTL_SECONDS };
}

function getAdminSession_(token) {
  const cleanToken = String(token || '').trim();
  if (!cleanToken || cleanToken.length > 128) return null;
  const raw = CacheService.getScriptCache().get('ACE_ADMIN_SESSION_' + cleanToken);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw);
    if (!session || !session.role || !session.username) return null;
    return session;
  } catch (error) {
    return null;
  }
}

function hashAdminPasscode_(passcode) {
  const salt = Utilities.getUuid().replace(/-/g, '');
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + String(passcode || ''), Utilities.Charset.UTF_8);
  const hex = digest.map(byte => ('0' + ((byte + 256) % 256).toString(16)).slice(-2)).join('');
  return 'sha256$' + salt + '$' + hex;
}

function adminPasscodeMatches_(passcode, storedValue) {
  const stored = String(storedValue || '');
  if (!stored.startsWith('sha256$')) return stored === String(passcode || '');
  const parts = stored.split('$');
  if (parts.length !== 3) return false;
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, parts[1] + String(passcode || ''), Utilities.Charset.UTF_8);
  const candidate = digest.map(byte => ('0' + ((byte + 256) % 256).toString(16)).slice(-2)).join('');
  if (candidate.length !== parts[2].length) return false;
  let mismatch = 0;
  for (let i = 0; i < candidate.length; i++) mismatch |= candidate.charCodeAt(i) ^ parts[2].charCodeAt(i);
  return mismatch === 0;
}

function requireAdminSession_(token, allowedRoles) {
  const session = getAdminSession_(token);
  if (!session) throw new Error('เซสชันหมดอายุหรือไม่มีสิทธิ์ กรุณาเข้าสู่ระบบใหม่');
  if (Array.isArray(allowedRoles) && allowedRoles.length && allowedRoles.indexOf(session.role) === -1) {
    throw new Error('บัญชีนี้ไม่มีสิทธิ์ดำเนินการ');
  }
  return session;
}

function logoutAdminSession(token) {
  const cleanToken = String(token || '').trim();
  if (cleanToken && cleanToken.length <= 128) CacheService.getScriptCache().remove('ACE_ADMIN_SESSION_' + cleanToken);
  return { success: true };
}

function validateAdminSession(token) {
  const session = getAdminSession_(token);
  return session ? { success: true, displayName: session.displayName, role: session.role } : { success: false };
}

function verifyAdminAccess(passcode, username) {
  try {
    const cleanPass = String(passcode || '').trim();
    const cleanUser = String(username || '').trim().toLowerCase();
    if (cleanPass === '1234') return { success: false, error: 'รหัสผ่านเริ่มต้นถูกปิดใช้งาน กรุณาตั้งรหัสผ่านใหม่ในชีต Admin_Users' };
    if (!cleanUser || !cleanPass) return { success: false, error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' };

    const adminSheet = initAdminUsersSheet_();
    const data = adminSheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      const uName = String(data[i][0] || '').trim().toLowerCase();
      const uPass = String(data[i][1] || '').trim();
      const dispName = String(data[i][2] || 'Admin');
      const role = String(data[i][3] || 'ADMIN');

      if (uName === cleanUser && adminPasscodeMatches_(cleanPass, uPass)) {
        if (!uPass.startsWith('sha256$')) adminSheet.getRange(i + 1, 2).setValue(hashAdminPasscode_(cleanPass));
        saveLog_('ADMIN_LOGIN', `แอดมิน ${dispName} (${uName}) เข้าสู่ระบบสำเร็จ`, dispName, 'SUCCESS');
        const session = createAdminSession_(uName, dispName, role);
        return { success: true, message: `ยินดีต้อนรับ ${dispName}`, displayName: dispName, role: session.role, token: session.token, expiresIn: session.expiresIn };
      }
    }

    saveLog_('ADMIN_LOGIN', `พยายามเข้าสู่ระบบแต่รหัสผ่าน/ผู้ใช้ไม่ถูกต้อง`, cleanUser || 'Unknown User', 'FAILED');
    return { success: false, error: 'รหัสผ่านหรือชื่อผู้ใช้งานไม่ถูกต้อง!' };

  } catch (error) {
    return { success: false, error: 'ไม่สามารถเข้าสู่ระบบได้ในขณะนี้' };
  }
}

function verifyAdminPasscode(passcode, username) {
  return verifyAdminAccess(passcode, username);
}

function addNewMemberToSheet(targetSheetName, teamName, shiftName, vjName, adminUser, sessionToken) {
  try {
    const session = requireAdminSession_(sessionToken);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = targetSheetName ? ss.getSheetByName(targetSheetName) : ss.getSheets()[0];

    if (!sheet) return { success: false, error: 'ไม่พบแผ่นงานที่ระบุ' };
    if (!vjName || !vjName.trim()) return { success: false, error: 'กรุณากรอกชื่อ VJ' };

    const lastRow = sheet.getLastRow() + 1;
    const formulaSum = `=SUM(G${lastRow}:AJ${lastRow})`;

    const newRowData = [
      teamName || 'ไม่ระบุทีม',
      shiftName || '-',
      '',
      '',
      vjName.trim(),
      formulaSum
    ];

    sheet.appendRow(newRowData);
    saveLog_('ADD_MEMBER', `เพิ่มสมาชิกใหม่: ${vjName} (ทีม: ${teamName}, กะ: ${shiftName}) ในชีต ${sheet.getName()}`, session.displayName || adminUser || 'Admin', 'SUCCESS');

    return { success: true, message: `เพิ่มสมาชิก "${vjName}" เรียบร้อยแล้ว!` };

  } catch (error) {
    saveLog_('ADD_MEMBER', `เกิดข้อผิดพลาดในการเพิ่มสมาชิก: ${error.message || 'บันทึกไม่สำเร็จ'}`, 'System', 'FAILED');
    return { success: false, error: error.message || error.toString() };
  }
}

function addNewMember(targetSheetName, teamName, shiftName, vjName, adminUser) {
  return addNewMemberToSheet(targetSheetName, teamName, shiftName, vjName, adminUser);
}

function initAdminUsersSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let adminSheet = ss.getSheetByName('Admin_Users');
  let wasCreated = false;

  if (!adminSheet) {
    wasCreated = true;
    adminSheet = ss.insertSheet('Admin_Users');
    adminSheet.appendRow(['Username', 'Passcode', 'DisplayName', 'Role', 'CreatedAt']);
    adminSheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    adminSheet.setFrozenRows(1);
  }

  const properties = PropertiesService.getScriptProperties();
  const bootstrapUsername = String(properties.getProperty('ACE_INITIAL_ADMIN_USERNAME') || '').trim().toLowerCase();
  const bootstrapPasscode = String(properties.getProperty('ACE_INITIAL_ADMIN_PASSCODE') || '').trim();
  if (bootstrapUsername && bootstrapPasscode.length >= 12) {
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const rows = adminSheet.getLastRow() > 1 ? adminSheet.getRange(2, 1, adminSheet.getLastRow() - 1, 5).getValues() : [];
      const usernameIndex = rows.findIndex(row => String(row[0] || '').trim().toLowerCase() === bootstrapUsername);
      const defaultIndex = rows.findIndex(row => String(row[1] || '').trim() === '1234');
      const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
      const adminRecord = [bootstrapUsername, hashAdminPasscode_(bootstrapPasscode), 'Super Admin', 'SUPER_ADMIN', now];

      if (usernameIndex >= 0) {
        adminSheet.getRange(usernameIndex + 2, 1, 1, 5).setValues([adminRecord]);
      } else if (defaultIndex >= 0) {
        adminSheet.getRange(defaultIndex + 2, 1, 1, 5).setValues([adminRecord]);
      } else {
        adminSheet.appendRow(adminRecord);
      }
      SpreadsheetApp.flush();
      properties.deleteProperty('ACE_INITIAL_ADMIN_PASSCODE');
      properties.deleteProperty('ACE_INITIAL_ADMIN_USERNAME');
    } finally {
      lock.releaseLock();
    }
  }
  return adminSheet;
}

function getAdminUsersList(sessionToken) {
  try {
    requireAdminSession_(sessionToken, ['SUPER_ADMIN']);
    const adminSheet = initAdminUsersSheet_();
    const data = adminSheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, admins: [] };

    const admins = data.slice(1).map(row => ({
      username: String(row[0] || ''),
      displayName: String(row[2] || 'Admin'),
      role: String(row[3] || 'ADMIN'),
      createdAt: row[4] instanceof Date
        ? Utilities.formatDate(row[4], Session.getScriptTimeZone(), 'yyyy-MM-dd')
        : String(row[4] || '-')
    }));

    return { success: true, admins: admins };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function createNewAdminUser(username, passcode, displayName, role, adminUser, sessionToken) {
  try {
    const session = requireAdminSession_(sessionToken, ['SUPER_ADMIN']);
    if (!username || !passcode || !displayName) {
      return { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
    }
    if (String(passcode).trim().length < 12) return { success: false, error: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 12 ตัวอักษร' };
    const cleanRole = String(role || 'ADMIN').trim().toUpperCase();
    if (cleanRole !== 'ADMIN' && cleanRole !== 'SUPER_ADMIN') return { success: false, error: 'บทบาทผู้ใช้ไม่ถูกต้อง' };

    const adminSheet = initAdminUsersSheet_();
    const data = adminSheet.getDataRange().getValues();

    const cleanUsername = String(username).trim().toLowerCase();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toLowerCase() === cleanUsername) {
        return { success: false, error: `Username "${cleanUsername}" มีอยู่ในระบบแล้ว` };
      }
    }

    const createdAt = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    adminSheet.appendRow([cleanUsername, hashAdminPasscode_(String(passcode).trim()), String(displayName).trim(), cleanRole, createdAt]);

    saveLog_('ADD_ADMIN', `เพิ่มแอดมินใหม่: ${displayName} (${cleanUsername}) บทบาท: ${role}`, session.displayName || adminUser || 'Super Admin', 'SUCCESS');
    return { success: true, message: `เพิ่มแอดมิน "${displayName}" เรียบร้อยแล้ว` };

  } catch (error) {
    saveLog_('ADD_ADMIN', `ข้อผิดพลาดในการเพิ่มแอดมิน: ${error.message || 'บันทึกไม่สำเร็จ'}`, 'System', 'FAILED');
    return { success: false, error: error.toString() };
  }
}

function deleteAdminUser(targetUsername, adminUser, sessionToken) {
  try {
    const session = requireAdminSession_(sessionToken, ['SUPER_ADMIN']);
    const adminSheet = initAdminUsersSheet_();
    const data = adminSheet.getDataRange().getValues();
    const cleanUser = String(targetUsername).trim().toLowerCase();

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toLowerCase() === cleanUser) {
        adminSheet.deleteRow(i + 1);
        saveLog_('DELETE_ADMIN', `ลบแอดมิน: ${cleanUser}`, session.displayName || adminUser || 'Super Admin', 'SUCCESS');
        return { success: true, message: 'ลบแอดมินเรียบร้อยแล้ว' };
      }
    }
    return { success: false, error: 'ไม่พบแอดมินที่ต้องการลบ' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ===================================================
// KPI Real-time Extension (added without changing existing functions)
// ===================================================
const KPI_DATA_HEADERS_EXTENSION = ['Timestamp', 'VJ_Name', 'Team', 'Target_KPI', 'Actual_KPI', 'Achieved_Rate_%', 'UpdatedBy', 'Notes'];

function initKPIDataSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('KPI_Data');
  if (!sheet) {
    sheet = ss.insertSheet('KPI_Data');
    sheet.getRange(1, 1, 1, KPI_DATA_HEADERS_EXTENSION.length).setValues([KPI_DATA_HEADERS_EXTENSION]);
    sheet.getRange(1, 1, 1, KPI_DATA_HEADERS_EXTENSION.length)
      .setFontWeight('bold').setBackground('#4f46e5').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getVJListForIndividualKPI() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const preferredNames = ['vj mc all', 'vj_mc_all'];
  const sourceSheet = ss.getSheets().find(function (sheet) {
    return preferredNames.indexOf(sheet.getName().toLowerCase().trim()) !== -1;
  });
  const sourceSheets = sourceSheet ? [sourceSheet] : ss.getSheets().filter(function (sheet) {
    const excluded = ['kpi_data', 'kpi_targets', 'system_logs', 'admin_users', 'status_overrides', 'team data', 'team_data'];
    return excluded.indexOf(sheet.getName().toLowerCase().trim()) === -1 && sheet.getLastRow() >= 2;
  });
  const seen = {};
  const vjs = [];
  sourceSheets.forEach(function (sheet) {
    const values = sheet.getDataRange().getValues();
    const headers = values[0].map(function (value) { return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]/g, ''); });
    const nameIndex = headers.findIndex(function (header) { return ['vjname', 'name', 'vj'].indexOf(header) !== -1; });
    const teamIndex = headers.findIndex(function (header) { return ['team', 'teamname'].indexOf(header) !== -1; });
    const resolvedNameIndex = nameIndex >= 0 ? nameIndex : (sourceSheet ? 1 : 4);
    const resolvedTeamIndex = teamIndex >= 0 ? teamIndex : 0;
    values.slice(1).forEach(function (row) {
      const name = String(row[resolvedNameIndex] || '').trim();
      const team = String(row[resolvedTeamIndex] || '').trim();
      const key = name.toLowerCase();
      if (name && !seen[key] && !key.includes('total')) {
        seen[key] = true;
        vjs.push({ name: name, team: team });
      }
    });
  });
  vjs.sort(function (a, b) { return a.name.localeCompare(b.name); });
  return { success: true, vjs: vjs, sourceSheet: sourceSheet ? sourceSheet.getName() : 'latest system data' };
}

function getIndividualKPISetupData() {
  try {
    initKPIDataSheet_();
    return getVJListForIndividualKPI();
  } catch (error) {
    return { success: false, error: error.toString(), vjs: [] };
  }
}

function saveIndividualKPIData(vjName, team, target, actual, notes, adminUser, sessionToken) {
  const lock = LockService.getDocumentLock();
  try {
    const session = requireAdminSession_(sessionToken);
    lock.waitLock(30000);
    const cleanName = String(vjName || '').trim();
    const cleanTeam = String(team || '').trim();
    const targetNumber = Number(target);
    const actualNumber = Number(actual);
    if (!cleanName) throw new Error('กรุณาเลือกชื่อ VJ');
    if (!isFinite(targetNumber) || targetNumber <= 0) throw new Error('เป้าหมาย KPI ต้องมากกว่า 0');
    if (!isFinite(actualNumber) || actualNumber < 0) throw new Error('ยอดทำได้จริงต้องเป็น 0 หรือมากกว่า');

    const vjResult = getVJListForIndividualKPI();
    const matchedVJ = (vjResult.vjs || []).find(function (vj) { return vj.name.toLowerCase() === cleanName.toLowerCase(); });
    if (!matchedVJ) throw new Error('ไม่พบข้อมูล VJ คนนี้ในระบบ');

    const sheet = initKPIDataSheet_();
    const finalTeam = cleanTeam || matchedVJ.team || '';
    const rate = (actualNumber / targetNumber) * 100;
    const timestamp = new Date();
    const updatedBy = String(session.displayName).trim();
    const rowValues = [timestamp, matchedVJ.name, finalTeam, targetNumber, actualNumber, rate, updatedBy, String(notes || '').trim()];
    const data = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, KPI_DATA_HEADERS_EXTENSION.length).getValues() : [];
    let targetRow = 0;
    for (let i = 0; i < data.length; i++) {
      if (String(data[i][1] || '').trim().toLowerCase() === matchedVJ.name.toLowerCase()) targetRow = i + 2;
    }
    if (targetRow) sheet.getRange(targetRow, 1, 1, KPI_DATA_HEADERS_EXTENSION.length).setValues([rowValues]);
    else sheet.appendRow(rowValues);
    saveLog_('SAVE_INDIVIDUAL_KPI', 'บันทึก KPI ของ ' + matchedVJ.name + ': Target ' + targetNumber + ', Actual ' + actualNumber, updatedBy, 'SUCCESS');
    return { success: true, message: 'บันทึกยอด KPI เรียบร้อยแล้ว', data: { vjName: matchedVJ.name, team: finalTeam, target: targetNumber, actual: actualNumber, achievedRate: rate, updatedBy: updatedBy, timestamp: Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss') } };
  } catch (error) {
    saveLog_('SAVE_INDIVIDUAL_KPI', 'ล้มเหลวในการบันทึก KPI: ' + (error.message || 'บันทึกไม่สำเร็จ'), 'System', 'FAILED');
    return { success: false, error: error.toString() };
  } finally {
    try { lock.releaseLock(); } catch (ignore) { }
  }
}


// ฟังก์ชันสำหรับกระจาย KPI จากระดับทีมลงสู่ VJ
function distributeKPI(payload) {
  try {
    const { team, totalKPI, mode, manualTargets, adminUser } = payload;
    
    // ดึงรายชื่อ VJ จากระบบเดิมและกรองเฉพาะทีมที่เลือก
    const vjData = getVJListForIndividualKPI(); 
    const vjList = (vjData.vjs || []).filter(v => v.team.toLowerCase() === team.toLowerCase());
    
    if (vjList.length === 0) return { success: false, error: 'ไม่พบ VJ ในทีมนี้' };

    let results = [];
    if (mode === 'Auto') {
      // โหมด Auto: หารเฉลี่ยตามจำนวน VJ ในทีม
      const avgKPI = totalKPI / vjList.length;
      vjList.forEach(vj => {
        results.push(saveIndividualKPIData(vj.name, team, avgKPI, 0, 'Auto Distribute', adminUser));
      });
    } else {
      // โหมด Manual: ใช้ข้อมูลเป้าหมายที่ส่งมาจาก Frontend
      manualTargets.forEach(target => {
        results.push(saveIndividualKPIData(target.name, team, target.kpi, 0, 'Manual Distribute', adminUser));
      });
    }
    
    return { success: true, message: 'อัปเดต KPI สำเร็จ', results: results };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}


/**
 * ===================================================
 * [เพิ่มใหม่] ฟังก์ชันคำนวณและดึงข้อมูลสรุปยอดรายเดือน (Monthly Stats Summary)
 * ===================================================
 */
function getACETrackingMonthlyStatsSummary(targetSheetName) {
  try {
    const rawData = getDataFromSheet(targetSheetName);
    if (!rawData.success) return rawData;

    const rows = rawData.rows || [];
    const kpiTargets = rawData.kpiTargets || {};
    const statusOverrides = rawData.statusOverrides || {};
    const month = rawData.month;
    const year = rawData.year;
    const todayDay = rawData.todayDay || new Date().getDate();

    // จำนวนวันทั้งหมดในเดือน และจำนวนวันที่ผ่านไปแล้ว
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const elapsedDays = Math.min(todayDay, totalDaysInMonth);

    // กรอง VJ ที่ยกเว้นออกจากการคำนวณ (Resigned, HR, Trainee)
    const validRows = rows.filter(row => {
      const team = String(row[0] || '').trim();
      const memberName = String(row[4] || '').trim();
      const status = String(statusOverrides.memberWorking?.[memberName] || row[2] || '').trim();

      const teamLower = team.toLowerCase();
      const nameLower = memberName.toLowerCase();
      const statusLower = status.toLowerCase();

      if (!memberName || nameLower.includes('total') || nameLower.includes('รวม')) return false;
      if (statusLower.includes('resigned') || statusLower.includes('ลาออก') || statusLower.includes('hr') || statusLower.includes('trainee')) return false;
      if (teamLower.includes('hr') || teamLower.includes('trainee') || teamLower.includes('resigned') || teamLower.includes('ลาออก')) return false;

      return true;
    });

    let totalDiamonds = 0;
    let totalKpiTarget = 0;
    const teamStatsMap = {};
    const vjStatsList = [];
    const dailyTotalsMap = {};

    for (let d = 1; d <= totalDaysInMonth; d++) dailyTotalsMap[d] = 0;

    validRows.forEach(row => {
      const team = String(row[0] || 'ไม่ระบุทีม').trim();
      const memberName = String(row[4] || '').trim();
      const target = parseFloat(kpiTargets[memberName]) || 0;

      let memberDiamondTotal = 0;
      for (let d = 1; d <= totalDaysInMonth; d++) {
        const colIdx = 5 + d; // Day 1 เริ่มที่ index 6
        const score = parseFloat(String(row[colIdx] || '').replace(/,/g, '')) || 0;
        memberDiamondTotal += score;
        dailyTotalsMap[d] += score;
      }

      totalDiamonds += memberDiamondTotal;
      totalKpiTarget += target;

      // สรุปข้อมูลระดับทีม
      if (!teamStatsMap[team]) {
        teamStatsMap[team] = { teamName: team, vjCount: 0, totalDiamonds: 0, totalTarget: 0 };
      }
      teamStatsMap[team].vjCount += 1;
      teamStatsMap[team].totalDiamonds += memberDiamondTotal;
      teamStatsMap[team].totalTarget += target;

      // สรุปข้อมูลราย VJ
      const vjAchievedRate = target > 0 ? (memberDiamondTotal / target) * 100 : 0;
      vjStatsList.push({
        name: memberName,
        team: team,
        totalDiamonds: memberDiamondTotal,
        target: target,
        achievedRate: vjAchievedRate
      });
    });

    // ค้นหาทีมยอดเยี่ยม และ VJ ยอดเยี่ยม
    let topTeam = '-';
    let maxTeamDiamonds = -1;
    Object.values(teamStatsMap).forEach(t => {
      if (t.totalDiamonds > maxTeamDiamonds) {
        maxTeamDiamonds = t.totalDiamonds;
        topTeam = t.teamName;
      }
    });

    vjStatsList.sort((a, b) => b.totalDiamonds - a.totalDiamonds);
    const topVJ = vjStatsList.length > 0 ? vjStatsList[0] : null;

    const dailyAverage = elapsedDays > 0 ? totalDiamonds / elapsedDays : 0;
    const forecastEOM = dailyAverage * totalDaysInMonth;
    const overallAchievementRate = totalKpiTarget > 0 ? (totalDiamonds / totalKpiTarget) * 100 : 0;

    return {
      success: true,
      sheetName: rawData.sheetName,
      month, year, totalDaysInMonth, elapsedDays,
      totalDiamonds, totalKpiTarget, overallAchievementRate,
      dailyAverage, forecastEOM,
      topTeam: { name: topTeam, diamonds: maxTeamDiamonds },
      topVJ: topVJ,
      teamStats: Object.values(teamStatsMap),
      vjStatsList: vjStatsList,
      dailyTotalsMap: dailyTotalsMap
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * สรุปยอดรายสัปดาห์ (Weekly Stats Summary)
 * ===================================================
 */



/**
 * ดึงข้อมูลสรุปเปรียบเทียบรายเดือนจากทุก Sheet
 */
function getMultiMonthComparisonData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    const resultList = [];

    sheets.forEach(sheet => {
      const name = sheet.getName();
      // ดึงเฉพาะ Sheet ที่เป็นชื่อเดือน/ปี (เช่น AUGUST 2026, JULY 2026)
      if (name.toUpperCase().includes('202') || name.toUpperCase().includes('203')) {
        const stats = getACETrackingMonthlyStatsSummary(name);
        if (stats.success) {
          resultList.push({
            sheetName: name,
            totalDiamonds: stats.totalDiamonds,
            totalKpiTarget: stats.totalKpiTarget,
            achievedRate: stats.overallAchievementRate,
            dailyAvg: stats.dailyAverage,
            vjCount: stats.vjStatsList.length,
            topTeam: stats.topTeam.name
          });
        }
      }
    });

    return { success: true, data: resultList };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
/**
 * ดึงข้อมูลเปรียบเทียบ VJ รายเดือน (กรองเฉพาะสถานะ VJ เท่านั้น)
 */
/**
 * ดึงข้อมูลเปรียบเทียบ VJ รายเดือน (กรองเฉพาะ VJ เท่านั้น ตัด Trainee, MC, HR, Staff ออกเด็ดขาด)
 */
// Map ลำดับเดือนสำหรับเรียงเวลา
const MONTH_ORDER_MAP = {
  'JANUARY': 1, 'FEBRUARY': 2, 'MARCH': 3, 'APRIL': 4, 'MAY': 5, 'JUNE': 6,
  'JULY': 7, 'AUGUST': 8, 'SEPTEMBER': 9, 'OCTOBER': 10, 'NOVEMBER': 11, 'DECEMBER': 12
};

function getMonthYearScore(str) {
  const parts = String(str).trim().toUpperCase().split(/\s+/);
  const mNum = MONTH_ORDER_MAP[parts[0]] || 1;
  const yNum = parseInt(parts[1]) || 2026;
  return yNum * 100 + mNum;
}

/**
 * ดึงข้อมูล VJ รายเดือน + อัปเดตทีมปัจจุบัน + บันทึก Remark ย้ายทีม
 */
function getVJMultiMonthComparison() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    const vjMap = {};
    let monthList = [];

    const nonVJKeywords = ['trainee', 'mc', 'hr', 'resigned', 'staff', 'ลาออก', 'ผู้ดูแล', 'total', 'รวม'];

    // 1. คัดเลือกและเรียงลำดับชีทเดือนตามเวลา (จากอดีต -> ปัจจุบัน)
    sheets.forEach(sheet => {
      const sheetName = sheet.getName();
      if (sheetName.toUpperCase().includes('202') || sheetName.toUpperCase().includes('203')) {
        monthList.push(sheetName);
      }
    });
    monthList.sort((a, b) => getMonthYearScore(a) - getMonthYearScore(b));

    // 2. ดึงข้อมูลแต่ละเดือนตามลำดับเวลา
    monthList.forEach(sheetName => {
      const stats = getACETrackingMonthlyStatsSummary(sheetName);
      if (stats.success && stats.vjStatsList) {
        stats.vjStatsList.forEach(vj => {
          let rawName = String(vj.name || '').trim();
          let teamName = String(vj.team || '').trim();

          const rawNameLower = rawName.toLowerCase();
          const teamNameLower = teamName.toLowerCase();

          const isInvalid = !rawName || !isNaN(rawName);
          const isNonVJName = nonVJKeywords.some(kw => rawNameLower.includes(kw));
          const isNonVJTeam = nonVJKeywords.some(kw => teamNameLower.includes(kw));

          if (isInvalid || isNonVJName || isNonVJTeam) return;

          if (!vjMap[rawName]) {
            vjMap[rawName] = {
              name: rawName,
              latestTeam: 'ไม่ระบุทีม',
              teamHistory: {}, // เก็บประวัติทีมแต่ละเดือน
              months: {}
            };
          }

          vjMap[rawName].months[sheetName] = vj.totalDiamonds;
          if (teamName && !nonVJKeywords.some(kw => teamNameLower.includes(kw))) {
            vjMap[rawName].teamHistory[sheetName] = teamName;
          }
        });
      }
    });

    // 3. ตรวจสอบการย้ายทีม และระบุ Remark
    const vjDataList = Object.values(vjMap).map(vj => {
      const activeMonths = monthList.filter(m => vj.teamHistory[m]);

      let currentTeam = 'ไม่ระบุทีม';
      let prevTeam = '';
      let teamTransferRemark = '';

      if (activeMonths.length > 0) {
        currentTeam = vj.teamHistory[activeMonths[activeMonths.length - 1]]; // ทีมเดือนล่าสุด

        if (activeMonths.length >= 2) {
          prevTeam = vj.teamHistory[activeMonths[activeMonths.length - 2]]; // ทีมเดือนก่อนหน้า
        }
      }

      // ตรวจจับว่ามีการย้ายทีมหรือไม่
      if (prevTeam && currentTeam && prevTeam !== currentTeam) {
        teamTransferRemark = `ย้ายทีมจาก ${prevTeam} ➔ ${currentTeam}`;
      }

      return {
        name: vj.name,
        team: currentTeam,            // ทีมปัจจุบัน (อัปเดตล่าสุด)
        latestTeam: currentTeam,
        prevTeam: prevTeam,
        teamTransferRemark: teamTransferRemark, // Remark การย้ายทีม
        months: vj.months
      };
    });

    return {
      success: true,
      monthList: monthList,
      vjData: vjDataList
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * ===================================================
 * ACE Live Tracking - MC Schedule & Daily Bonus System Extension
 * ===================================================
 */

// 1. สร้างและตรวจสอบชีตสำหรับ MC สองชีต (MC_Schedules และ MC_Bonus_Logs)
function initMCSheets_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ชีตตารางงาน MC
  let schSheet = ss.getSheetByName('MC_Schedules');
  if (!schSheet) {
    schSheet = ss.insertSheet('MC_Schedules');
    const headers = ['ID', 'Date', 'MC_Name', 'Assigned_Team', 'Cover_Team', 'Is_Cover', 'Shift_Time', 'Status', 'Notes', 'UpdatedBy', 'UpdatedAt'];
    schSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    schSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#4f46e5').setFontColor('#ffffff');
    schSheet.setFrozenRows(1);
  }

  // ชีตประวัติการคำนวณโบนัส MC
  let bonusSheet = ss.getSheetByName('MC_Bonus_Logs');
  if (!bonusSheet) {
    bonusSheet = ss.insertSheet('MC_Bonus_Logs');
    const headers = ['LogID', 'Date', 'Team', 'MC_Name', 'Is_Cover', 'Daily_Diamond_Score', 'Bonus_Tier', 'Bonus_Amount', 'CalculatedAt', 'UpdatedBy'];
    bonusSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    bonusSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#059669').setFontColor('#ffffff');
    bonusSheet.setFrozenRows(1);
  }

  return { schSheet, bonusSheet };
}

/**
 * 2. ฟังก์ชันคำนวณ Bonus MC ประจำทีมรายวัน ตามสูตร Tier Scale
 * - ยอด < 60,000 -> 0 บาท
 * - ยอดเพิ่มขึ้นทุกๆ 60,000 จะได้ Bonus เพิ่มขึ้น 150 บาท
 */
function calculateMCBonus(dailyScore) {
  const score = parseFloat(dailyScore) || 0;
  if (score < 60000) {
    return {
      bonusAmount: 0,
      tierStep: 0,
      tierLabel: 'Tier 0 (< 60,000 💎)',
      nextTierDiff: 60000 - score
    };
  }

  const tierStep = Math.floor(score / 60000);
  const bonusAmount = tierStep * 150;
  const minBound = tierStep * 60000;
  const maxBound = (tierStep + 1) * 60000 - 1;
  const nextTierDiff = (tierStep + 1) * 60000 - score;

  return {
    bonusAmount: bonusAmount,
    tierStep: tierStep,
    tierLabel: `Tier ${tierStep} (${minBound.toLocaleString()} - ${maxBound.toLocaleString()} 💎)`,
    nextTierDiff: nextTierDiff
  };
}

/**
 * 3. ดึงรายการตารางงาน MC (Filtering & Search)
 */
/**
 * ดึงตารางงาน MC โดยอ่านอัตโนมัติจากชีตรายเดือน (ช่องก่อนแถว TOTAL + Team Data)
 */
function getMCSchedules(startDateStr, endDateStr, mcFilter, teamFilter, targetSheetName) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const activeSheet = targetSheetName ? ss.getSheetByName(targetSheetName) : ss.getSheets()[0];
    if (!activeSheet) return { success: true, schedules: [] };

    const teamMCMap = getTeamDefaultMCMap(); // ดึง MC ประจำทีมจาก Team Data
    const data = activeSheet.getDataRange().getValues();
    const sheetName = activeSheet.getName();

    // แปลงชื่อชีตเพื่อระบุเดือน/ปี (เช่น AUGUST 2026)
    const monthNames = {'JANUARY':1, 'FEBRUARY':2, 'MARCH':3, 'APRIL':4, 'MAY':5, 'JUNE':6, 'JULY':7, 'AUGUST':8, 'SEPTEMBER':9, 'OCTOBER':10, 'NOVEMBER':11, 'DECEMBER':12};
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;

    const parts = sheetName.toUpperCase().split(' ');
    if (parts.length >= 2 && monthNames[parts[0]]) {
      month = monthNames[parts[0]];
      year = parseInt(parts[1]) || year;
    }

    const cleanMC = String(mcFilter || '').trim().toLowerCase();
    const cleanTeam = String(teamFilter || '').trim().toLowerCase();

    const schedules = [];
    let currentTeam = '';

    for (let r = 0; r < data.length; r++) {
      const colA = String(data[r][0] || '').trim();
      const colE = String(data[r][4] || '').trim().toUpperCase();

      if (colA && colA.toUpperCase() !== 'GROUP LIVE ACCOUNT') {
        currentTeam = colA;
      }

      // เมื่อเจอแถว TOTAL ให้ดึงข้อมูล MC จากแถวก่อนหน้า
      if (colE === 'TOTAL') {
        const mcRow = (r > 0) ? data[r - 1] : [];
        const defaultMC = teamMCMap[currentTeam] || '-';

        for (let d = 1; d <= 31; d++) {
          const colIdx = 5 + d; // Day 1 = Col G (Index 6)
          if (colIdx >= data[r].length) break;

          const dayStr = String(d).padStart(2, '0');
          const monthStr = String(month).padStart(2, '0');
          const dateStr = `${year}-${monthStr}-${dayStr}`;

          // กรองช่วงวันที่
          if (startDateStr && dateStr < startDateStr) continue;
          if (endDateStr && dateStr > endDateStr) continue;

          let dutyMC = String(mcRow[colIdx] || '').trim();

          // สถานะยกเว้นที่ไม่นำมาแสดง
          const ignoreStatus = ['OFF', 'HOLIDAY', 'PING', '-', '0', ''];
          if (ignoreStatus.includes(dutyMC.toUpperCase()) && dutyMC !== '') continue;

          // ถ้าช่องว่างให้ใช้ MC ประจำทีมจาก Team Data
          if (!dutyMC) {
            dutyMC = defaultMC;
          }

          if (dutyMC && dutyMC !== '-') {
            const isCover = defaultMC !== '-' && (dutyMC.toLowerCase() !== defaultMC.toLowerCase());

            // ตัวกรองการค้นหาชื่อ MC หรือ ทีม
            if (cleanMC && !dutyMC.toLowerCase().includes(cleanMC)) continue;
            if (cleanTeam && !currentTeam.toLowerCase().includes(cleanTeam)) continue;

            schedules.push({
              id: `SCH-${currentTeam}-${dateStr}`,
              date: dateStr,
              mcName: dutyMC,
              assignedTeam: currentTeam,
              effectiveTeam: currentTeam,
              defaultMC: defaultMC,
              isCover: isCover,
              shiftTime: '18:00 - 02:00',
              status: 'ACTIVE',
              notes: isCover ? `ปฏิบัติงานแทนที่ห้อง ${currentTeam}` : 'ปฏิบัติงานปกติ'
            });
          }
        }
      }
    }

    schedules.sort((a, b) => b.date.localeCompare(a.date));
    return { success: true, schedules: schedules };

  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
/**
 * 4. บันทึก/อัปเดตตารางงาน MC
 */
function saveMCSchedule(scheduleData, adminUser, sessionToken) {
  try {
    const session = requireAdminSession_(sessionToken);
    if (!scheduleData || !scheduleData.mcName || !scheduleData.date) {
      return { success: false, error: 'กรุณากรอกวันที่และชื่อ MC ให้ครบถ้วน' };
    }

    const { schSheet } = initMCSheets_();
    const data = schSheet.getDataRange().getValues();
    const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    const user = session.displayName;

    const cleanDate = String(scheduleData.date).trim();
    const cleanMC = String(scheduleData.mcName).trim();
    const assignedTeam = String(scheduleData.assignedTeam || '').trim();
    const coverTeam = String(scheduleData.coverTeam || '').trim();
    const isCover = Boolean(scheduleData.isCover);
    const shiftTime = String(scheduleData.shiftTime || '18:00 - 02:00').trim();
    const status = String(scheduleData.status || 'ACTIVE').trim();
    const notes = String(scheduleData.notes || '').trim();

    let targetRow = -1;
    let recordId = scheduleData.id || '';

    if (recordId) {
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(recordId)) {
          targetRow = i + 1;
          break;
        }
      }
    } else {
      // ค้นหาว่ามีรายการของ MC คนนี้ในวันนั้นอยู่แล้วหรือไม่
      for (let i = 1; i < data.length; i++) {
        const rDate = data[i][1] instanceof Date ? Utilities.formatDate(data[i][1], Session.getScriptTimeZone(), 'yyyy-MM-dd') : String(data[i][1]);
        const rMC = String(data[i][2]).trim();
        if (rDate === cleanDate && rMC.toLowerCase() === cleanMC.toLowerCase()) {
          targetRow = i + 1;
          recordId = String(data[i][0]);
          break;
        }
      }
    }

    if (!recordId) {
      recordId = 'SCH-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
    }

    const rowValues = [recordId, cleanDate, cleanMC, assignedTeam, coverTeam, isCover, shiftTime, status, notes, user, now];

    if (targetRow > 1) {
      schSheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
    } else {
      schSheet.appendRow(rowValues);
    }

    saveLog_('SAVE_MC_SCHEDULE', `บันทึกตารางงาน MC: ${cleanMC} วันที่ ${cleanDate} (ทีม: ${assignedTeam} ${isCover ? '[แทนห้อง: ' + coverTeam + ']' : ''})`, user, 'SUCCESS');
    return { success: true, message: 'บันทึกตารางงาน MC เรียบร้อยแล้ว', id: recordId };
  } catch (error) {
    saveLog_('SAVE_MC_SCHEDULE', `ล้มเหลวในการบันทึกตารางงาน MC: ${error.message || 'บันทึกไม่สำเร็จ'}`, 'System', 'FAILED');
    return { success: false, error: error.toString() };
  }
}

/**
 * 5. สรุปคำนวณ Bonus MC รายวันและสะสมประจำเดือน
 */
function getMCBonusSummary(targetSheetName, selectedDateDay) {
  try {
    const rawData = getDataFromSheet(targetSheetName);
    if (!rawData.success) return rawData;

    const { rows, month, year, todayDay, sheetName } = rawData;
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const currentDay = selectedDateDay ? parseInt(selectedDateDay) : Math.min(todayDay, totalDaysInMonth);

    // ดึงตารางงาน MC ของเดือนนั้นๆ
    const startMStr = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endMStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(totalDaysInMonth).padStart(2, '0')}`;
    const schResult = getMCSchedules(startMStr, endMStr);
    const schedules = schResult.success ? schResult.schedules : [];

    // Map ตารางงาน MC รายวัน: mcDailyScheduleMap[mcName][day] = scheduleObj
    const mcScheduleMap = {};
    schedules.forEach(s => {
      const dayNum = parseInt(s.date.split('-')[2], 10);
      if (!mcScheduleMap[s.mcName]) mcScheduleMap[s.mcName] = {};
      mcScheduleMap[s.mcName][dayNum] = s;
    });

    // รวบรวมยอด Diamond รายทีมแต่ละวันจาก Sheet
    const teamDailyScores = {}; // teamDailyScores[teamName][dayNum] = score
    rows.forEach(row => {
      const team = String(row[0] || 'ไม่ระบุทีม').trim();
      if (!team || team.toLowerCase().includes('total')) return;

      if (!teamDailyScores[team]) teamDailyScores[team] = {};
      for (let d = 1; d <= totalDaysInMonth; d++) {
        const colIdx = 5 + d; // Day 1 = Index 6
        const score = parseFloat(String(row[colIdx] || '').replace(/,/g, '')) || 0;
        teamDailyScores[team][d] = (teamDailyScores[team][d] || 0) + score;
      }
    });

    // คำนวณ Bonus สรุปของแต่ละทีมและ MC
    const dailyBreakdown = [];
    const monthlyMCTotals = {};

    // ประมวลผลแต่ละวันทั้งเดือนเพื่อคำนวณโบนัสสะสม
    Object.keys(mcScheduleMap).forEach(mcName => {
      monthlyMCTotals[mcName] = {
        mcName: mcName,
        assignedTeam: '-',
        activeDaysCount: 0,
        coverDaysCount: 0,
        monthlyDiamonds: 0,
        monthlyBonus: 0
      };
    });

    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateFormatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

      // ประมวลผล MC แต่ละคนในวันนั้น
      Object.keys(mcScheduleMap).forEach(mcName => {
        const sch = mcScheduleMap[mcName][d];
        if (!sch) return;

        const effectiveTeam = sch.isCover && sch.coverTeam ? sch.coverTeam : sch.assignedTeam;
        const teamScore = teamDailyScores[effectiveTeam] ? (teamDailyScores[effectiveTeam][d] || 0) : 0;
        const bonusInfo = calculateMCBonus(teamScore);

        monthlyMCTotals[mcName].assignedTeam = sch.assignedTeam || monthlyMCTotals[mcName].assignedTeam;
        monthlyMCTotals[mcName].activeDaysCount += 1;
        if (sch.isCover) monthlyMCTotals[mcName].coverDaysCount += 1;
        monthlyMCTotals[mcName].monthlyDiamonds += teamScore;
        monthlyMCTotals[mcName].monthlyBonus += bonusInfo.bonusAmount;

        // หากตรงกับวันที่เลือก ให้บันทึกลง dailyBreakdown
        if (d === currentDay) {
          dailyBreakdown.push({
            date: dateFormatted,
            dayNum: d,
            mcName: mcName,
            assignedTeam: sch.assignedTeam,
            coverTeam: sch.coverTeam,
            effectiveTeam: effectiveTeam,
            isCover: sch.isCover,
            shiftTime: sch.shiftTime,
            teamScore: teamScore,
            bonusTier: bonusInfo.tierLabel,
            bonusAmount: bonusInfo.bonusAmount,
            nextTierDiff: bonusInfo.nextTierDiff,
            notes: sch.notes
          });
        }
      });
    }

    // สรุป KPI รวมของวันที่เลือก
    const selectedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
    const totalDailyBonus = dailyBreakdown.reduce((sum, item) => sum + item.bonusAmount, 0);
    const totalDailyDiamonds = dailyBreakdown.reduce((sum, item) => sum + item.teamScore, 0);

    return {
      success: true,
      sheetName: sheetName,
      month: month,
      year: year,
      selectedDay: currentDay,
      selectedDateStr: selectedDateStr,
      totalDaysInMonth: totalDaysInMonth,
      summary: {
        totalDailyBonus: totalDailyBonus,
        totalDailyDiamonds: totalDailyDiamonds,
        activeMCCount: dailyBreakdown.length,
        totalMonthlyBonusAllMC: Object.values(monthlyMCTotals).reduce((sum, item) => sum + item.monthlyBonus, 0)
      },
      dailyBreakdown: dailyBreakdown,
      monthlyMCTotals: Object.values(monthlyMCTotals)
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * 6. บันทึกล็อกประวัติการจ่าย Bonus MC ลงใน Google Sheets
 */
function saveMCBonusLogs(bonusLogsArray, adminUser, sessionToken) {
  try {
    const session = requireAdminSession_(sessionToken);
    if (!Array.isArray(bonusLogsArray) || bonusLogsArray.length === 0) {
      return { success: false, error: 'ไม่มีข้อมูลโบนัสสำหรับบันทึก' };
    }

    const { bonusSheet } = initMCSheets_();
    const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    const user = session.displayName;

    bonusLogsArray.forEach(item => {
      const logId = 'BN-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmssSSS');
      bonusSheet.appendRow([
        logId,
        item.date,
        item.effectiveTeam,
        item.mcName,
        item.isCover ? 'YES' : 'NO',
        item.teamScore,
        item.bonusTier,
        item.bonusAmount,
        now,
        user
      ]);
    });

    saveLog_('SAVE_MC_BONUS_LOGS', `บันทึกประวัติโบนัส MC รายวันจำนวน ${bonusLogsArray.length} รายการ`, user, 'SUCCESS');
    return { success: true, message: `บันทึกประวัติโบนัส MC จำนวน ${bonusLogsArray.length} รายการสำเร็จ` };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}



/**
 * 1. ดึงข้อมูล MC ประจำทีมจากชีต Team Data (Col A: TEAM, Col F: MC)
 */
function getTeamDefaultMCMap() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const teamSheet = ss.getSheetByName('Team Data');
  const teamMCMap = {};

  if (!teamSheet) return teamMCMap;

  const data = teamSheet.getDataRange().getValues();
  // ข้าม Header row 1
  for (let i = 1; i < data.length; i++) {
    const teamName = String(data[i][0] || '').trim(); // Col A (TEAM)
    const mcName = String(data[i][5] || '').trim();   // Col F (MC)
    if (teamName && mcName && !teamMCMap[teamName]) {
      teamMCMap[teamName] = mcName;
    }
  }
  return teamMCMap;
}

/**
 * 2. ฟังก์ชันคำนวณขั้นโบนัส (ทุกๆ 60,000 Diamond = 150 บาท)
 */
function calculateMCBonus(dailyScore) {
  const score = parseFloat(dailyScore) || 0;
  if (score < 60000) {
    return {
      bonusAmount: 0,
      tierStep: 0,
      tierLabel: 'Tier 0 (< 60,000 💎)',
      nextTierDiff: 60000 - score
    };
  }

  const tierStep = Math.floor(score / 60000);
  const bonusAmount = tierStep * 150;
  const minBound = tierStep * 60000;
  const maxBound = (tierStep + 1) * 60000 - 1;
  const nextTierDiff = (tierStep + 1) * 60000 - score;

  return {
    bonusAmount: bonusAmount,
    tierStep: tierStep,
    tierLabel: `Tier ${tierStep} (${minBound.toLocaleString()} - ${maxBound.toLocaleString()} 💎)`,
    nextTierDiff: nextTierDiff
  };
}

/**
 * 3. อ่านข้อมูลชีตรายเดือน คำนวณ Bonus โดยอิงแถวก่อน TOTAL และยอดทีมในแถว TOTAL
 */
function getMCBonusSummary(targetSheetName, selectedDateDay) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const activeSheet = targetSheetName ? ss.getSheetByName(targetSheetName) : ss.getSheets()[0];
    if (!activeSheet) return { success: false, error: 'ไม่พบแผ่นงานที่ระบุ' };

    const teamMCMap = getTeamDefaultMCMap(); // ดึง MC ประจำทีมจาก Team Data
    const data = activeSheet.getDataRange().getValues();
    
    const todayDay = new Date().getDate();
    const currentDay = selectedDateDay ? parseInt(selectedDateDay) : todayDay;
    const daysInMonth = 31; // อ่านคอลัมน์ G (index 6) ถึง AK (index 36)

    const dailyBreakdown = [];
    const monthlyMCTotals = {};

    let currentTeam = '';

    for (let r = 0; r < data.length; r++) {
      const colA = String(data[r][0] || '').trim();
      const colE = String(data[r][4] || '').trim().toUpperCase();

      // บันทึกชื่อทีมปัจจุบัน (เช่น X - ACE, 102 - ACE)
      if (colA && colA.toUpperCase() !== 'GROUP LIVE ACCOUNT') {
        currentTeam = colA;
      }

      // ตรวจหาแถว TOTAL ของทีม
      if (colE === 'TOTAL') {
        const totalRow = data[r];
        const mcRow = (r > 0) ? data[r - 1] : []; // แถวก่อนหน้า TOTAL คือแถวลงชื่อ MC

        for (let d = 1; d <= daysInMonth; d++) {
          const colIdx = 5 + d; // Day 1 = Col G (Index 6)
          if (colIdx >= totalRow.length) break;

          // ดึงยอดรวม Diamond ของ VJ ในทีมจากแถว TOTAL
          const teamScore = parseFloat(String(totalRow[colIdx] || '0').replace(/,/g, '')) || 0;
          
          // ดึงชื่อ MC ที่กรอกไว้ในช่องก่อนแถว TOTAL
          let dutyMC = String(mcRow[colIdx] || '').trim();

          // ถ้าไม่ได้กรอก MC ในวันนั้น ให้ดึง MC ประจำทีมจาก Team Data มาใช้
          if (!dutyMC) {
            dutyMC = teamMCMap[currentTeam] || '';
          }

          // ตรวจสอบสถานะการทำงาน (ไม่นับ OFF, HOLIDAY, PING, -)
          const ignoreStatus = ['OFF', 'HOLIDAY', 'PING', '-', '0', ''];
          const isActive = dutyMC && !ignoreStatus.includes(dutyMC.toUpperCase());

          if (isActive) {
            const defaultMC = teamMCMap[currentTeam] || '';
            const isCover = defaultMC && (dutyMC.toLowerCase() !== defaultMC.toLowerCase());
            const bonusInfo = calculateMCBonus(teamScore);

            // เก็บสะสมยอดรายเดือนของ MC แต่ละคน
            if (!monthlyMCTotals[dutyMC]) {
              monthlyMCTotals[dutyMC] = {
                mcName: dutyMC,
                assignedTeam: currentTeam,
                activeDaysCount: 0,
                coverDaysCount: 0,
                monthlyDiamonds: 0,
                monthlyBonus: 0
              };
            }

            monthlyMCTotals[dutyMC].activeDaysCount += 1;
            if (isCover) monthlyMCTotals[dutyMC].coverDaysCount += 1;
            monthlyMCTotals[dutyMC].monthlyDiamonds += teamScore;
            monthlyMCTotals[dutyMC].monthlyBonus += bonusInfo.bonusAmount;

            // บันทึกข้อมูลเฉพาะวันที่เลือกแสดงผล
            if (d === currentDay) {
              dailyBreakdown.push({
                dayNum: d,
                mcName: dutyMC,
                assignedTeam: currentTeam,
                effectiveTeam: currentTeam,
                defaultMC: defaultMC,
                isCover: isCover,
                teamScore: teamScore,
                bonusTier: bonusInfo.tierLabel,
                bonusAmount: bonusInfo.bonusAmount,
                nextTierDiff: bonusInfo.nextTierDiff
              });
            }
          }
        }
      }
    }

    const totalDailyBonus = dailyBreakdown.reduce((sum, item) => sum + item.bonusAmount, 0);
    const totalDailyDiamonds = dailyBreakdown.reduce((sum, item) => sum + item.teamScore, 0);

    return {
      success: true,
      sheetName: activeSheet.getName(),
      selectedDay: currentDay,
      summary: {
        totalDailyBonus: totalDailyBonus,
        totalDailyDiamonds: totalDailyDiamonds,
        activeMCCount: dailyBreakdown.length,
        totalMonthlyBonusAllMC: Object.values(monthlyMCTotals).reduce((sum, item) => sum + item.monthlyBonus, 0)
      },
      dailyBreakdown: dailyBreakdown,
      monthlyMCTotals: Object.values(monthlyMCTotals)
    };

  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * ดึงแผนผังเวลากะงาน (SHIFT) ของแต่ละทีมจาก คอลัมน์ B ในชีตรายเดือน
 */
function getTeamShiftMap(sheet) {
  const data = sheet.getDataRange().getValues();
  const teamShiftMap = {};
  let currentTeam = '';

  for (let r = 0; r < data.length; r++) {
    const colA = String(data[r][0] || '').trim();
    const colB = String(data[r][1] || '').trim(); // Column B: SHIFT

    if (colA && colA.toUpperCase() !== 'GROUP LIVE ACCOUNT') {
      currentTeam = colA;
      // ดึงค่า SHIFT ถ้าไม่ใช่หัวข้อหรือค่าว่าง
      if (colB && colB !== '-' && colB.toUpperCase() !== 'SHIFT') {
        teamShiftMap[currentTeam] = colB;
      }
    }
  }
  return teamShiftMap;
}

/**
 * ดึง ตัวเลือก Dropdown (MC, ทีม, กะเวลา) ส่งให้ Modal บนเว็บ
 */
function getMCModalDataOptions(targetSheetName) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const activeSheet = targetSheetName ? ss.getSheetByName(targetSheetName) : ss.getSheets()[0];
    
    const teamShiftMap = activeSheet ? getTeamShiftMap(activeSheet) : {};
    const teamMCMap = getTeamDefaultMCMap(); // จาก Team Data
    
    const teamList = Object.keys(teamShiftMap);
    const mcOptions = [];

    // ดึงรายชื่อ MC และทีมประจำจาก Team Data
    const teamSheet = ss.getSheetByName('Team Data');
    if (teamSheet) {
      const data = teamSheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        const team = String(data[i][0] || '').trim();
        const mc = String(data[i][5] || '').trim();
        if (mc && !mcOptions.some(m => m.name === mc)) {
          mcOptions.push({
            name: mc,
            defaultTeam: team,
            defaultShift: teamShiftMap[team] || '18.00-02.00'
          });
        }
      }
    }

    return {
      success: true,
      mcOptions: mcOptions,
      teamList: teamList,
      teamShiftMap: teamShiftMap
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * อัปเดต getMCSchedules ให้ดึงเวลากะงาน SHIFT จากคอลัมน์ B จริง
 */
function getMCSchedules(startDateStr, endDateStr, mcFilter, teamFilter, targetSheetName) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const activeSheet = targetSheetName ? ss.getSheetByName(targetSheetName) : ss.getSheets()[0];
    if (!activeSheet) return { success: true, schedules: [] };

    const teamMCMap = getTeamDefaultMCMap();
    const teamShiftMap = getTeamShiftMap(activeSheet); // ดึง SHIFT จริงรายทีม
    const data = activeSheet.getDataRange().getValues();
    const sheetName = activeSheet.getName();

    const monthNames = {'JANUARY':1, 'FEBRUARY':2, 'MARCH':3, 'APRIL':4, 'MAY':5, 'JUNE':6, 'JULY':7, 'AUGUST':8, 'SEPTEMBER':9, 'OCTOBER':10, 'NOVEMBER':11, 'DECEMBER':12};
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;

    const parts = sheetName.toUpperCase().split(' ');
    if (parts.length >= 2 && monthNames[parts[0]]) {
      month = monthNames[parts[0]];
      year = parseInt(parts[1]) || year;
    }

    const cleanMC = String(mcFilter || '').trim().toLowerCase();
    const cleanTeam = String(teamFilter || '').trim().toLowerCase();
    const schedules = [];
    let currentTeam = '';

    for (let r = 0; r < data.length; r++) {
      const colA = String(data[r][0] || '').trim();
      const colE = String(data[r][4] || '').trim().toUpperCase();

      if (colA && colA.toUpperCase() !== 'GROUP LIVE ACCOUNT') {
        currentTeam = colA;
      }

      if (colE === 'TOTAL') {
        const mcRow = (r > 0) ? data[r - 1] : [];
        const defaultMC = teamMCMap[currentTeam] || '-';
        // ดึง SHIFT จาก Map (เช่น 17.00-02.00 หรือ 13.00-22.00)
        const teamShift = teamShiftMap[currentTeam] || '18:00 - 02:00';

        for (let d = 1; d <= 31; d++) {
          const colIdx = 5 + d;
          if (colIdx >= data[r].length) break;

          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

          if (startDateStr && dateStr < startDateStr) continue;
          if (endDateStr && dateStr > endDateStr) continue;

          let dutyMC = String(mcRow[colIdx] || '').trim();
          const ignoreStatus = ['OFF', 'HOLIDAY', 'PING', '-', '0', ''];
          if (ignoreStatus.includes(dutyMC.toUpperCase()) && dutyMC !== '') continue;

          if (!dutyMC) dutyMC = defaultMC;

          if (dutyMC && dutyMC !== '-') {
            const isCover = defaultMC !== '-' && (dutyMC.toLowerCase() !== defaultMC.toLowerCase());

            if (cleanMC && !dutyMC.toLowerCase().includes(cleanMC)) continue;
            if (cleanTeam && !currentTeam.toLowerCase().includes(cleanTeam)) continue;

            schedules.push({
              id: `SCH-${currentTeam}-${dateStr}`,
              date: dateStr,
              mcName: dutyMC,
              assignedTeam: currentTeam,
              effectiveTeam: currentTeam,
              defaultMC: defaultMC,
              isCover: isCover,
              shiftTime: teamShift, // แสดงเวลากะงานจริงจาก Sheet
              status: 'ACTIVE',
              notes: isCover ? `ปฏิบัติงานแทนที่ห้อง ${currentTeam}` : 'ปฏิบัติงานปกติ'
            });
          }
        }
      }
    }

    schedules.sort((a, b) => b.date.localeCompare(a.date));
    return { success: true, schedules: schedules };

  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * บันทึกข้อมูลตารางงาน/การแทนห้อง ลง Google Sheet ในช่องรายวัน
 */
function saveMCScheduleData(payload, sessionToken) {
  try {
    const session = requireAdminSession_(sessionToken);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = payload.sheetName || '';
    const sheet = sheetName ? ss.getSheetByName(sheetName) : ss.getSheets()[0];
    if (!sheet) return { success: false, error: 'ไม่พบแผ่นงานที่เลือก' };

    // แปลงวันที่ (เช่น 2026-08-18 -> ดึงวันที่ 18)
    const dateParts = payload.dateStr.split('-');
    const dayNum = parseInt(dateParts[2], 10);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      return { success: false, error: 'รูปแบบวันที่ไม่ถูกต้อง' };
    }

    // Column Index: Day 1 = Col G (index 7 ใน Sheet)
    const targetColIdx = 6 + dayNum; 

    // ทีมที่จะให้ MC ไปลงชื่อปฏิบัติงาน (ถ้าแทนห้องใช้ coverTeam ถ้าปกติใช้ defaultTeam)
    const targetTeam = payload.isCover ? payload.coverTeam : payload.defaultTeam;
    if (!targetTeam) return { success: false, error: 'กรุณาระบุทีมปฏิบัติงาน' };

    const data = sheet.getDataRange().getValues();
    let targetRowIndex = -1;

    for (let r = 0; r < data.length; r++) {
      const colA = String(data[r][0] || '').trim();
      const colE = String(data[r][4] || '').trim().toUpperCase();

      if (colA === targetTeam && colE === 'TOTAL') {
        targetRowIndex = r; // แถว TOTAL (0-indexed)
        break;
      }
    }

    if (targetRowIndex <= 0) {
      return { success: false, error: `ไม่พบแถว TOTAL ของทีม "${targetTeam}" ในแผ่นงาน` };
    }

    // แถวลงชื่อ MC คือแถวติดเหนือ TOTAL (1-indexed row number = targetRowIndex)
    const mcSheetRow = targetRowIndex; 
    sheet.getRange(mcSheetRow, targetColIdx).setValue(payload.mcName);

    return { 
      success: true, 
      message: `บันทึกข้อมูล ${payload.mcName} ลงทีม ${targetTeam} วันที่ ${dayNum} เรียบร้อยแล้ว!` 
    };

  } catch (err) {
    return { success: false, error: err.toString() };
  }
}
/**
 * ===================================================
 * สรุปยอดรายสัปดาห์ (Weekly Stats Summary) - Extended
 * ===================================================
 * @param {string} targetSheetName - ชื่อแผ่นงาน (เช่น AUGUST 2026)
 * @param {number|string} weekNumber - สัปดาห์ที่ 1 ถึง 5
 * @param {string} selectedTeam - ชื่อทีมที่เลือก หรือ 'ALL'
 */
function getWeeklyStatsSummary(targetSheetName, weekNumber, selectedTeam) {
  try {
    const rawData = getDataFromSheet(targetSheetName);
    if (!rawData || !rawData.success) {
      return { success: false, error: rawData?.error || 'ไม่สามารถดึงข้อมูลได้' };
    }

    const { rows, statusOverrides, month, year, sheetName } = rawData;
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    // 1. กำหนดช่วงวันของสัปดาห์ที่ 1-5
    const weekRanges = {
      1: { start: 1, end: 7 },
      2: { start: 8, end: 14 },
      3: { start: 15, end: 21 },
      4: { start: 22, end: 28 },
      5: { start: 29, end: totalDaysInMonth }
    };

    const wk = parseInt(weekNumber, 10) || 1;
    const range = weekRanges[wk] || weekRanges[1];
    const weekStartDay = range.start;
    const weekEndDay = Math.min(range.end, totalDaysInMonth);
    const weekDays = weekEndDay - weekStartDay + 1;

    // 2. กรองเฉพาะ VJ จริง (ตัด Trainee, MC, HR, Resigned, Staff ออก)
    const nonVJKeywords = ['trainee', 'mc', 'hr', 'resigned', 'staff', 'ลาออก', 'ผู้ดูแล', 'total', 'รวม'];

    const validRows = rows.filter(row => {
      const team = String(row[0] || '').trim();
      const memberName = String(row[4] || '').trim();
      const rawStatus = String(statusOverrides?.memberWorking?.[memberName] || row[2] || '').trim().toLowerCase();

      if (!team || !memberName) return false;
      const teamLower = team.toLowerCase();
      const nameLower = memberName.toLowerCase();

      for (const kw of nonVJKeywords) {
        if (rawStatus.includes(kw) || nameLower.includes(kw) || teamLower.includes(kw)) {
          return false;
        }
      }
      return true;
    });

    // 3. รวมผลข้อมูลรายทีม รายบุคคล และรายวัน
    const teamStatsMap = {};
    const vjStatsList = [];
    const dailyTotalsMap = {};

    for (let d = weekStartDay; d <= weekEndDay; d++) {
      dailyTotalsMap[d] = 0;
    }

    const cleanSelectedTeam = (selectedTeam && selectedTeam !== 'ALL' && selectedTeam !== 'all') ? String(selectedTeam).trim() : 'ALL';
    let totalDiamondsScope = 0;

    validRows.forEach(row => {
      const team = String(row[0] || 'ไม่ระบุทีม').trim();
      const memberName = String(row[4] || '').trim();

      let memberDiamondTotal = 0;
      for (let d = weekStartDay; d <= weekEndDay; d++) {
        const colIdx = 5 + d; // Day 1 เริ่มต้น Col G (Index 6)
        const score = parseFloat(String(row[colIdx] || '').replace(/,/g, '')) || 0;
        memberDiamondTotal += score;
      }

      // สรุปยอดระดับทีม
      if (!teamStatsMap[team]) {
        teamStatsMap[team] = { teamName: team, vjCount: 0, totalDiamonds: 0 };
      }
      teamStatsMap[team].vjCount += 1;
      teamStatsMap[team].totalDiamonds += memberDiamondTotal;

      // กรองตามทีมที่เลือกสำหรับ VJ Summary และ Daily Trend
      if (cleanSelectedTeam === 'ALL' || team === cleanSelectedTeam) {
        totalDiamondsScope += memberDiamondTotal;

        for (let d = weekStartDay; d <= weekEndDay; d++) {
          const colIdx = 5 + d;
          const score = parseFloat(String(row[colIdx] || '').replace(/,/g, '')) || 0;
          dailyTotalsMap[d] += score;
        }

        vjStatsList.push({
          name: memberName,
          team: team,
          totalDiamonds: memberDiamondTotal,
          dailyAverage: Math.round((memberDiamondTotal / weekDays) * 10) / 10
        });
      }
    });

    // 4. จัดอันดับทีม (Team Rankings)
    const teamStats = Object.values(teamStatsMap).map(t => ({
      ...t,
      dailyAverage: Math.round((t.totalDiamonds / weekDays) * 10) / 10
    }));
    teamStats.sort((a, b) => b.totalDiamonds - a.totalDiamonds);
    teamStats.forEach((t, i) => t.rank = i + 1);

    // 5. จัดอันดับ VJ (VJ Leaderboard)
    vjStatsList.sort((a, b) => b.totalDiamonds - a.totalDiamonds);
    vjStatsList.forEach((v, i) => v.rank = i + 1);

    const dailyAverageScope = weekDays > 0 ? (totalDiamondsScope / weekDays) : 0;

    return {
      success: true,
      sheetName,
      month, year,
      weekNumber: wk,
      weekStartDay,
      weekEndDay,
      weekDays,
      selectedTeam: cleanSelectedTeam,
      totalDiamonds: totalDiamondsScope,
      dailyAverage: Math.round(dailyAverageScope * 10) / 10,
      topTeam: teamStats.length > 0 ? { name: teamStats[0].teamName, diamonds: teamStats[0].totalDiamonds } : { name: '-', diamonds: 0 },
      topVJ: vjStatsList.length > 0 ? vjStatsList[0] : null,
      teamStats: teamStats,
      top3Teams: teamStats.slice(0, 3),
      vjStatsList: vjStatsList,
      top3VJs: vjStatsList.slice(0, 3),
      top10VJs: vjStatsList.slice(0, 10),
      dailyTotalsMap: dailyTotalsMap
    };

  } catch (error) {
    console.error('getWeeklyStatsSummary Error:', error);
    return { success: false, error: error.toString() };
  }
}


/**
 * ดึงข้อมูลสรุปแยกตามสัปดาห์ (Weekly Stats Summary)
 */
function getWeeklyMCBonusSummary(targetSheetName) {
  try {
    const bonusReport = getMCBonusSummary(targetSheetName);
    if (!bonusReport.success) return bonusReport;

    const weeklyData = {
      week1: { label: 'สัปดาห์ที่ 1 (1-7)', bonusTotal: 0, diamondTotal: 0, items: [] },
      week2: { label: 'สัปดาห์ที่ 2 (8-14)', bonusTotal: 0, diamondTotal: 0, items: [] },
      week3: { label: 'สัปดาห์ที่ 3 (15-21)', bonusTotal: 0, diamondTotal: 0, items: [] },
      week4: { label: 'สัปดาห์ที่ 4 (22-28)', bonusTotal: 0, diamondTotal: 0, items: [] },
      week5: { label: 'สัปดาห์ที่ 5 (29+)', bonusTotal: 0, diamondTotal: 0, items: [] }
    };

    // จำแนกข้อมูลแต่ละรายการลงสัปดาห์
    bonusReport.dailyBreakdown.forEach(item => {
      const day = item.dayNum;
      let weekKey = 'week5';
      if (day <= 7) weekKey = 'week1';
      else if (day <= 14) weekKey = 'week2';
      else if (day <= 21) weekKey = 'week3';
      else if (day <= 28) weekKey = 'week4';

      weeklyData[weekKey].bonusTotal += item.bonusAmount;
      weeklyData[weekKey].diamondTotal += item.teamScore;
      weeklyData[weekKey].items.push(item);
    });

    return {
      success: true,
      sheetName: bonusReport.sheetName,
      weeklySummary: weeklyData
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * ===================================================
 * ระบบสรุปข้อมูลรายวัน (Daily Stats Summary)
 * รองรับการสรุปยอดรายทีม, รายบุคคล, จัดอันดับ และภาษาจีน/ไทย
 * ===================================================
 */
function getDailyStatsSummary(targetSheetName, selectedDateDay) {
  try {
    const avatarMap = getVJAvatarMap();
    const rawData = getDataFromSheet(targetSheetName);
    if (!rawData || !rawData.success) {
      return { success: false, error: rawData?.error || 'ไม่สามารถดึงข้อมูลได้' };
    }

    const { rows, statusOverrides, month, year, todayDay, sheetName, kpiTargets } = rawData;
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    
    // วันที่เลือก (ถ้าไม่ระบุให้ใช้วันปัจจุบัน)
    const day = selectedDateDay ? parseInt(selectedDateDay, 10) : Math.min(todayDay, totalDaysInMonth);

    // คำค้นหาคำที่ไม่ใช่ VJ หลัก (คัดกรองออก)
    const nonVJKeywords = ['trainee', 'mc', 'hr', 'resigned', 'staff', 'ลาออก', 'ผู้ดูแล', 'total', 'รวม'];

    const validRows = rows.filter(row => {
      const team = String(row[0] || '').trim();
      const memberName = String(row[4] || '').trim();
      const rawStatus = String(statusOverrides?.memberWorking?.[memberName] || row[2] || '').trim().toLowerCase();

      if (!team || !memberName) return false;
      for (const kw of nonVJKeywords) {
        if (rawStatus.includes(kw) || memberName.toLowerCase().includes(kw)) return false;
      }
      return true;
    });

    // คอลัมน์ของวันที่เลือก (Day 1 อยู่ที่ Column Index 6 -> Index 5 + day)
    const colIdx = 5 + day;
    
    let totalDailyDiamonds = 0;
    const teamStatsMap = {};
    const vjStatsList = [];

    validRows.forEach(row => {
      const team = String(row[0] || 'ไม่ระบุทีม').trim();
      const memberName = String(row[4] || '').trim();
      const dailyScore = parseFloat(String(row[colIdx] || '0').replace(/,/g, '')) || 0;
      
      const targetMonthly = parseFloat(kpiTargets?.[memberName]) || 0;
      const dailyTarget = targetMonthly > 0 ? targetMonthly / totalDaysInMonth : 0;

      totalDailyDiamonds += dailyScore;

      // จัดกลุ่มระดับทีม
      if (!teamStatsMap[team]) {
        teamStatsMap[team] = {
          teamName: team,
          vjCount: 0,
          totalDiamonds: 0,
          vjList: []
        };
      }

      teamStatsMap[team].vjCount += 1;
      teamStatsMap[team].totalDiamonds += dailyScore;
      teamStatsMap[team].vjList.push(memberName);

      // ข้อมูลรายบุคคล VJ
      vjStatsList.push({
        name: memberName,
        team: team,
        diamonds: dailyScore,
        dailyTarget: dailyTarget,
        achievedRate: dailyTarget > 0 ? (dailyScore / dailyTarget) * 100 : 0
      });
    });

    // จัดอันดับระดับทีม (Team Ranking)
    const teamStatsList = Object.values(teamStatsMap).sort((a, b) => b.totalDiamonds - a.totalDiamonds);
    teamStatsList.forEach((t, idx) => {
      t.rank = idx + 1;
      t.avgPerVJ = t.vjCount > 0 ? Math.round(t.totalDiamonds / t.vjCount) : 0;
    });

    // จัดอันดับระดับบุคคล VJ (VJ Ranking)
    vjStatsList.sort((a, b) => b.diamonds - a.diamonds);
    vjStatsList.forEach((v, idx) => {
      v.rank = idx + 1;
    });

    const topTeam = teamStatsList.length > 0 ? teamStatsList[0] : null;
    const topVJ = vjStatsList.length > 0 ? vjStatsList[0] : null;

    return {
      success: true,
      sheetName: sheetName,
      month: month,
      year: year,
      selectedDay: day,
      totalDaysInMonth: totalDaysInMonth,
      totalDailyDiamonds: totalDailyDiamonds,
      vjCount: vjStatsList.length,
      teamCount: teamStatsList.length,
      topTeam: topTeam,
      topVJ: topVJ,
      teamStats: teamStatsList,
      vjStatsList: vjStatsList
    }
    ;
    

  } catch (error) {
    return { success: false, error: error.toString() };
  }
  
}

/**
 * ฟังก์ชันดึงรูปโปรไฟล์จากชีต 'vjmc all' แล้วสร้าง Map { "ชื่อ VJ": "URL รูปภาพ" }
 */
function getVJAvatarMap() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // ค้นหาชีต vjmc all (รองรับตัวพิมพ์เล็ก-ใหญ่)
  const sheet = ss.getSheets().find(s => s.getName().trim().toLowerCase() === 'vjmc all');
  const avatarMap = {};

  if (!sheet) return avatarMap;

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return avatarMap;

  // ค้นหาคอลัมน์จาก Header (แถวที่ 1)
  const headers = data[0].map(h => String(h).trim().toLowerCase());
  
  // หาตำแหน่งคอลัมน์ชื่อ VJ (รองรับชื่อหัวข้อ: vj, name, ชื่อ)
  let nameColIdx = headers.findIndex(h => h.includes('vj') || h.includes('name') || h.includes('ชื่อ'));
  if (nameColIdx === -1) nameColIdx = 0; // ถ้าไม่เจอ ใช้คอลัมน์ A (ดัชนี 0)

  // หาตำแหน่งคอลัมน์รูปภาพ (รองรับชื่อหัวข้อ: pic, photo, image, รูป, url, avatar, profile)
  let imgColIdx = headers.findIndex(h => 
    h.includes('pic') || h.includes('photo') || h.includes('image') || 
    h.includes('รูป') || h.includes('url') || h.includes('avatar') || h.includes('profile')
  );
  if (imgColIdx === -1) imgColIdx = 1; // ถ้าไม่เจอ ใช้คอลัมน์ B (ดัชนี 1)

  // วนลูปเก็บข้อมูล ชื่อ VJ -> URL รูปภาพ
  for (let i = 1; i < data.length; i++) {
    const vjName = String(data[i][nameColIdx]).trim();
    const imgUrl = String(data[i][imgColIdx]).trim();
    
    if (vjName && imgUrl) {
      avatarMap[vjName] = imgUrl;
    }
  }

  return avatarMap;
}


/**
 * ดึงรายชื่อชีตประจำเดือน (เพื่อนำไปสร้าง Dropdown)
 */
/**
 * ดึงรายชื่อชีตประจำเดือน (เพื่อนำไปสร้าง Dropdown)
 */
function getMonthlySheetNames() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  const monthlySheets = [];

  sheets.forEach(sheet => {
    const name = sheet.getName();
    // กรองเอาเฉพาะชีตที่มีรูปแบบชื่อ YYYY-MM หรือตามโครงสร้างของระบบ
    if (/^\d{4}-\d{2}$/.test(name) || name.toLowerCase().includes('202')) {
      monthlySheets.push(name);
    }
  });

  return monthlySheets.length > 0 ? monthlySheets : [ss.getActiveSheet().getName()];
}

/**
 * ดึงข้อมูล Sales/Diamond ของ VJ ประจำวัน และสะสมรายเดือน
 * @param {string} targetSheetName - ชื่อชีตประจำเดือน
 * @param {string} selectedDateStr - วันที่ที่เลือก (รูปแบบ YYYY-MM-DD)
 */
function getVJBonusPayload(sheetName, selectedDateStr) {
  if (!selectedDateStr) {
    return { success: false, message: "ไม่ได้เลือกวันที่", vjList: [] };
  }
  
  // 1. แยกตัวเลขวันจาก DatePicker (เช่น "2026-08-01" -> ตัวเลข 1)
  var dateParts = selectedDateStr.split('-'); 
  var targetDay = parseInt(dateParts[2], 10);

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // ค้นหา Sheet โดยไม่สนใจตัวพิมพ์เล็ก-ใหญ่ หรือเว้นวรรค
  var sheet = null;
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().trim().toUpperCase() === sheetName.trim().toUpperCase()) {
      sheet = sheets[i];
      break;
    }
  }

  if (!sheet) {
    return { success: false, message: "ไม่พบแผ่นงานชื่อ: " + sheetName, vjList: [] };
  }

  var data = sheet.getDataRange().getValues();
  if (data.length < 3) return { success: false, vjList: [] };

  // 2. ค้นหาคอลัมน์วันที่ (เลข 1, 2, 3...) จากแถวหัวตาราง (ค้นหาใน 5 แถวแรก)
  var targetColIndex = -1;
  var headerRowIdx = -1;

  for (var r = 0; r < Math.min(5, data.length); r++) {
    for (var c = 0; c < data[r].length; c++) {
      var cellVal = data[r][c];
      if (parseInt(cellVal, 10) === targetDay) {
        targetColIndex = c;
        headerRowIdx = r;
        break;
      }
    }
    if (targetColIndex !== -1) break;
  }

  if (targetColIndex === -1) {
    return { success: false, message: "ไม่พบคอลัมน์วันที่ " + targetDay, vjList: [] };
  }

  // 3. วนลูปอ่านข้อมูล VJ แต่ละคน
  var vjList = [];
  var currentTeam = "";

  for (var r = headerRowIdx + 1; r < data.length; r++) {
    var row = data[r];
    if (!row || row.length === 0) continue;

    // คอลัมน์ A (Index 0) = ชื่อทีม
    var rawTeam = row[0] ? String(row[0]).trim() : "";
    if (rawTeam !== "") {
      currentTeam = rawTeam; // บันทึกชื่อทีมไว้ใช้กับบรรทัดถัดไป
    }

    // คอลัมน์ E (Index 4) = ชื่อ VJ
    var vjName = row[4] ? String(row[4]).trim() : "";

    // 🛑 1. กรองบรรทัดที่ไม่ใช่ VJ ออก (เช่น บรรทัดว่าง หรือบรรทัด TOTAL)
    if (!vjName || vjName === "" || vjName.toUpperCase() === "TOTAL") {
      continue;
    }

    // 🛑 2. ตรวจสอบช่องยอด Diamond ประจำวันที่เลือก (targetColIndex)
    var rawDaily = row[targetColIndex];

    // ถ้าช่องนั้นเป็นช่องว่าง/ไม่มีข้อมูล ให้ข้ามไป
    if (rawDaily === null || rawDaily === undefined || String(rawDaily).trim() === "") {
      continue;
    }

    // แปลงค่าเป็นตัวเลข หากเป็นตัวหนังสือ (เช่น "holiday", "off", "OFF", "JR") จะได้ค่า NaN
    var dailyDiamonds = Number(rawDaily);

    // ถ้าเป็นตัวหนังสือ (isNaN) ให้ "กรองออก" ไม่นำ VJ คนนี้มาแสดงในรายการประจำวัน
    if (isNaN(dailyDiamonds)) {
      continue; 
    }

    // 📌 คอลัมน์ F (Index 5) = ยอด Diamond สะสมทั้งเดือน
    var monthDiamonds = Number(row[5]);
    if (isNaN(monthDiamonds)) monthDiamonds = 0;

    vjList.push({
      date: selectedDateStr,
      name: vjName,
      team: currentTeam || "-",
      dailyDiamonds: dailyDiamonds,
      monthDiamonds: monthDiamonds,
      activeDays: 0
    });
  }

  return {
    success: true,
    vjList: vjList
  };
}

function calculateVJBountyTier(diamonds) {
  if (diamonds < 30000) {
    return {
      tierText: 'Tier 0 (<30,000 💎)',
      bonusBaht: 0,
      neededNextTier: 30000 - diamonds
    };
  }

  const tierLevel = Math.floor(diamonds / 30000);
  const minTier = tierLevel * 30000;
  const maxTier = (tierLevel + 1) * 30000 - 1;
  const bonus = tierLevel * 300;
  const needed = ((tierLevel + 1) * 30000) - diamonds;

  return {
    tierText: `Tier ${tierLevel} (${minTier.toLocaleString()} - ${maxTier.toLocaleString()} 💎)`,
    bonusBaht: bonus,
    neededNextTier: needed
  };
}


/**
 * เปิดหน้า VJ_Bonus แบบ Dialog ป๊อปอัพขนาดใหญ่ใน Google Sheets
 */
function showVJBonusModal() {
  const html = HtmlService.createHtmlOutputFromFile('VJ_Bonus')
    .setWidth(1300)
    .setHeight(850)
    .setTitle('ACE Tracking — VJ Bonus System');
  SpreadsheetApp.getUi().showModalDialog(html, ' ');
}

/**
 * เปิดหน้า VJ_Bonus แบบ Sidebar แถบข้างใน Google Sheets
 */
function showVJBonusSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('VJ_Bonus')
    .setTitle('ACE Tracking — VJ Bonus System');
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * สร้างเมนูลัดบน Google Sheets เพื่อกดเปิดหน้า VJ Bonus ได้สะดวก
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('ACE Tracking System')
    .addItem('เปิดระบบ VJ Bonus (หน้าต่างใหญ่)', 'showVJBonusModal')
    .addItem('เปิดระบบ VJ Bonus (แถบข้าง Sidebar)', 'showVJBonusSidebar')
    .addToUi();
}

/**
 * ฟังก์ชัน Helper สำหรับดึงไฟล์ HTML/CSS/JS แยก (ถ้ามีการใช้ <?!= include('FileName'); ?>)
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}



/**
 * ===================================================
 * ACE Tracking Extension Module: MC Schedule & Bonus Calculator
 * Backend Extensions for Google Apps Script
 * ===================================================
 */

/**
 * 1. ฟังก์ชันเตรียมชีตสำหรับระบบ MC (MC_Schedules และ MC_Bonus_Logs)
 */
function initMCModuleSheets_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let schSheet = ss.getSheetByName('MC_Schedules');
  if (!schSheet) {
    schSheet = ss.insertSheet('MC_Schedules');
    const headers = ['ID', 'Date', 'MC_Name', 'Assigned_Team', 'Cover_Team', 'Is_Cover', 'Shift_Time', 'Status', 'Notes', 'UpdatedBy', 'UpdatedAt'];
    schSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    schSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#4f46e5').setFontColor('#ffffff');
    schSheet.setFrozenRows(1);
  }

  let bonusSheet = ss.getSheetByName('MC_Bonus_Logs');
  if (!bonusSheet) {
    bonusSheet = ss.insertSheet('MC_Bonus_Logs');
    const headers = ['LogID', 'Date', 'Team', 'MC_Name', 'Is_Cover', 'Daily_Diamond_Score', 'Bonus_Tier', 'Bonus_Amount', 'CalculatedAt', 'UpdatedBy'];
    bonusSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    bonusSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#059669').setFontColor('#ffffff');
    bonusSheet.setFrozenRows(1);
  }

  return { schSheet, bonusSheet };
}

/**
 * 2. ฟังก์ชันคำนวณโบนัส MC รายวันตามสเกล Dynamic (+150 บาท ทุกๆ 60,000 Diamond)
 */
function calculateMCBonus(dailyScore) {
  const score = parseFloat(dailyScore) || 0;
  if (score < 60000) {
    return {
      bonusAmount: 0,
      tierStep: 0,
      tierLabel: 'Tier 0 (< 60,000 💎)',
      nextTierDiff: 60000 - score
    };
  }

  const tierStep = Math.floor(score / 60000);
  const bonusAmount = tierStep * 150;
  const minBound = tierStep * 60000;
  const maxBound = (tierStep + 1) * 60000 - 1;
  const nextTierDiff = (tierStep + 1) * 60000 - score;

  return {
    bonusAmount: bonusAmount,
    tierStep: tierStep,
    tierLabel: `Tier ${tierStep} (${minBound.toLocaleString()} - ${maxBound.toLocaleString()} 💎)`,
    nextTierDiff: nextTierDiff
  };
}

/**
 * 3. ดึงข้อมูลตารางงาน MC (getMCSchedules)
 */
function getMCSchedules(startDateStr, endDateStr, mcFilter, teamFilter, targetSheetName) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const activeSheet = targetSheetName ? ss.getSheetByName(targetSheetName) : ss.getSheets()[0];
    if (!activeSheet) return { success: true, schedules: [] };

    const teamMCMap = getTeamDefaultMCMap();
    const teamShiftMap = getTeamShiftMap(activeSheet);
    const data = activeSheet.getDataRange().getValues();
    const sheetName = activeSheet.getName();

    const monthNames = {'JANUARY':1, 'FEBRUARY':2, 'MARCH':3, 'APRIL':4, 'MAY':5, 'JUNE':6, 'JULY':7, 'AUGUST':8, 'SEPTEMBER':9, 'OCTOBER':10, 'NOVEMBER':11, 'DECEMBER':12};
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;

    const parts = sheetName.toUpperCase().split(' ');
    if (parts.length >= 2 && monthNames[parts[0]]) {
      month = monthNames[parts[0]];
      year = parseInt(parts[1]) || year;
    }

    const cleanMC = String(mcFilter || '').trim().toLowerCase();
    const cleanTeam = String(teamFilter || '').trim().toLowerCase();
    const schedules = [];
    let currentTeam = '';

    for (let r = 0; r < data.length; r++) {
      const colA = String(data[r][0] || '').trim();
      const colE = String(data[r][4] || '').trim().toUpperCase();

      if (colA && colA.toUpperCase() !== 'GROUP LIVE ACCOUNT') {
        currentTeam = colA;
      }

      if (colE === 'TOTAL') {
        const mcRow = (r > 0) ? data[r - 1] : [];
        const defaultMC = teamMCMap[currentTeam] || '-';
        const teamShift = teamShiftMap[currentTeam] || '18:00 - 02:00';

        for (let d = 1; d <= 31; d++) {
          const colIdx = 5 + d;
          if (colIdx >= data[r].length) break;

          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

          if (startDateStr && dateStr < startDateStr) continue;
          if (endDateStr && dateStr > endDateStr) continue;

          let dutyMC = String(mcRow[colIdx] || '').trim();
          const ignoreStatus = ['OFF', 'HOLIDAY', 'PING', '-', '0', ''];
          if (ignoreStatus.includes(dutyMC.toUpperCase()) && dutyMC !== '') continue;

          if (!dutyMC) dutyMC = defaultMC;

          if (dutyMC && dutyMC !== '-') {
            const isCover = defaultMC !== '-' && (dutyMC.toLowerCase() !== defaultMC.toLowerCase());

            if (cleanMC && !dutyMC.toLowerCase().includes(cleanMC)) continue;
            if (cleanTeam && !currentTeam.toLowerCase().includes(cleanTeam)) continue;

            schedules.push({
              id: `SCH-${currentTeam}-${dateStr}`,
              date: dateStr,
              mcName: dutyMC,
              assignedTeam: currentTeam,
              effectiveTeam: currentTeam,
              defaultMC: defaultMC,
              isCover: isCover,
              shiftTime: teamShift,
              status: 'ACTIVE',
              notes: isCover ? `ปฏิบัติงานแทนที่ห้อง ${currentTeam}` : 'ปฏิบัติงานปกติ'
            });
          }
        }
      }
    }

    schedules.sort((a, b) => b.date.localeCompare(a.date));
    return { success: true, schedules: schedules };

  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * 4. บันทึกตารางงาน MC (saveMCSchedule)
 */
function saveMCSchedule(payload, adminUser, sessionToken) {
  try {
    const session = requireAdminSession_(sessionToken);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    initMCModuleSheets_();

    const sheetName = payload.sheetName || '';
    const sheet = sheetName ? ss.getSheetByName(sheetName) : ss.getSheets()[0];
    if (!sheet) return { success: false, error: 'ไม่พบแผ่นงานที่เลือก' };

    const dateParts = payload.dateStr.split('-');
    const dayNum = parseInt(dateParts[2], 10);
    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      return { success: false, error: 'รูปแบบวันที่ไม่ถูกต้อง' };
    }

    const targetColIdx = 6 + dayNum; 
    const targetTeam = payload.isCover ? payload.coverTeam : payload.defaultTeam;
    if (!targetTeam) return { success: false, error: 'กรุณาระบุทีมปฏิบัติงาน' };

    const data = sheet.getDataRange().getValues();
    let targetRowIndex = -1;

    for (let r = 0; r < data.length; r++) {
      const colA = String(data[r][0] || '').trim();
      const colE = String(data[r][4] || '').trim().toUpperCase();

      if (colA === targetTeam && colE === 'TOTAL') {
        targetRowIndex = r;
        break;
      }
    }

    if (targetRowIndex <= 0) {
      return { success: false, error: `ไม่พบแถว TOTAL ของทีม "${targetTeam}"` };
    }

    sheet.getRange(targetRowIndex, targetColIdx).setValue(payload.mcName);

    saveLog_('SAVE_MC_SCHEDULE', `บันทึกตาราง MC: ${payload.mcName} ประจำทีม ${targetTeam} วันที่ ${dayNum}`, session.displayName, 'SUCCESS');

    return { 
      success: true, 
      message: `บันทึกข้อมูล ${payload.mcName} ลงทีม ${targetTeam} วันที่ ${dayNum} เรียบร้อยแล้ว!` 
    };

  } catch (err) {
    saveLog_('SAVE_MC_SCHEDULE', `ล้มเหลวในการบันทึก MC Schedule: ${err.message || 'บันทึกไม่สำเร็จ'}`, 'System', 'FAILED');
    return { success: false, error: err.toString() };
  }
}

/**
 * 5. ดึงข้อมูลสรุปรายงาน โบนัส MC รายวันและสะสม (getMCBonusReport)
 */
function getMCBonusReport(targetSheetName, selectedDateDay) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const activeSheet = targetSheetName ? ss.getSheetByName(targetSheetName) : ss.getSheets()[0];
    if (!activeSheet) return { success: false, error: 'ไม่พบแผ่นงานที่ระบุ' };

    const teamMCMap = getTeamDefaultMCMap();
    const data = activeSheet.getDataRange().getValues();
    
    const todayDay = new Date().getDate();
    const currentDay = selectedDateDay ? parseInt(selectedDateDay, 10) : todayDay;
    const daysInMonth = 31;

    const dailyBreakdown = [];
    const monthlyMCTotals = {};
    let currentTeam = '';

    for (let r = 0; r < data.length; r++) {
      const colA = String(data[r][0] || '').trim();
      const colE = String(data[r][4] || '').trim().toUpperCase();

      if (colA && colA.toUpperCase() !== 'GROUP LIVE ACCOUNT') {
        currentTeam = colA;
      }

      if (colE === 'TOTAL') {
        const totalRow = data[r];
        const mcRow = (r > 0) ? data[r - 1] : [];

        for (let d = 1; d <= daysInMonth; d++) {
          const colIdx = 5 + d;
          if (colIdx >= totalRow.length) break;

          const teamScore = parseFloat(String(totalRow[colIdx] || '0').replace(/,/g, '')) || 0;
          let dutyMC = String(mcRow[colIdx] || '').trim();

          if (!dutyMC) {
            dutyMC = teamMCMap[currentTeam] || '';
          }

          const ignoreStatus = ['OFF', 'HOLIDAY', 'PING', '-', '0', ''];
          const isActive = dutyMC && !ignoreStatus.includes(dutyMC.toUpperCase());

          if (isActive) {
            const defaultMC = teamMCMap[currentTeam] || '';
            const isCover = defaultMC && (dutyMC.toLowerCase() !== defaultMC.toLowerCase());
            const bonusInfo = calculateMCBonus(teamScore);

            if (!monthlyMCTotals[dutyMC]) {
              monthlyMCTotals[dutyMC] = {
                mcName: dutyMC,
                assignedTeam: currentTeam,
                activeDaysCount: 0,
                coverDaysCount: 0,
                monthlyDiamonds: 0,
                monthlyBonus: 0
              };
            }

            monthlyMCTotals[dutyMC].activeDaysCount += 1;
            if (isCover) monthlyMCTotals[dutyMC].coverDaysCount += 1;
            monthlyMCTotals[dutyMC].monthlyDiamonds += teamScore;
            monthlyMCTotals[dutyMC].monthlyBonus += bonusInfo.bonusAmount;

            if (d === currentDay) {
              dailyBreakdown.push({
                dayNum: d,
                mcName: dutyMC,
                assignedTeam: currentTeam,
                effectiveTeam: currentTeam,
                defaultMC: defaultMC,
                isCover: isCover,
                teamScore: teamScore,
                bonusTier: bonusInfo.tierLabel,
                bonusAmount: bonusInfo.bonusAmount,
                nextTierDiff: bonusInfo.nextTierDiff
              });
            }
          }
        }
      }
    }

    const totalDailyBonus = dailyBreakdown.reduce((sum, item) => sum + item.bonusAmount, 0);
    const totalDailyDiamonds = dailyBreakdown.reduce((sum, item) => sum + item.teamScore, 0);

    return {
      success: true,
      sheetName: activeSheet.getName(),
      selectedDay: currentDay,
      summary: {
        totalDailyBonus: totalDailyBonus,
        totalDailyDiamonds: totalDailyDiamonds,
        activeMCCount: dailyBreakdown.length,
        totalMonthlyBonusAllMC: Object.values(monthlyMCTotals).reduce((sum, item) => sum + item.monthlyBonus, 0)
      },
      dailyBreakdown: dailyBreakdown,
      monthlyMCTotals: Object.values(monthlyMCTotals)
    };

  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * คำนวณผลสรุปโบนัส MC รายเดือน
 * @param {string} targetMonth - รูปแบบ "YYYY-MM" (เช่น "2026-08")
 */
function getMonthlyMCBonusSummary(targetMonth) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("BonusData"); // เปลี่ยนชื่อ Sheet ตามจริง
    const data = sheet.getDataRange().getValues();
    const headers = data.shift(); // ดึงหัวตารางออก

    const mcSummaryMap = {};

    data.forEach(row => {
      const [dateStr, mcName, team, type, diamond, bonus] = row;
      const rowMonth = dateStr.toString().substring(0, 7); // ดึง YYYY-MM

      if (!targetMonth || rowMonth === targetMonth) {
        if (!mcSummaryMap[mcName]) {
          mcSummaryMap[mcName] = {
            mcName: mcName,
            team: team,
            type: type,
            totalDiamond: 0,
            totalBonus: 0,
            workDays: 0
          };
        }
        mcSummaryMap[mcName].totalDiamond += Number(diamond) || 0;
        mcSummaryMap[mcName].totalBonus += Number(bonus) || 0;
        mcSummaryMap[mcName].workDays += 1;
      }
    });

    const result = Object.values(mcSummaryMap);
    return { success: true, month: targetMonth, data: result };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * ดึงข้อมูลสรุปยอดโบนัสรายเดือน โดยยึด Master List จากชีต "Team Data"
 * @param {string} targetMonth - รูปแบบ "YYYY-MM" (เช่น "2026-08")
 */
/**
 * ดึงข้อมูลสรุปยอดโบนัสรายเดือน โดยกรองชื่อ MC ที่ซ้ำออก
 */
function getMonthlyMCBonusFromTeamData(targetMonth) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. อ่านข้อมูล MC จากชีต "Team Data"
    const teamSheet = ss.getSheetByName("Team Data");
    if (!teamSheet) throw new Error("ไม่พบชีต 'Team Data'");

    const teamValues = teamSheet.getDataRange().getValues();
    teamValues.shift(); // ลบ Header

    const mcMasterMap = {};

    teamValues.forEach(row => {
      const rawMcName = String(row[0] || '').trim(); // ชื่อ MC
      const teamName = String(row[1] || '').trim();  // ชื่อทีม

      if (rawMcName) {
        // แปลงเป็นตัวพิมพ์ใหญ่ทั้งหมดใช้เป็น Key เพื่อป้องกันชื่อซ้ำ เช่น Yo และ YO
        const uniqueKey = rawMcName.toUpperCase();

        // เก็บข้อมูลเฉพาะชื่อที่ไม่เคยถูกเพิ่มมาก่อน
        if (!mcMasterMap[uniqueKey]) {
          mcMasterMap[uniqueKey] = {
            mcName: rawMcName, // แสดงชื่อตามต้นฉบับแถวแรกที่เจอ
            team: teamName,
            workDays: 0,
            totalBonus: 0
          };
        }
      }
    });

    // 2. แมตช์ข้อมูลและคำนวณยอดสะสมจากชีต "BonusData"
    const bonusSheet = ss.getSheetByName("BonusData");
    if (bonusSheet) {
      const bonusValues = bonusSheet.getDataRange().getValues();
      bonusValues.shift();

      bonusValues.forEach(row => {
        const dateStr = String(row[0] || '');
        const rawMcName = String(row[1] || '').trim();
        const bonusAmount = Number(row[5]) || 0;

        const rowMonth = dateStr.substring(0, 7);
        const isSelectedMonth = !targetMonth || rowMonth === targetMonth;

        const uniqueKey = rawMcName.toUpperCase();

        // สะสมยอดเข้า MC ที่ตรงกัน
        if (isSelectedMonth && mcMasterMap[uniqueKey]) {
          mcMasterMap[uniqueKey].workDays += 1;
          mcMasterMap[uniqueKey].totalBonus += bonusAmount;
        }
      });
    }

    return {
      success: true,
      data: Object.values(mcMasterMap)
    };

  } catch (error) {
    return { success: false, error: error.toString() };
  }
}


// ====================================================
// ระบบจัดการและคำนวณ KPI (VJ & Team Performance % & Rank)
// ====================================================

/**
 * ดึงข้อมูลสรุป KPI รวม VJ และ Team พร้อมคำนวณ % ความสำเร็จและการจัดอันดับ
 */
// 2. ฟังก์ชันดึงข้อมูล (หากไม่พบชื่อชีต จะทำการสร้างชีตใหม่พร้อมข้อมูลตัวอย่างให้ทันที)
function getVJAndTeamKPIData(sheetName) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return { success: false, error: 'ไม่พบชีต KPI ที่ระบุ' };

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return { success: true, vjList: [], teamList: [] };
    }

    // ดึงข้อมูลแถวที่ 2 เป็นต้นไป (คอลัมน์ A ถึง E)
    const dataRange = sheet.getRange(2, 1, lastRow - 1, 5);
    const values = dataRange.getValues();

    let vjMap = [];
    let teamMap = {};

    // วนลูปจัดการข้อมูล
    values.forEach(function(row) {
      const vjName = String(row[0]).trim();
      const teamName = String(row[1]).trim() || "ไม่ระบุทีม";
      const targetDiamond = Number(row[2]) || 0;
      const actualDiamond = Number(row[3]) || 0;
      const avatarUrl = String(row[4] || "").trim();

      if (vjName === "") return; // ข้ามแถวว่าง

      const achievementRate = targetDiamond > 0 ? parseFloat(((actualDiamond / targetDiamond) * 100).toFixed(1)) : 0;

      vjMap.push({
        vjName: vjName,
        teamName: teamName,
        targetDiamond: targetDiamond,
        actualDiamond: actualDiamond,
        achievementRate: achievementRate,
        avatarUrl: avatarUrl
      });

      // จัดกลุ่มระดับทีม
      if (!teamMap[teamName]) {
        teamMap[teamName] = { teamName: teamName, vjCount: 0, targetDiamond: 0, actualDiamond: 0 };
      }
      teamMap[teamName].vjCount += 1;
      teamMap[teamName].targetDiamond += targetDiamond;
      teamMap[teamName].actualDiamond += actualDiamond;
    });

    // จัดอันดับ VJ จากยอดสะสม Diamond จริง
    vjMap.sort(function(a, b) { return b.actualDiamond - a.actualDiamond; });
    vjMap.forEach(function(item, index) { item.rank = index + 1; });

    // แปลงกลุ่มทีมและจัดอันดับทีมตามอัตราบรรลุเป้าหมาย
    let teamList = Object.keys(teamMap).map(function(key) {
      const t = teamMap[key];
      t.achievementRate = t.targetDiamond > 0 ? parseFloat(((t.actualDiamond / t.targetDiamond) * 100).toFixed(1)) : 0;
      return t;
    });
    
    teamList.sort(function(a, b) { return b.achievementRate - a.achievementRate; });
    teamList.forEach(function(item, index) { item.rank = index + 1; });

    return {
      success: true,
      sheetName: sheetName,
      vjList: vjMap,
      teamList: teamList
    };

  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// 3. ฟังก์ชันสำหรับบันทึกเป้าหมาย KPI ลงชีตที่ระบุ
function saveKPITarget(sheetName, vjName, targetDiamond, adminUser, sessionToken) {
  try {
    const session = requireAdminSession_(sessionToken);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      return { success: false, error: "ไม่พบชีตนี้ในระบบ" };
    }

    const lastRow = sheet.getLastRow();
    let targetRow = -1;

    if (lastRow >= 2) {
      const vjNamesColumn = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (let i = 0; i < vjNamesColumn.length; i++) {
        if (String(vjNamesColumn[i][0]).trim() === vjName.trim()) {
          targetRow = i + 2;
          break;
        }
      }
    }

    if (targetRow !== -1) {
      // อัปเดตช่องเป้าหมาย (คอลัมน์ C)
      sheet.getRange(targetRow, 3).setValue(Number(targetDiamond));
      
      // บันทึก Log เล็กๆ ลงใน Stackdriver/Apps Script Console
      console.log(`[KPI Updated] Sheet: ${sheetName} | VJ: ${vjName} | New Target: ${targetDiamond} | Admin: ${adminUser}`);
      return { success: true };
    } else {
      // กรณีไม่ชื่อ VJ นี้ แต่ชีตมีอยู่แล้ว จะทำการเพิ่มแถวใหม่ให้ต่อท้าย
      sheet.appendRow([vjName, "ไม่ระบุทีม", Number(targetDiamond), 0, ""]);
      return { success: true, note: "เพิ่มชื่อ VJ ใหม่ลงในตารางเรียบร้อย" };
    }

  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * ดึงข้อมูล VJ และทีม โดยล็อคตำแหน่งชื่อ VJ ที่ Col B และทีมที่ Col C ในชีต "vj mc all"
 */
function getVJAndTeamKPIData(sheetName) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. ดึงข้อมูลจากชีตหลัก "vj mc all"
    const mainSheet = ss.getSheetByName("vj mc all");
    if (!mainSheet) {
      return { success: false, error: "ไม่พบชีตหลักที่ชื่อว่า 'vj mc all'" };
    }
    
    const mainData = mainSheet.getDataRange().getValues();
    if (mainData.length <= 1) {
      return { success: false, error: "ชีต 'vj mc all' ไม่มีข้อมูลรายชื่อ VJ" };
    }
    
    // ล็อคดัชนีคอลัมน์: Col B คือดัชนี 1 (ชื่อ VJ), Col C คือดัชนี 2 (ทีม)
    const vjIdx = 1; 
    const teamIdx = 2;
    
    let vjMasterList = [];
    for (let i = 1; i < mainData.length; i++) {
      let vjName = mainData[i][vjIdx] ? mainData[i][vjIdx].toString().trim() : "";
      let teamName = mainData[i][teamIdx] ? mainData[i][teamIdx].toString().trim() : "ไม่ระบุทีม";
      
      // ข้ามแถวที่ไม่มีชื่อ VJ
      if (vjName && vjName !== "") {
        vjMasterList.push({ vjName: vjName, teamName: teamName });
      }
    }
    
    // 2. ดึงข้อมูล Target และ Actual จากชีตประจำเดือน (เช่น AUGUST_2026)
    const monthSheet = ss.getSheetByName(sheetName);
    let monthDataMap = {};
    
    if (monthSheet) {
      const mData = monthSheet.getDataRange().getValues();
      if (mData.length > 1) {
        const mHeaders = mData[0].map(h => h.toString().toLowerCase().trim());
        // ค้นหาตำแหน่งอัตโนมัติเฉพาะในชีตเดือน เผื่อแต่ละเดือนสลับคอลัมน์กัน
        const mVjIdx = mHeaders.findIndex(h => h.includes("vj") || h.includes("ชื่อ"));
        const mTargetIdx = mHeaders.findIndex(h => h.includes("target") || h.includes("เป้า"));
        const mActualIdx = mHeaders.findIndex(h => h.includes("actual") || h.includes("จริง"));
        
        if (mVjIdx !== -1) {
          for (let i = 1; i < mData.length; i++) {
            let name = mData[i][mVjIdx] ? mData[i][mVjIdx].toString().trim() : "";
            if (name) {
              let target = mTargetIdx !== -1 ? Number(mData[i][mTargetIdx]) || 0 : 0;
              let actual = mActualIdx !== -1 ? Number(mData[i][mActualIdx]) || 0 : 0;
              monthDataMap[name] = { target: target, actual: actual };
            }
          }
        }
      }
    }
    
    // 3. แมตช์ข้อมูลรายชื่อจากผังหลักเข้ากับยอดประจำเดือน
    let finalVJList = vjMasterList.map(vj => {
      let monthlyData = monthDataMap[vj.vjName] || { target: 0, actual: 0 };
      let rate = monthlyData.target > 0 ? (monthlyData.actual / monthlyData.target) * 100 : 0;
      
      return {
        vjName: vj.vjName,
        teamName: vj.teamName,
        targetDiamond: monthlyData.target,
        actualDiamond: monthlyData.actual,
        achievementRate: Number(rate.toFixed(1)),
        rank: 1
      };
    });
    
    // เรียงลำดับจากยอดทำได้จริง (Actual) มากไปน้อยเพื่อจัดอันดับ
    finalVJList.sort((a, b) => b.actualDiamond - a.actualDiamond);
    finalVJList.forEach((v, index) => v.rank = index + 1);
    
    // 4. สรุปผลยอดรวมแยกรายทีม
    let teamSummaryMap = {};
    finalVJList.forEach(v => {
      if (!teamSummaryMap[v.teamName]) {
        teamSummaryMap[v.teamName] = { teamName: v.teamName, vjCount: 0, targetDiamond: 0, actualDiamond: 0 };
      }
      teamSummaryMap[v.teamName].vjCount += 1;
      teamSummaryMap[v.teamName].targetDiamond += v.targetDiamond;
      teamSummaryMap[v.teamName].actualDiamond += v.actualDiamond;
    });
    
    let finalTeamList = Object.values(teamSummaryMap).map(t => {
      let rate = t.targetDiamond > 0 ? (t.actualDiamond / t.targetDiamond) * 100 : 0;
      return {
        teamName: t.teamName,
        vjCount: t.vjCount,
        targetDiamond: t.targetDiamond,
        actualDiamond: t.actualDiamond,
        achievementRate: Number(rate.toFixed(1)),
        rank: 1
      };
    });
    
    finalTeamList.sort((a, b) => b.achievementRate - a.achievementRate);
    finalTeamList.forEach((t, index) => t.rank = index + 1);
    
    return {
      success: true,
      vjList: finalVJList,
      teamList: finalTeamList
    };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * บันทึกเป้าหมาย KPI ลงชีตประจำเดือน
 */
function saveKPITarget(sheetName, vjName, targetValue, adminName, sessionToken) {
  try {
    const session = requireAdminSession_(sessionToken);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let monthSheet = ss.getSheetByName(sheetName);
    
    if (!monthSheet) {
      monthSheet = ss.insertSheet(sheetName);
      monthSheet.appendRow(["ชื่อ VJ", "เป้าหมาย (Target)", "ทำได้จริง (Actual)", "ผู้บันทึกล่าสุด"]);
    }
    
    const mData = monthSheet.getDataRange().getValues();
    const mHeaders = mData[0].map(h => h.toString().toLowerCase().trim());
    const mVjIdx = mHeaders.findIndex(h => h.includes("vj") || h.includes("ชื่อ"));
    const mTargetIdx = mHeaders.findIndex(h => h.includes("target") || h.includes("เป้า"));
    const mAdminIdx = mHeaders.findIndex(h => h.includes("admin") || h.includes("ผู้บันทึก"));
    
    if (mVjIdx === -1 || mTargetIdx === -1) {
      return { success: false, error: "โครงสร้างหัวตารางในชีตประจำเดือนไม่ถูกต้อง" };
    }
    
    let targetRow = -1;
    for (let i = 1; i < mData.length; i++) {
      if (mData[i][mVjIdx] && mData[i][mVjIdx].toString().trim() === vjName.trim()) {
        targetRow = i + 1;
        break;
      }
    }
    
    if (targetRow !== -1) {
      monthSheet.getRange(targetRow, mTargetIdx + 1).setValue(Number(targetValue));
      if (mAdminIdx !== -1) monthSheet.getRange(targetRow, mAdminIdx + 1).setValue(session.displayName);
    } else {
      let newRow = [];
      mHeaders.forEach((h, index) => {
        if (index === mVjIdx) newRow.push(vjName);
        else if (index === mTargetIdx) newRow.push(Number(targetValue));
        else if (index === mAdminIdx) newRow.push(session.displayName);
        else if (h.includes("actual") || h.includes("จริง")) newRow.push(0);
        else newRow.push("");
      });
      monthSheet.appendRow(newRow);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}






/**
 * ===================================================
 * API & Real-time Data Engine สำหรับ TV Dashboard
 * ===================================================
 */
/**
 * ===================================================
 * ฟังก์ชันดึงชีตเดือนล่าสุดอัตโนมัติ (Latest Month Resolver)
 * ===================================================
 */
/**
 * ดึงชีตประจำเดือนอัจฉริยะ (รองรับการตัดรอบ 04.00 น.)
 */
function getLatestMonthlySheet(ss) {
  const sheets = ss.getSheets();
  const excludeList = [
    'system_logs', 'admin_users', 'status_overrides', 
    'team data', 'team_data', 'vj mc all', 'vj_mc_all', 
    'kpi_targets', 'kpi_data', 'table bonus', 'table_bonus', 
    'vj_bonus', 'vjbonus', 'mc_w', 'weekly'
  ];

  // ใช้ วัน/เดือน ตามรอบการตัดรอบ 04:00 น.
  const opDate = getOperationalDate();
  const currentYear = opDate.getFullYear();
  const currentMonth = opDate.getMonth();

  let exactMatchSheet = null;
  let latestChronologicalSheet = null;
  let maxScore = -1;

  sheets.forEach(sheet => {
    const sheetName = sheet.getName();
    const cleanName = sheetName.toLowerCase().trim();

    if (excludeList.includes(cleanName)) return;

    const parsed = parseMonthYearFromSheetName(sheetName);
    if (!parsed) return;

    const sheetScore = (parsed.year * 12) + parsed.month;
    if (sheetScore > maxScore) {
      maxScore = sheetScore;
      latestChronologicalSheet = sheet;
    }

    if (parsed.year === currentYear && parsed.month === currentMonth) {
      exactMatchSheet = sheet;
    }
  });

  return exactMatchSheet || latestChronologicalSheet || sheets[0];
}

/**
 * ===================================================
 * API & Real-time Data Engine สำหรับ TV Dashboard (อัปเดตล่าสุด)
 * ===================================================
 */
/**
 * ===================================================
 * API & Real-time Data Engine สำหรับ TV Dashboard (อัปเดตจัดอันดับทีม)
 * ===================================================
 */
/**
 * ดึงข้อมูลรูปโปรไฟล์/โลโก้ประจำทีมจากชีต team_data (คอลัมน์ A = ชื่อทีม, คอลัมน์ B = URL รูปโลโก้)
 */
function getTeamLogoMap() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const teamSheet = ss.getSheetByName('team_data') || ss.getSheetByName('team data');
  const logoMap = {};

  if (teamSheet) {
    const data = teamSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      const teamName = String(data[i][0] || '').trim();
      const logoUrl = String(data[i][1] || '').trim();
      if (teamName && logoUrl) {
        logoMap[teamName] = logoUrl;
      }
    }
  }

  return logoMap;
}

/**
 * API & Real-time Data Engine สำหรับ TV Dashboard (เพิ่มโลโก้ทีม)
 */
/**
 * ดึงชีตประจำเดือนอัจฉริยะ (รองรับการตัดรอบ 04.00 น.)
 */
function getLatestMonthlySheet(ss) {
  const sheets = ss.getSheets();
  const excludeList = [
    'system_logs', 'admin_users', 'status_overrides', 
    'team data', 'team_data', 'vj mc all', 'vj_mc_all', 
    'kpi_targets', 'kpi_data', 'table bonus', 'table_bonus', 
    'vj_bonus', 'vjbonus', 'mc_w', 'weekly'
  ];

  // ใช้ วัน/เดือน ตามรอบการตัดรอบ 04:00 น.
  const opDate = getOperationalDate();
  const currentYear = opDate.getFullYear();
  const currentMonth = opDate.getMonth();

  let exactMatchSheet = null;
  let latestChronologicalSheet = null;
  let maxScore = -1;

  sheets.forEach(sheet => {
    const sheetName = sheet.getName();
    const cleanName = sheetName.toLowerCase().trim();

    if (excludeList.includes(cleanName)) return;

    const parsed = parseMonthYearFromSheetName(sheetName);
    if (!parsed) return;

    const sheetScore = (parsed.year * 12) + parsed.month;
    if (sheetScore > maxScore) {
      maxScore = sheetScore;
      latestChronologicalSheet = sheet;
    }

    if (parsed.year === currentYear && parsed.month === currentMonth) {
      exactMatchSheet = sheet;
    }
  });

  return exactMatchSheet || latestChronologicalSheet || sheets[0];
}

/**
 * API ดึงข้อมูล TV Dashboard (อัปเดตตัดรอบวันที่ 04:00 น.)
 */
function getTVDashboardData(targetSheetName, selectedDay) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let activeSheet = null;

    if (targetSheetName) {
      activeSheet = ss.getSheetByName(targetSheetName);
    }

    if (!activeSheet) {
      activeSheet = getLatestMonthlySheet(ss);
    }

    const sheetName = activeSheet.getName();
    const rawData = getDataFromSheet(sheetName);

    if (!rawData || !rawData.success) {
      return { success: false, error: rawData ? rawData.error : 'ไม่พบข้อมูลในชีต' };
    }

    const rows = rawData.rows || [];
    const vjProfiles = rawData.vjProfiles || {};
    const avatarMap = getVJAvatarMap();
    const teamLogoMap = getTeamLogoMap();
    const teamLiveSchedules = rawData.teamLiveSchedules || {};
    const kpiTargets = rawData.kpiTargets || {};
    const statusOverrides = rawData.statusOverrides || {};

    // ----------------------------------------------------
    // คำนวณวัน/เดือน ตามรอบ Cut-off 04:00 น.
    // ----------------------------------------------------
    const opDate = getOperationalDate();
    const month = opDate.getMonth();
    const year = opDate.getFullYear();
    const todayDay = opDate.getDate(); // ได้วันที่ของเมื่อวาน หากยังไม่ถึง 04.00 น.

    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const currentDay = selectedDay ? parseInt(selectedDay, 10) : Math.min(todayDay, totalDaysInMonth);
    const colIdx = 5 + currentDay;

    const nonVJKeywords = ['trainee', 'mc', 'hr', 'resigned', 'staff', 'ลาออก', 'ผู้ดูแล', 'total', 'รวม'];

    const vjList = [];
    const teamMap = {};
    let totalDailyDiamonds = 0;
    let totalMonthlyDiamonds = 0;

    rows.forEach(row => {
      const team = String(row[0] || 'ไม่ระบุทีม').trim();
      const memberName = String(row[4] || '').trim();
      const rawStatus = String(statusOverrides?.memberWorking?.[memberName] || row[2] || '').trim().toLowerCase();

      if (!team || !memberName) return;
      const teamLower = team.toLowerCase();
      const nameLower = memberName.toLowerCase();

      for (const kw of nonVJKeywords) {
        if (rawStatus.includes(kw) || nameLower.includes(kw) || teamLower.includes(kw)) {
          return;
        }
      }

      const dailyDiamonds = parseFloat(String(row[colIdx] || '0').replace(/,/g, '')) || 0;
      let monthlyDiamonds = parseFloat(String(row[5] || '0').replace(/,/g, '')) || 0;

      if (isNaN(monthlyDiamonds) || monthlyDiamonds === 0) {
        for (let d = 1; d <= totalDaysInMonth; d++) {
          const cIdx = 5 + d;
          monthlyDiamonds += parseFloat(String(row[cIdx] || '0').replace(/,/g, '')) || 0;
        }
      }

      let teamLogoImg = teamLogoMap[team] || '';
      if (!teamLogoImg) {
        teamLogoImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(team)}&background=312e81&color=c7d2fe&bold=true`;
      }

      if (!teamMap[team]) {
        teamMap[team] = {
          teamName: team,
          teamLogo: teamLogoImg,
          dailyDiamonds: 0,
          monthlyDiamonds: 0,
          vjCount: 0,
          liveTime: teamLiveSchedules[team] || '18:00 - 02:00'
        };
      }
      teamMap[team].dailyDiamonds += dailyDiamonds;
      teamMap[team].monthlyDiamonds += monthlyDiamonds;
      teamMap[team].vjCount += 1;

      let profileImg = avatarMap[memberName] || vjProfiles[memberName] || '';
      if (!profileImg) {
        profileImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&background=1e1b4b&color=818cf8&bold=true`;
      }

      const liveTime = teamLiveSchedules[team] || '18:00 - 02:00';
      const monthlyTarget = parseFloat(kpiTargets[memberName]) || 0;
      const dailyTarget = monthlyTarget > 0 ? (monthlyTarget / totalDaysInMonth) : 0;

      const monthlyAchievedRate = monthlyTarget > 0 ? (monthlyDiamonds / monthlyTarget) * 100 : 0;
      const dailyAchievedRate = dailyTarget > 0 ? (dailyDiamonds / dailyTarget) * 100 : 0;

      totalDailyDiamonds += dailyDiamonds;
      totalMonthlyDiamonds += monthlyDiamonds;

      vjList.push({
        vjName: memberName,
        teamName: team,
        teamLogo: teamLogoImg,
        liveTime: liveTime,
        avatar: profileImg,
        dailyDiamonds: dailyDiamonds,
        monthlyDiamonds: monthlyDiamonds,
        monthlyTarget: monthlyTarget,
        dailyTarget: dailyTarget,
        monthlyAchievedRate: Math.round(monthlyAchievedRate * 10) / 10,
        dailyAchievedRate: Math.round(dailyAchievedRate * 10) / 10
      });
    });

    const dailyLeaderboard = [...vjList].sort((a, b) => b.dailyDiamonds - a.dailyDiamonds);
    dailyLeaderboard.forEach((v, idx) => v.dailyRank = idx + 1);

    const monthlyLeaderboard = [...vjList].sort((a, b) => b.monthlyDiamonds - a.monthlyDiamonds);
    monthlyLeaderboard.forEach((v, idx) => v.monthlyRank = idx + 1);

    const teamList = Object.values(teamMap);

    const dailyTeamLeaderboard = [...teamList].sort((a, b) => b.dailyDiamonds - a.dailyDiamonds);
    dailyTeamLeaderboard.forEach((t, idx) => t.dailyRank = idx + 1);

    const monthlyTeamLeaderboard = [...teamList].sort((a, b) => b.monthlyDiamonds - a.monthlyDiamonds);
    monthlyTeamLeaderboard.forEach((t, idx) => t.monthlyRank = idx + 1);

    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

    return {
      success: true,
      timestamp: timestamp,
      sheetName: sheetName,
      month: month,
      year: year,
      currentDay: currentDay,
      totalDaysInMonth: totalDaysInMonth,
      totalDailyDiamonds: totalDailyDiamonds,
      totalMonthlyDiamonds: totalMonthlyDiamonds,
      vjCount: vjList.length,
      teamCount: teamList.length,
      topDailyVJ: dailyLeaderboard.length > 0 ? dailyLeaderboard[0] : null,
      topMonthlyVJ: monthlyLeaderboard.length > 0 ? monthlyLeaderboard[0] : null,
      dailyLeaderboard: dailyLeaderboard,
      monthlyLeaderboard: monthlyLeaderboard,
      dailyTeamLeaderboard: dailyTeamLeaderboard,
      monthlyTeamLeaderboard: monthlyTeamLeaderboard
    };

  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
// ----------------------------------------------------
// Helper Functions เดิมของระบบ ACE Tracking
// ----------------------------------------------------
function translateText(text, targetLang) {
  try {
    if (!text || text.trim() === '') return { success: true, translatedText: '' };
    const target = targetLang === 'zh' ? 'zh-CN' : targetLang;
    const translatedText = LanguageApp.translate(text, '', target);
    return { success: true, translatedText: translatedText };
  } catch (error) {
    return { success: false, error: error.toString(), originalText: text };
  }
}

function getSheetList() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    const excludeList = ['system_logs', 'admin_users', 'status_overrides', 'team data', 'team_data', 'vj mc all', 'kpi_targets', 'kpi_data'];
    const sheetNames = sheets
      .map(s => s.getName())
      .filter(name => !excludeList.includes(name.toLowerCase().trim()));
    return { success: true, sheetNames: sheetNames };
  } catch (error) {
    return { success: false, error: error.message || error.toString() };
  }
}

function getVJProfilesMap() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('vj mc all') || ss.getSheetByName('VJ MC ALL') || ss.getSheetByName('vj_mc_all');
    if (!sheet) return {};

    const data = sheet.getDataRange().getValues();
    const profiles = {};

    for (let i = 1; i < data.length; i++) {
      const vjName = String(data[i][1] || '').trim();
      const tiktokVal = String(data[i][7] || '').trim();

      if (vjName && tiktokVal) {
        let imgUrl = tiktokVal;
        if (!imgUrl.startsWith('http')) {
          const cleanId = tiktokVal.replace('@', '').trim();
          imgUrl = `https://unavatar.io/tiktok/${cleanId}`;
        }
        profiles[vjName] = imgUrl;
      }
    }
    return profiles;
  } catch (e) {
    return {};
  }
}

function getTeamDataSchedules() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Team Data') || ss.getSheetByName('team data') || ss.getSheetByName('Team_Data');
    if (!sheet) return {};

    const data = sheet.getDataRange().getValues();
    const schedules = {};

    for (let i = 1; i < data.length; i++) {
      const teamName = String(data[i][0] || '').trim();
      const liveTimeStr = String(data[i][4] || '').trim();

      if (teamName) {
        schedules[teamName] = liveTimeStr;
      }
    }
    return schedules;
  } catch (e) {
    return {};
  }
}

function parseMonthYearFromSheetName(sheetName) {
  if (!sheetName) return null;
  const nameLower = String(sheetName).toLowerCase().trim();

  const monthsMap = {
    'january': 0, 'jan': 0, 'มกราคม': 0, 'ม.ค.': 0,
    'february': 1, 'feb': 1, 'กุมภาพันธ์': 1, 'ก.พ.': 1,
    'march': 2, 'mar': 2, 'มีนาคม': 2, 'มี.ค.': 2,
    'april': 3, 'apr': 3, 'เมษายน': 3, 'เม.ย.': 3,
    'may': 4, 'พฤษภาคม': 4, 'พ.ค.': 4,
    'june': 5, 'jun': 5, 'มิถุนายน': 5, 'มิ.ย.': 5,
    'july': 6, 'jul': 6, 'กรกฎาคม': 6, 'ก.ค.': 6,
    'august': 7, 'aug': 7, 'สิงหาคม': 7, 'ส.ค.': 7,
    'september': 8, 'sep': 8, 'กันยายน': 8, 'ก.ย.': 8,
    'october': 9, 'oct': 9, 'ตุลาคม': 9, 'ต.ค.': 9,
    'november': 10, 'nov': 10, 'พฤศจิกายน': 10, 'พ.ย.': 10,
    'december': 11, 'dec': 11, 'ธันวาคม': 11, 'ธ.ค.': 11
  };

  let foundMonth = null;
  let foundYear = null;

  const yearMatch = nameLower.match(/\b(20\d\d)\b/);
  if (yearMatch) {
    foundYear = parseInt(yearMatch[1], 10);
  }

  for (const [key, val] of Object.entries(monthsMap)) {
    if (nameLower.includes(key)) {
      foundMonth = val;
      break;
    }
  }

  // หากไม่เจอชื่อเดือน ให้ตัดทิ้งทันที
  if (foundMonth === null) return null;
  if (foundYear === null) foundYear = new Date().getFullYear();

  return { month: foundMonth, year: foundYear };
}

function initKPITargetsSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('KPI_Targets');
  if (!sheet) {
    sheet = ss.insertSheet('KPI_Targets');
    sheet.appendRow(['VJ_Name', 'Target_Diamond', 'UpdatedBy', 'UpdatedAt']);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#4f46e5').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getKPITargetsMap() {
  try {
    const sheet = initKPITargetsSheet_();
    const data = sheet.getDataRange().getValues();
    const targetsMap = {};

    for (let i = 1; i < data.length; i++) {
      const vjName = String(data[i][0] || '').trim();
      const targetVal = parseFloat(data[i][1]);
      if (vjName && !isNaN(targetVal)) {
        targetsMap[vjName] = targetVal;
      }
    }
    return targetsMap;
  } catch (e) {
    return {};
  }
}

function getDataFromSheet(targetSheetName) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = targetSheetName ? ss.getSheetByName(targetSheetName) : ss.getSheets()[0];
    if (!sheet) sheet = ss.getSheets()[0];

    const activeSheetName = sheet.getName();
    const data = sheet.getDataRange().getValues();
    const vjProfilesMap = getVJProfilesMap();
    const statusOverrides = getStatusOverrides();
    const teamLiveSchedules = getTeamDataSchedules();
    const kpiTargetsMap = getKPITargetsMap(activeSheetName);

    if (!data || data.length < 2) {
      return {
        success: true,
        sheetName: activeSheetName,
        headers: [], rows: [], activeIndices: [], sheetDiamondTotal: 0,
        vjProfiles: vjProfilesMap, statusOverrides: statusOverrides,
        teamLiveSchedules: teamLiveSchedules, kpiTargets: kpiTargetsMap,
        month: new Date().getMonth(), year: new Date().getFullYear(), todayDay: new Date().getDate()
      };
    }

    const { month, year } = parseMonthYearFromSheetName(activeSheetName);
    let startRowIndex = 1;
    if (data.length > 2 && String(data[1][6]).toLowerCase().match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday|จันทร์|อังคาร|พุธ|พฤหัส|ศุกร์|เสาร์|อาทิตย์)/i)) {
      startRowIndex = 2;
    }

    const rawHeaders = data[0].map((h, i) => {
      let title = String(h).trim();
      if (!title && startRowIndex > 1 && data[1][i]) title = String(data[1][i]).trim();
      return title;
    });

    const rawRows = data.slice(startRowIndex);
    let extractedDiamondTotal = 0;
    const memberRows = [];
    let currentTeam = 'ไม่ระบุทีม';

    rawRows.forEach((row) => {
      const colA = String(row[0] || '').trim();
      if (colA !== '' && !colA.toLowerCase().includes('total')) {
        currentTeam = colA;
      } else if (currentTeam !== '') {
        row[0] = currentTeam;
      }

      const memberName = String(row[4] || '').trim();
      const lowerName = memberName.toLowerCase();
      const isBlankOrTotalRow = !memberName || lowerName.includes('total') || lowerName.includes('รวม');

      if (!isBlankOrTotalRow) {
        const cleanedRow = row.map(cell => {
          if (cell instanceof Date) return Utilities.formatDate(cell, Session.getScriptTimeZone(), 'yyyy-MM-dd');
          const strVal = String(cell === null || cell === undefined ? '' : cell).trim();
          return strVal === '-' ? '' : strVal;
        });
        memberRows.push(cleanedRow);
      }
    });

    return {
      success: true,
      sheetName: activeSheetName,
      headers: rawHeaders,
      rows: memberRows,
      sheetDiamondTotal: extractedDiamondTotal,
      vjProfiles: vjProfilesMap,
      statusOverrides: statusOverrides,
      teamLiveSchedules: teamLiveSchedules,
      kpiTargets: kpiTargetsMap,
      month: month,
      year: year,
      todayDay: new Date().getDate()
    };
  } catch (error) {
    return { success: false, error: error.message || error.toString() };
  }
}

function getStatusOverrides() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Status_Overrides');
    if (!sheet) return { memberWorking: {}, memberLive: {}, teamStatus: {} };

    const data = sheet.getDataRange().getValues();
    const overrides = { memberWorking: {}, memberLive: {}, teamStatus: {} };

    for (let i = 1; i < data.length; i++) {
      const type = String(data[i][0] || '').trim();
      const target = String(data[i][1] || '').trim();
      const val = String(data[i][2] || '').trim();

      if (type === 'MEMBER_WORKING') overrides.memberWorking[target] = val;
      else if (type === 'MEMBER_LIVE') overrides.memberLive[target] = val;
      else if (type === 'TEAM_STATUS') overrides.teamStatus[target] = val;
    }
    return overrides;
  } catch (e) {
    return { memberWorking: {}, memberLive: {}, teamStatus: {} };
  }
}

function getVJAvatarMap() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets().find(s => s.getName().trim().toLowerCase() === 'vjmc all' || s.getName().trim().toLowerCase() === 'vj mc all');
  const avatarMap = {};
  if (!sheet) return avatarMap;

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return avatarMap;

  const headers = data[0].map(h => String(h).trim().toLowerCase());
  let nameColIdx = headers.findIndex(h => h.includes('vj') || h.includes('name') || h.includes('ชื่อ'));
  if (nameColIdx === -1) nameColIdx = 1;

  let imgColIdx = headers.findIndex(h => h.includes('pic') || h.includes('photo') || h.includes('image') || h.includes('รูป') || h.includes('url') || h.includes('avatar') || h.includes('tiktok'));
  if (imgColIdx === -1) imgColIdx = 7;

  for (let i = 1; i < data.length; i++) {
    const vjName = String(data[i][nameColIdx]).trim();
    let imgUrl = String(data[i][imgColIdx]).trim();
    if (vjName && imgUrl) {
      if (!imgUrl.startsWith('http')) {
        const cleanId = imgUrl.replace('@', '').trim();
        imgUrl = `https://unavatar.io/tiktok/${cleanId}`;
      }
      avatarMap[vjName] = imgUrl;
    }
  }
  return avatarMap;
}

function getMonthlySheetNames() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  const monthlySheets = [];
  sheets.forEach(sheet => {
    const name = sheet.getName();
    if (/^\d{4}-\d{2}$/.test(name) || name.toLowerCase().includes('202') || name.toLowerCase().includes('203')) {
      monthlySheets.push(name);
    }
  });
  return monthlySheets.length > 0 ? monthlySheets : [ss.getActiveSheet().getName()];
}

function calculateMCBonus(dailyScore) {
  const score = parseFloat(dailyScore) || 0;
  if (score < 60000) {
    return {
      bonusAmount: 0,
      tierStep: 0,
      tierLabel: 'Tier 0 (< 60,000 💎)',
      nextTierDiff: 60000 - score
    };
  }

  const tierStep = Math.floor(score / 60000);
  const bonusAmount = tierStep * 150;
  const minBound = tierStep * 60000;
  const maxBound = (tierStep + 1) * 60000 - 1;
  const nextTierDiff = (tierStep + 1) * 60000 - score;

  return {
    bonusAmount: bonusAmount,
    tierStep: tierStep,
    tierLabel: `Tier ${tierStep} (${minBound.toLocaleString()} - ${maxBound.toLocaleString()} 💎)`,
    nextTierDiff: nextTierDiff
  };
}


/**
 * ===================================================
 * 1. ฟังก์ชันตั้งเวลาทำงานอัตโนมัติ (Time-driven Trigger Setup)
 * (รันฟังก์ชันนี้ใน Apps Script เพียง 1 ครั้งเพื่อเปิดใช้งาน)
 * ===================================================
 */
function setupDailyResetTrigger() {
  // ลบ Trigger เดิมที่อาจมีอยู่ เพื่อป้องกันการรันซ้ำซ้อน
  const allTriggers = ScriptApp.getProjectTriggers();
  allTriggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'autoResetDailyData') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // สร้าง Trigger ใหม่ให้รันทุกวัน ช่วงเวลา 04:00 - 05:00 น.
  ScriptApp.newTrigger('autoResetDailyData')
    .timeBased()
    .atHour(4)
    .everyDays(1)
    .inTimezone(Session.getScriptTimeZone())
    .create();

  Logger.log('ตั้งเวลา Reset ข้อมูลประจำวันทุกๆ 04.00 น. เรียบร้อยแล้ว');
}

/**
 * ===================================================
 * 2. ฟังก์ชันประมวลผลการ Reset ข้อมูลประจำวัน
 * (จะถูกเรียกทำงานอัตโนมัติทุกวัน ตอน 04:00 น.)
 * ===================================================
 */
function autoResetDailyData(event) {
  const triggerId = event && event.triggerUid ? String(event.triggerUid) : '';
  if (!triggerId || !ScriptApp.getProjectTriggers().some(trigger => String(trigger.getUniqueId()) === triggerId)) {
    throw new Error('ฟังก์ชันนี้ใช้ได้เฉพาะ Trigger ที่ติดตั้งไว้');
  }
  return autoResetDailyData_();
}

function autoResetDailyData_() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. ล้างข้อมูลการเปลี่ยนสถานะชั่วคราวรายวัน (ถ้ามีแผ่นงาน status_overrides)
    const statusSheet = ss.getSheetByName('status_overrides');
    if (statusSheet && statusSheet.getLastRow() > 1) {
      // ล้างข้อมูลตั้งแต่แถวที่ 2 เป็นต้นไป (เว้น Header)
      statusSheet.getRange(2, 1, statusSheet.getLastRow() - 1, statusSheet.getLastColumn()).clearContent();
    }

    // 2. ล้างหน่วยความจำ Cache ของ Script เพื่อให้ดึงข้อมูลใหม่สดเสมอ
    const cache = CacheService.getScriptCache();
    cache.removeAll(['tv_dashboard_data', 'daily_rank_cache']);

    // 3. บันทึก ประวัติการ Reset ลงในแผ่นงาน system_logs
    logSystemEvent_(ss, 'ระบบทำการ Reset ข้อมูลประจำวันอัตโนมัติเรียบร้อยแล้ว (04:00 AM)');

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการ Reset ข้อมูลประจำวัน:', error);
  }
}

/**
 * ฟังก์ชันบันทึก Log การทำงานของระบบ
 */
function logSystemEvent_(ss, message) {
  let logSheet = ss.getSheetByName('system_logs');
  if (!logSheet) {
    logSheet = ss.insertSheet('system_logs');
    logSheet.appendRow(['Timestamp', 'Event Log']);
  }
  logSheet.appendRow([new Date(), message]);
}


/**
 * คำนวณวันที่ตามรอบเวลาทำงาน (ตัดรอบ 04:00 น.)
 * ถ้าเป็นเวลา 00:00 - 03:59 น. จะคืนค่าเป็นวันที่ของเมื่อวาน
 */
function getOperationalDate() {
  const now = new Date();
  if (now.getHours() < 4) {
    now.setDate(now.getDate() - 1);
  }
  return now;
}




/**
 * ====================================================================
 * VJ & Team KPI Management System - Backend Engine (Code.gs)
 * ====================================================================
 */

// function doGet(e) {
//   const action = e && e.parameter && e.parameter.action;
  
//   if (action === 'getKPIData') {
//     const sheetName = e.parameter.sheetName || '';
//     const data = getKPIDashboardData(sheetName);
//     return ContentService.createTextOutput(JSON.stringify(data))
//       .setMimeType(ContentService.MimeType.JSON);
//   }

//   return HtmlService.createTemplateFromFile('kpi_vj_data')
//     .evaluate()
//     .setTitle('VJ & Team KPI Dashboard')
//     .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
//     .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
// }

function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('รูปแบบคำขอไม่ถูกต้อง');
    const result = saveKPISettings(payload, payload.sessionToken);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message || 'ไม่สามารถดำเนินการได้' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * ดึงข้อมูล Dashboard KPI ทั้งระดับทีมและ VJ รายบุคคล
 */
function getKPIDashboardData(targetSheetName) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = targetSheetName ? ss.getSheetByName(targetSheetName) : ss.getSheets()[0];
    if (!sheet) sheet = ss.getSheets()[0];

    const activeSheetName = sheet.getName();
    const rawData = sheet.getDataRange().getValues();
    const profilesMap = getVJProfilesMap();
    const kpiTargetsMap = getKPITargetsMap(activeSheetName);

    if (!rawData || rawData.length < 2) {
      return { success: true, sheetName: activeSheetName, teamSummary: {}, vjList: [], monthList: getMonthlySheets() };
    }

    let startRowIndex = 1;
    if (rawData.length > 2 && String(rawData[1][6]).toLowerCase().match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday|จันทร์|อังคาร|พุธ|พฤหัส|ศุกร์|เสาร์|อาทิตย์)/i)) {
      startRowIndex = 2;
    }

    const rawRows = rawData.slice(startRowIndex);
    const vjList = [];
    let currentTeam = 'ไม่ระบุทีม';

    rawRows.forEach((row) => {
      const colA = String(row[0] || '').trim();
      if (colA !== '' && !colA.toLowerCase().includes('total') && !colA.toLowerCase().includes('รวม')) {
        currentTeam = colA;
      }

      const memberName = String(row[4] || '').trim();
      const lowerName = memberName.toLowerCase();
      const isInvalidRow = !memberName || lowerName.includes('total') || lowerName.includes('รวม') || lowerName.includes('trainee') || lowerName.includes('hr');

      if (!isInvalidRow) {
        // ดึงยอดรายวัน (Day 1 ถึง Day 31) ดัชนีคอลัมน์ 6 ถึง 36
        const dailyScores = [];
        let monthlyCurrent = 0;

        for (let d = 1; d <= 31; d++) {
          const colIdx = 5 + d;
          const score = parseFloat(String(row[colIdx] || '0').replace(/,/g, '')) || 0;
          dailyScores.push(score);
          monthlyCurrent += score;
        }

        const vjTarget = parseFloat(kpiTargetsMap[memberName]) || 0;
        const progressPct = vjTarget > 0 ? (monthlyCurrent / vjTarget) * 100 : 0;
        const remainingDeficit = Math.max(0, vjTarget - monthlyCurrent);
        const avatarUrl = profilesMap[memberName] || `https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&background=6366f1&color=fff`;

        vjList.push({
          vjId: String(row[3] || memberName).trim(),
          name: memberName,
          team: currentTeam,
          avatar: avatarUrl,
          target: vjTarget,
          current: monthlyCurrent,
          progress: Math.min(100, Math.round(progressPct * 10) / 10),
          realProgress: Math.round(progressPct * 10) / 10,
          remaining: remainingDeficit,
          daily: dailyScores
        });
      }
    });

    // คำนวณภาพรวมระดับทีม (Executive Summary)
    const totalTeamTarget = vjList.reduce((sum, v) => sum + v.target, 0);
    const totalTeamCurrent = vjList.reduce((sum, v) => sum + v.current, 0);
    const teamProgress = totalTeamTarget > 0 ? (totalTeamCurrent / totalTeamTarget) * 100 : 0;
    const teamRemaining = Math.max(0, totalTeamTarget - totalTeamCurrent);

    return {
      success: true,
      sheetName: activeSheetName,
      monthList: getMonthlySheets(),
      executiveSummary: {
        totalTarget: totalTeamTarget,
        totalCurrent: totalTeamCurrent,
        progressPct: Math.round(teamProgress * 10) / 10,
        remainingDeficit: teamRemaining,
        totalVJs: vjList.length
      },
      vjList: vjList,
      lastUpdated: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss')
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * บันทึกการตั้งค่า KPI ( Auto Mode / Manual Mode )
 */
/**
 * บันทึกการตั้งค่า KPI ลงใน Google Sheets (สร้าง/อัปเดตใน Tab 'KPI_Targets' อัตโนมัติ)
 */
function saveKPISettings(payload, sessionToken) {
  try {
    const session = requireAdminSession_(sessionToken || payload.sessionToken);
    const normalizedPayload = Object.assign({}, payload);
    if (payload.action === 'saveKPI') {
      const targetMap = payload.kpiData && typeof payload.kpiData === 'object' && !Array.isArray(payload.kpiData) ? payload.kpiData : {};
      normalizedPayload.mode = 'Manual';
      normalizedPayload.vjTargets = Object.keys(targetMap).map(name => ({ name: name, target: targetMap[name] }));
    } else if (payload.action === 'preloadVJList') {
      if (!Array.isArray(payload.vjList)) return { success: false, error: 'รายการ VJ ไม่ถูกต้อง' };
      const targetSheetForCheck = initKPITargetsSheet_();
      const existingRows = targetSheetForCheck.getDataRange().getValues();
      const existing = new Set(existingRows.slice(1).filter(row => !row[4] || String(row[4]).trim() === String(payload.sheetName || '').trim()).map(row => String(row[0] || '').trim().toLowerCase()));
      const defaultTarget = Number(payload.defaultTarget);
      if (!Number.isFinite(defaultTarget) || defaultTarget < 0) return { success: false, error: 'ค่าเป้าหมายเริ่มต้นไม่ถูกต้อง' };
      normalizedPayload.mode = 'Manual';
      normalizedPayload.vjTargets = [...new Set(payload.vjList.map(name => String(name || '').trim()).filter(Boolean))]
        .filter(name => !existing.has(name.toLowerCase()))
        .map(name => ({ name: name, target: defaultTarget }));
    }

    const { sheetName, mode, teamName, teamTarget, vjTargets, adminUser } = normalizedPayload;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!sheetName || !ss.getSheetByName(String(sheetName).trim())) return { success: false, error: 'ไม่พบชีตเดือนที่เลือก' };
    
    // 1. เรียกใช้หรือสร้าง Sheet ชื่อ 'KPI_Targets' สำหรับเก็บข้อมูลเป้าหมาย
    const targetSheet = initKPITargetsSheet_();
    const data = targetSheet.getDataRange().getValues();
    const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    const user = session.displayName;

    let updates = [];

    // 2. คำนวณเป้าหมายตามโหมดที่เลือก (Auto หรือ Manual)
    if (mode === 'Auto') {
      const requestedTarget = Number(teamTarget);
      if (!Number.isFinite(requestedTarget) || requestedTarget < 0) return { success: false, error: 'เป้าหมายทีมไม่ถูกต้อง' };
      const dashboardData = getKPIDashboardData(sheetName);
      const teamVJs = dashboardData.vjList.filter(v => v.team === teamName || teamName === 'ALL');
      if (teamVJs.length === 0) return { success: false, error: 'ไม่พบรายชื่อ VJ ในทีมที่ระบุ' };

      const perVJTarget = Math.round(requestedTarget / teamVJs.length);

      teamVJs.forEach(vj => {
        updates.push({ name: vj.name, target: perVJTarget });
      });
    } else if (mode === 'Manual' && Array.isArray(vjTargets)) {
      if (vjTargets.length > 1000) return { success: false, error: 'จำนวนรายการเกินขีดจำกัด' };
      updates = vjTargets.map(item => {
        const name = String(item && item.name || '').trim();
        const target = Number(item && item.target);
        if (!name || !Number.isFinite(target) || target < 0) throw new Error('ชื่อ VJ หรือเป้าหมาย KPI ไม่ถูกต้อง');
        return { name: name, target: target };
      });
    }

    if (!updates.length) return { success: false, error: 'ไม่มีรายการ KPI ที่ต้องบันทึก', updatedCount: 0 };

    // 3. บันทึก / อัปเดตข้อมูลลงใน Sheet 'KPI_Targets'
    updates.forEach(u => {
      let foundIndex = -1;
      for (let i = 1; i < data.length; i++) {
        const rowVJName = String(data[i][0] || '').trim().toLowerCase();
        const rowMonth = String(data[i][4] || '').trim();
        
        // ค้นหารายชื่อ VJ และเดือนที่ตรงกัน
        if (rowVJName === u.name.toLowerCase() && rowMonth === (sheetName || '')) {
          foundIndex = i + 1; // บรรทัดใน Sheet (Index 1-based)
          break;
        }
      }

      if (foundIndex > 0) {
        // หากมีรายชื่อเดิมอยู่แล้ว ให้ทำการอัปเดต Target, ผู้แก้ไข และเวลา
        targetSheet.getRange(foundIndex, 2, 1, 3).setValues([[u.target, user, now]]);
      } else {
        // หากเป็น VJ หรือเดือนใหม่ให้เพิ่มแถวใหม่ (Append Row)
        targetSheet.appendRow([u.name, u.target, user, now, sheetName || '']);
      }
    });

    // 4. (เสริม) หากต้องการบันทึกเป้าหมายลงในคอลัมน์ Target ของ Sheet ประจำเดือนโดยตรง
    const monthSheet = ss.getSheetByName(sheetName);
    if (monthSheet) {
      const monthData = monthSheet.getDataRange().getValues();
      const updatesMap = {};
      updates.forEach(u => { updatesMap[u.name.toLowerCase()] = u.target; });

      for (let r = 0; r < monthData.length; r++) {
        const vjNameInSheet = String(monthData[r][4] || '').trim().toLowerCase(); // คอลัมน์ E (VJ Name)
        if (vjNameInSheet && updatesMap.hasOwnProperty(vjNameInSheet)) {
          // ตัวอย่าง: หากต้องการเขียน Target ลงคอลัมน์ B (Index 2) ของแผ่นงานประจำเดือน
          // monthSheet.getRange(r + 1, 2).setValue(updatesMap[vjNameInSheet]);
        }
      }
    }

    return { 
      success: true, 
      message: 'บันทึกเป้าหมาย KPI ลงใน Google Sheets เรียบร้อยแล้ว', 
      updatedCount: updates.length 
    };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function initKPITargetsSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('KPI_Targets');
  if (!sheet) {
    sheet = ss.insertSheet('KPI_Targets');
    sheet.appendRow(['VJ_Name', 'Target_Diamond', 'UpdatedBy', 'UpdatedAt', 'Month_Sheet']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#4f46e5').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function normalizeKpiMonthKey_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'MMMM yyyy').toUpperCase();
  }
  return String(value || '').trim().replace(/\s+/g, ' ').toUpperCase();
}

function getKPITargetsMap(sheetName) {
  try {
    const sheet = initKPITargetsSheet_();
    const data = sheet.getDataRange().getValues();
    const defaultTargets = {};
    const monthTargets = {};
    const targetMonth = normalizeKpiMonthKey_(sheetName);

    for (let i = 1; i < data.length; i++) {
      const vjName = String(data[i][0] || '').trim();
      const targetVal = parseFloat(String(data[i][1] == null ? '' : data[i][1]).replace(/,/g, ''));
      const monthRef = normalizeKpiMonthKey_(data[i][4]);

      if (vjName && !isNaN(targetVal)) {
        if (monthRef && targetMonth && monthRef === targetMonth) monthTargets[vjName] = targetVal;
        else if (!monthRef) defaultTargets[vjName] = targetVal;
      }
    }
    return Object.assign(defaultTargets, monthTargets);
  } catch (e) {
    return {};
  }
}

function getVJProfilesMap() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('vj mc all') || ss.getSheetByName('VJ MC ALL') || ss.getSheetByName('VJ_Profiles');
    if (!sheet) return {};

    const data = sheet.getDataRange().getValues();
    const profiles = {};

    for (let i = 1; i < data.length; i++) {
      const vjName = String(data[i][1] || data[i][0] || '').trim();
      const avatarVal = String(data[i][7] || data[i][2] || '').trim();

      if (vjName && avatarVal) {
        let imgUrl = avatarVal;
        if (!imgUrl.startsWith('http')) {
          const cleanId = avatarVal.replace('@', '').trim();
          imgUrl = `https://unavatar.io/tiktok/${cleanId}`;
        }
        profiles[vjName] = imgUrl;
      }
    }
    return profiles;
  } catch (e) {
    return {};
  }
}

function getMonthlySheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheets()
    .map(s => s.getName())
    .filter(name => name.toUpperCase().includes('202') || name.toUpperCase().includes('203') || name.match(/^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)/i));
}







/**
 * ===================================================
 * ACE Tracking Extension: Daily VJ Bonus & Monthly Summary
 * ===================================================
 */

/**
 * 1. ฟังก์ชันคำนวณ Tier โบนัส VJ รายวัน (Daily Tier Calculation)
 * - ยอด < 30,000 💎 = 0 บาท
 * - ยอดทุกๆ 30,000 💎 = โบนัส 300 บาท (Math.floor(diamonds / 30000) * 300)
 */
function calculateVJBountyTier(diamonds) {
  const score = parseFloat(diamonds) || 0;
  if (score < 30000) {
    return {
      tierLevel: 0,
      tierText: 'Tier 0 (< 30,000 💎)',
      bonusBaht: 0,
      neededNextTier: 30000 - score,
      isQualifying: false
    };
  }

  const tierLevel = Math.floor(score / 30000);
  const minTier = tierLevel * 30000;
  const maxTier = (tierLevel + 1) * 30000 - 1;
  const bonus = tierLevel * 300;
  const needed = ((tierLevel + 1) * 30000) - score;

  return {
    tierLevel: tierLevel,
    tierText: `Tier ${tierLevel} (${minTier.toLocaleString()} - ${maxTier.toLocaleString()} 💎)`,
    bonusBaht: bonus,
    neededNextTier: needed,
    isQualifying: true
  };
}

/**
 * 2. ฟังก์ชันดึงรูปโปรไฟล์ VJ จากชีต 'vj mc all'
 * หากไม่มีรูปในระบบ จะสร้าง Fallback UI Avatar ให้อัตโนมัติ
 */
function getVJAvatarMap() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets().find(s => ['vj mc all', 'vj_mc_all', 'vjmc all'].includes(s.getName().trim().toLowerCase()));
    const avatarMap = {};
    if (!sheet) return avatarMap;

    const data = sheet.getDataRange().getValues();
    if (data.length < 2) return avatarMap;

    const headers = data[0].map(h => String(h).trim().toLowerCase());
    
    // ค้นหาคอลัมน์ชื่อ VJ
    let nameColIdx = headers.findIndex(h => h.includes('vj') || h.includes('name') || h.includes('ชื่อ'));
    if (nameColIdx === -1) nameColIdx = 1;

    // ค้นหาคอลัมน์รูปภาพ/TikTok
    let imgColIdx = headers.findIndex(h => 
      h.includes('tiktok') || h.includes('pic') || h.includes('photo') || 
      h.includes('image') || h.includes('รูป') || h.includes('url') || 
      h.includes('avatar') || h.includes('profile')
    );
    if (imgColIdx === -1) imgColIdx = 7;

    for (let i = 1; i < data.length; i++) {
      const vjName = String(data[i][nameColIdx] || '').trim();
      const rawVal = String(data[i][imgColIdx] || '').trim();

      if (vjName) {
        let imgUrl = '';
        if (rawVal) {
          if (rawVal.startsWith('http://') || rawVal.startsWith('https://')) {
            imgUrl = rawVal;
          } else {
            const cleanId = rawVal.replace('@', '').trim();
            imgUrl = `https://unavatar.io/tiktok/${cleanId}`;
          }
        }
        
        // ถ้าไม่มี URL รูป ให้สร้าง Fallback UI Avatar
        if (!imgUrl) {
          imgUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(vjName)}&background=6366f1&color=ffffff&bold=true&size=128`;
        }
        
        avatarMap[vjName] = imgUrl;
      }
    }
    return avatarMap;
  } catch (e) {
    return {};
  }
}

/**
 * 3. ฟังก์ชันดึงและประมวลผลข้อมูล VJ Bonus รายวัน และสรุปผลสะสมรายเดือน
 * @param {string} sheetName - ชื่อชีตประจำเดือน (เช่น AUGUST 2026 หรือ 2026-08)
 * @param {string} selectedDateStr - วันที่เลือก (รูปแบบ YYYY-MM-DD หรือตัวเลขวันที่ 1-31)
 */
function getVJBonusPayload(sheetName, selectedDateStr) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const activeSheet = sheetName ? ss.getSheetByName(sheetName) : ss.getSheets()[0];
    
    if (!activeSheet) {
      return { success: false, error: 'ไม่พบแผ่นงานชื่อ: ' + sheetName };
    }

    const data = activeSheet.getDataRange().getValues();
    if (data.length < 3) {
      return { success: false, error: 'ไม่มีข้อมูลในแผ่นงาน' };
    }

    // แปลงระบุวันที่ (targetDay)
    let targetDay = new Date().getDate();
    if (selectedDateStr) {
      if (selectedDateStr.includes('-')) {
        const parts = selectedDateStr.split('-');
        targetDay = parseInt(parts[2], 10);
      } else {
        targetDay = parseInt(selectedDateStr, 10);
      }
    }

    const avatarMap = getVJAvatarMap();
    const nonVJKeywords = ['trainee', 'mc', 'hr', 'resigned', 'staff', 'ลาออก', 'ผู้ดูแล', 'total', 'รวม'];

    // ค้นหา Map คอลัมน์วันที่ (1..31)
    let dayColMap = {};
    let headerRowIdx = -1;

    for (let r = 0; r < Math.min(5, data.length); r++) {
      for (let c = 6; c < data[r].length; c++) {
        const val = parseInt(data[r][c], 10);
        if (!isNaN(val) && val >= 1 && val <= 31) {
          dayColMap[val] = c;
          headerRowIdx = r;
        }
      }
      if (Object.keys(dayColMap).length > 0) break;
    }

    // สำรองหากหา Header ไม่พบ
    if (Object.keys(dayColMap).length === 0) {
      for (let d = 1; d <= 31; d++) {
        dayColMap[d] = 5 + d; // Day 1 = Col G (index 6)
      }
      headerRowIdx = 0;
    }

    const targetColIdx = dayColMap[targetDay];
    const dailyVJList = [];
    const monthlyVJSummaryList = [];

    let currentTeam = 'ไม่ระบุทีม';

    let totalDailyDiamonds = 0;
    let totalDailyBonus = 0;
    let totalQualifyingVJsToday = 0;
    let totalMonthlyBonusAllVJ = 0;

    for (let r = headerRowIdx + 1; r < data.length; r++) {
      const row = data[r];
      if (!row || row.length === 0) continue;

      const rawTeam = String(row[0] || '').trim();
      if (rawTeam && !rawTeam.toLowerCase().includes('total')) {
        currentTeam = rawTeam;
      }

      const vjName = String(row[4] || '').trim();
      const rawStatus = String(row[2] || '').trim().toLowerCase();

      // กรองรายการที่ไม่ใช่ VJ ออก
      if (!vjName || vjName.toLowerCase().includes('total') || vjName.toLowerCase().includes('รวม')) continue;
      
      let isNonVJ = false;
      for (const kw of nonVJKeywords) {
        if (rawStatus.includes(kw) || vjName.toLowerCase().includes(kw)) {
          isNonVJ = true;
          break;
        }
      }
      if (isNonVJ) continue;

      // --- ประมวลผลข้อมูลสะสมทั้งเดือน ---
      let monthlyDiamondTotal = 0;
      let monthlyQualifyingDays = 0;
      let monthlyBonusTotal = 0;

      for (let d = 1; d <= 31; d++) {
        const cIdx = dayColMap[d];
        if (cIdx && cIdx < row.length) {
          const rawScore = String(row[cIdx] || '').replace(/,/g, '').trim();
          const scoreNum = parseFloat(rawScore);

          if (!isNaN(scoreNum) && scoreNum > 0) {
            monthlyDiamondTotal += scoreNum;
            const dailyTier = calculateVJBountyTier(scoreNum);

            // เงื่อนไข: สรุปยอดรายเดือน นับเฉพาะวันที่ผ่านเกณฑ์ (>= 30,000 💎)
            if (dailyTier.isQualifying) {
              monthlyQualifyingDays += 1;
              monthlyBonusTotal += dailyTier.bonusBaht;
            }
          }
        }
      }

      totalMonthlyBonusAllVJ += monthlyBonusTotal;

      // ดึงรูปอวตาร (พร้อม Fallback UI Avatar)
      const vjAvatar = avatarMap[vjName] || `https://ui-avatars.com/api/?name=${encodeURIComponent(vjName)}&background=6366f1&color=ffffff&bold=true&size=128`;

      // บันทึกข้อมูลสรุปรายเดือน
      monthlyVJSummaryList.push({
        name: vjName,
        team: currentTeam,
        avatar: vjAvatar,
        monthlyDiamonds: monthlyDiamondTotal,
        qualifyingDays: monthlyQualifyingDays,
        monthlyBonus: monthlyBonusTotal
      });

      // --- ประมวลผลข้อมูลประจำวันที่เลือก ---
      if (targetColIdx && targetColIdx < row.length) {
        const rawDailyVal = String(row[targetColIdx] || '').replace(/,/g, '').trim();
        const dailyDiamonds = parseFloat(rawDailyVal);

        if (!isNaN(dailyDiamonds)) {
          const dailyBonusInfo = calculateVJBountyTier(dailyDiamonds);

          totalDailyDiamonds += dailyDiamonds;
          totalDailyBonus += dailyBonusInfo.bonusBaht;
          if (dailyBonusInfo.isQualifying) {
            totalQualifyingVJsToday += 1;
          }

          dailyVJList.push({
            date: selectedDateStr,
            dayNum: targetDay,
            name: vjName,
            team: currentTeam,
            avatar: vjAvatar,
            dailyDiamonds: dailyDiamonds,
            tierLevel: dailyBonusInfo.tierLevel,
            tierText: dailyBonusInfo.tierText,
            dailyBonus: dailyBonusInfo.bonusBaht,
            neededNextTier: dailyBonusInfo.neededNextTier,
            isQualifying: dailyBonusInfo.isQualifying,
            monthlyDiamonds: monthlyDiamondTotal,
            monthlyQualifyingDays: monthlyQualifyingDays,
            monthlyBonus: monthlyBonusTotal
          });
        }
      }
    }

    // จัดอันดับตามความสำเร็จ
    dailyVJList.sort((a, b) => b.dailyDiamonds - a.dailyDiamonds);
    dailyVJList.forEach((item, index) => item.rank = index + 1);

    monthlyVJSummaryList.sort((a, b) => b.monthlyBonus - a.monthlyBonus || b.monthlyDiamonds - a.monthlyDiamonds);
    monthlyVJSummaryList.forEach((item, index) => item.rank = index + 1);

    return {
      success: true,
      sheetName: activeSheet.getName(),
      selectedDay: targetDay,
      selectedDateStr: selectedDateStr,
      summary: {
        totalDailyDiamonds: totalDailyDiamonds,
        totalDailyBonus: totalDailyBonus,
        totalQualifyingVJsToday: totalQualifyingVJsToday,
        totalMonthlyBonusAllVJ: totalMonthlyBonusAllVJ,
        totalVJsCount: dailyVJList.length
      },
      dailyVJList: dailyVJList,
      monthlyVJSummaryList: monthlyVJSummaryList
    };

  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function getSheetData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('vj mc all');
  
  if (!sheet) {
    throw new Error("ไม่พบชีตชื่อ 'vj mc all'");
  }
  
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return { headers: [], data: [] };
  
  const headers = values[0];
  
  // หาตำแหน่ง Index ของคอลัมน์ที่เกี่ยวข้อง
  const tiktokIdx = headers.findIndex(h => h.toString().trim().toUpperCase() === 'ID TIKTOK');
  const imgIdx = headers.findIndex(h => {
    const str = h.toString().trim().toLowerCase();
    return str.includes('รูป') || str.includes('profile') || str.includes('avatar') || str.includes('image');
  });

  const data = values.slice(1).map(row => {
    const tiktokId = tiktokIdx !== -1 ? row[tiktokIdx] : '';
    let profilePic = imgIdx !== -1 ? row[imgIdx] : '';
    
    // หากไม่มี URL รูปภาพ ให้สร้างรูปโปรไฟล์ตัวแทนจาก ID TIKTOK
    if (!profilePic && tiktokId) {
      profilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(tiktokId)}&background=0D8ABC&color=fff&size=128`;
    }

    return {
      headersData: row,
      tiktokId: tiktokId,
      profilePic: profilePic
    };
  });

  return {
    headers: headers,
    rows: data
  };
}


/**
 * ระบบดึงรูป Profile TikTok และ ระบบ Export ข้อมูล
 * แผ่นงานเป้าหมาย: vj mc all
 * คอลัมน์ TikTok ID: ID TIKTOK
 */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 ระบบจัดการ VJ/MC')
    .addItem('🖼️ ดึงรูป Profile TikTok ทั้งหมด', 'fetchTikTokProfiles')
    .addSeparator()
    .addItem('📄 Export เป็น PDF', 'exportToPDFDialog')
    .addItem('📊 Export เป็น CSV', 'exportToCSVDialog')
    .addToUi();
}

/**
 * ฟังก์ชันดึงรูปภาพ Profile จาก TikTok ID ในชีต 'vj mc all'
 */
function fetchTikTokProfilesLegacy_() {
  var sheetName = 'vj mc all';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('ไม่พบชีตชื่อ "' + sheetName + '" กรุณาตรวจสอบชื่อชีตอีกครั้ง');
    return;
  }

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    SpreadsheetApp.getUi().alert('ไม่มีข้อมูลในชีต');
    return;
  }

  var headers = data[0];
  var tiktokColIndex = headers.findIndex(function(h) {
    return String(h).trim().toUpperCase() === 'ID TIKTOK';
  });
  
  if (tiktokColIndex === -1) {
    tiktokColIndex = headers.findIndex(function(h) {
      return String(h).toLowerCase().includes('tiktok');
    });
  }

  if (tiktokColIndex === -1) {
    SpreadsheetApp.getUi().alert('ไม่พบคอลัมน์ "ID TIKTOK" ในชีต');
    return;
  }

  var imgColIndex = headers.findIndex(function(h) {
    return String(h).trim().includes('รูปโปรไฟล์') || String(h).trim().includes('Profile Image');
  });
  
  if (imgColIndex === -1) {
    imgColIndex = headers.length;
    sheet.getRange(1, imgColIndex + 1).setValue('รูปโปรไฟล์');
  }

  var updatedCount = 0;
  for (var i = 1; i < data.length; i++) {
    var tiktokId = String(data[i][tiktokColIndex]).trim();
    if (tiktokId) {
      var imgUrl = getTikTokAvatarUrl(tiktokId);
      if (imgUrl) {
        sheet.getRange(i + 1, imgColIndex + 1).setFormula('=IMAGE("' + imgUrl + '")');
        updatedCount++;
      }
    }
  }

  SpreadsheetApp.getUi().alert('อัปเดตรูปโปรไฟล์สำเร็จทั้งหมด ' + updatedCount + ' รายการ!');
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();

  // Keep the VJ Bonus entry points from the earlier onOpen implementation.
  // Apps Script only invokes the last global onOpen declaration in this file.
  ui.createMenu('ACE Tracking System')
    .addItem('เปิดระบบ VJ Bonus (หน้าต่างใหญ่)', 'showVJBonusModal')
    .addItem('เปิดระบบ VJ Bonus (แถบข้าง Sidebar)', 'showVJBonusSidebar')
    .addToUi();

  ui.createMenu('🚀 ระบบจัดการ VJ/MC')
    .addItem('🌐 เปิดหน้า Dashboard Web App', 'openWebApp')
    .addSeparator()
    .addItem('🖼️ อัปเดตรูป Profile TikTok ในชีตอัตโนมัติ', 'fetchTikTokProfiles')
    .addToUi();
}

function openWebApp() {
  var url = ScriptApp.getService().getUrl();
  if (!url) {
    SpreadsheetApp.getUi().alert('กรุณากด Deploy (การใช้งาน) เป็น Web App ก่อน');
    return;
  }
  var html = HtmlService.createHtmlOutput('<script>window.open("' + url + '", "_blank");</script>')
    .setWidth(300).setHeight(100);
  SpreadsheetApp.getUi().showModalDialog(html, 'กำลังเปิด Dashboard...');
}

/**
 * ดึงข้อมูลทั้งหมดจากชีต 'vj mc all' มาประมวลผลสำหรับ Web App
 */
function getDashboardData() {
  var sheetName = 'vj mc all';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return { error: 'ไม่พบแผ่นงานชื่อ "' + sheetName + '" กรุณาตรวจสอบชื่อชีตอีกครั้ง' };
  }

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return { error: 'ไม่มีข้อมูลในแผ่นงาน' };
  }

  // แปลง Header เป็นตัวพิมพ์เล็กเพื่อค้นหาคอลัมน์แบบยืดหยุ่น
  var headers = data[0].map(function(h) { return String(h).trim().toLowerCase(); });
  
  function getIndex(keywords) {
    return headers.findIndex(function(h) {
      return keywords.some(function(k) { return h.includes(k.toLowerCase()); });
    });
  }

  var idxTiktok = getIndex(['id tiktok', 'tiktok id', 'tiktok']);
  var idxImg = getIndex(['รูปโปรไฟล์', 'profile image', 'avatar', 'img']);
  var idxName = getIndex(['ชื่อ vj', 'vj / ชื่อจริง', 'vj name', 'ชื่อเล่น', 'vj']);
  var idxRealName = getIndex(['ชื่อจริง', 'real name']);
  var idxTeam = getIndex(['ทีม', 'team']);
  var idxTarget = getIndex(['target', 'kpi']);
  var idxDiamonds = getIndex(['ยอดสะสม', 'เพชร', 'diamonds']);
  var idxPct = getIndex(['%', 'เป้าหมาย']);
  var idxDays = getIndex(['วันผ่านเกณฑ์', 'days']);
  var idxBonus = getIndex(['โบนัส', 'bonus']);

  var vjList = [];
  var totalDiamonds = 0;
  var totalDays = 0;
  var totalBonus = 0;

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var tiktokId = idxTiktok !== -1 ? String(row[idxTiktok] || '').trim() : '';
    var name = idxName !== -1 ? String(row[idxName] || '').trim() : '';
    
    // ข้ามแถวที่ไม่มีข้อมูล VJ
    if (!name && !tiktokId) continue;

    var diamonds = idxDiamonds !== -1 ? Number(row[idxDiamonds]) || 0 : 0;
    var bonus = idxBonus !== -1 ? Number(row[idxBonus]) || 0 : 0;
    var days = idxDays !== -1 ? Number(row[idxDays]) || 0 : 0;
    
    // จัดการดึงรูปภาพ Profile
    var rawImg = idxImg !== -1 ? String(row[idxImg] || '').trim() : '';
    var imgUrl = '';
    
    if (rawImg.startsWith('=IMAGE("')) {
      var match = rawImg.match(/"([^"]+)"/);
      if (match) imgUrl = match[1];
    } else if (rawImg.startsWith('http')) {
      imgUrl = rawImg;
    }
    
    // ถ้าไม่มีรูปในชีต ให้ดึงจาก TikTok ID แบบไดนามิก
    if (!imgUrl && tiktokId) {
      var cleanId = tiktokId.replace('@', '').trim();
      imgUrl = 'https://unavatar.io/tiktok/' + cleanId;
    }

    if (!imgUrl) {
      imgUrl = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';
    }

    totalDiamonds += diamonds;
    totalDays += days;
    totalBonus += bonus;

    vjList.push({
      id: i,
      rank: 0,
      tiktokId: tiktokId,
      imgUrl: imgUrl,
      name: name || tiktokId,
      realName: idxRealName !== -1 ? String(row[idxRealName] || '') : '',
      team: idxTeam !== -1 ? String(row[idxTeam] || '-') : '-',
      target: idxTarget !== -1 ? Number(row[idxTarget]) || 0 : 0,
      diamonds: diamonds,
      pct: idxPct !== -1 && row[idxPct] !== '' ? (Math.round(Number(row[idxPct]) * (row[idxPct] <= 1 ? 100 : 1)) + '%') : '0%',
      days: days,
      bonus: bonus,
    });
  }

  // เรียงลำดับตามยอดเพชรจากมากไปน้อย
  vjList.sort(function(a, b) { return b.diamonds - a.diamonds; });
  vjList.forEach(function(item, index) { item.rank = index + 1; });

  // จัดกลุ่มข้อมูลตามทีม
  var teamsMap = {};
  vjList.forEach(function(vj) {
    var tName = vj.team || 'ไม่ระบุทีม';
    if (!teamsMap[tName]) {
      teamsMap[tName] = { name: tName, members: [], totalDiamonds: 0 };
    }
    teamsMap[tName].members.push(vj);
    teamsMap[tName].totalDiamonds += vj.diamonds;
  });

  var teamList = Object.keys(teamsMap).map(function(tKey) {
    var t = teamsMap[tKey];
    return {
      name: t.name,
      count: t.members.length,
      avgDiamonds: Math.round(t.totalDiamonds / (t.members.length || 1)),
      totalDiamonds: t.totalDiamonds,
      members: t.members
    };
  });

  return {
    spreadsheetUrl: ss.getUrl(),
    sheetId: sheet.getSheetId(),
    summary: {
      totalDiamonds: totalDiamonds,
      totalVJ: vjList.length,
      totalDays: totalDays,
      totalBonus: totalBonus
    },
    vjList: vjList,
    teamList: teamList
  };
}

/**
 * ดึง URL รูปโปรไฟล์ TikTok จาก ID เขียนกลับลงใน Google Sheets
 */
function fetchTikTokProfilesWorker_(sessionToken) {
  const session = requireAdminSession_(sessionToken, ['SUPER_ADMIN']);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('vj mc all');
  if (!sheet) return;

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  
  var tiktokCol = headers.findIndex(function(h) { return String(h).trim().toUpperCase() === 'ID TIKTOK'; });
  if (tiktokCol === -1) return;

  var imgCol = headers.findIndex(function(h) { 
    var text = String(h).trim();
    return text.includes('รูปโปรไฟล์') || text.includes('Profile'); 
  });
  
  if (imgCol === -1) {
    imgCol = headers.length;
    sheet.getRange(1, imgCol + 1).setValue('รูปโปรไฟล์');
  }

  var updated = 0;
  for (var i = 1; i < data.length; i++) {
    var tiktokId = String(data[i][tiktokCol]).replace('@', '').trim();
    if (tiktokId) {
      try {
        var res = UrlFetchApp.fetch('https://www.tiktok.com/@' + tiktokId, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          muteHttpExceptions: true
        });
        var html = res.getContentText();
        var match = html.match(/"avatarLarger":"([^"]+)"/) || html.match(/"avatarMedium":"([^"]+)"/);
        if (match && match[1]) {
          var imgUrl = match[1].replace(/\\u0026/g, '&').replace(/\\/g, '');
          sheet.getRange(i + 1, imgCol + 1).setFormula('=IMAGE("' + imgUrl + '")');
          updated++;
        }
      } catch (e) {
        Logger.log('Fetch error: ' + e.toString());
      }
    }
  }
  return updated;
}

function fetchTikTokProfiles() {
  const ui = SpreadsheetApp.getUi();
  const usernameResult = ui.prompt('ACE Tracking', 'ชื่อผู้ใช้ Super Admin', ui.ButtonSet.OK_CANCEL);
  if (usernameResult.getSelectedButton() !== ui.Button.OK) return;
  const passcodeResult = ui.prompt('ACE Tracking', 'รหัสผ่าน Super Admin', ui.ButtonSet.OK_CANCEL);
  if (passcodeResult.getSelectedButton() !== ui.Button.OK) return;
  const login = verifyAdminAccess(passcodeResult.getResponseText(), usernameResult.getResponseText());
  if (!login.success || login.role !== 'SUPER_ADMIN') {
    ui.alert('ไม่มีสิทธิ์', 'ต้องเข้าสู่ระบบด้วยบัญชี Super Admin', ui.ButtonSet.OK);
    return;
  }
  const updated = fetchTikTokProfilesWorker_(login.token);
  ui.alert('ACE Tracking', 'อัปเดตรูปโปรไฟล์ ' + Number(updated || 0) + ' รายการ', ui.ButtonSet.OK);
}




/**
 * ===================================================
 * Backend Extensions for Feature 1, 2 & 3
 * ===================================================
 */

/**
 * ฟังก์ชันดึงและคำนวณข้อมูลสรุปประจำเดือน (Monthly Stats Summary)
 * ครอบคลุม: ยอดรวม, % Target, วันลา/วันทำงาน, ยอดรายวัน (1-31) และสัดส่วนทีม
 */
// Code.gs (Backend - ปรับปรุงการดึง Target จากชีต KPI_Targets)

// JavaScript
// function doGet() {
//   return HtmlService.createTemplateFromFile('Index')
//     .evaluate()
//     .setTitle('ACE KPI Tracking & Report System')
//     .addMetaTag('viewport', 'width=device-width, initial-scale=1')
//     .setXframeOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
// }

/**
 * ดึงรายชื่อ Sheet ทั้งหมด (ยกเว้นชีตข้อมูลหลัก/ตั้งค่า)
 */
// function getSheetList() {
//   const ss = SpreadsheetApp.getActiveSpreadsheet();
//   const excludeSheets = ['KPI_TARGETS', 'SETTING', 'SETTINGS', 'VJ MC ALL', 'VJ_MC_ALL'];
//   return ss.getSheets()
//     .map(sheet => sheet.getName())
//     .filter(name => !excludeSheets.includes(name.toUpperCase()));
// }

/**
 * ดึง TikTok ID จากชีต vj mc all (Col B = VJ Name, Col H = TikTok ID)
 */
function getTikTokProfilesMap() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('vj mc all') || ss.getSheetByName('VJ MC ALL') || ss.getSheetByName('vj_mc_all');
  const tiktokMap = {};
  if (!sheet) return tiktokMap;

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const vjName = String(data[i][1] || '').trim(); // Col B (Index 1)
    const tiktokId = String(data[i][7] || '').trim(); // Col H (Index 7)
    if (vjName) {
      tiktokMap[vjName] = tiktokId;
    }
  }
  return tiktokMap;
}

/**
 * ดึง Target จาก KPI_Targets (Col A = VJ Name, Col B = Target_Diamond, Col E = month)
 */
function getVJTargetProfileMap(targetMonth) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('KPI_Targets') || ss.getSheetByName('kpi_targets');
  const profileMap = {};
  const tiktokMap = getTikTokProfilesMap();
  
  const monthKey = normalizeKpiMonthKey_(targetMonth);

  if (sheet) {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const vjName = String(row[0] || '').trim(); // Col A
      if (!vjName) continue;

      const target = parseFloat(String(row[1] == null ? '' : row[1]).replace(/,/g, '')) || 0; // Col B
      const rowMonthKey = normalizeKpiMonthKey_(row[4]); // Col E

      if (rowMonthKey && monthKey && rowMonthKey !== monthKey) continue;

      const tiktokId = tiktokMap[vjName] || '';
      const cleanTikTokId = tiktokId.replace(/^@/, '');
      const profilePic = cleanTikTokId 
        ? `https://unavatar.io/tiktok/${cleanTikTokId}` 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(vjName)}&background=6366f1&color=fff`;

      profileMap[vjName] = {
        target: target,
        tiktokId: tiktokId,
        profilePic: profilePic
      };
    }
  }
  return profileMap;
}

/**
 * สรุปข้อมูล KPI ประจำเดือน
 */
function getMonthlyStatsSummary(sheetName) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = sheetName ? ss.getSheetByName(sheetName) : ss.getSheets()[0];
    if (!sheet) return { success: false, error: 'ไม่พบชีตที่ต้องการ' };

    const currentSheetName = sheet.getName();
    const vjProfiles = getVJTargetProfileMap(currentSheetName);
    const tiktokMap = getTikTokProfilesMap();
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { success: false, error: 'ไม่มีข้อมูลในชีต' };

    let totalDiamonds = 0;
    let totalTarget = 0;
    let totalWorkDays = 0;
    let totalLeaveDays = 0;
    
    const dailyTotalsMap = Array(31).fill(0);
    const teamBreakdownMap = {};
    const vjStatsList = [];

    const offKeywords = ['off', 'ล', 'l', 'leave', 'ลา', 'off/ลา'];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const team = String(row[0] || '').trim();
      const vjName = String(row[4] || '').trim();
      const vjNameUpper = vjName.toUpperCase();
      const teamUpper = team.toUpperCase();

      if (!vjName || !team) continue;
      if (
        vjNameUpper === 'TOTAL' || 
        vjNameUpper === 'MC' || 
        vjNameUpper.includes('TOTAL') || 
        vjNameUpper.includes('MC') || 
        teamUpper.includes('TOTAL MC')
      ) continue;

      const profile = vjProfiles[vjName] || {};
      const target = profile.target !== undefined ? profile.target : (parseFloat(row[5]) || 0);
      
      const tiktokId = profile.tiktokId || tiktokMap[vjName] || '';
      const cleanTikTokId = tiktokId.replace(/^@/, '');
      const profilePic = cleanTikTokId 
        ? `https://unavatar.io/tiktok/${cleanTikTokId}` 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(vjName)}&background=6366f1&color=fff`;

      let vjDiamonds = 0;
      let workDays = 0;
      let leaveDays = 0;
      const dailyBreakdown = Array(31).fill(0);

      for (let day = 1; day <= 31; day++) {
        const colVal = row[5 + day];
        if (colVal !== undefined && colVal !== null && colVal !== '') {
          const valStr = String(colVal).trim().toLowerCase();
          
          if (offKeywords.includes(valStr)) {
            leaveDays++;
            dailyBreakdown[day - 1] = 'OFF';
          } else {
            const num = parseFloat(colVal) || 0;
            vjDiamonds += num;
            dailyTotalsMap[day - 1] += num;
            dailyBreakdown[day - 1] = num;
            if (num > 0) workDays++;
          }
        } else {
          dailyBreakdown[day - 1] = 0;
        }
      }

      totalDiamonds += vjDiamonds;
      totalTarget += target;
      totalWorkDays += workDays;
      totalLeaveDays += leaveDays;

      if (!teamBreakdownMap[team]) {
        teamBreakdownMap[team] = { team: team, totalDiamonds: 0, totalTarget: 0, vjCount: 0 };
      }
      teamBreakdownMap[team].totalDiamonds += vjDiamonds;
      teamBreakdownMap[team].totalTarget += target;
      teamBreakdownMap[team].vjCount++;

      const rate = target > 0 ? (vjDiamonds / target) * 100 : 0;
      vjStatsList.push({
        name: vjName,
        team: team,
        tiktokId: tiktokId,
        profilePic: profilePic,
        target: target,
        actual: vjDiamonds,
        rate: Math.round(rate * 100) / 100,
        workDays: workDays,
        leaveDays: leaveDays,
        dailyAvg: workDays > 0 ? Math.round(vjDiamonds / workDays) : 0,
        dailyBreakdown: dailyBreakdown
      });
    }

    vjStatsList.sort((a, b) => b.actual - a.actual);
    const teamList = Object.values(teamBreakdownMap);
    teamList.sort((a, b) => b.totalDiamonds - a.totalDiamonds);

    const overallRate = totalTarget > 0 ? (totalDiamonds / totalTarget) * 100 : 0;

    return {
      success: true,
      sheetName: currentSheetName,
      summary: {
        totalDiamonds: totalDiamonds,
        totalTarget: totalTarget,
        overallRate: Math.round(overallRate * 100) / 100,
        totalWorkDays: totalWorkDays,
        totalLeaveDays: totalLeaveDays,
        vjCount: vjStatsList.length,
        avgDiamondPerVJ: vjStatsList.length > 0 ? Math.round(totalDiamonds / vjStatsList.length) : 0
      },
      dailyTotals: dailyTotalsMap,
      teamList: teamList,
      vjList: vjStatsList
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * เปรียบเทียบผลงานระหว่าง 2 เดือน (ทีม และ VJ)
 */
function getMonthlyComparisonData(sheetName1, sheetName2) {
  try {
    const res1 = getMonthlyStatsSummary(sheetName1);
    const res2 = getMonthlyStatsSummary(sheetName2);

    if (!res1.success || !res2.success) {
      return { success: false, error: 'ไม่สามารถโหลดข้อมูลของหนึ่งในเดือนที่เลือกได้' };
    }

    // เปรียบเทียบข้อมูลทีม
    const teamMap1 = {};
    res1.teamList.forEach(t => teamMap1[t.team] = t);
    const teamMap2 = {};
    res2.teamList.forEach(t => teamMap2[t.team] = t);

    const allTeams = Array.from(new Set([...Object.keys(teamMap1), ...Object.keys(teamMap2)]));
    const teamComparison = allTeams.map(team => {
      const t1 = teamMap1[team] || { totalDiamonds: 0, totalTarget: 0, vjCount: 0 };
      const t2 = teamMap2[team] || { totalDiamonds: 0, totalTarget: 0, vjCount: 0 };
      
      const diff = t2.totalDiamonds - t1.totalDiamonds;
      const growth = t1.totalDiamonds > 0 ? (diff / t1.totalDiamonds) * 100 : (t2.totalDiamonds > 0 ? 100 : 0);

      return {
        team: team,
        m1Diamonds: t1.totalDiamonds,
        m2Diamonds: t2.totalDiamonds,
        diff: diff,
        growth: Math.round(growth * 100) / 100
      };
    }).sort((a, b) => b.m2Diamonds - a.m2Diamonds);

    // เปรียบเทียบข้อมูล VJ
    const vjMap1 = {};
    res1.vjList.forEach(v => vjMap1[v.name] = v);
    const vjMap2 = {};
    res2.vjList.forEach(v => vjMap2[v.name] = v);

    const allVJs = Array.from(new Set([...Object.keys(vjMap1), ...Object.keys(vjMap2)]));
    const vjComparison = allVJs.map(vjName => {
      const v1 = vjMap1[vjName] || { actual: 0, team: '-', target: 0, profilePic: '' };
      const v2 = vjMap2[vjName] || { actual: 0, team: '-', target: 0, profilePic: '' };
      
      const diff = v2.actual - v1.actual;
      const growth = v1.actual > 0 ? (diff / v1.actual) * 100 : (v2.actual > 0 ? 100 : 0);

      return {
        name: vjName,
        team: v2.team !== '-' ? v2.team : v1.team,
        profilePic: v2.profilePic || v1.profilePic,
        m1Actual: v1.actual,
        m2Actual: v2.actual,
        diff: diff,
        growth: Math.round(growth * 100) / 100
      };
    }).sort((a, b) => b.m2Actual - a.m2Actual);

    return {
      success: true,
      month1: res1.sheetName,
      month2: res2.sheetName,
      summary1: res1.summary,
      summary2: res2.summary,
      teamComparison: teamComparison,
      vjComparison: vjComparison
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}
