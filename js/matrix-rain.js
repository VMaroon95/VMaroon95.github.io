// Matrix Digital Rain — Numbers only, uniform speed, no overlapping

class MatrixRain {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.chars = '0123456789';
    this.fontSize = 16;
    this.columns = 0;
    this.drops = [];
    this.charMap = []; // fixed char per position to prevent overlap flicker
    this.speed = 0.4; // uniform speed for all columns
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    const spacing = this.fontSize + 4; // extra gap to prevent overlap
    this.columns = Math.floor(this.canvas.width / spacing);
    this.spacing = spacing;
    this.rows = Math.ceil(this.canvas.height / this.fontSize) + 5;

    // Stagger start positions so columns don't all start together
    this.drops = Array(this.columns).fill(0).map(() => Math.random() * -this.rows);

    // Pre-assign a character to each column so it's consistent per drop
    this.charMap = Array(this.columns).fill(0).map(() =>
      this.chars[Math.floor(Math.random() * this.chars.length)]
    );

    // Each column gets a slightly different brightness for depth
    this.brightness = Array(this.columns).fill(0).map(() => 0.3 + Math.random() * 0.7);

    // Trail length per column
    this.trailLength = Array(this.columns).fill(0).map(() => 8 + Math.floor(Math.random() * 12));
  }

  draw() {
    // Fade background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `${this.fontSize}px monospace`;
    this.ctx.textAlign = 'center';

    for (let i = 0; i < this.columns; i++) {
      const x = i * this.spacing + this.spacing / 2;
      const dropPos = Math.floor(this.drops[i]);
      const y = dropPos * this.fontSize;

      // Only draw if on screen
      if (y > -this.fontSize && y < this.canvas.height + this.fontSize) {
        // Pick a new char occasionally for variety
        if (Math.random() > 0.92) {
          this.charMap[i] = this.chars[Math.floor(Math.random() * this.chars.length)];
        }

        const char = this.charMap[i];
        const b = this.brightness[i];

        // Head character — bright white/green
        this.ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * b})`;
        this.ctx.shadowColor = '#00ff41';
        this.ctx.shadowBlur = 12;
        this.ctx.fillText(char, x, y);
        this.ctx.shadowBlur = 0;

        // Trail characters behind the head
        for (let t = 1; t < this.trailLength[i]; t++) {
          const trailY = (dropPos - t) * this.fontSize;
          if (trailY < 0) break;

          const fade = 1 - (t / this.trailLength[i]);
          const g = Math.floor(120 + fade * 135);
          const alpha = fade * 0.6 * b;

          // Each trail position gets its own stable char
          const trailChar = this.chars[(i * 7 + t * 3) % this.chars.length];

          this.ctx.fillStyle = `rgba(0, ${g}, ${Math.floor(20 + fade * 40)}, ${alpha})`;
          this.ctx.fillText(trailChar, x, trailY);
        }
      }

      // Move down at uniform speed
      this.drops[i] += this.speed;

      // Reset when fully past bottom (including trail)
      if ((dropPos - this.trailLength[i]) * this.fontSize > this.canvas.height) {
        this.drops[i] = Math.random() * -15;
        this.brightness[i] = 0.3 + Math.random() * 0.7;
        this.trailLength[i] = 8 + Math.floor(Math.random() * 12);
      }
    }
  }

  start() {
    let lastTime = 0;
    const animate = (time) => {
      if (time - lastTime > 45) { // ~22fps
        this.draw();
        lastTime = time;
      }
      requestAnimationFrame(animate);
    };
    animate(0);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('matrix-canvas');
  if (canvas) {
    const rain = new MatrixRain(canvas);
    rain.start();
  }
});
