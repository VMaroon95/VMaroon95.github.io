// Matrix Digital Rain — Cinematic, inspired by the actual film
// Katakana + digits + symbols, variable-speed columns, bright white heads

class MatrixRain {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    // Katakana range + digits + symbols (like the real movie)
    this.chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
    this.fontSize = 15;
    this.columns = 0;
    this.drops = [];
    this.speeds = [];
    this.brightness = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = Array(this.columns).fill(0).map(() => Math.random() * -100);
    this.speeds = Array(this.columns).fill(0).map(() => 0.2 + Math.random() * 0.5);
    this.brightness = Array(this.columns).fill(0).map(() => 0.4 + Math.random() * 0.6);
  }

  draw() {
    // Slightly slower fade for longer trails
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `${this.fontSize}px monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // Head character is white/bright green
      const isHead = Math.random() > 0.96;
      if (isHead) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = '#00ff41';
        this.ctx.shadowBlur = 15;
      } else {
        // Vary the green between columns
        const b = this.brightness[i];
        const g = Math.floor(180 + b * 75);
        this.ctx.fillStyle = `rgb(0, ${g}, ${Math.floor(30 + b * 30)})`;
        this.ctx.shadowBlur = 0;
      }

      this.ctx.globalAlpha = 0.7 + Math.random() * 0.3;
      this.ctx.fillText(char, x, y);
      this.ctx.globalAlpha = 1;
      this.ctx.shadowBlur = 0;

      // Reset when past bottom, with randomness
      if (y > this.canvas.height && Math.random() > 0.985) {
        this.drops[i] = Math.random() * -20;
        this.speeds[i] = 0.2 + Math.random() * 0.5;
        this.brightness[i] = 0.4 + Math.random() * 0.6;
      }
      this.drops[i] += this.speeds[i];
    }
  }

  start() {
    let lastTime = 0;
    const animate = (time) => {
      if (time - lastTime > 45) {  // ~22fps
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
