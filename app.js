/* JavaScript for Interactive Program Services Landing Page */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. SCROLL ACTIONS & ACTIVE NAVIGATION
  // ==========================================
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 2. HERO CANVAS PARTICLES SYSTEM
  // ==========================================
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    // Resize canvas
    function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Mouse position tracker
    const mouse = {
      x: null,
      y: null,
      radius: 120
    };

    window.addEventListener('mousemove', (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Particle Blueprint
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      // Draw particle
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      // Update particle state
      update() {
        // Boundary collision check
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Mouse collision/interaction (attraction/repulsion)
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            // Repel from mouse
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxForce = mouse.radius;
            const force = (maxForce - distance) / maxForce;
            const directionX = forceDirectionX * force * 5;
            const directionY = forceDirectionY * force * 5;
            
            this.x -= directionX;
            this.y -= directionY;
          }
        }

        // Normal movement
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    // Populate particles
    function initParticles() {
      particlesArray = [];
      let numberOfParticles = (canvas.width * canvas.height) / 11000;
      // Cap particles for performance
      numberOfParticles = Math.min(numberOfParticles, 120);

      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        
        // Colors from user HEX codes: #6D7099, #7C7EA0, #9498B3 (with transparencies)
        const colors = [
          'rgba(109, 112, 153, 0.45)', // #6D7099 with alpha
          'rgba(124, 126, 160, 0.35)', // #7C7EA0 with alpha
          'rgba(148, 152, 179, 0.25)'  // #9498B3 with alpha
        ];
        let color = colors[Math.floor(Math.random() * colors.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    // Connect particles
    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 140) {
            opacityValue = 1 - (distance / 140);
            ctx.strokeStyle = `rgba(109, 112, 153, ${opacityValue * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    }

    initParticles();
    animate();

    // Re-initialize particles on window resize to fit canvas
    window.addEventListener('resize', () => {
      initParticles();
    });
  }

  // ==========================================
  // 3. INTERACTIVE PACKAGE & SENSOR CONFIGURATOR
  // ==========================================
  const packageRadioCards = document.querySelectorAll('.estimator-radio-card');
  const sensorCheckboxCards = document.querySelectorAll('.estimator-checkbox-card');
  
  const selectedPackageEl = document.getElementById('summary-package');
  const selectedSensorsCountEl = document.getElementById('summary-sensors-count');
  const estimateTimelineEl = document.getElementById('summary-timeline');
  const estimatorMessageEl = document.getElementById('estimator-message');

  function updateEstimator() {
    let activePackageName = "Events Package";
    let activePackageTimeline = "1 - 3 Weeks";
    let activePackageScope = "Short-term deployment, setup and calibration included.";
    
    const activeRadio = document.querySelector('.estimator-radio-card.active');
    if (activeRadio) {
      const radioInput = activeRadio.querySelector('input[type="radio"]');
      activePackageName = activeRadio.querySelector('.radio-card-text h4').textContent;
      if (radioInput.value === 'permanent') {
        activePackageTimeline = "4 - 8 Weeks";
        activePackageScope = "Permanent installation, custom architectural integration, hardware calibration.";
      }
    }

    const activeSensors = document.querySelectorAll('.estimator-checkbox-card.active');
    const sensorCount = activeSensors.length;
    
    // Update DOM summary
    selectedPackageEl.textContent = activePackageName;
    selectedSensorsCountEl.textContent = sensorCount > 0 ? `${sensorCount} Selected` : 'None';
    
    // Dynamic timeline adjustments based on sensors complexity
    if (sensorCount > 0) {
      if (activePackageName.includes("Permanent")) {
        estimateTimelineEl.textContent = `${4 + Math.ceil(sensorCount * 0.5)} - ${8 + sensorCount} Weeks`;
      } else {
        estimateTimelineEl.textContent = `${1 + Math.ceil(sensorCount * 0.5)} - ${3 + Math.ceil(sensorCount * 0.8)} Weeks`;
      }
    } else {
      estimateTimelineEl.textContent = activePackageTimeline;
    }

    // Set context message
    estimatorMessageEl.value = `Selected Package: ${activePackageName}. Selected Sensors Count: ${sensorCount}. Estimated Timeline: ${estimateTimelineEl.textContent}. (${activePackageScope})`;
  }

  // Radio cards events
  packageRadioCards.forEach(card => {
    card.addEventListener('click', () => {
      packageRadioCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      radio.checked = true;
      updateEstimator();
    });
  });

  // Checkbox cards events
  sensorCheckboxCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('active');
      const checkbox = card.querySelector('input[type="checkbox"]');
      checkbox.checked = !checkbox.checked;
      updateEstimator();
    });
  });

  // Initialize estimator values
  updateEstimator();

  // ==========================================
  // 4. CONTACT FORM SUBMISSION HANDLER
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Feedback to User
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Inquiry... <span class="logo-dot"></span>';

      setTimeout(() => {
        // Build success toast
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '2rem';
        toast.style.right = '2rem';
        toast.style.backgroundColor = '#6D7099';
        toast.style.color = '#FFFFFF';
        toast.style.padding = '1rem 2rem';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        toast.style.zIndex = '2000';
        toast.style.fontFamily = 'Outfit, sans-serif';
        toast.style.fontWeight = '600';
        toast.style.transform = 'translateY(100px)';
        toast.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        toast.textContent = 'Thank you! Your inquiry has been received.';

        document.body.appendChild(toast);
        
        // Trigger entrance
        setTimeout(() => {
          toast.style.transform = 'translateY(0)';
        }, 100);

        // Reset Form
        contactForm.reset();
        sensorCheckboxCards.forEach(c => c.classList.remove('active'));
        packageRadioCards.forEach((c, idx) => {
          if (idx === 0) {
            c.classList.add('active');
            c.querySelector('input[type="radio"]').checked = true;
          } else {
            c.classList.remove('active');
          }
        });
        updateEstimator();

        // Remove toast and reset button
        setTimeout(() => {
          toast.style.transform = 'translateY(100px)';
          setTimeout(() => {
            toast.remove();
          }, 400);
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }, 4000);
      }, 1500);
    });
  }

  // ==========================================
  // 5. MOBILE MENU INTERACTION (SMOOTH TOGGLE)
  // ==========================================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(255, 255, 255, 0.95)';
        navLinks.style.padding = '2rem';
        navLinks.style.borderBottom = '1px solid var(--color-border)';
        navLinks.style.gap = '1.5rem';
        navLinks.style.boxShadow = 'var(--shadow-lg)';
      }
    });

    // Close menu when clicking link
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
        }
      });
    });
  }
});
