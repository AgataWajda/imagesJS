import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchGallery } from './api';

const form = document.querySelector('.search-form');
const welcomeForm = document.querySelector('.welcome-form');
const welcomePage = document.querySelector('.welcome-page');
const input = document.querySelector('input');
const welcomeInput = document.querySelector('.welcome-input');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let page = 1;
let lastQuerry;

form.addEventListener('submit', event => {
  event.preventDefault();
  let value = input.value;
  if (!(lastQuerry === value)) {
    page = 1;
    gallery.innerHTML = '';
    createPage(value, page);
  }
  lastQuerry = input.value;
});

welcomeForm.addEventListener('submit', event => {
  event.preventDefault();
  let value = welcomeInput.value;
  if (!(lastQuerry === value)) {
    page = 1;
    gallery.innerHTML = '';
    createPage(value, page);
  }
  lastQuerry = welcomeInput.value;
  form.classList.remove('is-hidden');
  welcomePage.classList.add('is-hidden');
});

loadMore.addEventListener('click', () => {
  page++;
  let value = input.value;

  createPage(value, page);
});

let modal = new SimpleLightbox('.photo-link', {
  captionsData: 'alt',
});
//----------------------------------------

async function createPage(value, page) {
  try {
    const allData = await fetchGallery(value, page);
    const validateData = await validateArray(allData);
    const hits = await filterData(validateData);
    await makeGallery(hits);
  } catch (error) {
    console.log(error);
  }
}

function validateArray(val) {
  if (!(val.total > 0)) {
    Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    loadMore.classList.add('is-hidden');
    throw new Error();
  } else {
    if (page === 1) {
      Notify.success(`Hooray! We found ${val.totalHits} images.`);
    }
    loadMore.classList.remove('is-hidden');
    if (val.hits.length < 40) {
      Notify.warning(
        `We're sorry, but you've reached the end of search results.`
      );
      loadMore.classList.add('is-hidden');
    }
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
      largeImage,
      webformatURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = element;

    let markup = `<div class="photo-card">
    <a class = "photo-link" href ="${largeImage}">
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
