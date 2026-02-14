const modalBackdrop = document.getElementById("modalBackdrop");
const mainContent = document.getElementById("mainContent");
const worthyBtn = document.getElementById("worthyBtn");
const closeModal = document.getElementById("closeModal");
const statusText = document.getElementById("statusText");
const heartCountEl = document.getElementById("heartCount");
const failBackdrop = document.getElementById("failBackdrop");
const retryBtn = document.getElementById("retryBtn");
const introTextEl = document.getElementById("introText");
const heartBackdrop = document.getElementById("heartBackdrop");
const heartStart = document.getElementById("heartStart");
const bgMusic = document.getElementById("bgMusic");
const faahAudio = document.getElementById("faahAudio");
const ouchAudio = document.getElementById("ouchAudio");
const buttonClickAudio = document.getElementById("buttonClickAudio");
const gameSelectAudio = document.getElementById("gameSelectAudio");
const heartPointAudio = document.getElementById("heartPointAudio");
const soundToggle = document.getElementById("soundToggle");
const typingLetterEl = document.getElementById("typingLetter");
const typingInputEl = document.getElementById("typingInput");
const typingAccuracyEl = document.getElementById("typingAccuracy");
const typingWpmEl = document.getElementById("typingWpm");
const typingProgressCurrentEl = document.getElementById("typingProgressCurrent");
const typingProgressTotalEl = document.getElementById("typingProgressTotal");
const typingResetBtn = document.getElementById("typingReset");
const typingBackdrop = document.getElementById("typingBackdrop");
const typingDismiss = document.getElementById("typingDismiss");
const typingFailBackdrop = document.getElementById("typingFailBackdrop");
const typingRetryBtn = document.getElementById("typingRetryBtn");
const catchWinBackdrop = document.getElementById("catchWinBackdrop");
const catchWinDismiss = document.getElementById("catchWinDismiss");
const finalBackdrop = document.getElementById("finalBackdrop");
const finalPlayBtn = document.getElementById("finalPlay");
const videoBackdrop = document.getElementById("videoBackdrop");
const valentineVideo = document.getElementById("valentineVideo");
const videoDismiss = document.getElementById("videoDismiss");
const puzzleBoard = document.getElementById("puzzleBoard");
const puzzleShuffleBtn = document.getElementById("puzzleShuffle");
const puzzleMovesEl = document.getElementById("puzzleMoves");
const puzzleWinBackdrop = document.getElementById("puzzleWinBackdrop");
const puzzleDismissBtn = document.getElementById("puzzleDismiss");
const levelButtons = document.querySelectorAll(".level-btn[data-target]");
const gameCards = document.querySelectorAll(".game-card");

const showMain = () => {
  modalBackdrop.style.display = "none";
  mainContent.classList.add("show");
  requestAnimationFrame(resizeAllCanvases);
};

worthyBtn.addEventListener("click", showMain);

closeModal.addEventListener("click", () => {
  statusText.textContent = "Gayyyyyy";
});

const showFailModal = () => {
  failBackdrop.classList.remove("hidden");
};

const showTypingModal = () => {
  if (typingBackdrop) {
    typingBackdrop.classList.remove("hidden");
  }
};

if (typingDismiss) {
  typingDismiss.addEventListener("click", () => {
    typingBackdrop.classList.add("hidden");
  });
}

let resetTypingGame = null;
if (typingRetryBtn) {
  typingRetryBtn.addEventListener("click", () => {
    if (typeof resetTypingGame === "function") {
      resetTypingGame();
    }
    if (typingFailBackdrop) {
      typingFailBackdrop.classList.add("hidden");
    }
  });
}

const typeSound = new Audio("keyboard.mp3");
typeSound.volume = 0.5;
typeSound.loop = true;
let typeSoundUnlocked = false;
let typeSoundActive = false;

const unlockTypeSound = () => {
  typeSoundUnlocked = true;
};

document.addEventListener("click", unlockTypeSound, { once: true });
document.addEventListener("keydown", unlockTypeSound, { once: true });

const playTypeSoundOnce = () => {
  if (!typeSoundUnlocked) {
    return;
  }
  typeSound.currentTime = 0;
  typeSound.play().catch(() => {});
};

