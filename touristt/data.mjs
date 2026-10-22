// Content for the Touristt site. Everything the pages show lives here, so
// Touristt (or whoever maintains the site) edits this file and re-runs
// `node build.mjs`.
//
// Values marked PLACEHOLDER must be replaced with Touristt's real details
// before the site goes live.

export const SITE = {
  name: { ar: "توريست", en: "Touristt" },
  domain: "https://sellzari-a11y.github.io/sellzari-a11y", // replace with Touristt's own domain when they have one
  whatsapp: "60100000000", // PLACEHOLDER: WhatsApp number, international format, digits only
  whatsappDisplay: "+60 10-000 0000", // PLACEHOLDER
  instagram: "https://www.instagram.com/touristt", // PLACEHOLDER: confirm handle
  tiktok: "https://www.tiktok.com/@touristt", // PLACEHOLDER: confirm handle
  tiktokHandle: "@touristt", // PLACEHOLDER
  email: "hello@touristt.example", // PLACEHOLDER
  examYear: 2026, // Sudanese certificate season shown on the congratulations page
  usdRate: 4.2, // default RM per 1 USD in the cost calculator (editable by the visitor)
};

// Field-of-study keys used by the finder.
export const FIELDS = {
  eng: { ar: "الهندسة", en: "Engineering" },
  med: { ar: "الطب والعلوم الصحية", en: "Medicine & health" },
  it: { ar: "الحاسوب وتقنية المعلومات", en: "Computing & IT" },
  bus: { ar: "إدارة الأعمال والمحاسبة", en: "Business & accounting" },
  isl: { ar: "الدراسات الإسلامية والعربية", en: "Islamic & Arabic studies" },
  des: { ar: "التصميم والإعلام", en: "Design & media" },
  sci: { ar: "العلوم", en: "Sciences" },
  law: { ar: "القانون", en: "Law" },
  hos: { ar: "الضيافة والسياحة", en: "Hospitality & tourism" },
};

export const CITIES = {
  kl: { ar: "كوالالمبور", en: "Kuala Lumpur" },
  sel: { ar: "سلانجور", en: "Selangor" },
  cyb: { ar: "سايبرجايا وبوتراجايا", en: "Cyberjaya & Putrajaya" },
  pen: { ar: "بينانج", en: "Penang" },
  jhr: { ar: "جوهور", en: "Johor" },
  ns: { ar: "نيلاي (نيجري سمبيلان)", en: "Nilai (Negeri Sembilan)" },
  prk: { ar: "بيراك", en: "Perak" },
};

export const LANGS = {
  en: { ar: "الإنجليزية", en: "English" },
  ar: { ar: "العربية", en: "Arabic" },
  ms: { ar: "الملايوية", en: "Malay" },
};

