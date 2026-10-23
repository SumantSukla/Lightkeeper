// ---------- Elements ----------
const sectorEl = document.getElementById("sector");
const sliderEl = document.getElementById("slider");
const grooveEl = document.getElementById("groove");
const knobEl = document.getElementById("knob");
const markerEl = document.getElementById("knob-marker");
const buttonEl = document.getElementById("button");

// ---------- Config ----------
const MAX_DIAMETER = 900; // full-size light sector
const MIN_DIAMETER = 150; // smallest light sector
const SLIDER_TOP_MIN = 140; // slider at top
const SLIDER_TOP_MAX = 670; // slider at bottom
const SECTOR_SPAN = 30; // width of the beam in degrees
const SECTOR_OFFSET = -15; // center of beam

const TURN_SPEED = 100; // deg/sec for arrow keys
const SLIDER_SPEED = 400; // px/sec for arrow keys

const LIGHT_WHITE = "#eadfbfb5";
const LIGHT_RED = "#ff3b30b5";
const BUTTON_WHITE = "#eadfbf";
const BUTTON_RED = "#ff6257";

// ---------- Audio ----------
const BGM_SRC = "assets/bgm.mp3"; // background music (loops)
const BGM_VOLUME = 0.6;
const BEEP_SRC = "assets/beep.mp3"; // tone played each time a radio message comes on
const BEEP_VOLUME = 0.6;

const CRACK_SRC = "assets/crack.mp3";
const CRACK_VOLUME = 1;

const bgm = new Audio(BGM_SRC);
bgm.loop = true;
bgm.volume = BGM_VOLUME;
const beep = new Audio(BEEP_SRC);
beep.volume = BEEP_VOLUME;
const crack = new Audio(CRACK_SRC);
crack.volume = CRACK_VOLUME;

// prevent play() from breaking the game in weird (idk) situations
function playSound(audio, restart = false) {
  try {
    if (restart) audio.currentTime = 0;
    const p = audio.play();
    if (p && p.catch) p.catch(() => {});
  } catch (e) {}
}

// ---------- State ----------
let sliderTop = SLIDER_TOP_MIN;
let angle = 0;
let isRed = false;
let lightDiameter = MAX_DIAMETER;

// ---------- Rendering ----------
function render() {
  // slider -> radius
  const t = (sliderTop - SLIDER_TOP_MIN) / (SLIDER_TOP_MAX - SLIDER_TOP_MIN);
  const diameter = MAX_DIAMETER - t * (MAX_DIAMETER - MIN_DIAMETER);
  lightDiameter = diameter;
  sliderEl.style.top = `${sliderTop}px`;
  sectorEl.style.width = `${diameter}px`;
  sectorEl.style.height = `${diameter}px`;

  // knob -> direction
  markerEl.style.transform = `rotate(${angle}deg)`;
  sectorEl.style.transform = `rotate(${angle + SECTOR_OFFSET}deg)`;

  // button -> colour
  const light = isRed ? LIGHT_RED : LIGHT_WHITE;
  sectorEl.style.background = `conic-gradient(from 0deg, ${light} ${SECTOR_SPAN}deg, #0000 0%)`;
  buttonEl.style.backgroundColor = isRed ? BUTTON_RED : BUTTON_WHITE;
}

function setSliderTop(v) {
  sliderTop = Math.min(SLIDER_TOP_MAX, Math.max(SLIDER_TOP_MIN, v));
  render();
}

function setAngle(a) {
  angle = ((a % 360) + 360) % 360;
  render();
}

function toggleColor() {
  isRed = !isRed;
  render();
}

// ---------- Slider (mouse / touch drag) ----------
let sliderDrag = null;

sliderEl.style.cursor = "grab";
sliderEl.style.touchAction = "none";

sliderEl.addEventListener("pointerdown", (e) => {
  if (!gameStarted || gameOver) return;
  const scale = grooveEl.getBoundingClientRect().height / 700; // container is scaled
  sliderDrag = { startY: e.clientY, startTop: sliderTop, scale };
  sliderEl.setPointerCapture(e.pointerId);
  sliderEl.style.cursor = "grabbing";
  e.preventDefault();
});

sliderEl.addEventListener("pointermove", (e) => {
  if (!sliderDrag) return;
  const dy = (e.clientY - sliderDrag.startY) / sliderDrag.scale;
  setSliderTop(sliderDrag.startTop + dy);
});

function endSliderDrag() {
  sliderDrag = null;
  sliderEl.style.cursor = "grab";
}
sliderEl.addEventListener("pointerup", endSliderDrag);
sliderEl.addEventListener("pointercancel", endSliderDrag);

// ---------- Knob (mouse / touch drag) ----------
let knobDrag = null;

knobEl.style.cursor = "grab";
knobEl.style.touchAction = "none";

