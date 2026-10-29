# ACE Tracking System

ระบบติดตามผลการทำงานของ VJ และทีม พัฒนาด้วย Google Apps Script และ Google Sheets มีหน้า Dashboard สำหรับดูยอด Diamond, รายงานรายวันและรายสัปดาห์, KPI, VJ Bonus และตารางงาน MC

> Repository นี้เก็บ Source Code และแพ็กเกจระบบเท่านั้น การใช้งานจริงต้องติดตั้งใน Apps Script ที่เชื่อมกับ Google Spreadsheet ที่ถูกต้อง

## ภาพรวมการทำงาน

1. ผู้ใช้เปิด Web App URL ของ Google Apps Script
2. ฟังก์ชัน doGet ใน Code.gs เลือกหน้าเว็บจากพารามิเตอร์ page หรือเปิดหน้า Dashboard หลัก
3. หน้า HTML ติดต่อ Backend ด้วย google.script.run
4. Backend อ่านหรือเขียนชีตผ่าน SpreadsheetApp.getActiveSpreadsheet() ดังนั้น Apps Script ควรผูกกับ Spreadsheet ที่ต้องการใช้งาน
5. หน้า TV มีการเรียกข้อมูลซ้ำตามรอบเวลา 15 วินาทีตามค่าที่กำหนดใน view_data.html

## หน้าเว็บและเส้นทาง

| หน้า | พารามิเตอร์ URL | ไฟล์ |
| --- | --- | --- |
| Main Dashboard | ไม่ระบุ page | moshi.html |
| TV Dashboard | page=tv หรือ page=view_data | view_data.html |
| Weekly Report | page=weekly | weekly_tab.html |
| Daily Summary | page=daily_summary | daily_summary.html |
| VJ Bonus | page=vj_bonus หรือ page=vjbonus | VJ_Bonus.html |
| MC Schedule / Bonus | page=mc_w | MC_W.html |
| VJ / Team KPI | page=kpi_vj หรือ page=M | kpi_vj_data.html |
| KPI Dashboard | page=kpi_data หรือ page=kpi | KPI_data.html |

ตัวอย่าง: นำ URL ของ Web App มาต่อท้ายด้วย ?page=weekly เพื่อเปิดรายงานรายสัปดาห์

นอกจากนี้ Code.gs มี JSON endpoint สำหรับ TV Dashboard ที่เรียกด้วย action=api_dashboard และรองรับพารามิเตอร์ sheet และ day

## โครงสร้างไฟล์

| ไฟล์ | หน้าที่ |
| --- | --- |
| Code.gs | Backend, doGet routing, การอ่าน/เขียน Google Sheets, KPI, Login, Admin, Bonus และรายงาน |
| moshi.html | Main Dashboard |
| view_data.html | TV Dashboard และ leaderboard |
| daily_summary.html | รายงานประจำวัน |
| weekly_tab.html | รายงานประจำสัปดาห์ |
| KPI_data.html | KPI Dashboard |
| kpi_vj_data.html | รายงาน KPI ของ VJ และทีม |
| VJ_Bonus.html | รายงานโบนัส VJ |
| MC_W.html | ตารางงานและรายงานโบนัส MC |
| auth_gate.html | หน้าหรือส่วนประกอบสำหรับ Login ที่หน้าเว็บเรียกใช้ |
| KPI_Targets_import.tsv | ข้อมูล KPI target ที่เตรียมไว้สำหรับตรวจสอบและนำเข้า |
| ACE_SYSTEM_AUDIT.md | บันทึกผลตรวจ Source Code และรายการตรวจสอบก่อนใช้งาน |
| ACE_Tracking_System_Login_KPI_Updated_20261030_v2.zip | แพ็กเกจ ZIP ของชุดไฟล์ |

Apps Script HTML template ใช้ชื่อไฟล์โดยไม่ใส่นามสกุล .html ใน include() และ createTemplateFromFile() เช่น auth_gate และ view_data ให้รักษาตัวพิมพ์เล็ก/ใหญ่ของชื่อไฟล์ตามที่ Code.gs เรียกใช้

## ชีตที่ Backend อ้างถึง

ชื่อชีตต่อไปนี้ปรากฏใน Source Code หน้าที่สรุปอ้างอิงจากชื่อและการใช้งานในฟังก์ชัน Backend:

| ชื่อชีต | การใช้งานที่พบในโค้ด |
| --- | --- |
| KPI_Targets | เป้าหมาย Diamond รายบุคคล โดยมี VJ_Name, Target_Diamond, UpdatedBy, UpdatedAt และ Month_Sheet |
| KPI_Data | ข้อมูล KPI รายบุคคล/ทีม |
| Admin_Users | บัญชีผู้ใช้และบทบาท Admin |
| System_Logs | บันทึกเหตุการณ์ของระบบ |
| Status_Overrides | ค่า Status ที่ผู้ดูแลปรับกำหนด |
| MC_Schedules | ตารางงาน MC |
| MC_Bonus_Logs | ประวัติผลโบนัส MC |
| vj mc all / vj_mc_all | แหล่งข้อมูลโปรไฟล์ VJ ที่ Backend รองรับ |
| Team Data / Team_Data | ข้อมูลทีมและตารางเวลา Live ที่ Backend รองรับ |
| BonusData และ VJ_Profiles | ชีตที่มีการอ้างถึงในฟังก์ชันระบบโบนัสหรือโปรไฟล์ |

