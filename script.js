
        let scene, camera, renderer, neuralMesh, centerpieceParticles;
        function init3D() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-3d'), alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            const geometry = new THREE.TorusKnotGeometry(2.5, 0.6, 150, 20);
            neuralMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.1 }));
            scene.add(neuralMesh);

            const pPos = new Float32Array(3500 * 3);
            for(let i=0; i<pPos.length; i++) pPos[i] = (Math.random() - 0.5) * 25;
            const pGeo = new THREE.BufferGeometry();
            pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
            centerpieceParticles = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.015, color: 0xffffff, transparent: true, opacity: 0.25 }));
            scene.add(centerpieceParticles);

            camera.position.z = 8;
            function animate() {
                requestAnimationFrame(animate);
                neuralMesh.rotation.y += 0.0012; neuralMesh.rotation.x += 0.0006;
                centerpieceParticles.rotation.y -= 0.0002;
                renderer.render(scene, camera);
            }
            animate();
        }

        let audioCtx;
        function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); }
        function playNote(freq) {
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(); osc.stop(audioCtx.currentTime + 1.4);
        }

        function setupSkillPositions() {
            const bubbles = document.querySelectorAll('.skill-bubble');
            const cols = 5;
            bubbles.forEach((b, i) => {
                const col = i % cols;
                const row = Math.floor(i / cols);
                b.style.left = `${10 + (col * 18)}%`;
                b.style.top = `${12 + (row * 28)}%`;
                b.style.setProperty('--brand-color', b.dataset.brand);
            });
        }

        function boot() {
            gsap.registerPlugin(ScrollTrigger);
            let progress = 0;
            const loop = setInterval(() => {
                progress += Math.floor(Math.random()*5)+2;
                if(progress >= 100) {
                    progress = 100; clearInterval(loop);
                    const tl = gsap.timeline();
                    tl.to('#preloader', { y: '-100%', duration: 1.2, ease: 'expo.inOut', delay: 0.4 });
                    tl.to('main', { visibility: 'visible', opacity: 1, filter: 'blur(0px)', duration: 0.8 }, "-=0.5");
                    tl.add(() => {
                        document.getElementById('preloader').style.display = 'none';
                        init3D(); initScrollEffects(); initInteractiveDesign(); runHacker(); setupSkillPositions(); updateInteractions();
                    });
                }
                document.getElementById('loader-perc').innerText = progress;
            }, 50);

            const form = document.getElementById('portfolio-form');
            if(form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('submit-btn');
                    btn.innerText = "DISPATCHING...";
                    try {
                        const formData = new FormData(form);
                        const res = await fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: formData });
                        if(res.ok) { openStatus("Transmission Success", "Connection established with Raj. I will respond via neural link shortly.", 'fa-paper-plane'); form.reset(); }
                    } catch (err) { openStatus("Error", "Transmission interrupted."); }
                    finally { btn.innerText = "Dispatch Signal"; }
                });
            }
        }

        function initScrollEffects() {
            document.querySelectorAll('section').forEach(section => {
                const nodes = section.querySelectorAll('.reveal-node');
                gsap.fromTo(nodes, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.25, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 85%", toggleActions: "play none none reverse" } });
            });
            document.querySelectorAll('.skill-bubble').forEach(b => {
                gsap.to(b, { y: "random(-15, 15)", x: "random(-15, 15)", duration: "random(2.5, 4.5)", repeat: -1, yoyo: true, ease: "sine.inOut" });
                b.addEventListener('mouseenter', () => playNote(parseFloat(b.dataset.note)));
            });
        }

        function initInteractiveDesign() {
            document.querySelectorAll('.magnetic, .heading-reflect, .skill-bubble, .social-btn').forEach(item => {
                item.addEventListener('mousemove', (e) => {
                    const r = item.getBoundingClientRect();
                    gsap.to(item, { x: (e.clientX - r.left - r.width/2) * 0.35, y: (e.clientY - r.top - r.height/2) * 0.35, duration: 0.3, ease: "power2.out" });
                });
                item.addEventListener('mouseleave', () => { gsap.to(item, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" }); });
            });
        }

        function updateInteractions() {
            document.querySelectorAll('.spotlight-btn, .nav-cta, .run-btn, .social-btn').forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const r = btn.getBoundingClientRect();
                    btn.style.setProperty('--x', `${((e.clientX - r.left) / r.width) * 100}%`);
                    btn.style.setProperty('--y', `${((e.clientY - r.top) / r.height) * 100}%`);
                });
            });
        }

        function runHacker() {
            const phrases = ["Data Scientist", "AI Specialist", "ML Engineer", "DSA Expert"];
            let idx = 0; const el = document.querySelector('.hacker-text');
            const tick = () => {
                let iter = 0; const target = phrases[idx];
                const interval = setInterval(() => {
                    el.innerText = target.split("").map((c, i) => i < iter ? target[i] : "10ABCXYZ"[Math.floor(Math.random()*8)]).join("");
                    if(iter >= target.length) { clearInterval(interval); setTimeout(() => { idx = (idx+1)%phrases.length; tick(); }, 2500); }
                    iter += 1/3;
                }, 35);
            };
            tick();
        }

        function openStatus(title, desc, icon = 'fa-microchip') {
            const modal = document.getElementById('status-modal');
            const iconEl = document.getElementById('modal-icon');
            const titleEl = document.getElementById('modal-title');
            const descEl = document.getElementById('modal-desc');

            iconEl.className = `fas ${icon}`;
            titleEl.innerText = title;
            descEl.innerText = desc;
            modal.classList.add('active');

            gsap.set([titleEl, descEl], { opacity: 0, y: 15 });
            const tl = gsap.timeline({delay: 0.5});
            tl.to(titleEl, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
              .to(descEl, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3");
        }

        function closeModal() { document.getElementById('status-modal').classList.remove('active'); }

        window.addEventListener('mousemove', (e) => {
            if(!centerpieceParticles) return;
            gsap.to(centerpieceParticles.rotation, { y: (e.clientX/window.innerWidth - 0.5) * 0.4, x: (e.clientY/window.innerHeight - 0.5) * 0.4, duration: 2 });
        });

        document.addEventListener('DOMContentLoaded', boot);
        window.addEventListener('mousedown', initAudio, { once: true });
        window.addEventListener('resize', () => { if(camera && renderer) { camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); setupSkillPositions(); } });

        const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const btn = contactForm.querySelector('.btn-send');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        fetch("https://formsubmit.co/ajax/rathodraj1504@gmail.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: document.getElementById('msg-name').value,
                email: document.getElementById('msg-email').value,
                message: document.getElementById('msg-content').value
            })
        })
        .then(res => res.json())
        .then(() => {
            openStatus(
                "Message Sent",
                "Your message has been successfully delivered. I’ll get back to you soon.",
                "fa-paper-plane"
            );
            contactForm.reset();
        })
        .catch(() => {
            openStatus(
                "Error",
                "Something went wrong. Please check your internet connection.",
                "fa-triangle-exclamation"
            );
        })
        .finally(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        });
    });
}