// Indicative yearly tuition for international bachelor's students, in RM.
// These are planning ranges only, not quotes; Touristt should confirm them
// with each university every intake.
export const UNIVERSITIES = [
  {
    slug: "universiti-malaya", short: "UM", type: "public", city: "kl",
    name: { ar: "جامعة ملايا", en: "Universiti Malaya" },
    fields: ["eng", "med", "it", "bus", "law", "sci"], langs: ["en", "ms"], fee: [22000, 40000], english: true,
    about: {
      ar: "أقدم جامعة في ماليزيا وأعلاها تصنيفاً، في قلب كوالالمبور. خيار قوي للهندسة والطب وإدارة الأعمال لمن يريد اسماً معروفاً عالمياً.",
      en: "Malaysia's oldest and highest-ranked university, in the heart of Kuala Lumpur. A strong choice for engineering, medicine and business if you want a name employers recognise worldwide.",
    },
  },
  {
    slug: "universiti-putra-malaysia", short: "UPM", type: "public", city: "sel",
    name: { ar: "جامعة بوترا ماليزيا", en: "Universiti Putra Malaysia" },
    fields: ["eng", "sci", "it", "bus", "med"], langs: ["en", "ms"], fee: [15000, 28000], english: true,
    about: {
      ar: "جامعة حكومية كبيرة في سيردانج قرب كوالالمبور، معروفة بالزراعة والطب البيطري والهندسة، وبرسوم معقولة مقارنة بجودتها.",
      en: "A large public university in Serdang near Kuala Lumpur, known for agriculture, veterinary science and engineering, with fees that are reasonable for its standing.",
    },
  },
  {
    slug: "universiti-kebangsaan-malaysia", short: "UKM", type: "public", city: "sel",
    name: { ar: "الجامعة الوطنية الماليزية", en: "Universiti Kebangsaan Malaysia" },
    fields: ["med", "eng", "isl", "sci", "bus", "law"], langs: ["en", "ms"], fee: [15000, 30000], english: true,
    about: {
      ar: "جامعة بحثية حكومية في بانغي، قوية في الطب والعلوم والدراسات الإسلامية، وحرمها هادئ وأخضر.",
      en: "A public research university in Bangi, strong in medicine, sciences and Islamic studies, on a quiet green campus.",
    },
  },
  {
    slug: "universiti-sains-malaysia", short: "USM", type: "public", city: "pen",
    name: { ar: "جامعة العلوم الماليزية", en: "Universiti Sains Malaysia" },
    fields: ["sci", "med", "eng", "it", "bus"], langs: ["en", "ms"], fee: [14000, 26000], english: true,
    about: {
      ar: "في جزيرة بينانج، حيث المعيشة أرخص من كوالالمبور. ممتازة في الصيدلة والعلوم والهندسة.",
      en: "On Penang island, where living costs are lower than Kuala Lumpur. Excellent for pharmacy, sciences and engineering.",
    },
  },
  {
    slug: "universiti-teknologi-malaysia", short: "UTM", type: "public", city: "jhr",
    name: { ar: "الجامعة التكنولوجية الماليزية", en: "Universiti Teknologi Malaysia" },
    fields: ["eng", "it", "sci", "bus"], langs: ["en", "ms"], fee: [14000, 25000], english: true,
    about: {
      ar: "أكبر جامعة هندسية في ماليزيا، حرمها الرئيسي في جوهور بارو قرب سنغافورة مع فرع في كوالالمبور.",
      en: "Malaysia's largest engineering university, with its main campus in Johor Bahru near Singapore and a branch in Kuala Lumpur.",
    },
  },
  {
    slug: "iium", short: "IIUM", type: "public", city: "kl",
    name: { ar: "الجامعة الإسلامية العالمية بماليزيا", en: "International Islamic University Malaysia" },
    fields: ["isl", "law", "eng", "med", "bus", "it"], langs: ["en", "ar"], fee: [14000, 30000], english: true,
    about: {
      ar: "جامعة دولية تُدرّس بالإنجليزية والعربية، ويدرس فيها آلاف الطلاب العرب. مناسبة جداً لمن يريد بيئة إسلامية وبرامج شرعية بالعربية.",
      en: "An international university teaching in English and Arabic, home to thousands of Arab students. A natural fit for students who want an Islamic environment and Arabic-taught Sharia programmes.",
    },
  },
  {
    slug: "usim", short: "USIM", type: "public", city: "ns",
    name: { ar: "جامعة العلوم الإسلامية الماليزية", en: "Universiti Sains Islam Malaysia" },
    fields: ["isl", "med", "law", "it", "bus"], langs: ["en", "ar", "ms"], fee: [12000, 24000], english: true,
    about: {
      ar: "في مدينة نيلاي الهادئة، تجمع بين العلوم الشرعية والطب والقانون، ولديها برامج باللغة العربية.",
      en: "In the quiet town of Nilai, combining Islamic sciences with medicine and law, with programmes taught in Arabic.",
    },
  },
  {
    slug: "taylors-university", short: "Taylor's", type: "private", city: "sel",
    name: { ar: "جامعة تايلورز", en: "Taylor's University" },
    fields: ["hos", "bus", "it", "des", "med", "law"], langs: ["en"], fee: [35000, 55000], english: true,
    about: {
      ar: "أعلى جامعة خاصة تصنيفاً في ماليزيا، بحرم حديث في سوبانج جايا. الأشهر في الضيافة والأعمال والتصميم.",
      en: "Malaysia's top-ranked private university, on a modern lakeside campus in Subang Jaya. Best known for hospitality, business and design.",
    },
  },
  {
    slug: "sunway-university", short: "Sunway", type: "private", city: "sel",
    name: { ar: "جامعة صنواي", en: "Sunway University" },
    fields: ["bus", "it", "sci", "hos", "des"], langs: ["en"], fee: [32000, 50000], english: true,
    about: {
      ar: "جامعة خاصة داخل مدينة صنواي المتكاملة، مع شهادات مشتركة مع جامعات بريطانية، وسكن ومواصلات في نفس المنطقة.",
      en: "A private university inside the Sunway City township, offering dual degrees with UK universities, with housing and transport on the doorstep.",
    },
  },
  {
    slug: "apu", short: "APU", type: "private", city: "kl",
    name: { ar: "جامعة آسيا باسيفيك", en: "Asia Pacific University" },
    fields: ["it", "eng", "bus", "des"], langs: ["en"], fee: [24000, 34000], english: true,
    about: {
      ar: "من أكثر الجامعات شعبية بين الطلاب العرب لتخصصات الحاسوب والأمن السيبراني والذكاء الاصطناعي، في بوكيت جليل بكوالالمبور.",
      en: "One of the most popular universities with Arab students for computing, cyber security and AI, in Bukit Jalil, Kuala Lumpur.",
    },
  },
  {
    slug: "ucsi-university", short: "UCSI", type: "private", city: "kl",
    name: { ar: "جامعة يو سي إس آي", en: "UCSI University" },
    fields: ["med", "eng", "bus", "it", "sci"], langs: ["en"], fee: [24000, 45000], english: true,
    about: {
      ar: "جامعة خاصة في شيراس بكوالالمبور، قوية في الصيدلة والعلوم الصحية والهندسة.",
      en: "A private university in Cheras, Kuala Lumpur, strong in pharmacy, health sciences and engineering.",
    },
  },
  {
    slug: "multimedia-university", short: "MMU", type: "private", city: "cyb",
    name: { ar: "جامعة الوسائط المتعددة", en: "Multimedia University" },
    fields: ["it", "eng", "des", "bus"], langs: ["en"], fee: [20000, 30000], english: true,
    about: {
      ar: "في سايبرجايا، مدينة التقنية في ماليزيا. مناسبة للحاسوب والهندسة الكهربائية والإعلام الرقمي.",
      en: "In Cyberjaya, Malaysia's tech city. A good match for computing, electrical engineering and digital media.",
    },
  },
  {
    slug: "limkokwing-university", short: "Limkokwing", type: "private", city: "cyb",
    name: { ar: "جامعة ليمكوكوينغ", en: "Limkokwing University" },
    fields: ["des", "bus", "it", "hos"], langs: ["en"], fee: [18000, 28000], english: true,
    about: {
      ar: "جامعة إبداعية في سايبرجايا للتصميم والإعلام والأزياء، وفيها طلاب من أكثر من 150 دولة.",
      en: "A creative university in Cyberjaya for design, media and fashion, with students from more than 150 countries.",
    },
  },
  {
    slug: "inti-international-university", short: "INTI", type: "private", city: "ns",
    name: { ar: "جامعة إنتي الدولية", en: "INTI International University" },
    fields: ["bus", "eng", "it", "hos"], langs: ["en"], fee: [22000, 32000], english: true,
    about: {
      ar: "في نيلاي، برسوم متوسطة وبرامج مشتركة مع جامعات أمريكية وبريطانية، ومعيشة أرخص من العاصمة.",
      en: "In Nilai, with mid-range fees, partner programmes with US and UK universities, and cheaper living than the capital.",
    },
  },
  {
    slug: "segi-university", short: "SEGi", type: "private", city: "sel",
    name: { ar: "جامعة سيجي", en: "SEGi University" },
    fields: ["med", "bus", "eng", "it"], langs: ["en"], fee: [20000, 40000], english: true,
    about: {
      ar: "في كوتا داماسارا، معروفة بالطب وطب الأسنان والصيدلة برسوم أقل من كثير من الجامعات الخاصة.",
      en: "In Kota Damansara, known for medicine, dentistry and pharmacy at lower fees than many private universities.",
    },
  },
  {
    slug: "msu", short: "MSU", type: "private", city: "sel",
    name: { ar: "جامعة الإدارة والعلوم", en: "Management and Science University" },
    fields: ["med", "bus", "it", "hos", "sci"], langs: ["en", "ms"], fee: [18000, 30000], english: true,
    about: {
      ar: "في شاه علم، قوية في العلوم الصحية والإدارة، ولديها عدد كبير من الطلاب العرب.",
      en: "In Shah Alam, strong in health sciences and management, with a large Arab student community.",
    },
  },
  {
    slug: "uniten", short: "UNITEN", type: "private", city: "sel",
    name: { ar: "جامعة تيناغا الوطنية", en: "Universiti Tenaga Nasional" },
    fields: ["eng", "it", "bus"], langs: ["en"], fee: [20000, 30000], english: true,
    about: {
      ar: "جامعة شركة الكهرباء الوطنية، مرجع في هندسة الطاقة والكهرباء وتقنية المعلومات.",
      en: "The national power company's university, a reference for power and electrical engineering and IT.",
    },
  },
  {
    slug: "utp", short: "UTP", type: "private", city: "prk",
    name: { ar: "جامعة بتروناس للتكنولوجيا", en: "Universiti Teknologi PETRONAS" },
    fields: ["eng", "it", "sci"], langs: ["en"], fee: [30000, 42000], english: true,
    about: {
      ar: "جامعة شركة بتروناس في ولاية بيراك، الأقوى في هندسة النفط والكيمياء والميكانيكا.",
      en: "PETRONAS's own university in Perak, the strongest choice for petroleum, chemical and mechanical engineering.",
    },
  },
  {
    slug: "monash-malaysia", short: "Monash", type: "branch", city: "sel",
    name: { ar: "جامعة موناش ماليزيا", en: "Monash University Malaysia" },
    fields: ["med", "eng", "it", "bus", "sci"], langs: ["en"], fee: [42000, 60000], english: true,
    about: {
      ar: "فرع جامعة موناش الأسترالية، تحصل على نفس الشهادة الأسترالية بتكلفة أقل بكثير من الدراسة في أستراليا.",
      en: "The Malaysian campus of Australia's Monash University: the same Australian degree for far less than studying in Australia.",
    },
  },
  {
    slug: "nottingham-malaysia", short: "Nottingham", type: "branch", city: "sel",
    name: { ar: "جامعة نوتنغهام ماليزيا", en: "University of Nottingham Malaysia" },
    fields: ["eng", "bus", "sci", "it", "med"], langs: ["en"], fee: [38000, 55000], english: true,
    about: {
      ar: "فرع الجامعة البريطانية في سيمينيه، بشهادة بريطانية كاملة وحرم واسع.",
      en: "The British university's campus in Semenyih, awarding a full UK degree on a spacious campus.",
    },
  },
];

