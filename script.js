let score = 0;
let currentQuestionIndex = 0;
let visitedLocations = [];
let hasSupportedProject = false; 
let audioCtx = null;
let waveNoiseNode = null;

let isMusicPlaying = false;

let currentChapter = 0;
let chapterClaimedStatus = [false, false, false, false, false];
let currentLang = 'th'; // คีย์เริ่มต้น: th, en, cn

// คลังแปลภาษา UI หลัก
const uiTranslations = {
    th: {
        title: "Southern Eco-Explorer",
        welcome: "ยินดีต้อนรับผู้พิทักษ์ท่องเที่ยวภาคใต้<br>ร่วมสนุกตอบควิซ และสะสมแต้มอนุรักษ์ทะเลกัน!",
        rankLabel: "ฉายา",
        vaultLabel: "คลังการ์ดของคุณ",
        unitCard: "ใบ",
        navLearning: "📚 ศูนย์เรียนรู้สัตว์ทะเล (5 บท - 200 แต้ม)",
        navQuiz: "🧩 ควิซรอบรู้ทะเลใต้ (30 ข้อ)",
        navGps: "📸 สแกนจุดเช็คอิน GPS ภาคใต้ (12 ที่)",
        navGacha: "🔮 สุ่มการ์ดสัตว์ทะเลหายาก (Gacha)",
        navAlbum: "🎴 สมุดสะสมการ์ด (My Collection)",
        backBtn: "กลับหน้าหลัก",
        learningTitle: "📚 ศูนย์เรียนรู้ระบบนิเวศใต้ทะเล",
        claimPointsActive: "อ่านจบแล้ว รับ Eco Point +40",
        claimPointsDone: "🔒 เคยรับพ้อยท์บทนี้แล้ว",
        quizTitle: "Ocean Quiz",
        quizSurrender: "ยอมแพ้ และกลับหน้าหลัก",
        gpsTitle: "📸 ระบบเช็คอินพิกัด GPS ทะเลใต้",
        gpsDesc: "ระบบจะขอสิทธิ์เข้าถึงพิกัดปัจจุบันของคุณ เพื่อตรวจสอบว่าคุณอยู่ที่สถานที่ท่องเที่ยวจริงหรือไม่ในรัศมีทดสอบ!",
        gpsNote: "*แต่ละสถานที่สามารถสแกนรับแต้มได้ครั้งเดียว",
        gachaTitle: "🔮 กาชาการ์ดสัตว์ทะเลสะสม",
        gachaDesc: "ใช้ 50 Eco Points เพื่อลุ้นรับการ์ดโมเดลสัตว์ทะเลระดับแรร์ (มีระดับ Normal จนถึงระดับตำนาน SSR!)",
        gachaIdle: "รอกดสุ่มการ์ด",
        gachaBtn: "🌟 กดสุ่มการ์ด (ใช้ 50 แต้ม)",
        gachaRolling: "🌀<br>กำลังสุ่มการ์ด...",
        albumTitle: "🎴 สมุดสะสมการ์ดทะเลใต้",
        albumOwn: "การ์ดที่คุณครอบครอง",
        carbonDesc: "ร่วมปกป้องทะเลใต้! ผลิตภัณฑ์ Smart Marine Glow ทุก 1 ชิ้น ช่วยรีไซเคิลขยะพลาสติกและเศษอวนจากทะเลใต้ประมาณ 20 กรัม ลดก๊าซเรือนกระจก 0.05 kgCO₂e",
        supportBtnActive: "สนับสนุนโครงการ รับ Eco Point +20",
        supportBtnDone: "🔒 สนับสนุนโครงการแล้ว (+20 แต้ม)",
        ok: "ตกลง",
        alertClaimed: "คุณเคยรับแต้มของบทเรียนนี้ไปแล้วครับ ลองสลับไปบทอื่นนะ! 📚",
        alertClaimSuccess: "📚 บันทึกการเรียนรู้สำเร็จ!<br>คุณได้รับ Eco Point +40 แต้ม เรียบร้อยแล้ว!",
        alertVisited: "คุณเคยเช็คอินที่นี่ไปแล้วครับ 🗺️",
        alertNoGeo: "อุปกรณ์ของคุณไม่รองรับระบบระบุพิกัด GPS 📱",
        alertCheckingGps: "📡 กำลังตรวจสอบพิกัด GPS ของคุณสักครู่...",
        alertGpsSuccess: "🎯 เช็คอินสำเร็จ!<br>ระบบตรวจพบว่าคุณอยู่ใกล้จุดจริงในระยะทดสอบ รับเพิ่มแต้มสำเร็จ! 🌱",
        alertGpsFail: "❌ เช็คอินล้มเหลว!<br>คุณอยู่ห่างจากจุดจริงเกินไป คุณต้องอยู่บนสถานที่จริงเท่านั้นจึงจะรับแต้มได้ครับ!",
        alertGpsError: "❌ ไม่สามารถเข้าถึงพิกัดของคุณได้ กรุณาเปิดแชร์สิทธิ์ตำแหน่งก่อนใช้งาน",
        alertNoScore: "แต้มไม่พอ! ต้องใช้ 50 แต้ม ไปทำควิซหรืออ่านบทเรียนอัพแต้มก่อนนะ",
        alertGachaWin: "🎴 สุ่มได้การ์ดใบใหม่!<br>ระบบทำการปลดล็อกการ์ดใบนี้ในสมุดสะสมเรียบร้อยแล้วครับ!",
        alertSupportDone: "✨ ขอบคุณที่ร่วมสนับสนุนโครงการ!<br>ได้รับ Eco Point +20 แต้มเรียบร้อยครับ!",
        alertQuizCorrect: "ถูกต้อง! 🎉 (+3 แต้ม)",
        alertQuizWrong: "ผิดจ้า ลองวิเคราะห์สถานการณ์ใหม่อีกครั้งนะ ❌",
        alertQuizComplete: "🏆 ยินดีด้วย! คุณผ่านควิซผู้พิทักษ์ทะเล 30 ข้อครบถ้วนแล้ว!",
        soundOn: "เปิดเสียงคลื่น",
        soundOff: "ปิดเสียงคลื่น"
    },
    en: {
        title: "Southern Eco-Explorer",
        welcome: "Welcome, Protectors of Southern Seas!<br>Join the ocean eco-quiz and collect conservation points!",
        rankLabel: "Title",
        vaultLabel: "Your Card Collection",
        unitCard: "Cards",
        navLearning: "📚 Marine Center (5 Ch. - 200 pts)",
        navQuiz: "🧩 Ocean Eco Quiz (30 Questions)",
        navGps: "📸 GPS Check-in Tracker (12 Spots)",
        navGacha: "🔮 Rare Marine Gacha Pack (50 pts)",
        navAlbum: "🎴 My Collection Album",
        backBtn: "Back to Home",
        learningTitle: "📚 Deep Sea Ecosystem Learning Center",
        claimPointsActive: "Finished! Claim +40 Eco Points",
        claimPointsDone: "🔒 Already Claimed",
        quizTitle: "Ocean Quiz",
        quizSurrender: "Surrender & Return Home",
        gpsTitle: "📸 Southern Sea GPS Check-in",
        gpsDesc: "The system requests your current GPS coordinates to verify if you are at the actual destination within the test radius!",
        gpsNote: "*Each attraction can only be checked in once.",
        gachaTitle: "🔮 Marine Card Gacha Box",
        gachaDesc: "Spend 50 Eco Points to win rare marine life cards (From Normal to Legendary SSR!)",
        gachaIdle: "Ready to roll!",
        gachaBtn: "🌟 Roll Gacha (Costs 50 pts)",
        gachaRolling: "🌀<br>Rolling...",
        albumTitle: "🎴 Southern Ocean Card Album",
        albumOwn: "Cards Collected",
        carbonDesc: "Protect Southern Seas! Every 1 unit of Smart Marine Glow product recycles ~20g of plastic trash/discarded nets, reducing 0.05 kgCO₂e.",
        supportBtnActive: "Support Project & Claim +20 pts",
        supportBtnDone: "🔒 Supported (+20 pts)",
        ok: "OK",
        alertClaimed: "You have already claimed points for this chapter! 📚",
        alertClaimSuccess: "📚 Learning Saved!<br>You have received +40 Eco Points!",
        alertVisited: "You have already checked in here! 🗺️",
        alertNoGeo: "Your device does not support GPS geolocation 📱",
        alertCheckingGps: "📡 Verifying your GPS location, please wait...",
        alertGpsSuccess: "🎯 Check-in Successful!<br>Detected within the test radius. Points awarded! 🌱",
        alertGpsFail: "❌ Check-in Failed!<br>You are too far from the destination. Please visit the actual site!",
        alertGpsError: "❌ Unable to access your location. Please enable Location Services.",
        alertNoScore: "Not enough points! You need 50 points. Play quizzes or read chapters first.",
        alertGachaWin: "🎴 New Card Unlocked!<br>Check your collection album now!",
        alertSupportDone: "✨ Thank you for your support!<br>+20 Eco Points have been awarded!",
        alertQuizCorrect: "Correct! 🎉 (+3 pts)",
        alertQuizWrong: "Incorrect! Let's analyze the situation again ❌",
        alertQuizComplete: "🏆 Congratulations! You have completed all 30 quiz questions!",
        soundOn: "Play Ocean Sound",
        soundOff: "Mute Ocean Sound"
    },
    cn: {
        title: "南部海洋生态探险家",
        welcome: "欢迎来到南部海洋守护者中心！<br>参与生态问答，收集海洋保护积分！",
        rankLabel: "荣誉称号",
        vaultLabel: "您的卡片库存",
        unitCard: "张",
        navLearning: "📚 海洋学习中心 (5章 - 200积分)",
        navQuiz: "🧩 海洋生态问答 (30题)",
        navGps: "📸 GPS地理位置签到 (12个景点)",
        navGacha: "🔮 稀有海洋生物抽卡 (50积分)",
        navAlbum: "🎴 我的卡片收集册",
        backBtn: "返回主页",
        learningTitle: "📚 深海生态系统学习中心",
        claimPointsActive: "阅读完成 领取 +40 积分",
        claimPointsDone: "🔒 已领取此章节积分",
        quizTitle: "海洋问答",
        quizSurrender: "放弃并返回主页",
        gpsTitle: "📸 南部海洋 GPS 签到系统",
        gpsDesc: "系统将请求获取您当前的GPS坐标，以验证您是否在测试半径内的实际旅游景点！",
        gpsNote: "*每个景点只能签到一次并获取积分",
        gachaTitle: "🔮 海洋卡片盲盒机",
        gachaDesc: "使用 50 积分即可抽取稀有海洋卡片（包含普通级至传奇SSR级！）",
        gachaIdle: "等待抽取卡片",
        gachaBtn: "🌟 抽取卡片 (消耗 50 积分)",
        gachaRolling: "🌀<br>正在抽取...",
        albumTitle: "🎴 南部海洋卡片图鉴",
        albumOwn: "已收集卡片",
        carbonDesc: "共同守护南部海洋！每支持1件 Smart Marine Glow 产品，可回收南海约20克塑料垃圾和废弃渔网，减少 0.05 kgCO₂e 温室气体排放。",
        supportBtnActive: "支持项目并获取 +20 积分",
        supportBtnDone: "🔒 已支持该项目 (+20 积分)",
        ok: "确定",
        alertClaimed: "您已经领取过本章的积分了，请尝试其他章节！📚",
        alertClaimSuccess: "📚 学习记录成功！<br>您已成功获得 +40 生态积分！",
        alertVisited: "您已经在这里签到过了 🗺️",
        alertNoGeo: "您的设备不支持GPS定位功能 📱",
        alertCheckingGps: "📡 正在验证您的GPS位置，请稍候...",
        alertGpsSuccess: "🎯 签到成功！<br>系统检测到您处于测试范围内。积分发放成功！🌱",
        alertGpsFail: "❌ 签到失败！<br>您距离实际目的地太远，请亲自前往景点签到！",
        alertGpsError: "❌ 无法获取您的位置，请在浏览器中开启定位权限。",
        alertNoScore: "积分不足！需要 50 积分。请先阅读文章或回答问题赚取积分。",
        alertGachaWin: "🎴 抽到新卡片！<br>系统已在您的收藏册中解锁该卡片！",
        alertSupportDone: "✨ 感谢您的支持！<br>已成功发放 +20 生态积分！",
        alertQuizCorrect: "回答正确！🎉 (+3 积分)",
        alertQuizWrong: "回答错误！请重新分析情境 ❌",
        alertQuizComplete: "🏆 恭喜！您已成功完成全部 30 道守护者挑战题！",
        soundOn: "播放海浪声",
        soundOff: "静音海浪声"
    }
};

