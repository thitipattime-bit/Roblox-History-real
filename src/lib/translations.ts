import { Volume, QuizQuestion, LimitedItem } from "../types";

export type Language = "en" | "th";

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Header & Global Shell
    archives_title: "Roblox Historical Archives",
    archives_vols: "VOLS 1-5",
    archives_tagline: "Documenting the Growth of a Global Metaverse",
    exhibit_time: "EXHIBIT TIME:",
    est_date: "ESTD:",
    internal_use: "Internal Use Only",
    copyright_corp: "Roblox Corporation — Unofficial Internal Archives Catalog. Created for educational & historical research purposes.",
    all_trademarks: "All registered trademarks, character assets, logos, and physics algorithms belong to Roblox Corporation.",
    server_node: "Historical Server Node #09",

    // Tabs
    tab_slides: "Slides",
    tab_slides_short: "Slides",
    tab_database: "Database",
    tab_db_short: "Data",
    tab_sandbox: "Sandbox",
    tab_sandbox_short: "Sandbox",
    tab_studio: "AI Studio",
    tab_studio_short: "Studio",
    studio_download: "Download PNG",

    // Bot Verification
    bot_title: "Retro Verification Protocol",
    bot_subtitle: "Simulated Bot Defense check: prove you are a human",
    bot_instruction_1: "In which year was Roblox first released out of beta to the public?",
    bot_instruction_2: "What is the name of the daily currency that was retired in 2016?",
    bot_wrong: "Incorrect response, access denied! Try again.",
    bot_verify_btn: "VERIFY IDENTITY",

    // Cover page
    cover_presentation: "Museum Presentation",
    cover_title_pres: "The Roblox ",
    cover_title_archives: "Archives",
    cover_subtitle: "The Complete History: Volumes I — V",
    cover_description: "Explore twenty years of physical simulations, economy design shifts, community culture, viral outages, and technological innovations.",
    cover_btn_journey: "Begin Journey",
    cover_btn_sandbox: "Launch Sandbox Playgrounds",
    cover_scroll_hint: "▼ Scroll or click 'Begin' to explore volumes",

    // Slide View / Volumes
    volume_lbl: "VOLUME",
    scope_theme: "Scope Theme",
    nav_intro: "EXHIBIT INTRODUCTION",
    nav_slide_num: "SLIDE 0{0} / 0{1}",
    nav_presentation_deck: "Interactive Presentation Deck",
    snippet_category: "Category",
    snippet_record: "Archival Record",
    snippet_read_story: "Read Story",
    nav_interaction_tip: "Navigate using arrows or keyboard left/right key controls",
    nav_click_card: "Click Card for Expanded Archives",
    nav_btn_prev: "Previous",
    nav_btn_next: "Next Volume",
    nav_btn_open_sandbox: "Open Sandboxes",

    // Expanded Drawer
    drawer_hdr: "ARCHIVAL FIELD RECORD",
    drawer_deep_invest: "Deep Investigations:",
    drawer_close: "Close Record",
    drawer_test_sim: "Test Simulator",

    // Sandbox Core
    sandbox_hdr: "EXHIBITION INTERACTIVE ZONE",
    sandbox_title: "Historical Simulator Sandbox",
    sandbox_desc: "Experience the economic, technological, and gaming rules that shaped the growth of Roblox. Interact with sliders, trade virtual properties, debug clusters, and test your lore trivia.",
    section_economy: "Economic Simulators (Vols I & V)",
    section_tech: "Infrastructure & Lore (Vols III & IV)",

    // DevEx Calc
    devex_title: "DevEx Cash-out Rate Calculator",
    devex_robux_bal: "Simulated Robux Balance",
    devex_target_amt: "Target Exchange Amount",
    devex_rate_text: "Current Standard DevEx Rate: $0.0035 per Robux",
    devex_formula: "Standard Rate (0.0035 USD/Robux)",
    devex_formula_premium: "Premium Creator rate (0.0045 USD/Robux)",
    devex_live_conversion: "Live Conversion Estimate",
    devex_cash_val: "Cash Value",
    devex_annual_estimate: "Annual Developer Earnings (at scale)",
    devex_button_cashout: "CASH OUT TO SIMULATED BANK",
    devex_success_alert: "Successfully converted {0} Robux to ${1}!",
    devex_error_robux: "You do not have enough Robux. Try earning some in the Limiteds Trading game or history quiz!",
    devex_empty: "Enter an exchange amount",

    // Trading Game
    trading_title: "Limited Item Stock Exchange Simulator",
    trading_balance: "Your Simulated Balance",
    trading_market_status: "Digital Market Scarcity Trading Ledger",
    trading_trend: "6h price trend",
    trading_owned: "Owned: {0} units",
    trading_buy: "BUY ITEM",
    trading_sell: "SELL ITEM",
    trading_guest_prompt: "Please sign in to buy/sell assets.",
    trading_no_funds: "Insufficient Robux simulated funds to purchase this limited asset!",
    trading_no_items: "You don't own any units of this item to sell!",
    trading_success_buy: "Bought 1x {0} for R$ {1}!",
    trading_success_sell: "Sold 1x {0} for R$ {1}!",

    // Server Fixer
    server_title: "Consul Core Load balancing Debugger",
    server_status_critical: "Cluster Node Status: CRITICAL OVERLOAD",
    server_status_stable: "Cluster Node Status: STABLE HEALTH",
    server_description: "October 2021 platform outage diagnostic tool. Rebalance the edge requests across regions so CPU load stays under 80%.",
    server_active_regions: "Active Global Regions Load",
    server_fix_button: "DEPLOYS consul HOTPATCH FIX",
    server_stabilized: "Consul cluster has been stabilized! Health: Green Code (+R$ 15,000 bonus)",
    server_unstable: "Warning: Cluster nodes are unbalanced. Drag sliders to fix!",
    server_load_lbl: "LOAD",

    // History Quiz
    quiz_title: "Roblox Historical Lore Intelligence Check",
    quiz_state: "Question {0} of {1}",
    quiz_check_btn: "CHECK ANSWER",
    quiz_correct: "Correct!",
    quiz_incorrect: "Incorrect!",
    quiz_explanation_hdr: "Explanation:",
    quiz_next: "NEXT QUESTION",
    quiz_finished_hdr: "Intelligence Check Final Transcript",
    quiz_finished_raw: "Raw Score: {0} / {1} correct answers",
    quiz_finished_bonus: "Authorized Robux Bonus Awarded!",
    quiz_restart: "RESTART QUIZ",
    quiz_realtime: "🌐 Real-Time Cloud Submissions (Google Firestore)",

    // User Authentication
    auth_verified: "Google Verified",
    auth_local: "Local Avatar",
    auth_logout_tooltip: "Log Out of Session",
    auth_signin: "Sign In",
    auth_signup: "Sign Up",
    auth_cloud_sync: "Google Cloud Synchronizer",
    auth_assemble_persona: "Assemble Your Roblox Persona",
    auth_verified_google: "Successfully verified Google credentials: {0}. Set up your Roblox avatar identity profile to automatically save your game balances in the cloud.",
    auth_choose_handle: "Choose Your Roblox Username",
    auth_select_avatar_rig: "Select Avatar Rig Layout",
    auth_desc_classic_noob: "The legendary yellow torso with green pants.",
    auth_desc_bacon_hair: "The ultimate classic citizen hair style.",
    auth_desc_guest: "The silent observer wearing the Roblox cap.",
    auth_desc_valk: "Equipped with the high-society status wings.",
    auth_desc_builder: "Armed with a hardhat and physical bricks.",
    auth_desc_founder: "The ultimate visionary founder profile look.",
    auth_link_btn: "LINK PROFILE TO CLOUD",
    auth_auth_authority: "Archive Authority Sign-In",
    auth_registrar: "Access Console Registrar",
    auth_desc_main: "Authorize simulated archive logs and play with persistent game profiles. Connect with Firebase securely.",
    auth_continue_google: "CONTINUE WITH GOOGLE",
    auth_or_use_legacy: "OR USE LEGACY LOCAL PRESETS",
    auth_local_profiles_hdr: "System Pre-registered / Local Profiles",
    auth_delete_success: "System node user accounts cannot be deleted.",
    auth_hint_node: "Hint: Use database administrator builderman with password classic2006",
    auth_local_un: "Local Username",
    auth_pin: "Local Account Password / PIN",
    auth_auth_entry: "AUTHORIZE ENTRY KEY",
    auth_deploy: "DEPLOY CREDENTIALS",
    auth_no_account: "CREATE ACCOUNT",
    auth_has_account: "ALREADY SIGNED IN?",
    auth_cloud_active: "Firebase Cloud Active Node",
    auth_ver_layer: "v2.0 Cloud Auth Layer",
    auth_welcome: "Welcome back, {0}!",
    auth_err_handle_len: "Roblox handle must be at least 3 characters long.",
    auth_err_handle_chars: "Handles can only contain alphanumeric characters & underscores.",
    auth_err_pin_len: "Password/Security PIN must be at least 4 characters.",
    auth_err_dup: "This Username is already registered.",
    auth_gateway: "Opening secure Google Cloud gateway...",
    auth_google_verified: "Google authorization verified!",
    auth_complete_db_lock: "Roblox Registry is complete! Database locked.",
    auth_err_invalid: "Invalid Username or PIN combination. (Hint: Try builderman / classic2006)",
    auth_deployed_success: "Your legacy credentials have been deployed!",
    auth_logged_in_as: "Logged in as keymaster: {0}!"
  },
  th: {
    // Header & Global Shell
    archives_title: "หอจดหมายเหตุประวัติศาสตร์ Roblox",
    archives_vols: "เล่มที่ 1-5",
    archives_tagline: "บันทึกการเติบโตของเมตาเวิร์สระดับโลก",
    exhibit_time: "เวลาจัดแสดงนิทรรศการ:",
    est_date: "ก่อตั้งเมื่อ:",
    internal_use: "สำหรับใช้ภายในเท่านั้น",
    copyright_corp: "Roblox Corporation — แค็ตตาล็อกจดหมายเหตุภายในอย่างไม่เป็นทางการ สร้างขึ้นเพื่อการศึกษาและการวิจัยเชิงประวัติศาสตร์",
    all_trademarks: "เครื่องหมายการค้าจดทะเบียน สินทรัพย์ตัวละคร โลโก้ และอัลกอริทึมฟิสิกส์ทั้งหมดเป็นของ Roblox Corporation",
    server_node: "โหนดเซิร์ฟเวอร์ประวัติศาสตร์ #09",

    // Tabs
    tab_slides: "สไลด์นิทรรศการ",
    tab_slides_short: "สไลด์",
    tab_database: "ฐานข้อมูล",
    tab_db_short: "ข้อมูล",
    tab_sandbox: "แซนด์บ็อกซ์",
    tab_sandbox_short: "แซนด์บ็อกซ์",
    tab_studio: "สตูดิโอ AI",
    tab_studio_short: "สตูดิโอ",
    studio_download: "ดาวน์โหลด PNG",

    // Bot Verification
    bot_title: "ขั้นตอนการยืนยันตัวตนย้อนยุค",
    bot_subtitle: "ระบบคัดแยกบอตแบบจำลอง: พิสูจน์ว่าคุณคือมนุษย์",
    bot_instruction_1: "Roblox เปิดตัวอย่างเป็นทางการหลังกำหนดสิ้นสุดเวอร์ชันเบต้าให้กับสาธารณชนในปีใด?",
    bot_instruction_2: "สกุลเงินรายวันที่แจกให้ผู้ใช้อย่างเสรีและถูกยกเลิกไปในปี 2016 มีชื่อว่าอะไร?",
    bot_wrong: "คำตอบไม่ถูกต้อง ถูกปฏิเสธการเข้าถึง! โปรดลองอีกครั้ง",
    bot_verify_btn: "ยืนยันตัวตน",

    // Cover page
    cover_presentation: "การนำเสนอประวัติศาสตร์",
    cover_title_pres: "หอจดหมายเหตุ ",
    cover_title_archives: "Roblox",
    cover_subtitle: "ประวัติศาสตร์ฉบับสมบูรณ์: เล่มที่ I — V",
    cover_description: "สำรวจยี่สิบปีของฟิสิกส์จำลอง การเปลี่ยนผ่านระบบเศรษฐกิจ วัฒนธรรมชุมชน อาการระบบล่มครั้งใหญ่ และนวัตกรรมทางเทคโนโลยีระดับโลก",
    cover_btn_journey: "เริ่มต้นการเดินทาง",
    cover_btn_sandbox: "เปิดสนามทดลองแซนด์บ็อกซ์",
    cover_scroll_hint: "▼ เลื่อนลงด้านล่าง หรือคลิก 'เริ่มต้น' เพื่อสำรวจสารคดีแต่ละเล่ม",

    // Slide View / Volumes
    volume_lbl: "เล่มที่",
    scope_theme: "หัวข้อประวัติศาสตร์",
    nav_intro: "บทนำนิทรรศการ",
    nav_slide_num: "สไลด์ 0{0} / 0{1}",
    nav_presentation_deck: "แผงนำเสนอข้อมูลส่วนบุคคลแบบโต้ตอบ",
    snippet_category: "ประเภท",
    snippet_record: "รหัสนิทรรศการถาวร",
    snippet_read_story: "อ่านเรื่องราวเชิงลึก",
    nav_interaction_tip: "สามารถนำทางโดยใช้ปุ่มลูกศรหรือปุ่มลูกศร ซ้าย/ขวา บนแป้นพิมพ์",
    nav_click_card: "คลิกบนการ์ดเพื่อขยายข้อมูลทางประวัติศาสตร์",
    nav_btn_prev: "ย้อนกลับ",
    nav_btn_next: "เล่มถัดไป",
    nav_btn_open_sandbox: "เปิดแซนด์บ็อกซ์",

    // Expanded Drawer
    drawer_hdr: "บันทึกข้อมูลจดหมายเหตุถาวร",
    drawer_deep_invest: "การสืบสวนเชิงลึก:",
    drawer_close: "ปิดบันทึก",
    drawer_test_sim: "ทดลองโปรแกรมจำลอง",

    // Sandbox Core
    sandbox_hdr: "โซนจำลองแบบโต้ตอบ",
    sandbox_title: "ห้องจำลองประวัติศาสตร์แซนด์บ็อกซ์",
    sandbox_desc: "สัมผัสประสบการณ์ทฤษฎีทางเศรษฐศาสตร์ สถาปัตยกรรมทางเทคนิค และระบบกฎเกณฑ์เกมสัญลักษณ์ที่มีอิทธิพลต่อการเติบโตของ Roblox เล่นกับเครื่องจำลอง ลงทุนไอเทมหรู ตรวจสอบเซิร์ฟเวอร์ล่ม และทำแบบทดสอบภูมิปัญญา",
    section_economy: "ระบบทดสอบมิติเศรษฐกิจ (เล่มที่ I และ V)",
    section_tech: "ระบบทดสอบวิศวกรรมคอร์และประวัติศาสตร์ (เล่มที่ III และ IV)",

    // DevEx Calc
    devex_title: "เครื่องคำนวณอัตราแลกเปลี่ยนแปลงค่าเงิน DevEx",
    devex_robux_bal: "ยอดเงิน Robux จำลองของคุณ",
    devex_target_amt: "จำนวน Robux ที่ต้องการถอนออก",
    devex_rate_text: "อัตรามาตรฐานของระบบปัจจุบัน: $0.0035 ต่อ Robux",
    devex_formula: "อัตราแลกเปลี่ยนมาตรฐาน (0.0035 USD/Robux)",
    devex_formula_premium: "อัตราผู้สร้างพิเศษสำหรับครีเอเตอร์ระดับสูง (0.0045 USD/Robux)",
    devex_live_conversion: "การคำนวณมูลค่าความจริงตามเวลาปัจจุบัน",
    devex_cash_val: "มูลค่าความจริง (USD)",
    devex_annual_estimate: "รายได้ของนักพัฒนาสำหรับโปรเจกต์ต่อปี (คำนวณจากเสกลจำลอง)",
    devex_button_cashout: "ถอนเงินสดเข้าบัญชีธนาคารจำลอง",
    devex_success_alert: "แปลง {0} Robux เป็นมูลค่า ${1} USD เรียบร้อย!",
    devex_error_robux: "ยอดเงิน Robux ของคุณไม่เพียงพอสำหรับการทำธุรกรรม ลองทำแบบทดสอบหรือซื้อขายในตลาด Limiteds เพื่อสะสมยอดเงินเพิ่ม!",
    devex_empty: "กำหนดค่าตัวเลขที่ต้องการส่งถอน",

    // Trading Game
    trading_title: "ระบบจำลองตลาดซื้อขายสินค้าจำกัด (Limiteds)",
    trading_balance: "ยอดเงินจำลองในความครอบครองของคุณ",
    trading_market_status: "กระดานตรวจสอบและการเก็งกำไรสินค้าหายาก (Digital Assets Trading Ledger)",
    trading_trend: "แนวโน้มราคาตลาดในรอบ 6 ชั่วโมง",
    trading_owned: "ครอบครองอยู่: {0} ชิ้น",
    trading_buy: "สั่งซื้อไอเทม",
    trading_sell: "ขายทำกำไร",
    trading_guest_prompt: "กรุณาจัดตั้งข้อมูลประวัติผู้ใช้หรือเข้าสู่ระบบเพื่อดำเนินการซื้อขาย",
    trading_no_funds: "ยอดเหรียญ Robux ของคุณไม่เพียงพอสำหรับการครอบครองไอเทมหรูนี้!",
    trading_no_items: "คุณไม่ได้มีไอเทมชิ้นนี้อยู่ในตัวสำหรับการทำรายการขายเก็งกำไร!",
    trading_success_buy: "ดำเนินการจัดซื้อ 1x {0} ในราคา R$ {1} สำเร็จแล้ว!",
    trading_success_sell: "ดำเนินการขาย 1x {0} เพื่อเพิ่มยอด Robux จำนวน R$ {1} สำเร็จแล้ว!",

    // Server Fixer
    server_title: "หน้าตรวจสอบระบบสถาปัตยกรรมปรับสมดุลเวิร์กโหลดเครื่อง (Consul Core Debugger)",
    server_status_critical: "สถานะโหนดคลัสเตอร์เซิร์ฟเวอร์: วิกฤตโอเวอร์โหลดความร้อนสูง",
    server_status_stable: "สถานะโหนดคลัสเตอร์เซิร์ฟเวอร์: คลื่นเสถียรปกติ",
    server_description: "วิเคราะห์อาการระบบขัดข้องล่มปิดตัว 73 ชั่วโมงในเดือนตุลาคม 2564 ปรับสมดุลข้อมูลผู้ใช้ข้ามภูมิภาคเพื่อให้การโหลด CPU ไม่เกิน 80%",
    server_active_regions: "การจัดสรรโหลดตามภูมิภาคเซิร์ฟเวอร์ทั่วโลก",
    server_fix_button: "ติดตั้งแพตช์ด่วนปรับปรุงระบบวิศวกรรม",
    server_stabilized: "ระบบคลัสเตอร์ Consul ได้รับเสถียรภาพรันปกติแล้ว! โค้ดสีเขียวปกติ (+รับโบนัส R$ 15,000)",
    server_unstable: "คำเตือน: โหนดเวิร์กโหลดเครื่องยังพังไม่สมดุล ลากสไลเดอร์ปรับเปลี่ยนตัวเลขเพื่อแก้ไข!",
    server_load_lbl: "โหลดวิศวกรรม",

    // History Quiz
    quiz_title: "แบบทดสอบวัดระดับปัญญาประวัติศาสตร์ Roblox",
    quiz_state: "คำถามข้อที่ {0} จากทั้งหมด {1} ข้อ",
    quiz_check_btn: "ยืนยันคำตอบ",
    quiz_correct: "ถูกต้องเป็นเอกฉันท์!",
    quiz_incorrect: "ยังไม่ถูกต้อง!",
    quiz_explanation_hdr: "คำอธิบายเชิงลึก:",
    quiz_next: "เลื่อนไปคำถามถัดไป",
    quiz_finished_hdr: "สรุปผลการทดสอบสติปัญญาประวัติศาสตร์",
    quiz_finished_raw: "คะแนนที่ได้รับตามเป้าคือ: ตอบถูก {0} จากทั้งหมด {1} ข้อ",
    quiz_finished_bonus: "ได้รับการอนุมัติมอบโบนัสยอดเหรียญ Robux สำเร็จ!",
    quiz_restart: "เริ่มทำข้อสอบคำถามใหม่อีกรอบ",
    quiz_realtime: "🌐 ข้อมูลผลลัพธ์คลาวด์แบบเรียลไทม์ (Google Firestore)",

    // User Authentication
    auth_verified: "ลงชื่อด้วยบัญชี Google แล้ว",
    auth_local: "โปรไฟล์ส่วนท้องถิ่น",
    auth_logout_tooltip: "ออกจากระบบปัจจุบัน",
    auth_signin: "ลงชื่อเข้าใช้",
    auth_signup: "สมัครบัญชีใหม่",
    auth_cloud_sync: "เครื่องเชื่อมผสานข้อมูล Google Cloud",
    auth_assemble_persona: "จัดแต่งประลักษณ์โปรไฟล์ผู้เล่น Roblox ของคุณ",
    auth_verified_google: "ยืนยันสิทธิ์จากบัญชี Google สำเร็จ: {0}. จัดตั้งฐานโปรไฟล์และอวตารของคุณเพื่อเก็บคะแนนสะสมและยอดธนาคารไว้บนระบบคลาวด์อย่างปลอดภัยถาวร",
    auth_choose_handle: "กำหนดชื่อบัญชีผู้เล่น (Username) ของคุณ",
    auth_select_avatar_rig: "เลือกโครงร่างรูปลักษณ์ตั้งต้น",
    auth_desc_classic_noob: "โมเดลระดับตำนาน ตัวสีเหลืองกางเกงสีเขียวผู้โด่งดัง",
    auth_desc_bacon_hair: "สไตล์ทรงผมเบคอนสำหรับพลเมืองยุคคลาสสิก",
    auth_desc_guest: "ตัวอวตารผู้สังเกตการณ์ที่เงียบสงบสวมหมวกแก๊ป",
    auth_desc_valk: "ประดับสมญาด้วยปีกทองเทวีแห่งระบอบชนชั้นสูง",
    auth_desc_builder: "สวมหมวกนิรภัยพร้อมบล็อกโครงสร้างกายภาพสำหรับการก่อร่าง",
    auth_desc_founder: "รูปลักษณ์ผู้มีวิสัยทัศน์สูงสุดของท่านผู้ก่อตั้งระบบ",
    auth_link_btn: "เชื่อมมิติโปรไฟล์เข้าคลาวด์แบบถาวร",
    auth_auth_authority: "ลงชื่อเข้าร่วมสิทธิ์หอกลางถาวร",
    auth_registrar: "ระบบจดสิทธิ์แอดมิน Registrar",
    auth_desc_main: "ลงชื่อเข้าใช้เพื่อเปิดระบบแคชประวัติส่วนบุคคลและเข้าเล่นด้วยคะแนนที่ซิงค์อย่างสมบูรณ์ รักษาความปลอดภัยด้วย Firebase",
    auth_continue_google: "ดำเนินต่อโดยใช้บัญชี Google",
    auth_or_use_legacy: "หรือใช้ชื่อโครงสร้างไฟล์ผู้เล่นจำลองในตัวระบบดิจิทัล",
    auth_local_profiles_hdr: "รายชื่อบัญชีนักลุยด่านท้องถิ่นสำเร็จรูป",
    auth_delete_success: "บัญชีระบบผู้ดูแลหลักไม่ได้รับสิทธิ์ทำลายและทิ้งร่องรอยได้",
    auth_hint_node: "คำใบ้: ล็อกอินด้วยผู้ดูแลระบบหลัก username คือ builderman รหัสผ่าน classic2006",
    auth_local_un: "ระบุชื่อบัญชีผู้เล่น",
    auth_pin: "ระบุรหัสผ่านบัญชีท้องถิ่น PIN",
    auth_auth_entry: "ตรวจสอบใบรับรองความถูกต้อง",
    auth_deploy: "ทำการจัดตั้งบัญชีถาวร",
    auth_no_account: "จัดตั้งสิทธิ์ใหม่",
    auth_has_account: "กลับไปเข้าสิทธิ์เดิม?",
    auth_cloud_active: "ฐานเซิร์ฟเวอร์ Firebase จัดการระบบอยู่เบื้องหลัง",
    auth_ver_layer: "ระบบรักษาความปลอดภัยเวอร์ชัน Auth v2.0",
    auth_welcome: "ยินดีต้อนรับการกลับเข้าสู่การตรวจสอบประวัติศาสตร์, {0}!",
    auth_err_handle_len: "ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษรขึ้นไป",
    auth_err_handle_chars: "ชื่อผู้ใช้สามารถประกอบขึ้นจากตัวอักษรภาษาอังกฤษ ตัวเลข และขีดล่าง (_) เท่านั้น",
    auth_err_pin_len: "รหัสผ่าน PIN ต้องยาวไม่น้อยกว่า 4 ตัวอักษร",
    auth_err_dup: "ชื่อผู้ใช้จำลองนี้ถูกจดจัดตั้งใช้งานโดยบุคคลอื่นไปแล้ว",
    auth_gateway: "กำลังพยายามเปิดระบบเกตเวย์ความปลอดภัย Google Cloud...",
    auth_google_verified: "ยืนยันความปลอดภัยบัญชี Google สำเร็จ!",
    auth_complete_db_lock: "จัดตั้งทะเบียนประวัติศาสตร์สำเร็จ! การรับรองความปลอดภัยเสร็จสิ้น",
    auth_err_invalid: "ชื่อผู้ใช้พิมพ์หรือ PIN ผิดพลาด (คำใบ้: ลองใช้ builderman / classic2006 สำหรับตัวทดสอบ)",
    auth_deployed_success: "ระบบได้ทำการปล่อยรหัสผ่านจำลองและข้อมูลของคุณเข้าสู่คลังประวัติศาสตร์เรียบร้อย!",
    auth_logged_in_as: "เข้าควบคุมเซิร์ฟเวอร์หลักนักประวัติศาสตร์: {0}!"
  }
};

