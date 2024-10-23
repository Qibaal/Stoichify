const reactions = {
  "HCl+NaOH": "NaCl + H₂O",
  "HCl+KOH": "KCl + H₂O",
  "HCl+Ca(OH)₂": "CaCl₂ + H₂O",
  "HCl+NH₃": "NH₄Cl + -",
  "HCl+Mg(OH)₂": "MgCl₂ + H₂O",
  "H₂SO₄+NaOH": "Na₂SO₄ + H₂O",
  "H₂SO₄+KOH": "K₂SO₄ + H₂O",
  "H₂SO₄+Ca(OH)₂": "CaSO₄ + H₂O",
  "H₂SO₄+NH₃": "(NH₄)₂SO₄ + -",
  "H₂SO₄+Mg(OH)₂": "MgSO₄ + H₂O",
  "HNO₃+NaOH": "NaNO₃ + H₂O",
  "HNO₃+KOH": "KNO₃ + H₂O",
  "HNO₃+Ca(OH)₂": "Ca(NO₃)₂ + H₂O",
  "HNO₃+NH₃": "NH₄NO₃ + -",
  "HNO₃+Mg(OH)₂": "Mg(NO₃)₂ + H₂O",
  "CH₃COOH+NaOH": "CH₃COONa + H₂O",
  "CH₃COOH+KOH": "CH₃COOK + H₂O",
  "CH₃COOH+Ca(OH)₂": "(CH₃COO)₂Ca + H₂O",
  "CH₃COOH+NH₃": "CH₃COONH₄ + -",
  "CH₃COOH+Mg(OH)₂": "(CH₃COO)₂Mg + H₂O",
  "H₃PO₄+NaOH": "Na₃PO₄ + H₂O",
  "H₃PO₄+KOH": "K₃PO₄ + H₂O",
  "H₃PO₄+Ca(OH)₂": "Ca₃(PO₄)₂ + H₂O",
  "H₃PO₄+NH₃": "(NH₄)₃PO₄ + -",
  "H₃PO₄+Mg(OH)₂": "Mg₃(PO₄)₂ + H₂O",
};

const questions = [
  "NaCl + H₂O",
  "NH₄Cl + -",
  "KCl + H₂O",
  "CaCl₂ + H₂O",
  "NH₄Cl + -",
  "MgCl₂ + H₂O",
  "Na₂SO₄ + H₂O",
  "K₂SO₄ + H₂O",
  "CaSO₄ + H₂O",
  "(NH₄)₂SO₄ + -",
  "MgSO₄ + H₂O",
  "NaNO₃ + H₂O",
  "KNO₃ + H₂O",
  "Ca(NO₃)₂ + H₂O",
  "NH₄NO₃ + -",
  "Mg(NO₃)₂ + H₂O",
  "CH₃COONa + H₂O",
  "CH₃COOK + H₂O",
  "(CH₃COO)₂Ca + H₂O",
  "CH₃COONH₄ + -",
  "(CH₃COO)₂Mg + H₂O",
  "Na₃PO₄ + H₂O",
  "K₃PO₄ + H₂O",
  "Ca₃(PO₄)₂ + H₂O",
  "(NH₄)₃PO₄ + -",
  "Mg₃(PO₄)₂ + H₂O",
];

const acids = ["HCl", "H₂SO₄", "HNO₃", "CH₃COOH", "H₃PO₄"];
const bases = ["NaOH", "KOH", "Ca(OH)₂", "NH₃", "Mg(OH)₂"];

// Current Question index
let currentQuestion = 0;

let selectedAcid = null;
let selectedBase = null;

const acidDropZone = document.getElementById("drop1");
const baseDropZone = document.getElementById("drop2");

const answer1 = document.querySelector("#product1 p");
const answer2 = document.querySelector("#product2 p");
const answerContainer2 = document.querySelector("#product2");

const acidContainers = document.querySelectorAll('[id^="acid"]');
const baseContainers = document.querySelectorAll('[id^="base"]');
const currentLevel = document.getElementById("current-question");

const arrowIcon = document.querySelector(".arrow-icon");
const correctIcon = document.querySelector(".correct-icon");
const falseIcon = document.querySelector(".false-icon");
const loseIcon = document.querySelector(".lose-icon");

answer1.textContent = questions[currentQuestion].split(" + ")[0];
answer2.textContent = questions[currentQuestion].split(" + ")[1];