export const TYPES = {
  public: { ar: "حكومية", en: "Public" },
  private: { ar: "خاصة", en: "Private" },
  branch: { ar: "فرع جامعة أجنبية", en: "Foreign branch campus" },
};

// Nationality landing pages. Requirements change; Touristt checks the
// latest rules for each student, and these pages say so.
export const COUNTRIES = [
  {
    slug: "sudan", flag: "SD",
    name: { ar: "السودان", en: "Sudan" },
    demonym: { ar: "السودانيين", en: "Sudanese" },
    cert: { ar: "الشهادة الثانوية السودانية", en: "Sudan School Certificate" },
    notes: [
      { ar: "نقبل الشهادة السودانية بنسبتها المئوية، ونحدد لك البرامج التي تناسب نسبتك ومسارك (علمي أو أدبي).", en: "We work from your Sudan School Certificate percentage and match you to programmes that fit your score and track (science or arts)." },
      { ar: "إذا كنت تقيم حالياً في مصر أو السعودية أو دولة أخرى، نرشدك إلى أين توثّق شهادتك وكيف تقدّم من مكان إقامتك.", en: "If you are living in Egypt, Saudi Arabia or elsewhere right now, we tell you where to attest your certificate and how to apply from where you are." },
      { ar: "معظم الجامعات تطلب إثبات لغة إنجليزية، ويمكنك البدء بدورة إنجليزي في ماليزيا قبل البرنامج الأكاديمي.", en: "Most universities ask for proof of English; you can start with an English course in Malaysia before your degree." },
    ],
  },
  {
    slug: "yemen", flag: "YE",
    name: { ar: "اليمن", en: "Yemen" },
    demonym: { ar: "اليمنيين", en: "Yemeni" },
    cert: { ar: "شهادة الثانوية العامة اليمنية", en: "Yemeni General Secondary Certificate" },
    notes: [
      { ar: "نساعدك في توثيق شهادة الثانوية العامة وترجمتها المعتمدة إلى الإنجليزية.", en: "We help you attest your General Secondary Certificate and get a certified English translation." },
      { ar: "نتابع معك متطلبات الفيزا الطلابية الخاصة بحاملي الجواز اليمني خطوة بخطوة.", en: "We walk you through the student visa requirements for Yemeni passport holders step by step." },
      { ar: "خيارات بالعربية متاحة في الدراسات الإسلامية لمن يفضّل الدراسة بلغته.", en: "Arabic-taught options exist in Islamic studies for students who prefer to study in Arabic." },
    ],
  },
  {
    slug: "iraq", flag: "IQ",
    name: { ar: "العراق", en: "Iraq" },
    demonym: { ar: "العراقيين", en: "Iraqi" },
    cert: { ar: "شهادة السادس الإعدادي", en: "Iraqi Preparatory (Grade 6) Certificate" },
    notes: [
      { ar: "نختار لك جامعات معترفاً بها لدى وزارة التعليم العالي العراقية، حتى تُعادل شهادتك عند عودتك.", en: "We shortlist universities recognised by Iraq's Ministry of Higher Education, so your degree is accredited when you return." },
      { ar: "الماجستير والدكتوراه في ماليزيا خيار شائع للعراقيين، ونساعدك في اختيار المشرف والتقديم.", en: "Master's and PhD study in Malaysia is common for Iraqi students; we help you choose a supervisor and apply." },
      { ar: "نرتب لك السكن قرب الجامعة قبل وصولك.", en: "We arrange housing near your campus before you land." },
    ],
  },
  {
    slug: "libya", flag: "LY",
    name: { ar: "ليبيا", en: "Libya" },
    demonym: { ar: "الليبيين", en: "Libyan" },
    cert: { ar: "شهادة إتمام الثانوية العامة الليبية", en: "Libyan Secondary Education Certificate" },
    notes: [
      { ar: "نساعد الطلاب الموفدين والدارسين على حسابهم الخاص في تجهيز ملفاتهم.", en: "We prepare files for both government-sponsored and self-funded students." },
      { ar: "نتأكد أن الجامعة والتخصص ضمن قائمة الاعتراف المعتمدة في ليبيا.", en: "We check that the university and programme are on Libya's recognition list." },
      { ar: "برامج تأسيسية (فاونديشن) متاحة لمن يحتاج سنة تمهيدية.", en: "Foundation programmes are available if you need a preparatory year." },
    ],
  },
];