// Localized raw databases to ensure even the slide volumes & quizzes translate for maximum fidelity and immersion
export const LOCALIZED_VOLUMES = (lang: Language): Volume[] => {
  if (lang === "th") {
    return [
      {
        id: 1,
        romanId: "เล่มที่ I",
        title: "จุดกำเนิดและรากฐาน",
        subtitle: "ปี 2004-2021 รากฐานที่หยั่งลึกลงสู่ดิน",
        snippets: [
          {
            id: "v1-1",
            title: "จาก DynaBlocks สู่ Roblox",
            icon: "Layers",
            description: "ก่อตั้งโดย David Baszucki และ Erik Cassel โดยมีรากฐานมาจากโปรแกรมจำลองฟิสิกส์แบบโต้ตอบ เปิดตัวเป็นสาธารณะตัวเต็มนอกเหนือเวอร์ชันเบต้าในปี 2006",
            extendedDetails: "ก่อนที่จะมาเป็น Roblox คุณ David Baszucki ได้ก่อตั้ง Knowledge Revolution ซึ่งผลิตซอฟต์แวร์ฟิสิกส์ 2 มิติเพื่อการศึกษาชื่อ Interactive Physics การนำกลศาสตร์ของเครื่องยนต์นี้มาจัดแต่งในโลกบล็อก 3 มิติก่อกำเนิด DynaBlocks และแบรนด์ถูกเปลี่ยนเป็น Roblox ในปี 2005 ตั้งแต่นั้นผู้ใช้เริ่มสร้างโลกของตนเองทีละกล่องอย่างเสรี",
            category: "milestone",
            stats: { label: "เปิดตัวรุ่นเบต้า", value: "ปี 2004-2006" }
          },
          {
            id: "v1-2",
            title: "การเปลี่ยนผ่านของระบบ DevEx",
            icon: "Coins",
            description: "โครงการนักพัฒนาแลกเปลี่ยน (Developer Exchange) ในปี 2013 ทำให้นักพัฒนาสามารถแปลง Robux เป็นเงินจริง เปิดโอกาสสำหรับนักพัฒนาอาชีพ",
            extendedDetails: "ก่อนหน้าโครงการ DevEx เกมเกือบทั้งหมดถูกจัดสร้างขึ้นด้วยความหลงใหลในชุมชนหรือไอเทมจำลอง การปรับปรุงส่งเสริมให้นำ Robux แลกเปลี่ยนเป็นเงินดอลลาร์สหรัฐได้เปลี่ยนความหลงใหลนี้ให้กลายเป็นอาชีพสร้างรายได้อย่างยั่งยืน แบรนด์สตูดิโอด้านการทำเกมหลายแห่งกำเนิดขึ้นมาเพื่อทำฟูลไทม์เป็นอุตสาหกรรมในเวลาต่อมา",
            category: "economy",
            stats: { label: "เริ่มใช้ครั้งแรก", value: "ตุลาคม 2013" }
          },
          {
            id: "v1-3",
            title: "การเสนอขายหุ้นแก่ประชาชนทั่วไป (NYSE: RBLX)",
            icon: "TrendingUp",
            description: "ในปี 2021 บริษัท Roblox เข้าจดทะเบียนในตลาดหลักทรัพย์นิวยอร์ก ส่งสัญญาณมิติความสำเร็จมูลค่ากว่า 41,000 ล้านดอลลาร์สหรัฐ",
            extendedDetails: "หุ้นของ RBLX เริ่มทำการเปิดตลาดพุ่งขึ้นในวันที่ 10 มีนาคม 2021 ที่ราคา 64.50 ดอลลาร์ เหตุการณ์นี้ยืนยันว่า Roblox ไม่ใช่แค่แพลตฟอร์มเกมเด็กเล่นทั่วไป แต่เป็นผู้บุกเบิกเทคโนโลยีโซเชียลอินเทอร์เน็ตที่แข็งแกร่ง ย้ำเตือนผลตอบแทนทางเศรษฐกิจจากการจัดทำแชร์ไอเดียของผู้มีส่วนร่วมสร้างสรรค์จากทั่วโลก",
            category: "milestone",
            stats: { label: "มูลค่าประเมินตลาดหลักทรัพย์", value: "4.1 หมื่นล้านดอลลาร์" }
          }
        ]
      },
      {
        id: 2,
        romanId: "เล่มที่ II",
        title: "วัฒนธรรมและแบบแผนเศรษฐกิจ",
        subtitle: "สกุลเงิน คาแรกเตอร์ และแบรนด์เสมือนจริง",
        snippets: [
          {
            id: "v2-1",
            title: "อวสานและจุดจบของ Tix",
            icon: "Ticket",
            description: "ในปี 2559 แพลตฟอร์ม Roblox ตัดสินใจยกเลิกแต้มตั๋วฟรี 'Tickets' ประจำวันแบบดั้งเดิม เพื่อลดบอตและจัดระเบียบเศรษฐกิจให้อยู่ที่ Robux อัตราเดียว",
            extendedDetails: "ตั๋ว (หรือ Tix) มอบให้ผู้ใช้ฟรีเป็นของขวัญเข้าใช้งานรวมถึงเมื่อมีเพื่อนเก่าเข้ามาในโลก สกุลเงินนี้ถูกรักโดยสายฟรีมาก แต่ทำให้เกิดผลเสียคือบอตปริมาณมหาศาลปั๊มยอดเอาไปแปรธาตุแลกเปลี่ยนเป็น Robux อีกทอดหนึ่ง แม้การตัดสินใจนำออกก่อให้เกิดฉากไว้อาลัยทั่วโลก แต่ช่วยประคับประคองมูลค่าตลาดได้ดีขึ้น",
            category: "economy",
            stats: { label: "วันที่ยกเลิกและถอนออก", value: "เมษายน 2559" }
          },
          {
            id: "v2-2",
            title: "อวตารและอัตลักษณ์จำลอง",
            icon: "User",
            description: "ตั้งแต่รูปลักษณ์เหลืองเขียวสุดคลาสสิกของ 'Noob' ไปสู่ทรงผมผู้หญิงแบบถั่ว และชายแบบผมเบคอนพริ้วไหว กลายเป็นสัญลักษณ์ตลกประจำคอมมูนิตี้",
            extendedDetails: "คู่สีของอวตารหัวสีเหลือง ตัวสีน้ำเงิน และขาเสื้อสีเขียวคือเครื่องแต่งกายสายไม่เติมนอกระบบที่ถูกให้คำนิยามว่า Noob เมื่อชุดคาแรกเตอร์อัปเดตเป็น R15 รูปแบบผมเบคอนก็เริ่มขยายวงเป็นสัญลักษณ์ของการล้อเลียนความแกร่ง ปัจจุบันของสิ่งนี้กลายเป็นสัญลักษณ์อันทรงค่าที่โปรเพลเยอร์สวมใส่เพื่อสะท้อนความเคารพในรสนิยมอดีต",
            category: "community",
            stats: { label: "จำนวนอวตารสะสม", value: "มากกว่า 2,000 ล้านชิ้น" }
          },
          {
            id: "v2-3",
            title: "โอบรับแบรนด์ดังสู่เมตาเวิร์ส",
            icon: "Sparkles",
            description: "แบรนด์หรูแวดวงศิลปะอย่าง Gucci, Nike และ Vans เริ่มต้นสร้างโลกแบรนดิ้งถาวรของตนเองเพื่อดึงดูดฐานผู้ใช้รุ่นใหม่",
            extendedDetails: "กรณีศึกษาเด่นเกิดในนิทรรศการ 'Gucci Garden' ปี 2021 เมื่อผู้ใช้ซื้อขายจัดจำหน่ายกระเป๋าถือดิจิทัลรูปผึ้งตัวละครต่อในราคารีเซลสูงลิ่วถึง $4,115 (สูงกว่าราคากระเป๋าหนังใบทางกายภาพในชีวิตจริง) สะท้อนให้เห็นว่าสินทรัพย์เสมือนจริงส่งทอดคุณค่าทางใจที่คนรุ่นใหม่พร้อมเปย์ไม่น้อยกว่าวัตถุอื่น",
            category: "community",
            stats: { label: "ยอดเข้าชมแบรนด์เฉลี่ย", value: "30 ล้านครั้งต่อสัปดาห์" }
          }
        ]
      },
      {
        id: 3,
        romanId: "เล่มที่ III",
        title: "ความท้าทายและความก้าวหน้า",
        subtitle: "การคุ้มกัน สเกลการเติบโต และความล้มเหลวครั้งยิ่งใหญ่",
        snippets: [
          {
            id: "v3-1",
            title: "คืนดับฝัน 73 ชั่วโมงแรก",
            icon: "WifiOff",
            description: "ตุลาคม 2021 ระบบหลักพังเสียหายล่มยาวนานเกือบสามวัน มีเรื่องตลกเล่ากันอ้างว่าต้นเหตุคือโปรโมชันแลกแจกทาโก้ฟรีของแบรนด์ Chipotle",
            extendedDetails: "เหตุการณ์ล่มเกิดวันที่ 28 ต.ค. 2021 ชุมชนทวีตคุยแซวว่าคนแห่ไปรับเบอร์ริโตฟรีร้านอาหารจนโหลดเซิร์ฟเวอร์แตก แต่สาเหตุทางเทคนิคลึกซึ้งแท้จริงคือความผิดพลาดโหมดคลัสเตอร์คอนซูล (Consul service config) การล็อกค่าข้อมูลจำนวนมหาศาลทำให้สายเคเบิลสะดุด ข้อมูลส่งไม่ข้ามภาคส่วน นักพัฒนาต้องสู้สุดกำลังกว่าความเสถียรจะคืนกลับมาครบ",
            category: "tech",
            stats: { label: "เวลาที่ออฟไลน์พังลง", value: "73 ชั่วโมงติดต่อกัน" }
          },
          {
            id: "v3-2",
            title: "กลุ่มตลาดผู้ใหญ่ (คอนเทนต์ 17+)",
            icon: "ShieldAlert",
            description: "เพื่อตอบรับกับกลุ่มผู้เล่นอายุที่เพิ่มมากขึ้น แพลตฟอร์มเปิดโซนจำกัดสำหรับคนสิทธิ์ยืนยันบัตรประชาชนที่สามารถใส่ความตลกแบบหยาบและธีมเข้มข้นได้",
            extendedDetails: "ภาพลักษณ์เกมเด็กเล็กได้เปลี่ยนผ่านไปไกลหลังพบประวัติสัดส่วนเกินครึ่งเป็นวัยทำงานและมหาลัย อายุ 17-24 ปีเติบโตรวดเร็วที่สุด แพลตฟอร์มจึงประกาศมอบเนื้อหาพิเศษเพื่อให้นักเขียนโปรแกรมระดับโปรสร้างสรรค์การจำลองและการพูดคุยที่มีวุฒิภาวะเต็มตัวโดยไม่ปิดกั้น",
            category: "community",
            stats: { label: "กลุ่มอายุเป้าหมาย", value: "กลุ่มยศการตรวจสอบ 17+" }
          },
          {
            id: "v3-3",
            title: "เปิดประตูเมือง Bloxburg ฟรี",
            icon: "Home",
            description: "เกมสร้างครอบครัวออกแบบสถาปัตยกรรมระดับท็อปอย่าง Welcome to Bloxburg ประกาศเปลี่ยนผ่านเข้าสู่ยุคเล่นฟรีในปี 2024",
            extendedDetails: "เกมประวัติศาสตร์ชิ้นนี้สร้างโดยนักพัฒนา Coeptus และได้รับความนิยมในการปั้นบ้านเป็นอาณาจักร ยืนหยัดเก็บค่าผ่านทาง 25 Robux มาเป็นสิบปี เมื่อประกาศยกเลิกค่าบริการเกิดกระแสแบ่งแยกคนเล่นเก่าขึ้นอย่างสนุกๆ มีการสร้างรั้วกั้นกีดขวางผู้เข้าเมืองหน้าใหม่ไม่ให้เข้าถึงบ้านสวยส่วนบุคคล",
            category: "community",
            stats: { label: "สถิติการเข้าเยี่ยมชม", value: "มากกว่า 1.5 หมื่นล้านครั้ง" }
          }
        ]
      },
      {
        id: 4,
        romanId: "เล่มที่ IV",
        title: "คอมมูนิตี้และขุมพลังเทค",
        subtitle: "กิจกรรมล่าไข่ ประสบการณ์ดนตรีเสมือนจริง และระบบแสงเงาที่คล้ายความจริง",
        snippets: [
          {
            id: "v4-1",
            title: "การลล่าไข่ในตำนาน Egg Hunts",
            icon: "Award",
            description: "เริ่มจัดตั้งแต่ปี 2008 และกลายเป็นพิธีกรรมเทศกาลอีสเตอร์ที่สำคัญ ต่อยอดเป็นมินิเกมล่ารางวัลสุดยิ่งใหญ่อย่างแพร่หลายทุกปี",
            extendedDetails: "แรกเริ่มพนักงานแอบวางไข่ในแผนที่หลัก ไม่นานประเพณีนี้ได้รับการขยายเป็นแนวผจญภัยเน้นเนื้อเรื่องเข้มข้น (เช่น มหากาพย์ Egg Hunt 2018) จนกระทั่งเปลี่ยนโหมดเป็นแบบล่าข้ามเครือข่ายของนักพัฒนาทุกคน (Decentralized Model) ทวีคูณความสนุกขึ้นอย่างยิ่งสำหรับเพื่อนทุกวัย",
            category: "community",
            stats: { label: "การเปิดฉากครั้งแรก", value: "เมษายน 2008" }
          },
          {
            id: "v4-2",
            title: "ยุคการแสดงดนตรีเสมือน",
            icon: "Music",
            description: "คอนเสิร์ต Lil Nas X ในปี 2020 ทำยอดผู้ชมมากถึง 33 ล้านครั้ง บุกเบิกตลาดพาร์ตเนอร์ความบันเทิงระดับโลก",
            extendedDetails: "กิจกรรมการแสดงนำเสนอโมชั่นแคปเจอร์ดีไซน์และดีไซน์ร่างอวตาร Lil Nas X ขนาดเขียวขจียักษ์เดินร้องเพลงซาวด์แทร็กแสนคุ้นเคย ทรานซิชันโลกไปสู่มิติลอยตัวท่ามกลางเอฟเฟกต์แสง สี เสียงสุดอลังการ ส่งต่อให้ศิลปินท่านอื่นอาทิ Zara Larsson และ Charli XCX เข้ามาร่วมลุยงานแสดงในเวลาต่อมา",
            category: "community",
            stats: { label: "ยอดเข้าชมสูงสุดร่วมกัน", value: "33 ล้านวิว" }
          },
          {
            id: "v4-3",
            title: "ระบบแสงเงาแห่งอนาคต",
            icon: "Zap",
            description: "เปิดตัวระบบเอนจินส่องสว่างจัดระเบียบ Voxel Lighting แสงตกกระทบที่สมจริง การไล่เฉดสีทอประกายใกล้เคียงกราฟิก Unreal Engine",
            extendedDetails: "โปรเจกต์ 'Future is Bright' มุ่งอัปเกรดรายละเอียดให้แก่แผนที่ สลัดคราบงานภาพบล็อกสี่เหลี่ยมด้านแบนหยาบๆ ทิ้งไปโดยสิ้นเชิง เปลี่ยนมาเล่นกับเงาตกกระทบบนจุดพิกเซล แสงสะท้อนวัสดุเงาโลหะ ผิวน้ำ และบรรยากาศอณูเมฆหมอก ดึงดูดสายตาได้อย่างเหลือเชื่อสร้างโลกเสมือนสไตล์ Cinematic",
            category: "tech",
            stats: { label: "เทคโนโลยีเรนเดอร์ภาพ", value: "Phase 3 Voxel (ฟิวเจอร์)" }
          }
        ]
      },
      {
        id: 5,
        romanId: "เล่มที่ V",
        title: "ระบบเครือข่ายเซิร์ฟเวอร์ยักษ์และเรื่องลี้ลับ",
        subtitle: "ความแข็งแกร่งเชิงเอจน์คอมพิวติ้ง และตำนานลึกลับประจำยุคคลาสสิก",
        snippets: [
          {
            id: "v5-1",
            title: "โครงข่ายการคำนวณยืดหยุ่น Edge Network",
            icon: "Server",
            description: "Roblox วางสถาปัตยกรรมโฮสต์ประมูลพื้นที่คอมพิวเตอร์แบบกระจายตัว แสวงหาโหนดเอจน์ที่อยู่ใกล้ผู้ใช้ที่สุดเพื่อแก้ตรรกะดีเลย์ฟิสิกส์ให้ต่ำเตี้ยที่สุด",
            extendedDetails: "เพื่อรองรับกับการขับเคลื่อนวัตถุกายนับล้านพร้อมกัน เช่น แรงระเบิด ชิ้นส่วนบล็อกพังทลาย รถยนต์ชนกัน Live สดแก่ผู้ใช้จำนวนมาก Roblox ไม่พึ่งพากลไกเซิร์ฟเวอร์รวบคำนวณที่เดียว แต่กระจายศูนย์แบบไฮบริดคลาวด์ มอบจุดเชื่อมที่ว่องไวเพื่อลดจังหวะแล็กให้ต่ำกว่า 50 มิลลิวินาที",
            category: "tech",
            stats: { label: "ความล่าช้า Live เซิร์ฟเวอร์", value: "ต่ำกว่า 50 ล้านวินาที" }
          },
          {
            id: "v5-2",
            title: "ตำนานลี้ลับรอบโรงเรียนและแผนที่ผี",
            icon: "Eye",
            description: "เรื่องสยองขวัญเล่าลือยุคเก่าครอบงำชุมชนอย่างกรณีแฮกเกอร์ 'John Doe' และการตามล่าเรื่องราวปริศนาช่วยสร้างความน่าตื่นเต้นให้แก่เด็กๆ",
            extendedDetails: "ความเชื่อหลอนๆ ในอดีตเรื่อง 'John Doe' และ 'Jane Doe' บัญชีทดลองระบบคลาวด์ที่คุณบัสซุกิตั้งขึ้นมาในปี 2005 บอกว่าจะแฮกระบบถล่มในวันที่ 18 มีนาคม ก่อให้เกิดกลุ่มนักล่าท้าทายจดบันทึก แอบลุยสำรวจแผนที่ลับลึกซึ้ง แผนที่เข้มข้นคัทซีนสั่นประสาทที่สร้างโดยบุคคลปริศนาเช่นกลุ่มแก๊งลัทธิลึกลับ",
            category: "community",
            stats: { label: "ความตื่นตระหนกแฮกเกอร์", value: "วิกฤตตื่นตูม 18 มีนาคม" }
          },
          {
            id: "v5-3",
            title: "เศรษฐศาสตร์ของตลาดสินค้ารุ่นลิมิเต็ด",
            icon: "Gem",
            description: "บุกเบิกแนวคิดความขาดแคลนจำกัดจำนวนของดิจิทัล หมวดประดับศีรษะอย่างมงกุฎและซีรีส์ Dominus มีราคาซื้อขายเปรียบเสมือนหุ้นตลาดระดับทอง",
            extendedDetails: "กลไกออกของสะสมควบคุมจำนวนที่ปล่อยหล่อหลอมวัฏจักรเศรษฐกิจขึ้นอย่างมีเสน่ห์ลุ่มลึก ซีรีส์ไอเทม Dominus มีชิ้นที่ปล่อยออกมาหลักสิบชิ้นในประวัติศาสตร์ ทำให้มูลค่าการรีเซลพุ่งสูงหลักล้าน Robux สอนบทเรียนกลไกเก็งกำไรและการประเมินความเสี่ยงให้กลุ่มเยาวชนฝึกวิชาหาเงินตั้งแต่เล็ก",
            category: "economy",
            stats: { label: "มงกุฎสูงสุดของประวัติศาสตร์", value: "ตระกูล Dominus Series" }
          },
          {
            id: "v5-4",
            title: "การปฏิวัติบนมือถือ",
            icon: "Smartphone",
            description: "Roblox เปิดตัวบนระบบปฏิบัติการ iOS ในปี 2012 และ Android ในปี 2014 ส่งผลให้ฐานผู้เล่นเริ่มย้ายเข้าสู่แพลตฟอร์มพกพาเป็นหลัก",
            extendedDetails: "การเปิดตัว Roblox บนอุปกรณ์มือถือได้เปลี่ยนโฉมโครงสร้างกลุ่มประชากรและความเร็วในการขยายตัวของแพลตฟอร์มอย่างสิ้นเชิง การเพิ่มประสิทธิภาพการออกแบบระบบควบคุมแบบสัมผัสและอินเทอร์เฟซที่ปรับเปลี่ยนรูปได้สมบูรณ์แบบทำให้นักเล่นเกมหน้าใหม่หลายล้านคนทั่วโลกเข้าถึงแพลตฟอร์มได้อย่างครอบคลุม ปัจจุบันผู้เล่นมากกว่า 70% เข้าเล่นผ่านโทรศัพท์พกพาแทนที่จะพึ่งพาคอมพิวเตอร์แบบตั้งโต๊ะ",
            category: "milestone",
            stats: { label: "การเข้าใช้งานผ่านมือถือ", value: "มากกว่า 70% ของผู้ใช้" }
          },
          {
            id: "v5-5",
            title: "ยุคสมัยเว็บฟอรัมบอร์ด (2006-2017)",
            icon: "MessageSquare",
            description: "ยุครุ่งเรืองของการพูดคุยบนเว็บบอร์ดสาธารณะของ Roblox ยุคแรก ที่ผู้ใช้วิ่งกระแสตระกูล คลับ ดีเบต รวมถึงตลาดกลางการค้าขาย ก่อนที่จะปิดตัวไปในช่วงปลายปี 2017",
            extendedDetails: "ฟอรัมบอร์ด Roblox เป็นหนึ่งในศูนย์บัญชาการชุมชนในตำนาน ห้องย่อยอย่าง 'Roblox Talk' (RT), 'Let's Make a Game' (LMAD) หรือ 'Clans & Guilds' (C&G) กุมความลับประวัติศาสตร์ มุกตลก และมูลค่าตลาดเอาไว้มากมาย แต่เมื่อจำนวนผู้ใช้งานพุ่งสูงขึ้นการควบคุมคัดกรองเนื้อหาไม่สามารถทำได้อย่างรัดกุมรอบคอบ ส่งผลให้บอร์ดทั้งหมดถูกปิดตัวลงอย่างถาวรในเดือนธันวาคม 2017 เพื่อหันไปใช้ระบบ Developer Forum และสตรีมมิ่งโซเชียลสาธารณะที่ปลอดภัยกว่า",
            category: "community",
            stats: { label: "การยกเลิกเว็บฟอรัมบอร์ด", value: "ธ.ค. 2017" }
          },
          {
            id: "v5-6",
            title: "1x1x1x1: ตำนานแฮกเกอร์ลึกลับ",
            icon: "Terminal",
            description: "ตำนานแฮกเกอร์ผู้ยิ่งใหญ่ที่สุดในประวัติศาสตร์ Roblox ที่ถูกอ้างถึงในวิกฤตแฮกระบบเมษายน 2012 และเรื่องสยองขวัญปนสนุก",
            extendedDetails: "1x1x1x1 เริ่มต้นจากการเป็นเพียงบัญชีทดลองที่ทีมงาน Roblox จัดทำขึ้น แต่กลายมาเป็นหนึ่งในตำนานลึกลับและนิยายสยองขวัญในใจผู้เล่น โดยเฉพาะเหตุการณ์ภัยพิบัติเมษายน (April Fools' Day) ในปี 2012 ซึ่งระบบแฮกสามารถควบคุมหน้าจอส่งแถบสีเขียวพร้อมสร้างโมเดลหัวยักษ์หมุนเคว้งคว้างเต็มเมือง ทำให้ชื่อนี้สลักลึกเป็นสัญลักษณ์ยุคทองของผีแฮกเกอร์",
            category: "community",
            stats: { label: "ผู้ถูกกล่าวหาหลัก", value: "เหตุการณ์เมษายน 2012" }
          },
          {
            id: "v5-7",
            title: "สงครามเบื้องหลังไอคอนของ Guest",
            icon: "Swords",
            description: "ยุครุ่งเรืองที่มีกลุ่มผู้เล่นไม่ลงทะเบียนที่มีหมวกดำตัวเลขป้ายชื่อ 'Guest' สร้างความขบขัน ความวุ่นวาย และการปิดประวัติศาสตร์ถาวรปี 2017",
            extendedDetails: "ในอดีตผู้ที่พึ่งพาการกดสุ่มเล่นแบบไม่ลงทะเบียนจะเดินทางเข้ามาเป็น 'Guest' (พร้อมหมวกดำในตำนาน) ก่อให้เกิดสมครามสมมุติเบื้องหลังระหว่างกลุ่มสมาชิกจดทะเบียนและผู้เล่นรับเชิญที่เป็นใบ้พูดคุยไม่ได้ เพื่อยกระดับความปลอดภัยของผู้เยาว์และผลักดันยอดสมัครบัญชี Roblox จึงได้ทำการบอกลาลบคอนเซ็ปต์ Guest ทั้งหมดทิ้งในวันที่ 16 ตุลาคม 2017 จนกลายเป็นภาพจำแสนอบอุ่นในใจผู้เล่นยุคเก่า",
            category: "community",
            stats: { label: "ช่วงเวลาที่มีบทบาท", value: "พ.ศ. 2551 - 2560" }
          }
        ]
      }
    ];
  }

  // Fallback / default to English volume data
  return [
    {
      id: 1,
      romanId: "VOLUME I",
      title: "The Genesis",
      subtitle: "2004-2021 Foundations",
      snippets: [
        {
          id: "v1-1",
          title: "DynaBlocks to Roblox",
          icon: "Layers",
          description: "Founded by David Baszucki and Erik Cassel, originally rooted in an interactive physics simulator. Launched out of beta to the public in 2006.",
          extendedDetails: "Before Roblox, David Baszucki founded Knowledge Revolution, which built an educational 2D physics engine called Interactive Physics. Applying these mechanics to a 3D block environment led to DynaBlocks, rebranded as Roblox in 2005. Early builds were simple, featuring virtual brick-building in sandbox environments, laying the groundwork for user-generated worlds.",
          category: "milestone",
          stats: { label: "Beta Launch", value: "2004-2006" }
        },
        {
          id: "v1-2",
          title: "The DevEx Shift",
          icon: "Coins",
          description: "The 2013 Developer Exchange program changed everything, allowing creators to cash out Robux for real money, sparking a professional developer ecosystem.",
          extendedDetails: "Prior to DevEx, games were built for community passion or internal items. By enabling a conversion rate of Robux to US Dollars, Roblox turned game creation from a hobby into a lucrative career. Entire studios emerged (such as Redmanta and Uplift Games), employing developers, 3D artists, and project managers to build immersive experiences.",
          category: "economy",
          stats: { label: "Introduced", value: "Oct 2013" }
        },
        {
          id: "v1-3",
          title: "Going Public (NYSE: RBLX)",
          icon: "TrendingUp",
          description: "In 2021, Roblox listed on the NYSE via a direct listing, reaching a massive valuation of $41 Billion and proving the metaverse concept to Wall Street.",
          extendedDetails: "Listing under the ticker 'RBLX' on March 10, 2021, the direct listing saw shares open at $64.50. This moment cemented Roblox not just as a game, but as a dominant social utility platform. Its valuation surpassed legacy gaming giants like EA and Take-Two, highlighting the tremendous financial power of user-generated content.",
          category: "milestone",
          stats: { label: "NYSE Valuation", value: "$41 Billion" }
        }
      ]
    },
    {
      id: 2,
      romanId: "VOLUME II",
      title: "Economy & Culture",
      subtitle: "Tokens, Avatars, and Virtual Brands",
      snippets: [
        {
          id: "v2-1",
          title: "The End of Tix",
          icon: "Ticket",
          description: "In 2016, Roblox controversially removed 'Tickets' (the free daily currency) to combat botting and streamline the economy around Robux.",
          extendedDetails: "Tickets (Tix) were given to players daily just for logging in or having visitors. Although loved by non-paying users, Tix allowed massive botting schemes where creators set up dummy accounts to channel free Tix into Robux. The removal caused widespread protest, including 'Tix rest-in-peace' places, but successfully stabilized the virtual market.",
          category: "economy",
          stats: { label: "Removal Date", value: "April 2016" }
        },
        {
          id: "v2-2",
          title: "Avatars & Identity",
          icon: "User",
          description: "From the classic 'Noob' colors to 'Bacon Hair' (Pal Hair), default avatars became beloved community memes and symbols of platform history.",
          extendedDetails: "The signature yellow-head, blue-torso, and green-leg palette is recognized globally as the 'Noob.' Later, when character models evolved with R15 rigs, default avatars like the male 'Bacon Hair' and female 'Acorn Hair' emerged. These styles, once seen as default badges, became celebrated social status statements worn ironically by elite creators.",
          category: "community",
          stats: { label: "Avatars Served", value: "2B+ created" }
        },
        {
          id: "v2-3",
          title: "The Brand Metaverse",
          icon: "Sparkles",
          description: "Major brands like Gucci, Nike (Nikeland), and Vans began launching official, persistent worlds, turning Roblox into a premier marketing destination.",
          extendedDetails: "In May 2021, the 'Gucci Garden' exhibition made shockwaves when a digital Gucci Queen Bee handbag re-sold on the platform's aftermarket for over $4,115 - more than the physical purse's real-life cost. Today, massive corporations treat Roblox as a crucial demographic medium to engage Gen Z and Alpha consumers.",
          category: "community",
          stats: { label: "Top Brand Visits", value: "30M+ weekly" }
        }
      ]
    },
    {
      id: 3,
      romanId: "VOLUME III",
      title: "Maturation & Challenges",
      subtitle: "Security, Growth, and Infrastructure Failures",
      snippets: [
        {
          id: "v3-1",
          title: "The 73-Hour Outage",
          icon: "WifiOff",
          description: "In October 2021, a massive internal infrastructure failure took the platform offline for three days. It was jokingly blamed on a Chipotle promotion.",
          extendedDetails: "The outage began on October 28, 2021. Contrary to rumors that Chipotle's free burrito giveaway broke the servers, the actual culprit was a Consul service cluster breakdown. A performance bottleneck caused database locking under heavy load, forcing the engineers to work around the clock in a highly scrutinized, historic recovery operation.",
          category: "tech",
          stats: { label: "Downtime Period", value: "73 Hours" }
        },
        {
          id: "v3-2",
          title: "Aging Up (17+ Content)",
          icon: "ShieldAlert",
          description: "Recognizing that over half its audience was older, Roblox introduced ID-verified 17+ experiences allowing mature themes and crude humor.",
          extendedDetails: "Historically viewed as a game for young children, Roblox's fastest-growing demographic became 17-to-24-year-olds. To cater to them, the platform launched age guidelines permitting more intense action, realistic violence, and moderate romance within specially designated, ID-verified spaces.",
          category: "community",
          stats: { label: "Target Age", value: "17+ Verified" }
        },
        {
          id: "v3-3",
          title: "Bloxburg Goes Free",
          icon: "Home",
          description: "After years in paid beta, 'Welcome to Bloxburg' transitioned to free-to-play in 2024, reshaping the social hierarchy of roleplay games.",
          extendedDetails: "Developed by Coeptus and later acquired, Welcome to Welcome to Bloxburg required a 25 Robux entrance fee for over a decade. It raised a highly dedicated class of homebuilders. Going free-to-play opened the gates to millions of new players, which existing players jokingly 'segregated' by building blockades to stay separate from the newcomers.",
          category: "community",
          stats: { label: "Player Record", value: "15B+ Visits" }
        }
      ]
    },
    {
      id: 4,
      romanId: "VOLUME IV",
      title: "Community & Tech",
      subtitle: "Pioneering Events, Graphics, and Experiences",
      snippets: [
        {
          id: "v4-1",
          title: "The Egg Hunts",
          icon: "Award",
          description: "Starting in 2008, the annual Egg Hunt became the most anticipated event, eventually evolving into decentralized, massive developer hunts.",
          extendedDetails: "Originally, Roblox staff dropped eggs in dedicated maps. By 2013, the hunts became sophisticated narrative adventure games (like Egg Hunt 2018: The Great Yolktales). Eventually, the event decentralized into 'Dev Hunt' models where dozens of independent developers hosted unique eggs in their games, culminating in the 2024 'The Hunt' initiative.",
          category: "community",
          stats: { label: "First Egg Hunt", value: "April 2008" }
        },
        {
          id: "v4-2",
          title: "The Concert Era",
          icon: "Music",
          description: "Lil Nas X's 2020 virtual concert brought in 33 million views, proving Roblox's capability to host massive, real-time global entertainment.",
          extendedDetails: "The concert featured dynamic, enormous avatars of Lil Nas X transitioning through themed environments while playing hits like 'Old Town Road' and 'Holiday.' This pioneered the virtual concert era, followed by appearances from Zara Larsson, Twenty One Pilots, and Charli XCX, demonstrating cutting-edge motion capture tech.",
          category: "community",
          stats: { label: "Peak Audience", value: "33 Million Views" }
        },
        {
          id: "v4-3",
          title: "Future Is Bright Dynamic Engine",
          icon: "Zap",
          description: "Roblox deployed its advanced voxel lighting engine, enabling photorealistic shadows, transparency, and pushing graphics closer to Unreal Engine.",
          extendedDetails: "The 'Future is Bright' update phased in over multiple stages, replacing legacy flat global lighting. By introducing shadow maps, dynamic light probes, and micro-surface reflections, Roblox allowed talented modern builders to achieve atmospheric, filmic scenes that competed directly with traditional AA stand-alone engines.",
          category: "tech",
          stats: { label: "Render Tech", value: "Phase 3 Voxel" }
        }
      ]
    },
    {
      id: 5,
      romanId: "VOLUME V",
      title: "Infrastructure & Myths",
      subtitle: "Edge Performance, Lore, and Scarcity Trading",
      snippets: [
        {
          id: "v5-1",
          title: "Global Edge Network",
          icon: "Server",
          description: "Unlike traditional MMOs, Roblox built a decentralized edge computing network to ensure low latency physics for millions of players globally.",
          extendedDetails: "Roblox operates a massive global hybrid cloud infrastructure, establishing proximity server nodes near user populaces. This edge routing manages complex high-frequency physical box collisions, rigid bodies, and joint constraints live across hundreds of active players in real time without lag spikes.",
          category: "tech",
          stats: { label: "Server Speed", value: "Sub-50ms latency" }
        },
        {
          id: "v5-2",
          title: "Myths & Legends",
          icon: "Eye",
          description: "Early platform lore was dominated by creepypastas like 'John Doe' hacking panics and mysterious groups, fueling early social engagement.",
          extendedDetails: "Legends of 'John Doe' and 'Jane Doe' (two accounts made by Baszucki/Cassel in 2005 to test the avatar database) sparked rumors of active hacks on March 18th. Community-led 'Myth Hunting' groups formed, cataloging mysterious, creepy, or puzzle-centric maps created by enigmatic figures like 'G003Y' and 'The Cult Family.'",
          category: "community",
          stats: { label: "Hacker Scare", value: "March 18th Panic" }
        },
        {
          id: "v5-3",
          title: "The 'Limiteds' Economy",
          icon: "Gem",
          description: "Roblox pioneered digital scarcity. Classic items like the Dominus series are traded on a stock-market structure, worth thousands of real dollars.",
          extendedDetails: "By issuing items with restricted supply counts (e.g. only 26 pieces of Dominus Frigidus), Roblox built a massive trading resale ecosystem. Using features like serial numbers and price charts, young users master macroeconomics, arbitrage, and demand forecasting, trading items valued at millions of Robux.",
          category: "economy",
          stats: { label: "De facto Crown", value: "Dominus Series" }
        },
        {
          id: "v5-4",
          title: "The Mobile Revolution",
          icon: "Smartphone",
          description: "Roblox launched on iOS in 2012 and Android in 2014, shifting its core player base towards a portable on-the-go ecosystem.",
          extendedDetails: "The release of Roblox on mobile devices completely changed the platform's demographic and scaling speed. By prioritizing touch controls and a responsive interface, it allowed millions of younger players worldwide to access the platform. Today, over 70% of standard active users experience Roblox via modern mobile iOS and Android devices rather than legacy desktop computers.",
          category: "milestone",
          stats: { label: "Mobile Access", value: "70%+ Players" }
        },
        {
          id: "v5-5",
          title: "The Forum Era (2006-2017)",
          icon: "MessageSquare",
          description: "A golden age of classic community message boards where early Robloxian users ran sub-cultures, clans, debates, and trade discussions before being retired in late 2017.",
          extendedDetails: "The Roblox Forums were legendary centers for user communities. Sub-forums like 'Roblox Talk' (RT), 'Let's Make a Game' (LMAD), and 'Clans & Guilds' (C&G) birthed many memes, cultural jokes, and trading values. However, as the user base scaled massively, moderating the forums became impossible, leading to their complete closure in December 2017 in favor of modern social channels and the Roblox Developer Forum.",
          category: "community",
          stats: { label: "Forum Erasure", value: "Dec 2017" }
        },
        {
          id: "v5-6",
          title: "1x1x1x1: The Mythic Hacker",
          icon: "Terminal",
          description: "The ultimate classic hacker legend of Roblox, blamed for the legendary April Fools 2012 defacement and mysterious creepy occurrences.",
          extendedDetails: "1x1x1x1 was originally a test account created by Roblox but became a major creepypasta. It is historically linked to the chaotic April Fools' Day exploit of 2012, where administrators' panels were breached to create giant heads, customize faces, and send green banners across the platform. Millions of classic Robloxians feared the name as the Boogeyman of the blocky world.",
          category: "community",
          stats: { label: "Primary Suspect", value: "2012 April Fools" }
        },
        {
          id: "v5-7",
          title: "The Guest Wars & Legacy",
          icon: "Swords",
          description: "The legendary era of unregistered 'Guest' players, creating a deep community divide and eventual tragic retirement in 2017.",
          extendedDetails: "Unregistered users originally played Roblox as 'Guests' (sporting iconic black Guest caps). This led to a playful but mock conflict (the 'Guest Wars') between standard registered players and mute guests who couldn't use chat. To enhance child safety and encourage signup registration, Roblox officially retired the guest system on October 16, 2017, making them a legendary nostalgic icon of Roblox history.",
          category: "community",
          stats: { label: "Active Era", value: "2008 - 2017" }
        }
      ]
    }
  ];
};

