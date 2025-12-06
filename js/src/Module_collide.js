(function() {
    collide = new FruitGame.Collide();

    collideTest = function() {
        if (gameState === GAME_OVER) return;

        const fruits = fruitSystem.getParticles();
        const bombs = bombSystem.getParticles();
        const blade = bladeSystem.getParticles();
        const bladeLen = blade.length;

        if (bladeLen < 2) return; // Need at least 2 points to form a blade segment

        for (let l = bladeLen - 1; l > 0; l--) {
            const p1 = blade[l].position;
            const p2 = blade[l - 1].position;

            // Check fruits
            for (let i = 0; i < fruits.length; i++) {
                const fruit = fruits[i];
                if (collide.lineInEllipse([p1.x, p1.y], [p2.x, p2.y], [fruit.position.x, fruit.position.y], fruit.radius)) {
                    cutFruit(fruit);
                }
            }

            // Check bombs
            for (let j = 0; j < bombs.length; j++) {
                const bomb = bombs[j];
                if (collide.lineInEllipse([p1.x, p1.y], [p2.x, p2.y], [bomb.position.x, bomb.position.y], bomb.radius)) {
                    cutBomb(bomb);
                }
            }
        }
    };
})();
