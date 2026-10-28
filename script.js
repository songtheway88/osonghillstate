/* =========================================================
   힐스테이트 오송레이크센트럴 — script.js
   ========================================================= */

/* ---------- 운영 설정: 확정되면 여기만 수정 ---------- */
const CONFIG = {
  // 분양 대표번호 (예: "1600-0000"). 비워두면 전화 버튼이 상담신청 폼으로 연결됩니다.
  phone: "1644-1639",
  // 상담신청 접수 (api/submit.js → 분양천국 대시보드 접수 + 텔레그램/문자 알림)
  leadEndpoint: "/api/submit",
};

/* ---------- 평면 데이터 (교육자료 평면 분석 장표 기준) ---------- */
const PLANS = [
  {
    id: "49A", group: "49", units: 156, kind: "기본형", shape: "판상형", aspect: "남서향 156실",
    img: "img/plan-49A.jpg",
    summary: "1~2인 구성 실거주 및 기업 임직원 숙소에 적합한 실용적 평면",
    area: { 전용: "49.3741㎡", 공용: "22.4215㎡", 기타공용: "38.1352㎡", 계약: "109.9308㎡", 발코니: "19.3975㎡" },
    points: [
      ["독립적인 침실 2개소", "1~2인 실거주부터 업무·게스트룸까지 유연하게 활용"],
      ["LDK 맞통풍 구조", "거실·주방 양면 개방으로 쾌적한 자연환기 가능"],
      ["발코니 설계", "서비스면적을 활용해 체감 주거공간과 공간 활용성 확대"],
    ],
    kitchen: ["B/I 콤비냉장고 + 홈바", "냉장·냉동 1도어 + T/L장"],
    finish: "고급형 1번",
  },
  {
    id: "49A-1", group: "49", units: 78, kind: "옵션형", shape: "판상형", aspect: "남서향 78실",
    img: "img/plan-49A-1.jpg",
    summary: "1~2인 구성 실거주 및 기업 임직원 숙소에 적합한 실용적 평면",
    area: { 전용: "49.3861㎡", 공용: "22.7506㎡", 기타공용: "38.1446㎡", 계약: "110.2813㎡", 발코니: "19.6225㎡" },
    points: [
      ["독립적인 침실 2개소", "1~2인 실거주부터 업무·게스트룸까지 유연하게 활용"],
      ["LDK 맞통풍 구조", "거실·주방 양면 개방으로 쾌적한 자연환기 가능"],
      ["발코니 설계", "서비스면적을 활용해 체감 주거공간과 공간 활용성 확대"],
    ],
    kitchen: ["B/I 콤비냉장고 + 홈바", "냉장·냉동 1도어 + T/L장"],
    finish: "고급형 1번 · 2번",
  },
  {
    id: "49A-2", group: "49", units: 26, kind: "옵션형", shape: "판상형", aspect: "남동향 26실",
    img: "img/plan-49A-2.jpg",
    summary: "1~2인 구성 실거주 및 기업 임직원 숙소에 적합한 실용적 평면",
    area: { 전용: "49.3861㎡", 공용: "23.5355㎡", 기타공용: "38.1446㎡", 계약: "110.0662㎡", 발코니: "19.8850㎡" },
    points: [
      ["독립적인 침실 2개소", "1~2인 실거주부터 업무·게스트룸까지 유연하게 활용"],
      ["LDK 맞통풍 구조", "거실·주방 양면 개방으로 쾌적한 자연환기 가능"],
      ["발코니 설계", "서비스면적을 활용해 체감 주거공간과 공간 활용성 확대"],
    ],
    kitchen: ["B/I 콤비냉장고 + 홈바", "냉장·냉동 1도어 + T/L장"],
    finish: "고급형 1번 · 2번",
  },
  {
    id: "49B", group: "49", units: 26, kind: "기본형 · Share House", shape: "타워형", aspect: "남동·남서향 26실",
    img: "img/plan-49B.jpg",
    summary: "공용거실 및 욕실을 공유하며 공동생활이 가능한 Share House 구조",
    area: { 전용: "49.4110㎡", 공용: "22.1940㎡", 기타공용: "38.1637㎡", 계약: "109.7687㎡", 발코니: "20.4925㎡" },
    points: [
      ["거실·주방 중심 개방형 구성", "넓은 공용공간으로 체감 개방감 확보"],
      ["드레스룸 및 수납공간 확보", "소형 평면의 수납 한계를 보완한 실용적 공간 구성"],
      ["발코니 설계", "서비스면적을 활용해 체감 주거공간과 공간 활용성 확대"],
    ],
    kitchen: ["B/I 콤비냉장고 + 홈바", "냉장·냉동 1도어 + T/L장"],
    finish: "고급형 1번 · 2번",
  },
  {
    id: "59A", group: "59", units: 180, kind: "기본형", shape: "판상형", aspect: "남동향 76실 · 남서향 104실",
    img: "img/plan-59A.jpg",
    summary: "2~3인 가구의 실거주에 적합한 주거형 평면",
    area: { 전용: "59.3832㎡", 공용: "25.7179㎡", 기타공용: "45.8662㎡", 계약: "130.9673㎡", 발코니: "22.2625㎡" },
    points: [
      ["침실 2개소 · 욕실 2개소", "2~3인 가구의 실거주가 가능한 주거형 평면 구성"],
      ["LDK 맞통풍 구조", "거실·주방 양면 개방으로 쾌적한 자연환기 가능"],
      ["발코니 설계", "서비스면적을 활용해 체감 주거공간과 공간 활용성 확대"],
    ],
    kitchen: ["B/I 콤비냉장고 + T/L장 + 히든홈바", "냉장·냉동 1도어 + T/L장"],
    finish: "고급형 2번",
    extra: "침실 특화3 : 쉐어형 침실 + 현관위치 변경",
  },
  {
    id: "59A-1", group: "59", units: 132, kind: "옵션형", shape: "판상형", aspect: "남동향 79실 · 남서향 53실",
    img: "img/plan-59A-1.jpg",
    summary: "2~3인 가구의 실거주에 적합한 주거형 평면",
    area: { 전용: "59.3908㎡", 공용: "26.2235㎡", 기타공용: "45.8719㎡", 계약: "131.4862㎡", 발코니: "22.5700㎡" },
    points: [
      ["침실 2개소 · 욕실 2개소", "2~3인 가구의 실거주가 가능한 주거형 평면 구성"],
      ["LDK 맞통풍 구조", "거실·주방 양면 개방으로 쾌적한 자연환기 가능"],
      ["발코니 설계", "서비스면적을 활용해 체감 주거공간과 공간 활용성 확대"],
    ],
    kitchen: ["B/I 콤비냉장고 + T/L장 + 히든홈바", "냉장·냉동 1도어 + T/L장"],
    finish: "고급형 1번 · 2번",
  },
  {
    id: "59A-2", group: "59", units: 27, kind: "옵션형", shape: "판상형", aspect: "남동향 27실",
    img: "img/plan-59A-2.jpg",
    summary: "2~3인 가구의 실거주에 적합한 주거형 평면",
    area: { 전용: "59.3832㎡", 공용: "26.5203㎡", 기타공용: "45.8662㎡", 계약: "131.7697㎡", 발코니: "22.5250㎡" },
    points: [
      ["침실 2개소 · 욕실 2개소", "2~3인 가구의 실거주가 가능한 주거형 평면 구성"],
      ["LDK 맞통풍 구조", "거실·주방 양면 개방으로 쾌적한 자연환기 가능"],
      ["발코니 설계", "서비스면적을 활용해 체감 주거공간과 공간 활용성 확대"],
    ],
    kitchen: ["B/I 콤비냉장고 + T/L장 + 히든홈바", "냉장·냉동 1도어 + T/L장"],
    finish: "고급형 1번 · 2번",
  },
  {
    id: "59A-3", group: "59", units: 25, kind: "2단지 단독 타입", shape: "판상형", aspect: "남동향 25실",
    img: "",
    summary: "2단지에만 공급되는 59㎡ 판상형 타입. 상세 평면은 상담 시 안내해 드립니다.",
    area: { 전용: "59.39㎡", 계약: "132.29㎡", 전용률: "44.9%" },
    points: [
      ["판상형 · 남동향", "선호도 높은 판상형 구조"],
      ["발코니 설계", "서비스면적을 활용해 체감 주거공간과 공간 활용성 확대"],
    ],
  },
  {
    id: "59B", group: "59", units: 53, kind: "기본형 · Co-Living", shape: "타워형", aspect: "남동·남서향 53실",
    img: "img/plan-59B.jpg",
    summary: "공용 거실을 공유하며 각 침실별 프라이버시 확보가 가능한 Co-Living 구조",
    area: { 전용: "59.7250㎡", 공용: "27.1320㎡", 기타공용: "46.3962㎡", 계약: "133.2532㎡", 발코니: "21.9775㎡" },
    points: [
      ["거실·주방 중심 개방형 구성", "넓은 공용공간으로 체감 개방감 확보"],
      ["드레스룸 및 수납공간 확보", "소형 평면의 수납 한계를 보완한 실용적 공간 구성"],
      ["발코니 설계", "서비스면적을 활용해 체감 주거공간과 공간 활용성 확대"],
    ],
    kitchen: ["B/I 콤비냉장고 + 홈바", "냉장·냉동 1도어 + T/L장"],
    finish: "고급형 2번",
  },
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/* ---------- 대표번호 반영 ---------- */
function applyPhone() {
  if (!CONFIG.phone) {
    // 번호 확정 전: 번호 자리만 숨기고, 나머지 전화 버튼은 상담신청 폼으로 연결
    $$(".header-phone, .lead-tel, .footer-phone").forEach((el) => (el.hidden = true));
    return;
  }
  const tel = "tel:" + CONFIG.phone.replace(/[^0-9]/g, "");
  $$("[data-tel]").forEach((a) => {
    a.href = tel;
    a.textContent = a.textContent.includes("☎") ? "☎ " + CONFIG.phone : CONFIG.phone;
  });
}

/* ---------- 헤더 / 모바일 메뉴 ---------- */
function initHeader() {
  const header = $("[data-header]");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = $("[data-menu-toggle]");
  const nav = $("[data-nav]");
  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    if (open) header.classList.add("is-scrolled");
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setOpen(false)));
}