// ข้อมูลฉายาตามแต้ม (3 ภาษา)
const rankTranslations = {
    th: ["นักท่องเที่ยวฝึกหัด", "🌿 อาสาสมัครบีชคลีนเนอร์", "🤿 นักดำน้ำพิทักษ์ปะการัง", "🔱 เจ้าสมุทรผู้พิทักษ์อันดามัน"],
    en: ["Novice Tourist", "🌿 Volunteer Beach Cleaner", "🤿 Coral Reef Diver Protector", "🔱 Guardian of the Andaman Sea"],
    cn: ["初级游客", "🌿 海滩清洁志愿者", "🤿 珊瑚礁潜水保护者", "🔱 安达曼海守护海王"]
};

// รายชื่อสถานที่ (3 ภาษา)
const locationNames = {
    th: {
        similan: "หมู่เกาะสิมิลัน (พังงา)", promthep: "แหลมพรหมเทพ (ภูเก็ต)", phangnga: "อ่าวพังงา (เกาะตาปู)",
        maya: "อ่าวมาหยา (กระบี่)", emerald: "สระมรกต (กระบี่)", separated: "ทะเลแหวก (กระบี่)",
        chiewlan: "เขื่อนเชี่ยวหลาน (สุราษฎร์ธานี)", taotech: "เกาะเต่า (แหล่งดำน้ำ)", samui: "เกาะสมุย (หินตาหินยาย)",
        lipe: "เกาะหลีเป๊ะ (สตูล)", emeraldCave: "ถ้ำมรกต เกาะมุก (ตรัง)", kradan: "เกาะกระดาน (ตรัง)",
        z1: "โซนภูเก็ต-พังงา", z2: "โซนกระบี่", z3: "โซนสุราษฎร์ธานี", z4: "โซนสตูล-ตรัง"
    },
    en: {
        similan: "Similan Islands (Phang Nga)", promthep: "Promthep Cape (Phuket)", phangnga: "Phang Nga Bay (James Bond Is.)",
        maya: "Maya Bay (Krabi)", emerald: "Emerald Pool (Krabi)", separated: "Separated Sea (Krabi)",
        chiewlan: "Cheow Lan Lake (Surat Thani)", taotech: "Koh Tao (Diving Spot)", samui: "Koh Samui (Hin Ta Hin Yai)",
        lipe: "Koh Lipe (Satun)", emeraldCave: "Emerald Cave Koh Mook (Trang)", kradan: "Koh Kradan (Trang)",
        z1: "Phuket-Phang Nga Zone", z2: "Krabi Zone", z3: "Surat Thani Zone", z4: "Satun-Trang Zone"
    },
    cn: {
        similan: "斯米兰群岛 (攀牙府)", promthep: "神仙半岛 (普吉岛)", phangnga: "攀牙湾 (詹姆斯邦德岛)",
        maya: "玛雅湾 (甲米府)", emerald: "翡翠池 (甲米府)", separated: "一线天沙滩 (甲米府)",
        chiewlan: "秀兰湖/考索国家公园 (素叻他尼府)", taotech: "涛岛 (潜水胜地)", samui: "苏梅岛 (阿公阿妈石)",
        lipe: "丽贝岛 (沙敦府)", emeraldCave: "穆岛翡翠洞 (董里府)", kradan: "格拉丹岛 (董里府)",
        z1: "普吉-攀牙景区", z2: "甲米景区", z3: "素叻他尼景区", z4: "沙敦-董里景区"
    }
};

// คลังพิกัดภูมิศาสตร์จริง
const locationCoordinates = {
    'อุทยานแห่งชาติหมู่เกาะสิมิลัน 🏝️': { lat: 8.6474, lon: 97.6433 },
    'แหลมพรหมเทพ 🌅': { lat: 7.7603, lon: 98.3056 },
    'อ่าวพังงา (เกาะตาปู) ⛰️': { lat: 8.2741, lon: 98.5005 },
    'อ่าวมาหยา เกาะพีพี 🌊': { lat: 7.6811, lon: 98.7661 },
    'สระมรกต 🌲': { lat: 7.9231, lon: 99.2612 },
    'ทะเลแหวก 🏝️': { lat: 7.9739, lon: 98.8105 },
    'เขื่อนเชี่ยวหลาน (เขาสก) ⛰️': { lat: 8.9774, lon: 98.8203 },
    'เกาะเต่า (แหล่งดำน้ำ) 🪸': { lat: 10.0956, lon: 99.8403 },
    'เกาะสมุย (หินตาหินยาย) 🏝️': { lat: 9.4519, lon: 100.0383 },
    'เกาะหลีเป๊ะ อุทยานฯ ตะรุเตา 🪸': { lat: 6.4894, lon: 99.3023 },
    'ถ้ำมรกต เกาะมุก 🌊': { lat: 7.3719, lon: 99.2964 },
    'เกาะกระดาน (หาดสวยที่สุด) 🏖️': { lat: 7.3072, lon: 99.2553 }
};

