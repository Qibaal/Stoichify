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

const reactionConstants = {
  "HCl+NaOH": [1, 1, 1, 1],
  "HCl+KOH": [1, 1, 1, 1],
  "HCl+Ca(OH)₂": [2, 1, 1, 2],
  "HCl+NH₃": [1, 1, 1, 0],
  "HCl+Mg(OH)₂": [2, 1, 1, 2],
  "H₂SO₄+NaOH": [1, 2, 1, 2],
  "H₂SO₄+KOH": [1, 2, 1, 2],
  "H₂SO₄+Ca(OH)₂": [1, 1, 1, 2],
  "H₂SO₄+NH₃": [1, 2, 1, 0],
  "H₂SO₄+Mg(OH)₂": [1, 1, 1, 2],
  "HNO₃+NaOH": [1, 1, 1, 1],
  "HNO₃+KOH": [1, 1, 1, 1],
  "HNO₃+Ca(OH)₂": [2, 1, 1, 2],
  "HNO₃+NH₃": [1, 1, 1, 0],
  "HNO₃+Mg(OH)₂": [2, 1, 1, 2],
  "CH₃COOH+NaOH": [1, 1, 1, 1],
  "CH₃COOH+KOH": [1, 1, 1, 1],
  "CH₃COOH+Ca(OH)₂": [2, 1, 1, 2],
  "CH₃COOH+NH₃": [1, 1, 1, 0],
  "CH₃COOH+Mg(OH)₂": [2, 1, 1, 2],
  "H₃PO₄+NaOH": [1, 3, 1, 3],
  "H₃PO₄+KOH": [1, 3, 1, 3],
  "H₃PO₄+Ca(OH)₂": [2, 3, 1, 6],
  "H₃PO₄+NH₃": [1, 3, 1, 0],
  "H₃PO₄+Mg(OH)₂": [2, 3, 1, 6],
};

const acids = ["HCl", "H₂SO₄", "HNO₃", "CH₃COOH", "H₃PO₄"];
const bases = ["NaOH", "KOH", "Ca(OH)₂", "NH₃", "Mg(OH)₂"];

let selectedAcid = null;
let selectedBase = null;

const acidDropZone = document.getElementById("drop1");
const baseDropZone = document.getElementById("drop2");

const answer1 = document.querySelector("#product1 p");
const answer2 = document.querySelector("#product2 p");
const answerContainer2 = document.querySelector("#product2");

const productResult1 = document
  .getElementById("mol-result1")
  .querySelector("strong");
const productResult2 = document
  .getElementById("mol-result2")
  .querySelector("strong");

const acidContainers = document.querySelectorAll('[id^="acid"]');
const baseContainers = document.querySelectorAll('[id^="base"]');

