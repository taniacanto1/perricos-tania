const perricosArray = [];
const namesArray = {
  males: [
    "Balto", "Bolt", "Bruno", "Coco", "Dante", 
    "Eros", "Hachi", "Kaiser", "Kenzo", "Luck", 
    "Max", "Oreo", "Poppy", "Ragnar", "Rocky",
    "Sky", "Thor", "Toby", "Yoda", "Zeus",
  ],
  females: [
    "Akira", "Arya", "Atenea", "Bella", "Bimba", 
    "Daisy", "Frida", "Gala", "Kala", "Laika", 
    "Lola", "Luna", "Maya", "Mia", "Molly", 
    "Nala", "Roxy", "Shasha", "Venus", "Zoe",
  ]
};

let perricoId = 0;
let selectedBreedForAdd = ""; // Raza seleccionada para añadir perros

/* -------------------------
  RENDER PERRICOS
------------------------- */

function renderPerricoArray(arrayToRender = perricosArray) {
  const dogList = document.querySelector("#dog-list");
  dogList.innerHTML = "";

  arrayToRender.forEach((dog) => {
    const likeClass = dog.status === "like" ? "liked" : "";
    const dislikeClass = dog.status === "dislike" ? "disliked" : "";

    const breedFormatted = dog.breed.replace(/-/g, " ").toUpperCase();

    dogList.innerHTML += `
    <div class="dog-card">
      <img src="${dog.image}" alt="${dog.name}" />
  
      <div class="dog-card-content">
        <div class="dog-card-header">
          <div class="header-text">
            <h3 class="dog-card-title">${dog.name}</h3>
              <p class="dog-breed">${breedFormatted}</p>
        </div>
      
        <div class="dog-card-actions">
          <button class="heart-btn ${likeClass}" onclick="likeDislike(${dog.id}, 'like')">❤️</button>
        </div>
      </div>

      <div class="dog-info">
        <span>${dog.gender === "Macho" ? "♂️" : "♀️"} ${dog.gender}</span>
        <span>|</span>
        <span>${dog.age} ${dog.age === 1 ? "año" : "años"}</span>
        </div>
        </div>
      </div>`;
  });
}

/* -------------------------
  AÑADIR PERRICOS
------------------------- */

function getRandomAge() {
  return Math.floor(Math.random() * 15) + 1;
}

const createPerricoObject = async () => {
  let img;
  let breed;

  // Si hay una raza seleccionada para añadir, obtener imagen de esa raza
  if (selectedBreedForAdd) {
    img = await getDogImageByBreed(selectedBreedForAdd);
    breed = selectedBreedForAdd;
  } else {
    // Si no, obtener imagen aleatoria de cualquier raza
    img = await getRandomDogImage();
    breed = img.split('/breeds/')[1]?.split('/')[0] || 'unknown';
  }

  const age = getRandomAge();

  // CORREGIDO: Math.random() en lugar de Match.random()
  const genderLabel = Math.random() < 0.5 ? "Macho" : "Hembra";

  const genderKey = genderLabel === "Macho" ? "males" : "females";

  const namesList = namesArray[genderKey];
  const randomName = namesList[Math.floor(Math.random() * namesList.length)];

  return {
    id: perricoId++,
    image: img,
    name: randomName,
    breed: breed,
    age: age,
    gender: genderLabel,
    status: null,
  };
};

const add1Perrico = async () => {
  const nuevoPerrico = await createPerricoObject();
  perricosArray.push(nuevoPerrico);
  clearFilters();
  updateCounters();
};

const add5Perricos = async () => {
  for (let i = 0; i < 5; i++) {
    const nuevoPerrico = await createPerricoObject();
    perricosArray.push(nuevoPerrico);
  }
  clearFilters();
  updateCounters();
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
  updateCounters();
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
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));

  if (currentFilter === statusFilter) {
    currentFilter = null;
    renderPerricoArray();
    return;
  }

  currentFilter = statusFilter;
  const filtered = perricosArray.filter(dog => dog.status === statusFilter);
  renderPerricoArray(filtered);

  const buttonId = statusFilter === "like" ? "Liked" : "Disliked";
  const button = document.querySelector(`#${buttonId}`);
  if (button) {
    button.classList.add("active");
  }
}

// NUEVO: Filtrar por raza (para el selector de FILTROS)
function filterByBreed(breedToFilter) {
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  
  if (breedToFilter === "") {
    currentFilter = null;
    const filterBreedList = document.querySelector("#filter-breed-list");
    if (filterBreedList) {
      filterBreedList.value = "";
    }
    renderPerricoArray();
    return;
  }

  currentFilter = `breed-${breedToFilter}`;
  const filtered = perricosArray.filter(dog => dog.breed === breedToFilter);
  renderPerricoArray(filtered);
}

function getFilteredArray() {
  if (currentFilter === "like" || currentFilter === "dislike") {
    return perricosArray.filter(dog => dog.status === currentFilter);
  }
  if (currentFilter && currentFilter.startsWith("breed-")) {
    const breed = currentFilter.replace("breed-", "");
    return perricosArray.filter(dog => dog.breed === breed);
  }
  return perricosArray.filter(dog => dog.name === currentFilter);
}

/* -------------------------
  MOSTRAR / OCULTAR FILTROS
------------------------- */

function filtersActions() {
  const container = document.querySelector("#filter-container");
  const toggle = document.querySelector("#toggle-filters");

  const isHidden = container.style.display === "none";

  container.style.display = isHidden ? "block" : "none";
  
  // Actualizar el texto del botón
  const buttonSpan = toggle.querySelector('span');
  
  if (isHidden) {
    buttonSpan.textContent = "Filtros ▲";
  } else {
    buttonSpan.textContent = "Filtros ▼";
  }
}