const runTypewriter = (element) => {
  if (!element) {
    return;
  }
  typeSoundActive = true;
  const fullText = element.dataset.fulltext || element.textContent || "";
  element.textContent = "";
  let index = 0;
  const tick = () => {
    if (index >= fullText.length) {
      typeSoundActive = false;
      if (typeSoundUnlocked) {
        typeSound.pause();
        typeSound.currentTime = 0;
      }
      return;
    }
    element.textContent += fullText[index];
    index += 1;
    const delay = 22 + Math.random() * 28;
    setTimeout(tick, delay);
  };
  tick();
};

const showIntroModal = () => {
  if (heartBackdrop) {
    heartBackdrop.classList.add("hidden");
  }
  if (modalBackdrop) {
    modalBackdrop.classList.remove("hidden");
  }
  playTypeSoundOnce();
};

const tryStartMusic = (unmute = false) => {
  if (!bgMusic) {
    return;
  }
  if (unmute) {
    bgMusic.muted = false;
    bgMusic.volume = 0.6;
  }
  bgMusic.play().catch(() => {});
};

if (heartStart) {
  heartStart.addEventListener("click", () => {
    tryStartMusic(true);
    showIntroModal();
    typeSound
      .play()
      .then(() => {
        unlockTypeSound();
        runTypewriter(introTextEl);
      })
      .catch(() => {
        unlockTypeSound();
        runTypewriter(introTextEl);
      });
  });
}

if (soundToggle) {
  const updateIcon = () => {
    soundToggle.textContent = bgMusic && !bgMusic.muted ? "🔊" : "🔇";
  };
  updateIcon();
  soundToggle.addEventListener("click", () => {
    if (!bgMusic) {
      return;
    }
    if (bgMusic.muted) {
      tryStartMusic(true);
    } else {
      bgMusic.muted = true;
      updateIcon();
    }
    updateIcon();
  });
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || !buttonClickAudio) {
    return;
  }
  buttonClickAudio.currentTime = 0;
  buttonClickAudio.play().catch(() => {});
});

const setupTypingGame = () => {
  if (!typingLetterEl || !typingInputEl) {
    return;
  }
  const rawText = typingLetterEl.textContent.trim().replace(/\s+/g, " ");
  const words = rawText.split(" ");
  typingLetterEl.innerHTML = words
    .map((word) => `<span>${word}</span>`)
    .join(" ");

  const letterSpans = Array.from(typingLetterEl.querySelectorAll("span"));
  const totalWords = letterSpans.length;
  typingProgressTotalEl.textContent = String(totalWords);
  let typingStartTime = null;
  let lastCorrectCount = 0;
  let lastIncorrectCount = 0;
  let typingFailed = false;
  let wpmTimerId = null;

  const updateTyping = () => {
    if (typingFailed) {
      return;
    }
    const inputWords = typingInputEl.value
      .trim()
      .replace(/\s+/g, " ")
      .split(" ")
      .filter(Boolean);

    if (!typingStartTime && inputWords.length > 0) {
      typingStartTime = Date.now();
      wpmTimerId = setInterval(() => {
        const minutes = (Date.now() - typingStartTime) / 60000;
        const totalTyped = typingInputEl.value
          .trim()
          .replace(/\s+/g, " ")
          .split(" ")
          .filter(Boolean).length;
        const wpm = minutes > 0 ? Math.round(totalTyped / minutes) : 0;
        typingWpmEl.textContent = String(wpm);
        if (totalTyped > 0 && wpm < 50 && !typingFailed) {
          typingFailed = true;
          typingInputEl.disabled = true;
          clearInterval(wpmTimerId);
          if (typingFailBackdrop) {
            typingFailBackdrop.classList.remove("hidden");
          }
        }
      }, 1000);
    }

    let correct = 0;
    let incorrect = 0;
    letterSpans.forEach((span, index) => {
      const typed = inputWords[index];
      span.classList.remove("correct", "incorrect");
      if (typed === undefined) {
        return;
      }
      if (typed === span.textContent) {
        span.classList.add("correct");
        correct += 1;
      } else {
        span.classList.add("incorrect");
        incorrect += 1;
      }
    });

    const totalTyped = inputWords.length;
    const accuracy =
      totalTyped === 0 ? 0 : Math.round((correct / totalTyped) * 100);
    typingAccuracyEl.textContent = String(accuracy);

    if (correct > lastCorrectCount) {
      addGameHearts("typing", correct - lastCorrectCount);
      lastCorrectCount = correct;
    }

    if (incorrect > lastIncorrectCount) {
      addHearts(-(incorrect - lastIncorrectCount));
      lastIncorrectCount = incorrect;
    }

    typingProgressCurrentEl.textContent = String(
      Math.min(totalTyped, totalWords)
    );

    if (typingStartTime) {
      const minutes = (Date.now() - typingStartTime) / 60000;
      const wpm = minutes > 0 ? Math.round(totalTyped / minutes) : 0;
      typingWpmEl.textContent = String(wpm);
    } else {
      typingWpmEl.textContent = "0";
    }
  };

  typingInputEl.addEventListener("input", updateTyping);

  const doResetTyping = () => {
    if (typingHeartsEarned > 0) {
      addHearts(-typingHeartsEarned);
      typingHeartsEarned = 0;
    }
    typingInputEl.value = "";
    typingInputEl.disabled = false;
    typingAccuracyEl.textContent = "0";
    typingWpmEl.textContent = "0";
    typingProgressCurrentEl.textContent = "0";
    typingStartTime = null;
    lastCorrectCount = 0;
    lastIncorrectCount = 0;
    typingFailed = false;
    if (wpmTimerId) {
      clearInterval(wpmTimerId);
      wpmTimerId = null;
    }
    letterSpans.forEach((span) => span.classList.remove("correct", "incorrect"));
  };

  typingResetBtn.addEventListener("click", doResetTyping);
  resetTypingGame = doResetTyping;
};