/* ---------- 스크롤 등장 효과 ---------- */
function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    }),
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  items.forEach((el) => io.observe(el));
}

/* ---------- 평면 탭 ---------- */
function renderPlan(plan) {
  const areaRows = Object.entries(plan.area).map(([k, v]) => `<tr><th>${esc(k === "계약" ? "계약면적" : k === "전용" ? "전용면적" : k === "공용" ? "공용면적" : k === "발코니" ? "발코니면적" : k)}</th><td>${esc(v)}</td></tr>`).join("");
  const points = plan.points.map(([t, d], i) => `<li><b>0${i + 1}</b><div><strong>${esc(t)}</strong><p>${esc(d)}</p></div></li>`).join("");
  const opt = [
    plan.kitchen ? `<b>주방 선택</b> ① ${esc(plan.kitchen[0])} / ② ${esc(plan.kitchen[1])}` : "",
    plan.finish ? `<b>전실/발코니 마감 특화</b> ${esc(plan.finish)}` : "",
    plan.extra ? `<b>침실 특화</b> ${esc(plan.extra.replace(/^침실 특화3 : /, "특화3 – "))}` : "",
  ].filter(Boolean).join("<br />");
  const img = plan.img
    ? `<img src="${plan.img}" width="1340" height="1032" alt="${esc(plan.id)} 평면도와 주방·마감 옵션" loading="lazy" data-zoom />`
    : `<div class="no-plan"><strong>${esc(plan.id)}</strong><p>상세 평면은 상담 시 안내해 드립니다.</p></div>`;
  const bathroom = !plan.img ? "" : plan.group === "49" ? "침실 2 · 욕실 1 · 드레스룸" : "침실 2 · 욕실 2 · 드레스룸";

  return `
    <div class="plan-img">${img}</div>
    <div class="plan-info">
      <div class="pi-head"><h3>${esc(plan.id)}</h3><span class="pi-count">총 703실 중 ${plan.units}실</span></div>
      <div class="pi-tags"><span>${esc(plan.kind)}</span><span>${esc(plan.shape)}</span><span>${esc(plan.aspect)}</span>${bathroom ? `<span>${bathroom}</span>` : ""}</div>
      <p class="pi-sum">${esc(plan.summary)}</p>
      <table><tbody>${areaRows}</tbody></table>
      <ol>${points}</ol>
      ${opt ? `<p class="pi-opt">${opt}</p>` : ""}
    </div>`;
}

