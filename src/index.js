import axios from 'axios';


axios.defaults.baseURL = 'https://pixabay.com/api/';

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', event => {
  event.preventDefault();
  let value = input.value;
  fetchGallery(value).then(data => makeGallery(data));
});

const fetchGallery = async q => {
  const response = await axios.get(
    `?key=39840691-deed82df9d56c5b25606cb90f&q=${q}&orientation=horizontal&safesearch=true&image_type=photo`
  );
  const allData = await response.data.hits;
  const data = await filterData(allData);
  return data;
};

function filterData(array) {
  return array.map(element => ({
    webformatURL: element.webformatURL,
    largeImage: element.largeImageURL,
    tags: element.tags,
    likes: element.likes,
    views: element.views,
    comments: element.comments,
    downloads: element.downloads,
  }));
}

function makeGallery(data) {
  data.forEach(element => {
    let markup = `<div class="photo-card">
  <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>`;
    gallery.insertAdjacentHTML('beforeend', markup);
  });
}
