// Typing effect
class TypeWriter {
  constructor(el, text, speed = 50, delay = 0) {
    this.el = el;
    this.text = text;
    this.speed = speed;
    this.delay = delay;
    this.i = 0;
  }

  type() {
    return new Promise(resolve => {
      setTimeout(() => {
        const interval = setInterval(() => {
          if (this.i < this.text.length) {
            this.el.textContent += this.text.charAt(this.i);
            this.i++;
          } else {
            clearInterval(interval);
            resolve();
          }
        }, this.speed);
      }, this.delay);
    });
  }
}

// Hero intro sequence
async function heroSequence() {
  const lines = document.querySelectorAll('.hero-line');
  const hero = document.querySelector('.hero-content');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const text = line.dataset.text;
    line.textContent = '';
    line.style.opacity = '1';
    
    const tw = new TypeWriter(line, text, 60, i === 0 ? 1500 : 400);
    await tw.type();
    await new Promise(r => setTimeout(r, 600));
  }

  // Glitch then reveal name
  await new Promise(r => setTimeout(r, 800));
  const glitch = document.querySelector('.hero-glitch');
  glitch.style.opacity = '1';
  glitch.classList.add('glitch-active');

  await new Promise(r => setTimeout(r, 500));
  const name = document.querySelector('.hero-name');
  name.style.opacity = '1';
  
  await new Promise(r => setTimeout(r, 300));
  const subtitle = document.querySelector('.hero-subtitle');
  subtitle.style.opacity = '1';

  await new Promise(r => setTimeout(r, 300));
  const tagline = document.querySelector('.hero-tagline');
  if (tagline) tagline.style.opacity = '1';

  await new Promise(r => setTimeout(r, 400));
  const pills = document.querySelector('.pill-buttons');
  pills.style.opacity = '1';

  await new Promise(r => setTimeout(r, 300));
  const stats = document.querySelector('.hero-stats');
  if (stats) stats.style.opacity = '1';
}

// Scroll-triggered typing for terminal sections
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Trigger typing for terminal lines
        const typeLines = entry.target.querySelectorAll('.type-on-scroll:not(.typed)');
        let delay = 0;
        typeLines.forEach(line => {
          line.classList.add('typed');
          const text = line.dataset.text || line.textContent;
          line.textContent = '';
          setTimeout(() => {
            let i = 0;
            const interval = setInterval(() => {
              if (i < text.length) {
                line.textContent += text.charAt(i);
                i++;
              } else {
                clearInterval(interval);
              }
            }, 30);
          }, delay);
          delay += text.length * 30 + 300;
        });

        // Trigger skill bars
        const bars = entry.target.querySelectorAll('.skill-fill');
        bars.forEach(bar => {
          setTimeout(() => {
            bar.style.width = bar.dataset.level + '%';
          }, 300);
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.section').forEach(s => observer.observe(s));
}

// Smooth scroll
document.addEventListener('DOMContentLoaded', () => {
  heroSequence();
  initScrollAnimations();

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Mobile nav
  const burger = document.querySelector('.nav-burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      burger.classList.toggle('open');
    });
  }
});
