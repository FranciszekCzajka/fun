const openCalc = document.querySelector(".open-menu");
const calc = document.querySelector(".calculator");
const overlay = document.querySelector(".overlay");
const closeCalc = document.querySelector(".close-calculator");

let isOpened = false;

openCalc.addEventListener("click", function () {
    if (isOpened === false) {
        calc.style.left = "0px";
        overlay.style.display = "block";
        closeCalc.style.display = "block";
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
            closeCalc.style.display = "none";
            overlay.style.display = "none";
        }, 350);
        isOpened = false;
    } else {
        closeModal();
    }
});

closeCalc.addEventListener("click", function () {
    calc.style.left = "-250px";
    setTimeout(() => {
        closeCalc.style.display = "none";
        overlay.style.display = "none";
    }, 350);
    isOpened = false;
});
