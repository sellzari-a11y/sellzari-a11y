// Touristt site behaviour: language toggle, university finder, cost
// calculator, WhatsApp contact form, documents checklist and the demo
// application tracker. No dependencies.
(function () {
  "use strict";
  var TT = window.TT || {};
  var root = document.documentElement;
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } },
  };
  var lang = function () { return root.lang === "en" ? "en" : "ar"; };
  // Both languages in one fragment; CSS shows the active one.
  var bi = function (ar, en) { return '<span class="ar">' + ar + '</span><span class="en" lang="en">' + en + "</span>"; };
  var listeners = [];

  // ---------- language ----------
  function applyLang(l) {
    root.lang = l;
    root.dir = l === "en" ? "ltr" : "rtl";
    $$("[data-ph-ar]").forEach(function (el) { el.placeholder = el.getAttribute("data-ph-" + l); });
    $$("option[data-ar]").forEach(function (o) { o.textContent = o.getAttribute("data-" + l); });
    $$("[data-href-en]").forEach(function (a) {
      if (!a.hasAttribute("data-href-ar")) a.setAttribute("data-href-ar", a.getAttribute("href"));
      a.setAttribute("href", a.getAttribute("data-href-" + l));
    });
    listeners.forEach(function (fn) { fn(l); });
  }
  $$("[data-lang-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      var l = lang() === "ar" ? "en" : "ar";
      store.set("tt-lang", l);
      applyLang(l);
    });
  });

  // ---------- mobile menu ----------
  var menuBtn = $("[data-menu]");
  var nav = $(".nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }); });
  }

  var fmt = function (n) { return Math.round(n).toLocaleString("en-US"); };

  // ---------- university finder ----------
  $$("[data-finder]").forEach(function (box) {
    var data = JSON.parse($("[data-unis]", box).textContent);
    var form = $("[data-filters]", box);
    var out = $("[data-results]", box);
    var count = $("[data-count]", box);
    var empty = $("[data-empty]", box);
    var budgetOut = $("[data-budget-out]", box);
    var limit = +box.getAttribute("data-limit") || 0;
    var r = box.getAttribute("data-root") || "";

    function card(u) {
      var t = function (o) { return bi(o.ar, o.en); };
      return '<article class="uni"><div class="uni-top"><span class="pill pill-' + u.type + '">' + t(data.types[u.type]) + '</span><span class="uni-short">' + u.short + "</span></div>" +
        '<h3><a href="' + r + "universities/" + u.slug + '.html">' + t(u.name) + "</a></h3>" +
        '<p class="uni-meta">' + t(data.cities[u.city]) + "</p>" +
        '<p class="uni-fee num">RM ' + fmt(u.fee[0]) + "–" + fmt(u.fee[1]) + " <small>" + bi("/ سنة", "/ year") + "</small></p>" +
        '<ul class="chips">' + u.fields.slice(0, 3).map(function (f) { return "<li>" + t(data.fields[f]) + "</li>"; }).join("") + "</ul></article>";
    }

    function run() {
      var f = new FormData(form);
      var field = f.get("field"), city = f.get("city"), type = f.get("type"), lng = f.get("lang"), budget = +f.get("budget");
      budgetOut.textContent = "RM " + fmt(budget);
      var hits = data.unis.filter(function (u) {
        if (field && u.fields.indexOf(field) < 0) return false;
        if (city && u.city !== city) return false;
        if (type && u.type !== type) return false;
        if (lng === "en-only" && !(u.langs.length === 1 && u.langs[0] === "en")) return false;
        if (lng === "other" && !u.langs.some(function (l) { return l !== "en"; })) return false;
        return u.fee[0] <= budget;
      }).sort(function (a, b) { return a.fee[0] - b.fee[0]; });
      var shown = limit ? hits.slice(0, limit) : hits;
      out.innerHTML = shown.map(card).join("");
      empty.hidden = hits.length > 0;
      count.innerHTML = hits.length
        ? bi("<b>" + hits.length + "</b> جامعة تطابق اختيارك" + (shown.length < hits.length ? "، نعرض " + shown.length + " منها" : ""),
             "<b>" + hits.length + "</b> universit" + (hits.length === 1 ? "y matches" : "ies match") + " your filters" + (shown.length < hits.length ? ", showing " + shown.length : ""))
        : "";
    }
    form.addEventListener("input", run);
    form.addEventListener("change", run);
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    run();
  });

  // ---------- cost calculator ----------
  // Indicative monthly rents (RM) by city and room type.
  var RENT = {
    kl: { shared: 550, single: 950, studio: 1700 },
    sel: { shared: 450, single: 800, studio: 1400 },
    cyb: { shared: 450, single: 800, studio: 1350 },
    pen: { shared: 400, single: 700, studio: 1200 },
    jhr: { shared: 350, single: 650, studio: 1100 },
    ns: { shared: 350, single: 600, studio: 1000 },
    prk: { shared: 300, single: 550, studio: 900 },
  };
  var LIVING = { low: 700, mid: 1100, high: 1600 }; // food, transport, phone per month
  var CITY_LIVING = { kl: 1.1, sel: 1, cyb: 1, pen: 0.92, jhr: 0.9, ns: 0.88, prk: 0.85 };
  var LEVEL = { foundation: 0.65, bachelor: 1, master: 0.85, phd: 0.75 };
  var ENGLISH_YEAR = 13000; // intensive English, about RM 1,100 a month
  var VISA_FIRST = 2500, VISA_RENEW = 1700; // EMGS processing, medical, insurance
  var SETTLE = 500; // pickup, SIM card, bedding and basics on arrival

  $$("[data-calc]").forEach(function (box) {
    var form = $("[data-calc-form]", box);
    var uni = $("#c-uni", box), level = $("#c-level", box), tuition = $("#c-tuition", box), years = $("#c-years", box), city = $("#c-city", box);
    var rate = $("#c-rate", box);
    var bar = $("[data-bar]", box), table = $("[data-table]", box);
    var waBtn = $("[data-calc-wa]", box);
    var outFirst = $('[data-out="first"]', box), outMonth = $('[data-out="month"]', box), outAll = $('[data-out="all"]', box);

    var params = new URLSearchParams(location.search);
    var pre = params.get("uni");
    if (pre) {
      var opt = $('option[data-slug="' + pre + '"]', uni);
      if (opt) { uni.value = opt.value; opt.selected = true; city.value = opt.getAttribute("data-city"); }
    }

    function suggestTuition() {
      var lv = level.value;
      if (lv === "english") { tuition.value = ENGLISH_YEAR; return; }
      if (uni.value === "custom") return;
      tuition.value = Math.round((+uni.value * (LEVEL[lv] || 1)) / 500) * 500;
    }
    function selectedUniOption() { return uni.options[uni.selectedIndex]; }
    uni.addEventListener("change", function () {
      var o = selectedUniOption();
      if (o.getAttribute("data-city")) city.value = o.getAttribute("data-city");
      suggestTuition(); run();
    });
    level.addEventListener("change", function () {
      if (level.value === "english" && +years.value > 1) years.value = "1";
      suggestTuition(); run();
    });

    function money(n) {
      var cur = ($('input[name="cur"]:checked', box) || {}).value;
      var r = Math.max(+rate.value || TT.usdRate || 4.2, 0.01);
      return cur === "usd" ? "USD " + fmt(n / r) : "RM " + fmt(n);
    }

    function run() {
      var f = new FormData(form);
      var yrs = +f.get("years") || 1;
      var tu = Math.max(+tuition.value || 0, 0);
      var rent = RENT[f.get("city")][f.get("housing")];
      var living = LIVING[f.get("life")] * CITY_LIVING[f.get("city")];
      var deposit = rent * 2.5;
      var rows = [
        { k: "c1", v: tu, l: bi("الرسوم الدراسية", "Tuition"), s: bi("للسنة الأولى", "first year") },
        { k: "c2", v: rent * 12 + deposit, l: bi("السكن", "Housing"), s: bi(money(rent) + " شهرياً + تأمين شهرين ونصف", money(rent) + " a month + 2.5-month deposit") },
        { k: "c3", v: living * 12 + SETTLE, l: bi("المعيشة", "Living"), s: bi("أكل ومواصلات واتصالات، + " + money(SETTLE) + " عند الوصول", "food, transport, phone, + " + money(SETTLE) + " on arrival") },
        { k: "c4", v: VISA_FIRST, l: bi("الفيزا والتأمين", "Visa & insurance"), s: bi("EMGS والفحص الطبي والتأمين", "EMGS, medical check, insurance") },
      ];
      var first = rows.reduce(function (n, x) { return n + x.v; }, 0);
      var all = tu * yrs + rent * 12 * yrs + deposit + living * 12 * yrs + SETTLE + VISA_FIRST + VISA_RENEW * (yrs - 1);
      outFirst.textContent = money(first);
      outMonth.textContent = money(first / 12);
      outAll.textContent = money(all);
      bar.innerHTML = rows.map(function (x) {
        return '<span style="flex:' + x.v + ";background:var(--" + x.k + ')" title="' + money(x.v) + '"></span>';
      }).join("");
      table.innerHTML = rows.map(function (x) {
        var pct = first ? Math.round((x.v / first) * 100) : 0;
        return '<tr><td><span class="sw" style="background:var(--' + x.k + ')"></span>' + x.l + "<small>" + x.s + "</small></td><td>" + money(x.v) + " <small>" + pct + "%</small></td></tr>";
      }).join("");
      bar.setAttribute("aria-label", rows.map(function (x) { return money(x.v); }).join(", "));

      if (waBtn) {
        var o = selectedUniOption();
        var uniName = o.getAttribute("data-" + lang()) || "";
        var msg = lang() === "en"
          ? "Hello Touristt, I estimated my budget on your site.\nUniversity: " + uniName + "\nLevel: " + level.options[level.selectedIndex].textContent + "\nFirst year: " + money(first) + "\nWhole programme (" + yrs + " yr): " + money(all) + "\nCan you confirm and suggest scholarships?"
          : "السلام عليكم توريست، حسبت ميزانيتي على الموقع.\nالجامعة: " + uniName + "\nالمرحلة: " + level.options[level.selectedIndex].textContent + "\nالسنة الأولى: " + money(first) + "\nكامل البرنامج (" + yrs + " سنوات): " + money(all) + "\nهل يمكنكم تأكيدها واقتراح منح؟";
        waBtn.href = "https://wa.me/" + TT.whatsapp + "?text=" + encodeURIComponent(msg);
        waBtn.removeAttribute("data-href-en");
      }
    }
    form.addEventListener("input", run);
    form.addEventListener("change", run);
    $$('input[name="cur"]', box).forEach(function (i) { i.addEventListener("change", run); });
    rate.addEventListener("input", run);
    listeners.push(run);
    suggestTuition();
    run();
  });

  // ---------- contact form → WhatsApp ----------
  $$("[data-contact]").forEach(function (form) {
    var err = $("[data-err]", form), sent = $("[data-sent]", form), sentLink = $("[data-sent-link]", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var name = String(f.get("name") || "").trim(), phone = String(f.get("phone") || "").trim();
      if (!name || phone.replace(/\D/g, "").length < 6) { err.hidden = false; (name ? $("#k-phone") : $("#k-name")).focus(); return; }
      err.hidden = true;
      var sel = function (id) { var s = $(id, form); return s.options[s.selectedIndex].textContent; };
      var msg = lang() === "en"
        ? "Hello Touristt, I'd like a free consultation.\nName: " + name + "\nWhatsApp: " + phone + "\nCountry: " + sel("#k-country") + "\nI need help with: " + sel("#k-service") + (f.get("msg") ? "\n" + f.get("msg") : "")
        : "السلام عليكم توريست، أريد استشارة مجانية.\nالاسم: " + name + "\nواتساب: " + phone + "\nالبلد: " + sel("#k-country") + "\nأحتاج مساعدة في: " + sel("#k-service") + (f.get("msg") ? "\n" + f.get("msg") : "");
      var url = "https://wa.me/" + TT.whatsapp + "?text=" + encodeURIComponent(msg);
      sentLink.href = url;
      sent.hidden = false;
      window.open(url, "_blank", "noopener");
    });
  });

  // ---------- documents checklist ----------
  $$("[data-checklist]").forEach(function (box) {
    var boxes = $$('input[type="checkbox"]', box), done = $("[data-done]", box);
    var saved = {};
    try { saved = JSON.parse(store.get("tt-checklist") || "{}"); } catch (e) { saved = {}; }
    function update() {
      var n = 0, state = {};
      boxes.forEach(function (b) { if (b.checked) { n++; state[b.id] = 1; } });
      done.textContent = n;
      store.set("tt-checklist", JSON.stringify(state));
    }
    boxes.forEach(function (b) { b.checked = !!saved[b.id]; b.addEventListener("change", update); });
    update();
  });

  // ---------- application tracker (demo data) ----------
  $$("[data-tracker]").forEach(function (box) {
    var apps = JSON.parse($("[data-apps]", box).textContent);
    var form = $("[data-track-form]", box), out = $("[data-track-out]", box), err = $("[data-track-err]", box);
    var current = null;
    function render() {
      if (!current) return;
      var a = current, l = lang();
      $("[data-t-code]", box).textContent = a.code;
      $("[data-t-name]", box).textContent = a.name[l];
      $("[data-t-meta]", box).innerHTML = bi("الجامعة: " + a.uni + " · آخر تحديث " + a.updated, "University: " + a.uni + " · last updated " + a.updated);
      $$("[data-step]", box).forEach(function (li) {
        var i = +li.getAttribute("data-step");
        li.className = i < a.stage ? "done" : i === a.stage ? "now" : "";
        var pill = $(".now-pill", li);
        if (pill) pill.remove();
        if (i === a.stage) $("b", li).insertAdjacentHTML("beforeend", '<span class="now-pill">' + bi("المرحلة الحالية", "Current stage") + "</span>");
      });
      out.hidden = false;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var code = $("#t-code").value.trim().toUpperCase(), pin = $("#t-pin").value.trim();
      current = apps.filter(function (a) { return a.code === code && a.pin === pin; })[0] || null;
      err.hidden = !!current;
      if (!current) { out.hidden = true; return; }
      render();
    });
    listeners.push(render);
  });

  // ---------- TikTok embeds (only when real video IDs are configured) ----------
  if ($(".tiktok-embed")) {
    var s = document.createElement("script");
    s.src = "https://www.tiktok.com/embed.js";
    s.async = true;
    document.body.appendChild(s);
  }

  applyLang(lang());
})();
