const perricosArray = [];
const namesArray = ["Sky", "Arya", "Akira", "Toby"];
let perricoId = 0;

/* -------------------------
  RENDER PERRICOS
------------------------- */

function renderPerricoArray(arrayToRender = perricosArray) {

  const dogList = document.querySelector("#dog-list");
  dogList.innerHTML = "";

  arrayToRender.forEach(dog => {

    const likeClass = dog.status === "like" ? "liked" : "";
    const dislikeClass = dog.status === "dislike" ? "disliked" : "";

    dogList.innerHTML += `
    <div class="card">
      <img src="${dog.image}" alt="Perro" />
      <h3>${dog.name}</h3>

      <div class="card-items">
        <button class="heart-btn ${likeClass}" onclick="likeDislike(${dog.id}, 'like')">❤️</button>
        <button class="heart-btn ${dislikeClass}" onclick="likeDislike(${dog.id}, 'dislike')">💔</button>
      </div>
    </div>`;
  });
}

/* -------------------------
  AÑADIR PERRICOS
------------------------- */

const add1Perrico = async () => {

  const perricoImg = await getRandomDogImage();
  const randomName = namesArray[Math.floor(Math.random() * namesArray.length)];

  perricosArray.push({
    id: perricoId++,
    image: perricoImg,
    name: randomName,
    status: null
  });

  clearFilters();
};

const add5Perricos = async () => {
  for (let i = 0; i < 5; i++) {
    const img = await getRandomDogImage();
    const randomName = namesArray[Math.floor(Math.random() * namesArray.length)];
    
    perricosArray.push({
      id: perricoId++,
      image: img,
      name: randomName,
      status: null
    });
  }

  clearFilters();
};

/* -------------------------
  LIKE / DISLIKE
------------------------- */

function likeDislike(id, type) {

  const dog = perricosArray.find(d => d.id === id);
  if (!dog) return;

  if (type === "like") {
    dog.status = dog.status === "like" ? null : "like";
  } else {
    dog.status = dog.status === "dislike" ? null : "dislike";
  }

  renderPerricoArray(currentFilter ? getFilteredArray() : perricosArray);
}

/* -------------------------
  FILTROS
------------------------- */

let currentFilter = null;

function filterByName(nameToFilter) {

  document.querySelectorAll(".filter-btn")
    .forEach(btn => btn.classList.remove("active"));

  if (currentFilter === nameToFilter) {
    currentFilter = null;
    renderPerricoArray();
    return;
  }

  currentFilter = nameToFilter;

  const filtered = perricosArray.filter(dog => dog.name === nameToFilter);

  renderPerricoArray(filtered);
  document.querySelector(`#${nameToFilter}`).classList.add("active");
}

function filterByLikeDislike(statusFilter) {

  document.querySelectorAll(".filter-btn")
    .forEach(btn => btn.classList.remove("active"));

  if (currentFilter === statusFilter) {
    currentFilter = null;
    renderPerricoArray();
    return;
  }

  currentFilter = statusFilter;
  const filtered = perricosArray.filter(dog => dog.status === statusFilter);
  renderPerricoArray(filtered);

  document
    .querySelector(`#${statusFilter === "like" ? "Liked" : "Disliked"}`)
    .classList.add("active");
}

function getFilteredArray() {

  if (currentFilter === "like" || currentFilter === "dislike") {
    return perricosArray.filter(dog => dog.status === currentFilter);
  }
  return perricosArray.filter(dog => dog.name === currentFilter);
}

/* -------------------------
  MOSTRAR / OCULTAR FILTROS
------------------------- */

function filtersActions() {

  const container = document.querySelector("#filter-container");
  const toggle = document.querySelector("#toggle-filters");

  const hidden = container.style.display === "none";

  container.style.display = hidden ? "block" : "none";
  toggle.textContent = hidden ? "Filtros ▲" : "Filtros ▼";
}

/* -------------------------
  LIMPIAR FILTROS
------------------------- */

function clearFilters() {

  currentFilter = null;

  document.querySelectorAll(".filter-btn")
    .forEach(btn => btn.classList.remove("active"));

  renderPerricoArray();
}

/* -------------------------
  EVENTOS
------------------------- */

document.querySelector("#add-1-perrico")
  .addEventListener("click", add1Perrico);

document.querySelector("#add-5-perricos")
  .addEventListener("click", add5Perricos);

document.querySelector("#Sky").addEventListener("click", () => filterByName("Sky"));
document.querySelector("#Arya").addEventListener("click", () => filterByName("Arya"));
document.querySelector("#Akira").addEventListener("click", () => filterByName("Akira"));
document.querySelector("#Toby").addEventListener("click", () => filterByName("Toby"));

document.querySelector("#Liked")
  .addEventListener("click", () => filterByLikeDislike("like"));

document.querySelector("#Disliked")
  .addEventListener("click", () => filterByLikeDislike("dislike"));

document.querySelector("#toggle-filters")
  .addEventListener("click", filtersActions);