// คลังรายชื่อการ์ดรางวัล (3 ภาษา)
const gachaPrizes = [
    { id: 0, unlocked: false, img: "https://images.unsplash.com/photo-1524704654690-b56c05c78a02?w=200", names: { th: "⭐ [Normal] การ์ดปลานกแก้วสุดกวน 🦜🐠", en: "⭐ [Normal] Goofy Parrotfish Card 🦜🐠", cn: "⭐ [普通] 搞怪鹦嘴鱼卡片 🦜🐠" } },
    { id: 1, unlocked: false, img: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=200", names: { th: "⭐ [Normal] การ์ดปูเสฉวนฝาขวด 🐚🦀", en: "⭐ [Normal] Bottle-cap Hermit Crab 🐚🦀", cn: "⭐ [普通] 瓶盖寄居蟹卡片 🐚🦀" } },
    { id: 2, unlocked: false, img: "https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=200", names: { th: "✨ [Rare] การ์ดม้าน้ำคู่รักอันดามัน 🧜‍♂️🐴", en: "✨ [Rare] Andaman Seahorse Couple 🧜‍♂️🐴", cn: "✨ [稀有] 安达曼双栖海马卡片 🧜‍♂️🐴" } },
    { id: 3, unlocked: false, img: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=200", names: { th: "✨ [Rare] การ์ดปลาการ์ตูนส้มขาว 🐠🪸", en: "✨ [Rare] Orange Clownfish Ocellaris 🐠🪸", cn: "✨ [稀有] 尼莫小丑鱼卡片 🐠🪸" } },
    { id: 4, unlocked: false, img: "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=200", names: { th: "🔥 [Epic] การ์ดโลมาสีชมพูขนอม 🐬💖", en: "🔥 [Epic] Khanom Pink Dolphin 🐬💖", cn: "🔥 [史诗] 卡农粉红海豚卡片 🐬💖" } },
    { id: 5, unlocked: false, img: "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=200", names: { th: "🔥 [Epic] การ์ดพะยูนอ้วนเกาะลิบง 🧜‍♀️🌾", en: "🔥 [Epic] Koh Libong Chubby Dugong 🧜‍♀️🌾", cn: "🔥 [史诗] 利邦岛儒艮大胖卡片 🧜‍♀️🌾" } },
    { id: 6, unlocked: false, img: "https://images.unsplash.com/photo-1560275669-46c5a88d6a4c?w=200", names: { th: "👑 [ตำนาน SSR!!] ฉลามวาฬริเชลิว 🐋✨", en: "👑 [Legendary SSR!!] Richelieu Whale Shark 🐋✨", cn: "👑 [传说 SSR!!] 黎塞留鲸鲨王 🐋✨" } },
    { id: 7, unlocked: false, img: "https://images.unsplash.com/photo-1518467166778-b88f373ffec7?w=200", names: { th: "👑 [ตำนาน SSR!!] แม่เต่ามะเฟืองพิทักษ์หาด 🐢🔱", en: "👑 [Legendary SSR!!] Leatherback Sea Turtle Mother 🐢🔱", cn: "👑 [传说 SSR!!] 守护棱皮龟妈妈 🐢🔱" } }
];

// บทเรียน 5 บท (3 ภาษา)
const chaptersData = {
    th: [
        { title: "บทที่ 1: วิกฤตการณ์เต่ามะเฟืองแห่งทะเลอันดามัน 🐢", content: "<b>เต่ามะเฟือง (Leatherback Turtle)</b> เป็นเต่าทะเลที่มีขนาดใหญ่ที่สุดในโลกและจัดเป็นสัตว์ป่าสงวนของไทย แหล่งวางไข่สำคัญคือหาดท้ายเหมือง ชายหาดพังงา และภูเก็ต<br><br><b>ทำไมถึงวิกฤต?</b> อาหารหลักคือ 'แมงกะพรุน' ซึ่งถุงพลาสติกใสลอยน้ำทะเลดูคล้ายแมงกะพรุนมาก ทำให้มันกินเข้าไปจนอุดตันในระบบย่อยอาหารจนเสียชีวิต" },
        { title: "บทที่ 2: ลมหายใจสุดท้ายของพะยูนฝูงใหญ่ที่เกาะลิบง 🧜‍♀️", content: "<b>พะยูน (Dugong)</b> สัตว์เลี้ยงลูกด้วยนมทางทะเลที่เป็นสัญลักษณ์แห่งเมืองตรัง โดยมีเกาะลิบงเป็นแหล่งอาศัยหนาแน่นที่สุดเนื่องจากเป็นทุ่งหญ้าทะเลขนาดใหญ่<br><br><b>ทำไมถึงวิกฤต?</b> ปัจจุบันเกิดปรากฏการณ์หญ้าทะเลเสื่อมโทรมแห้งตาย พะยูนจึงขาดแคลนอาหาร และเผชิญภัยคุกคามจากขยะเศษอวนเก่าพันตัวจนล้มป่วยลง" },
        { title: "บทที่ 3: ยักษ์ใหญ่ใจดี ฉลามวาฬ และภัยเงียบ 'อวนผี' 🐋", content: "<b>ฉลามวาฬ (Whale Shark)</b> พี่ใหญ่ใจดีแห่งกองหินริเชลิว จังหวัดพังงา ทำหน้าที่กรองกินแพลงก์ตอน เป็นเครื่องบ่งชี้ความสมบูรณ์ของระบบนิเวศแนวปะการังน้ำลึก<br><br><b>ทำไมถึงวิกฤต?</b> ภัยคุกคามอันดับหนึ่งคือ 'Ghost Nets' หรือ อวนผี เศษอวนที่เรือประมงตัดทิ้งลอยในมหาสมุทร ซึ่งคอยรัดเกี่ยวครีบหรือหาง บาดลึกจนติดเชื้อรุนแรง" },
        { title: "บทที่ 4: โลมาสีชมพูแห่งขนอม และภัยจากมลพิษชายฝั่ง 🐬", content: "<b>โลมาสีชมพู</b> สัญลักษณ์ท่องเที่ยวอ่าวขนอม จังหวัดนครศรีธรรมราช ตอนเด็กจะมีสีเทา แต่เมื่อโตขึ้นเส้นเลือดฝอยใต้ผิวหนังจะทำให้เห็นเป็นสีชมพูสวยงาม<br><br><b>ทำไมถึงวิกฤต?</b> อาศัยอยู่ใกล้ชายฝั่งมาก ทำให้ได้รับผลกระทบโดยตรงจากขยะพลาสติกชิ้นใหญ่ สารเคมีจากแม่น้ำ และเสียงเครื่องยนต์เรือสปีดโบ๊ททำลายระบบโซนาร์นำทาง" },
        { title: "บทที่ 5: แนวปะการังฟอกขาว และสารเคมีในครีมกันแดด 🪸", content: "<b>แนวปะการัง</b> ที่เกาะเต่าและสิมิลัน คือบ้านของสิ่งมีชีวิตในทะเล ปัจจุบันเผชิญภาวะ 'ปะการังฟอกขาว' จากน้ำทะเลอุณหภูมิสูงขึ้นจนสาหร่ายซูแชนเทลลีหลุดออกไป<br><br><b>ทำไมถึงวิกฤต?</b> ครีมกันแดดที่มีสารเคมี Oxybenzone เป็นตัวเร่งปะการังฟอกขาวง่ายขึ้น การเลือกใช้ครีมกันแดดสูตร Reef-Safe จึงสำคัญมาก" }
    ],
    en: [
        { title: "Ch 1: The Crisis of Leatherback Sea Turtles 🐢", content: "<b>Leatherback Turtles</b> are the largest sea turtles in the world. Their key nesting grounds are in Phang Nga and Phuket.<br><br><b>Why the crisis?</b> Their primary food is jellyfish. Discarded clear plastic bags look exactly like jellyfish underwater, causing turtles to ingest them, leading to fatal intestinal blockages." },
        { title: "Ch 2: The Last Breath of Dugongs at Koh Libong 🧜‍♀️", content: "<b>Dugongs</b> are marine mammals and the eco-emblem of Trang province, with Koh Libong being their largest habitat due to vast seagrass beds.<br><br><b>Why the crisis?</b> Climate change and pollution have caused massive seagrass die-offs. Starving dugongs wander off and frequently get entangled in marine debris and ghost nets." },
        { title: "Ch 3: Gentle Giants, Whale Sharks, and Ghost Nets 🐋", content: "<b>Whale Sharks</b> are the gentle giants commonly found at Richelieu Rock, Phang Nga. They filter-feed on plankton and indicate healthy reef ecosystems.<br><br><b>Why the crisis?</b> Their biggest threat is 'Ghost Nets'—abandoned commercial fishing nets that tangle their fins, cutting deeply into their skin and causing fatal infections." },
        { title: "Ch 4: Khanom Pink Dolphins & Coastal Pollution 🐬", content: "<b>Pink Dolphins</b> are the highlights of Khanom Bay, Nakhon Si Thammarat. Born gray, they turn pink as they mature due to blood vessels near the skin surface.<br><br><b>Why the crisis?</b> Living near shores exposes them directly to chemical runoff, plastic pollution, and tourist speedboat engine noise, which disrupts their echolocation systems." },
        { title: "Ch 5: Coral Bleaching & Sunscreen Chemicals 🪸", content: "<b>Coral Reefs</b> in Koh Tao and Similan support 25% of marine life. They are now facing severe 'Coral Bleaching' as rising sea temperatures expel their symbiotic algae.<br><br><b>Why the crisis?</b> Chemical sunscreens containing <b>Oxybenzone</b> accelerate bleaching even in normal water temperatures. Using Reef-Safe sunscreens is globally vital." }
    ],
    cn: [
        { title: "第一章：安达曼海的棱皮龟生存危机 🐢", content: "<b>棱皮龟 (Leatherback Turtle)</b> 是世界上最大的海龟品种。攀牙府和普吉岛的沙滩是它们极其重要的产卵地。<br><br><b>为何产生危机？</b> 它们的主食是水母。透明的塑料袋漂浮在海水中极像水母，导致海龟误食后阻塞消化道，最终痛苦死亡。" },
        { title: "第二章：利邦岛儒艮的最后呼吸 🧜‍♀️", content: "<b>儒艮 (Dugong)</b> 是董里府的海洋生态象征，利邦岛因拥有广阔的海草床而成为它们最密集的栖息地。<br><br><b>为何产生危机？</b> 气候变化导致海草大量退化枯死，饥饿的儒艮不得不游出安全区，频繁被海洋废弃渔网缠绕致死。" },
        { title: "第三章：温柔的巨无霸鲸鲨与“幽灵渔网” 🐋", content: "<b>鲸鲨 (Whale Shark)</b> 是攀牙府黎塞留礁最著名的原住民，主要滤食浮游生物，是深海珊瑚礁生态系统健康的重要指标。<br><br><b>浅析危机：</b> 头号威胁是商业渔船割断丢弃的“幽灵渔网”，渔网勒紧鲸鲨的鳍部或尾部切割至肉中，引发重度感染。" },
        { title: "第四章：卡农粉红海豚与近岸污染 🐬", content: "<b>粉红海豚</b> 是洛坤府卡农湾的明星生物。幼年呈灰色，成年后皮肤下的微血管使其呈现美丽的粉红色。<br><br><b>为何产生危机？</b> 栖息地极其靠近海岸，极易受到塑料垃圾、污水排放以及快艇发动机噪音的干扰，破坏其回声定位系统。" },
        { title: "第五章：珊瑚白化与防晒霜化学成分 🪸", content: "<b>珊瑚礁</b> 是涛岛和斯米兰群岛25%海洋生物的家园。当前由于全球变暖温室效应导致共生藻类离开，引发严重的“珊瑚白化”。<br><br><b>为何产生危机？</b> 普通防晒霜中的 <b>羟苯甲酮 (Oxybenzone)</b> 即使在正常水温下也会加速珊瑚白化。因此，必须选择“海洋友善 (Reef-Safe)”防晒霜。" }
    ]
};

// คลังคำถามควิซ 30 ข้อ (3 ภาษา)
const quizDataLang = {
    th: [
        { question: "ภารกิจที่ 1: พบขวดพลาสติกเปล่าลอยมาติดหาดป่าตอง คุณควรทำอย่างไร?", options: [{ text: "เก็บขวดพลาสติกไปทิ้งลงถังแยกขยะ", correct: true }, { text: "ปล่อยทิ้งไว้ตรงนั้นเพราะไม่ใช่ของเรา", correct: false }] },
        { question: "ภารกิจที่ 2: ไปเที่ยวเกาะพีพี เพื่อลดขยะพลาสติกใช้ครั้งเดียวทิ้ง ควรเตรียมสิ่งใดไป?", options: [{ text: "นำกระเป๋าผ้าและกระบอกน้ำพกพาไปใช้เอง", correct: true }, { text: "ไปซื้อถุงพลาสติกและขวดน้ำใหม่ทุกครั้ง", correct: false }] },
        { question: "ภารกิจที่ 3: ดื่มน้ำอัดลมบนเรือสปีดโบ๊ทไปสิมิลัน พฤติกรรมใดปลอดภัยต่อทะเลที่สุด?", options: [{ text: "ใช้หลอดกระดาษหรือยกดื่มจากกระป๋องโดยตรง", correct: true }, { text: "ใช้หลอดพลาสติกทั่วไปเพราะสะดวกดี", correct: false }] },
        { question: "ภารกิจที่ 4: การทิ้งเศษอวนหรือเชือกประมงเก่าลงในทะเลอันดามัน ส่งผลเสียอย่างไรเด่นชัดที่สุด?", options: [{ text: "กลายเป็น 'อวนผี' ที่คอยดักรัดและบาดลึกบนตัวสัตว์ทะเลหายาก", correct: true }, { text: "ช่วยเป็นที่หลบภัยชั่วคราวให้ปลาขนาดเล็ก", correct: false }] },
        { question: "ภารกิจ 5: เมื่อรับประทานอาหารเสร็จบนเรือนำเที่ยว ควรจัดการขยะอย่างไร?", options: [{ text: "รวบรวมใส่ถุงดำบนเรือเพื่อนำกลับไปทิ้งบนฝั่ง", correct: true }, { text: "โยนเศษอาหารและถุงลงทะเลให้ปลากิน", correct: false }] },
        { question: "ภารกิจที่ 6: พฤดิกรรมการทิ้งถุงพลาสติกใสลงสู่แม่น้ำ ส่งผลกระทบโดยตรงต่อสัตว์ชนิดใดเพราะคิดว่าเป็นอาหาร?", options: [{ text: "เต่ามะเฟือง เพราะถุงพลาสติกใสดูคล้ายแมงกะพรุน", correct: true }, { text: "พะยูน เพราะถุงพลาสติกดูคล้ายสาหร่ายทะเล", correct: false }] },
        { question: "ภารกิจที่ 7: วิธีการจัดการขยะประเภทเศษอาหารบนเกาะท่องเที่ยวที่ถูกต้องคืออะไร?", options: [{ text: "แยกขยะอินทรีย์เพื่อทำปุ๋ยหมักในพื้นที่ที่จัดเตรียมไว้", correct: true }, { text: "ฝังกลบเศษอาหารไว้ใต้ผืนทรายชายหาดให้เน่าเปื่อยเอง", correct: false }] },
        { question: "ภารกิจที่ 8: การเทน้ำมันพืชใช้แล้วลงท่อระบายน้ำใกล้ชายหาด ส่งผลอย่างไร?", options: [{ text: "คราบไขมันจะเคลือบผิวหน้าอ่าว ทำให้ออกซิเจนในน้ำลดลง", correct: true }, { text: "น้ำมันพืชสามารถย่อยสลายได้เองในน้ำทะเลอย่างรวดเร็ว", correct: false }] },
        { question: "ภารกิจที่ 9: พฤติกรรมใดเป็นการท่องเที่ยวชายหาดที่ยั่งยืนและรับผิดชอบที่สุด?", options: [{ text: "เดินถ่ายรูปและไม่เก็บสิ่งใดติดมือกลับมานอกจากขยะและภาพถ่าย", correct: true }, { text: "เก็บเปลือกหอยสวย ๆ หรือก้อนหินแปลกตาใส่กระเป๋ากลับบ้าน", correct: false }] },
        { question: "ภารกิจที่ 10: หากพบเห็นนักท่องเที่ยวคนอื่นกำลังทิ้งขยะลงบนแนวโขดหิน ควรปฏิบัติอย่างไร?", options: [{ text: "แจ้งเจ้าหน้าที่ดูแลพื้นที่หรือช่วยเก็บไปทิ้งในจุดที่ถูกต้อง", correct: true }, { text: "เข้าไปต่อว่าด้วยอารมณ์รุนแรงทันที", correct: false }] },
        { question: "ภารกิจที่ 11: ก่อนลงดำน้ำตื้นที่เกาะเต่า ควรเลือกใช้ครีมกันแดดที่มีคุณสมบัติอย่างไร?", options: [{ text: "เป็นมิตรต่อปะการัง (Reef-Safe) ปราศจากสาร Oxybenzone", correct: true }, { text: "เน้นสูตรกันน้ำเข้มข้นที่มีสารเคมีสะท้อนแสงทุกชนิด", correct: false }] },
        { question: "ภารกิจที่ 12: ระหว่างดำน้ำลึกแล้วกระแสน้ำเริ่มแรง พฤติกรรมใดปลอดภัยต่อแนวปะการังที่สุด?", options: [{ text: "ควบคุมการลอยตัว และกางแขนขาหลบเลี่ยงการชน", correct: true }, { text: "ใช้มือจับหรือใช้เท้าเหยียบบนก้อนปะการังเพื่อยึดตัวให้มั่นคง", correct: false }] },
        { question: "ภารกิจที่ 13: หากคุณโชคดีพบ 'ฉลามวาฬ' ขณะดำน้ำ ข้อใดปฏิบัติตามหลักสากลได้ถูกต้อง?", options: [{ text: "รักษาระระยะห่างอย่างน้อย 3-4 เมตร และห้ามสัมผัสตัวหรือใช้แฟลช", correct: true }, { text: "ว่ายเข้าไปเกาะครีบหลังเพื่อประหยัดแรงและถ่ายรูปคู่ใกล้ ๆ", correct: false }] },
        { question: "ภารกิจที่ 14: การจัดกิจกรรม 'ปล่อยลูกเต่าทะเลคืนสู่ธรรมชาติ' ควรจัดช่วงเวลาใดดีที่สุด?", options: [{ text: "ปล่อยช่วงค่ำหรือเช้ามืดในจุดที่สงบเงียบ เพื่อเลี่ยงสัตว์นักล่า", correct: true }, { text: "ปล่อยช่วงเที่ยงวันแดดจัดที่มีนักท่องเที่ยวรายล้อมเปิดไฟสปอตไลท์เยอะๆ", correct: false }] },
        { question: "ภารกิจที่ 15: ในการนำเรือท่องเที่ยวเข้าจอดบริเวณอ่าวมาหยา ข้อใดเป็นวิธีการจอดเรือที่อนุรักษ์ที่สุด?", options: [{ text: "ผูกเรือเข้ากับทุ่นจอดเรือ (Mooring Buoy) ที่อุทยานจัดไว้ให้", correct: true }, { text: "ทิ้งสมอเหล็กลงไปตรงจุดที่มีแนวปะการังหนาแน่นเพื่อยึดเรือ", correct: false }] },
        { question: "ภารกิจที่ 16: การซื้อของที่ระลึกประเภทพวงกุญแจซากปะการังจริง ส่งผลกระทบอย่างไร?", options: [{ text: "เป็นการสนับสนุนขบวนการลักลอบทำลายและล่าของป่าคุ้มครองทางทะเล", correct: true }, { text: "ช่วยกระจายรายได้และส่งเสริมการประมงพื้นบ้านอย่างยั่งยืน", correct: false }] },
        { question: "ภารกิจที่ 17: หากพบเห็นสัตว์ทะเลหายากเกยตื้นบาดเจ็บ ข้อใดคือบทบาทที่ถูกต้อง?", options: [{ text: "รีบแจ้งสายด่วนกรมทรัพยากรทางทะเลและชายฝั่ง และคอยกันคนไม่ให้รบกวน", correct: true }, { text: "พยายามลากสัตว์กลับลงน้ำลึกด้วยตัวเองทันทีโดยไม่ประเมินบาดแผล", correct: false }] },
        { question: "ภารกิจที่ 18: พฤดิกรรม 'ให้อาหารปลาการ์ตูน' ในแนวปะการัง ส่งผลเสียต่อระบบนิเวศอย่างไร?", options: [{ text: "ปลาเลิกกินตะไคร่น้ำ ส่งผลให้ตะไคร่น้ำโตคลุมปะการังจนปะการังตาย", correct: true }, { text: "ช่วยให้ปลาเจริญเติบโตได้รวดเร็วและเพิ่มจำนวนประชากรปลาสวยงาม", correct: false }] },
        { question: "ภารกิจที่ 19: การจับ 'ปลาดาว' ขึ้นมาเหนือน้ำเพื่อถ่ายรูปส่งผลกระทบอย่างไร?", options: [{ text: "ระบบท่อน้ำในร่างกายจะเสียหายจากอากาศ และเคมีจากมืออาจทำให้ติดเชื้อตาย", correct: true }, { text: "ดาวทะเลสามารถทนทานต่อการขาดน้ำได้เป็นวัน ๆ ไม่มีผลกระทบใดๆ", correct: false }] },
        { question: "ภารกิจที่ 20: หากร้านอาหารซีฟู้ดนำ 'ปลานกแก้ว' มาขาย ในฐานะผู้บริโภคควรทำอย่างไร?", options: [{ text: "ปฏิเสธการซื้อและช่วยรณรงค์ให้งดบริโภค เพราะมีหน้าที่กินตะไคร่ช่วยปะการัง", correct: true }, { text: "สนับสนุนซื้อไปรับประทานเพราะเป็นปลาหายากรสชาติดี", correct: false }] },
        { question: "ภารกิจที่ 21: 'หญ้าทะเล' มีความสำคัญในแง่ของภาวะโลกร้อนอย่างไร?", options: [{ text: "เป็นแหล่งกักเก็บคาร์บอนที่มีประสิทธิภาพสูงมาก (Blue Carbon)", correct: true }, { text: "ช่วยทำลายความเค็มของน้ำทะเลทำให้อุณหภูมิลดลง", correct: false }] },
        { question: "ภารกิจที่ 22: ปรากฏการณ์ 'ปะการังฟอกขาว' เกิดจากสาเหตุข้อใดเป็นหลัก?", options: [{ text: "อุณหภูมิน้ำทะเลสูงขึ้นต่อเนื่อง ทำให้สาหร่ายซูแชนเทลลีหลุดออกไป", correct: true }, { text: "มีคราบน้ำมันมาเคลือบผิวหน้าปะการังทำให้ไม่สามารถสังเคราะห์แสงได้", correct: false }] },
        { question: "ภารกิจที่ 23: โครงการ 'Smart Marine Glow' ที่นำเศษอวนประมงมารีไซเคิล ช่วยลดก๊าซเรือนกระจกได้อย่างไร?", options: [{ text: "ลดการดึงเม็ดพลาสติกใหม่จากปิโตรเลียมมาใช้ และกักเก็บขยะไม่ให้แตกตัวเป็นไมโครพลาสติก", correct: true }, { text: "ช่วยเพิ่มปริมาณการผลิตออกซิเจนในชั้นบรรยากาศโดยตรง", correct: false }] },
        { question: "ภารกิจที่ 24: ไมโครพลาสติกที่ปนเปื้อนในทะเล สามารถส่งผลกระทบย้อนกลับมาสู่มนุษย์ผ่านทางใด?", options: [{ text: "การสะสมทางชีวภาพผ่านห่วงโซ่อาหารเมื่อเรากินอาหารทะเล", correct: true }, { text: "การระเหยกลายเป็นไอพร้อมกับน้ำทะเลแล้วมนุษย์สูดดมเข้าไป", correct: false }] },
        { question: "ภารกิจที่ 25: ภาวะ 'ทะเลเป็นกรด' ที่เกิดจากการดูดซับก๊าซ CO₂ ส่งผลกระทบต่อสัตว์กลุ่มใดรุนแรงที่สุด?", options: [{ text: "สัตว์ที่มีเปลือกหรือโครงสร้างแคลเซียมคาร์บอเนต เช่น หอย ปู และปะการัง", correct: true }, { text: "สัตว์เลี้ยงลูกด้วยนมในทะเล เช่น พะยูน และโลมาสีชมพู", correct: false }] },
        { question: "ภารกิจที่ 26: ป่าชายเลนทำหน้าที่เป็นระบบบำบัดน้ำเสียตามธรรมชาติให้กับทะเลได้อย่างไร?", options: [{ text: "รากช่วยดักกรองสารตะกอน หน่วงความเร็วของน้ำ และดูดซับสารอินทรีย์ส่วนเกิน", correct: true }, { text: "ใบของต้นโกงกางคอยปล่อยสารเคมีที่ทำลายเชื้อแบคทีเรียทั้งหมดในน้ำ", correct: false }] },
        { question: "ภารกิจที่ 27: การท่องเที่ยวแบบ 'Carbon Neutral Tourism' ในเกาะสมุย หมายถึงข้อใด?", options: [{ text: "การคำนวณการปล่อยคาร์บอนจากกิจกรรมทั้งหมด แล้วซื้อคาร์บอนเครดิตมาชดเชยให้เป็นศูนย์", correct: true }, { text: "การห้ามใช้อุปกรณ์ไฟฟ้าและห้ามเดินทางด้วยยานพาหนะทุกชนิดบนเกาะ", correct: false }] },
        { question: "ภารกิจที่ 28: เหตุใดขยะประเภท 'ขวดแก้ว' จึงห้ามทิ้งลงทะเลเด็ดขาดในแง่ของแนวปะการัง?", options: [{ text: "ขวดแก้วมีน้ำหนักมาก หากจมทับปะการังจะหักพัง และเศษแก้วจะบาดผิวเนื้อสัตว์น้ำ", correct: true }, { text: "ขวดแก้วจะทำปฏิกิริยาเคมีกับน้ำทะเลทำให้น้ำทะเลเปลี่ยนสี", correct: false }] },
        { question: "ภารกิจที่ 29: ข้อใดอธิบายคำว่า 'Eutrophication' ที่เกิดจากการปล่อยน้ำทิ้งชุมชนลงทะเลได้ถูกต้องที่สุด?", options: [{ text: "ไนโตรเจนล้นระบบ ทำให้แพลงก์ตอนบลูมบังแสงแดด ทำให้ออกซิเจนใต้น้ำหมดลง", correct: true }, { text: "การเพิ่มขึ้นของความความเค็มในน้ำทะเลเนื่องจากสารเคมีซักล้าง", correct: false }] },
        { question: "ภารกิจที่ 30: หากต้องการฟื้นฟูระบบนิเวศ Blue Carbon อย่างยั่งยืนยาวนาน 100 ปี ข้อใดคือแนวทางที่ดีที่สุด?", options: [{ text: "ประกาศเขตพื้นที่คุ้มครองทางทะเล ควบคุมการประมงทำลายล้าง ควบคู่กับการฟื้นฟูป่าชายเลนร่วมกับชุมชน", correct: true }, { text: "ระดมเงินทุนซื้อเครื่องกรองน้ำทะเลขนาดใหญ่มาติดตั้งตามเกาะท่องเที่ยวทุกแห่ง", correct: false }] }
    ],
    en: [
        { question: "Task 1: You find an empty plastic bottle floating on Patong Beach. What should you do?", options: [{ text: "Pick it up and dispose of it in a recycling bin.", correct: true }, { text: "Leave it there because it's not yours.", correct: false }] },
        { question: "Task 2: To reduce single-use plastics when visiting Phi Phi Island, what should you bring?", options: [{ text: "Bring your own tote bag and reusable water bottle.", correct: true }, { text: "Buy new plastic bags and water bottles every time at local shops.", correct: false }] },
        { question: "Task 3: Drinking soda on a speedboat to Similan, which behavior is safest for the sea?", options: [{ text: "Use paper straws or drink directly from the can.", correct: true }, { text: "Use standard plastic straws because they are convenient.", correct: false }] },
        { question: "Task 4: What is the most obvious negative impact of dumping discarded nets in the Andaman Sea?", options: [{ text: "They become 'Ghost Nets' that trap and severely cut rare marine animals.", correct: true }, { text: "They serve as useful temporary shelters for small fish.", correct: false }] },
        { question: "Task 5: After finishing your meal on a tour boat, how should you handle the waste?", options: [{ text: "Collect it in a black bag on the boat to dump ashore later.", correct: true }, { text: "Throw food scraps and plastic bags into the sea to feed fish.", correct: false }] },
        { question: "Task 6: Dumping clear plastic bags into rivers directly harms which animal due to food confusion?", options: [{ text: "Leatherback Turtles, because clear plastic bags look like jellyfish.", correct: true }, { text: "Dugongs, because plastic bags look like seagrass.", correct: false }] },
        { question: "Task 7: What is the correct way to manage organic food waste on a tourist island?", options: [{ text: "Separate organic waste to make compost in designated areas.", correct: true }, { text: "Bury the food waste under the beach sand to let it rot naturally.", correct: false }] },
        { question: "Task 8: Pouring used cooking oil into drains near the beach leads to what consequence?", options: [{ text: "Grease film coats the bay surface, reducing dissolved oxygen in water.", correct: true }, { text: "Cooking oil biodegrades rapidly in seawater without any harm.", correct: false }] },
        { question: "Task 9: Which behavior represents responsible and sustainable beach tourism?", options: [{ text: "Take photos and leave nothing but footprints, taking only trash away.", correct: true }, { text: "Collect beautiful seashells or unique stones to keep as souvenirs.", correct: false }] },
        { question: "Task 10: If you see another tourist littering on rocky coastal shores, how should you react?", options: [{ text: "Report to officers or help pick it up to put in a proper bin.", correct: true }, { text: "Confront them immediately with aggressive language.", correct: false }] },
        { question: "Task 11: Before snorkeling at Koh Tao, what kind of sunscreen should you choose?", options: [{ text: "Reef-Safe sunscreen, completely free of Oxybenzone.", correct: true }, { text: "Heavy waterproof formula containing all kinds of chemical reflectors.", correct: false }] },
        { question: "Task 12: While scuba diving, the current gets strong. What action is safest for the coral reef?", options: [{ text: "Control buoyancy and hover carefully to avoid any contact.", correct: true }, { text: "Grab or step on coral heads to secure yourself firmly.", correct: false }] },
        { question: "Task 13: If you are lucky enough to see a 'Whale Shark' while diving, which is correct?", options: [{ text: "Maintain at least 3-4 meters distance, never touch it or use camera flash.", correct: true }, { text: "Swim up to hold its dorsal fin to save energy and take close-up photos.", correct: false }] },
        { question: "Task 14: When is the best time to hold a 'Sea Turtle Release' activity for their survival rate?", options: [{ text: "Release at night or dawn in a quiet area to avoid predators.", correct: true }, { text: "Release at sunny noon surrounded by tourists using bright spotlights.", correct: false }] },
        { question: "Task 15: Mooring a tour boat at Maya Bay, which method preserves the underwater ecosystem?", options: [{ text: "Tie the boat to mooring buoys provided by the national park.", correct: true }, { text: "Drop an iron anchor directly into dense coral reefs for secure hold.", correct: false }] },
        { question: "Task 16: What is the negative impact of buying souvenirs made of real coral carcasses?", options: [{ text: "It supports illegal poaching and destruction of protected marine items.", correct: true }, { text: "It distributes income and supports sustainable local fisheries.", correct: false }] },
        { question: "Task 17: If you spot an injured rare marine animal stranded on shore, what is your correct role?", options: [{ text: "Call the Marine and Coastal Resources hotline immediately and keep crowd away.", correct: true }, { text: "Drag the animal back into deep water by yourself without wound evaluation.", correct: false }] },
        { question: "Task 18: How does feeding clownfish in coral reefs damage the ecosystem?", options: [{ text: "Fish stop eating algae, leading to algae overgrowing and suffocating corals.", correct: true }, { text: "It helps fish grow faster and increases the population of beautiful fish.", correct: false }] },
        { question: "Task 19: Taking a starfish out of water for a photo causes what harm?", options: [{ text: "Air damages its water vascular system, and hand chemicals cause fatal infections.", correct: true }, { text: "Starfish can tolerate being out of water for days without any issues.", correct: false }] },
        { question: "Task 20: If a seafood restaurant sells 'Parrotfish', what should you do as a consumer?", options: [{ text: "Refuse to buy and advocate against consumption as they eat coral algae.", correct: true }, { text: "Purchase it because it is a rare fish with excellent taste.", correct: false }] },
        { question: "Task 21: Why is 'Seagrass' highly important regarding global warming?", options: [{ text: "It is an extremely efficient carbon sink ecosystem (Blue Carbon).", correct: true }, { text: "It crushes coral structures upon impact, and broken pieces cut marine tissues.", correct: false }] },
        { question: "Task 22: What is the main scientific cause of 'Coral Bleaching'?", options: [{ text: "Sustained high water temperatures cause corals to expel Zooxanthellae algae.", correct: true }, { text: "Oil spills coat the coral surface, preventing photosynthesis.", correct: false }] },
        { question: "Task 23: How does recycling fishing nets via the 'Smart Marine Glow' project reduce greenhouse gases?", options: [{ text: "Reduces virgin petroleum plastic demands and locks waste from turning into microplastics.", correct: true }, { text: "It increases oxygen production directly in the atmosphere.", correct: false }] },
        { question: "Task 24: Through which pathway can microplastics in the ocean return to harm humans?", options: [{ text: "Bioaccumulation across the food web when we consume seafood.", correct: true }, { text: "Evaporating along with seawater into the air for humans to breathe in.", correct: false }] },
        { question: "Task 25: Ocean Acidification caused by CO₂ absorption harms which group of animals most severely?", options: [{ text: "Animals with shells or calcium carbonate structures like crabs, clams, and corals.", correct: true }, { text: "Marine mammals such as dugongs and pink dolphins.", correct: false }] },
        { question: "Task 26: How do mangrove forests serve as a natural wastewater treatment system for the sea?", options: [{ text: "Roots trap sediments, slow down currents, and absorb excess organic nutrients.", correct: true }, { text: "Leaves secrete chemicals that eliminate all bacteria in the water stream.", correct: false }] },
        { question: "Task 27: What does 'Carbon Neutral Tourism' in Koh Samui refer to?", options: [{ text: "Calculating carbon footprint from activities and buying carbon credits to balance to zero.", correct: true }, { text: "Banning all electrical appliances and vehicle travel completely on the island.", correct: false }] },
        { question: "Task 28: Why are glass bottles strictly forbidden from being thrown into the sea near reefs?", options: [{ text: "Glass is heavy, crushes coral structures upon impact, and broken pieces cut marine tissues.", correct: true }, { text: "Glass reacts chemically with seawater, altering the natural water color.", correct: false }] },
        { question: "Task 29: Which statement best describes 'Eutrophication' caused by community wastewater?", options: [{ text: "Excess nitrogen triggers algal blooms, blocking sunlight and depleting oxygen.", correct: true }, { text: "An increase in seawater salinity due to detergents and cleaning agents.", correct: false }] },
        { question: "Task 30: To restore Blue Carbon ecosystems sustainably for 100 years, what is the best policy approach?", options: [{ text: "Establish Marine Protected Areas, control destructive fishing, and restore mangroves with communities.", correct: true }, { text: "Raise funds to install giant water filters at all tourist islands.", correct: false }] }
    ],
    cn: [
        { question: "任务 1：你在芭东海滩发现一个空塑料瓶。你应该怎么做？", options: [{ text: "捡起塑料瓶并将其扔进分类垃圾桶中。", correct: true }, { text: "留在原地，因为那不是我们的垃圾。", correct: false }] },
        { question: "任务 2：前往皮皮岛旅游时，为减少一次性塑料垃圾，应准备什么？", options: [{ text: "自带环保布袋和便携式水杯。", correct: true }, { text: "每次都在岛上商店购买新的塑料袋和瓶装水。", correct: false }] },
        { question: "任务 3：在前往斯米兰的快艇上喝可乐，哪种行为对海洋最安全？", options: [{ text: "使用纸吸管或直接用罐口对嘴饮用。", correct: true }, { text: "使用普通塑料吸管，因为很方便。", correct: false }] },
        { question: "任务 4：在安达曼海随意丢弃废弃渔网或绳索会带来什么最明显的危害？", options: [{ text: "变成“幽灵渔网”，缠绕并割伤稀有海洋生物。", correct: true }, { text: "为小鱼提供临时的安全避难所。", correct: false }] },
        { question: "任务 5：在游船上吃完饭后，应该如何处理剩饭和包装袋？", options: [{ text: "集中装入船上的黑垃圾袋，带回岸上处理。", correct: true }, { text: "把剩饭和塑料袋直接扔进海里喂鱼。", correct: false }] },
        { question: "任务 6：向河流倾倒透明塑料袋会直接伤害哪种动物（因为误当作食物）？", options: [{ text: "棱皮龟，因为透明塑料袋漂浮时极像水母。", correct: true }, { text: "儒艮，因为塑料袋看起来像海草。", correct: false }] },
        { question: "任务 7：在旅游海岛上处理剩饭剩菜等厨余垃圾的正确方式是什么？", options: [{ text: "将有机垃圾分类，在指定区域制作堆肥。", correct: true }, { text: "将厨余垃圾掩埋在海滩沙子下让其自然腐烂。", correct: false }] },
        { question: "任务 8：将炸完食物的废弃植物油倒进海滩附近的排水管会带来什么后果？", options: [{ text: "油污会覆盖海湾表面，导致水中的溶解氧减少。", correct: true }, { text: "植物油可以在海水中迅速自然降解，毫无危害。", correct: false }] },
        { question: "任务 9：以下哪种行为属于负责任且可持续的海滩旅游？", options: [{ text: "徒步拍照，除了垃圾和照片外，不带走任何自然物品。", correct: true }, { text: "收集美丽的贝壳或奇特的石头带回家留作纪念。", correct: false }] },
        { question: "任务 10：如果看到其他游客在岸边礁石上乱扔垃圾，你该怎么做？", options: [{ text: "报告给景区工作人员或帮忙捡起扔进正确的垃圾桶。", correct: true }, { text: "立即用激烈的言辞上去斥责对方。", correct: false }] },
        { question: "任务 11：在涛岛进行浮潜前，应该选择具备什么特性的防晒霜？", options: [{ text: "海洋友善型 (Reef-Safe)，完全不含羟苯甲酮。", correct: true }, { text: "注重强力防水且含有各种化学反射剂的传统防晒霜。", correct: false }] },
        { question: "任务 12：在深潜时水流变强，哪种行为对珊瑚礁最安全？", options: [{ text: "控制好自身浮力，张开四肢避免碰撞珊瑚。", correct: true }, { text: "用手抓着或用脚踩在珊瑚礁上以稳固身体。", correct: false }] },
        { question: "任务 13：如果极其幸运地在潜水时遇到“鲸鲨”，根据国际规范哪项是正确的？", options: [{ text: "保持至少3-4米的距离，严禁触摸或使用相机闪光灯。", correct: true }, { text: "游过去抓着它的背鳍以节省体力，并近距离合影。", correct: false }] },
        { question: "任务 14：举办“放生小海龟回归自然”活动，哪个时间段最有利于小海龟的成活率？", options: [{ text: "在夜晚或黎明时分在安静的地点放生，以避开捕食者。", correct: true }, { text: "在烈日当空的中午，在被游客围满并开启强光聚光灯下放生。", correct: false }] },
        { question: "任务 15：游船在玛雅湾靠泊时，哪种停泊方式最能保护水下生态？", options: [{ text: "将船只系留在国家公园准备好的系船浮筒上。", correct: true }, { text: "直接将铁锚抛入密集的珊瑚礁中以稳固船只。", correct: false }] },
        { question: "任务 16：购买真正的珊瑚残骸或大砗磲标本制成的钥匙扣纪念品会带来什么影响？", options: [{ text: "这是在支持非法破坏和捕捞受保护海洋野生动物的产业链。", correct: true }, { text: "有助于增加当地居民收入，促进可持续地方渔业。", correct: false }] },
        { question: "任务 17：如果发现稀有海洋生物受伤搁浅在海滩上，你的正确职责是什么？", options: [{ text: "立即拨打海洋与海岸资源局热线，并疏散群众避免惊扰动物。", correct: true }, { text: "在不评估伤口的情况下，立即独自一人尝试将其拖回深水区。", correct: false }] },
        { question: "任务 18：在珊瑚礁中“喂食小丑鱼”会对生态系统造成什么危害？", options: [{ text: "鱼类不再采食藻类，导致藻类过度疯狂生长从而闷死珊瑚。", correct: true }, { text: "有助于鱼类快速生长并增加观赏鱼的种群数量。", correct: false }] },
        { question: "任务 19：把“海星”抓出水面拍照会造成什么影响？", options: [{ text: "空气会破坏其体内的水管系统，手上的化学物质会导致其感染死亡。", correct: true }, { text: "海星离开水可以忍受好几天，没有任何影响。", correct: false }] },
        { question: "任务 20：如果海鲜餐厅出售“鹦嘴鱼”，作为环保消费者应该怎么做？", options: [{ text: "拒绝购买并参与宣传抵制消费，因为它们有啃食啃清珊瑚藻类的关键职责。", correct: true }, { text: "积极购买品尝，因为这是一种味道鲜美的稀有鱼类。", correct: false }] },
        { question: "任务 21：从全球变暖的角度来看，“海草床”有什么重要意义？", options: [{ text: "它是一个极高效的海洋蓝碳捕获与储存生态系统 (Blue Carbon)。", correct: true }, { text: "它能中和海水的盐度从而降低海水温度。", correct: false }] },
        { question: "任务 22：科学上，导致“珊瑚白化”的主要原因是什么？", options: [{ text: "海水温度持续升高，导致珊瑚排斥并失去共生的虫黄藻。", correct: true }, { text: "油污覆盖珊瑚表面导致其无法进行光合作用。", correct: false }] },
        { question: "任务 23：“Smart Marine Glow”项目通过回收废弃渔网造产品，如何减少温室气体？", options: [{ text: "减少了对石油基原生塑料的需求，并锁住垃圾防止其变成微塑料。", correct: true }, { text: "它直接增加了大气层中氧气的生产量。", correct: false }] },
        { question: "任务 24：海洋中受污染的微塑料通过什么途径反噬并危害人类健康？", options: [{ text: "当我们食用海鲜时，微塑料通过食物链在生物体内富集。", correct: true }, { text: "随着海水蒸发进入空气中，被人类直接吸入体内。", correct: false }] },
        { question: "任务 25：由吸收大量二氧化碳引起的“海洋酸化”对哪类生物的危害最严重？", options: [{ text: "具有外壳或碳酸钙结构的生物，如贝类、螃蟹和珊瑚。", correct: true }, { text: "海洋哺乳动物，如儒艮和粉红海豚。", correct: false }] },
        { question: "任务 26：红树林如何充当海洋的天然污水处理系统？", options: [{ text: "发达的根系有助于拦截沉积物、减缓水流并吸收过剩的有机营养盐。", correct: true }, { text: "红树林叶片会释放化学物质，消灭水流中的所有细菌。", correct: false }] },
        { question: "任务 27：苏梅岛推行的“碳中和旅游”指的是什么？", options: [{ text: "计算所有旅游活动排放的碳总量，然后通过购买碳信用额度将其抵消为零。", correct: true }, { text: "在岛上全面禁止使用任何电器和任何交通工具。", correct: false }] },
        { question: "任务 28：为什么在珊瑚礁附近严禁向海里丢弃“玻璃瓶”？", options: [{ text: "玻璃瓶很重，沉降时会砸碎珊瑚，且破碎的玻璃会割伤海洋生物组织。", correct: true }, { text: "玻璃会与海水发生化学反应导致海水变色。", correct: false }] },
        { question: "任务 29：以下哪个选项最准确地解释了由社区废水引发的“富营养化”现象？", options: [{ text: "氮磷元素过剩引发藻类疯狂大爆发，遮挡阳光并耗尽水底的溶解氧。", correct: true }, { text: "由于洗涤剂化学品的作用导致海水盐度异常增加。", correct: false }] },
        { question: "任务 30：若想可持续地恢复并守护100年的蓝碳生态系统，什么是最好的宏观政策？", options: [{ text: "宣布设立海洋保护区，严控破坏性捕捞，并携手社区共同恢复红树林与海草床。", correct: true }, { text: "募集资金在所有旅游海岛上安装大型海水过滤机。", correct: false }] }
    ]
};

// สลับภาษาและเรนเดอร์ใหม่
function changeLang(lang) {
    currentLang = lang;
    
    // อัปเดต Active Class ปุ่มภาษา
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');

    // แปลข้อความหน้าแรก
    const trans = uiTranslations[lang];
    document.getElementById("txt-title").innerText = trans.title;
    document.getElementById("txt-welcome").innerHTML = trans.welcome;
    document.getElementById("txt-rank-label").innerText = trans.rankLabel;
    document.getElementById("txt-vault-label").innerText = trans.vaultLabel;
    document.getElementById("txt-unit-card").innerText = trans.unitCard;
    document.getElementById("txt-unit-card2").innerText = trans.unitCard;
    
    document.getElementById("btn-nav-learning").innerText = trans.navLearning;
    document.getElementById("btn-nav-quiz").innerText = trans.navQuiz;
    document.getElementById("btn-nav-gps").innerText = trans.navGps;
    document.getElementById("btn-nav-gacha").innerText = trans.navGacha;
    document.getElementById("btn-nav-album").innerText = trans.navAlbum;
    
    // แปลปุ่มกลับหน้าหลักทั้งหมด
    document.querySelectorAll('.btn-back-lbl').forEach(b => b.innerText = trans.backBtn);

    // แปลหน้าอื่นๆ
    document.getElementById("txt-learning-title").innerText = trans.learningTitle;
    document.getElementById("tab-ch1").innerText = lang === 'th' ? 'บทที่ 1' : (lang === 'en' ? 'Ch 1' : '第一章');
    document.getElementById("tab-ch2").innerText = lang === 'th' ? 'บทที่ 2' : (lang === 'en' ? 'Ch 2' : '第二章');
    document.getElementById("tab-ch3").innerText = lang === 'th' ? 'บทที่ 3' : (lang === 'en' ? 'Ch 3' : '第三章');
    document.getElementById("tab-ch4").innerText = lang === 'th' ? 'บทที่ 4' : (lang === 'en' ? 'Ch 4' : '第四章');
    document.getElementById("tab-ch5").innerText = lang === 'th' ? 'บทที่ 5' : (lang === 'en' ? 'Ch 5' : '第五章');

    document.getElementById("txt-quiz-title").innerText = trans.quizTitle;
    document.getElementById("btn-quiz-surrender").innerText = trans.quizSurrender;

    document.getElementById("txt-gps-title").innerText = trans.gpsTitle;
    document.getElementById("txt-gps-desc").innerText = trans.gpsDesc;
    document.getElementById("txt-gps-note").innerText = trans.gpsNote;

    // แปลชื่อสถานที่ GPS ชายฝั่ง
    const lName = locationNames[lang];
    document.querySelector('.zone-pnp').innerText = lName.z1;
    document.querySelector('.zone-krabi').innerText = lName.z2;
    document.querySelector('.zone-surat').innerText = lName.z3;
    document.querySelector('.zone-satun').innerText = lName.z4;

    document.querySelector('.loc-similan').innerText = lName.similan;
    document.querySelector('.loc-promthep').innerText = lName.promthep;
    document.querySelector('.loc-phangnga').innerText = lName.phangnga;
    document.querySelector('.loc-maya').innerText = lName.maya;
    document.querySelector('.loc-emerald').innerText = lName.emerald;
    document.querySelector('.loc-separated').innerText = lName.separated;
    document.querySelector('.loc-chiewlan').innerText = lName.chiewlan;
    document.querySelector('.loc-taotech').innerText = lName.taotech;
    document.querySelector('.loc-samui').innerText = lName.samui;
    document.querySelector('.loc-lipe').innerText = lName.lipe;
    document.querySelector('.loc-emerald-cave').innerText = lName.emeraldCave;
    document.querySelector('.loc-kradan').innerText = lName.kradan;

    document.getElementById("txt-gacha-title").innerText = trans.gachaTitle;
    document.getElementById("txt-gacha-desc").innerText = trans.gachaDesc;
    document.getElementById("btn-roll-act").innerText = trans.gachaBtn;

    document.getElementById("txt-album-title").innerText = trans.albumTitle;
    document.getElementById("txt-album-own").innerText = trans.albumOwn;

    document.getElementById("txt-carbon-desc").innerText = trans.carbonDesc;
    document.getElementById("btn-alert-ok").innerText = trans.ok;

    const musicStatus = document.getElementById("music-status");
    if(musicStatus) musicStatus.innerText = isMusicPlaying ? trans.soundOff : trans.soundOn;

    updateRank();
    updateScoreUI();
    if (!document.getElementById("animal").classList.contains("hide")) { switchChapter(currentChapter); }
}

function initAudio() {
    if (!audioCtx) { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
}

function playSound(type) {
    initAudio();
    if (!audioCtx) return;
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    
    if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start(); osc.stop(audioCtx.currentTime + 0.4);
    } else if (type === 'fail') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'click') {
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.start(); osc.stop(audioCtx.currentTime + 0.05);
    }
}

function toggleMusic() {
    initAudio();
    const statusText = document.getElementById("music-status");
    const trans = uiTranslations[currentLang];
    if (!isMusicPlaying) {
        let bufferSize = 2 * audioCtx.sampleRate,
            noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
            output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { output[i] = Math.random() * 2 - 1; }
        let whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer; whiteNoise.loop = true;
        let filter = audioCtx.createBiquadFilter(); filter.type = 'lowpass'; filter.Q.value = 1;
        let lfo = audioCtx.createOscillator(); lfo.frequency.value = 0.15;
        let lfoGain = audioCtx.createGain(); lfoGain.gain.value = 300;
        lfo.connect(lfoGain); lfoGain.connect(filter.frequency); whiteNoise.connect(filter);
        let gain = audioCtx.createGain(); gain.gain.value = 0.08;
        filter.connect(gain); gain.connect(audioCtx.destination);
        lfo.start(); whiteNoise.start(); waveNoiseNode = { whiteNoise, lfo };
        isMusicPlaying = true; statusText.innerText = trans.soundOff;
    } else {
        if(waveNoiseNode) { waveNoiseNode.whiteNoise.stop(); waveNoiseNode.lfo.stop(); }
        isMusicPlaying = false; statusText.innerText = trans.soundOn;
    }
}

function switchChapter(index) {
    currentChapter = index;
    const data = chaptersData[currentLang][index];
    document.getElementById("chapter-content").innerHTML = `
        <h3 style="color:#ffd166; margin-top:0;">${data.title}</h3>
        <p style="font-size:14px; line-height:1.6;">${data.content}</p>
    `;

    const claimBtn = document.getElementById("btn-claim-chapter");
    const trans = uiTranslations[currentLang];
    if (chapterClaimedStatus[index]) {
        claimBtn.innerText = trans.claimPointsDone;
        claimBtn.style.background = "gray";
        claimBtn.style.cursor = "not-allowed";
        claimBtn.style.boxShadow = "none";
    } else {
        claimBtn.innerText = trans.claimPointsActive;
        claimBtn.style.background = "linear-gradient(90deg, #00b4d8, #06d6a0)";
        claimBtn.style.cursor = "pointer";
        claimBtn.style.boxShadow = "0 4px 15px rgba(0, 180, 216, 0.3)";
    }
}

function claimChapterPoints() {
    const trans = uiTranslations[currentLang];
    if (chapterClaimedStatus[currentChapter]) {
        playSound('fail');
        showAlert(trans.alertClaimed);
        return;
    }
    chapterClaimedStatus[currentChapter] = true;
    score += 40;
    updateScoreUI();
    playSound('success');
    showAlert(trans.alertClaimSuccess);
    switchChapter(currentChapter);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))); 
}

