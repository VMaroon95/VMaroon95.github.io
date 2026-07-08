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

// Hero intro sequence — name shows instantly, Matrix lines type as ambient effect
async function heroSequence() {
  // Name, subtitle, pills, stats are visible immediately via inline styles
  const name = document.querySelector('.hero-name');
  name.style.opacity = '1';

  // Type the Matrix lines as a subtle background effect
  const lines = document.querySelectorAll('.hero-line');
  await new Promise(r => setTimeout(r, 800));
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const text = line.dataset.text;
    line.textContent = '';
    line.style.opacity = '1';
    
    const tw = new TypeWriter(line, text, 50, i === 0 ? 300 : 200);
    await tw.type();
    await new Promise(r => setTimeout(r, 400));
  }
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
  }, { threshold: 0.1 });

  document.querySelectorAll('.section').forEach(s => observer.observe(s));
}

// Reveal sections already in viewport (fixes anchor nav jump bug)
function revealVisibleSections() {
  document.querySelectorAll('.section:not(.visible)').forEach(s => {
    const rect = s.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
      s.classList.add('visible');
      s.querySelectorAll('.skill-fill').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.level + '%'; }, 300);
      });
    }
  });
}

// Smooth scroll
document.addEventListener('DOMContentLoaded', () => {
  heroSequence();
  initScrollAnimations();

  // Reveal any sections already in view on load
  setTimeout(revealVisibleSections, 150);

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        // Re-check visibility after scroll animation completes
        setTimeout(revealVisibleSections, 700);
      }
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
