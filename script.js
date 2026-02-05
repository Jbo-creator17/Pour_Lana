const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const question = document.getElementById("question");
const container = document.querySelector(".container");

let size = 18;
let containerWidth = 40;
let noBtnSize = 18;
let clickCount = 0;
let i = 0;
let texts = ["Arrete tu veux vraiment pas ???",
             "Tout ce mal pour ça...",
             "J'en ai chier pour ce truc en plus...",
              "De toute facon je savais que tu avais déjà dis oui à ton voisin pff",
               "Non mais je t'aime plus j'ai plus envie... (click quand même oui stp)"];

// Liste des chats (Giphy)
const stupidCats = [
    "https://media.giphy.com/media/GeimqsH0TLDt4tScGw/giphy.gif",
    "https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif",
    "https://media.giphy.com/media/v6aOjy0Qo1fIA/giphy.gif",
    "https://media.giphy.com/media/CjmvTCZf2U3p09Cn0h/giphy.gif",
    "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif",
    "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
    "https://media.giphy.com/media/12HZukMBlutpoQ/giphy.gif",
    "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
    "https://media.giphy.com/media/llmZp6fCVb4ju/giphy.gif",
    "https://media.giphy.com/media/2A75RyXVzzSI2bx4Gj/giphy.gif",
    "https://media.giphy.com/media/Cmr1OMJ2FN0B2/giphy.gif",
    "https://media.giphy.com/media/Nm8ZPAGOwZUQM/giphy.gif"
];

// --- NOUVELLE FONCTION INTELLIGENTE ---
function spawnStupidCats() {
    // On récupère la position de la boite centrale (la zone interdite)
    const containerRect = container.getBoundingClientRect();
    
    // On fait apparaître 15 chats
    for (let k = 0; k < 15; k++) {
        const img = document.createElement('img');
        img.src = stupidCats[Math.floor(Math.random() * stupidCats.length)];
        img.classList.add('cat-pop');
        
        const size = Math.random() * 150 + 80; // Taille entre 80 et 230px
        img.style.width = `${size}px`;
        img.style.height = "auto";
        
        // --- CALCUL DE POSITION (HORS DU CENTRE) ---
        // On choisit au hasard un côté : 0=Haut, 1=Bas, 2=Gauche, 3=Droite
        const side = Math.floor(Math.random() * 4);
        let x, y;

        if (side === 0) { // HAUT (Au-dessus du container)
            x = Math.random() * window.innerWidth;
            y = Math.random() * (containerRect.top - size); 
        } 
        else if (side === 1) { // BAS (En-dessous du container)
            x = Math.random() * window.innerWidth;
            y = containerRect.bottom + Math.random() * (window.innerHeight - containerRect.bottom - size);
        } 
        else if (side === 2) { // GAUCHE (À gauche du container)
            x = Math.random() * (containerRect.left - size);
            y = Math.random() * window.innerHeight;
        } 
        else { // DROITE (À droite du container)
            x = containerRect.right + Math.random() * (window.innerWidth - containerRect.right - size);
            y = Math.random() * window.innerHeight;
        }

        // Sécurité : si le calcul donne des nombres bizarres (hors écran), on force un coin
        if (x < 0) x = 10;
        if (y < 0) y = 10;

        img.style.left = `${x}px`;
        img.style.top = `${y}px`;
        
        img.style.animationDelay = `${Math.random() * 1}s`;
        document.body.appendChild(img);
    }
}

function launchTotalConfetti() {
    // Canon à gauche
    confetti({ particleCount: 150, spread: 100, origin: { x: 0, y: 0.6 }, zIndex: 9999 });
    // Canon à droite
    confetti({ particleCount: 150, spread: 100, origin: { x: 1, y: 0.6 }, zIndex: 9999 });
    
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, zIndex: 9999 });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, zIndex: 9999 });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