export const SERVICES = [
  { icon: "cap", t: { ar: "القبول الجامعي", en: "University admission" }, d: { ar: "نختار معك الجامعة والتخصص، ونجهّز الملف ونقدّم عنك حتى يصلك خطاب القبول.", en: "We choose the university and programme with you, prepare your file and apply until your offer letter arrives." } },
  { icon: "book", t: { ar: "كورس اللغة الإنجليزية", en: "English course" }, d: { ar: "تسجيل في معاهد إنجليزي معتمدة لتجهيزك للجامعة أو لتحسين مستواك.", en: "Enrolment at accredited English institutes to get you university-ready or simply improve your level." } },
  { icon: "award", t: { ar: "المنح الدراسية", en: "Scholarships" }, d: { ar: "نبحث لك عن المنح والخصومات المتاحة ونساعدك في التقديم عليها.", en: "We find the scholarships and fee discounts open to you and help you apply." } },
  { icon: "chat", t: { ar: "الاستشارات التعليمية", en: "Education consultations" }, d: { ar: "جلسة مجانية تفهم فيها خياراتك وتكاليفك قبل أن تقرر.", en: "A free session to understand your options and costs before you decide." } },
  { icon: "plane", t: { ar: "الاستقبال من المطار", en: "Airport pickup" }, d: { ar: "نستقبلك في مطار كوالالمبور ونوصلك إلى سكنك من أول يوم.", en: "We meet you at Kuala Lumpur airport and take you to your new home on day one." } },
  { icon: "home", t: { ar: "السكن قرب الجامعة", en: "Housing near campus" }, d: { ar: "سكن مناسب لميزانيتك وقريب من جامعتك، جاهز قبل وصولك.", en: "Housing that fits your budget, close to campus and ready before you arrive." } },
];

