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
  SIDEBAR TOGGLE
------------------------- */

const sidebar = document.getElementById('sidebar');
const filterToggleBtn = document.getElementById('filterToggleBtn');

filterToggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
  filterToggleBtn.classList.toggle('active');
});

/* -------------------------
  RENDER PERRICOS
------------------------- */

function renderPerricoArray(arrayToRender = perricosArray) {
  const dogList = document.querySelector("#dog-list");
  dogList.innerHTML = "";

  arrayToRender.forEach((dog) => {
    const likeClass = dog.status === "like" ? "liked" : "";
    const breedFormatted = dog.breed.replace(/-/g, " ").toUpperCase();

    dogList.innerHTML += `
    <div class="dog-card">
      <div class="dog-card-image-wrapper">
        <img src="${dog.image}" alt="${dog.name}" />
        <div class="dog-card-image-overlay"></div>
        <button class="heart-btn ${likeClass}" onclick="window.likeDislike(${dog.id}, event)">
          ❤️
        </button>
      </div>
  
      <div class="dog-card-content">
        <h3 class="dog-card-title">${dog.name}</h3>
        <p class="dog-breed">${breedFormatted}</p>
        
        <div class="dog-info">
          <span>${dog.gender === "Macho" ? "♂️" : "♀️"} ${dog.gender}</span>
          <span class="info-divider"></span>
          <span>${dog.age} ${dog.age === 1 ? "año" : "años"}</span>
        </div>
        
        <button class="meet-btn">Conocer más</button>
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
  applyFilters();
};

const add5Perricos = async () => {
  for (let i = 0; i < 5; i++) {
    const nuevoPerrico = await createPerricoObject();
    perricosArray.push(nuevoPerrico);
  }
  applyFilters();
};

/* -------------------------
  LIKE / DISLIKE
------------------------- */

window.likeDislike = function(id, event) {
  if(event) event.preventDefault();

  const dog = perricosArray.find(d => d.id === id);
  if (!dog) return;

  dog.status = dog.status === "like" ? null : "like";

  const isFavoritesMode = document.getElementById("favSwitch").checked;

  if (isFavoritesMode) {
    applyFilters();
  } else {
    const button = event.currentTarget; 
    button.classList.toggle("liked");
  }
}

/* -------------------------
  SISTEMA DE FILTRADO UNIFICADO
------------------------- */

function applyFilters() {
  // 1. Obtener valores de los inputs del DOM
  const searchText = document.getElementById("searchInput").value.toLowerCase().trim();
  const onlyFavorites = document.getElementById("favSwitch").checked;
  const selectedBreed = document.getElementById("filter-breed-list").value;
  
  // Género - usando botones
  const showMale = document.getElementById("genderMaleBtn").classList.contains("active");
  const showFemale = document.getElementById("genderFemaleBtn").classList.contains("active");

  // Edad - usando checkboxes
  const agePuppy = document.getElementById("agePuppy").checked;
  const ageYoung = document.getElementById("ageYoung").checked;
  const ageAdult = document.getElementById("ageAdult").checked;

  // 2. Filtrar el array
  const filteredList = perricosArray.filter((dog) => {
    // A. Filtro Texto (Nombre)
    if (searchText && !dog.name.toLowerCase().includes(searchText)) {
      return false; 
    }

    // B. Filtro Favoritos
    if (onlyFavorites && dog.status !== "like") {
      return false;
    }

    // C. Filtro Raza (Solo si hay raza seleccionada)
    if (selectedBreed && dog.breed !== selectedBreed) {
      return false;
    }

    // D. Filtro Género
    if (dog.gender === "Macho" && !showMale) return false;
    if (dog.gender === "Hembra" && !showFemale) return false;

    // E. Filtro Edad
    let ageMatch = false;
    if (agePuppy && dog.age >= 0 && dog.age <= 1) ageMatch = true;
    if (ageYoung && dog.age > 1 && dog.age <= 3) ageMatch = true;
    if (ageAdult && dog.age > 3) ageMatch = true;
    
    if (!ageMatch) return false;

    return true;
  });

  // 3. Renderizar o mostrar mensaje "Sin resultados"
  const noResults = document.getElementById("noResults");
  const dogList = document.querySelector("#dog-list");

  if (filteredList.length === 0 && perricosArray.length > 0) {
    dogList.innerHTML = "";
    noResults.style.display = "block";
  } else {
    noResults.style.display = "none";
    renderPerricoArray(filteredList);
  }
  
  if (perricosArray.length === 0) {
    noResults.style.display = "none";
  }
}

/* -------------------------
  RAZAS
------------------------- */

async function renderBreeds() {
  const breedsObject = await getAllBreeds();
  const breedsNames = Object.keys(breedsObject);

  // 1. Selector para AÑADIR perros (Sticky bar)
  const addBreedList = document.querySelector("#breed-list");
  if (addBreedList) {
    addBreedList.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Todas las razas";
    addBreedList.appendChild(defaultOption);

    breedsNames.forEach(breed => {
      const option = document.createElement("option");
      option.value = breed;
      option.textContent = breed.toUpperCase();
      addBreedList.appendChild(option);
    });
  }

  // 2. Selector para FILTRAR perros (Sidebar)
  const filterBreedList = document.querySelector("#filter-breed-list");
  if (filterBreedList) {
    filterBreedList.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Todas las razas";
    filterBreedList.appendChild(defaultOption);

    breedsNames.forEach(breed => {
      const option = document.createElement("option");
      option.value = breed;
      option.textContent = breed.toUpperCase();
      filterBreedList.appendChild(option);
    });
  }
}

/* -------------------------
  BOTONES DE GÉNERO
------------------------- */

const genderMaleBtn = document.getElementById("genderMaleBtn");
const genderFemaleBtn = document.getElementById("genderFemaleBtn");

genderMaleBtn.addEventListener("click", () => {
  genderMaleBtn.classList.toggle("active");
  applyFilters();
});

genderFemaleBtn.addEventListener("click", () => {
  genderFemaleBtn.classList.toggle("active");
  applyFilters();
});

/* -------------------------
  LIMPIAR FILTROS
------------------------- */

const clearFiltersBtn = document.getElementById("clearFiltersBtn");

clearFiltersBtn.addEventListener("click", () => {
  // Resetear búsqueda
  document.getElementById("searchInput").value = "";
  
  // Resetear favoritos
  document.getElementById("favSwitch").checked = false;
  
  // Resetear raza
  document.getElementById("filter-breed-list").value = "";
  
  // Resetear género (activar ambos)
  genderMaleBtn.classList.add("active");
  genderFemaleBtn.classList.add("active");
  
  // Resetear edad (marcar todos)
  document.getElementById("agePuppy").checked = true;
  document.getElementById("ageYoung").checked = true;
  document.getElementById("ageAdult").checked = true;
  
  applyFilters();
});

/* -------------------------
  EVENT LISTENERS
------------------------- */

// Listeners para FILTROS (Tiempo real)
document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("favSwitch").addEventListener("change", applyFilters);
document.getElementById("filter-breed-list").addEventListener("change", applyFilters);

// Checkboxes de edad
document.getElementById("agePuppy").addEventListener("change", applyFilters);
document.getElementById("ageYoung").addEventListener("change", applyFilters);
document.getElementById("ageAdult").addEventListener("change", applyFilters);

// Listener para seleccionar raza a GENERAR
const breedListAdd = document.querySelector("#breed-list");
if (breedListAdd) {
  breedListAdd.addEventListener("change", (e) => {
    selectedBreedForAdd = e.target.value;
  });
}

// Botones de acción
document.querySelector("#add-1-dog").addEventListener("click", add1Perrico);
document.querySelector("#add-5-dogs").addEventListener("click", add5Perricos);

// Inicializar
renderBreeds();