setupTypingGame();

const setupPuzzleGame = () => {
  if (!puzzleBoard) {
    return;
  }
  const size = 4;
  const imageUrl = "puzzle-image.jpg";
  let tiles = [];
  let moves = 0;
  let solved = false;
  let rewarded = false;

  const buildSolved = () => {
    tiles = [];
    for (let i = 0; i < size * size - 1; i += 1) {
      tiles.push(i);
    }
    tiles.push(null);
  };

  const indexToPos = (index) => ({
    row: Math.floor(index / size),
    col: index % size,
  });

  const posToIndex = (row, col) => row * size + col;

  const isAdjacent = (aIndex, bIndex) => {
    const a = indexToPos(aIndex);
    const b = indexToPos(bIndex);
    const dr = Math.abs(a.row - b.row);
    const dc = Math.abs(a.col - b.col);
    return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
  };

  const render = () => {
    puzzleBoard.innerHTML = "";
    tiles.forEach((value, index) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "puzzle-tile";
      if (value === null) {
        tile.classList.add("blank");
      } else {
        const { row, col } = indexToPos(value);
        tile.style.backgroundImage = `url(${imageUrl})`;
        tile.style.backgroundPosition = `${(col / (size - 1)) * 100}% ${
          (row / (size - 1)) * 100
        }%`;
      }
      tile.addEventListener("click", () => {
        const blankIndex = tiles.indexOf(null);
        if (value !== null && isAdjacent(index, blankIndex)) {
          tiles[blankIndex] = value;
          tiles[index] = null;
          moves += 1;
          puzzleMovesEl.textContent = String(moves);
          render();
          if (isSolved()) {
            solved = true;
            if (!rewarded) {
              rewarded = true;
              addGameHearts("puzzle", 25);
            }
            if (puzzleWinBackdrop) {
              puzzleWinBackdrop.classList.remove("hidden");
            }
          }
        }
      });
      puzzleBoard.appendChild(tile);
    });
  };

  const isSolved = () =>
    tiles.every((value, index) =>
      value === null ? index === tiles.length - 1 : value === index
    );

  const shuffle = () => {
    for (let i = 0; i < 200; i += 1) {
      const blankIndex = tiles.indexOf(null);
      const { row, col } = indexToPos(blankIndex);
      const neighbors = [
        { row: row - 1, col },
        { row: row + 1, col },
        { row, col: col - 1 },
        { row, col: col + 1 },
      ].filter(
        (pos) =>
          pos.row >= 0 &&
          pos.row < size &&
          pos.col >= 0 &&
          pos.col < size
      );
      const move = neighbors[Math.floor(Math.random() * neighbors.length)];
      const moveIndex = posToIndex(move.row, move.col);
      tiles[blankIndex] = tiles[moveIndex];
      tiles[moveIndex] = null;
    }
  };

  const resetPuzzle = () => {
    moves = 0;
    puzzleMovesEl.textContent = "0";
    solved = false;
    rewarded = false;
    buildSolved();
    render();
  };

  buildSolved();
  shuffle();
  render();

  puzzleShuffleBtn.addEventListener("click", () => {
    moves = 0;
    puzzleMovesEl.textContent = "0";
    solved = false;
    shuffle();
    render();
  });

  if (puzzleDismissBtn) {
    puzzleDismissBtn.addEventListener("click", () => {
      puzzleWinBackdrop.classList.add("hidden");
    });
  }

  // No secret input; reward on completion only.
};

