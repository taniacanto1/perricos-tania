const perricosArray = [];
const namesArray = ["Sky", "Arya", "Akira", "Toby"]; // Array de nombres de perricos

function renderPerricoArray(arrayToRender = perricosArray) {
  const dogList = document.querySelector("#dog-list"); // Contenedor donde se renderizan los perricos
  dogList.innerHTML = ""; // Limpia el contenido antes de renderizar

  arrayToRender.forEach((perro, index) => {
    const htmlAdd = `<div class="card">
    <img src="${perro.image}" alt="Perro" />
    <h3>${perro.name}</h3>
    <div class="card-items">
      <button class="heart-btn" onclick="likeDislike(${index}, 'like')">❤️</button> 
      <button class="heart-btn" onclick="likeDislike(${index}, 'dislike')">💔</button>
  </div>
</div>`;

    console.log("innerHtml posición", index, dogList.innerHTML);

    dogList.innerHTML += htmlAdd; // Añade el HTML de cada perro al contenedor (se repite por cada perro)
  });
}

/* 
---------------
AÑADIR PERRICOS 
---------------
*/

// Añade 1 perro con nombre aleatorio
const add1Perrico = async () => {
  const perricoImg = await getRandomDogImage(); // Espera a que se obtenga la imagen del perro antes de continuar
  const randomName = namesArray[Math.floor(Math.random() * namesArray.length)]; // Selecciona un nombre aleatorio del array | Math.random() devuelve un número entre 0 y 1, que se multiplica por la longitud del array para obtener un índice válido) y Math.floor() redondea hacia abajo al entero más cercano
  perricosArray.push({ image: perricoImg, name: randomName });
  renderPerricoArray();
};

// Añade 5 perros con nombres aleatorios
const add5Perricos = async () => {
  for (let i = 0; i < 5; i++) {
    const perritoImg = await getRandomDogImage();
    const randomName =
      namesArray[Math.floor(Math.random() * namesArray.length)];
    perricosArray.push({ image: perritoImg, name: randomName });
  }
  renderPerricoArray();
};

/* 
-------------------
EFECTO LIKE/DISLIKE
-------------------
*/

function likeDislike(index, type) {
  const card = document.querySelectorAll(".card")[index]; // Selecciona la tarjeta del perro correspondiente
  const likeBtn = card.querySelector(".heart-btn:first-of-type");
  const dislikeBtn = card.querySelector(".heart-btn:last-of-type");

  if (type === "like") {
    likeBtn.classList.toggle("liked");
    dislikeBtn.classList.remove("disliked");
  } else {
    dislikeBtn.classList.toggle("disliked");
    likeBtn.classList.remove("liked");
  }
}

/* 
---------
FILTROS
---------
*/

// Variable para guardar el filtro actual
let currentFilter = null;

// Función para filtrar por nombre
function filterByName(nameToFilter) {
  document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active")); // Quita la clase 'active' de todos los botones
  if (currentFilter === nameToFilter) {
    currentFilter = null;
    renderPerricoArray(); // Si ya está filtrado por ese nombre, muestra todos
  } else {
    currentFilter = nameToFilter;
    const dogsFiltered = perricosArray.filter((dog) => dog.name === nameToFilter
    );
    renderPerricoArray(dogsFiltered); // Filtra por el nuevo nombre
    document.querySelector(`#${nameToFilter}`).classList.add("active"); // Añade la clase 'active' al botón clickeado
  }
}

// Función para mostrar/ocultar filtros
function toggleFilters() {
  const filterContainer = document.querySelector("#filter-container"); // ID del contenedor de filtros
  const toggleBtn = document.querySelector("#toggle-filters"); // ID del botón de toggle

  if (filterContainer.style.display === "none") {
    filterContainer.style.display = "block"; // Muestra los filtros
    toggleBtn.textContent = "Filtros ▲"; // Cambia el icono del botón
  } else {
    filterContainer.style.display = "none"; // Oculta los filtros
    toggleBtn.textContent = "Filtros ▼"; 
  }
}

/* 
-------------
EVENTOS BOTONES
-------------
*/

document.querySelector("#add-1-perrico").addEventListener("click", function () {
  add1Perrico();
});

document.querySelector("#add-5-perricos").addEventListener("click", function () {
  add5Perricos();
  });

document.querySelector("#Sky").addEventListener("click", function () {
  filterByName("Sky");
});

document.querySelector("#Arya").addEventListener("click", function () {
  filterByName("Arya");
});

document.querySelector("#Akira").addEventListener("click", function () {
  filterByName("Akira");
});

document.querySelector("#Toby").addEventListener("click", function () {
  filterByName("Toby");
});

document.querySelector("#toggle-filters").addEventListener("click", function () {
  toggleFilters();
});