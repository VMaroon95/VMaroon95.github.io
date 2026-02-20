// Matrix Digital Rain — Canvas-based, 60fps
class MatrixRain {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.chars = '01';
    this.fontSize = 14;
    this.columns = 0;
    this.drops = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = Array(this.columns).fill(0).map(() => Math.random() * -100);
  }

  draw() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#00ff41';
    this.ctx.font = `${this.fontSize}px monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // Brighter head
      this.ctx.fillStyle = Math.random() > 0.98 ? '#fff' : '#00ff41';
      this.ctx.globalAlpha = 0.8 + Math.random() * 0.2;
      this.ctx.fillText(char, x, y);
      this.ctx.globalAlpha = 1;

      if (y > this.canvas.height && Math.random() > 0.99) {
        this.drops[i] = 0;
      }
      this.drops[i] += 0.4;  // slower fall speed
    }
  }

  start() {
    let lastTime = 0;
    const animate = (time) => {
      if (time - lastTime > 50) {  // ~20fps for slower feel
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
