/* GymScore app controller */

function $(id) { return document.getElementById(id); }

function safeJSONParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

function durationToMinutes(duration) {
  switch (duration) {
    case "fast": return 35;
    case "med": return 50;
    case "slow": return 65;
    case "vslow": return 85;
    default: return 50;
  }
}

function cardioToMinutes(cardio) {
  switch (cardio) {
    case "light": return 12;
    case "mod": return 20;
    case "none": return 0;
    default: return 0;
  }
}

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function getCheckedValues(form, name) {
  return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map(i => i.value);
}

function validateMainForm(data) {
  const age = Number(data.age);
  if (!Number.isFinite(age) || age < 8 || age > 99) return false;

  if (data.height !== "" && data.height != null) {
    const h = Number(data.height);
    if (!Number.isFinite(h) || h < 100 || h > 230) return false;
  }

  if (data.weight !== "" && data.weight != null) {
    const w = Number(data.weight);
    if (!Number.isFinite(w) || w < 30 || w > 250) return false;
  }

  if (!data.level) return false;

  const days = Number(data.days);
  if (!Number.isFinite(days) || days < 1 || days > 7) return false;

  if (!data.duration) return false;
  if (!data.place) return false;
  if (!data.goal) return false;

  return true;
}

function validateFinalForm(data) {
  if (!data.cardio) return false;
  return true;
}

function initFormPage() {
  const form = $("mainForm");
  if (!form) return;

  initI18n();
  applyI18n();

  // restore if exists
  const saved = safeJSONParse(localStorage.getItem("gymscore_form") || "null", null);
  if (saved) {
    ["age","height","weight","sex","level","days","duration","place","goal"].forEach(k => {
      const el = form.elements[k];
      if (!el) return;
      if (saved[k] != null && saved[k] !== "") el.value = String(saved[k]);
    });

    // injuries
    if (Array.isArray(saved.injuries)) {
      saved.injuries.forEach(val => {
        const cb = form.querySelector(`input[name="injuries"][value="${val}"]`);
        if (cb) cb.checked = true;
      });
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("formError");
    hide(err);

    const data = {
      age: form.elements.age.value.trim(),
      height: form.elements.height.value.trim(),
      weight: form.elements.weight.value.trim(),
      sex: form.elements.sex.value,
      level: form.elements.level.value,
      days: form.elements.days.value.trim(),
      duration: form.elements.duration.value,
      place: form.elements.place.value,
      goal: form.elements.goal.value,
      injuries: getCheckedValues(form, "injuries")
    };

    if (!validateMainForm(data)) {
      show(err);
      return;
    }

    localStorage.setItem("gymscore_form", JSON.stringify(data));
    // go to final (via JS)
    window.location.href = "final.html";
  });
}

function initFinalPage() {
  const form = $("finalForm");
  if (!form) return;

  initI18n();
  applyI18n();

  const main = safeJSONParse(localStorage.getItem("gymscore_form") || "null", null);
  if (!main) {
    window.location.href = "form.html";
    return;
  }

  const equipBlock = $("homeEquipBlock");
  if (main.place === "home") show(equipBlock);
  else hide(equipBlock);

  // restore
  const saved = safeJSONParse(localStorage.getItem("gymscore_final") || "null", null);
  if (saved) {
    if (saved.cardio) form.elements.cardio.value = saved.cardio;
    if (Array.isArray(saved.equip)) {
      saved.equip.forEach(val => {
        const cb = form.querySelector(`input[name="equip"][value="${val}"]`);
        if (cb) cb.checked = true;
      });
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("finalError");
    hide(err);

    const data = {
      cardio: form.elements.cardio.value,
      equip: getCheckedValues(form, "equip")
    };

    if (!validateFinalForm(data)) {
      show(err);
      return;
    }

    localStorage.setItem("gymscore_final", JSON.stringify(data));
    window.location.href = "result.html";
  });
}

function renderWarnings(profile) {
  const wrap = $("warnings");
  if (!wrap) return;
  wrap.innerHTML = "";

  const lang = getLang();
  const t = I18N[lang] || I18N.pt;

  const days = Number(profile.days || 0);
  const age = Number(profile.age || 0);

  if (days >= 6) {
    const div = document.createElement("div");
    div.className = "alert warn";
    div.textContent = t.warn_rest;
    wrap.appendChild(div);
  }

  if (age > 0 && age < 18) {
    const div = document.createElement("div");
    div.className = "alert ok";
    div.textContent = t.warn_u18;
    wrap.appendChild(div);
  }
}