/* -------------------------
  LIMPIAR FILTROS
------------------------- */

function clearFilters() {
  currentFilter = null;
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  
  const searchInput = document.querySelector("#searchInput");
  if (searchInput) {
    searchInput.value = "";
  }
  
  const filterBreedList = document.querySelector("#filter-breed-list");
  if (filterBreedList) {
    filterBreedList.value = "";
  }
  
  const noResults = document.querySelector("#noResults");
  if (noResults) {
    noResults.style.display = "none";
  }
  
  renderPerricoArray();
}

/* -------------------------
  CONTADOR DE FILTROS
------------------------- */

function updateCounters() {
  // Unimos ambos arrays para tener una lista única de nombres a contar
  const allNames = [...namesArray.males, ...namesArray.females];

  allNames.forEach(name => {
    const count = perricosArray.filter(dog => dog.name === name).length;
    const button = document.querySelector(`#${name} .count`);
    if (button) {
      button.textContent = count;
    }
  });
  
  const likedCount = perricosArray.filter(dog => dog.status === "like").length; 
  const likedBtn = document.querySelector("#Liked .count");
  if (likedBtn) likedBtn.textContent = likedCount;
  
  const dislikedBtn = document.querySelector("#Disliked .count");
  if (dislikedBtn) {
    const dislikedCount = perricosArray.filter(dog => dog.status === "dislike").length;
    dislikedBtn.textContent = dislikedCount;
  }
}

/* -------------------------
  BÚSQUEDA EN TIEMPO REAL
------------------------- */

function searchDogs() {
  const searchInput = document.querySelector("#searchInput");
  const searchTerm = searchInput.value.toLowerCase().trim();
  const noResults = document.querySelector("#noResults");
  
  if (searchTerm === "") {
    renderPerricoArray(currentFilter ? getFilteredArray() : perricosArray);
    noResults.style.display = "none";
    return;
  }
  
  let filtered = perricosArray.filter(dog => 
    dog.name.toLowerCase().includes(searchTerm)
  );
  
  if (currentFilter) {
    if (currentFilter === "like" || currentFilter === "dislike") {
      filtered = filtered.filter(dog => dog.status === currentFilter);
    } else if (currentFilter.startsWith("breed-")) {
      const breed = currentFilter.replace("breed-", "");
      filtered = filtered.filter(dog => dog.breed === breed);
    } else {
      filtered = filtered.filter(dog => dog.name === currentFilter);
    }
  }
  
  if (filtered.length === 0) {
    noResults.style.display = "block";
    document.querySelector("#dog-list").innerHTML = "";
  } else {
    noResults.style.display = "none";
    renderPerricoArray(filtered);
  }
}

/* -------------------------
  RAZAS
------------------------- */

async function renderBreeds() {
  const breedsObject = await getAllBreeds();
  const breedsNames = Object.keys(breedsObject);

  // Selector para AÑADIR perros (arriba)
  const addBreedList = document.querySelector("#breed-list");
  if (addBreedList) {
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Todas las razas (aleatorio)";
    addBreedList.appendChild(defaultOption);

    for (let index = 0; index < breedsNames.length; index++) {
      const option = document.createElement("option");
      option.value = breedsNames[index];
      option.textContent = breedsNames[index].toUpperCase();
      addBreedList.appendChild(option);
    }
  }

  // Selector para FILTRAR perros (dentro de filtros)
  const filterBreedList = document.querySelector("#filter-breed-list");
  if (filterBreedList) {
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Todas las razas";
    filterBreedList.appendChild(defaultOption);

    for (let index = 0; index < breedsNames.length; index++) {
      const option = document.createElement("option");
      option.value = breedsNames[index];
      option.textContent = breedsNames[index].toUpperCase();
      filterBreedList.appendChild(option);
    }
  }
}

/* -------------------------
  EVENTOS
------------------------- */

document.querySelector("#add-1-dog")
  .addEventListener("click", add1Perrico);

document.querySelector("#add-5-dogs")
  .addEventListener("click", add5Perricos);

// Evento para el selector de raza para AÑADIR perros
const breedListAdd = document.querySelector("#breed-list");
if (breedListAdd) {
  breedListAdd.addEventListener("change", (e) => {
    selectedBreedForAdd = e.target.value;
    console.log("Raza seleccionada para añadir:", selectedBreedForAdd || "Aleatorio");
  });
}

// Evento para el botón de Liked
const likedBtn = document.querySelector("#Liked");
if (likedBtn) {
  likedBtn.addEventListener("click", () => filterByLikeDislike("like"));
}

// Evento para el botón de Disliked (si existe)
const dislikedBtn = document.querySelector("#Disliked");
if (dislikedBtn) {
  dislikedBtn.addEventListener("click", () => filterByLikeDislike("dislike"));
}

// Evento para mostrar/ocultar filtros
document.querySelector("#toggle-filters")
  .addEventListener("click", filtersActions);

// Evento para búsqueda
const searchInput = document.querySelector("#searchInput");
if (searchInput) {
  searchInput.addEventListener("input", searchDogs);
}

// Evento para el selector de raza para FILTRAR perros
const filterBreedList = document.querySelector("#filter-breed-list");
if (filterBreedList) {
  filterBreedList.addEventListener("change", (e) => {
    filterByBreed(e.target.value);
  });
}

// Cargar las razas al iniciar
renderBreeds();