setupPuzzleGame();

const GAME_DURATION_MS = 2 * 60 * 1000;
const CATCH_DURATION_MS = 70 * 1000;
let flappyTimerId = null;
let catchTimerId = null;

const handleGameTimeout = (gameKey) => {
  if (gameKey === "flappy") {
    game.running = false;
    game.crashed = true;
    draw();
  }
  if (gameKey === "catch") {
    catchGame.running = false;
    drawCatch();
  }
  if (heartCount < 100) {
    showFailModal();
  }
};

retryBtn.addEventListener("click", () => {
  resetCatch(true);
  failBackdrop.classList.add("hidden");
});

const showGame = (targetId) => {
  gameCards.forEach((card) => card.classList.remove("active"));
  const target = document.getElementById(targetId);
  if (target) {
    target.classList.add("active");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    requestAnimationFrame(resizeAllCanvases);
  }
  if (targetId === "game-typing") {
    showTypingModal();
  }
};

levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-target");
    if (targetId) {
      if (gameSelectAudio) {
        gameSelectAudio.currentTime = 0;
        gameSelectAudio.play().catch(() => {});
      }
      levelButtons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      showGame(targetId);
    }
  });
});

let heartCount = 0;
const addHearts = (amount = 1) => {
  heartCount = Math.max(0, heartCount + amount);
  heartCountEl.textContent = String(Math.round(heartCount));
  if (amount > 0 && heartPointAudio) {
    heartPointAudio.currentTime = 0;
    heartPointAudio.play().catch(() => {});
  }
  if (!finalShown && heartCount >= FINAL_HEART_GOAL && finalBackdrop) {
    finalShown = true;
    finalBackdrop.classList.remove("hidden");
  }
};

let flappyHeartsEarned = 0;
let catchHeartsEarned = 0;
let typingHeartsEarned = 0;
let puzzleHeartsEarned = 0;
const CATCH_HEART_LIMIT = 50;
const FINAL_HEART_GOAL = 100;
let finalShown = false;

const addGameHearts = (gameKey, amount) => {
  if (gameKey === "flappy") {
    flappyHeartsEarned += amount;
  } else if (gameKey === "catch") {
    catchHeartsEarned += amount;
  } else if (gameKey === "typing") {
    typingHeartsEarned += amount;
  } else if (gameKey === "puzzle") {
    puzzleHeartsEarned += amount;
  }
  addHearts(amount);
};

const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");
const flappySize = { width: 320, height: 480 };
const startBtn = document.getElementById("flappyStart");
const resetBtn = document.getElementById("flappyReset");
const scoreEl = document.getElementById("flappyScore");
const flappyDifficulty = document.getElementById("flappyDifficulty");
const flappyDifficultyLabel = document.getElementById("flappyDifficultyLabel");

const birdImage = new Image();
birdImage.src = "her-face.png";
let birdImageReady = false;
birdImage.onload = () => {
  birdImageReady = true;
};

const flappyBgImage = new Image();
flappyBgImage.src = "flappybg.png";
let flappyBgReady = false;
flappyBgImage.onload = () => {
  flappyBgReady = true;
};

const catchCharacterImage = new Image();
catchCharacterImage.src = "her-face.png";
let catchCharacterReady = false;
catchCharacterImage.onload = () => {
  catchCharacterReady = true;
};

const catchBgImage = new Image();
catchBgImage.src = "catchheartsbg.png";
let catchBgReady = false;
catchBgImage.onload = () => {
  catchBgReady = true;
};

const game = {
  running: false,
  crashed: false,
  lastTime: 0,
  spawnTimer: 0,
  score: 0,
  bird: { x: 80, y: 240, vy: 0, r: 18 },
  pipes: [],
};

const config = {
  gravity: 900,
  flapStrength: -320,
  pipeSpeed: 180,
  pipeGap: 150,
  pipeWidth: 54,
  pipeInterval: 1.6,
};

const difficultyNames = {
  1: "Easy",
  2: "Medium",
  3: "Pro Like Piyush",
};