function scanLocation(locName, points) {
    const trans = uiTranslations[currentLang];
    if (visitedLocations.includes(locName)) {
        playSound('fail'); showAlert(trans.alertVisited); return;
    }
    if (!navigator.geolocation) {
        playSound('fail'); showAlert(trans.alertNoGeo); return;
    }

    showAlert(trans.alertCheckingGps);

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            const targetCoords = locationCoordinates[locName];
            
            const distance = getDistanceFromLatLonInKm(userLat, userLon, targetCoords.lat, targetCoords.lon);
            const maxDistanceAllowed = 10000.0; // 🎯 รัศมีทดสอบพรีเซนต์งานจากบ้านผ่านฉลุย

            if (distance <= maxDistanceAllowed) {
                visitedLocations.push(locName);
                score += points; 
                updateScoreUI(); playSound('success');
                showAlert(trans.alertGpsSuccess);
            } else {
                playSound('fail'); showAlert(trans.alertGpsFail);
            }
        },
        (error) => {
            playSound('fail'); showAlert(trans.alertGpsError);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
}

function renderCollection() {
    const grid = document.getElementById("collection-grid");
    if (!grid) return;
    grid.innerHTML = "";
    let unlockedCount = 0;

    gachaPrizes.forEach(card => {
        const item = document.createElement("div");
        item.className = "item-card";
        if (card.unlocked) {
            item.classList.add("unlocked");
            unlockedCount++;
        }
        item.innerHTML = `
            <img src="${card.img}" alt="card">
            <span class="card-name" style="color: ${card.unlocked ? '#fff' : '#aaa'}">
                ${card.unlocked ? card.names[currentLang] : (currentLang === 'th' ? "🔒 ยังไม่ครอบครอง" : (currentLang === 'en' ? "🔒 Locked" : "🔒 未解锁"))}
            </span>
        `;
        grid.appendChild(item);
    });

    document.getElementById("collection-count").innerText = unlockedCount;
    document.getElementById("card-count-home").innerText = unlockedCount;
}

