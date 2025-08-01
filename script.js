gsap.registerPlugin(ScrollTrigger);

// 1. Animate the main background gradient
gsap.to("body", {
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5
    },
    '--start-bg': '#0f0c29',
    '--end-bg': '#232526'
});


// --- HERO SECTION PARALLAX ---
gsap.to("#hero-title", {
    y: "-30vh", 
    opacity: 0,
    ease: "none",
    scrollTrigger: {
        trigger: "#hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 1.5 
    }
});

gsap.to(".hero-bg", {
    y: "15vh", 
    opacity: 0,
    ease: "none",
    scrollTrigger: {
        trigger: "#hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 1.5
    }
});


// --- MECHANICAL ERA ANIMATIONS (UNCHANGED) ---
let track = document.querySelector("#mechanical-era .horizontal-track");
let scrollAmount = track.scrollWidth - window.innerWidth;

gsap.utils.toArray("#mechanical-era .gear").forEach((gear, i) => {
    const speed = parseFloat(gear.dataset.speed) || 1;
    const direction = i % 2 === 0 ? 1 : -1;
    gsap.to(gear, {
        rotation: 360 * speed * direction, 
        ease: "none",
        scrollTrigger: {
            trigger: "#mechanical-era",
            start: "top top",
            end: () => `+=${scrollAmount}`, 
            scrub: 1.5
        }
    });
});

