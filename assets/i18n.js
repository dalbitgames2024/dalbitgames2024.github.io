// 한국어·영어·일본어 전환. 각 페이지는 window.I18N = { ko: {...}, en: {...}, ja: {...} }만 정의한다.
// data-i18n="키" → 글자, data-i18n-src="경로/{lang}.jpg" → 언어별 이미지(lang은 ko/en/ja), data-i18n-alt="키" → 대체 글자.
(function () {
  var LANGS = ["ko", "en", "ja"];
  var KEY = "dalbit.lang";

  function pick() {
    try {
      var saved = localStorage.getItem(KEY);
      if (LANGS.indexOf(saved) >= 0) return saved;
    } catch (e) {}
    var list = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < list.length; i++) {
      var code = String(list[i]).slice(0, 2).toLowerCase();
      if (LANGS.indexOf(code) >= 0) return code;
    }
    return "en";
  }

  function apply(lang) {
    var dict = (window.I18N && window.I18N[lang]) || {};
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n")];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n-alt")];
      if (v != null) el.setAttribute("alt", v);
    });
    document.querySelectorAll("[data-i18n-src]").forEach(function (el) {
      // 운빨망겜 배너처럼 ko/en 두 벌만 있는 이미지는 data-i18n-langs로 쓸 수 있는 언어를 적고, 없으면 en을 쓴다.
      var allowed = (el.getAttribute("data-i18n-langs") || "ko,en,ja").split(",");
      var use = allowed.indexOf(lang) >= 0 ? lang : "en";
      el.setAttribute("src", el.getAttribute("data-i18n-src").replace("{lang}", use));
    });
    if (dict["page.title"]) document.title = dict["page.title"];
    document.querySelectorAll(".langs button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".langs button").forEach(function (b) {
      b.addEventListener("click", function () {
        var lang = b.getAttribute("data-lang");
        try { localStorage.setItem(KEY, lang); } catch (e) {}
        apply(lang);
      });
    });
    apply(pick());
  });
})();
