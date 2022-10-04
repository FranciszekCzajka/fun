const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
const errorMesasge = document.querySelector(".error-message");

function openModal(text) {
    modal.style.display = "flex";
    errorMesasge.innerText = text;
}

function closeModal() {
    modal.style.display = "none";
}

closeButton.addEventListener("click", closeModal);
