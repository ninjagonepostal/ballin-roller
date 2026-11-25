/* Ballin Roller — RPG Dice Roller logic.
   Copyright (C) 2026 David "MajteK" Alexander.
   This program is free software: you can redistribute it and/or modify it
   under the terms of the GNU General Public License v3.0 or later.
   See LICENSE in the project root.
   Vanilla JavaScript, no dependencies. Fully offline: rolls are generated
   on-device and history is kept only in this browser's local storage. */
(function(){
  "use strict";

  /* Dice ranked by popularity — most-rolled dice get the most
     eye-catching neon colors. Every die keeps a unique color. */
  var DICE = [
    { id:"d4",   sides:4,   color:"#39ff14" },
    { id:"d6",   sides:6,   color:"#ff003c" },
    { id:"d8",   sides:8,   color:"#ff2e9e" },
    { id:"d10",  sides:10,  color:"#00e5ff" },
    { id:"d12",  sides:12,  color:"#ff7a00" },
    { id:"d20",  sides:20,  color:"#fcee0a" },
    { id:"d100", sides:100, color:"#b967ff" }
  ];
  var STORE_KEY = "ballin-roller-history-v1";
  var MAX_HISTORY = 100;

  /* On-device storage only. Wrapped so the file still runs (memory-only)
     if a browser blocks storage for local files. No user, account, or
     device data is ever stored — only the rolls themselves. */
  var store = {
    load: function(){
      try {
        var raw = localStorage.getItem(STORE_KEY);
        var arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
      } catch(e){ return []; }
    },
    save: function(entries){
      try { localStorage.setItem(STORE_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY))); } catch(e){}
    },
    wipe: function(){
      try { localStorage.removeItem(STORE_KEY); } catch(e){}
    }
  };

  var history = store.load();
  var state = {}; // per-die {qty, mod}

  function dieShape(d){
    var c = d.color, inner = "";
    var open = '<svg viewBox="0 0 100 100" role="img" aria-label="' + d.id + ' die">';
    var face = 'fill="' + c + '" fill-opacity="0.13" stroke="' + c + '" stroke-width="3.5" stroke-linejoin="round"';
    var line = 'stroke="' + c + '" stroke-width="1.6" stroke-opacity="0.55" fill="none"';
    var label = d.id === "d100" ? "%" : String(d.sides);
    var text = '<text x="50" y="58" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="' +
      (d.id === "d100" ? "30" : "26") + '" fill="' + c + '">' + label + '</text>';
    switch(d.id){
      case "d4":
        inner = '<polygon points="50,7 93,88 7,88" ' + face + '/><polygon points="50,38 68,72 32,72" ' + line + '/>' + text; break;
      case "d6":
        inner = '<rect x="13" y="13" width="74" height="74" rx="10" ' + face + '/>' + text; break;
      case "d8":
        inner = '<polygon points="50,4 95,50 50,96 5,50" ' + face + '/><polygon points="50,26 72,50 50,74 28,50" ' + line + '/>' + text; break;
      case "d10":
        inner = '<polygon points="50,4 91,37 75,95 25,95 9,37" ' + face + '/><polygon points="50,30 70,44 62,72 38,72 30,44" ' + line + '/>' + text; break;
      case "d12":
        inner = '<polygon points="50,4 95,37 78,92 22,92 5,37" ' + face + '/><polygon points="50,28 71,43 63,68 37,68 29,43" ' + line + '/>' + text; break;
      case "d20":
        inner = '<polygon points="50,3 91,26 91,74 50,97 9,74 9,26" ' + face + '/><polygon points="50,24 74,50 50,76 26,50" ' + line + '/>' + text; break;
      case "d100":
        inner = '<polygon points="50,3 79,11 94,32 97,61 85,85 61,96 36,94 14,82 4,58 8,31 24,12" ' + face + '/>' + text; break;
    }
    return open + inner + '</svg>';
  }

  function fmtMod(m){ return (m > 0 ? "+" + m : String(m)); }
  function diceSum(rolls){ return rolls.reduce(function(a,b){ return a + b; }, 0); }
  function pad(n){ return (n < 10 ? "0" : "") + n; }
  function fmtTime(ts){
    var t = new Date(ts);
    return pad(t.getHours()) + ":" + pad(t.getMinutes()) + ":" + pad(t.getSeconds());
  }
  function formula(e){
    return e.qty + e.die + (e.mod !== 0 ? " " + fmtMod(e.mod) : "");
  }

  /* ---------- build dice rows ---------- */
  var diceList = document.getElementById("diceList");
  DICE.forEach(function(d){
    state[d.id] = { qty: 1, mod: 0 };
    var row = document.createElement("div");
    row.className = "die-row";
    row.style.setProperty("--die", d.color);
    row.innerHTML =
      '<div class="stepper qty">' +
        '<span class="s-label">Qty</span>' +
        '<button type="button" data-act="qty+" aria-label="Add one ' + d.id + '">+</button>' +
        '<input type="number" inputmode="numeric" min="1" max="50" value="1" data-field="qty" aria-label="Number of ' + d.id + ' dice" />' +
        '<button type="button" data-act="qty-" aria-label="Remove one ' + d.id + '">−</button>' +
      '</div>' +
      '<div class="die-cell">' +
        '<button type="button" class="die-btn" data-act="roll" aria-label="Roll ' + d.id + '">' + dieShape(d) + '</button>' +
        '<span class="die-name">' + d.id + '</span>' +
      '</div>' +
      '<div class="stepper mod">' +
        '<span class="s-label">Mod</span>' +
        '<button type="button" data-act="mod+" aria-label="Increase ' + d.id + ' modifier">+</button>' +
        '<input type="number" inputmode="numeric" min="-50" max="50" value="0" data-field="mod" aria-label="' + d.id + ' roll modifier" />' +
        '<button type="button" data-act="mod-" aria-label="Decrease ' + d.id + ' modifier">−</button>' +
      '</div>' +
      '<button type="button" class="roll-btn" data-act="roll">Roll</button>';

    row.addEventListener("click", function(ev){
      var btn = ev.target.closest("button");
      if (!btn) return;
      var act = btn.getAttribute("data-act");
      var st = state[d.id];
      var qtyInput = row.querySelector('[data-field="qty"]');
      var modInput = row.querySelector('[data-field="mod"]');
      if (act === "qty+") st.qty = Math.min(50, st.qty + 1);
      else if (act === "qty-") st.qty = Math.max(1, st.qty - 1);
      else if (act === "mod+") st.mod = Math.min(50, st.mod + 1);
      else if (act === "mod-") st.mod = Math.max(-50, st.mod - 1);
      else if (act === "roll"){ doRoll(d, row); return; }
      else return;
      qtyInput.value = st.qty;
      modInput.value = st.mod;
    });
    row.querySelector('[data-field="qty"]').addEventListener("change", function(ev){
      var v = parseInt(ev.target.value, 10);
      state[d.id].qty = isNaN(v) ? 1 : Math.max(1, Math.min(50, v));
      ev.target.value = state[d.id].qty;
    });
    row.querySelector('[data-field="mod"]').addEventListener("change", function(ev){
      var v = parseInt(ev.target.value, 10);
      state[d.id].mod = isNaN(v) ? 0 : Math.max(-50, Math.min(50, v));
      ev.target.value = state[d.id].mod;
    });
    diceList.appendChild(row);
  });

  /* ---------- rolling ---------- */
  function rollDie(sides){
    var buf = new Uint32Array(1);
    var limit = Math.floor(4294967296 / sides) * sides;
    var n;
    do { crypto.getRandomValues(buf); n = buf[0]; } while (n >= limit);
    return (n % sides) + 1;
  }

  var lastRollEl = document.getElementById("lastRoll");
  var lastMain = document.getElementById("lastRollMain");
  var lastTotal = document.getElementById("lastRollTotal");
  var lastBadge = document.getElementById("lastRollBadge");

  function badgesFor(e){
    var out = "";
    if (e.qty === 1 && e.rolls[0] === e.sides) out += '<span class="badge natmax">NAT ' + e.sides + '</span>';
    if (e.qty === 1 && e.rolls[0] === 1) out += '<span class="badge natmin">NAT 1</span>';
    return out;
  }

  function showLast(e){
    lastRollEl.style.setProperty("--die", e.color);
    lastRollEl.classList.add("has-roll");
    lastMain.textContent = formula(e) + "  →  dice " + diceSum(e.rolls) + (e.mod !== 0 ? " · mod " + fmtMod(e.mod) : "");
    lastTotal.textContent = e.total;
    lastBadge.innerHTML = badgesFor(e);
  }

  function doRoll(d, row){
    var st = state[d.id];
    var dieBtn = row.querySelector(".die-btn");
    dieBtn.classList.add("rolling");
    var rolls = [];
    for (var i = 0; i < st.qty; i++) rolls.push(rollDie(d.sides));
    var total = diceSum(rolls) + st.mod;
    var entry = {
      die: d.id, sides: d.sides, color: d.color,
      qty: st.qty, mod: st.mod, rolls: rolls, total: total, ts: Date.now()
    };
    setTimeout(function(){
      dieBtn.classList.remove("rolling");
      history.unshift(entry);
      if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
      store.save(history);
      renderHistory();
      showLast(entry);
    }, 330);
  }

  /* ---------- history rendering ---------- */
  var historyList = document.getElementById("historyList");

  function equationHTML(e){
    var max = Math.max.apply(null, e.rolls);
    var min = Math.min.apply(null, e.rolls);
    var parts = e.rolls.map(function(r){
      var cls = "";
      if (max !== min && r === max) cls = "r-max";
      else if (max !== min && r === min) cls = "r-min";
      else if (max === min && e.qty > 1) cls = "r-tie";
      else if (e.qty === 1 && r === e.sides) cls = "r-max";
      else if (e.qty === 1 && r === 1) cls = "r-min";
      return cls ? '<span class="' + cls + '">' + r + '</span>' : String(r);
    });
    var eq = parts.join(" + ");
    if (e.mod !== 0) eq += ' <span class="r-mod">' + (e.mod > 0 ? "+ " + e.mod : "− " + Math.abs(e.mod)) + '</span>';
    eq += ' = <span class="r-total">' + e.total + '</span>';
    return eq;
  }

  function renderHistory(){
    if (!history.length){
      historyList.innerHTML = '<div class="history-empty">No rolls yet.<br />Your history is held on this device only — nothing is sent anywhere.</div>';
      return;
    }
    historyList.innerHTML = history.map(function(e){
      return '<article class="h-entry" style="--die:' + e.color + '">' +
        '<div class="h-top"><span class="h-formula">' + formula(e) + '</span>' +
        '<span class="h-time">' + fmtTime(e.ts) + '</span></div>' +
        '<div class="h-total">' + e.total + '</div>' +
        '<div class="h-meta">Dice total ' + diceSum(e.rolls) + ' · Modifier ' + fmtMod(e.mod) + ' · Result ' + e.total + '</div>' +
        '<div class="h-eq">' + equationHTML(e) + '</div>' +
        (badgesFor(e) ? '<div class="h-badges">' + badgesFor(e) + '</div>' : '') +
      '</article>';
    }).join("");
  }

  var clearBtn = document.getElementById("clearBtn");
  var clearArmed = false, clearTimer = null;
  clearBtn.addEventListener("click", function(){
    if (!clearArmed){
      clearArmed = true;
      clearBtn.textContent = "Sure?";
      clearBtn.classList.add("confirm");
      clearTimer = setTimeout(function(){
        clearArmed = false; clearBtn.textContent = "Clear"; clearBtn.classList.remove("confirm");
      }, 3000);
      return;
    }
    clearTimeout(clearTimer);
    clearArmed = false;
    clearBtn.textContent = "Clear";
    clearBtn.classList.remove("confirm");
    history = [];
    store.wipe();
    renderHistory();
    lastRollEl.classList.remove("has-roll");
    lastMain.textContent = "No rolls yet — hit ROLL.";
    lastTotal.textContent = "—";
    lastBadge.innerHTML = "";
    toast("History cleared from this device");
  });

  /* ---------- toast ---------- */
  var toastEl = document.getElementById("toast"), toastTimer = null;
  function toast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastEl.classList.remove("show"); }, 2600);
  }

  /* ---------- export ---------- */
  function download(filename, text, type){
    var blob = new Blob([text], { type: type || "text/html;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1500);
  }

  function exportSource(){
    /* Serialize this very page: the download is the HTML shell of this
       project. Keep styles.css and app.js in the same folder as the
       downloaded file — the page loads them by relative path. No build
       step; current inputs/history are re-initialized by the script
       when the downloaded copy is opened. */
    var html = "<!doctype html>\n" + document.documentElement.outerHTML;
    download("ballin-roller.html", html);
    toast("Saved ballin-roller.html — keep styles.css and app.js alongside it");
  }
  document.getElementById("exportBtn").addEventListener("click", exportSource);
  document.getElementById("exportTopBtn").addEventListener("click", exportSource);

  document.getElementById("exportHistoryBtn").addEventListener("click", function(){
    if (!history.length){ toast("No rolls to export yet"); return; }
    var lines = history.slice().reverse().map(function(e){
      return "[" + fmtTime(e.ts) + "] " + formula(e) + "  →  rolls: " + e.rolls.join(", ") +
        " · dice total " + diceSum(e.rolls) + " · modifier " + fmtMod(e.mod) + " · RESULT " + e.total;
    });
    download("dice-roll-history.txt", "BALLIN ROLLER — ROLL HISTORY\n=========================\n\n" + lines.join("\n") + "\n", "text/plain;charset=utf-8");
    toast("Saved dice-roll-history.txt");
  });

  /* ---------- init ---------- */
  renderHistory();
  if (history.length) showLast(history[0]);
})();