export const JOURNEY = [
  {
    t: { ar: "التقديم", en: "Apply" },
    d: { ar: "ترسل لنا شهادتك وجوازك، ونختار معك الجامعة والتخصص.", en: "Send us your certificate and passport, and we choose the university and programme together." },
    we: [{ ar: "مراجعة الأوراق وترجمتها", en: "Review and translate documents" }, { ar: "تقديم الطلب للجامعة", en: "Submit your application" }],
  },
  {
    t: { ar: "القبول", en: "Get accepted" },
    d: { ar: "يصلك خطاب القبول الرسمي من الجامعة، عادةً خلال 2 إلى 6 أسابيع.", en: "The university sends your official offer letter, usually within 2 to 6 weeks." },
    we: [{ ar: "متابعة الجامعة حتى صدور القبول", en: "Chase the university until the offer is issued" }, { ar: "شرح الرسوم وشروط القبول", en: "Explain the fees and offer conditions" }],
  },
  {
    t: { ar: "الفيزا الطلابية", en: "Get your visa" },
    d: { ar: "تُقدَّم الفيزا عبر EMGS، وتحصل على خطاب الموافقة eVAL قبل السفر.", en: "Your visa goes through EMGS, and you receive the eVAL approval letter before you travel." },
    we: [{ ar: "تجهيز ملف EMGS والفحص الطبي", en: "Prepare the EMGS file and medical check" }, { ar: "متابعة الطلب حتى صدور eVAL", en: "Track the application until the eVAL is issued" }],
  },
  {
    t: { ar: "حجز السكن", en: "Book housing" },
    d: { ar: "نختار لك سكناً قريباً من الجامعة حسب ميزانيتك قبل أن تسافر.", en: "We pick housing near campus that fits your budget before you fly." },
    we: [{ ar: "عرض خيارات مع صور وأسعار", en: "Show options with photos and prices" }, { ar: "توقيع العقد واستلام المفتاح", en: "Sign the lease and collect the keys" }],
  },
  {
    t: { ar: "الوصول", en: "Arrive" },
    d: { ar: "نستقبلك في المطار ونوصلك لسكنك، ونرافقك في التسجيل بالجامعة.", en: "We meet you at the airport, take you home and go with you to university registration." },
    we: [{ ar: "الاستقبال من مطار KLIA", en: "Pickup at KLIA airport" }, { ar: "شريحة اتصال وجولة في المنطقة", en: "SIM card and a tour of your area" }],
  },
];