function pointerAngle(e) {
  const r = knobEl.getBoundingClientRect();
  const dx = e.clientX - (r.left + r.width / 2);
  const dy = e.clientY - (r.top + r.height / 2);
  return (Math.atan2(dx, -dy) * 180) / Math.PI; // 0 = up, clockwise -> positive
}

knobEl.addEventListener("pointerdown", (e) => {
  if (!gameStarted || gameOver) return;
  knobDrag = { startPointer: pointerAngle(e), startAngle: angle };
  knobEl.setPointerCapture(e.pointerId);
  knobEl.style.cursor = "grabbing";
  e.preventDefault();
});

knobEl.addEventListener("pointermove", (e) => {
  if (!knobDrag) return;
  setAngle(knobDrag.startAngle + (pointerAngle(e) - knobDrag.startPointer));
});

function endKnobDrag() {
  knobDrag = null;
  knobEl.style.cursor = "grab";
}
knobEl.addEventListener("pointerup", endKnobDrag);
knobEl.addEventListener("pointercancel", endKnobDrag);

// ---------- Button ----------
buttonEl.style.cursor = "pointer";
buttonEl.addEventListener("click", () => {
  if (gameStarted && !gameOver) toggleColor();
});

// ---------- Keyboard ----------
// Left/Right  -> turn knob (light direction)
// Up/Down     -> move slider (strength)
// Space       -> toggle colour
const keys = new Set();
const HANDLED = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);

function pressButtonVisual(down) {
  buttonEl.style.top = down ? "908px" : "";
  buttonEl.style.boxShadow = down ? "none" : "";
}

window.addEventListener("keydown", (e) => {
  if (!gameStarted || gameOver) return; // freeze game
  if (HANDLED.has(e.key)) {
    keys.add(e.key);
    e.preventDefault();
  } else if (e.code === "Space") {
    e.preventDefault();
    if (!e.repeat) {
      pressButtonVisual(true);
      toggleColor();
    }
  }
});

window.addEventListener("keyup", (e) => {
  keys.delete(e.key);
  if (e.code === "Space") pressButtonVisual(false);
});

window.addEventListener("blur", () => {
  keys.clear();
  pressButtonVisual(false);
});

// =====================================================================
// ---------- In-game clock ----------
// =====================================================================
const clockEl = document.getElementById("clock");
const radarEl = document.getElementById("radar-panel");
const CLOCK_START = "00:00";
const GAME_MINUTES_PER_SECOND = 2; // in-game minutes that pass per real second

function parseTime(t) {
  // accepts "HH:MM" or a plain number of minutes since midnight
  if (typeof t === "number") return t;
  const [h, m] = String(t).split(":").map(Number);
  return h * 60 + (m || 0);
}

