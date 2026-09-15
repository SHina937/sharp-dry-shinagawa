/* ==========================================================================
   シャープドライしながわ 共通スクリプト
   1. ヘッダー: スクロール時に縮小
   2. グローバルナビ: SPドロワー開閉
   3. 追従CTA: スクロール200px以降で表示
   4. Google Maps: iframe 遅延読み込み
   5. 計測: 電話タップ tel_click / LINEタップ line_click
   ========================================================================== */
(function () {
  "use strict";

  var header = document.querySelector(".js-header");
  var floatCta = document.querySelector(".js-float-cta");

  /* 1 + 3. スクロール連動 ------------------------------------------------ */
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) {
      header.classList.toggle("is-shrink", y > 40);
    }
    if (floatCta) {
      floatCta.classList.toggle("is-visible", y > 200);
    }
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();

  /* 2. SPドロワー --------------------------------------------------------- */
  var toggle = document.querySelector(".js-menu-toggle");
  var gnav = document.getElementById("global-nav");

  function setMenu(open) {
    if (!toggle || !gnav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    gnav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggle && gnav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    // メニュー内リンクを押したら閉じる
    gnav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    // Escで閉じる
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* 4. Google Maps 遅延読み込み ------------------------------------------- */
  var lazyMaps = document.querySelectorAll("iframe[data-src]");

  function loadMap(iframe) {
    if (!iframe.src) iframe.src = iframe.getAttribute("data-src");
  }

  if (lazyMaps.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            loadMap(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: "200px 0px" });

      lazyMaps.forEach(function (iframe) { io.observe(iframe); });
    } else {
      lazyMaps.forEach(loadMap);
    }
  }

  /* 5. 電話・LINEタップ計測 ------------------------------------------------ */
  function track(eventName) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName);
    }
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest("a");
    if (!link) return;
    var href = link.getAttribute("href") || "";
    if (href.indexOf("tel:") === 0) {
      track("tel_click");
    } else if (href.indexOf("lin.ee") !== -1 || href.indexOf("line.me") !== -1) {
      track("line_click");
    }
  });
})();