// Example cards for the student-life feed. Replace `video` with real TikTok
// video IDs (the number at the end of a TikTok URL) to switch each card to the
// official TikTok embed.
export const VIDEOS = [
  { video: "", views: "29K", t: { ar: "جولة داخل حرم جامعي في كوالالمبور", en: "Campus tour in Kuala Lumpur" }, tag: { ar: "جولات جامعية", en: "Campus tours" } },
  { video: "", views: "21K", t: { ar: "كم يصرف الطالب في ماليزيا شهرياً؟", en: "What a student spends in Malaysia each month" }, tag: { ar: "نصائح", en: "Tips" } },
  { video: "", views: "17K", t: { ar: "عيد الطلاب السودانيين في ماليزيا", en: "Eid with Sudanese students in Malaysia" }, tag: { ar: "مجتمعنا", en: "Community" } },
  { video: "", views: "12K", t: { ar: "أول يوم بعد الوصول: من المطار للسكن", en: "Day one: from the airport to your room" }, tag: { ar: "حياة الطالب", en: "Student life" } },
];

export const TOURS = [
  {
    key: "kl", days: { ar: "يومان", en: "2 days" },
    t: { ar: "كوالالمبور", en: "Kuala Lumpur" },
    d: { ar: "أبراج بتروناس، برج كوالالمبور، كهوف باتو، والمسجد الوطني، مع جولة أكل ماليزي في جالان ألور.", en: "Petronas Towers, KL Tower, Batu Caves and the National Mosque, plus a Malaysian food walk on Jalan Alor." },
  },
  {
    key: "genting", days: { ar: "يوم واحد", en: "Day trip" },
    t: { ar: "مرتفعات جنتنج", en: "Genting Highlands" },
    d: { ar: "تلفريك فوق الغابة، جو بارد على ارتفاع 1800 متر، ومدينة ألعاب ومطاعم.", en: "A cable car over the rainforest, cool air at 1,800 metres, a theme park and restaurants." },
  },
  {
    key: "cameron", days: { ar: "يومان وليلة", en: "2 days, 1 night" },
    t: { ar: "كاميرون هايلاندز", en: "Cameron Highlands" },
    d: { ar: "مزارع الشاي والفراولة والطقس المعتدل، مناسبة للعائلات وكبار السن.", en: "Tea plantations, strawberry farms and mild weather, easy for families and older parents." },
  },
  {
    key: "langkawi", days: { ar: "3 أيام وليلتان", en: "3 days, 2 nights" },
    t: { ar: "لنكاوي", en: "Langkawi" },
    d: { ar: "جزيرة الشواطئ والجسر المعلّق والجزر الصغيرة، رحلة مثالية بعد التخرج.", en: "Beaches, the Sky Bridge and island hopping: the ideal trip after graduation." },
  },
];

