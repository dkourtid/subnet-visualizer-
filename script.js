
let subnetStates = [];
let subnetDetails = [];
let bitElements = [];
let subnetBitsElements = [];

let timer = null;
let currentIndex = -1;
let borrowedBits = 0;
let newCidr = 0;
let animationToken = 0;

const ANIMATION_SPEED = 3500;

/* ---------------- IP UTILITIES ---------------- */

function ipToInt(ip) {
  return ip.split(".")
    .reduce((a, b) => a * 256 + Number(b), 0);
}

function intToIp(num) {
  return [
    Math.floor(num / 16777216) % 256,
    Math.floor(num / 65536) % 256,
    Math.floor(num / 256) % 256,
    num % 256
  ].join(".");
}

function intToBinary(num) {
  return [
    Math.floor(num / 16777216) % 256,
    Math.floor(num / 65536) % 256,
    Math.floor(num / 256) % 256,
    num % 256
  ].map(x => x.toString(2).padStart(8, "0")).join("");
}

function ipToBinary(ip) {
  return ip.split(".")
    .map(x => Number(x).toString(2).padStart(8, "0"))
    .join("");
}

/* ---------------- VALIDATION ---------------- */

function validIP(ip) {
  const parts = ip.split(".");

  return parts.length === 4 &&
    parts.every(x =>
      /^\d+$/.test(x) &&
      Number(x) >= 0 &&
      Number(x) <= 255
    );
}

/* ---------------- STOP ANIMATION ---------------- */

function stopAnimation() {
  clearInterval(timer);
  timer = null;

  document.getElementById("playBtn").innerText = "▶ Play";
}

/* ---------------- START ---------------- */

function start() {

  stopAnimation();
  animationToken++;

  const ip = document.getElementById("ip").value.trim();
  const base = Number(document.getElementById("baseCidr").value);

  const mode = document.querySelector(
    'input[name="mode"]:checked'
  ).value;

  if (!validIP(ip)) {
    alert("Μη έγκυρη IP διεύθυνση!");
    return;
  }

  if (!Number.isInteger(base) || base < 0 || base > 30) {
    alert("Το CIDR πρέπει να είναι από 0 έως 30.");
    return;
  }

  let count;

  if (mode === "subnets") {

    const requested = Number(
      document.getElementById("subnetCount").value
    );

    if (!Number.isInteger(requested) || requested < 1) {
      alert("Βάλε έγκυρο αριθμό υποδικτύων.");
      return;
    }

    borrowedBits = Math.ceil(Math.log2(requested));

    newCidr = base + borrowedBits;

  } else {

    const hosts = Number(
      document.getElementById("hostCount").value
    );

    if (!Number.isInteger(hosts) || hosts < 1) {
      alert("Βάλε έγκυρο αριθμό υπολογιστών.");
      return;
    }

    const neededBits = Math.max(
      2,
      Math.ceil(Math.log2(hosts + 2))
    );

    newCidr = 32 - neededBits;

    borrowedBits = newCidr - base;
  }

  if (newCidr < base || newCidr > 30) {
    alert("Δεν επαρκεί το αρχικό δίκτυο για αυτή την επιλογή.");
    return;
  }

  count = 2 ** borrowedBits;

  if (count > 512) {
    alert("Για λόγους εμφάνισης, επίλεξε έως 512 υποδίκτυα.");
    return;
  }

  const ipInt = ipToInt(ip);

  const baseBlock = 2 ** (32 - base);

  // Εύρεση του πραγματικού αρχικού network address
  const networkStart =
    Math.floor(ipInt / baseBlock) * baseBlock;

  document.getElementById("info").innerText =
    `Νέο CIDR: /${newCidr} | Borrowed bits: ${borrowedBits} | Σύνολο υποδικτύων: ${count}`;

  currentIndex = -1;

  buildBinary(networkStart, base);

  generateSubnets(networkStart);

  // Εμφάνιση πρώτου υποδικτύου
  showSubnet(0);
}

/* ---------------- BINARY VIEW ---------------- */

function buildBinary(ipInt, base) {

  const div = document.getElementById("bits");

  div.innerHTML = "";

  bitElements = [];
  subnetBitsElements = [];

  const bin = intToBinary(ipInt);

  for (let i = 0; i < 32; i++) {

    const span = document.createElement("span");

    span.textContent = bin[i];
    span.className = "bit";

    if (i < base) {

      span.classList.add("network");

    } else if (i < base + borrowedBits) {

      span.classList.add("subnet");

      subnetBitsElements.push(span);

    } else {

      span.classList.add("host");

    }

    bitElements.push(span);

    div.appendChild(span);

    // Διαχωρισμός bytes
    if ((i + 1) % 8 === 0 && i !== 31) {

      const dot = document.createElement("span");

      dot.textContent = ".";
      dot.className = "dot";

      div.appendChild(dot);
    }
  }
}