gsap.to(track, {
    x: -scrollAmount,
    ease: "none",
    scrollTrigger: {
        trigger: "#mechanical-era",
        start: "top top",
        end: () => `+=${scrollAmount}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
    }
});


// --- ELECTRONIC ERA ANIMATIONS (Interactive Grid) ---
const electronicEraSection = document.getElementById('electronic-era');
const pcCanvas = document.getElementById('pc-canvas');

if (pcCanvas && electronicEraSection) {
    const pcCtx = pcCanvas.getContext('2d');
    pcCanvas.width = window.innerWidth;
    pcCanvas.height = window.innerHeight;
    const mouse = { x: undefined, y: undefined };

    electronicEraSection.addEventListener('mousemove', (event) => {
        const rect = pcCanvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });
    electronicEraSection.addEventListener('mouseleave', () => { mouse.x = undefined; mouse.y = undefined; });
    
    const gridSize = 30, baseDotSize = 1, maxDotSize = 3, mouseEffectRadius = 200;
    function drawGrid() {
        for (let x = 0; x < pcCanvas.width; x += gridSize) {
            for (let y = 0; y < pcCanvas.height; y += gridSize) {
                const dx = x - mouse.x; const dy = y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                let size = baseDotSize, opacity = 0.2;
                if (distance < mouseEffectRadius) {
                    const effect = 1 - (distance / mouseEffectRadius);
                    size = baseDotSize + (maxDotSize - baseDotSize) * effect;
                    opacity = 0.2 + 0.8 * effect;
                }
                pcCtx.beginPath(); pcCtx.arc(x, y, size, 0, Math.PI * 2);
                pcCtx.fillStyle = `rgba(0, 255, 255, ${opacity})`;
                pcCtx.fill();
            }
        }
    }
    function animatePcCanvas() {
        pcCtx.clearRect(0, 0, pcCanvas.width, pcCanvas.height);
        drawGrid();
        requestAnimationFrame(animatePcCanvas);
    }
    animatePcCanvas();
    window.addEventListener('resize', () => { pcCanvas.width = window.innerWidth; pcCanvas.height = window.innerHeight; });
}

let electronicTrack = document.querySelector("#electronic-era .horizontal-track");
let electronicScrollAmount = electronicTrack.scrollWidth - window.innerWidth;
const horizontalScrollTween = gsap.to(electronicTrack, {
    x: -electronicScrollAmount, ease: "none",
    scrollTrigger: {
        trigger: "#electronic-era", start: "top top", end: () => `+=${electronicScrollAmount}`,
        pin: true, scrub: 1, invalidateOnRefresh: true
    }
});

const eniacPanel = document.querySelector("#electronic-era .panel-3");
const eniacImage = eniacPanel.querySelector("img");
const eniacContent = eniacPanel.querySelector(".panel-content");
if (eniacContent) {
    const eniacTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: eniacPanel, containerAnimation: horizontalScrollTween,
            start: "left center", end: "right center", scrub: true,
        }
    });
    eniacTimeline
        .set(eniacContent, { opacity: 0 })
        .to(eniacImage, { scale: 3.2, ease: "power1.inOut" })
        .to(eniacContent, { position: 'absolute', bottom: '7%', left: '5%', zIndex: 3, opacity: 1, ease: "power1.in" });
}


// --- PC ERA ANIMATIONS (Corrected) ---
const codeCanvas = document.getElementById('pc-code-canvas');
if (codeCanvas) {
    const codeCtx = codeCanvas.getContext('2d');
    codeCanvas.width = window.innerWidth;
    codeCanvas.height = window.innerHeight;

    const codeSnippets = [
        { text: '#include <stdio.h>....................................................................................................................', x: 80, y: 100, progress: 0 },
        { text: '#include <string.h>..................................................................................................................', x: 80, y: 130, progress: 0 },
        { text: 'void greetUser(char* name) {..............................................................................................................', x: 100, y: 180, progress: 0 },
        { text: 'printf("Hello, %s!\\n", name);...................................................................................................', x: 120, y: 210, progress: 0 },
        { text: '}', x: 100, y: 240, progress: 0 },
        { text: 'int factorial(int n) {........................................................................................................', x: 100, y: 280, progress: 0 },
        { text: '    if (n == 0 || n == 1) return 1;...........................................................................................', x: 120, y: 310, progress: 0 },
        { text: '    return n * factorial(n - 1);...................................................................................................', x: 120, y: 340, progress: 0 },
        { text: '}', x: 100, y: 370, progress: 0 },
        { text: 'int main() {...................................................................................................................', x: 80, y: 420, progress: 0 },
        { text: '    char name[20];............................................................................................................................', x: 100, y: 450, progress: 0 },
        { text: '    printf("Hi, Kindly enter your name: ");.........................................................................................', x: 100, y: 480, progress: 0 },
        { text: '    scanf("%s", name);...............................................................................................................', x: 100, y: 510, progress: 0 },
        { text: '    greetUser(name);...................................................................................................................', x: 100, y: 540, progress: 0 },
        { text: '    for (int i = 1; i <= 5; i++) {...................................................................................................', x: 100, y: 580, progress: 0 },
        { text: '        printf("Factorial of %d is %d\\n", i, factorial(i));....................................................................................', x: 120, y: 610, progress: 0 },
        { text: '    }.......................................................................................................................................', x: 100, y: 640, progress: 0 },
        { text: '    int sum = 0;..............................................................................................................................', x: 100, y: 680, progress: 0 },
        { text: '    for (int i = 0; i < 10; i++) {...................................................................................................................', x: 100, y: 710, progress: 0 },
        { text: '        sum += i;.......................................................................................................................', x: 120, y: 740, progress: 0 },
        { text: '    }........................................................................................................................................', x: 100, y: 770, progress: 0 },
        { text: '    printf("Sum is: %d\\n", sum);............................................................................................................', x: 100, y: 800, progress: 0 },
        { text: '    return 0;...........................................................................................................................', x: 100, y: 830, progress: 0 },
        { text: '}.....................................................................................................................................................', x: 80, y: 860, progress: 0 }
    ];
    

    codeCtx.font = '18px monospace';
    codeCtx.fillStyle = '#39FF14';

    function renderCode() {
        codeCtx.clearRect(0, 0, codeCanvas.width, codeCanvas.height);
        codeCtx.fillStyle = 'black';
        codeCtx.fillRect(0, 0, codeCanvas.width, codeCanvas.height);
        codeCtx.fillStyle = '#39FF14';
        codeSnippets.forEach(snippet => {
            const typedText = snippet.text.substring(0, Math.round(snippet.progress));
            codeCtx.fillText(typedText, snippet.x, snippet.y);
        });
    }

    let pcScrollAmountForTimeline = document.querySelector("#pc-era .horizontal-track").scrollWidth - window.innerWidth;

    const codeTypingTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: "#pc-era",
            start: "top top",
            end: () => `+=${pcScrollAmountForTimeline}`,
            scrub: 1.5,
            onUpdate: renderCode, 
        }
    });

    codeSnippets.forEach(snippet => {
        codeTypingTimeline.to(snippet, {
            progress: snippet.text.length,
            ease: "none"
        }, ">-0.5");
    });
    
    renderCode(); // Initial render

    window.addEventListener('resize', () => { 
        codeCanvas.width = window.innerWidth; 
        codeCanvas.height = window.innerHeight; 
        pcScrollAmountForTimeline = document.querySelector("#pc-era .horizontal-track").scrollWidth - window.innerWidth;
        renderCode(); 
    });
}

// This animation handles the pinning and horizontal movement
let pcTrack = document.querySelector("#pc-era .horizontal-track");
let pcScrollAmount = pcTrack.scrollWidth - window.innerWidth;
gsap.to(pcTrack, {
    x: -pcScrollAmount,
    ease: "none",
    scrollTrigger: {
        trigger: "#pc-era",
        start: "top top",
        end: () => `+=${pcScrollAmount}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
    }
});

