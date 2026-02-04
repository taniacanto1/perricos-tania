
// Obtener imagen aleatoria de cualquier raza
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

// Obtener imagen de una raza específica
async function getDogImageByBreed(breed) {
  try {
    const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error(`Error fetching ${breed} image:`, error);
    return 'https://via.placeholder.com/400x300?text=Error+loading+image';
  }
}

// Obtener todas las razas disponibles
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