/* ---------------- GENERATE SUBNETS ---------------- */

function generateSubnets(networkStart) {

  subnetStates = [];
  subnetDetails = [];

  const tbody = document.querySelector("#table tbody");

  tbody.innerHTML = "";

  const hostBits = 32 - newCidr;

  const block = 2 ** hostBits;

  const total = 2 ** borrowedBits;

  for (let i = 0; i < total; i++) {

    const net = networkStart + i * block;

    const broadcast = net + block - 1;

    const first = net + 1;

    const last = broadcast - 1;

    const binary = intToBinary(net);

    subnetStates.push(binary);

    subnetDetails.push({
      index: i,
      network: intToIp(net),
      first: intToIp(first),
      last: intToIp(last),
      broadcast: intToIp(broadcast),
      counter: i.toString(2).padStart(borrowedBits, "0")
    });

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${i}</td>
      <td>${intToIp(net)}</td>
      <td>${intToIp(first)}</td>
      <td>${intToIp(last)}</td>
      <td>${intToIp(broadcast)}</td>
    `;

    tbody.appendChild(row);
  }
}

/* ---------------- HIGHLIGHT ROW ---------------- */

function highlightRow(index) {

  const rows = document.querySelectorAll(
    "#table tbody tr"
  );

  rows.forEach(row => {
    row.classList.remove("activeRow");
  });

  if (rows[index]) {
    rows[index].classList.add("activeRow");

    rows[index].scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }
}

/* ---------------- SHOW SUBNET ---------------- */

function showSubnet(index) {

  if (!subnetStates.length) return;

  animationToken++;

  const token = animationToken;

  currentIndex = index;

  const state = subnetStates[index];

  const details = subnetDetails[index];

  const base = Number(
    document.getElementById("baseCidr").value
  );

  // Ενημέρωση όλων των bits.
  // Τα subnet bits θα αλλάζουν σταδιακά.

  bitElements.forEach((el, i) => {

    if (i < base || i >= base + borrowedBits) {
      el.textContent = state[i];
    }

  });

  // Animated subnet counter: δεξιά προς αριστερά

  let delay = 0;

  for (let i = subnetBitsElements.length - 1; i >= 0; i--) {

    const el = subnetBitsElements[i];

    const pos = base + i;

    setTimeout(() => {

      if (token !== animationToken) return;

      el.classList.add("flip");

      el.textContent = state[pos];

      setTimeout(() => {

        if (token !== animationToken) return;

        el.classList.remove("flip");

      }, 250);

    }, delay);

    delay += 100;
  }

  // Highlight table
  highlightRow(index);

  // Subnet information

  document.getElementById("subnetTitle").innerText =
    `Υποδίκτυο ${index + 1}`;

  document.getElementById("subnetCounter").innerText =
    details.counter || "0";

  document.getElementById("subnetProgress").innerText =
    `${index + 1} από ${subnetStates.length} υποδίκτυα`;

  // Network address

  document.getElementById("networkAddress").innerText =
    details.network;

  // Broadcast address

  document.getElementById("broadcastAddress").innerText =
    details.broadcast;
}

/* ---------------- NEXT SUBNET ---------------- */

function nextSubnet() {

  if (!subnetStates.length) return;

  const next = (currentIndex + 1) % subnetStates.length;

  showSubnet(next);
}

/* ---------------- PLAY ---------------- */

function play() {

  if (!subnetStates.length || timer) return;

  document.getElementById("playBtn").innerText = "▶ Playing...";

  timer = setInterval(() => {

    nextSubnet();

  }, ANIMATION_SPEED);
}

/* ---------------- PAUSE ---------------- */

function pause() {

  stopAnimation();
}

/* ---------------- RESET ---------------- */

function reset() {

  stopAnimation();

  if (!subnetStates.length) return;

  showSubnet(0);
}

/* ---------------- EVENTS ---------------- */

document.getElementById("startBtn")
  .addEventListener("click", start);

document.getElementById("playBtn")
  .addEventListener("click", play);

document.getElementById("nextBtn")
  .addEventListener("click", nextSubnet);

document.getElementById("pauseBtn")
  .addEventListener("click", pause);

document.getElementById("resetBtn")
  .addEventListener("click", reset);

// Αρχική εκτέλεση
start();
