window.onload = loadAssets;

function loadAssets() {
    assetsManager = new FruitGame.AssetsManager();
    assetsManager.addEventListener("complete", init);
    assetsManager.start();
}

function init() {
    // Hide loading and show info
    document.getElementById("loading").style.display = 'none';
    document.getElementById("info").style.display = 'block';

    // Canvas setup
    topCanvas = document.getElementById("top");
    topCanvas.style.display = "block";
    topCanvas.width = gameWidth;
    topCanvas.height = gameHeight;
    topContext = topCanvas.getContext("2d");
    topContext.globalCompositeOperation = "lighter";

    middleCanvas = document.getElementById("middle");
    middleCanvas.style.display = "block";
    middleCanvas.width = gameWidth;
    middleCanvas.height = gameHeight;
    middleContext = middleCanvas.getContext("2d");

    bottomCanvas = document.getElementById("bottom");
    bottomCanvas.style.display = "block";  // fixed typo
    bottomCanvas.width = gameWidth;
    bottomCanvas.height = gameHeight;
    bottomContext = bottomCanvas.getContext("2d");
    bottomContext.fillStyle = "#f6c223";
    bottomContext.textAlign = "left";
    bottomContext.textBaseline = "top";

    // Particle systems
    particleSystem = new SPP.ParticleSystem();
    bladeSystem = new SPP.ParticleSystem();
    fruitSystem = new SPP.ParticleSystem();
    bombSystem = new SPP.ParticleSystem();
    gravity = new SPP.Force();
    gravity.init(0, 0.15);

    // Game data
    storage = window.localStorage;
    if (!storage.highScore) storage.highScore = 0;
    gameState = GAME_READY;
    score = 0;
    gameLife = 3;
    ui_gamelifeTexture = assetsManager["gamelife-3"];
    gameLevel = 0.1;

    // Start particle systems
    particleSystem.start();
    bladeSystem.start();
    fruitSystem.start();
    bombSystem.start();

    // Start render loop
    render();

    // Event listeners
    topCanvas.addEventListener('mousemove', mousemove, false);

    // Show start UI
    enterGame();
}

// Show start game UI
function enterGame() {
    showStartGameUI();
}

// Reset game data
function resetGameData() {
    gameState = GAME_READY;
    score = 0;
    gameLife = 3;
    ui_gamelifeTexture = assetsManager["gamelife-3"];
    gameLevel = 0.1;
}

// Start game
function startGame(e) {
    hideStartGameUI();
    resetGameData();
    showScoreUI();
    gameState = GAME_PLAYING;
}

// Timer to throw fruits/bombs
function renderTimer() {
    if (gameState != GAME_PLAYING) return;

    timer += SPP.frameTime;
    if (timer >= interval) {
        timer = 0;
        throwObject();
    }
}

// Throw random fruits/bombs
function throwObject() {
    let n = (Math.random() * 4 >> 0) + 1;
    for (let i = 0; i < n; i++) {
        if (isThrowBomb()) throwBomb();
        else throwFruit();
    }
    createjs.Sound.play("throwFruit");
}

// Determine whether to throw bomb
function isThrowBomb() {
    return Math.random() < gameLevel;
}

// Level progression
function levelUpdate() {
    gameLevel += levelStep;
    if (gameLevel > 1) gameLevel = 0.1;
}

// Game over logic
function gameOver() {
    if (gameState == GAME_OVER) return;

    let l = fruitSystem.getParticles().length;
    while (l-- > 0) {
        fruitSystem.getParticles()[l].removeEventListener("dead", missHandler);
    }

    gameState = GAME_OVER;
    gameLife = 0;
    ui_gamelifeTexture = assetsManager["gamelife-" + gameLife];
    ui_gameLife.texture = ui_gamelifeTexture;

    if (score > parseInt(storage["highScore"])) storage.highScore = score;
    showGameoverUI();
}

// Game over complete
function gameOverComplete() {
    topCanvas.addEventListener('click', replay, false);
}

// Replay game
function replay(e) {
    topCanvas.removeEventListener('click', replay, false);
    hideGameoverUI();
}

// Mouse movement
function mousemove(e) {
    if (e.layerX || e.layerX === 0) { // Firefox
        mouse.x = e.layerX;
        mouse.y = e.layerY;
    } else if (e.offsetX || e.offsetX === 0) { // Opera
        mouse.x = e.offsetX;
        mouse.y = e.offsetY;
    }
    buildBladeParticle(mouse.x, mouse.y);
}

// Render loop
function render() {
    requestAnimationFrame(render);

    topContext.clearRect(0, 0, gameWidth, gameHeight);
    middleContext.clearRect(0, 0, gameWidth, gameHeight);
    bottomContext.clearRect(0, 0, gameWidth, gameHeight);

    showScoreTextUI();

    fruitSystem.render();
    bombSystem.render();
    particleSystem.render();
    bladeSystem.render();

    buildColorBlade(bladeColor, bladeWidth);
    collideTest();
    levelUpdate();
    renderTimer();
}