function initPlans() {
  const tabs = $("[data-plan-tabs]");
  const panel = $("[data-plan-panel]");
  if (!tabs || !panel) return;

  let html = "";
  ["49", "59"].forEach((g) => {
    html += `<span class="grp">${g}㎡</span>`;
    PLANS.filter((p) => p.group === g).forEach((p) => {
      html += `<button type="button" role="tab" id="tab-${p.id}" aria-controls="plan-panel" aria-selected="false" data-plan="${p.id}">${p.id}</button>`;
    });
  });
  tabs.innerHTML = html;
  panel.id = "plan-panel";

  const buttons = $$("button", tabs);
  const select = (id) => {
    const plan = PLANS.find((p) => p.id === id) || PLANS[0];
    buttons.forEach((b) => {
      const on = b.dataset.plan === plan.id;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", "tab-" + plan.id);
    panel.innerHTML = renderPlan(plan);
  };

  tabs.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-plan]");
    if (b) select(b.dataset.plan);
  });
  tabs.addEventListener("keydown", (e) => {
    if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
    const i = buttons.indexOf(document.activeElement);
    if (i < 0) return;
    const next = buttons[(i + (e.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length];
    next.focus();
    select(next.dataset.plan);
  });

  // "나에게 맞는 타입" 카드 → 해당 평면으로 이동
  $$("[data-goto-type]").forEach((card) =>
    card.addEventListener("click", () => {
      select(card.dataset.gotoType);
      $("#plans").scrollIntoView({ behavior: "smooth", block: "start" });
    })
  );

  select("49A");
}

/* ---------- 평면 확대 보기 ---------- */
function initLightbox() {
  const dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.innerHTML = `<img alt="" /><button type="button" aria-label="닫기">&times;</button>`;
  document.body.appendChild(dlg);
  const img = $("img", dlg);
  $("button", dlg).addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-zoom]");
    if (!t || typeof dlg.showModal !== "function") return;
    img.src = t.currentSrc || t.src;
    img.alt = t.alt;
    dlg.showModal();
  });
}

