document.addEventListener("DOMContentLoaded", function () {
  // HUMOR
  const humorItems = document.querySelectorAll("#interests .features-item");

  humorItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      // Remove 'selected' em tudo
      humorItems.forEach((el) => el.classList.remove("selected"));
      // Adiciona a classe ao item clicado
      this.classList.add("selected");
    });
  });

  // GENRE
  const genreItems = document.querySelectorAll("#portfolio .portfolio-item");

  genreItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      // Alterna a classe 'selected' ao clicar
      this.classList.toggle("selected");
    });
  });
});