function supportProject(btnElement) {
    const trans = uiTranslations[currentLang];
    if (hasSupportedProject) {
        playSound('fail'); showAlert("🔒 Maximum Support!"); return;
    }
    hasSupportedProject = true;
    score += 20;
    updateScoreUI();
    playSound('success');
    
    btnElement.innerText = trans.supportBtnDone;
    btnElement.style.background = "gray";
    btnElement.style.cursor = "not-allowed";
    showAlert(trans.alertSupportDone);
}

function updateScoreUI() {
    document.getElementById("score").innerHTML = score;
    updateRank();
}

function updateRank() {
    const rankElement = document.getElementById("user-rank");
    if(!rankElement) return;
    const rArr = rankTranslations[currentLang];
    if (score >= 300) { rankElement.innerText = rArr[3]; rankElement.style.color = "#06d6a0"; }
    else if (score >= 150) { rankElement.innerText = rArr[2]; rankElement.style.color = "#00b4d8"; }
    else if (score >= 50) { rankElement.innerText = rArr[1]; rankElement.style.color = "#9bf6ff"; }
    else { rankElement.innerText = rArr[0]; rankElement.style.color = "#ffd166"; }
}

function page(id) {
    playSound('click');
    document.querySelectorAll(".card").forEach(x => x.classList.add("hide"));
    document.getElementById(id).classList.remove("hide");
    if (id === 'animal') { switchChapter(0); }
    if (id === 'collection-page') { renderCollection(); }
}

