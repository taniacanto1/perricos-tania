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
          <button class="heart-btn ${likeClass}" onclick="window.likeDislike(${dog.id}, event)">❤️</button>
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
  applyFilters(); // Re-aplicar filtros automáticamente
};

const add5Perricos = async () => {
  for (let i = 0; i < 5; i++) {
    const nuevoPerrico = await createPerricoObject();
    perricosArray.push(nuevoPerrico);
  }
  applyFilters(); // Re-aplicar filtros automáticamente
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
  const maxAge = parseInt(document.getElementById("ageSlider").value);
  
  const showMale = document.getElementById("genderMale").checked;
  const showFemale = document.getElementById("genderFemale").checked;

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

    // D. Filtro Edad (Menor o igual a la seleccionada)
    if (dog.age > maxAge) {
      return false;
    }

    // E. Filtro Género
    if (dog.gender === "Macho" && !showMale) return false;
    if (dog.gender === "Hembra" && !showFemale) return false;

    return true; // Si pasa todas las validaciones, se muestra
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
  
  // Nota: Si el array original está vacío (al inicio), no mostrar mensaje de error
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

  // 1. Selector para AÑADIR perros (Generar)
  const addBreedList = document.querySelector("#breed-list");
  if (addBreedList) {
    addBreedList.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Todas las razas (aleatorio)";
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
  EVENT LISTENERS
------------------------- */

// Listeners para FILTROS (Tiempo real)
document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("favSwitch").addEventListener("change", applyFilters);
document.getElementById("filter-breed-list").addEventListener("change", applyFilters);
document.getElementById("genderMale").addEventListener("change", applyFilters);
document.getElementById("genderFemale").addEventListener("change", applyFilters);

// Listener para el Slider de Edad
document.getElementById("ageSlider").addEventListener("input", (e) => {
  document.getElementById("ageDisplay").textContent = e.target.value + " años";
  applyFilters();
});

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