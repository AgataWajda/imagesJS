import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export const fetchGallery = async (q, page) => {
  try {
    const response = await axios.get(
      `?key=39840691-deed82df9d56c5b25606cb90f&q=${q}&orientation=horizontal&safesearch=true&per_page=40&page=${page}&image_type=photo`
    );
    return await response.data;
  } catch (error) {
    Notify.failure(`${error}`);
    loadMore.classList.add('is-hidden');
  }
};