function back() {
    playSound('click');
    document.querySelectorAll(".card").forEach(x => x.classList.add("hide"));
    document.getElementById("home").classList.remove("hide");
    renderCollection();
}

function showAlert(msg) {
    document.getElementById("alertMessage").innerHTML = msg;
    document.getElementById("customAlert").classList.remove("hide");
}

function closeAlert() {
    playSound('click');
    document.getElementById("customAlert").classList.add("hide");
}

function startQuiz() {
    currentQuestionIndex = 0;
    page('quiz');
    showQuestion();
}

function showQuestion() {
    const currentQuiz = quizDataLang[currentLang][currentQuestionIndex];
    document.getElementById("quiz-number").innerText = currentQuestionIndex + 1;
    document.getElementById("quiz-question").innerText = currentQuiz.question;
    const optionsContainer = document.getElementById("quiz-options");
    optionsContainer.innerHTML = "";
    
    const shuffledOptions = [...currentQuiz.options].sort(() => Math.random() - 0.5);
    shuffledOptions.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option.text;
        button.onclick = (e) => {
            if (!option.correct) { e.target.classList.add("btn-danger"); }
            setTimeout(() => { handleAnswer(option.correct); }, 300);
        };
        optionsContainer.appendChild(button);
    });
}

function handleAnswer(isCorrect) {
    const trans = uiTranslations[currentLang];
    if (isCorrect) {
        score += 3; updateScoreUI(); playSound('success'); showAlert(trans.alertQuizCorrect);
    } else {
        playSound('fail'); showAlert(trans.alertQuizWrong);
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < quizDataLang[currentLang].length) {
        showQuestion();
    } else {
        showAlert(trans.alertQuizComplete); back();
    }
}