/* ---------- 상담신청 폼 ---------- */
function initLeadForm() {
  const form = $("[data-lead-form]");
  if (!form) return;
  const note = $("[data-form-note]", form);
  const btn = $("button[type=submit]", form);
  const say = (msg, ok) => {
    note.textContent = msg;
    note.className = "form-note " + (ok ? "is-ok" : "is-error");
  };

  form.phone.addEventListener("input", () => {
    const d = form.phone.value.replace(/[^0-9]/g, "").slice(0, 11);
    form.phone.value = d.length > 7 ? `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}` : d.length > 3 ? `${d.slice(0, 3)}-${d.slice(3)}` : d;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.name || data.name.trim().length < 2) return say("성함을 입력해 주세요."), form.name.focus();
    if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(data.phone || "")) return say("연락처를 정확히 입력해 주세요. (예: 010-1234-5678)"), form.phone.focus();
    if (!form.privacy.checked) return say("개인정보 수집 및 이용에 동의해 주세요."), form.privacy.focus();

    if (!CONFIG.leadEndpoint) {
      return say(CONFIG.phone ? `온라인 접수 준비 중입니다. 대표번호 ${CONFIG.phone}로 문의해 주세요.` : "온라인 접수 준비 중입니다. 잠시 후 다시 시도해 주세요.");
    }

    btn.disabled = true;
    say("접수 중입니다…", true);
    try {
      const params = new URLSearchParams(location.search);
      const res = await fetch(CONFIG.leadEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          type: data.type,
          purpose: data.purpose,
          privacy: true,
          utm_source: params.get("utm_source") || "",
          utm_medium: params.get("utm_medium") || "",
          utm_campaign: params.get("utm_campaign") || "",
          utm_content: params.get("utm_content") || "",
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (res.status === 400 && result.error) return say(result.error);
      if (!res.ok) throw new Error("HTTP " + res.status);
      form.reset();
      say("상담 신청이 접수되었습니다. 빠르게 연락드리겠습니다.", true);
    } catch (err) {
      say("일시적인 오류로 접수되지 않았습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      btn.disabled = false;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyPhone();
  initHeader();
  initReveal();
  initPlans();
  initLightbox();
  initLeadForm();
});