function moveNoButton() {
    if (noBtn.parentNode !== document.body) {
        const rect = noBtn.getBoundingClientRect();
        document.body.appendChild(noBtn);
        noBtn.style.position = "fixed";
        noBtn.style.left = rect.left + "px";
        noBtn.style.top = rect.top + "px";
        noBtn.style.margin = "0";
    }

    const vW = window.innerWidth;
    const vH = window.innerHeight;
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    // 1. On récupère la position du texte (la zone à éviter)
    const questionRect = question.getBoundingClientRect();
    
    let targetX, targetY;
    let isOverlapping = true;
    let attempts = 0;

    // 2. Boucle : on cherche une position qui ne chevauche pas le texte
    while (isOverlapping && attempts < 50) {
        // Calcul aléatoire (on garde ta logique de dispersion autour du centre)
        const scatter = 350;
        const randomOffsetX = (Math.random() - 0.5) * scatter;
        const randomOffsetY = (Math.random() - 0.5) * scatter;
        
        targetX = Math.max(20, Math.min(vW - btnWidth - 20, (vW / 2) + randomOffsetX));
        targetY = Math.max(20, Math.min(vH - btnHeight - 20, (vH / 2) + randomOffsetY));

        // 3. VERIFICATION : Est-ce que le nouveau bouton touche le texte ?
        // On définit les bords du bouton pour la vérification
        const bLeft = targetX;
        const bRight = targetX + btnWidth;
        const bTop = targetY;
        const bBottom = targetY + btnHeight;

        // Si le bouton est en dehors de la zone du texte, on sort de la boucle
        if (
            bRight < questionRect.left || 
            bLeft > questionRect.right || 
            bBottom < questionRect.top || 
            bTop > questionRect.bottom
        ) {
            isOverlapping = false;
        }
        attempts++;
    }

    // 4. Application du mouvement
    setTimeout(() => {
        noBtn.style.transition = "all 0.4s ease-out";
        noBtn.style.left = `${targetX}px`;
        noBtn.style.top = `${targetY}px`;
    }, 10);
}

// --- EVENTS ---

noBtn.addEventListener("click", () => {
    clickCount++;
    if (i < texts.length) { question.textContent = texts[i]; i++; }
    size += 15; yesBtn.style.fontSize = `${size}px`;
    if (container) { container.style.width = `${Math.min(containerWidth, 90)}%`; }
    noBtnSize -= 2; if (noBtnSize < 10) noBtnSize = 10;
    
    noBtn.style.fontSize = `${noBtnSize}px`;
    noBtn.style.padding = `${Math.max(noBtnSize / 2, 5)}px ${Math.max(noBtnSize, 10)}px`;
    
    moveNoButton();
});

noBtn.addEventListener("mouseenter", () => {
    // Il faut ouvrir les accolades ici pour que TOUT ce bloc ne s'active 
    // QUE si on a cliqué 3 fois ou plus.
    if (clickCount >= 5) { 
        // 1. Grossir le OUI
        size += 15; 
        yesBtn.style.fontSize = `${size}px`;

        // 3. Rétrécir le NON
        noBtnSize -= 2; 
        if (noBtnSize < 10) noBtnSize = 10;
        noBtn.style.fontSize = `${noBtnSize}px`;
        noBtn.style.padding = `${Math.max(noBtnSize / 2, 5)}px ${Math.max(noBtnSize, 10)}px`;

        // 4. Le faire fuir !
        moveNoButton();
    }
});

yesBtn.addEventListener("click", () => {
    // 1. Texte final
    question.textContent = "Ouhou, je savais que tu dirais ça !!";
    
    // 2. Cacher le bouton Non
    noBtn.style.display = "none";
    
    // 3. Fond transparent
    if(container) {
        container.style.backgroundColor = "rgba(255, 192, 203, 0.3)";
        container.style.boxShadow = "none";
    }

    // 4. Activer le mode FÊTE TOTALE sur le bouton Oui
    yesBtn.style.fontSize = ""; 
    yesBtn.classList.add("fete-totale");

    // 5. Confettis et Chats (maintenant autour du cadre)
    launchTotalConfetti();
    setTimeout(spawnStupidCats, 500);
});