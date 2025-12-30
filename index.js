const perricosArray = [];
const namesArray = ["Sky", "Arya", "Akira", "Toby"]; // Array de nombres de perricos

/* 
-------------------------
RENDERIZADO DE PERRICOS
-------------------------
*/

function renderPerricoArray(arrayToRender = perricosArray) {
  const dogList = document.querySelector("#dog-list"); // Contenedor donde se renderizan los perricos
  dogList.innerHTML = ""; // Limpia el contenido antes de renderizar

  arrayToRender.forEach((perro, index) => {
    // Aplica clases según el estado guardado
    const likeClass = perro.status === "like" ? "liked" : "";
    const dislikeClass = perro.status === "dislike" ? "disliked" : "";

    const htmlAdd = `
    <div class="card">
      <img src="${perro.image}" alt="Perro" />
      <h3>${perro.name}</h3>
      <div class="card-items">
        <button class="heart-btn ${likeClass}" onclick="likeDislike(${index}, 'like')">❤️</button> 
        <button class="heart-btn ${dislikeClass}" onclick="likeDislike(${index}, 'dislike')">💔</button>
      </div>
    </div>`;

    dogList.innerHTML += htmlAdd; // Añade el HTML
  });
}

/* 
---------------
AÑADIR PERRICOS 
---------------
*/

/*
  Añade 1 perro con nombre aleatorio
*/

const add1Perrico = async () => {
  const perricoImg = await getRandomDogImage();
  const randomName = namesArray[Math.floor(Math.random() * namesArray.length)];

  perricosArray.push({
    image: perricoImg,
    name: randomName,
    status: null
  });

  clearFilters(); // Limpia filtros al añadir
};


/*
  Añade 5 perros con nombres aleatorios
*/

const add5Perricos = async () => {
  for (let i = 0; i < 5; i++) {
    const perritoImg = await getRandomDogImage();
    const randomName = namesArray[Math.floor(Math.random() * namesArray.length)];

    perricosArray.push({
      image: perritoImg,
      name: randomName,
      status: null
    });
  }

  clearFilters();
};


/* 
-------------------
EFECTO LIKE/DISLIKE
-------------------
*/

function likeDislike(index, type) {
  const card = document.querySelectorAll(".card")[index];
  const likeBtn = card.querySelector(".heart-btn:first-of-type");
  const dislikeBtn = card.querySelector(".heart-btn:last-of-type");

  if (type === "like") {
    const isLiked = likeBtn.classList.toggle("liked");
    dislikeBtn.classList.remove("disliked");
    perricosArray[index].status = isLiked ? "like" : null;  // Guarda estado en el array

  } else {
    const isDisliked = dislikeBtn.classList.toggle("disliked");
    likeBtn.classList.remove("liked");
    perricosArray[index].status = isDisliked ? "dislike" : null;
  }
  // Re-render para mantener consistencia visual en filtros
  renderPerricoArray(currentFilter ? getFilteredArray() : perricosArray);
}

/* 
---------
FILTROS
---------
*/

/*
  Filtro actualmente activo
*/

let currentFilter = null;

/* 
  Filtrar por nombre
*/
function filterByName(nameToFilter) {
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));

  if (currentFilter === nameToFilter) {
    currentFilter = null;
    renderPerricoArray();
  } else {
    currentFilter = nameToFilter;
    const dogsFiltered = perricosArray.filter(dog => dog.name === nameToFilter
    );

    renderPerricoArray(dogsFiltered);
    document.querySelector(`#${nameToFilter}`).classList.add("active");
  }
}

/*
  Filtrar por LIKE/DISLIKE
*/
function filterByLikeDislike(heartBtnFilter) {
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));

  if (currentFilter === heartBtnFilter) {
    currentFilter = null;
    renderPerricoArray();

  } else {
    currentFilter = heartBtnFilter;
    const likeDislikeFiltered = perricosArray.filter(
      dog => dog.status === heartBtnFilter
    );
    renderPerricoArray(likeDislikeFiltered);
    document.querySelector(`#${heartBtnFilter === "like" ? "Liked" : "Disliked"}`).classList.add("active");
  }
}

/*
  Utilidad para refrescar vista cuando hay filtro activo
*/
function getFilteredArray() {
  if (currentFilter === "like" || currentFilter === "dislike") {
    return perricosArray.filter(dog => dog.status === currentFilter);
  }
  return perricosArray.filter(dog => dog.name === currentFilter);
}

/* 
  Mostrar/ocultar contenedor de filtros
*/
function filtersActions() {
  const filterContainer = document.querySelector("#filter-container");
  const toggleBtn = document.querySelector("#toggle-filters");

  if (filterContainer.style.display === "none") {
    filterContainer.style.display = "block";
    toggleBtn.textContent = "Filtros ▲";
  } else {
    filterContainer.style.display = "none";
    toggleBtn.textContent = "Filtros ▼";
  }
}

/*
  Limpiar filtros al añadir perros nuevos
*/
function clearFilters() {
  currentFilter = null; // Resetea estado del filtro activo
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active")); // Quita clase .active de todos los botones
  renderPerricoArray(); // Vuelve a mostrar todos los perros
}


/* 
-------------
EVENTOS BOTONES
-------------
*/

// Botones de añadir
document.querySelector("#add-1-perrico").addEventListener("click", add1Perrico);
document.querySelector("#add-5-perricos").addEventListener("click", add5Perricos);

// Botones de nombres
document.querySelector("#Sky").addEventListener("click", () => filterByName("Sky"));
document.querySelector("#Arya").addEventListener("click", () => filterByName("Arya"));
document.querySelector("#Akira").addEventListener("click", () => filterByName("Akira"));
document.querySelector("#Toby").addEventListener("click", () => filterByName("Toby"));

// Botones de corazón
document.querySelector("#Liked").addEventListener("click", () => filterByLikeDislike("like"));
document.querySelector("#Disliked").addEventListener("click", () => filterByLikeDislike("dislike"));

// Botón de filtros
document.querySelector("#toggle-filters").addEventListener("click", filtersActions);