function formatTime(mins) {
  const m = Math.floor(mins) % 1440;
  const hh = String(Math.floor(m / 60)).padStart(2, "0");
  const mm = String(m % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

let gameTime = parseTime(CLOCK_START); // in-game minutes
let lastClockText = "";

function updateClock() {
  const text = formatTime(gameTime);
  if (text !== lastClockText) {
    clockEl.textContent = text;
    lastClockText = text;
  }
}

// =====================================================================
// ---------- Radio room ----------
// =====================================================================
// The radio is a scrollable log.
// Queued messages
// - A dialogue of "NA" (or empty) is ignored: nothing is added to the log.
// This was more difficult than i expected
const radioTextEl = document.getElementById("radio-text");

const RADIO_TYPE_MS = 30; // typing speed, ms per character
const RADIO_PAUSE_SECONDS = 0.6; // short pause after a message before the next one starts typing
const RADIO_LOG_MAX = 200; // history count

// blinking cursor
const cursorStyle = document.createElement("style");
cursorStyle.textContent = `
  #radio-text .typed-cursor,
  #radio-text .standby-cursor {
    color: #7dffb8;
    text-shadow: 0 0 8px #288255;
    font-weight: 700;
    letter-spacing: 0;
  }
  #radio-text .standby-cursor {
    animation: radioBlink 0.7s infinite;
  }
  @keyframes radioBlink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }`;
document.head.appendChild(cursorStyle);

const radioQueue = []; // messages waiting to be typed
let radioTyped = null; // current Typed.js instance
let radioLastLine = null;
let radioActive = false;
let radioTimer = 0;
let radioStick = true; // true: keep the log scrolled to the newest text

// The idle cursor
const standbyCursorEl = document.createElement("span");
standbyCursorEl.className = "standby-cursor";
standbyCursorEl.textContent = "█";

function showStandbyCursor() {
  (radioLastLine ?? radioTextEl).appendChild(standbyCursorEl);
}

function hideStandbyCursor() {
  standbyCursorEl.remove();
}

// If the user scrolls up to read older messages, stop following the new text;
// scrolling back to the bottom starts following again.
radioTextEl.addEventListener("scroll", () => {
  radioStick =
    radioTextEl.scrollHeight -
      radioTextEl.scrollTop -
      radioTextEl.clientHeight <
    8;
});

function radioScrollToEnd() {
  radioTextEl.scrollTop = radioTextEl.scrollHeight;
}

function isNA(text) {
  const t = String(text ?? "").trim();
  return t === "" || t.toUpperCase() === "NA";
}

function showRadio(m) {
  hideStandbyCursor();
  playSound(beep, true);

  // separator between messages
  if (radioLastLine) {
    const sep = document.createElement("div");
    sep.className = "rcircle radio-sep";
    radioTextEl.appendChild(sep);
  }

  const line = document.createElement("div");
  line.className = "radio-line";
  const nameEl = document.createElement("span");
  nameEl.className = "radio-name";
  nameEl.textContent = `${m.name}:`;
  const textEl = document.createElement("span");
  line.append(nameEl, document.createTextNode(" "), textEl);
  radioTextEl.appendChild(line);
  radioLastLine = line;

  // drop the oldest message and its separator once the log is too long
  while (radioTextEl.children.length > RADIO_LOG_MAX * 2) {
    radioTextEl.firstElementChild.remove();
    radioTextEl.firstElementChild.remove();
  }
  radioStick = true;
  radioScrollToEnd();

  radioActive = true;
  radioTimer = Infinity; // don't count down while typing

  const typingDone = () => {
    if (radioTyped) {
      radioTyped.destroy(); // removes the typing cursor
      radioTyped = null;
    }
    textEl.textContent = m.text;
    showStandbyCursor();
    radioTimer = RADIO_PAUSE_SECONDS;
  };

  if (typeof Typed === "undefined") {
    // Typed.js failed to load: just show the text
    typingDone();
    return;
  }

  radioTyped = new Typed(textEl, {
    strings: [m.text],
    contentType: "null",
    typeSpeed: RADIO_TYPE_MS,
    showCursor: true,
    cursorChar: "█",
    onComplete: typingDone,
  });
}

function radioNext() {
  const m = radioQueue.shift();
  if (m) {
    showRadio(m);
  } else {
    radioActive = false;
    showStandbyCursor();
  }
}

function radioSay(msg) {
  if (isNA(msg.text)) return;
  radioQueue.push(msg);
  if (!radioActive) radioNext();
}

function radioSayCrash(msgs) {
  for (const m of msgs) radioSay(m);
}

function updateRadio(dt) {
  if (!radioActive) return;
  if (radioStick) radioScrollToEnd();
  radioTimer -= dt;
  if (radioTimer <= 0) radioNext();
}

// =====================================================================
// ---------- Resources ----------
// =====================================================================
// A boat's money / food / health / plague values are added to these when it docks
// (negative = it takes from the harbor).

const RESOURCE_KEYS = ["money", "food", "health", "plague"];

// Starting values
const resources = { money: 500, food: 65, health: 100, plague: 0 };
// Value at which the bar is completely full
const RESOURCE_BAR_MAX = { money: 2000, food: 100, health: 100, plague: 100 };
// Hard limit on the value itself (money has no upper limit; its bar just stays full)
const RESOURCE_CAP = { money: Infinity, food: 100, health: 100, plague: 100 };

const RESOURCE_UI = {
  money: { bar: "money-bar", label: "money" },
  food: { bar: "food-bar", label: "food" },
  health: { bar: "health-bar", label: "health" },
  plague: { bar: "infection-bar", label: "plague" },
};

const BAR_MAX_HEIGHT = 275;

const RESOURCE_WARN = {
  money: { below: 250 },
  food: { below: 40 },
  health: { below: 40 },
  plague: { above: 30 },
};
const LABEL_GAP = 8;

function initResourceUI() {
  for (const ui of Object.values(RESOURCE_UI)) {
    ui.barEl = document.getElementById(ui.bar);
    ui.labelEl = document.getElementById(ui.label);
  }
  for (const ui of Object.values(RESOURCE_UI)) {
    ui.barBottom = parseFloat(getComputedStyle(ui.barEl).bottom) || 0;
    const centerX = ui.barEl.offsetLeft + ui.barEl.offsetWidth / 2;

    ui.barEl.style.transition =
      "height 0.5s ease, background-color 0.3s, box-shadow 0.3s";
    Object.assign(ui.labelEl.style, {
      left: `${centerX}px`,
      transform: "translateX(-50%)",
      textAlign: "center",
      whiteSpace: "nowrap",
      letterSpacing: "0.07em",
      top: "auto",
      transition: "bottom 0.5s ease",
    });
  }
  updateResourceUI();
}

function setBar(key, value, max, text) {
  const ui = RESOURCE_UI[key];
  const fraction = Math.min(1, Math.max(0, value / max));
  const h = Math.round(BAR_MAX_HEIGHT * fraction);
  const w = RESOURCE_WARN[key];
  const warn = value < (w.below ?? -Infinity) || value > (w.above ?? Infinity);
  ui.barEl.classList.toggle("warn", warn);
  ui.labelEl.classList.toggle("warn", warn);
  ui.barEl.style.height = `${h}px`;
  ui.labelEl.style.bottom = `${ui.barBottom + h + LABEL_GAP}px`;
  ui.labelEl.textContent = text;
}

function updateResourceUI() {
  setBar(
    "money",
    resources.money,
    RESOURCE_BAR_MAX.money,
    `$${Math.round(resources.money)}`,
  );
  setBar(
    "food",
    resources.food,
    RESOURCE_BAR_MAX.food,
    `${Math.round(resources.food)}%`,
  );
  setBar(
    "health",
    resources.health,
    RESOURCE_BAR_MAX.health,
    `${Math.round(resources.health)}%`,
  );
  setBar(
    "plague",
    resources.plague,
    RESOURCE_BAR_MAX.plague,
    `${Math.round(resources.plague)}%`,
  );
}

function applyBoatToHarbor(b) {
  for (const k of RESOURCE_KEYS) {
    resources[k] = Math.min(
      RESOURCE_CAP[k],
      Math.max(0, resources[k] + (b[k] || 0)),
    );
  }
}

// ---------- Slow drains ----------
// Food falls by 1 every 10 in-game minutes.
// Plague slowly eats health: at a full plague (100%) health falls by 1 every 4 in-game minutes,
// and proportionally less at lower plague levels.
// Once food hits 0, health also falls by 1 every in-game minute.
const FOOD_DRAIN_PER_MINUTE = 1 / 10;
const PLAGUE_HEALTH_DRAIN_AT_FULL = 1 / 4;
const STARVATION_HEALTH_DRAIN_PER_MINUTE = 1;

let lastDrainKey = "";

function drainResources(gameMinutes) {
  const foodBefore = resources.food;
  const foodLost = FOOD_DRAIN_PER_MINUTE * gameMinutes;
  resources.food = Math.max(0, foodBefore - foodLost);
  const starvingMinutes =
    foodBefore >= foodLost
      ? 0
      : gameMinutes - foodBefore / FOOD_DRAIN_PER_MINUTE;

  const plagueFraction = resources.plague / RESOURCE_BAR_MAX.plague;
  resources.health = Math.max(
    0,
    resources.health -
      PLAGUE_HEALTH_DRAIN_AT_FULL * plagueFraction * gameMinutes -
      STARVATION_HEALTH_DRAIN_PER_MINUTE * starvingMinutes,
  );
  const key = `${resources.food.toFixed(1)},${resources.health.toFixed(1)}`;
  if (key !== lastDrainKey) {
    lastDrainKey = key;
    updateResourceUI();
  }
}

// =====================================================================
// ---------- Boats ----------
// =====================================================================

const RADAR_RADIUS = 515;
const HARBOR_RADIUS = 75;
const SPAWN_DISTANCE = 495;
const LIGHT_REACH = 0.9; // fraction of the sector radius that actually lights a boat

// The three berths are the wedges between the white edges (at 0, 120, 240 deg),
// so their centres are at 60, 180 and 300 deg.
const BERTH_BEARINGS = [60, 180, 300];
const BERTH_RADIUS = 62;
const DOCK_ANIM_SECONDS = 1.2; // time a boat takes to slide into its berth
const MOOR_COUNTERCLOCKWISE = true; // moored boats face counterclockwise around the harbor
const berths = BERTH_BEARINGS.map(() => null); // the boat in each berth, or null

const SHAKE_HARBOR = { magnitude: 25, seconds: 0.6 }; // a boat hits the harbor
const SHAKE_SEA = { magnitude: 25, seconds: 0.6 }; // two boats collide at sea
const HARBOR_CRASH_HEALTH_LOSS = 30; // health points lost when a boat rams a occupied berth
const SEA_CRASH_HEALTH_LOSS = 10; // health points lost when two boats collide outside the harbor
const BROKE_HEALTH_LOSS = 10; // health points lost when you bring in a boat whose price you can't pay
const LEAVE_CLEAR_FACTOR = 1.5; // a departing boat heads straight out until this distance
const CRASH_HOLD_SECONDS = 1.2;
const CRASH_ANIM_SECONDS = 1;
const HIT_RADIUS_FACTOR = 0.7; // boats collide when closer than (sizeA + sizeB) * this

// The boat making generator 101
const BOAT_DEFAULTS = {
  name: "Boat",
  arrivalTime: "08:00",
  location: 0,
  heading: "harbor", // direction it is heading: degrees, or "harbor"
  speed: 40,
  turnRadius: 80,
  dockingTime: 10,
  departHeading: null, // heading when leaving (null = back out the way it came)

  // Radio messages ("NA" or "" = show nothing, leave the radio as it is)
  dialogueEnter: "NA", // when it appears on the radar
  dialogueDock: "NA", // when it docks
  dialogueCrash: "NA", // when it crashes
  dialogueBroke: "No coin? You've made us angry now.", // when it docks but you can't pay its price

  // How the boat reacts to your light:
  //   "obey"   - white pulls it towards the harbor, red pushes it away
  //   "ignore" - the light does nothing to it
  //   "toward" - either colour pulls it towards the harbor
  lightResponse: "obey",

  // A boat that steals from you
  // Applies to the pirates and Nauti Bouy (hehe i really like that name)
  plunders: false,

  // What happens when the boat reaches the harbor:
  //   "dock" - it berths normally
  //   "ram"  - it crashes into the harbor
  onHarbor: "dock",

  // Optional spawn control. The boat appears once arrivalTime has passed AND spawnWhen() returns
  // true; if spawnWhen() never does, it appears anyway at `latest` ("HH:MM").
  spawnWhen: null,
  latest: null,

  money: 0, // added to the harbor's resources when it docks
  food: 0, //   (positive = gives to the harbor, negative = takes from it)
  health: 0,
  plague: 0,
  color: "#9dffb5",
  size: 22,
};

const boats = [];

function addBoat(props = {}) {
  const b = {
    ...BOAT_DEFAULTS,
    ...props,
    // internal state (not meant to be set by hand)
    state: "waiting", // waiting -> sailing -> docking -> docked -> leaving -> gone (or crashed -> gone)
    x: 0,
    y: 0,
    h: 0,
    el: null,
    shipEl: null,
    spawnBearing: 0,
    berth: null, // berth it occupies once docked
    target: null, // berth it is heading for while docking
    dock: null,
    dockedUntil: 0,
    leaveHeading: 0,
    crashT: 0,
    tradeFailed: false, // true if it docked but you couldn't pay
  };
  if (props.dialogue !== undefined && props.dialogueEnter === undefined) {
    b.dialogueEnter = props.dialogue;
  }
  b.arrivalMinutes = parseTime(b.arrivalTime);
  if (b.arrivalMinutes < parseTime(CLOCK_START)) b.arrivalMinutes += 1440;
  b.latestMinutes = b.latest ? parseTime(b.latest) : Infinity;
  boats.push(b);
  return b;
}

const toRad = (d) => (d * Math.PI) / 180;
const wrap180 = (a) => (((((a % 360) + 360) % 360) + 180) % 360) - 180;

const bearingFromHarbor = (b) => (Math.atan2(b.x, -b.y) * 180) / Math.PI;
const bearingToHarbor = (b) => bearingFromHarbor(b) + 180;

// kind: "Enter" | "Dock" | "Crash" | "Broke"
function boatSays(b, kind) {
  return {
    name: b.name,
    text: b[`dialogue${kind}`],
  };
}

function spawnBoat(b) {
  let loc = typeof b.location === "function" ? b.location() : b.location;
  if (typeof loc === "number") loc = { bearing: loc };
  if (loc.x !== undefined) {
    b.x = loc.x;
    b.y = loc.y;
  } else {
    const d = loc.distance ?? SPAWN_DISTANCE;
    b.x = Math.sin(toRad(loc.bearing)) * d;
    b.y = -Math.cos(toRad(loc.bearing)) * d;
  }
  b.spawnBearing = bearingFromHarbor(b);
  b.h = b.heading === "harbor" ? bearingToHarbor(b) : b.heading;

  // el sits on the boat's position (the radar panel is 1080x1080, so centre = 540,540).
  // The triangle rotates inside it; the name label stays upright beside it.
  const el = document.createElement("div");
  Object.assign(el.style, {
    position: "absolute",
    left: "540px",
    top: "540px",
    width: "0",
    height: "0",
    zIndex: "5",
    pointerEvents: "none",
  });

  const ship = document.createElement("div");
  Object.assign(ship.style, {
    position: "absolute",
    width: `${b.size}px`,
    height: `${b.size * 1.4}px`,
    left: `${-b.size / 2}px`,
    top: `${-b.size * 0.7}px`,
    background: b.color,
    clipPath: "polygon(50% 0, 100% 100%, 0 100%)", // triangle pointing up
  });

  const label = document.createElement("div");
  label.textContent = b.name;
  Object.assign(label.style, {
    position: "absolute",
    left: `${b.size / 2 + 8}px`,
    top: "-9px",
    color: b.color,
    fontFamily: '"Nimbus Mono PS", "Courier New", monospace',
    fontSize: "16px",
    fontWeight: "700",
    lineHeight: "18px",
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
    textShadow: "0 0 8px #288255",
  });

  el.append(ship, label);
  radarEl.appendChild(el);
  b.el = el;
  b.shipEl = ship;
  b.state = "sailing";

  radioSay(boatSays(b, "Enter"));
}

// ---------- Boat trails ----------
// A boat leaves a small dot every TRAIL_SPACING px it travels; each dot fades out
// over TRAIL_LIFE_SECONDS and is then removed.
const TRAIL_SPACING = 24;
const TRAIL_LIFE_SECONDS = 5;
const TRAIL_DOT_SIZE = 6;
const TRAIL_START_OPACITY = 0.9;
const trailDots = []; // { el, age }

function dropTrailDot(b) {
  const el = document.createElement("div");
  Object.assign(el.style, {
    position: "absolute",
    left: "540px",
    top: "540px",
    width: `${TRAIL_DOT_SIZE}px`,
    height: `${TRAIL_DOT_SIZE}px`,
    marginLeft: `${-TRAIL_DOT_SIZE / 2}px`,
    marginTop: `${-TRAIL_DOT_SIZE / 2}px`,
    borderRadius: "50%",
    background: b.color,
    opacity: String(TRAIL_START_OPACITY),
    transform: `translate(${b.x}px, ${b.y}px)`,
    zIndex: "4",
    pointerEvents: "none",
  });
  radarEl.appendChild(el);
  trailDots.push({ el, age: 0 });
}

function updateTrails(dt) {
  for (let i = trailDots.length - 1; i >= 0; i--) {
    const d = trailDots[i];
    d.age += dt;
    const k = d.age / TRAIL_LIFE_SECONDS;
    if (k >= 1) {
      d.el.remove();
      trailDots.splice(i, 1);
    } else {
      d.el.style.opacity = String(TRAIL_START_OPACITY * (1 - k));
    }
  }
}

function drawBoat(b, lit) {
  // leave a dot behind once the boat has moved far enough from the last one
  if (b.trailX === undefined) {
    b.trailX = b.x;
    b.trailY = b.y;
  } else if (Math.hypot(b.x - b.trailX, b.y - b.trailY) >= TRAIL_SPACING) {
    dropTrailDot(b);
    b.trailX = b.x;
    b.trailY = b.y;
  }
  b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
  b.shipEl.style.transform = `rotate(${b.h}deg)`;
  b.shipEl.style.background =
    lit === "red" ? "#ff6257" : lit === "white" ? "#ffffff" : b.color;
}

function isLit(b) {
  const dist = Math.hypot(b.x, b.y);
  if (dist < 1 || dist > (lightDiameter / 2) * LIGHT_REACH) return false;
  const diff = Math.abs(wrap180(bearingFromHarbor(b) - angle));
  return diff <= SECTOR_SPAN / 2;
}

function steer(b, desired, dt) {
  const turnRate = (b.speed / b.turnRadius) * (180 / Math.PI); // deg/sec
  const maxStep = turnRate * dt;
  const diff = wrap180(desired - b.h);
  b.h += Math.max(-maxStep, Math.min(maxStep, diff));
}

// Heads for the berth nearest to where the boat is coming from - whether or
// not it is free. The occupancy check happens when the boat arrives.
function startDocking(b) {
  const bearing = bearingFromHarbor(b);
  let best = 0;
  let bestDiff = Infinity;
  BERTH_BEARINGS.forEach((berthBearing, i) => {
    const diff = Math.abs(wrap180(bearing - berthBearing));
    if (diff < bestDiff) {
      best = i;
      bestDiff = diff;
    }
  });

  const tb = BERTH_BEARINGS[best];
  b.target = best;
  b.dock = {
    t: 0,
    fb: bearing, // bearing/radius/heading it starts from
    fr: Math.hypot(b.x, b.y),
    fh: b.h,
    tb, // bearing/radius/heading it ends at
    tr: BERTH_RADIUS,
    // moored along the harbor, bow pointing counterclockwise (or clockwise)
    th: tb + (MOOR_COUNTERCLOCKWISE ? -90 : 90),
  };
  b.state = "docking";
}

// Both boats are wrecked. atHarbor = a boat rammed an occupied berth (costs health).
function crashBoats(a, c, atHarbor) {
  const loss = atHarbor ? HARBOR_CRASH_HEALTH_LOSS : SEA_CRASH_HEALTH_LOSS;
  resources.health = Math.max(0, resources.health - loss);
  for (const x of [a, c]) {
    if (x.berth !== null) {
      berths[x.berth] = null;
      x.berth = null;
    }
    x.state = "crashed";
    x.crashT = 0;
    x.shipEl.style.background = "#ff6257";
  }
  shakeScreen(atHarbor ? SHAKE_HARBOR : SHAKE_SEA);
  // one boat's crash dialogue, then the other's
  radioSayCrash([boatSays(a, "Crash"), boatSays(c, "Crash")]);
  updateResourceUI();
}

// Boats at sea (not moored) that touch each other crash -> health loss.
const AT_SEA = ["sailing", "docking", "leaving"];

function detectCollisions() {
  for (let i = 0; i < boats.length; i++) {
    const a = boats[i];
    if (!AT_SEA.includes(a.state)) continue;
    for (let j = i + 1; j < boats.length; j++) {
      const c = boats[j];
      if (!AT_SEA.includes(c.state)) continue;
      if (
        Math.hypot(a.x - c.x, a.y - c.y) <
        (a.size + c.size) * HIT_RADIUS_FACTOR
      ) {
        crashBoats(a, c, false);
        break;
      }
    }
  }
}

// A boat that crashes into the harbor: its numbers hit the harbor and it is wrecked.
function ramHarbor(b) {
  applyBoatToHarbor(b);
  b.state = "crashed";
  b.crashT = 0;
  b.shipEl.style.background = "#ff6257";
  shakeScreen(SHAKE_HARBOR);
  radioSay(boatSays(b, "Crash"));
  updateResourceUI();
}

function updateBoats(dt) {
  for (const b of boats) {
    if (b.state === "gone") continue;

    if (b.state === "crashed") {
      b.crashT += dt;
      const k = (b.crashT - CRASH_HOLD_SECONDS) / CRASH_ANIM_SECONDS;
      if (k >= 1) {
        b.state = "gone";
        b.el.remove();
      } else if (k > 0) {
        b.el.style.opacity = String(1 - k);
      }
      continue;
    }

    if (b.state === "waiting") {
      if (gameTime < b.arrivalMinutes) continue;
      if (b.spawnWhen && gameTime < b.latestMinutes && !b.spawnWhen()) continue;
      spawnBoat(b);
    }

    if (b.state === "docked") {
      if (gameTime < b.dockedUntil) continue;
      // docking time is over: free the berth and head out
      berths[b.berth] = null;
      b.berth = null;
      b.leaveHeading = b.departHeading ?? b.spawnBearing;
      b.state = "leaving";
      updateResourceUI();
    }

    if (b.state === "docking") {
      const d = b.dock;
      d.t = Math.min(1, d.t + dt / DOCK_ANIM_SECONDS);
      const e = d.t * d.t * (3 - 2 * d.t); // smoothstep
      // glide around the harbor to the berth (shortest way round)
      const bearing = d.fb + wrap180(d.tb - d.fb) * e;
      const r = d.fr + (d.tr - d.fr) * e;
      b.x = Math.sin(toRad(bearing)) * r;
      b.y = -Math.cos(toRad(bearing)) * r;
      b.h = d.fh + wrap180(d.th - d.fh) * e;
      drawBoat(b, null);

      if (d.t >= 1) {
        const occupant = berths[b.target];
        if (occupant && occupant !== b) {
          crashBoats(b, occupant, true); // berth already taken
        } else {
          berths[b.target] = b;
          b.berth = b.target;
          b.state = "docked";
          b.dockedUntil = gameTime + b.dockingTime;
          // Can't pay? Then nothing changes hands and the crew is furious.
          const broke =
            !b.plunders && b.money < 0 && resources.money < -b.money;
          if (broke) {
            b.tradeFailed = true;
            resources.health = Math.max(
              0,
              resources.health - BROKE_HEALTH_LOSS,
            );
            // goods are not trades, but the plague number still affects you
            if (b.plague > 0) {
              resources.plague = Math.min(
                RESOURCE_CAP.plague,
                resources.plague + b.plague,
              );
            }
          } else {
            applyBoatToHarbor(b);
          }
          updateResourceUI();
          radioSay(boatSays(b, broke ? "Broke" : "Dock"));
        }
      }
      continue;
    }

    // sailing or leaving.
    // A boat that is leaving only reacts to RED light, which pushes it straight out to sea
    let lit = null;
    const reacts =
      b.lightResponse !== "ignore" &&
      (b.state === "sailing" || (b.state === "leaving" && isRed)) &&
      isLit(b);
    if (reacts) {
      lit = isRed ? "red" : "white";
      const toHarbor = bearingToHarbor(b);
      // "obey": white pulls it in, red pushes it away. "toward": either colour pulls it in.
      const pulled =
        b.state === "sailing" && (b.lightResponse === "toward" || !isRed);
      steer(b, pulled ? toHarbor : toHarbor + 180, dt);
    } else if (b.state === "leaving") {
      // First sail straight out from the harbor so the turn happens well clear
      // of it, then swing onto the departure heading.
      const clear = BERTH_RADIUS + b.turnRadius * LEAVE_CLEAR_FACTOR;
      const outward = bearingFromHarbor(b);
      steer(b, Math.hypot(b.x, b.y) < clear ? outward : b.leaveHeading, dt);
    }

    b.x += Math.sin(toRad(b.h)) * b.speed * dt;
    b.y -= Math.cos(toRad(b.h)) * b.speed * dt;

    const dist = Math.hypot(b.x, b.y);

    if (b.state === "sailing" && dist <= HARBOR_RADIUS) {
      if (b.onHarbor === "ram") {
        ramHarbor(b);
        continue;
      }
      startDocking(b);
      drawBoat(b, null);
      continue;
    }
    if (dist > RADAR_RADIUS) {
      b.state = "gone";
      b.el.remove();
      continue;
    }

    drawBoat(b, lit);
  }

  detectCollisions();
}

// =====================================================================
// ---------- Screen shake ----------
// =====================================================================
const containerEl = document.getElementById("container");
let shakeMagnitude = 0;
let shakeSeconds = 0;
let shakeLeft = 0;

function shakeScreen({ magnitude, seconds }) {
  // a bigger shake replaces a smaller one that is still running
  const remaining =
    shakeSeconds > 0 ? shakeMagnitude * (shakeLeft / shakeSeconds) : 0;
  if (magnitude < remaining) return;
  shakeMagnitude = magnitude;
  shakeSeconds = seconds;
  shakeLeft = seconds;
}

function updateShake(dt) {
  if (shakeLeft <= 0) return;
  shakeLeft = Math.max(0, shakeLeft - dt);
  const strength = shakeMagnitude * (shakeLeft / shakeSeconds);
  const dx = (Math.random() * 2 - 1) * strength;
  const dy = (Math.random() * 2 - 1) * strength;
  containerEl.style.translate = shakeLeft > 0 ? `${dx}px ${dy}px` : "";
}

// =====================================================================
// ---------- Game flow: start, game over, end of night ----------
// =====================================================================

function setBeamOpacity(v) {
  document
    .getElementById("beam")
    .style.setProperty("opacity", String(v), "important");
}

let gameStarted = false; // false until the START button is clicked
let gameOver = false;
let endTimeFired = false;
const END_TIME = "22:50"; // onEndTime() fires once when the clock reaches this

function onGameOver() {
  shakeScreen(SHAKE_HARBOR);
  setTimeout(() => {
    let glass = document.getElementById("glass");
    glass.style.opacity = 1;
    playSound(crack, true);

    setTimeout(() => {
      let overScreen = document.getElementById("over-screen");
      overScreen.style.display = "flex";
      overScreen.style.animation = "fadeIn 1s ease-in-out forwards";
      glass.style.animation = "fadeIn 1s ease-in-out reverse forwards";
      setBeamOpacity(1);
    }, 2000);
  }, 2000);
}

function onEndTime() {
  shakeScreen(SHAKE_HARBOR);
  setTimeout(() => {
    shakeScreen({ magnitude: 40, seconds: 1 });
    setTimeout(() => {
      shakeScreen({ magnitude: 40, seconds: 3 });
      setTimeout(() => {
        gameOver = true;
        containerEl.style.translate = "";
        containerEl.classList.add("frozen");
        if (radioTyped) radioTyped.stop();
        setTimeout(() => {
          let glass = document.getElementById("glass");
          glass.style.opacity = 1;
          playSound(crack, true);

          setTimeout(() => {
            document.getElementById("over-title").innerHTML = "THE END";
            document.getElementById("over-button").innerHTML = "PLAY AGAIN";
            let overScreen = document.getElementById("over-screen");
            overScreen.style.display = "flex";
            overScreen.style.animation = "fadeIn 1s ease-in-out forwards";
            glass.style.animation = "fadeIn 1s ease-in-out reverse forwards";
            setBeamOpacity(1);
          }, 2000);
        }, 2000);
      }, 4500);
    }, 7000);
  }, 6000);
}

function triggerGameOver() {
  gameOver = true;
  containerEl.style.translate = "";
  containerEl.classList.add("frozen");
  if (radioTyped) radioTyped.stop(); // stop the radio mid-word
  onGameOver();
}

const startScreenEl = document.getElementById("start-screen");
const startButtonEl = document.getElementById("start-button");
startButtonEl.addEventListener("click", () => {
  startScreenEl.classList.add("hidden");
  setBeamOpacity(0);
  startButtonEl.blur();
  gameStarted = true;
  playSound(bgm);
  last = performance.now(); // don't count the time spent on the start screen
});

document.getElementById("over-button").addEventListener("click", () => {
  location.reload();
});

// ---------- Startup ----------
initResourceUI();
radioTextEl.textContent = "";
showStandbyCursor();

let last = performance.now();
function tick(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;

  if (!gameStarted || gameOver) {
    // the game is frozen, but the screen shake must keep playing (game over / THE END)
    if (gameStarted) updateShake(dt);
    requestAnimationFrame(tick);
    return;
  }

  gameTime += dt * GAME_MINUTES_PER_SECOND;
  drainResources(dt * GAME_MINUTES_PER_SECOND);
  updateClock();
  updateBoats(dt);
  updateTrails(dt);
  updateRadio(dt);
  updateShake(dt);

  if (!endTimeFired && gameTime >= parseTime(END_TIME)) {
    endTimeFired = true;
    onEndTime();
  }
  // once the ending has started, health hitting 0 must not start the gameOver sequence
  if (resources.health <= 0 && !endTimeFired) {
    triggerGameOver();
    requestAnimationFrame(tick);
    return;
  }

  if (keys.has("ArrowLeft")) setAngle(angle - TURN_SPEED * dt);
  if (keys.has("ArrowRight")) setAngle(angle + TURN_SPEED * dt);
  if (keys.has("ArrowUp")) setSliderTop(sliderTop - SLIDER_SPEED * dt);
  if (keys.has("ArrowDown")) setSliderTop(sliderTop + SLIDER_SPEED * dt);

  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

render();
