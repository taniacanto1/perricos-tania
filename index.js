const perricosArray = []; // Array principal donde guardamos todos los perros. Cada perro es un objeto con id, imagen, nombre y status
const namesArray = ["Sky", "Arya", "Akira", "Toby"]; // Array con los 4 nombres que asignaremos aleatoriamente
let perricoId = 0; // Contador que incrementamos cada vez que añadimos un perro. Sirve como identificador único

/* -------------------------
  RENDER PERRICOS
------------------------- */

function renderPerricoArray(arrayToRender = perricosArray) {
  const dogList = document.querySelector("#dog-list"); // Seleccionamos el contenedor y lo vaciamos para evitar duplicados
  dogList.innerHTML = "";
  
  arrayToRender.forEach(dog => { 

    const likeClass = dog.status === "like" ? "liked" : ""; 
    const dislikeClass = dog.status === "dislike" ? "disliked" : ""; // Comprobamos el estado del perro. Si tiene like/dislike, asignamos la clase CSS correspondiente para aplicar el efecto visual

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
  const perricoImg = await getRandomDogImage(); // Llamamos a la API y esperamos la imagen
  const randomName = namesArray[Math.floor(Math.random() * namesArray.length)]; // Generamos un índice aleatorio entre 0 y 3 para elegir un nombre del array

  perricosArray.push({
    id: perricoId++,
    image: perricoImg,
    name: randomName,
    status: null // Sin like ni dislike
  });

  clearFilters(); // Limpiamos los filtros 
  updateCounters(); // Actualizamos los contadores
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
  updateCounters();
};

/* -------------------------
  LIKE / DISLIKE
------------------------- */

function likeDislike(id, type) {
  const dog = perricosArray.find(d => d.id === id); // Buscamos el perro en el array con su id único
  if (!dog) return; // Si no lo encontramos, salimos de la función

  if (type === "like") {
    dog.status = dog.status === "like" ? null : "like"; // Si el perro ya tiene like y le volvemos a dar like = lo quitamos 
  } else {
    dog.status = dog.status === "dislike" ? null : "dislike";
  }

  renderPerricoArray(currentFilter ? getFilteredArray() : perricosArray); // Si hay un filtro activo, mostramos solo los filtrados, sino todos
  updateCounters();
}

/* -------------------------
  FILTROS
------------------------- */

let currentFilter = null; // Guarda el filtro activo actual. Si es null, no hay filtro aplicado

// FILTRO POR NOMBRE
function filterByName(nameToFilter) {
  document.querySelectorAll(".filter-btn")
    .forEach(btn => btn.classList.remove("active")); // Quitamos la clase active de todos los botones de filtro

  if (currentFilter === nameToFilter) { // Si el filtro actual es el mismo que hemos pulsado, lo desactivamos y mostramos todos los perros
    currentFilter = null;
    renderPerricoArray();
    return;
  }

  currentFilter = nameToFilter; // Guardamos el filtro 
  const filtered = perricosArray.filter(dog => dog.name === nameToFilter); // Creamos un array solo con los perros de ese nombre


  renderPerricoArray(filtered); // Renderizamos solo los filtrados
  document.querySelector(`#${nameToFilter}`).classList.add("active"); // Marcamos el botón como activo

}
// FILTRO POR LIKE/DISLIKE
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

function getFilteredArray() { // Devuelve array filtrado según el tipo de filtro activo. La usamos en likeDislike para mantener el filtro al votar
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

function clearFilters() { // Resetea el filtro a null, quita las clases activas y muestra todos los perros. Se ejecuta automáticamente al añadir perros nuevos"
  currentFilter = null;

  document.querySelectorAll(".filter-btn")
    .forEach(btn => btn.classList.remove("active"));

  renderPerricoArray();
}

/* -------------------------
  CONTADOR DE FILTROS
------------------------- */

function updateCounters() {
  // Contador para cada nombre
  namesArray.forEach(name => {
    const count = perricosArray.filter(dog => dog.name === name).length; // Contamos cuántos perros tienen ese nombre con filter().lenght
    const button = document.querySelector(`#${name} .count`);
    if (button) {
      button.textContent = count; // Actualiza el número
    }
  });
  
  // Contador para liked
  const likedCount = perricosArray.filter(dog => dog.status === "like").length; 
  const likedBtn = document.querySelector("#Liked .count");
  if (likedBtn) {
    likedBtn.textContent = likedCount;
  }
  
  // Contador para disliked
  const dislikedCount = perricosArray.filter(dog => dog.status === "dislike").length;
  const dislikedBtn = document.querySelector("#Disliked .count");
  if (dislikedBtn) {
    dislikedBtn.textContent = dislikedCount;
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