บางฟังก์ชันสร้างชีตระบบพร้อมหัวตารางเมื่อไม่พบชีตนั้น ส่วนชื่อและหัวคอลัมน์ของชีตข้อมูลรายเดือนขึ้นอยู่กับ Spreadsheet ที่นำมาเชื่อม โปรดสำรองและตรวจโครงสร้างชีตจริงก่อนติดตั้ง

## นำเข้า KPI Target

ไฟล์ KPI_Targets_import.tsv เป็นข้อมูลที่เตรียมไว้ให้ผู้ดูแลตรวจสอบก่อนนำเข้า ไม่ได้เขียนข้อมูลเข้า Spreadsheet ให้อัตโนมัติ ตรวจชื่อ VJ, เดือน, UpdatedBy และ UpdatedAt ก่อนนำเข้า และตรวจรายการซ้ำของ VJ/เดือนในชีต KPI_Targets ด้วย

Backend เลือกเป้าหมายตาม Month_Sheet และสามารถใช้ค่าเป้าหมายทั่วไปเมื่อไม่มีค่าที่ตรงกับเดือนที่เลือก อย่าเปลี่ยนสูตรหรือค่าธุรกิจโดยไม่ตรวจสอบข้อมูลและกติกาที่ใช้งานจริง

## ติดตั้งและ Deploy

1. สำรอง Google Spreadsheet และ Apps Script project เดิมก่อน
2. เปิด Spreadsheet เป้าหมาย แล้วเลือก Extensions → Apps Script เพื่อให้โปรเจกต์ผูกกับ Spreadsheet ที่ถูกต้อง
3. เพิ่มหรือแทนที่ไฟล์ Code.gs และไฟล์ HTML ที่ระบุในตารางด้านบน โดยตั้งชื่อ HTML ให้ตรงกับชื่อที่ Backend เรียก
4. ตรวจแท็บข้อมูลรายเดือนและหัวคอลัมน์ รวมถึงแท็บ KPI_Targets, Admin_Users, System_Logs, Status_Overrides และแท็บของ MC
5. ตั้ง Script Properties สำหรับบัญชีเริ่มต้น: ACE_INITIAL_ADMIN_USERNAME และ ACE_INITIAL_ADMIN_PASSCODE โดยกำหนด Passcode ที่ไม่ซ้ำและมีความยาวอย่างน้อย 12 ตัวอักษรตามเงื่อนไขใน Source Code
6. ทดสอบด้วยสำเนา Spreadsheet และข้อมูลที่ไม่ใช่ข้อมูลจริงก่อน อนุญาต OAuth scopes ที่จำเป็น และทดสอบทุกหน้า การอ่าน/เขียนข้อมูล และการแบ่งสิทธิ์
7. เมื่อทดสอบผ่านแล้วจึงอัปเดต Deployment ที่ใช้งานจริง พร้อมเก็บ Source และ Deployment เดิมไว้สำหรับย้อนกลับ

ไฟล์ Manifest ของ Apps Script ไม่ได้รวมอยู่ใน Source bundle นี้ ให้ตรวจการตั้งค่าเดิมของโปรเจกต์ เช่น timezone และ OAuth scopes แทนการกำหนดค่าใหม่โดยคาดเดา

## Login และความปลอดภัย

- หน้า Dashboard และหน้า standalone ที่ใส่ auth_gate จะตรวจสอบ Session ก่อนโหลดข้อมูลหน้า
- Session ใช้ Script Cache และมีอายุ 6 ชั่วโมงตามโค้ด
- การสร้างบัญชี Admin เริ่มต้นใช้ Script Properties และ Script Lock
- บัญชีเดิมที่เก็บ Passcode แบบ plaintext จะถูกย้ายเป็น salted SHA-256 hash หลัง Login สำเร็จตามเส้นทางใน Backend; ควรสำรองแท็บ Admin_Users ก่อน
- โค้ดไม่มี rate limiting หรือ account lockout สำหรับ Login
- เส้นทาง JSON action=api_dashboard ถูกประมวลผลใน doGet ก่อนเส้นทางหน้าเว็บ จึงไม่มีการตรวจ Session ใน router branch นี้ ควรตรวจสอบการตั้งค่าการเข้าถึงของ Web App ก่อนเปิดเผยข้อมูล
- การตั้งค่าสิทธิ์ของ GitHub Repository ไม่ได้กำหนดสิทธิ์ของ Google Apps Script Web App โดยอัตโนมัติ

## สถานะการตรวจสอบ

มีการตรวจ Source Code และเส้นทางหน้าเว็บแล้ว แต่ยังไม่ได้ทดสอบกับ Spreadsheet จริง, Browser แบบ end-to-end หรือ Deployment จริง ผลการตรวจและข้อจำกัดดูได้จาก ACE_SYSTEM_AUDIT.md

## การมีส่วนร่วมและการเปลี่ยนแปลง

ก่อนแก้ไขสูตร KPI, Diamond หรือ Bonus ให้ตรวจสอบแหล่งข้อมูลและกติกาธุรกิจที่ใช้งานจริงก่อน ทุกการแก้ไขควรทดสอบในสำเนาระบบและเก็บไฟล์เดิมไว้สำหรับ rollback