const setFlappyDifficulty = (level) => {
  const value = Number(level);
  flappyDifficultyLabel.textContent = difficultyNames[value] || "Medium";
  if (value === 1) {
    config.gravity = 760;
    config.pipeSpeed = 150;
    config.pipeGap = 180;
    config.pipeInterval = 1.8;
  } else if (value === 3) {
    config.gravity = 980;
    config.pipeSpeed = 210;
    config.pipeGap = 135;
    config.pipeInterval = 1.35;
  } else {
    config.gravity = 900;
    config.pipeSpeed = 180;
    config.pipeGap = 150;
    config.pipeInterval = 1.6;
  }
};

const resetGame = (deductHearts = false) => {
  if (flappyTimerId) {
    clearTimeout(flappyTimerId);
    flappyTimerId = null;
  }
  if (deductHearts && flappyHeartsEarned > 0) {
    addHearts(-flappyHeartsEarned);
    flappyHeartsEarned = 0;
  }
  game.running = false;
  game.crashed = false;
  game.lastTime = 0;
  game.spawnTimer = 0;
  game.score = 0;
  game.bird = { x: 80, y: flappySize.height / 2, vy: 0, r: 32 };
  game.pipes = [];
  scoreEl.textContent = "0";
  draw();
};

const startGame = () => {
  if (game.running) {
    return;
  }
  game.running = true;
  game.crashed = false;
  game.lastTime = performance.now();
  requestAnimationFrame(loop);
};

const startFlappyWithTimer = () => {
  if (flappyTimerId) {
    clearTimeout(flappyTimerId);
  }
  startGame();
  flappyTimerId = setTimeout(() => handleGameTimeout("flappy"), GAME_DURATION_MS);
};

const flap = () => {
  if (!game.running) {
    startFlappyWithTimer();
  }
  game.bird.vy = config.flapStrength;
};

const spawnPipe = () => {
  const padding = 60;
  const gapCenter =
    padding + Math.random() * (flappySize.height - padding * 2);
  game.pipes.push({
    x: flappySize.width + 20,
    gapCenter,
    scored: false,
  });
};

const update = (delta) => {
  const bird = game.bird;
  bird.vy += config.gravity * delta;
  bird.y += bird.vy * delta;

  game.spawnTimer += delta;
  if (game.spawnTimer >= config.pipeInterval) {
    game.spawnTimer = 0;
    spawnPipe();
  }

  game.pipes.forEach((pipe) => {
    pipe.x -= config.pipeSpeed * delta;
  });
  game.pipes = game.pipes.filter((pipe) => pipe.x + config.pipeWidth > 0);

  if (bird.y - bird.r <= 0 || bird.y + bird.r >= flappySize.height) {
    crash();
  }

  for (const pipe of game.pipes) {
    const inXRange =
      bird.x + bird.r > pipe.x && bird.x - bird.r < pipe.x + config.pipeWidth;
    if (inXRange) {
      const gapTop = pipe.gapCenter - config.pipeGap / 2;
      const gapBottom = pipe.gapCenter + config.pipeGap / 2;
      if (bird.y - bird.r < gapTop || bird.y + bird.r > gapBottom) {
        if (ouchAudio) {
          ouchAudio.currentTime = 0;
          ouchAudio.play().catch(() => {});
        }
        crash();
      }
    }

    if (!pipe.scored && pipe.x + config.pipeWidth < bird.x - bird.r) {
      pipe.scored = true;
      game.score += 1;
      scoreEl.textContent = String(game.score);
      addGameHearts("flappy", 1);
    }
  }
};

const drawBird = () => {
  const { x, y, r } = game.bird;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  if (birdImageReady) {
    ctx.drawImage(birdImage, x - r, y - r, r * 2, r * 2);
  } else {
    ctx.fillStyle = "#ffb3d5";
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.fillStyle = "#8c3d5c";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("HER", x, y);
  }
  ctx.restore();
};

const drawPipes = () => {
  ctx.fillStyle = "#ff8cc1";
  for (const pipe of game.pipes) {
    const gapTop = pipe.gapCenter - config.pipeGap / 2;
    const gapBottom = pipe.gapCenter + config.pipeGap / 2;
    ctx.fillRect(pipe.x, 0, config.pipeWidth, gapTop);
    ctx.fillRect(
      pipe.x,
      gapBottom,
      config.pipeWidth,
      canvas.height - gapBottom
    );
  }
};