// Illustrative stories for layout only. Replace with real students (with
// their permission) before publishing; the page labels them as examples.
export const STORIES = [
  { who: { ar: "أحمد — الخرطوم", en: "Ahmed, Khartoum" }, uni: "APU", q: { ar: "كنت خايف من الإجراءات، لكن الفريق تابع معي من أول ورقة حتى استلمت مفتاح السكن.", en: "I was worried about the paperwork, but the team followed up from the first document until I had the keys to my room." } },
  { who: { ar: "مريم — عدن", en: "Mariam, Aden" }, uni: "IIUM", q: { ar: "ساعدوني أجد برنامجاً بالعربية وخصماً على الرسوم، وكان الاستقبال في المطار مطمئناً لأهلي.", en: "They found me an Arabic-taught programme and a fee discount, and the airport pickup reassured my parents." } },
  { who: { ar: "يوسف — بغداد", en: "Yousif, Baghdad" }, uni: "UTM", q: { ar: "قدّمت على الماجستير وهم رتبوا السكن قرب الحرم في جوهور قبل وصولي بأسبوع.", en: "I applied for a master's, and they had housing near the Johor campus ready a week before I arrived." } },
];

export const FAQ = [
  { q: { ar: "هل الاستشارة مجانية؟", en: "Is the consultation free?" }, a: { ar: "نعم. الاستشارة الأولى مجانية بالكامل عبر واتساب أو مكالمة، وتعرف فيها خياراتك والتكلفة التقريبية.", en: "Yes. The first consultation is completely free, on WhatsApp or a call, and covers your options and rough costs." } },
  { q: { ar: "هل الشهادات الماليزية معترف بها؟", en: "Are Malaysian degrees recognised?" }, a: { ar: "الجامعات الماليزية معتمدة من هيئة MQA، وكثير منها مصنف عالمياً. نتأكد معك من اعتراف بلدك بالجامعة والتخصص قبل التقديم.", en: "Malaysian universities are accredited by the MQA, and many are ranked worldwide. We check that your home country recognises the university and programme before you apply." } },
  { q: { ar: "هل أحتاج IELTS قبل التقديم؟", en: "Do I need IELTS before applying?" }, a: { ar: "ليس دائماً. يمكنك التقديم والحصول على قبول مشروط، ثم دراسة كورس إنجليزي في ماليزيا قبل بدء التخصص.", en: "Not always. You can apply for a conditional offer and take an English course in Malaysia before your programme starts." } },
  { q: { ar: "متى مواعيد الدراسة؟", en: "When do intakes start?" }, a: { ar: "أغلب الجامعات لديها دفعات في فبراير–مارس، ويوليو، وسبتمبر–أكتوبر. ننصح بالتقديم قبل الموعد بثلاثة أشهر على الأقل.", en: "Most universities take students in February–March, July and September–October. Apply at least three months before your intake." } },
  { q: { ar: "كم تكلفة الدراسة والمعيشة؟", en: "How much does study and living cost?" }, a: { ar: "تختلف حسب الجامعة والمدينة. استخدم حاسبة التكاليف في هذه الصفحة لتقدير ميزانيتك، ثم نؤكد لك الأرقام في الاستشارة.", en: "It depends on the university and city. Use the cost calculator on this page for an estimate, and we confirm the figures in your consultation." } },
  { q: { ar: "هل يمكنني العمل أثناء الدراسة؟", en: "Can I work while studying?" }, a: { ar: "يُسمح للطلاب الدوليين بالعمل بدوام جزئي في فترات الإجازة وبشروط محددة. نشرح لك القوانين الحالية في الاستشارة.", en: "International students may work part-time during semester breaks under specific conditions. We explain the current rules in your consultation." } },
];

