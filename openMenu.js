const openMenuButton = document.querySelector(".open-menu");
const calc = document.querySelector(".calculator");
let isOpened = false;

openMenuButton.addEventListener("click", function () {
    function move() {
        if (isOpened === false) {
            calc.style.left = "0px";
            isOpened = true;
        } else {
            calc.style.left = "-250px";
            isOpened = false;
        }
    }
    requestAnimationFrame(move);
});
