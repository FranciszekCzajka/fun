const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
const errorMesasge = document.querySelector(".error-message");

function openModal(text) {
    modal.style.display = "flex";
    overlay.style.display = "block";
    errorMesasge.innerText = text;
}

function closeModal() {
    modal.style.display = "none";
    overlay.style.display = "none";
}

closeButton.addEventListener("click", closeModal);
