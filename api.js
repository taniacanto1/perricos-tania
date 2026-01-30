// API Functions for Dog CEO API
// Este archivo debe contener tus funciones para obtener imágenes de perros

async function getRandomDogImage() {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error fetching dog image:', error);
    return 'https://via.placeholder.com/400x300?text=Error+loading+image';
  }
}

async function getAllBreeds() {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error fetching breeds:', error);
    return {};
  }
}