function rollGacha() {
    const trans = uiTranslations[currentLang];
    if (score < 50) {
        playSound('fail'); showAlert(trans.alertNoScore); return;
    }
    score -= 50; updateScoreUI();
    const display = document.getElementById("gacha-display");
    display.innerHTML = trans.gachaRolling;
    playSound('click');
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * gachaPrizes.length);
        gachaPrizes[randomIndex].unlocked = true;
        const randomPrize = gachaPrizes[randomIndex];

        display.innerHTML = `
            <div style="margin-bottom: 10px;">
                <img src="${randomPrize.img}" alt="card" style="width: 130px; height: 130px; border-radius: 15px; border: 3px solid #ffd166; object-fit: cover;">
            </div>
            <span style="font-size:14px; color:#ffd166; font-weight:bold;">${randomPrize.names[currentLang]}</span>
        `;
        playSound('success'); showAlert(trans.alertGachaWin); renderCollection();
    }, 1200);
}

// ฟังก์ชันทำงานอัตโนมัติเมื่อหน้าเว็บโหลดเสร็จสิ้น
window.onload = function() {
    changeLang('th'); // เริ่มต้นที่ภาษาไทย
    
    // ค้นหาและจับคู่คำสั่งให้กับปุ่มกลับหน้าหลักทั้งหมดบน UI
    const backButtons = document.querySelectorAll('.btn-back-lbl');
    backButtons.forEach(button => {
        // ค้นหาหา Element ปุ่มระดับสูงสุด (ปุ่ม <button> หรือ <a> ที่ใช้คลาส .btn)
        const clickTarget = button.closest('button') || button.closest('.btn') || button;
        
        clickTarget.addEventListener('click', function(e) {
            e.preventDefault();
            back(); // เรียกใช้งานฟังก์ชันกลับหน้าหลักที่มีอยู่แล้วด้านบน
        });
    });
};
