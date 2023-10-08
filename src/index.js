import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

axios.defaults.baseURL = 'https://pixabay.com/api/';

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
let page = 1;

form.addEventListener('submit', event => {
  event.preventDefault();
  let value = input.value;
  page = 1;
  gallery.innerHTML = '';
  fetchGallery(value, page)
    .then(data => makeGallery(data))
    .catch(error => console.log(error));
});

loadMore.addEventListener('click', () => {
  page++;
  let value = input.value;
  console.log(page);
  fetchGallery(value, page)
    .then(data => makeGallery(data))
    .catch(error => console.log(error));
});

let modal = new SimpleLightbox('.photo-link', {
  captionsData: 'alt',
});
//----------------------------------------

const fetchGallery = async (q, page) => {
  const response = await axios.get(
    `?key=39840691-deed82df9d56c5b25606cb90f&q=${q}&orientation=horizontal&safesearch=true&per_page=40&page=${page}&image_type=photo`
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
    loadMore.classList.add('is-hidden');
    throw new Error();
  } else if (!val.hits[0]) {
    Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
    loadMore.classList.add('is-hidden');
    throw new Error();
  } else {
    if (page === 1) {
      Notify.success(`Hooray! We found ${val.totalHits} images.`);
    }
    loadMore.classList.remove('is-hidden');
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
    const {
      largeImageURL,
      webformatURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = element;
    let markup = `<div class="photo-card">
    <a class = "photo-link" href ="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
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
    modal.refresh();
  });
}
