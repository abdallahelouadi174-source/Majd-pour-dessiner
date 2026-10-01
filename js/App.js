const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("colorPicker");
const colorValue = document.getElementById("colorValue");

const brushSize = document.getElementById("brushSize");
const brushValue = document.getElementById("brushValue");

const brushButton = document.getElementById("brushButton");
const eraserButton = document.getElementById("eraserButton");

const clearButton = document.getElementById("clearButton");
const downloadButton = document.getElementById("downloadButton");

const canvasStatus = document.getElementById("canvasStatus");


let drawing = false;
let tool = "brush";


/* =========================
   CONFIGURATION DU CANVAS
========================= */

function resizeCanvas() {

    const oldImage = canvas.width > 0 && canvas.height > 0
        ? canvas.toDataURL()
        : null;

    const rect = canvas.getBoundingClientRect();

    const ratio = window.devicePixelRatio || 1;

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    ctx.scale(ratio, ratio);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (oldImage) {

        const image = new Image();

        image.onload = () => {
            ctx.drawImage(
                image,
                0,
                0,
                rect.width,
                rect.height
            );
        };

        image.src = oldImage;
    }
}


resizeCanvas();

window.addEventListener("resize", resizeCanvas);


/* =========================
   POSITION DE LA SOURIS / DOIGT
========================= */

function getPosition(event) {

    const rect = canvas.getBoundingClientRect();

    let clientX;
    let clientY;

    if (event.touches && event.touches.length > 0) {

        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;

    } else {

        clientX = event.clientX;
        clientY = event.clientY;
    }

    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}


/* =========================
   COMMENCER À DESSINER
========================= */

function startDrawing(event) {

    event.preventDefault();

    drawing = true;

    const position = getPosition(event);

    ctx.beginPath();

    ctx.moveTo(
        position.x,
        position.y
    );

    draw(event);
}


/* =========================
   DESSINER
========================= */

function draw(event) {

    if (!drawing) {
        return;
    }

    event.preventDefault();

    const position = getPosition(event);

    ctx.lineWidth = Number(brushSize.value);

    if (tool === "eraser") {

        ctx.globalCompositeOperation =
            "destination-out";

    } else {

        ctx.globalCompositeOperation =
            "source-over";

        ctx.strokeStyle =
            colorPicker.value;
    }

    ctx.lineTo(
        position.x,
        position.y
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        position.x,
        position.y
    );

    canvasStatus.textContent =
        "Création en cours…";
}


/* =========================
   ARRÊTER
========================= */

function stopDrawing() {

    if (!drawing) {
        return;
    }

    drawing = false;

    ctx.closePath();

    canvasStatus.textContent =
        "Dessin enregistré localement";
}


/* =========================
   ÉVÉNEMENTS SOURIS
========================= */

canvas.addEventListener(
    "mousedown",
    startDrawing
);

canvas.addEventListener(
    "mousemove",
    draw
);

canvas.addEventListener(
    "mouseup",
    stopDrawing
);

canvas.addEventListener(
    "mouseleave",
    stopDrawing
);


/* =========================
   ÉVÉNEMENTS TACTILES
========================= */

canvas.addEventListener(
    "touchstart",
    startDrawing,
    { passive: false }
);

canvas.addEventListener(
    "touchmove",
    draw,
    { passive: false }
);

canvas.addEventListener(
    "touchend",
    stopDrawing
);


/* =========================
   COULEUR
========================= */

colorPicker.addEventListener(
    "input",
    () => {

        colorValue.textContent =
            colorPicker.value.toUpperCase();

        if (tool === "brush") {
            ctx.globalCompositeOperation =
                "source-over";
        }
    }
);


/* =========================
   TAILLE DU PINCEAU
========================= */

brushSize.addEventListener(
    "input",
    () => {

        brushValue.textContent =
            brushSize.value;
    }
);


/* =========================
   PINCEAU
========================= */

brushButton.addEventListener(
    "click",
    () => {

        tool = "brush";

        brushButton.classList.add("active");

        eraserButton.classList.remove("active");

        canvasStatus.textContent =
            "Pinceau sélectionné";
    }
);


/* =========================
   GOMME
========================= */

eraserButton.addEventListener(
    "click",
    () => {

        tool = "eraser";

        eraserButton.classList.add("active");

        brushButton.classList.remove("active");

        canvasStatus.textContent =
            "Gomme sélectionnée";
    }
);


/* =========================
   EFFACER TOUT
========================= */

clearButton.addEventListener(
    "click",
    () => {

        const confirmation =
            confirm(
                "Voulez-vous vraiment effacer votre dessin ?"
            );

        if (!confirmation) {
            return;
        }

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        canvasStatus.textContent =
            "Toile effacée";
    }
);


/* =========================
   TÉLÉCHARGER
========================= */

downloadButton.addEventListener(
    "click",
    () => {

        const link =
            document.createElement("a");

        link.download =
            "dessin-majd.png";

        link.href =
            canvas.toDataURL("image/png");

        link.click();

        canvasStatus.textContent =
            "Dessin téléchargé";
    }
);