// Documents checklist (web page + PDF).
export const CHECKLIST = [
  { group: { ar: "للتقديم على الجامعة", en: "For the university application" }, items: [
    { ar: "جواز سفر ساري لمدة 18 شهراً على الأقل", en: "Passport valid for at least 18 months" },
    { ar: "الشهادة الثانوية وكشف الدرجات (أو الشهادة الجامعية للماجستير)", en: "Secondary certificate and transcript (or degree certificate for a master's)" },
    { ar: "ترجمة معتمدة إلى الإنجليزية للشهادات", en: "Certified English translation of certificates" },
    { ar: "صورة شخصية بخلفية بيضاء (3.5 × 5 سم)", en: "Passport photo on a white background (3.5 × 5 cm)" },
    { ar: "نتيجة IELTS أو TOEFL إن وجدت", en: "IELTS or TOEFL result, if you have one" },
    { ar: "السيرة الذاتية وخطاب التوصية (للدراسات العليا)", en: "CV and recommendation letters (postgraduate)" },
  ] },
  { group: { ar: "للفيزا الطلابية (EMGS)", en: "For the student visa (EMGS)" }, items: [
    { ar: "خطاب القبول من الجامعة", en: "Offer letter from the university" },
    { ar: "صورة من كل صفحات الجواز", en: "Copy of every passport page" },
    { ar: "نموذج الفحص الطبي قبل الوصول", en: "Pre-arrival medical examination form" },
    { ar: "إيصال رسوم EMGS والتأمين الصحي", en: "EMGS fee and health insurance receipt" },
  ] },
  { group: { ar: "قبل السفر", en: "Before you fly" }, items: [
    { ar: "خطاب الموافقة eVAL مطبوعاً", en: "Printed eVAL approval letter" },
    { ar: "تذكرة الطيران وموعد الوصول لفريق الاستقبال", en: "Flight ticket and arrival time sent to the pickup team" },
    { ar: "عقد السكن أو تأكيد الحجز", en: "Housing lease or booking confirmation" },
    { ar: "أصول الشهادات للتسجيل في الجامعة", en: "Original certificates for university registration" },
    { ar: "مبلغ نقدي لأول شهر (إيجار، أكل، مواصلات)", en: "Cash for the first month (rent, food, transport)" },
  ] },
];

// Demo records for the application tracker prototype. A live version reads
// these from Touristt's own system instead.
export const DEMO_APPLICATIONS = [
  { code: "TT-26-1042", pin: "4821", name: { ar: "سارة عبدالله", en: "Sara Abdalla" }, uni: "APU", stage: 2, updated: "2026-10-18" },
  { code: "TT-26-0781", pin: "1177", name: { ar: "محمد عثمان", en: "Mohamed Osman" }, uni: "UPM", stage: 4, updated: "2026-10-20" },
];
