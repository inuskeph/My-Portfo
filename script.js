// ===== THREE.JS 3D BACKGROUND =====
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 15;
    posArray[i + 1] = (Math.random() - 0.5) * 15;
    posArray[i + 2] = (Math.random() - 0.5) * 15;

    // Purple to cyan gradient colors
    const t = Math.random();
    colorsArray[i] = 0.42 * (1 - t) + 0.0 * t;     // R
    colorsArray[i + 1] = 0.39 * (1 - t) + 0.96 * t; // G
    colorsArray[i + 2] = 1.0 * (1 - t) + 0.83 * t;  // B
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);


// Create floating geometric shapes
const geometries = [];

// Wireframe Torus
const torusGeometry = new THREE.TorusGeometry(1.5, 0.05, 16, 100);
const torusMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x6c63ff, 
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(4, 0, -3);
scene.add(torus);
geometries.push(torus);

// Wireframe Octahedron
const octGeometry = new THREE.OctahedronGeometry(0.8, 0);
const octMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x00f5d4, 
    wireframe: true,
    transparent: true,
    opacity: 0.4
});
const octahedron = new THREE.Mesh(octGeometry, octMaterial);
octahedron.position.set(-4, 2, -2);
scene.add(octahedron);
geometries.push(octahedron);

// Wireframe Icosahedron
const icoGeometry = new THREE.IcosahedronGeometry(1, 0);
const icoMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xff6b6b, 
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
icosahedron.position.set(-3, -2, -4);
scene.add(icosahedron);
geometries.push(icosahedron);

// Small floating cubes
for (let i = 0; i < 5; i++) {
    const cubeGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const cubeMat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0x6c63ff : 0x00f5d4,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    cube.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5 - 3
    );
    scene.add(cube);
    geometries.push(cube);
}

camera.position.z = 5;

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});


// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.02;
    targetY += (mouseY - targetY) * 0.02;

    // Rotate particles
    particlesMesh.rotation.y = elapsed * 0.05;
    particlesMesh.rotation.x = elapsed * 0.03;
    particlesMesh.rotation.y += targetX * 0.1;
    particlesMesh.rotation.x += targetY * 0.1;

    // Animate geometric shapes
    torus.rotation.x = elapsed * 0.3;
    torus.rotation.y = elapsed * 0.2;
    torus.position.y = Math.sin(elapsed * 0.5) * 0.5;

    octahedron.rotation.x = elapsed * 0.4;
    octahedron.rotation.z = elapsed * 0.3;
    octahedron.position.y = 2 + Math.sin(elapsed * 0.7) * 0.3;

    icosahedron.rotation.y = elapsed * 0.3;
    icosahedron.rotation.z = elapsed * 0.2;
    icosahedron.position.y = -2 + Math.cos(elapsed * 0.6) * 0.4;

    // Animate small cubes
    geometries.slice(3).forEach((cube, i) => {
        cube.rotation.x = elapsed * (0.2 + i * 0.1);
        cube.rotation.y = elapsed * (0.3 + i * 0.1);
        cube.position.y += Math.sin(elapsed + i) * 0.001;
    });

    // Camera subtle movement
    camera.position.x = targetX * 0.3;
    camera.position.y = targetY * 0.3;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===== LOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 2000);
});


// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorFollower.style.left = e.clientX + 'px';
    cursorFollower.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, .btn, .skill-card, .contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorFollower.style.width = '60px';
        cursorFollower.style.height = '60px';
        cursorFollower.style.borderColor = '#6c63ff';
    });
    el.addEventListener('mouseleave', () => {
        cursorFollower.style.width = '40px';
        cursorFollower.style.height = '40px';
        cursorFollower.style.borderColor = 'rgba(139, 131, 255, 0.5)';
    });
});

// ===== NAVIGATION =====
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});


// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Animate skill bars
            if (entry.target.classList.contains('skill-card')) {
                const progressBar = entry.target.querySelector('.skill-progress');
                if (progressBar) {
                    const width = progressBar.getAttribute('data-width');
                    setTimeout(() => {
                        progressBar.style.width = width + '%';
                    }, 300);
                }
            }

            // Animate stat numbers
            if (entry.target.classList.contains('about-section')) {
                animateNumbers();
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.skill-card, .about-section, .resume-card, .contact-card').forEach(el => {
    observer.observe(el);
});

// ===== NUMBER ANIMATION =====
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(num => {
        const target = parseInt(num.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateNumber = () => {
            current += increment;
            if (current < target) {
                num.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                num.textContent = target;
            }
        };

        updateNumber();
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== PARALLAX ON SCROLL =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    // Parallax effect for the 3D scene
    if (particlesMesh) {
        particlesMesh.position.y = scrolled * 0.001;
    }
});

// ===== TILT EFFECT ON CARDS =====
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== TYPING EFFECT FOR GREETING =====
const greetingText = document.querySelector('.greeting-text');
if (greetingText) {
    const text = greetingText.textContent;
    greetingText.textContent = '';
    let i = 0;
    
    setTimeout(() => {
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                greetingText.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }, 2500);
}

console.log('%c Mark Bryan Bueno Portfolio ', 'background: linear-gradient(135deg, #6c63ff, #00f5d4); color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