export const LOCALIZED_QUIZ = (lang: Language): QuizQuestion[] => {
  if (lang === "th") {
    return [
      {
        id: 1,
        question: "ชื่อตั้งต้นดั้งเดิมของโปรเจกต์ Roblox ระหว่างทำการจัดสร้างพัฒนาและทดสอบคืออะไร?",
        options: ["Ro-Craft", "DynaBlocks", "LegoSimulator", "PhysicBlocks"],
        correctAnswerIndex: 1,
        explanation: "ในเวอร์ชันทดลองปี 2004 ตัวเกมแรกเริ่มใช้ชื่อว่า DynaBlocks ก่อนที่คุณเดวิดและเอริคจะคัดเลือกคำใหม่มาประกอบจดเรียบเรียงเป็น 'Roblox' ในปี 2548 (นำมาจากคำผสมคำว่า Robots และ Blocks)"
      },
      {
        id: 2,
        question: "ในปีใดที่แพลตฟอร์ม Roblox ให้กำเนิดโครงการเดอะ Developer Exchange (DevEx) ที่ทำรายได้แก่นักสร้างเกม?",
        options: ["2008", "2010", "2013", "2016"],
        correctAnswerIndex: 2,
        explanation: "โครงการนักพัฒนาแลกเปลี่ยนเงินจริงเปิดตัวขึ้นอย่างเป็นทางการในเดือนคุลาคม 2013 มอบรายได้จริงให้เด็กวัยรุ่นและผู้สร้างเกมแปลงสกุลเงิน Robux เป็นเหรียญจริงเข้าบัญชี"
      },
      {
        id: 3,
        question: "สกุลเงินทางเลือกคู่ขนานของ Roblox ในอดีตแถมฟรีแจกรายวันชนิดใดที่ถูกถอดโบกมือลาคอมมูนิตี้ในเดือนเมษายน 2559?",
        options: ["Points (คะแนนความเก๋า)", "Tickets (หรือ Tix ตั๋วส้ม)", "Credits (ยอดเครดิต)", "Blocks (เหรียญสี่เหลี่ยม)"],
        correctAnswerIndex: 1,
        explanation: "ตั๋วจัดสรรส้ม หรือที่เรียกกันว่า Tix ถูกถอดออกเพื่อรักษาเสถียรภาพโครงสร้างตลาด ป้องกันการทำฟาร์มสร้างบัญชีบอตปั๊มทองมาป้อนตลาด Robux ในระยะยาว"
      },
      {
        id: 4,
        question: "เหตุการณ์ทางเทคนิคที่พังถล่มลบพื้นที่นิทรรศการทำระบบสูญหายเซิร์ฟเวอร์ออฟไลน์ 73 ชั่วโมงในตุลาคม 2564 คืออะไร?",
        options: [
          "แคมเปญแจกทาโก้แบรนด์ Chipotle ดึงดูดเด็กล้นจนพังหน้าประตู",
          "อาการล็อกตัวของข้อมูลและการปิดกระจายคำสั่งบกพร่องแกนในระบบ Consul Cluster",
          "กลุ่มจรกรรมทางไซเบอร์นิรนามเป้าโจมตีเข้าสูตรโครงข่ายเซิร์ฟเวอร์หลวง",
          "การเชื่อมระบบเข้าสู่วันเปิดตลาดหลักทรัพย์ล้นยอดส่งผลกระทบสะสม"
        ],
        correctAnswerIndex: 1,
        explanation: "แม้ว่าผู้ใช้จะทวีตคุยแซวว่าคนแห่ไปแย่งทิ่มกระเป๋าอาหารร้านบุฟเฟต์ทาโก้พัง แต่ข้อยืนยันคอขวดวิศวกรรมสระระบุว่าระบบไมโครเซอร์วิสพังภายใน Consul cluster เนื่องจากระบบเรียกติดต่อขัดข้องดึงยอดโหลดสูงเกินคุม"
      },
      {
        id: 5,
        question: "เครื่องประดับศีรษะตระกูลจำกัด Limiteds ซีรีส์ใดที่ถูกยกย่องเป็นมงกุฎอัญมณีล้ำค่าและราคาสูงส่งที่สุดของประวัติศาสตร์แพลตฟอร์ม?",
        options: ["Valkyrie Helmets (ปีกวิงส์หมวกทอง)", "Dominus Series (หน้ากากเสื้อคลุมยักษ์)", "Fedora Collections (หมวกสุภาพบุรุษ)", "Sparkle Time Hats (หมวกประกายดาว)"],
        correctAnswerIndex: 1,
        explanation: "ด้วยสัดส่วนผู้ครองมีหลักหน่วยถ้วนของประวัติศาสตร์ ตระกูลซีรีส์ Dominus (อาทิ Dominus Frigidus / Dominus Infernus) นำเสนอภาพสถานะความลักชูรีที่หายากสุดขีดบนเวทีรีเซลเสมือนจริง"
      }
    ];
  }

  // English fallback questions
  return [
    {
      id: 1,
      question: "What was Roblox originally called in its early development prototype?",
      options: ["Ro-Craft", "DynaBlocks", "LegoSimulator", "PhysicBlocks"],
      correctAnswerIndex: 1,
      explanation: "Roblox was originally named DynaBlocks in 2004, before founders David Baszucki and Erik Cassel rebranded it to 'Roblox' in 2005 (combining 'Robots' and 'Blocks')."
    },
    {
      id: 2,
      question: "In what year did Roblox introduce the revolutionary Developer Exchange (DevEx) system?",
      options: ["2008", "2010", "2013", "2016"],
      correctAnswerIndex: 2,
      explanation: "The Developer Exchange was launched in October 2013, allowing creators to make actual income by converting earned game Robux into US Dollars."
    },
    {
      id: 3,
      question: "Which dual currency of Roblox was controversially retired in April 2016?",
      options: ["Points (PTS)", "Tickets (Tix)", "Credits", "Blocks"],
      correctAnswerIndex: 1,
      explanation: "Tickets, commonly known as Tix, were removed in 2016 to prevent account botting and stabilize the primary economy entirely around Robux."
    },
    {
      id: 4,
      question: "What actually caused the historic 73-hour platform outage in October 2021?",
      options: [
        "Chipotle's free burrito promo crashed the server",
        "A database lock and performance bottleneck in the Consul backend system",
        "An anonymous group of hacktivists targeted the game",
        "The NYSE launch overloaded the platform servers"
      ],
      correctAnswerIndex: 1,
      explanation: "While players humorously blamed Chipotle's virtual event, the actual technical breakdown was a Consul cluster lockout under elevated microservice load."
    },
    {
      id: 5,
      question: "Which high-value virtual status accessory series has been called the crown jewels of Roblox Limiteds?",
      options: ["Valkyrie Helmets", "Dominus Series", "Fedora Collections", "Sparkle Time Hats"],
      correctAnswerIndex: 1,
      explanation: "Representing some of the absolute highest values on the resale market, the Dominus series (e.g., Dominus Frigidus/Infernus) represent legendary digital status symbols."
    }
  ];
};

