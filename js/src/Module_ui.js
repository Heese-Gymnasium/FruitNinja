(function () {

    const ui_newGameUpdate = (p) => { p.rotation += 0.01; };

    showStartGameUI = () => {
        gameState = GAME_READY;

        ui_gameTitle = particleSystem.createParticle(SPP.SpriteImage);
        ui_gameTitle.init(0, -assetsManager.gametitle.height, Infinity, assetsManager.gametitle, topContext);
        ui_gameTitle.regX = ui_gameTitle.regY = 0;
        TweenLite.to(ui_gameTitle.position, 0.5, { y: 0 });

        ui_newGame = particleSystem.createParticle(SPP.SpriteImage);
        ui_newGame.init(gameWidth * 0.618, gameHeight * 0.618, Infinity, assetsManager.newgame, topContext);
        ui_newGame.scale = 5;
        ui_newGame.alpha = 0;
        ui_newGame.onUpdate = () => ui_newGameUpdate(ui_newGame);
        TweenLite.to(ui_newGame, 0.8, { scale: 1, alpha: 1, ease: Back.easeOut });

        ui_startFruit = fruitSystem.createParticle(FruitGame.Fruit);
        ui_startFruit.addEventListener("dead", startGame);

        const textureObj = assetsManager.getRandomFruit();
        ui_startFruit.init(
            gameWidth * 0.618,
            gameHeight * 0.618,
            Infinity,
            textureObj.w,
            assetsManager.shadow,
            topContext
        );

        ui_startFruit.rotationStep = -0.02;
        ui_startFruit.scale = 0;
        ui_startFruit.alpha = 0;
        ui_startFruit.textureObj = textureObj;

        TweenLite.to(ui_startFruit, 1, { scale: 1, alpha: 1, ease: Back.easeOut });
    };

    hideStartGameUI = () => {
        ui_startFruit.removeEventListener("dead", startGame);

        TweenLite.to(ui_gameTitle.position, 0.8, { y: -assetsManager.gametitle.height });
        TweenLite.to(ui_newGame, 0.8, {
            scale: 8,
            alpha: 0,
            onComplete: () => {
                ui_gameTitle.life = 0;
                ui_newGame.life = 0;
            }
        });
    };

    showScoreTextUI = () => {
        if (gameState === GAME_READY) return;

        const mainSize = Math.floor(36 * (gameWidth / 800));
        const subSize = Math.floor(20 * (gameWidth / 800));
        const pad = Math.floor(12 * (gameWidth / 800));
        const x = pad;

        bottomContext.font = `${mainSize}px Courier-Bold`;
        const m = bottomContext.measureText(`${score}`);
        const mainH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
        const yScore = pad + mainH;
        bottomContext.fillText(`${score}`, x, yScore);

        bottomContext.font = `${subSize}px Courier-Bold`;
        const s = bottomContext.measureText(`Best: ${storage.highScore}`);
        const subH = s.actualBoundingBoxAscent + s.actualBoundingBoxDescent;
        const yBest = yScore + subH + pad;
        bottomContext.fillText(`Best: ${storage.highScore}`, x, yBest);
    };

    showScoreUI = () => {
        ui_scoreIcon = particleSystem.createParticle(SPP.SpriteImage);
        ui_scoreIcon.init(10, 10, Infinity, assetsManager.score, bottomContext);
        ui_scoreIcon.regX = ui_scoreIcon.regY = 0;

        ui_gameLife = particleSystem.createParticle(SPP.SpriteImage);
        ui_gameLife.init(gameWidth, 8, Infinity, ui_gamelifeTexture, bottomContext);
        ui_gameLife.regX = 1;
        ui_gameLife.regY = 0;
    };

    hideScoreUI = () => {
        if (ui_scoreIcon) ui_scoreIcon.life = 0;
        if (ui_gameLife) ui_gameLife.life = 0;
    };

    showGameoverUI = () => {
        ui_gameOver = particleSystem.createParticle(SPP.SpriteImage);
        ui_gameOver.init(gameWidth * 0.5, gameHeight * 0.5, Infinity, assetsManager.gameover, topContext);
        ui_gameOver.scale = 0;

        TweenLite.to(ui_gameOver, 0.8, {
            delay: 2,
            scale: 1,
            ease: Back.easeOut,
            onComplete: gameOverComplete
        });
    };

    const gameoverUIHideComplete = () => {
        ui_gameOver.life = 0;
        hideScoreUI();
        showStartGameUI();
    };

    hideGameoverUI = () => {
        TweenLite.to(ui_gameOver, 0.8, { scale: 0, ease: Back.easeIn, onComplete: gameoverUIHideComplete });
    };

})();
