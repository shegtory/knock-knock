const transcript = document.querySelector("#transcript");
const prompt = document.querySelector("#prompt");
const command = document.querySelector("#command");
const reveal = document.querySelector("#reveal");
const canvas = document.querySelector("#logo-canvas");
const status = document.querySelector("#status");
const ctx = canvas.getContext("2d");

const exchanges = [
  "who is this?",
  "what is your question ?",
];

let stage = 0;
let locked = false;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function resizeInput() {
  command.style.width = `${Math.max(1, command.value.length + 0.35)}ch`;
}

function appendLine(text, type) {
  const line = document.createElement("div");
  line.className = `line ${type}`;
  line.textContent = text;
  transcript.append(line);
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  return line;
}

async function typeSystem(text) {
  const line = appendLine("", "system");
  for (const character of text) {
    line.textContent += character;
    await delay(38 + Math.random() * 48);
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  if (locked || !command.value.trim()) return;

  const value = command.value.trim();
  appendLine(value, "user");
  command.value = "";
  resizeInput();
  locked = true;
  prompt.classList.add("busy");

  if (stage < exchanges.length) {
    await delay(430 + Math.random() * 320);
    await typeSystem(exchanges[stage]);
    stage += 1;
    locked = false;
    prompt.classList.remove("busy");
    command.focus();
    return;
  }

  stage += 1;
  status.textContent = "Processing.";
  await delay(2700);
  await buildLogo();
  status.textContent = "Ledger logo complete.";
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

async function buildLogo() {
  canvas.width = 788;
  canvas.height = 351;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  reveal.classList.add("active");

  const tile = 9;
  const mask = document.createElement("canvas");
  mask.width = canvas.width;
  mask.height = canvas.height;
  const maskCtx = mask.getContext("2d");
  maskCtx.fillStyle = "#fff";
  maskCtx.lineWidth = 28;
  maskCtx.lineCap = "square";
  maskCtx.beginPath();
  maskCtx.moveTo(49, 104); maskCtx.lineTo(49, 49); maskCtx.lineTo(139, 49);
  maskCtx.moveTo(649, 49); maskCtx.lineTo(739, 49); maskCtx.lineTo(739, 104);
  maskCtx.moveTo(49, 247); maskCtx.lineTo(49, 302); maskCtx.lineTo(139, 302);
  maskCtx.moveTo(649, 302); maskCtx.lineTo(739, 302); maskCtx.lineTo(739, 247);
  maskCtx.stroke();

  maskCtx.font = "400 116px Arial, Helvetica, sans-serif";
  maskCtx.textAlign = "center";
  maskCtx.textBaseline = "middle";
  maskCtx.fillText("LEDGER", 394, 181);
  const pixels = maskCtx.getImageData(0, 0, canvas.width, canvas.height).data;
  const blocks = [];
  const blockKeys = new Set();

  function addBlock(x, y) {
    const key = `${x}:${y}`;
    if (!blockKeys.has(key)) {
      blockKeys.add(key);
      blocks.push({ x, y });
    }
  }

  function addBar(x1, y1, x2, y2) {
    for (let y = y1; y <= y2; y += tile) {
      for (let x = x1; x <= x2; x += tile) addBlock(x, y);
    }
  }

  for (let y = 0; y < canvas.height; y += tile) {
    for (let x = 0; x < canvas.width; x += tile) {
      const px = Math.min(canvas.width - 1, x + Math.floor(tile / 2));
      const py = Math.min(canvas.height - 1, y + Math.floor(tile / 2));
      const index = (py * canvas.width + px) * 4;
      if (pixels[index] > 95) addBlock(x, y);
    }
  }

  // Keep the four Ledger corner marks bold in the code-cell treatment.
  addBar(45, 45, 153, 63);   addBar(45, 45, 63, 126);
  addBar(639, 45, 747, 63);  addBar(729, 45, 747, 126);
  addBar(45, 288, 153, 306); addBar(45, 225, 63, 306);
  addBar(639, 288, 747, 306); addBar(729, 225, 747, 306);

  shuffle(blocks);
  const batchSize = Math.max(1, Math.ceil(blocks.length / 150));

  for (let i = 0; i < blocks.length; i += batchSize) {
    const batch = blocks.slice(i, i + batchSize);
    for (const block of batch) {
      ctx.fillStyle = Math.random() > 0.72 ? "#777" : "#f7f7f7";
      ctx.font = `${tile - 1}px monospace`;
      ctx.fillText(Math.random() > 0.5 ? "1" : "0", block.x, block.y + tile);
    }
    await delay(28 + Math.random() * 28);
  }
  await delay(250);
  prompt.remove();
}

prompt.addEventListener("submit", handleSubmit);
command.addEventListener("input", resizeInput);
document.addEventListener("pointerdown", () => {
  if (!locked) command.focus();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && stage > 2) window.location.reload();
  if (!locked && document.activeElement !== command) command.focus();
});

resizeInput();
command.focus();