// --- INTERNET ERA ANIMATIONS (Particle Network) ---
const internetCanvas = document.getElementById('electronic-canvas');
if (internetCanvas) {
    const iCtx = internetCanvas.getContext('2d');
    internetCanvas.width = window.innerWidth;
    internetCanvas.height = window.innerHeight;
    const iCanvasSettings = { lineOpacity: 0.2, maxDistance: 120 };
    let iParticlesArray;
    class IParticle {
        constructor(x, y, dX, dY, size) { this.x = x; this.y = y; this.directionX = dX; this.directionY = dY; this.size = size; }
        draw() { iCtx.beginPath(); iCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); iCtx.fillStyle = 'rgba(0, 255, 255, 0.8)'; iCtx.fill(); }
        update() {
            if (this.x > internetCanvas.width || this.x < 0) { this.directionX = -this.directionX; }
            if (this.y > internetCanvas.height || this.y < 0) { this.directionY = -this.directionY; }
            this.x += this.directionX; this.y += this.directionY; this.draw();
        }
    }
    function iInitCanvas() {
        iParticlesArray = []; let num = (internetCanvas.height * internetCanvas.width) / 9000;
        for (let i = 0; i < num; i++) {
            let size = (Math.random() * 2) + 1; let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2); let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let dX = (Math.random() * 0.4) - 0.2; let dY = (Math.random() * 0.4) - 0.2;
            iParticlesArray.push(new IParticle(x, y, dX, dY, size));
        }
    }
    function iConnect() {
        for (let a = 0; a < iParticlesArray.length; a++) {
            for (let b = a; b < iParticlesArray.length; b++) {
                let dist = ((iParticlesArray[a].x - iParticlesArray[b].x) * (iParticlesArray[a].x - iParticlesArray[b].x)) + ((iParticlesArray[a].y - iParticlesArray[b].y) * (iParticlesArray[a].y - iParticlesArray[b].y));
                if (dist < (iCanvasSettings.maxDistance * iCanvasSettings.maxDistance)) {
                    iCtx.strokeStyle = `rgba(0, 255, 255, ${iCanvasSettings.lineOpacity})`; iCtx.lineWidth = 1; iCtx.beginPath(); iCtx.moveTo(iParticlesArray[a].x, iParticlesArray[a].y); iCtx.lineTo(iParticlesArray[b].x, iParticlesArray[b].y); iCtx.stroke();
                }
            }
        }
    }
    function iAnimateCanvas() {
        requestAnimationFrame(iAnimateCanvas); iCtx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < iParticlesArray.length; i++) { iParticlesArray[i].update(); }
        iConnect();
    }
    iInitCanvas(); iAnimateCanvas();
    window.addEventListener('resize', () => { internetCanvas.width = innerWidth; internetCanvas.height = innerHeight; iInitCanvas(); });
    
    let internetScrollAmount = document.querySelector("#internet-era .horizontal-track").scrollWidth - window.innerWidth;
    gsap.to(iCanvasSettings, {
        maxDistance: 250, lineOpacity: 0.9,
        scrollTrigger: {
            trigger: "#internet-era", start: "top top", end: () => `+=${internetScrollAmount}`, scrub: 1.5,
        }
    });
}

let internetTrack = document.querySelector("#internet-era .horizontal-track");
let internetScrollAmount = internetTrack.scrollWidth - window.innerWidth;
gsap.to(internetTrack, {
    x: -internetScrollAmount, ease: "none",
    scrollTrigger: {
        trigger: "#internet-era", start: "top top", end: () => `+=${internetScrollAmount}`,
        pin: true, scrub: 1, invalidateOnRefresh: true
    }
});


