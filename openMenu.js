const openMenuButton = document.querySelector(".open-menu");
const calc = document.querySelector(".calculator");
const overlay = document.querySelector(".overlay");

let isOpened = false;

openMenuButton.addEventListener("click", function () {
    if (isOpened === false) {
        calc.style.left = "0px";
        overlay.style.display = "block";
        isOpened = true;
    } else {
        calc.style.left = "-250px";
        overlay.style.display = "none";
        isOpened = false;
    }
});

overlay.addEventListener("click", function () {
    if (isOpened === true) {
        calc.style.left = "-250px";
        setTimeout(() => {
            overlay.style.display = "none";
        }, 350);
        isOpened = false;
    }
    closeModal();
});