export const LOCALIZED_MARKET = (lang: Language): LimitedItem[] => {
  // Translate labels for items slightly if required, keeping names iconic but giving them immersive context
  const items: LimitedItem[] = [
    {
      id: "lim-1",
      name: "Dominus Frigidus",
      color: "#60A5FA",
      basePrice: 39000,
      estimatedRobux: 2800000,
      volatility: 0.15,
      currentTrend: [2400000, 2550000, 2600000, 2500000, 2750000, 2800000]
    },
    {
      id: "lim-2",
      name: "Sparkle Time Fedora",
      color: "#EF4444",
      basePrice: 10000,
      estimatedRobux: 1200000,
      volatility: 0.22,
      currentTrend: [950000, 1100000, 1050000, 1300000, 1150000, 1200000]
    },
    {
      id: "lim-3",
      name: "Valkyrie Helm",
      color: "#10B981",
      basePrice: 5000,
      estimatedRobux: 350000,
      volatility: 0.08,
      currentTrend: [310000, 325000, 330000, 340000, 345000, 350000]
    },
    {
      id: "lim-4",
      name: "Clockwork's Headphones",
      color: "#F59E0B",
      basePrice: 150,
      estimatedRobux: 180000,
      volatility: 0.12,
      currentTrend: [160000, 175000, 170000, 190000, 185000, 180000]
    },
    {
      id: "lim-5",
      name: lang === "th" ? "มงกุฎนู้บคลาสสิก" : "Classic Noob Crown",
      color: "#EAB308",
      basePrice: 500,
      estimatedRobux: 45000,
      volatility: 0.28,
      currentTrend: [32000, 38000, 42000, 36000, 41000, 45000]
    }
  ];
  return items;
};
