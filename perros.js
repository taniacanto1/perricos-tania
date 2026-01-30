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

    const breedFormatted = dog.breed.replace(/-/g, ' ').toUpperCase();

    dogList.innerHTML += `
    <div class="dog-card">
      <img src="${dog.image}" alt="${dog.name}" />
      
      <div class="dog-card-content">
        <div class="dog-card-header">
          <h3>${dog.name}</h3>
          <p class="dog-breed">${breedFormatted}</p>
        </div>

        <div class="dog-info">
          <span>🎂 ${dog.age} ${dog.age === 1 ? 'año' : 'años'}</span>
          <span>${dog.gender === 'Macho' ? '♂️' : '♀️'} ${dog.gender}</span>
        </div>

        <div class="dog-card-actions">
          <button class="heart-btn ${likeClass}" onclick="likeDislike(${dog.id}, 'like')">❤️</button>
          <button class="heart-btn ${dislikeClass}" onclick="likeDislike(${dog.id}, 'dislike')">💔</button>
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

function getRandomGender() {
  return Math.random() < 0.5 ? "Macho" : "Hembra";
}

const add1Perrico = async () => {
  const perricoImg = await getRandomDogImage();
  const randomName = namesArray[Math.floor(Math.random() * namesArray.length)];
  const breed = perricoImg.split('/breeds/')[1]?.split('/')[0] || 'unknown';
  const age = getRandomAge();
  const gender = getRandomGender();

  perricosArray.push({
    id: perricoId++,
    image: perricoImg,
    name: randomName,
    breed: breed,
    age: age,
    gender: gender,
    status: null
  });

  clearFilters();
  updateCounters();
};

const add5Perricos = async () => {
  for (let i = 0; i < 5; i++) {
    const img = await getRandomDogImage();
    const randomName = namesArray[Math.floor(Math.random() * namesArray.length)];
    const breed = img.split('/breeds/')[1]?.split('/')[0] || 'unknown';
    const age = getRandomAge();
    const gender = getRandomGender();
    
    perricosArray.push({
      id: perricoId++,
      image: img,
      name: randomName,
      breed: breed,
      age: age,
      gender: gender,
      status: null
    });
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

  document.querySelector(`#${statusFilter === "like" ? "Liked" : "Disliked"}`).classList.add("active");
}

function filterByBreed(breedToFilter) {
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  
  if (breedToFilter === "") {
    currentFilter = null;
    document.querySelector("#breed-list").value = "";
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
  const buttonText = toggle.querySelector('span:last-child');
  const buttonIcon = toggle.querySelector('span:first-child');
  
  if (isHidden) {
    buttonText.textContent = "Ocultar Filtros";
    buttonIcon.textContent = "▲";
  } else {
    buttonText.textContent = "Mostrar Filtros";
    buttonIcon.textContent = "▼";
  }
}

/* -------------------------
  LIMPIAR FILTROS
------------------------- */

function clearFilters() {
  currentFilter = null;
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelector("#searchInput").value = "";
  document.querySelector("#breed-list").value = "";
  document.querySelector("#noResults").style.display = "none";
  renderPerricoArray();
}

/* -------------------------
  CONTADOR DE FILTROS
------------------------- */

function updateCounters() {
  namesArray.forEach(name => {
    const count = perricosArray.filter(dog => dog.name === name).length;
    const button = document.querySelector(`#${name} .count`);
    if (button) {
      button.textContent = count;
    }
  });
  
  const likedCount = perricosArray.filter(dog => dog.status === "like").length; 
  const likedBtn = document.querySelector("#Liked .count");
  if (likedBtn) {
    likedBtn.textContent = likedCount;
  }
  
  const dislikedCount = perricosArray.filter(dog => dog.status === "dislike").length;
  const dislikedBtn = document.querySelector("#Disliked .count");
  if (dislikedBtn) {
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

async function renderBreeds(){
  const breedsObject = await getAllBreeds();
  const selectButton = document.querySelector("#breed-list");
  const breedsNames = Object.keys(breedsObject);

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Todas las razas";
  selectButton.appendChild(defaultOption);

  for(let index = 0; index < breedsNames.length; index++){
    const option = document.createElement("option");
    option.value = breedsNames[index];
    option.textContent = breedsNames[index].toUpperCase();
    selectButton.appendChild(option);
  }
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

document.querySelector("#searchInput")
  .addEventListener("input", searchDogs);

document.querySelector("#breed-list").addEventListener("change", (e) => {
  filterByBreed(e.target.value);
});

// Cargar las razas al iniciar
renderBreeds();
