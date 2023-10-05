import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const axios = require('axios').default;
axios.defaults.baseURL = 'https://pixabay.com/api/';

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', event => {
  event.preventDefault();
  let value = input.value;
  gallery.innerHTML = '';
  fetchGallery(value)
    .then(data => makeGallery(data))
    .catch(error => console.log(error));
});

//----------------------------------------

const fetchGallery = async q => {
  const response = await axios.get(
    `?key=39840691-deed82df9d56c5b25606cb90f&q=${q}&orientation=horizontal&safesearch=true&per_page=40&image_type=photo`
  );
  const allData = await response.data;
  const validateData = await validateArray(allData);
  const hits = await filterData(validateData);
  return hits;
};

function validateArray(val) {
  if (!(val.total > 0)) {
    Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    throw new Error();
  }

  return val.hits;
}

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
    const { webformatURL, tags, likes, views, comments, downloads } = element;
    let markup = `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div>`;
    gallery.insertAdjacentHTML('beforeend', markup);
  });
}