const draw = () => {
  ctx.clearRect(0, 0, flappySize.width, flappySize.height);
  if (flappyBgReady) {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.drawImage(flappyBgImage, 0, 0, flappySize.width, flappySize.height);
    ctx.restore();
  }
  drawPipes();
  drawBird();
  if (!game.running) {
    ctx.fillStyle = "#6b2c46";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      game.crashed ? "Game Over - Press Retry" : "Press Start or Tap",
      flappySize.width / 2,
      flappySize.height / 2
    );
  }
};

const crash = () => {
  if (!game.running) {
    return;
  }
  game.running = false;
  game.crashed = true;
  draw();
};

const loop = (time) => {
  if (!game.running) {
    return;
  }
  const delta = (time - game.lastTime) / 1000;
  game.lastTime = time;
  update(delta);
  draw();
  requestAnimationFrame(loop);
};

startBtn.addEventListener("click", startFlappyWithTimer);
resetBtn.addEventListener("click", () => resetGame(true));
canvas.addEventListener("click", flap);
document.addEventListener("keydown", (event) => {
  if (event.code !== "Space") {
    return;
  }
  const target = event.target;
  const isTypingField =
    target &&
    (target.tagName === "TEXTAREA" ||
      target.tagName === "INPUT" ||
      target.isContentEditable);
  if (isTypingField) {
    return;
  }
  event.preventDefault();
  flap();
});

resetGame();
setFlappyDifficulty(flappyDifficulty.value);
flappyDifficulty.addEventListener("input", (event) => {
  setFlappyDifficulty(event.target.value);
});

const catchCanvas = document.getElementById("catchCanvas");
const catchCtx = catchCanvas.getContext("2d");
const catchSize = { width: 360, height: 480 };
const catchStartBtn = document.getElementById("catchStart");
const catchResetBtn = document.getElementById("catchReset");
const catchScoreEl = document.getElementById("catchScore");
const catchDifficulty = document.getElementById("catchDifficulty");
const catchDifficultyLabel = document.getElementById("catchDifficultyLabel");

const catchGame = {
  running: false,
  lastTime: 0,
  score: 0,
  bowl: { x: catchSize.width / 2, y: catchSize.height - 40, w: 80, h: 20 },
  hearts: [],
  cacti: [],
  spawnTimer: 0,
  completed: false,
};

const catchConfig = {
  fallSpeed: 240,
  spawnInterval: 0.7,
  obstacleChance: 0.32,
  heartValue: 1,
};

const obstacleEmojis = ["🌵", "🖤", "🍆", "💔"];

const setCatchDifficulty = (level) => {
  const value = Number(level);
  catchDifficultyLabel.textContent = difficultyNames[value] || "Medium";
  if (value === 1) {
    catchConfig.fallSpeed = 210;
    catchConfig.spawnInterval = 0.85;
    catchConfig.obstacleChance = 0.2;
    catchConfig.heartValue = 1;
  } else if (value === 3) {
    catchConfig.fallSpeed = 360;
    catchConfig.spawnInterval = 0.5;
    catchConfig.obstacleChance = 0.55;
    catchConfig.heartValue = 1;
  } else {
    catchConfig.fallSpeed = 300;
    catchConfig.spawnInterval = 0.6;
    catchConfig.obstacleChance = 0.45;
    catchConfig.heartValue = 1;
  }
};

const resetCatch = (deductHearts = false) => {
  if (catchTimerId) {
    clearTimeout(catchTimerId);
    catchTimerId = null;
  }
  if (deductHearts && catchHeartsEarned > 0) {
    addHearts(-catchHeartsEarned);
    catchHeartsEarned = 0;
  }
  catchGame.running = false;
  catchGame.lastTime = 0;
  catchGame.score = 0;
  catchGame.completed = false;
  catchGame.hearts = [];
  catchGame.cacti = [];
  catchGame.spawnTimer = 0;
  catchGame.bowl.x = catchSize.width / 2;
  catchScoreEl.textContent = "0";
  drawCatch();
};

const startCatch = () => {
  if (catchGame.running) {
    return;
  }
  if (catchGame.completed) {
    return;
  }
  catchGame.running = true;
  catchGame.lastTime = performance.now();
  requestAnimationFrame(catchLoop);
};

const startCatchWithTimer = () => {
  if (catchTimerId) {
    clearTimeout(catchTimerId);
  }
  startCatch();
  catchTimerId = setTimeout(() => handleGameTimeout("catch"), CATCH_DURATION_MS);
};

