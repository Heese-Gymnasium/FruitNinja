var FruitGame = FruitGame || {
    REVISION: '1',
    AUTHOR: "flashhawk",
    GITHUB: "https://github.com/flashhawk"
};

var gameWidth = window.innerWidth;
var gameHeight = window.innerHeight;

var topCanvas, topContext, middleCanvas, middleContext, bottomCanvas, bottomContext;
var particleSystem, fruitSystem, bombSystem, bladeSystem, gravity;
var timer = 0, interval = 1.8;
var bladeColor, bladeWidth;
var mouse = {}, score, gameLife, storage, isPlaying;
var GAME_READY = 1, GAME_PLAYING = 2, GAME_OVER = 3;
var gameState = GAME_READY, gameLevel, levelStep = 0.0001;
var ui_gameTitle, ui_newGame, ui_startFruit;
var ui_scoreIcon, ui_gameLife, ui_gamelifeTexture, ui_gameover;
var collide;
var assetsManager;

// Handle window resizing
function resizeCanvases() {
    gameWidth = window.innerWidth;
    gameHeight = window.innerHeight;
    if (!topCanvas) return;
    [topCanvas, middleCanvas, bottomCanvas].forEach(function(canvas) {
        canvas.width = gameWidth;
        canvas.height = gameHeight;
    });
}

// Setup canvases
function setupCanvases() {
    topCanvas = document.getElementById("top");
    middleCanvas = document.getElementById("middle");
    bottomCanvas = document.getElementById("bottom");

    [topCanvas, middleCanvas, bottomCanvas].forEach(function(canvas) {
        canvas.width = gameWidth;
        canvas.height = gameHeight;
    });

    topContext = topCanvas.getContext("2d");
    middleContext = middleCanvas.getContext("2d");
    bottomContext = bottomCanvas.getContext("2d");
}

// Input handling
function setupInput() {
    mouse = { x: 0, y: 0, isDown: false };

    function onMouseDown(e) {
        mouse.isDown = true;
        const rect = topCanvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        resumeAudio(); // resume audio after user gesture
    }

    function onMouseMove(e) {
        if (!mouse.isDown) return;
        const rect = topCanvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        if (bladeSystem && bladeSystem.track) bladeSystem.track(mouse.x, mouse.y);
    }

    function onMouseUp() { mouse.isDown = false; }

    topCanvas.addEventListener("mousedown", onMouseDown);
    topCanvas.addEventListener("mousemove", onMouseMove);
    topCanvas.addEventListener("mouseup", onMouseUp);

    topCanvas.addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        onMouseDown({ clientX: t.clientX, clientY: t.clientY });
    });

    topCanvas.addEventListener("touchmove", (e) => {
        const t = e.touches[0];
        onMouseMove({ clientX: t.clientX, clientY: t.clientY });
        e.preventDefault();
    });

    topCanvas.addEventListener("touchend", onMouseUp);
}

// Resume Web AudioContext
function resumeAudio() {
    if (createjs.Sound.activePlugin && createjs.Sound.activePlugin.context) {
        const ctx = createjs.Sound.activePlugin.context;
        if (ctx.state === "suspended") {
            ctx.resume();
        }
    }
}

// Initialize systems
function initSystems() {
    particleSystem = new SPP.ParticleSystem();
    bladeSystem = new SPP.ParticleSystem();
    fruitSystem = new SPP.ParticleSystem();
    bombSystem = new SPP.ParticleSystem();
    gravity = new SPP.Force();
    gravity.init(0, 0.15);
}

// Reset game data
function resetGameData() {
    gameState = GAME_READY;
    score = 0;
    gameLife = 3;
    gameLevel = 0.1;
    ui_gamelifeTexture = assetsManager["gamelife-3"];
}

// Start the game
function startGame() {
    hideStartGameUI();
    resetGameData();
    showScoreUI();
    gameState = GAME_PLAYING;
}

// Game loop
function gameLoop() {
    requestAnimationFrame(gameLoop);
    if (gameState !== GAME_PLAYING) return;

    topContext.clearRect(0, 0, gameWidth, gameHeight);
    middleContext.clearRect(0, 0, gameWidth, gameHeight);

    if (fruitSystem) fruitSystem.update();
    if (bombSystem) bombSystem.update();
    if (bladeSystem) bladeSystem.update();
    if (particleSystem) particleSystem.update();

    if (fruitSystem) fruitSystem.draw(middleContext);
    if (bombSystem) bombSystem.draw(middleContext);
    if (bladeSystem) bladeSystem.draw(topContext);
    if (particleSystem) particleSystem.draw(topContext);
}

// Load assets and initialize
window.onload = function() {
    assetsManager = new FruitGame.AssetsManager();
    assetsManager.addEventListener("complete", init);
    assetsManager.start();
};

// Init after assets are loaded
function init() {
    document.getElementById("loading").style.display = 'none';
    document.getElementById("info").style.display = 'block';

    setupCanvases();
    setupInput();
    initSystems();

    storage = window.localStorage;
    if (!storage.highScore) storage.highScore = 0;

    resetGameData();

    particleSystem.start();
    bladeSystem.start();
    fruitSystem.start();
    bombSystem.start();

    collide = new FruitGame.Collide();

    requestAnimationFrame(gameLoop);
}

// Window resize
window.addEventListener("resize", resizeCanvases);
