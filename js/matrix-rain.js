// Matrix Digital Rain — Numbers, movie-style cascading columns
// Each column is a stream of different digits falling together

class MatrixRain {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.chars = '0123456789';
    this.fontSize = 16;
    this.spacing = 20;
    this.speed = 3; // pixels per frame — uniform
    this.columns = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const numCols = Math.floor(this.canvas.width / this.spacing);
    this.columns = [];

    for (let i = 0; i < numCols; i++) {
      this.columns.push(this._createStream(i, true));
    }
  }

  _createStream(colIndex, initial) {
    const trailLen = 10 + Math.floor(Math.random() * 18);
    // Each position in the stream gets its own digit
    const digits = [];
    for (let j = 0; j < trailLen; j++) {
      digits.push(this.chars[Math.floor(Math.random() * this.chars.length)]);
    }

    return {
      x: colIndex * this.spacing + this.spacing / 2,
      colIndex: colIndex,
      y: initial ? Math.random() * -this.canvas.height * 1.5 : Math.random() * -300 - 100,
      trailLen: trailLen,
      digits: digits,
      brightness: 0.4 + Math.random() * 0.6,
      mutateTimer: 0,
    };
  }

  draw() {
    // Black overlay for fade effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `${this.fontSize}px monospace`;
    this.ctx.textAlign = 'center';

    for (let s = 0; s < this.columns.length; s++) {
      const stream = this.columns[s];
      const headY = stream.y;

      // Occasionally mutate a random digit in the stream (like the movie)
      stream.mutateTimer++;
      if (stream.mutateTimer > 3) {
        stream.mutateTimer = 0;
        const idx = Math.floor(Math.random() * stream.digits.length);
        stream.digits[idx] = this.chars[Math.floor(Math.random() * this.chars.length)];
      }

      // Draw each digit in the stream
      for (let j = 0; j < stream.trailLen; j++) {
        const charY = headY - j * this.fontSize;

        // Skip if off screen
        if (charY < -this.fontSize || charY > this.canvas.height + this.fontSize) continue;

        const digit = stream.digits[j];
        const fade = 1 - (j / stream.trailLen);

        if (j === 0) {
          // Head — bright white with green glow
          this.ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * stream.brightness})`;
          this.ctx.shadowColor = '#00ff41';
          this.ctx.shadowBlur = 15;
        } else if (j === 1) {
          // Second char — bright green
          this.ctx.fillStyle = `rgba(100, 255, 100, ${0.9 * stream.brightness})`;
          this.ctx.shadowColor = '#00ff41';
          this.ctx.shadowBlur = 8;
        } else {
          // Trail — fading green
          const g = Math.floor(100 + fade * 155);
          const alpha = fade * 0.7 * stream.brightness;
          this.ctx.fillStyle = `rgba(0, ${g}, ${Math.floor(20 + fade * 30)}, ${alpha})`;
          this.ctx.shadowBlur = 0;
        }

        this.ctx.fillText(digit, stream.x, charY);
        this.ctx.shadowBlur = 0;
      }

      // Move stream down
      stream.y += this.speed;

      // Reset when the entire trail is past the bottom
      if ((stream.y - stream.trailLen * this.fontSize) > this.canvas.height) {
        this.columns[s] = this._createStream(stream.colIndex, false);
      }
    }
  }

  start() {
    let lastTime = 0;
    const animate = (time) => {
      if (time - lastTime > 40) { // ~25fps
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
