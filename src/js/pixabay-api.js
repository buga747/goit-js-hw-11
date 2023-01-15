import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '32739327-960c57fb59b81838da1bafdd1';

async function fetchPixabayAPI(query, page = 1, perPage = 40) {
  const response = await axios.get(
    `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  // console.log(response);
  return response;
}

export { fetchPixabayAPI };
