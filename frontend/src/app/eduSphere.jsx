
"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const EduSphere = () => {
  const loaderRef = useRef(null);
  const headerRef = useRef(null);
  const heroCanvasRef = useRef(null);
  
  // Initialize Three.js scene
  const initThreeScene = () => {
    // Create scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    heroCanvasRef.current.appendChild(renderer.domElement);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Create education-themed objects
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x4A56E2,
      emissive: 0x4A56E2,
      emissiveIntensity: 0.2,
      specular: 0xffffff,
      shininess: 100
    });
    
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
    
    // Create floating book
    const bookGeometry = new THREE.BoxGeometry(0.8, 1, 0.1);
    const bookMaterial = new THREE.MeshPhongMaterial({ color: 0xFF6B6B });
    const book = new THREE.Mesh(bookGeometry, bookMaterial);
    book.position.set(-1.5, 0, 0);
    scene.add(book);
    
    // Create floating sphere (representing a globe)
    const sphereGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x6C63FF,
      emissive: 0x6C63FF,
      emissiveIntensity: 0.2
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(1.5, -0.5, 0);
    scene.add(sphere);
    
    // Create floating graduation cap
    const capGeometry = new THREE.ConeGeometry(0.5, 0.2, 4);
    const capMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const cap = new THREE.Mesh(capGeometry, capMaterial);
    cap.rotation.x = Math.PI;
    cap.position.set(0, 1.5, 0);
    scene.add(cap);
    
    // Position camera
    camera.position.z = 5;
    
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      
      // Rotate objects
      torusKnot.rotation.x += 0.01;
      torusKnot.rotation.y += 0.01;
      
      book.rotation.y += 0.01;
      book.position.y = Math.sin(Date.now() * 0.001) * 0.2;
      
      sphere.rotation.y += 0.005;
      sphere.position.y = Math.sin(Date.now() * 0.001 + 2) * 0.2;
      
      cap.rotation.z += 0.01;
      cap.position.y = 1.5 + Math.sin(Date.now() * 0.001 + 4) * 0.2;
      
      renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / 2 / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / 2, window.innerHeight);
    });
    
    // Start animation
    animate();
  };

  // Observer setup for scroll animations
  const setupScrollAnimations = () => {
    const observerOptions = {
      threshold: 0.25,
      rootMargin: '0px 0px -100px 0px'
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      });
    }, observerOptions);

    // Apply to all steps
    document.querySelectorAll('.step').forEach(step => {
      appearOnScroll.observe(step);
    });

    // Apply to all cards with animation classes
    document.querySelectorAll('.fade-in, .scale-in').forEach(el => {
      appearOnScroll.observe(el);
    });

    // Feature cards animation
    document.querySelectorAll('.feature-card').forEach((card) => {
      card.classList.add('fade-in');
      appearOnScroll.observe(card);
    });

    // Testimonial cards animation
    document.querySelectorAll('.testimonial-card').forEach((card) => {
      card.classList.add('scale-in');
      appearOnScroll.observe(card);
    });

    // Pricing cards animation
    document.querySelectorAll('.pricing-card').forEach((card) => {
      card.classList.add('fade-in');
      appearOnScroll.observe(card);
    });
  };

  // GSAP animations setup
  const setupGSAPAnimations = () => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animation
    gsap.from('.hero-content', {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out'
    });
    
    // Stats card animation
    gsap.from('.stats-card', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.5,
      ease: 'back.out(1.7)'
    });
    
    // Section titles animation
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: 'top 80%'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out'
      });
    });
    
    // CTA section parallax effect
    gsap.to('.cta::before', {
      scrollTrigger: {
        trigger: '.cta',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: '30%',
      ease: 'none'
    });
  };

  // Handle sticky header
  const handleScroll = () => {
    if (window.scrollY > 50) {
      headerRef.current.classList.add('scrolled');
    } else {
      headerRef.current.classList.remove('scrolled');
    }
  };

  useEffect(() => {
    // Hide loader after page load
    setTimeout(() => {
      if (loaderRef.current) {
        loaderRef.current.classList.add('hidden');
      }
    }, 500);

    // Add scroll event listener for sticky header
    window.addEventListener('scroll', handleScroll);

    // Initialize Three.js scene
    initThreeScene();

    // Setup scroll animations
    setupScrollAnimations();

    // Setup GSAP animations
    setupGSAPAnimations();

    // Cleanup event listeners
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', () => {}); // Cleanup resize listener
    };
  }, []);

  return (
    <>
      {/* Loader */}
      <div className="loader" ref={loaderRef}>
        <div className="loader-spinner"></div>
      </div>

      {/* Header */}
      <header ref={headerRef}>
        <nav>
          <a href="#" className="logo">
            <i className="fas fa-graduation-cap logo-icon"></i>
            Edu<span>Sphere</span>
          </a>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="cta-buttons">
            <a href="#" className="btn btn-outline">Log In</a>
            <a href="#" className="btn btn-primary">Sign Up Free</a>
          </div>
          <button className="hamburger">
            <i className="fas fa-bars"></i>
          </button>
        </nav>
      </header>

      {/* Hero Section with 3D Model */}
      <section className="hero" id="hero">
        <div id="hero-canvas" ref={heroCanvasRef}></div>
        <div className="container">
          <div className="hero-content">
            <h1>Transform How You Teach & Learn</h1>
            <p>EduSphere is a next-generation learning platform where interactive content, AI-powered insights, and real-time collaboration converge to create an exceptional educational experience.</p>
            <div className="hero-buttons">
              <a href="#" className="btn btn-primary">Get Started</a>
              <a href="#how-it-works" className="btn btn-outline">Learn More</a>
            </div>
            <div className="stats-card">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Courses</span>
              </div>
              <div className="stat">
                <span className="stat-number">250+</span>
                <span className="stat-label">Educators</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose EduSphere?</h2>
            <p>Our platform combines cutting-edge technology with intuitive design to create a learning experience that's engaging, accessible, and effective.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h3>AI-Enhanced Learning</h3>
              <p>Our AI technology automatically generates transcripts, creates summaries, and helps students navigate lengthy video content efficiently.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-comments"></i>
              </div>
              <h3>Real-Time Interaction</h3>
              <p>Connect instantly with teachers and peers through integrated chat rooms, fostering collaboration and community learning.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-laptop-code"></i>
              </div>
              <h3>Intuitive Dashboard</h3>
              <p>Easily manage your courses, track progress, and access all your learning materials from one centralized, user-friendly interface.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <h3>Educator Tools</h3>
              <p>Powerful course creation tools, analytics, and management features designed specifically for teachers and content creators.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Learn Anywhere</h3>
              <p>Access your courses on any device with our responsive design and offline viewing capabilities for uninterrupted learning.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Secure & Reliable</h3>
              <p>Industry-leading security measures protect your data, while our robust infrastructure ensures consistent, high-quality performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-title">
            <h2>How EduSphere Works</h2>
            <p>From course creation to interactive learning, our platform simplifies every step of the educational journey.</p>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-content">
                <div className="step-number">1</div>
                <h3>Create & Upload</h3>
                <p>Teachers build courses by uploading videos and materials. Our AI automatically generates transcripts and creates interactive elements to enhance the content.</p>
                <a href="#" className="btn btn-outline">Learn About Course Creation</a>
              </div>
              <div className="step-image">
                <img src="/api/placeholder/600/400" alt="Course Creation Process" />
              </div>
            </div>
            <div className="step">
              <div className="step-content">
                <div className="step-number">2</div>
                <h3>Learn Interactively</h3>
                <p>Students access course materials with AI-generated transcripts, summaries, and navigation tools that make complex topics more digestible and easy to review.</p>
                <a href="#" className="btn btn-outline">Explore Learning Tools</a>
              </div>
              <div className="step-image">
                <img src="/api/placeholder/600/400" alt="Interactive Learning" />
              </div>
            </div>
            <div className="step">
              <div className="step-content">
                <div className="step-number">3</div>
                <h3>Connect in Real-Time</h3>
                <p>Join live discussions with instructors and peers. Ask questions, share insights, and collaborate in a supportive community that enhances your understanding.</p>
                <a href="#" className="btn btn-outline">See How Collaboration Works</a>
              </div>
              <div className="step-image">
                <img src="/api/placeholder/600/400" alt="Real-Time Collaboration" />
              </div>
            </div>
            <div className="step">
              <div className="step-content">
                <div className="step-number">4</div>
                <h3>Track Progress</h3>
                <p>Monitor your learning journey with detailed analytics and progress tracking. Set goals, earn achievements, and stay motivated throughout your educational experience.</p>
                <a href="#" className="btn btn-outline">View Progress Features</a>
              </div>
              <div className="step-image">
                <img src="/api/placeholder/600/400" alt="Progress Tracking" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="section-title">
            <h2>What Our Users Say</h2>
            <p>Discover how EduSphere is transforming the learning experience for students and educators around the world.</p>
          </div>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p className="quote">EduSphere revolutionized how I teach my computer science courses. The AI transcript feature alone saves me hours of work, and the real-time interaction keeps my students engaged even after class ends.</p>
              <div className="testimonial-author">
                <div className="author-avatar">DR</div>
                <div>
                  <div className="author-name">Dr. Rebecca Chen</div>
                  <div className="author-title">Computer Science Professor</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="quote">As a student working full-time, finding quality education that fits my schedule was challenging. With EduSphere, I can learn at my own pace and still feel connected to my instructors and classmates through real-time discussions.</p>
              <div className="testimonial-author">
                <div className="author-avatar">JM</div>
                <div>
                  <div className="author-name">James Miller</div>
                  <div className="author-title">Working Professional</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="quote">The intuitive design and powerful features make EduSphere perfect for our online academy. We've seen a 40% increase in student completion rates since switching to this platform. The AI tools are a game-changer!</p>
              <div className="testimonial-author">
                <div className="author-avatar">SK</div>
                <div>
                  <div className="author-name">Sarah Kim</div>
                  <div className="author-title">Online Academy Director</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div className="section-title">
            <h2>Choose Your Plan</h2>
            <p>Flexible pricing options designed to meet the needs of individual learners, educators, and institutions.</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3 className="pricing-title">Student</h3>
              <p className="pricing-subtitle">Perfect for individual learners</p>
              <div className="pricing-price">$9<span className="pricing-period">/month</span></div>
              <ul className="pricing-features">
                <li className="pricing-feature">Access to all courses</li>
                <li className="pricing-feature">AI-generated transcripts</li>
                <li className="pricing-feature">Mobile learning</li>
                <li className="pricing-feature">Community chat rooms</li>
                <li className="pricing-feature">Progress tracking</li>
              </ul>
              <a href="#" className="pricing-button">Choose Plan</a>
            </div>
            <div className="pricing-card featured">
              <h3 className="pricing-title">Teacher</h3>
              <p className="pricing-subtitle">For educators and content creators</p>
              <div className="pricing-price">$29<span className="pricing-period">/month</span></div>
              <ul className="pricing-features">
                <li className="pricing-feature">Everything in Student plan</li>
                <li className="pricing-feature">Course creation tools</li>
                <li className="pricing-feature">Unlimited video uploads</li>
                <li className="pricing-feature">Student analytics</li>
                <li className="pricing-feature">Priority support</li>
              </ul>
              <a href="#" className="pricing-button">Choose Plan</a>
            </div>
            <div className="pricing-card">
              <h3 className="pricing-title">Institution</h3>
              <p className="pricing-subtitle">For schools and organizations</p>
              <div className="pricing-price">$99<span className="pricing-period">/month</span></div>
              <ul className="pricing-features">
                <li className="pricing-feature">Everything in Teacher plan</li>
                <li className="pricing-feature">Multiple teacher accounts</li>
                <li className="pricing-feature">Custom branding</li>
                <li className="pricing-feature">API access</li>
                <li className="pricing-feature">Dedicated account manager</li>
              </ul>
              <a href="#" className="pricing-button">Choose Plan</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Transform Your Learning Experience?</h2>
          <p>Join thousands of students and educators already using EduSphere to create, learn, and grow together.</p>
          <div className="cta-form">
            <input type="email" placeholder="Enter your email" />
            <button>Get Started Free</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#" className="logo">
                <i className="fas fa-graduation-cap logo-icon"></i>
                Edu<span>Sphere</span>
              </a>
              <p>Transforming the way we teach and learn through innovative technology and collaborative education.</p>
              <div className="social-links">
                <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-link"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div className="footer-links">
              <h4>Platform</h4>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">How It Works</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Security</a></li>
                <li><a href="#">Accessibility</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 EduSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* CSS Styles */}
      <style jsx>{`
        :root {
            --primary: #4A56E2;
            --primary-dark: #3A46C2;
            --secondary: #6C63FF;
            --accent: #FF6B6B;
            --text: #333333;
            --text-light: #666666;
            --bg-light: #F8F9FA;
            --bg-dark: #1A1C2A;
            --white: #FFFFFF;
            --shadow: rgba(0, 0, 0, 0.1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
        }

        body {
            background-color: var(--bg-light);
            color: var(--text);
            overflow-x: hidden;
        }

        section {
            position: relative;
            padding: 80px 0;
            overflow: hidden;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            position: relative;
            z-index: 2;
        }

        /* Header Styles */
        header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            padding: 20px 0;
            background-color: rgba(255, 255, 255, 0.95);
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.06);
            z-index: 1000;
            transition: all 0.3s ease;
        }

        header.scrolled {
            padding: 12px 0;
            background-color: rgba(255, 255, 255, 0.98);
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .logo {
            display: flex;
            align-items: center;
            font-size: 24px;
            font-weight: 700;
            color: var(--primary);
            text-decoration: none;
        }

        .logo span {
            color: var(--accent);
        }

        .logo-icon {
            margin-right: 8px;
            font-size: 28px;
        }

        .nav-links {
            display: flex;
            gap: 32px;
        }

        .nav-links a {
            color: var(--text);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .nav-links a:hover {
            color: var(--primary);
        }

        .cta-buttons {
            display: flex;
            gap: 16px;
        }

        .btn {
            display: inline-block;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .btn-primary {
            background-color: var(--primary);
            color: white;
            border: none;
        }

        .btn-primary:hover {
            background-color: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(74, 86, 226, 0.3);
        }

        .btn-outline {
            border: 2px solid var(--primary);
            color: var(--primary);
            background-color: transparent;
        }

        .btn-outline:hover {
            background-color: var(--primary);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(74, 86, 226, 0.2);
        }

        /* Canvas for 3D model */
        #hero-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            z-index: 1;
        }

        /* Hero Section */
        .hero {
            height: 100vh;
            display: flex;
            align-items: center;
            padding-top: 60px;
            position: relative;
            overflow: hidden;
        }

        .hero-content {
            width: 50%;
            position: relative;
            z-index: 5;
            animation: fadeIn 1s ease-out;
        }

        .hero h1 {
            font-size: 4rem;
            font-weight: 800;
            margin-bottom: 24px;
            line-height: 1.2;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero p {
            font-size: 1.2rem;
            margin-bottom: 32px;
            color: var(--text-light);
            max-width: 90%;
            line-height: 1.6;
        }

        .hero-buttons {
            display: flex;
            gap: 16px;
            margin-top: 40px;
        }

        .stats-card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            margin-top: 48px;
            display: flex;
            gap: 24px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            width: fit-content;
        }

        .stat {
            text-align: center;
            padding: 0 16px;
            border-right: 1px solid #eee;
        }

        .stat:last-child {
            border-right: none;
        }

        .stat-number {
            font-size: 2.2rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 4px;
            display: block;
        }

        .stat-label {
            font-size: 0.9rem;
            color: var(--text-light);
        }

        /* Features Section */
        .features {
            background-color: white;
            position: relative;
        }

        .section-title {
            text-align: center;
            margin-bottom: 64px;
        }

        .section-title h2 {
            font-size: 2.5rem;
            margin-bottom: 16px;
            color: var(--primary);
        }

        .section-title p {
            font-size: 1.1rem;
            color: var(--text-light);
            max-width: 700px;
            margin: 0 auto;
            line-height: 1.6;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 32px;
            margin-top: 48px;
        }

        .feature-card {
            background-color: white;
            border-radius: 12px;
            padding: 32px 24px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
            transition: all 0.3s ease;
            border: 1px solid rgba(0, 0, 0, 0.03);
            position: relative;
            overflow: hidden;
        }

        .feature-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
.feature-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
            height: 64px;
            width: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            border-radius: 12px;
            background: rgba(74, 86, 226, 0.1);
            color: var(--primary);
            font-size: 24px;
        }

        .feature-card h3 {
            font-size: 1.4rem;
            margin-bottom: 16px;
            color: var(--text);
        }

        .feature-card p {
            color: var(--text-light);
            line-height: 1.6;
        }

        /* How It Works Section */
        .how-it-works {
            background-color: var(--bg-light);
            position: relative;
        }

        .step {
            display: flex;
            align-items: center;
            margin-bottom: 120px;
            opacity: 0;
            transform: translateY(40px);
            transition: all 0.8s ease;
        }

        .step:nth-child(even) {
            flex-direction: row-reverse;
        }

        .step.active {
            opacity: 1;
            transform: translateY(0);
        }

        .step:last-child {
            margin-bottom: 0;
        }

        .step-content {
            flex: 1;
            padding: 0 40px;
        }

        .step-image {
            flex: 1;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
        }

        .step-image img {
            width: 100%;
            height: auto;
            display: block;
            transition: transform 0.5s ease;
        }

        .step:hover .step-image img {
            transform: scale(1.03);
        }

        .step-number {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background-color: var(--primary);
            color: white;
            font-weight: 700;
            font-size: 1.2rem;
            margin-bottom: 16px;
        }

        .step-content h3 {
            font-size: 1.8rem;
            margin-bottom: 16px;
            color: var(--text);
        }

        .step-content p {
            color: var(--text-light);
            line-height: 1.6;
            margin-bottom: 24px;
        }

        /* Testimonials Section */
        .testimonials {
            background-color: white;
            position: relative;
        }

        .testimonial-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 32px;
            margin-top: 48px;
        }

        .testimonial-card {
            background-color: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
            transition: all 0.3s ease;
            border: 1px solid rgba(0, 0, 0, 0.03);
            opacity: 0;
            transform: scale(0.95);
            transition: all 0.5s ease;
        }

        .testimonial-card.active {
            opacity: 1;
            transform: scale(1);
        }

        .testimonial-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
        }

        .quote {
            font-size: 1.1rem;
            line-height: 1.6;
            color: var(--text);
            margin-bottom: 24px;
            position: relative;
        }

        .quote::before {
            content: '"';
            font-size: 4rem;
            color: rgba(74, 86, 226, 0.1);
            position: absolute;
            top: -20px;
            left: -10px;
            font-family: Georgia, serif;
        }

        .testimonial-author {
            display: flex;
            align-items: center;
        }

        .author-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            margin-right: 16px;
        }

        .author-name {
            font-weight: 600;
            color: var(--text);
            margin-bottom: 4px;
        }

        .author-title {
            font-size: 0.9rem;
            color: var(--text-light);
        }

        /* Pricing Section */
        .pricing {
            background-color: var(--bg-light);
            position: relative;
        }

        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 32px;
            margin-top: 48px;
        }

        .pricing-card {
            background-color: white;
            border-radius: 16px;
            padding: 48px 32px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
            transition: all 0.3s ease;
            text-align: center;
            position: relative;
            overflow: hidden;
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.5s ease;
        }

        .pricing-card.active {
            opacity: 1;
            transform: translateY(0);
        }

        .pricing-card.featured {
            transform: scale(1.05);
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
            border: 2px solid var(--primary);
        }

        .pricing-card.featured::before {
            content: 'Most Popular';
            position: absolute;
            top: 12px;
            right: -32px;
            background: var(--primary);
            color: white;
            padding: 8px 40px;
            font-size: 0.8rem;
            font-weight: 600;
            transform: rotate(45deg);
        }

        .pricing-title {
            font-size: 1.8rem;
            margin-bottom: 8px;
            color: var(--primary);
        }

        .pricing-subtitle {
            color: var(--text-light);
            margin-bottom: 24px;
        }

        .pricing-price {
            font-size: 3rem;
            font-weight: 700;
            color: var(--text);
            margin-bottom: 24px;
        }

        .pricing-period {
            font-size: 1rem;
            font-weight: 400;
            color: var(--text-light);
        }

        .pricing-features {
            list-style: none;
            margin-bottom: 32px;
            text-align: left;
        }

        .pricing-feature {
            padding: 12px 0;
            color: var(--text);
            position: relative;
            padding-left: 28px;
            border-bottom: 1px solid #f0f0f0;
        }

        .pricing-feature::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--primary);
            font-weight: 700;
        }

        .pricing-button {
            display: inline-block;
            padding: 12px 32px;
            background-color: var(--primary);
            color: white;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .pricing-button:hover {
            background-color: var(--primary-dark);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(74, 86, 226, 0.3);
        }

        /* CTA Section */
        .cta {
            background-color: var(--bg-dark);
            color: white;
            text-align: center;
            padding: 100px 0;
            position: relative;
            overflow: hidden;
        }

        .cta::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(120deg, var(--primary), var(--secondary));
            opacity: 0.8;
            z-index: 1;
        }

        .cta h2 {
            font-size: 2.5rem;
            margin-bottom: 16px;
            position: relative;
            z-index: 2;
        }

        .cta p {
            font-size: 1.2rem;
            margin-bottom: 40px;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            z-index: 2;
        }

        .cta-form {
            display: flex;
            max-width: 500px;
            margin: 0 auto;
            position: relative;
            z-index: 2;
        }

        .cta-form input {
            flex: 1;
            padding: 16px 20px;
            border-radius: 8px 0 0 8px;
            border: none;
            font-size: 1rem;
            outline: none;
        }

        .cta-form button {
            padding: 16px 24px;
            background-color: var(--accent);
            color: white;
            border: none;
            border-radius: 0 8px 8px 0;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .cta-form button:hover {
            background-color: #ff5151;
        }

        /* Footer */
        footer {
            background-color: var(--bg-dark);
            color: white;
            padding: 80px 0 40px;
        }

        .footer-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 64px;
            margin-bottom: 48px;
        }

        .footer-brand p {
            margin: 16px 0 24px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
        }

        .social-links {
            display: flex;
            gap: 16px;
        }

        .social-link {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .social-link:hover {
            background-color: var(--primary);
            transform: translateY(-3px);
        }

        .footer-links h4 {
            font-size: 1.2rem;
            margin-bottom: 24px;
            color: white;
        }

        .footer-links ul {
            list-style: none;
        }

        .footer-links li {
            margin-bottom: 12px;
        }

        .footer-links a {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .footer-links a:hover {
            color: white;
        }

        .footer-bottom {
            padding-top: 32px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.9rem;
        }

        /* Animation Classes */
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.5s ease;
        }

        .fade-in.active {
            opacity: 1;
            transform: translateY(0);
        }

        .scale-in {
            opacity: 0;
            transform: scale(0.95);
            transition: all 0.5s ease;
        }

        .scale-in.active {
            opacity: 1;
            transform: scale(1);
        }

        /* Loader */
        .loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }

        .loader.hidden {
            opacity: 0;
            visibility: hidden;
        }

        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(74, 86, 226, 0.2);
            border-top: 4px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Mobile Responsive Styles */
        .hamburger {
            display: none;
            background: none;
            border: none;
            font-size: 24px;
            color: var(--text);
            cursor: pointer;
        }

        @media screen and (max-width: 1024px) {
            .hero-content {
                width: 70%;
            }
            
            .hero h1 {
                font-size: 3.5rem;
            }
            
            .footer-grid {
                grid-template-columns: 1fr 1fr;
                gap: 40px;
            }
        }

        @media screen and (max-width: 768px) {
            .nav-links, .cta-buttons {
                display: none;
            }
            
            .hamburger {
                display: block;
            }
            
            .hero-content {
                width: 100%;
                text-align: center;
            }
            
            .hero h1 {
                font-size: 3rem;
            }
            
            .hero p {
                margin-left: auto;
                margin-right: auto;
            }
            
            .hero-buttons {
                justify-content: center;
            }
            
            .stats-card {
                margin-left: auto;
                margin-right: auto;
            }
            
            .step, .step:nth-child(even) {
                flex-direction: column;
                text-align: center;
            }
            
            .step-content {
                margin-bottom: 40px;
            }
            
            .step-number {
                margin-left: auto;
                margin-right: auto;
            }
            
            .cta-form {
                flex-direction: column;
            }
            
            .cta-form input {
                border-radius: 8px;
                margin-bottom: 16px;
            }
            
            .cta-form button {
                border-radius: 8px;
            }
            
            .footer-grid {
                grid-template-columns: 1fr;
            }
        }

        @media screen and (max-width: 480px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .section-title h2 {
                font-size: 2rem;
            }
            
            .stats-card {
                flex-direction: column;
                width: 100%;
            }
            
            .stat {
                border-right: none;
                border-bottom: 1px solid #eee;
                padding: 16px 0;
            }
            
            .stat:last-child {
                border-bottom: none;
            }
        }
      `}</style>
    </>
  );
};

export default EduSphere;
