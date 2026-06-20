/**
 * KUPU PHOTOBOOTH - 3 Grid IG Story App Logic
 */

// IMGBB API KEY CONFIGURATION
// Silakan dapatkan API Key gratis Anda di https://api.imgbb.com/ dan masukkan di sini
const IMGBB_API_KEY = "fc0ab04451ee4654d2185f9f13f35404";

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const cursor = document.getElementById("butterfly-cursor");
    const bgContainer = document.getElementById("butterfly-bg-container");
    
    // Screens
    const screenCamera = document.getElementById("screen-camera");
    const screenEditor = document.getElementById("screen-editor");
    const allScreens = [screenCamera, screenEditor];

    // Camera Page Elements
    const videoElement = document.getElementById("camera-video");
    const countdownOverlay = document.getElementById("countdown-overlay");
    const countdownNumber = document.getElementById("countdown-number");
    const flashEffect = document.getElementById("flash-effect");
    const takeIndicator = document.getElementById("take-indicator");
    const triggerCaptureBtn = document.getElementById("trigger-capture-btn");

    // Editor Page Elements
    const photostripPreview = document.getElementById("photostrip-preview");
    const stickerWorkspace = document.getElementById("sticker-workspace");
    const watermarkPickerButtons = document.querySelectorAll("#watermark-picker-grid button");
    const stripWatermarkText = document.getElementById("strip-watermark-text");
    const downloadCollageBtn = document.getElementById("download-collage-btn");
    const retakePhotosBtn = document.getElementById("retake-photos-btn");

    // QR Modal Elements
    const qrModal = document.getElementById("qr-modal");
    const closeQrModalBtn = document.getElementById("close-qr-modal-btn");
    const qrStatusIcon = document.getElementById("qr-status-icon");
    const qrModalTitle = document.getElementById("qr-modal-title");
    const qrModalDesc = document.getElementById("qr-modal-desc");
    const qrCodeContainer = document.getElementById("qr-code-container");
    const qrCodeImg = document.getElementById("qr-code-img");
    const qrActionBtn = document.getElementById("qr-action-btn");

    // Controls
    const toast = document.getElementById("status-toast");

    // ==========================================
    // PREDEFINED FRAME DESIGNS (TEMPLATES)
    // ==========================================
    const templates = [
        {
            id: "classic-white",
            name: "Putih Klasik",
            bg: "#ffffff",
            isGradient: false,
            textColor: "#8f5151",
            decorations: [] // clean layout
        },
        {
            id: "pink-butterfly",
            name: "Kupu Pink",
            bg: "#ffe3e3",
            isGradient: false,
            textColor: "#8f5151",
            decorations: [
                { emoji: "🦋", x: 18, y: 15, scale: 1.1, angle: -15 },
                { emoji: "✨", x: 275, y: 35, scale: 0.8, angle: 10 },
                { emoji: "🦋", x: 278, y: 195, scale: 0.9, angle: 25 },
                { emoji: "🌸", x: 12, y: 345, scale: 0.85, angle: -10 },
                { emoji: "🦋", x: 18, y: 505, scale: 1.25, angle: -30 },
                { emoji: "✨", x: 275, y: 475, scale: 0.8, angle: 15 }
            ]
        },
        {
            id: "lavender-dream",
            name: "Mimpi Lavender",
            bg: "#e3e3ff",
            isGradient: false,
            textColor: "#544078",
            decorations: [
                { emoji: "🌸", x: 280, y: 15, scale: 0.9, angle: 0 },
                { emoji: "🦋", x: 15, y: 135, scale: 1.15, angle: 20 },
                { emoji: "✨", x: 12, y: 300, scale: 0.8, angle: -15 },
                { emoji: "🌸", x: 285, y: 355, scale: 0.9, angle: 15 },
                { emoji: "🦋", x: 278, y: 505, scale: 1.1, angle: -10 }
            ]
        },
        {
            id: "midnight-star",
            name: "Bintang Malam",
            bg: "#0c182d",
            isGradient: false,
            textColor: "#efe6dd",
            decorations: [
                { emoji: "✨", x: 18, y: 25, scale: 0.95, angle: 5 },
                { emoji: "🌙", x: 280, y: 65, scale: 1.1, angle: -15 },
                { emoji: "✨", x: 282, y: 250, scale: 0.8, angle: 20 },
                { emoji: "✨", x: 12, y: 395, scale: 0.85, angle: -10 },
                { emoji: "🌙", x: 20, y: 500, scale: 1.05, angle: 10 }
            ]
        },
        {
            id: "hologram-flow",
            name: "Kupu Hologram",
            bg: "gradient-metallic",
            isGradient: true,
            textColor: "#4a3c61",
            decorations: [
                { emoji: "🦋", x: 275, y: 25, scale: 1.1, angle: -10 },
                { emoji: "✨", x: 12, y: 85, scale: 0.75, angle: 15 },
                { emoji: "🦋", x: 15, y: 260, scale: 1.05, angle: 20 },
                { emoji: "✨", x: 278, y: 310, scale: 0.8, angle: -5 },
                { emoji: "🦋", x: 275, y: 495, scale: 1.2, angle: -25 }
            ]
        },
        {
            id: "retro-stamp",
            name: "Persik Jadul",
            bg: "gradient-butterflies",
            isGradient: true,
            textColor: "#734c31",
            decorations: [
                { emoji: "🎀", x: 15, y: 20, scale: 1.0, angle: -10 },
                { emoji: "🦋", x: 280, y: 110, scale: 1.1, angle: 30 },
                { emoji: "🎀", x: 282, y: 280, scale: 0.95, angle: 15 },
                { emoji: "🦋", x: 12, y: 405, scale: 1.15, angle: -20 },
                { emoji: "✨", x: 275, y: 505, scale: 0.85, angle: 5 }
            ]
        },
        {
            id: "mint-fresh",
            name: "Daun Mint",
            bg: "#e3ffe9",
            isGradient: false,
            textColor: "#355940",
            decorations: [
                { emoji: "🍀", x: 18, y: 15, scale: 1.0, angle: -5 },
                { emoji: "🦋", x: 278, y: 125, scale: 1.1, angle: 20 },
                { emoji: "🍀", x: 12, y: 265, scale: 0.9, angle: -15 },
                { emoji: "🦋", x: 280, y: 385, scale: 1.05, angle: -10 },
                { emoji: "🍀", x: 20, y: 505, scale: 1.05, angle: 10 }
            ]
        },
        {
            id: "sunset-flight",
            name: "Kupu Senja",
            bg: "gradient-sunset",
            isGradient: true,
            textColor: "#8f3e58",
            decorations: [
                { emoji: "🦋", x: 280, y: 35, scale: 1.15, angle: 35 },
                { emoji: "🦋", x: 15, y: 155, scale: 1.05, angle: -15 },
                { emoji: "🦋", x: 275, y: 285, scale: 1.1, angle: 20 },
                { emoji: "🦋", x: 12, y: 405, scale: 1.0, angle: -30 },
                { emoji: "✨", x: 278, y: 495, scale: 0.85, angle: 10 }
            ]
        },
        {
            id: "maroon-gold-classic",
            name: "Maroon Emas",
            bg: "#5e0d16",
            isGradient: false,
            textColor: "#dfb15b",
            decorations: [
                { emoji: "✨", x: 18, y: 15, scale: 0.9, angle: 10 },
                { emoji: "👑", x: 275, y: 35, scale: 0.95, angle: -15 },
                { emoji: "✨", x: 280, y: 200, scale: 0.8, angle: 5 },
                { emoji: "⚜️", x: 12, y: 350, scale: 0.9, angle: 0 },
                { emoji: "👑", x: 18, y: 505, scale: 1.0, angle: 15 },
                { emoji: "✨", x: 275, y: 485, scale: 1.1, angle: -5 }
            ]
        },
        {
            id: "maroon-gold-butterfly",
            name: "Senja Emas",
            bg: "gradient-maroon",
            isGradient: true,
            textColor: "#f2d179",
            decorations: [
                { emoji: "🦋", x: 280, y: 25, scale: 1.1, angle: 30 },
                { emoji: "✨", x: 15, y: 120, scale: 0.85, angle: -10 },
                { emoji: "🦋", x: 18, y: 280, scale: 1.0, angle: -20 },
                { emoji: "🍁", x: 275, y: 350, scale: 0.9, angle: 15 },
                { emoji: "🦋", x: 278, y: 500, scale: 1.2, angle: 10 },
                { emoji: "✨", x: 12, y: 495, scale: 0.8, angle: 0 }
            ]
        }
    ];

    // ==========================================
    // STATE VARIABLES
    // ==========================================
    let activeStream = null;
    let capturedPhotos = []; // Holds data URLs of the 3 photos
    let currentFilter = "normal";
    let currentTemplateId = "classic-white";
    let watermarkText = "LKMM-TM ITS Jejak 2026";
    let isCapturing = false;
    // Web Audio Synthesizer variables
    let audioCtx = null;
    let emailSentSuccess = false;
    let currentPhotoIndex = 0;

    // Initializer
    init();

    function init() {
        setupCursor();
        setupFloatingButterflies();
        setupCameraLogic();
        setupCustomizerLogic();

        // Boot directly to Camera Screen and initialize webcam
        showScreen("screen-camera");
        startCamera();
    }

    // ==========================================
    // 1. CUSTOM BUTTERFLY CURSOR
    // ==========================================
    function setupCursor() {
        document.addEventListener("mousemove", (e) => {
            cursor.style.transform = `translate3d(${e.clientX - 22}px, ${e.clientY - 22}px, 0) scaleX(-1)`;
        });

        document.addEventListener("mousedown", () => {
            cursor.classList.add("clicking");
        });

        document.addEventListener("mouseup", () => {
            cursor.classList.remove("clicking");
        });
    }

    // ==========================================
    // 2. FLOATING BACKGROUND DECORATIONS
    // ==========================================
    function setupFloatingButterflies() {
        const butterflyEmojis = ["🦋", "🌸", "✨", "💖", "💛", "🎀"];
        
        function spawnButterfly() {
            if (document.hidden) return;
            const element = document.createElement("div");
            element.className = "floating-butterfly";
            element.innerText = butterflyEmojis[Math.floor(Math.random() * butterflyEmojis.length)];
            
            const leftVal = Math.random() * 100;
            const scaleVal = 0.5 + Math.random() * 1.2;
            const duration = 10 + Math.random() * 10;
            
            element.style.left = `${leftVal}vw`;
            element.style.transform = `scale(${scaleVal})`;
            element.style.animationDuration = `${duration}s`;
            
            bgContainer.appendChild(element);
            
            setTimeout(() => {
                element.remove();
            }, duration * 1000);
        }

        for(let i = 0; i < 6; i++) {
            setTimeout(spawnButterfly, Math.random() * 8000);
        }
        
        setInterval(spawnButterfly, 4000);
    }

    // ==========================================
    // 3. SCREEN SWITCHING MANAGEMENT
    // ==========================================
    function showScreen(screenId) {
        allScreens.forEach(screen => {
            if (screen.id === screenId) {
                screen.classList.add("active");
            } else {
                screen.classList.remove("active");
            }
        });

        if (screenId !== "screen-camera" && activeStream) {
            stopCamera();
        }
    }

    // ==========================================
    // 4. AUDIO SYNTHESIZER (Web Audio API)
    // ==========================================

    function playSynthBeep(frequency = 880, duration = 0.15) {
        if (!audioCtx) return;
        if (audioCtx.state === "suspended") audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.frequency.value = frequency;
        osc.type = "sine";

        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }

    function playSynthShutter() {
        if (!audioCtx) return;
        if (audioCtx.state === "suspended") audioCtx.resume();

        const bufferSize = audioCtx.sampleRate * 0.25;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 1000;

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.35, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

        noiseNode.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        noiseNode.start();
    }



    // ==========================================
    // 5. CAMERA LOGIC & SEQUENCER (3 TAKES)
    // ==========================================
    function setupCameraLogic() {
        triggerCaptureBtn.addEventListener("click", () => {
            if (isCapturing) return;
            
            // Lazy initialize Web Audio Context on user gesture
            if (!audioCtx) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                    audioCtx = new AudioContextClass();
                }
            }
            
            triggerSingleCapture();
        });
    }

    async function startCamera() {
        capturedPhotos = [];
        clearPreviews();
        
        try {
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "user"
                },
                audio: false
            };

            activeStream = await navigator.mediaDevices.getUserMedia(constraints);
            videoElement.srcObject = activeStream;
            showToast("Kamera Siap");
        } catch (err) {
            console.error("Camera access error: ", err);
            showToast("Gagal Mengakses Kamera Laptop!");
        }
    }

    function stopCamera() {
        if (activeStream) {
            activeStream.getTracks().forEach(track => track.stop());
            activeStream = null;
        }
        videoElement.srcObject = null;
    }

    function clearPreviews() {
        for (let i = 0; i < 3; i++) {
            const thumb = document.getElementById(`thumb-${i}`);
            thumb.style.backgroundImage = "none";
            thumb.classList.remove("captured");
        }
        currentPhotoIndex = 0; // Reset index to start from the first photo
        takeIndicator.innerText = "Foto 1 dari 3";
        isCapturing = false;
        triggerCaptureBtn.style.opacity = "1";
        triggerCaptureBtn.style.pointerEvents = "auto";
    }

    function triggerFlash() {
        flashEffect.classList.remove("trigger");
        void flashEffect.offsetWidth;
        flashEffect.classList.add("trigger");
        setTimeout(() => flashEffect.classList.remove("trigger"), 500);
    }

    async function triggerSingleCapture() {
        isCapturing = true;
        triggerCaptureBtn.style.opacity = "0.4";
        triggerCaptureBtn.style.pointerEvents = "none";

        // Show the countdown for the current photo index
        takeIndicator.innerText = `Foto ${currentPhotoIndex + 1} dari 3`;
        await runCountdown();
        captureFrame(currentPhotoIndex);
        
        // After capturing, increment index
        currentPhotoIndex++;

        if (currentPhotoIndex < 3) {
            // Wait for user to get ready and click again for next photo
            setTimeout(() => {
                isCapturing = false;
                triggerCaptureBtn.style.opacity = "1";
                triggerCaptureBtn.style.pointerEvents = "auto";
                takeIndicator.innerText = `Foto ${currentPhotoIndex + 1} dari 3`;
                showToast("Siap untuk foto berikutnya!");
            }, 1000);
        } else {
            // All 3 photos taken
            showToast("Semua Foto Berhasil Diambil!");
            stopCamera();
            
            // Load captured photos in editor preview
            for (let i = 0; i < 3; i++) {
                const previewBox = document.getElementById(`strip-photo-${i}`);
                previewBox.style.backgroundImage = `url(${capturedPhotos[i]})`;
            }

            setTimeout(() => {
                showScreen("screen-editor");
                applyFilter(currentFilter);
                applyTemplate(currentTemplateId); // Apply initial selected template
            }, 800);
        }
    }

    function runCountdown() {
        return new Promise((resolve) => {
            countdownOverlay.classList.add("active");
            let counter = 3;
            countdownNumber.innerText = counter;
            playSynthBeep(660, 0.1);

            const timer = setInterval(() => {
                counter--;
                if (counter > 0) {
                    countdownNumber.innerText = counter;
                    playSynthBeep(660, 0.1);
                } else {
                    clearInterval(timer);
                    countdownOverlay.classList.remove("active");
                    playSynthShutter();
                    triggerFlash();
                    resolve();
                }
            }, 900);
        });
    }

    function captureFrame(index) {
        const tempCanvas = document.createElement("canvas");
        const ctx = tempCanvas.getContext("2d");

        // Target capture output size: 840x560 (3:2 landscape aspect ratio cropped from webcam)
        tempCanvas.width = 840;
        tempCanvas.height = 560;

        const videoW = videoElement.videoWidth;
        const videoH = videoElement.videoHeight;

        const targetAspect = 840 / 560;
        let sourceW, sourceH, sourceX, sourceY;

        if (videoW / videoH > targetAspect) {
            sourceH = videoH;
            sourceW = videoH * targetAspect;
            sourceX = (videoW - sourceW) / 2;
            sourceY = 0;
        } else {
            sourceW = videoW;
            sourceH = videoW / targetAspect;
            sourceX = 0;
            sourceY = (videoH - sourceH) / 2;
        }

        // Draw flipped mirrored image on canvas
        ctx.translate(840, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoElement, sourceX, sourceY, sourceW, sourceH, 0, 0, 840, 560);

        const dataUrl = tempCanvas.toDataURL("image/png");
        capturedPhotos.push(dataUrl);

        const thumb = document.getElementById(`thumb-${index}`);
        thumb.style.backgroundImage = `url(${dataUrl})`;
        thumb.classList.add("captured");
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ==========================================
    // 6. EDITOR CUSTOMIZER & PRESET TEMPLATES
    // ==========================================
    function setupCustomizerLogic() {
        
        // --- PRESET TEMPLATES ---
        const templateButtons = document.querySelectorAll("#template-picker-grid button");
        templateButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                templateButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const templateId = btn.getAttribute("data-template");
                applyTemplate(templateId);
            });
        });

        // --- PHOTO FILTERS ---
        const filterOptions = document.querySelectorAll(".filter-option");
        filterOptions.forEach(opt => {
            opt.addEventListener("click", () => {
                filterOptions.forEach(o => o.classList.remove("active"));
                opt.classList.add("active");

                currentFilter = opt.getAttribute("data-filter");
                applyFilter(currentFilter);
            });
        });

        // --- WATERMARK CAPTION ---
        const watermarkPhrases = {
            jejak: "LKMM-TM ITS Jejak 2026",
            optimis: "Optimis Lulus #TesTulisJejak",
            menangis: "Saya Mengaku Kalah Telak #TesTulisJejak",
            bismillah: "Jujur Gatau, Yaudahlah #TesTulisJejak"
        };

        watermarkPickerButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                watermarkPickerButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const type = btn.getAttribute("data-watermark");
                watermarkText = watermarkPhrases[type] || watermarkPhrases.jejak;
                stripWatermarkText.innerText = watermarkText;
            });
        });

        // --- EXPORT & RESET BUTTONS ---
        downloadCollageBtn.addEventListener("click", () => {
            emailSentSuccess = false;
            qrModal.classList.add("show");
            
            // Set initial loading state
            qrStatusIcon.innerText = "⌛";
            qrModalTitle.innerText = "Menyiapkan Foto...";
            qrModalDesc.innerText = "Mohon tunggu, foto sedang dirender dan diunggah ke cloud.";
            qrCodeContainer.style.display = "none";
            qrActionBtn.disabled = true;
            qrActionBtn.innerText = "Mengunggah...";
            
            // Trigger high-res collage generation and upload
            exportAndUploadStoryCollage();
        });

        // Close QR modal
        closeQrModalBtn.addEventListener("click", () => {
            qrModal.classList.remove("show");
        });

        // Done button to reset photobooth or Retry upload
        qrActionBtn.addEventListener("click", () => {
            if (emailSentSuccess) {
                // Done/Reset Flow
                qrModal.classList.remove("show");
                emailSentSuccess = false;
                
                // Reset photos and restart camera loop
                stickerWorkspace.innerHTML = "";
                showScreen("screen-camera");
                startCamera();
            } else {
                // Retry Flow
                qrStatusIcon.innerText = "⌛";
                qrModalTitle.innerText = "Mengunggah Kembali...";
                qrModalDesc.innerText = "Mohon tunggu, sedang mencoba mengunggah foto kembali.";
                qrCodeContainer.style.display = "none";
                qrActionBtn.disabled = true;
                qrActionBtn.innerText = "Mengunggah...";
                exportAndUploadStoryCollage();
            }
        });

        retakePhotosBtn.addEventListener("click", () => {
            showScreen("screen-camera");
            startCamera();
        });
    }

    function applyFilter(filterType) {
        for (let i = 0; i < 3; i++) {
            const photoEl = document.getElementById(`strip-photo-${i}`);
            photoEl.className = "strip-item";
            photoEl.classList.add(`filter-${filterType}`);
        }
    }

    function applyTemplate(templateId) {
        currentTemplateId = templateId;
        const template = templates.find(t => t.id === templateId);
        if (!template) return;

        // Clear active classes and apply colors/gradients
        photostripPreview.className = "photostrip-wrapper";
        photostripPreview.style.background = "";

        if (template.isGradient) {
            photostripPreview.classList.add(`color-${template.bg}`);
        } else {
            photostripPreview.style.background = template.bg;
            if (template.bg === "#1a1a1a" || template.bg === "#0c182d") {
                photostripPreview.style.borderColor = "rgba(255,255,255,0.15)";
            } else {
                photostripPreview.style.borderColor = "";
            }
        }

        // Apply text colors
        stripWatermarkText.style.color = template.textColor;

        // Draw template decorations overlay
        stickerWorkspace.innerHTML = "";
        if (template.decorations) {
            const editorScale = 440 / 320;
            template.decorations.forEach(dec => {
                const decSpan = document.createElement("span");
                decSpan.innerText = dec.emoji;
                decSpan.className = "placed-sticker";
                decSpan.style.left = `${dec.x * editorScale}px`;
                decSpan.style.top = `${dec.y * editorScale}px`;
                decSpan.style.transform = `rotate(${dec.angle}deg)`;
                decSpan.style.fontSize = `${38 * dec.scale * editorScale}px`;
                decSpan.style.pointerEvents = "none"; // Make non-draggable
                stickerWorkspace.appendChild(decSpan);
            });
        }
    }

    // ==========================================
    // 7. HIGH RES COLLAGE GENERATION & EXPORT (9:16)
    // ==========================================
    function exportAndUploadStoryCollage() {
        const exportCanvas = document.createElement("canvas");
        const ctx = exportCanvas.getContext("2d");

        exportCanvas.width = 1080;
        exportCanvas.height = 1920;

        const template = templates.find(t => t.id === currentTemplateId);
        if (!template) return;

        // Render Background (Solid or Gradient)
        if (template.isGradient) {
            const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
            if (template.bg === "gradient-sunset") {
                grad.addColorStop(0, "#ff9a9e");
                grad.addColorStop(1, "#fecfef");
            } else if (template.bg === "gradient-metallic") {
                grad.addColorStop(0, "#e0c3fc");
                grad.addColorStop(1, "#8ec5fc");
            } else if (template.bg === "gradient-aurora") {
                grad.addColorStop(0, "#a8ff78");
                grad.addColorStop(1, "#78ffd6");
            } else if (template.bg === "gradient-butterflies") {
                grad.addColorStop(0, "#ffecd2");
                grad.addColorStop(1, "#fcb69f");
            } else if (template.bg === "gradient-maroon") {
                grad.addColorStop(0, "#721625");
                grad.addColorStop(1, "#3a030d");
            }
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 1080, 1920);
        } else {
            ctx.fillStyle = template.bg;
            ctx.fillRect(0, 0, 1080, 1920);
        }

        // Draw 3 Photos (width=840, height=560)
        const photoW = 840;
        const photoH = 560;
        const startX = 120;
        const startY = 70;
        const gap = 25;

        let imagesLoaded = 0;

        for (let i = 0; i < 3; i++) {
            const img = new Image();
            img.src = capturedPhotos[i];
            
            img.onload = () => {
                const drawY = startY + i * (photoH + gap);
                ctx.save();
                drawRoundedRect(ctx, startX, drawY, photoW, photoH, 12);
                ctx.clip();
                applyFiltersToContext(ctx, currentFilter);
                ctx.drawImage(img, startX, drawY, photoW, photoH);
                ctx.restore();

                imagesLoaded++;
                
                if (imagesLoaded === 3) {
                    drawWatermarkText(ctx, template.textColor);
                    drawTemplateDecorationsOnCanvas(ctx, template);
                    
                    // Upload the canvas content to cloud
                    uploadCollageBlob(exportCanvas);
                }
            };
        }
    }

    function drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    function applyFiltersToContext(ctx, filterType) {
        if (filterType === "grayscale") {
            ctx.filter = "grayscale(1)";
        } else if (filterType === "sepia") {
            ctx.filter = "sepia(0.85)";
        } else if (filterType === "warm") {
            ctx.filter = "sepia(0.2) contrast(1.1) saturate(1.2)";
        } else if (filterType === "cool") {
            ctx.filter = "hue-rotate(20deg) saturate(0.9) contrast(0.95)";
        } else if (filterType === "contrast") {
            ctx.filter = "contrast(1.3) brightness(1.05)";
        } else {
            ctx.filter = "none";
        }
    }

    function drawWatermarkText(ctx, textColor) {
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        const textToDraw = watermarkText.toUpperCase();
        
        let fontSize = 44;
        ctx.font = `bold ${fontSize}px 'Lora', serif`;
        
        // Apply letter spacing if supported to match the CSS look
        if ('letterSpacing' in ctx) {
            ctx.letterSpacing = "0.18em";
        }
        
        let textWidth = ctx.measureText(textToDraw).width;
        
        // Auto scale down font size if the text exceeds maximum boundaries
        const maxTextWidth = 840; 
        if (textWidth > maxTextWidth) {
            fontSize = Math.floor(fontSize * (maxTextWidth / textWidth));
            ctx.font = `bold ${fontSize}px 'Lora', serif`;
        }
        
        ctx.fillStyle = textColor;
        ctx.fillText(textToDraw, 1080 / 2, 1860);
        ctx.restore();
    }

    function drawTemplateDecorationsOnCanvas(ctx, template) {
        if (!template || !template.decorations) return;
        const scaleMultiplier = 1080 / 320;

        template.decorations.forEach(dec => {
            // Emojis center estimates (width/height is roughly 40px in coordinate offsets)
            const exportCenterX = (dec.x + 20) * scaleMultiplier;
            const exportCenterY = (dec.y + 20) * scaleMultiplier;

            ctx.save();
            ctx.translate(exportCenterX, exportCenterY);
            ctx.rotate(dec.angle * (Math.PI / 180));

            const exportFontSize = Math.round(38 * dec.scale * scaleMultiplier);
            ctx.font = `${exportFontSize}px 'Inter', sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            ctx.shadowColor = "rgba(0, 0, 0, 0.12)";
            ctx.shadowBlur = 8;
            ctx.shadowOffsetY = 4;

            ctx.fillText(dec.emoji, 0, 0);
            ctx.restore();
        });
    }

    function triggerImageDownload(canvas) {
        const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
        const dataUrl = canvas.toDataURL("image/png");
        
        const link = document.createElement("a");
        link.download = `kupu-photobooth-${timestamp}.png`;
        link.href = dataUrl;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast("Collage berhasil disimpan!");
    }

    // --- IMGUR ANONYMOUS UPLOAD & QR CODE RENDERING ---
    function uploadCollageBlob(canvas) {
        canvas.toBlob(async (blob) => {
            if (IMGBB_API_KEY === "YOUR_IMGBB_API_KEY_HERE" || !IMGBB_API_KEY) {
                console.error("ImgBB API Key is not configured!");
                handleUploadFailure("API Key ImgBB belum dikonfigurasi di app.js!");
                return;
            }

            const formData = new FormData();
            formData.append("image", blob);

            try {
                const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                    method: "POST",
                    body: formData
                });

                const result = await response.json();
                if (response.ok && result.success && result.data && result.data.url) {
                    const uploadUrl = result.data.url;
                    
                    // Update UI with success state
                    qrStatusIcon.innerText = "✅";
                    qrModalTitle.innerText = "Momen #TesTulisJejak Sudah Siap!";
                    qrModalDesc.innerText = "Scan QR Code di bawah menggunakan kamera HP untuk mengunduh foto Anda langsung.";
                    
                    // Set QR Code Image Src
                    qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(uploadUrl)}`;
                    qrCodeContainer.style.display = "block";
                    
                    // Enable action button for resetting photobooth
                    qrActionBtn.disabled = false;
                    qrActionBtn.innerText = "Foto Baru (Selesai)";
                    emailSentSuccess = true; // Use this variable to track successful upload state
                } else {
                    console.error("ImgBB upload error:", result);
                    handleUploadFailure(result.error ? result.error.message : "Gagal mengunggah ke ImgBB.");
                }
            } catch (error) {
                console.error("ImgBB upload connection error:", error);
                handleUploadFailure("Masalah koneksi jaringan.");
            }
        }, "image/png");
    }

    function handleUploadFailure(customMsg = null) {
        qrStatusIcon.innerText = "❌";
        qrModalTitle.innerText = "Gagal Mengunggah Foto";
        qrModalDesc.innerText = customMsg || "Terjadi gangguan saat mengunggah foto ke cloud. Silakan coba kembali.";
        qrCodeContainer.style.display = "none";
        qrDirectLink.style.display = "none";
        qrActionBtn.disabled = false;
        qrActionBtn.innerText = "Coba Lagi";
        emailSentSuccess = false;
    }

    // ==========================================
    // 8. TOAST NOTIFICATION HELPERS
    // ==========================================
    function showToast(message) {
        toast.innerText = message;
        toast.classList.add("show");
        
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }
});