function renderMeta(profile, finalAnswers, plan) {
  const meta = $("metaLine");
  if (!meta) return;

  const lang = getLang();
  const t = I18N[lang] || I18N.pt;

  const trainMin = durationToMinutes(profile.duration);
  const cardioMin = cardioToMinutes(finalAnswers.cardio);

  const placeLabel = profile.place === "home" ? t.place_home_short : t.place_gym_short;

  meta.textContent =
    `${t.meta_prefix}: ${plan.name} • ${profile.days} ${t.meta_days} • ` +
    `${t.meta_place}: ${placeLabel} • ${t.meta_train}: ~${trainMin} ${t.train_min} • ` +
    `${t.meta_cardio}: ${cardioMin} ${t.cardio_min}`;
}

function renderWarmup(plan) {
  const box = $("warmupBox");
  if (!box) return;
  box.innerHTML = "";

  const ul = document.createElement("ul");
  ul.className = "bullets";
  (plan.warmup || []).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });
  box.appendChild(ul);
}

function exerciseLine(ex) {
  return `${ex.n} — ${ex.s}×${ex.r} • descanso: ${ex.rest}`;
}

function renderWeek(profile, plan) {
  const weekBox = $("weekBox");
  if (!weekBox) return;
  weekBox.innerHTML = "";

  const days = Math.min(Number(profile.days || 0), (plan.week || []).length);

  for (let i = 0; i < days; i++) {
    const day = plan.week[i];

    const card = document.createElement("div");
    card.className = "workday";

    const h3 = document.createElement("h3");
    h3.textContent = `${i + 1} • ${day.title}`;
    card.appendChild(h3);

    const ul = document.createElement("ul");
    ul.className = "exlist";
    day.ex.forEach(ex => {
      const li = document.createElement("li");
      li.textContent = exerciseLine(ex);
      ul.appendChild(li);
    });
    card.appendChild(ul);

    weekBox.appendChild(card);
  }
}

function build5Weeks(plan, profile, finalAnswers) {
  const wrap = $("weeks5");
  if (!wrap) return;
  wrap.innerHTML = "";

  const lang = getLang();
  const t = I18N[lang] || I18N.pt;

  const note = document.createElement("div");
  note.className = "alert ok";
  note.textContent = t.prog_note;
  wrap.appendChild(note);

  for (let w = 1; w <= 5; w++) {
    const card = document.createElement("div");
    card.className = "workday";

    const h3 = document.createElement("h3");
    h3.textContent = `${t.week_week} ${w}`;
    card.appendChild(h3);

    // Show same week template, and add a simple progression suggestion line
    const p = document.createElement("div");
    p.className = "exmeta";
    p.textContent =
      (w === 1)
        ? "Base"
        : `Progressão semana ${w}: tente +1 série em 1 exercício principal OU +2 reps (forma boa).`;
    card.appendChild(p);

    const preview = document.createElement("div");
    preview.className = "exmeta";
    preview.textContent = `Plano: ${plan.name} • Dias: ${profile.days} • Cardio: ${finalAnswers.cardio}`;
    card.appendChild(preview);

    card.appendChild(document.createElement("div")).className = "divider";

    // mini-list: titles only
    const ul = document.createElement("ul");
    ul.className = "bullets";
    (plan.week || []).slice(0, Math.min(Number(profile.days || 0), plan.week.length)).forEach((d, idx) => {
      const li = document.createElement("li");
      li.textContent = `${t.week_day} ${idx + 1}: ${d.title}`;
      ul.appendChild(li);
    });
    card.appendChild(ul);

    wrap.appendChild(card);
  }
}

function initResultPage() {
  const resultCard = $("resultCard");
  if (!resultCard) return;

  initI18n();
  applyI18n();

  initPrintButton();

  // If user clicks "See example" without data, load defaults
  const profile = safeJSONParse(localStorage.getItem("gymscore_form") || "null", null) || {
    age: 18, height: "", weight: "", sex: "", level: "beg", days: 3, duration: "med",
    place: "gym", goal: "hypertrophy", injuries: []
  };

  const finalAnswers = safeJSONParse(localStorage.getItem("gymscore_final") || "null", null) || {
    cardio: "none", equip: []
  };

  // Score -> plan
  const res = computeScores(profile, finalAnswers);
  const plan = getPlanById(res.bestId);

  const planPill = $("planPill");
  if (planPill) planPill.textContent = `Plano escolhido: ${plan.name}`;

  renderWarnings(profile);
  renderMeta(profile, finalAnswers, plan);
  renderWarmup(plan);
  renderWeek(profile, plan);

  const btn5 = $("btn5w");
  if (btn5) {
    btn5.addEventListener("click", () => build5Weeks(plan, profile, finalAnswers));
  }

  // Re-apply i18n after language switch (update dynamic texts too)
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      // after applyI18n(), rerender meta/warnings since they are dynamic
      setTimeout(() => {
        renderWarnings(profile);
        renderMeta(profile, finalAnswers, plan);
      }, 0);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Detect page by existing elements
  if ($("mainForm")) initFormPage();
  if ($("finalForm")) initFinalPage();
  if ($("resultCard")) initResultPage();
});
