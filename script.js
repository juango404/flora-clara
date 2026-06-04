const quiz = document.querySelector("#flowerQuiz");
const steps = Array.from(document.querySelectorAll(".quiz-step"));
const indicators = Array.from(document.querySelectorAll("[data-step-indicator]"));
const prevButton = document.querySelector("#prevStep");
const nextButton = document.querySelector("#nextStep");
const resultsPanel = document.querySelector("#resultsPanel");
const resultSummary = document.querySelector("#resultSummary");
const productGrid = document.querySelector("#productGrid");
const emotionButtons = document.querySelectorAll("[data-jump-emotion]");

let currentStep = 0;

const imageSet = {
  soft: "https://images.pexels.com/photos/5409700/pexels-photo-5409700.jpeg?auto=compress&cs=tinysrgb&w=900",
  bright: "https://images.pexels.com/photos/12362043/pexels-photo-12362043.jpeg?auto=compress&cs=tinysrgb&w=900",
  warm: "https://images.pexels.com/photos/36171901/pexels-photo-36171901.jpeg?auto=compress&cs=tinysrgb&w=900",
  pink: "https://images.pexels.com/photos/5409700/pexels-photo-5409700.jpeg?auto=compress&cs=tinysrgb&w=900"
};

const emotionCopy = {
  Amor: {
    title: "Ramo que se siente cercano, romántico y memorable",
    base: "Rosas, flores suaves y follaje fino para decir amor sin saturar.",
    names: ["Primer Latido", "Siempre Tu", "Amor en Calma"],
    image: imageSet.pink
  },
  Perdon: {
    title: "Ramo delicado para abrir una conversación",
    base: "Tonos claros, composición sobria y tarjeta breve para pedir perdón con tacto.",
    names: ["Volvamos a Sonreír", "Lo Siento Bonito", "Nuevo Comienzo"],
    image: imageSet.soft
  },
  Felicidad: {
    title: "Ramo alegre para celebrar sin pensarlo demasiado",
    base: "Flores vivas, colores altos y presencia festiva para cumpleaños o logros.",
    names: ["Dia Brillante", "Fiesta Floral", "Alegria Viva"],
    image: imageSet.bright
  },
  Gracias: {
    title: "Ramo elegante para agradecer con buen gusto",
    base: "Tonos cálidos y mezcla refinada para detalles personales o corporativos.",
    names: ["Gracias de Corazón", "Luz de Tarde", "Detalle Noble"],
    image: imageSet.warm
  },
  Apoyo: {
    title: "Ramo sereno para acompañar con respeto",
    base: "Flores claras, textura suave y mensaje cálido para momentos sensibles.",
    names: ["Abrazo Suave", "Estoy Contigo", "Calma Serena"],
    image: imageSet.soft
  },
  Sorpresa: {
    title: "Ramo inesperado con energía visual",
    base: "Colores mezclados y volumen medio para cambiarle el dia a alguien.",
    names: ["Sorpresa Fresca", "Sonrisa Express", "Color Secreto"],
    image: imageSet.bright
  }
};

function setStep(nextStep) {
  currentStep = nextStep;

  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === currentStep);
  });

  prevButton.disabled = currentStep === 0;
  nextButton.textContent = currentStep === steps.length - 1 ? "Ver recomendacion" : "Siguiente";
}

function getCheckedValue(name) {
  const input = quiz.querySelector(`input[name="${name}"]:checked`);
  return input ? input.value : "";
}

function currentStepIsValid() {
  const activeStep = steps[currentStep];
  const checked = activeStep.querySelector("input:checked");

  if (checked) {
    return true;
  }

  activeStep.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-8px)" },
      { transform: "translateX(8px)" },
      { transform: "translateX(0)" }
    ],
    { duration: 220, easing: "ease-out" }
  );

  return false;
}

function buildRecommendations() {
  const emotion = getCheckedValue("emotion");
  const recipient = getCheckedValue("recipient");
  const style = getCheckedValue("style");
  const budget = getCheckedValue("budget");
  const delivery = getCheckedValue("delivery");
  const copy = emotionCopy[emotion] || emotionCopy.Sorpresa;

  const budgetLabels = {
    Esencial: ["Opción esencial", "Opción recomendada", "Mejora especial"],
    Especial: ["Opción sencilla", "Opción recomendada", "Opción premium"],
    Premium: ["Opción especial", "Opción premium", "Opción de impacto"],
    Personalizado: ["Base sugerida", "Diseño a medida", "Experiencia completa"]
  };

  const labels = budgetLabels[budget] || budgetLabels.Especial;
  const prices = budget === "Premium"
    ? ["$180.000", "$240.000", "$320.000"]
    : budget === "Esencial"
      ? ["$75.000", "$110.000", "$150.000"]
      : ["$120.000", "$165.000", "$220.000"];

  resultSummary.textContent = `${copy.title}. Pensado para ${recipient.toLowerCase()}, con estilo ${style.toLowerCase()} y entrega: ${delivery.toLowerCase()}.`;

  productGrid.innerHTML = copy.names.map((name, index) => {
    const message = encodeURIComponent(`Hola, hice el quiz y quiero consultar el ramo ${name}. Emoción: ${emotion}. Para: ${recipient}. Estilo: ${style}. Presupuesto: ${budget}. Entrega: ${delivery}.`);

    return `
      <article class="product-card">
        <img src="${index === 1 ? copy.image : index === 0 ? imageSet.soft : imageSet.warm}" alt="Ramo recomendado ${name}">
        <div class="product-card-content">
          <span class="tag">${labels[index]}</span>
          <h3>${name}</h3>
          <p>${copy.base} Precio estimado: <strong>${prices[index]}</strong>.</p>
          <a href="https://wa.me/573001112233?text=${message}" target="_blank" rel="noreferrer">Reservar por WhatsApp</a>
        </div>
      </article>
    `;
  }).join("");

  resultsPanel.hidden = false;
  resultsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

nextButton.addEventListener("click", () => {
  if (!currentStepIsValid()) {
    return;
  }

  if (currentStep === steps.length - 1) {
    buildRecommendations();
    return;
  }

  setStep(currentStep + 1);
});

prevButton.addEventListener("click", () => {
  setStep(Math.max(0, currentStep - 1));
});

emotionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const emotion = button.dataset.jumpEmotion;
    const input = quiz.querySelector(`input[name="emotion"][value="${emotion}"]`);

    if (input) {
      input.checked = true;
    }

    setStep(1);
    document.querySelector("#quiz").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

setStep(0);
