/* =========================================================
   QUAD GYM TRAINING HOUSE — 공통 스크립트
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 헤더 스크롤 상태 ---------- */
  var header = document.getElementById('siteHeader');
  var fab = document.getElementById('fab');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-stuck', y > 20);
    if (fab) fab.classList.toggle('is-shown', y > 520);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 모바일 내비게이션 ---------- */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ---------- 현재 페이지 내비 활성화 ---------- */
  var page = document.body.getAttribute('data-page');
  if (page) {
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === page) a.classList.add('is-active');
    });
  }

  /* ---------- 스크롤 리빌 ---------- */
  var revealables = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealables.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 숫자 카운트업 ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dur = 1400;
    var start = null;
    var isFloat = String(target).indexOf('.') > -1;

    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = isFloat ? val.toFixed(1) : Math.floor(val).toLocaleString('ko-KR');
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString('ko-KR');
    }
    requestAnimationFrame(frame);
  }
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCount(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- FAQ 아코디언 ---------- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var panel = item.querySelector('.faq-a');
      var open = item.classList.contains('is-open');

      // 같은 그룹 내 다른 항목 닫기
      item.closest('.faq').querySelectorAll('.faq-item.is-open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.faq-a').style.maxHeight = null;
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('is-open', !open);
      btn.setAttribute('aria-expanded', !open ? 'true' : 'false');
      panel.style.maxHeight = !open ? panel.scrollHeight + 'px' : null;
    });
  });
  // 창 크기 변경 시 열린 패널 높이 재계산
  window.addEventListener('resize', function () {
    document.querySelectorAll('.faq-item.is-open .faq-a').forEach(function (p) {
      p.style.maxHeight = p.scrollHeight + 'px';
    });
  });

  /* ---------- 오늘 영업시간 강조 ---------- */
  var todayIdx = new Date().getDay(); // 0=일 … 6=토
  document.querySelectorAll('[data-day]').forEach(function (row) {
    var days = row.getAttribute('data-day').split(',').map(Number);
    if (days.indexOf(todayIdx) > -1) row.classList.add('is-today');
  });

  /* ---------- 상담 신청 폼 ---------- */
  var form = document.getElementById('consultForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('formMsg');
      var name = (form.querySelector('[name="name"]').value || '').trim();
      if (msg) {
        msg.textContent = '✓ ' + name + '님, 상담 신청이 접수되었습니다. 영업일 기준 24시간 이내에 연락드리겠습니다.';
        msg.classList.add('is-shown');
      }
      form.reset();
      if (msg) msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- 이미지 로드 실패 시 정리 ---------- */
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.visibility = 'hidden';
    });
  });

  /* ---------- 푸터 연도 ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
