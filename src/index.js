import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

fetch(
  'https://pixabay.com/api/?key=32739327-960c57fb59b81838da1bafdd1&q=cat&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=1'
)
  .then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch('error');

var lightbox = new SimpleLightbox('.gallery a', {
  /* options */
});