const spawnCatchItem = () => {
  const x = 20 + Math.random() * (catchSize.width - 40);
  if (Math.random() < catchConfig.obstacleChance) {
    const emoji =
      obstacleEmojis[Math.floor(Math.random() * obstacleEmojis.length)];
    catchGame.cacti.push({ x, y: -20, r: 14, emoji });
  } else {
    catchGame.hearts.push({ x, y: -20, r: 12 });
  }
};

const updateCatch = (delta) => {
  if (catchGame.completed) {
    return;
  }
  catchGame.spawnTimer += delta;
  if (catchGame.spawnTimer >= catchConfig.spawnInterval) {
    catchGame.spawnTimer = 0;
    spawnCatchItem();
  }

  const speed = catchConfig.fallSpeed;
  catchGame.hearts.forEach((heart) => {
    heart.y += speed * delta;
  });
  catchGame.cacti.forEach((cactus) => {
    cactus.y += speed * delta;
  });

  const bowl = catchGame.bowl;
  const catchZone = { left: bowl.x - bowl.w / 2, right: bowl.x + bowl.w / 2 };

  catchGame.hearts = catchGame.hearts.filter((heart) => {
    const caught =
      heart.y + heart.r >= bowl.y - bowl.h / 2 &&
      heart.y - heart.r <= bowl.y + bowl.h / 2 &&
      heart.x >= catchZone.left &&
      heart.x <= catchZone.right;
    if (caught) {
      catchGame.score += 1;
      catchScoreEl.textContent = String(catchGame.score);
      const remaining = Math.max(0, CATCH_HEART_LIMIT - catchHeartsEarned);
      const award = Math.min(catchConfig.heartValue, remaining);
      if (award > 0) {
        addGameHearts("catch", award);
      }
      if (catchHeartsEarned >= CATCH_HEART_LIMIT) {
        catchGame.completed = true;
        catchGame.running = false;
        if (catchTimerId) {
          clearTimeout(catchTimerId);
          catchTimerId = null;
        }
        if (catchWinBackdrop) {
          catchWinBackdrop.classList.remove("hidden");
        }
      }
      return false;
    }
    return heart.y < catchSize.height + 30;
  });

  catchGame.cacti = catchGame.cacti.filter((cactus) => {
    const hit =
      cactus.y + cactus.r >= bowl.y - bowl.h / 2 &&
      cactus.y - cactus.r <= bowl.y + bowl.h / 2 &&
      cactus.x >= catchZone.left &&
      cactus.x <= catchZone.right;
    if (hit) {
      catchGame.score = Math.max(0, catchGame.score - 1);
      catchScoreEl.textContent = String(catchGame.score);
      addHearts(-1);
      if (cactus.emoji === "🍆" && faahAudio) {
        faahAudio.currentTime = 0;
        faahAudio.play().catch(() => {});
      } else if (cactus.emoji !== "❤" && ouchAudio) {
        ouchAudio.currentTime = 0;
        ouchAudio.play().catch(() => {});
      }
      return false;
    }
    return cactus.y < catchSize.height + 30;
  });
};

const drawBowl = () => {
  const { x, y, w, h } = catchGame.bowl;
  catchCtx.fillStyle = "#ffb3d5";
  catchCtx.fillRect(x - w / 2, y - h / 2, w, h);
  catchCtx.fillStyle = "#cc5f8d";
  catchCtx.fillRect(x - w / 2, y - h / 2, w, 6);

  const charSize = 52;
  const charX = x - charSize / 2;
  const charY = y - h / 2 - charSize + 2;
  catchCtx.save();
  catchCtx.beginPath();
  catchCtx.arc(x, charY + charSize / 2, charSize / 2, 0, Math.PI * 2);
  catchCtx.closePath();
  catchCtx.clip();
  if (catchCharacterReady) {
    catchCtx.drawImage(catchCharacterImage, charX, charY, charSize, charSize);
  } else {
    catchCtx.fillStyle = "#ffb3d5";
    catchCtx.fillRect(charX, charY, charSize, charSize);
    catchCtx.fillStyle = "#8c3d5c";
    catchCtx.font = "bold 10px sans-serif";
    catchCtx.textAlign = "center";
    catchCtx.textBaseline = "middle";
    catchCtx.fillText("HER", x, charY + charSize / 2);
  }
  catchCtx.restore();
};