// --- AI ERA ANIMATIONS (NEW NEURAL NETWORK BG) ---
const aiCanvas = document.getElementById('ai-canvas');
if (aiCanvas) {
    const aiCtx = aiCanvas.getContext('2d');
    aiCanvas.width = window.innerWidth;
    aiCanvas.height = window.innerHeight;

    // --- Animation State ---
    const aiState = {
        neuronGlow: 0,
        connectionDensity: 0,
        pulseSpeed: 0,
        time: 0
    };

    // --- Neurons and Connections ---
    const neurons = [];
    const numNeurons = 100;
    for (let i = 0; i < numNeurons; i++) {
        neurons.push({
            x: Math.random() * aiCanvas.width,
            y: Math.random() * aiCanvas.height,
            radius: Math.random() * 2 + 1
        });
    }

    // --- Rendering Loop ---
    function renderAiNetwork() {
        aiCtx.clearRect(0, 0, aiCanvas.width, aiCanvas.height);
        
        // Draw Connections
        aiCtx.strokeStyle = 'rgba(150, 50, 255, 0.4)';
        aiCtx.lineWidth = 0.5;
        for (let i = 0; i < Math.floor(numNeurons * aiState.connectionDensity); i++) {
            for (let j = i + 1; j < Math.floor(numNeurons * aiState.connectionDensity); j++) {
                let dist = Math.hypot(neurons[i].x - neurons[j].x, neurons[i].y - neurons[j].y);
                if (dist < 120) {
                    aiCtx.beginPath();
                    aiCtx.moveTo(neurons[i].x, neurons[i].y);
                    aiCtx.lineTo(neurons[j].x, neurons[j].y);
                    aiCtx.stroke();
                }
            }
        }
        
        // Draw Data Pulses
        aiState.time += aiState.pulseSpeed;
        const pulseProgress = aiState.time % 100 / 100;
        if (aiState.pulseSpeed > 0.01) {
             for (let i = 0; i < Math.floor(numNeurons * aiState.connectionDensity); i++) {
                for (let j = i + 1; j < Math.floor(numNeurons * aiState.connectionDensity); j++) {
                    let dist = Math.hypot(neurons[i].x - neurons[j].x, neurons[i].y - neurons[j].y);
                     if (dist < 120 && (i+j) % 5 === 0) { // Only show pulses on some lines
                        let pulseX = neurons[i].x + (neurons[j].x - neurons[i].x) * pulseProgress;
                        let pulseY = neurons[i].y + (neurons[j].y - neurons[i].y) * pulseProgress;
                        aiCtx.beginPath();
                        aiCtx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
                        aiCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        aiCtx.fill();
                    }
                }
            }
        }

        // Draw Neurons
        neurons.forEach(neuron => {
            aiCtx.beginPath();
            aiCtx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2);
            aiCtx.fillStyle = 'rgba(200, 150, 255, 0.8)';
            aiCtx.shadowColor = 'magenta';
            aiCtx.shadowBlur = aiState.neuronGlow * 20;
            aiCtx.fill();
            aiCtx.shadowBlur = 0; // Reset shadow
        });
    }

    // --- GSAP Timeline ---
    let aiScrollAmount = document.querySelector("#ai-era .horizontal-track").scrollWidth - window.innerWidth;
    gsap.timeline({
        scrollTrigger: {
            trigger: '#ai-era',
            start: 'top top',
            end: `+=${aiScrollAmount}`,
            scrub: 1,
            onUpdate: renderAiNetwork
        }
    })
    .to(aiState, {
        neuronGlow: 1,
        connectionDensity: 1,
        pulseSpeed: 0.5,
        ease: 'power1.inOut'
    });

    renderAiNetwork(); // Initial render
}
let aiTrack = document.querySelector("#ai-era .horizontal-track");
let aiScrollAmount = aiTrack.scrollWidth - window.innerWidth;
gsap.to(aiTrack, {
    x: -aiScrollAmount, ease: "none",
    scrollTrigger: {
        trigger: "#ai-era", start: "top top", end: () => `+=${aiScrollAmount}`,
        pin: true, scrub: 1, invalidateOnRefresh: true
    }
});

// --- Other parallax BG animations ---
gsap.utils.toArray(".parallax-bg").forEach(bg => {
    gsap.to(bg, {
        backgroundPosition: `50% 100%`,
        scrollTrigger: {
            trigger: bg.parentElement, start: "top bottom", end: "bottom top", scrub: true
        }
    });
});

// --- THANK YOU SECTION PARALLAX ---
gsap.from("#thank-you-content", {
    y: "50vh", 
    opacity: 0,
    ease: "none",
    scrollTrigger: {
        trigger: "#thank-you-section",
        start: "top bottom", 
        end: "bottom bottom", 
        scrub: 1.5
    }
});

gsap.from(".thank-you-bg", {
    opacity: 0,
    ease: "none",
    scrollTrigger: {
        trigger: "#thank-you-section",
        start: "top bottom",
        end: "center center", 
        scrub: 1.5
    }
});