currentLevel.textContent = currentQuestion + 1;

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('[draggable="true"]').forEach((item) => {
    item.addEventListener("dragstart", drag);
  });

  acidDropZone.addEventListener("dragover", (e) => {
    e.preventDefault(); 
  });
  acidDropZone.addEventListener("dragover", allowDrop);
  acidDropZone.addEventListener("drop", function (event) {
    drop(event, "acid");
  });

  baseDropZone.addEventListener("dragover", (e) => {
    e.preventDefault(); 
  });
  baseDropZone.addEventListener("dragover", allowDrop);
  baseDropZone.addEventListener("drop", function (event) {
    drop(event, "base");
  });

  document.querySelectorAll(".drop-zone div").forEach((beaker) => {
    beaker.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.id);
    });
  });

  document.querySelectorAll(".beaker").forEach((beaker) => {
    beaker.addEventListener("click", function () {
      selectedBeaker = this;
    });
  });

  acidDropZone.addEventListener("click", function () {
    pressDrop("acid");
  });

  baseDropZone.addEventListener("click", function () {
    pressDrop("base");
  });

  [acidDropZone, baseDropZone].forEach((dropZone) => {
    const observer = new MutationObserver(() => {
      updateDropZoneBorder(dropZone);
    });

    observer.observe(dropZone, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Initial check
    updateDropZoneBorder(dropZone);
  });

  function allowDrop(event) {
    event.preventDefault();
  }

  function drag(event) {
    event.dataTransfer.setData("object", event.target.parentNode.id);
  }

  function drop(event, type) {
    event.preventDefault();
    const data = event.dataTransfer.getData("object");
    const originalElement = document.getElementById(data);
    const chemicalName = originalElement.querySelector("p").textContent.trim();

    const clonedElement = originalElement.cloneNode(true);

    clonedElement.id = originalElement.id + "_" + Date.now();

    if (type === "acid" && acids.includes(chemicalName)) {
      acidDropZone.innerHTML = "";
      acidDropZone.appendChild(clonedElement);
      selectedAcid = chemicalName;
    } else if (type === "base" && bases.includes(chemicalName)) {
      baseDropZone.innerHTML = "";
      baseDropZone.appendChild(clonedElement);
      selectedBase = chemicalName;
    }

    clonedElement.draggable = true;
    clonedElement.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.id);
    });

    checkReaction();
  }

    function pressDrop(type) {
    if (selectedBeaker) {
      const chemicalName = selectedBeaker.querySelector("p").textContent.trim();
      const clonedElement = selectedBeaker.cloneNode(true);
      clonedElement.id = selectedBeaker.id + "_" + Date.now();

      if (type === "acid" && acids.includes(chemicalName)) {
        acidDropZone.innerHTML = "";
        acidDropZone.appendChild(clonedElement);
        selectedAcid = chemicalName;
      } else if (type === "base" && bases.includes(chemicalName)) {
        baseDropZone.innerHTML = "";
        baseDropZone.appendChild(clonedElement);
        selectedBase = chemicalName;
      } else {
        return;
      }

      clonedElement.draggable = true;
      clonedElement.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", e.target.id);
      });

      selectedBeaker = null;
      checkReaction();
      calculateProduct();
    }
  } 

  function checkReaction() {
    if (selectedAcid && selectedBase) {
      const reactionKey = `${selectedAcid}+${selectedBase}`;
      const reverseReactionKey = `${selectedBase}+${selectedAcid}`;

      const product = reactions[reactionKey] || reactions[reverseReactionKey];

      const productParts = product.split(" + ");
      const product1 = productParts[0];
      const product2 = productParts[1];

      if (product1 == answer1.textContent && product2 == answer2.textContent) {
        arrowIcon.style.display = "none";
        correctIcon.style.display = "block";

        setTimeout(() => {
          correctIcon.style.display = "none";
          arrowIcon.style.display = "block";

          acidDropZone.querySelector("div").remove();
          baseDropZone.querySelector("div").remove();

          currentQuestion += 1;
          currentLevel.textContent = currentQuestion + 1;

          answer1.textContent = questions[currentQuestion].split(" + ")[0];
          answer2.textContent = questions[currentQuestion].split(" + ")[1];

          if (questions[currentQuestion].split(" + ")[1].trim() === "-") {
            answerContainer2.style.display = "none";
          } else {
            answerContainer2.style.display = "block";
          }
        }, 1500);

        selectedAcid = null;
        selectedBase = null;
      } else {
        arrowIcon.style.display = "none";
        falseIcon.style.display = "block";

        const hearts = document.querySelectorAll(".heart");

        if (hearts.length > 0) {
          hearts[hearts.length - 1].remove();
        }

        setTimeout(() => {
          falseIcon.style.display = "none";
          arrowIcon.style.display = "block";
        }, 1500);

        if (hearts.length === 1) {
          const overlay = document.querySelector(".overlay");
          overlay.style.display = "flex";

          const retryBtn = document.querySelector(".retry-btn");
          const menuBtn = document.querySelector(".menu-btn");

          retryBtn.addEventListener("click", () => {
            window.location.reload();
          });

          menuBtn.addEventListener("click", () => {
            window.location.href = "../index.html";
          });
        }
      }
    }
  }

  function updateDropZoneBorder(dropZone) {
    if (dropZone.innerHTML.trim() === "") {
      dropZone.style.border = "3px dashed #333";
    } else {
      dropZone.style.border = "none";
    }
  }
});

