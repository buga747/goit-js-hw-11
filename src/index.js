import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPixabayAPI } from './js/pixabay-api.js';
import { renderGallery } from './js/render-gallery';
import { scrollByTwoCards } from './js/scroll';
import { onScroll, onToTopBtn } from './js/toTopBtn';
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let simpleLightBox;

let query = '';
let page = 1;
let perPage = 40;

onScroll();
onToTopBtn();

form.addEventListener('submit', onSearch);

loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();

  gallery.innerHTML = '';
  loadMoreBtn.hidden = true;
  page = 1;
  query = evt.currentTarget.searchQuery.value.trim();
  // console.log(query);

  if (query === '') {
    insertInfo();
    return;
  }

  fetchPixabayAPI(query, page, perPage)
    .then(({ data }) => {
      if (data.hits.length === 0) {
        onNoResult();
      } else {
        renderGallery(data.hits);

        onSimplelightboxAdd();
        onImagesFound(data);

        if (data.totalHits > perPage) {
          loadMoreBtn.hidden = false;
        }
      }
    })
    .catch(error => console.log(error))
    .finally(form.reset());
}

function onLoadMore() {
  page += 1;
  simpleLightBox.destroy();

  fetchPixabayAPI(query, page, perPage)
    .then(({ data }) => {
      renderGallery(data.hits);
      onSimplelightboxAdd();
      scrollByTwoCards();
      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page === totalPages) {
        loadMoreBtn.hidden = true;
        onCollectionEnd();
      }
    })
    .catch(error => console.log(error));
}

function insertInfo() {
  Notify.warning('You need to insert information to find');
}

function onNoResult() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function onImagesFound(data) {
  Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function onCollectionEnd() {
  Notify.warning("We're sorry, but you've reached the end of search results.");
}

function onSimplelightboxAdd() {
  simpleLightBox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionSelector: 'img',
    captionPosition: 'bottom',
    captionType: 'attr',
    captionsData: 'alt',
    captionDelay: 250,
  }).refresh();
}
