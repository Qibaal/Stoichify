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
let selectedBeaker = null;

let acidDropZone = document.getElementById("drop1");
let baseDropZone = document.getElementById("drop2");

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

// FOR SAVING STATE
const saveStateButton = document.querySelector(".state-button");

const arrowIcon = document.querySelector(".arrow-icon");

document.addEventListener("DOMContentLoaded", async function () {
    // FETCH STATE DATA
    try {
        const response = await fetch("/get-user", {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const userData = await response.json();

            document.querySelector(".user-name").textContent = userData.name;
            document.querySelector(
                ".user-score"
            ).textContent = `Highest Score: ${userData.score}`;

            // Check if state data exists
            if (
                userData.state &&
                userData.state.acidDropZone &&
                userData.state.baseDropZone
            ) {
                acidDropZone.innerHTML = userData.state.acidDropZone;
                baseDropZone.innerHTML = userData.state.baseDropZone;

                // Set selected acid and base
                selectedAcid = userData.state.selectedAcid;
                selectedBase = userData.state.selectedBase;

                // Set counters from user state
                const counter1 = userData.state.counter1;
                const counter2 = userData.state.counter2;

                const counterElement1 =
                    document.getElementById("carousel-counter1");
                counterElement1.setAttribute("data-value", counter1);
                counterElement1.querySelector("strong").textContent = counter1;

                const counterElement2 =
                    document.getElementById("carousel-counter2");
                counterElement2.setAttribute("data-value", counter2);
                counterElement2.querySelector("strong").textContent = counter2;

                // Call functions to check reaction and calculate product
                checkReaction();
                calculateProduct();
            }
        } else {
            console.error("Failed to fetch user data:", response.statusText);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }

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

    document.querySelectorAll(".mol-carousel").forEach((carousel, index) => {
        const counterId = `carousel-counter${index + 1}`;

        carousel
            .querySelector(".left-chevron")
            .addEventListener("click", () => {
                updateCarousel(counterId, "left");
            });

        carousel
            .querySelector(".right-chevron")
            .addEventListener("click", () => {
                updateCarousel(counterId, "right");
            });
    });

    // SAVE STATE
    saveStateButton.addEventListener("click", saveState);

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
        const chemicalName = originalElement
            .querySelector("p")
            .textContent.trim();

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
        calculateProduct();
    }

    function pressDrop(type) {
        if (selectedBeaker) {
            const chemicalName = selectedBeaker
                .querySelector("p")
                .textContent.trim();
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

            const product =
                reactions[reactionKey] || reactions[reverseReactionKey];
            const chemConstants =
                reactionConstants[reactionKey] ||
                reactionConstants[reverseReactionKey];

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
            document
                .querySelectorAll(".mol-carousel")
                .forEach(function (element) {
                    // Ubah properti display menjadi "flex"
                    element.style.display = "flex";
                });

            document
                .querySelectorAll(".mol-result-container")
                .forEach(function (element) {
                    // Ubah properti display menjadi "flex"
                    element.style.display = "block";
                });

            // Reaktan
            const counter1 = parseInt(
                document
                    .getElementById("carousel-counter1")
                    .getAttribute("data-value")
            );
            const counter2 = parseInt(
                document
                    .getElementById("carousel-counter2")
                    .getAttribute("data-value")
            );

            const reactionKey = `${selectedAcid}+${selectedBase}`;
            const reverseReactionKey = `${selectedBase}+${selectedAcid}`;
            const chemConstants =
                reactionConstants[reactionKey] ||
                reactionConstants[reverseReactionKey];

            let productTemp = 0;

            if (counter1 / chemConstants[0] <= counter2 / chemConstants[1]) {
                productResult1.textContent = parseFloat(
                    ((counter1 / chemConstants[0]) * chemConstants[2]).toFixed(
                        2
                    )
                );
                productResult2.textContent = parseFloat(
                    ((counter1 / chemConstants[0]) * chemConstants[3]).toFixed(
                        2
                    )
                );
                productTemp = parseFloat(
                    ((counter1 / chemConstants[0]) * chemConstants[3]).toFixed(
                        2
                    )
                );
            } else {
                productResult1.textContent = parseFloat(
                    ((counter2 / chemConstants[1]) * chemConstants[2]).toFixed(
                        2
                    )
                );
                productResult2.textContent = parseFloat(
                    ((counter2 / chemConstants[1]) * chemConstants[3]).toFixed(
                        2
                    )
                );
                productTemp = parseFloat(
                    ((counter2 / chemConstants[1]) * chemConstants[3]).toFixed(
                        2
                    )
                );
            }

            if (productTemp == 0) {
                // toggle mol result visible
                document.querySelector(
                    ".mol-result-container.two"
                ).style.display = "none";
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

    function updateDropZoneBorder(dropZone) {
        if (dropZone.innerHTML.trim() === "") {
            dropZone.style.border = "3px dashed #333";
        } else {
            dropZone.style.border = "none";
        }
    }

    async function saveState() {
        if (
            !acidDropZone.innerHTML ||
            !baseDropZone.innerHTML ||
            !selectedAcid ||
            !selectedBase
        ) {
            console.error("Fields are not fully filled up");
            return;
        }

        const counterElement1 = document.getElementById("carousel-counter1");
        const counterElement2 = document.getElementById("carousel-counter2");

        const stateData = {
            acidDropZone: acidDropZone.innerHTML,
            baseDropZone: baseDropZone.innerHTML,
            selectedAcid: selectedAcid,
            selectedBase: selectedBase,
            counter1: counterElement1.getAttribute("data-value"),
            counter2: counterElement2.getAttribute("data-value"),
        };

        try {
            const response = await fetch("/save-state", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(stateData),
            });

            if (response.ok) {
                console.log("State saved successfully!");
            } else {
                console.error("Failed to save state. Please try again.");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
});