const drawCatch = () => {
  catchCtx.clearRect(0, 0, catchSize.width, catchSize.height);
  catchCtx.fillStyle = "#f4fbff";
  catchCtx.fillRect(0, 0, catchSize.width, catchSize.height);
  if (catchBgReady) {
    catchCtx.save();
    catchCtx.globalAlpha = 0.18;
    catchCtx.drawImage(catchBgImage, 0, 0, catchSize.width, catchSize.height);
    catchCtx.restore();
  }

  catchCtx.font = "28px serif";
  catchCtx.textAlign = "center";
  catchCtx.textBaseline = "middle";

  catchGame.hearts.forEach((heart) => {
    catchCtx.fillStyle = "#ff3d96";
    catchCtx.fillText("❤", heart.x, heart.y);
  });

  catchGame.cacti.forEach((cactus) => {
    catchCtx.fillStyle = "#2f1a24";
    catchCtx.fillText(cactus.emoji || "🌵", cactus.x, cactus.y);
  });

  drawBowl();

  if (!catchGame.running) {
    catchCtx.fillStyle = "#6b2c46";
    catchCtx.font = "bold 16px sans-serif";
    catchCtx.fillText(
      "Press Start to Play",
      catchSize.width / 2,
      catchSize.height / 2
    );
  }
};

const catchLoop = (time) => {
  if (!catchGame.running) {
    return;
  }
  const delta = (time - catchGame.lastTime) / 1000;
  catchGame.lastTime = time;
  updateCatch(delta);
  drawCatch();
  requestAnimationFrame(catchLoop);
};

const moveBowlTo = (clientX) => {
  const rect = catchCanvas.getBoundingClientRect();
  const x = clientX - rect.left;
  catchGame.bowl.x = Math.max(40, Math.min(catchSize.width - 40, x));
};

catchCanvas.addEventListener("mousemove", (event) => {
  moveBowlTo(event.clientX);
});

catchCanvas.addEventListener("click", () => {
  if (!catchGame.running) {
    startCatchWithTimer();
  }
});

catchCanvas.addEventListener(
  "touchmove",
  (event) => {
    if (event.touches[0]) {
      moveBowlTo(event.touches[0].clientX);
    }
  },
  { passive: true }
);

catchStartBtn.addEventListener("click", startCatchWithTimer);
catchResetBtn.addEventListener("click", () => resetCatch(true));

resetCatch();
setCatchDifficulty(catchDifficulty.value);
catchDifficulty.addEventListener("input", (event) => {
  setCatchDifficulty(event.target.value);
});

if (catchWinDismiss) {
  catchWinDismiss.addEventListener("click", () => {
    catchWinBackdrop.classList.add("hidden");
  });
}

if (finalPlayBtn) {
  finalPlayBtn.addEventListener("click", () => {
    if (finalBackdrop) {
      finalBackdrop.classList.add("hidden");
    }
    if (videoBackdrop) {
      videoBackdrop.classList.remove("hidden");
    }
    if (bgMusic) {
      bgMusic.pause();
    }
    if (valentineVideo) {
      valentineVideo.play().catch(() => {});
    }
  });
}

if (videoDismiss) {
  videoDismiss.addEventListener("click", () => {
    if (videoBackdrop) {
      videoBackdrop.classList.add("hidden");
    }
    if (valentineVideo) {
      valentineVideo.pause();
      valentineVideo.currentTime = 0;
    }
  });
}

const endScreen = document.getElementById("endScreen");
if (valentineVideo) {
  valentineVideo.addEventListener("ended", () => {
    if (videoBackdrop) {
      videoBackdrop.classList.add("hidden");
    }
    if (endScreen) {
      endScreen.classList.remove("hidden");
    }
  });
}


const resizeCanvas = (canvasEl, context, sizeObj) => {
  const displayWidth = Math.max(1, Math.floor(canvasEl.clientWidth));
  const displayHeight = Math.max(1, Math.floor(canvasEl.clientHeight));
  sizeObj.width = displayWidth;
  sizeObj.height = displayHeight;
  const dpr = window.devicePixelRatio || 1;
  const scaledWidth = Math.floor(displayWidth * dpr);
  const scaledHeight = Math.floor(displayHeight * dpr);
  if (canvasEl.width !== scaledWidth || canvasEl.height !== scaledHeight) {
    canvasEl.width = scaledWidth;
    canvasEl.height = scaledHeight;
  }
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
};

const resizeAllCanvases = () => {
  resizeCanvas(canvas, ctx, flappySize);
  resizeCanvas(catchCanvas, catchCtx, catchSize);
  resetGame();
  resetCatch();
};

window.addEventListener("resize", () => {
  requestAnimationFrame(resizeAllCanvases);
});