const arrowIcon = document.querySelector(".arrow-icon");

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('[draggable="true"]').forEach((item) => {
    item.addEventListener("dragstart", drag);
  });

  acidDropZone.addEventListener("dragover", (e) => {
    e.preventDefault(); // Enable the drop action for all drop zones
  });
  acidDropZone.addEventListener("dragover", allowDrop);
  acidDropZone.addEventListener("drop", function (event) {
    drop(event, "acid");
  });

  baseDropZone.addEventListener("dragover", (e) => {
    e.preventDefault(); // Enable the drop action for all drop zones
  });
  baseDropZone.addEventListener("dragover", allowDrop);
  baseDropZone.addEventListener("drop", function (event) {
    drop(event, "base");
  });

  document.querySelectorAll(".drop-zone div").forEach((beaker) => {
    beaker.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.id); // Store the ID of the dragged beaker
    });
  });

  // Add and remove borders menurut state innerhtml
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

  document.querySelectorAll(".mol-carousel").forEach((carousel, index) => {
    const counterId = `carousel-counter${index + 1}`;

    carousel.querySelector(".left-chevron").addEventListener("click", () => {
      updateCarousel(counterId, "left");
    });

    carousel.querySelector(".right-chevron").addEventListener("click", () => {
      updateCarousel(counterId, "right");
    });
  });

  // Contoh untuk mengubah nilai mol result berdasarkan perubahan di carousel
  // Bisa disesuaikan untuk event yang lebih spesifik
  // document.querySelector('.left-chevron').addEventListener('click', () => {
  //   const newMolValue = calculateResidue()
  //   updateMolResult('mol-result1', newMolValue);
  // });

  // document.querySelector('.right-chevron').addEventListener('click', () => {
  //   const newMolValue = calculateResidue()
  //   updateMolResult('mol-result2', newMolValue);
  // });

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

    // Create a clone of the dragged element
    const clonedElement = originalElement.cloneNode(true);

    // Generate a unique ID for the cloned element
    clonedElement.id = originalElement.id + "_" + Date.now();

    if (type === "acid" && acids.includes(chemicalName)) {
      acidDropZone.innerHTML = ""; // Clear the zone before adding new acid
      acidDropZone.appendChild(clonedElement);
      selectedAcid = chemicalName;
    } else if (type === "base" && bases.includes(chemicalName)) {
      baseDropZone.innerHTML = ""; // Clear the zone before adding new base
      baseDropZone.appendChild(clonedElement);
      selectedBase = chemicalName;
    }

    // Make the cloned element draggable
    clonedElement.draggable = true;
    clonedElement.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.id);
    });

    checkReaction();
    calculateProduct()
  }

  function checkReaction() {
    if (selectedAcid && selectedBase) {
      const reactionKey = `${selectedAcid}+${selectedBase}`;
      const reverseReactionKey = `${selectedBase}+${selectedAcid}`;

      const product = reactions[reactionKey] || reactions[reverseReactionKey];
      const chemConstants =
        reactionConstants[reactionKey] || reactionConstants[reverseReactionKey];
      // console.log(chemConstants)

      const productParts = product.split(" + ");
      const product1 = productParts[0];
      const product2 = productParts[1];

      if (product2 == "-") {
        answerContainer2.style.display = "none";
      } else {
        answerContainer2.style.display = "block";
      }

      answer1.textContent = product1;
      answer2.textContent = product2;
    }
  }

  function calculateProduct() {
    if (selectedAcid && selectedBase) {
      // toggle carousel for visible
      document.querySelectorAll(".mol-carousel").forEach(function(element) {
        // Ubah properti display menjadi "flex"
        element.style.display = "flex";
      });

      document.querySelectorAll(".mol-result-container").forEach(function(element) {
        // Ubah properti display menjadi "flex"
        element.style.display = "block";
      });

      // Reaktan
      const counter1 = parseInt(
        document.getElementById("carousel-counter1").getAttribute("data-value")
      );
      const counter2 = parseInt(
        document.getElementById("carousel-counter2").getAttribute("data-value")
      );

      const reactionKey = `${selectedAcid}+${selectedBase}`;
      const reverseReactionKey = `${selectedBase}+${selectedAcid}`;
      const chemConstants = reactionConstants[reactionKey] || reactionConstants[reverseReactionKey];

      let productTemp = 0;

      if (counter1 / chemConstants[0] <= counter2 / chemConstants[1]) {
        productResult1.textContent =
          parseFloat(((counter1 / chemConstants[0]) * chemConstants[2]).toFixed(2));
        productResult2.textContent =
          parseFloat(((counter1 / chemConstants[0]) * chemConstants[3]).toFixed(2));
        productTemp = 
          parseFloat(((counter1 / chemConstants[0]) * chemConstants[3]).toFixed(2));
      } else {
        productResult1.textContent =
          parseFloat(((counter2 / chemConstants[1]) * chemConstants[2]).toFixed(2));
        productResult2.textContent =
          parseFloat(((counter2 / chemConstants[1]) * chemConstants[3]).toFixed(2));
        productTemp =
          parseFloat(((counter2 / chemConstants[1]) * chemConstants[3]).toFixed(2));
      }

      if (productTemp == 0) {
        // toggle mol result visible
        document.querySelector(".mol-result-container.two").style.display = "none";
      }
      
    }
  }

  function updateCarousel(counterId, direction) {
    const counterElement = document.getElementById(counterId);
    let currentValue = parseInt(counterElement.getAttribute("data-value"));

    if (direction === "left") {
      currentValue = currentValue > 1 ? currentValue - 1 : 1;
    } else if (direction === "right") {
      currentValue = currentValue < 10 ? currentValue + 1 : 10;
    }

    counterElement.setAttribute("data-value", currentValue);
    counterElement.querySelector("strong").textContent = currentValue;

    calculateProduct();
  }

  // Fungsi untuk mengubah nilai hasil
  function updateMolResult(resultId, newValue) {
    const resultElement = document.getElementById(resultId);
    resultElement.querySelector("strong").textContent = newValue;
  }

  function updateDropZoneBorder(dropZone) {
    if (dropZone.innerHTML.trim() === "") {
      dropZone.style.border = "3px dashed #333";
    } else {
      dropZone.style.border = "none";
    }
  }
});

// const reactions = {
//   "HCl+NaOH": "NaCl + H₂O",
//   "HCl+KOH": "KCl + H₂O",
//   "HCl+Ca(OH)₂": "CaCl₂ + 2H₂O",
//   "HCl+NH₃": "NH₄Cl",
//   "2HCl+Mg(OH)₂": "MgCl₂ + 2H₂O",
//   "H₂SO₄+2NaOH": "Na₂SO₄ + 2H₂O",
//   "H₂SO₄+2KOH": "K₂SO₄ + 2H₂O",
//   "H₂SO₄+Ca(OH)₂": "CaSO₄ + 2H₂O",
//   "H₂SO₄+2NH₃": "(NH₄)₂SO₄",
//   "H₂SO₄+Mg(OH)₂": "MgSO₄ + 2H₂O",
//   "HNO₃+NaOH": "NaNO₃ + H₂O",
//   "HNO₃+KOH": "KNO₃ + H₂O",
//   "2HNO₃+Ca(OH)₂": "Ca(NO₃)₂ + 2H₂O",
//   "HNO₃+NH₃": "NH₄NO₃",
//   "2HNO₃+Mg(OH)₂": "Mg(NO₃)₂ + 2H₂O",
//   "CH₃COOH+NaOH": "CH₃COONa + H₂O",
//   "CH₃COOH+KOH": "CH₃COOK + H₂O",
//   "2CH₃COOH+Ca(OH)₂": "(CH₃COO)₂Ca + 2H₂O",
//   "CH₃COOH+NH₃": "CH₃COONH₄",
//   "2CH₃COOH+Mg(OH)₂": "(CH₃COO)₂Mg + 2H₂O",
//   "H₃PO₄+3NaOH": "Na₃PO₄ + 3H₂O",
//   "H₃PO₄+3KOH": "K₃PO₄ + 3H₂O",
//   "2H₃PO₄+3Ca(OH)₂": "Ca₃(PO₄)₂ + 6H₂O",
//   "H₃PO₄+3NH₃": "(NH₄)₃PO₄",
//   "2H₃PO₄+3Mg(OH)₂": "Mg₃(PO₄)₂ + 6H₂O"
// };
