// console.log(localStorage.getItem("maxscore"));

const scor = document.querySelector("p");
scor.innerHTML = "Your Score is: " + localStorage.getItem("maxscore");
