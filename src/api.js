import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export const fetchGallery = async (q, page) => {
  const response = await axios.get(
    `?key=39840691-deed82df9d56c5b25606cb90f&q=${q}&orientation=horizontal&safesearch=true&per_page=40&page=${page}&image_type=photo`
  );
  return await response.data;
};
