(function() {
    bladeColor = "#ffffff41";
    bladeWidth = 10;

    const buildBlade = (width) => {
        if (gameState === GAME_OVER) return;

        const particles = bladeSystem.getParticles();
        const count = particles.length;
        if (count < 2) return;

        let lineWidth = width;
        const step = width / (count - 1);

        for (let i = count - 1; i > 0; i--) {
            const p = particles[i];
            const next = particles[i - 1];

            topContext.beginPath();
            topContext.moveTo(p.position.x, p.position.y);
            topContext.lineTo(next.position.x, next.position.y);

            topContext.lineWidth = Math.max(lineWidth, 1);
            topContext.stroke();
            lineWidth -= step;
        }
    };

    buildColorBlade = (color, width) => {
        topContext.strokeStyle = color;
        buildBlade(width);

        const gradient = topContext.createLinearGradient(0, 0, gameWidth, gameHeight);
        gradient.addColorStop(0, "#ffffff88");
        gradient.addColorStop(1, "#ffffff22");
        topContext.strokeStyle = gradient;
        buildBlade(width * 0.6);
    };

    buildBladeParticle = (x, y) => {
        const p = bladeSystem.createParticle(SPP.Particle);
        p.init(x, y, 0.2);
    };
})();
