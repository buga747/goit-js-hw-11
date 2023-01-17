import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPixabayAPI } from './js/pixabay-api.js';
import { renderGallery } from './js/render-gallery';
// import { scrollByTwoCards } from './js/scroll';
import { onScroll, onToTopBtn } from './js/toTopBtn';
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');
// const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let perPage = 40;

// onScroll();
onToTopBtn();

form.addEventListener('submit', onSearch);

// loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();

  gallery.innerHTML = '';
  // loadMoreBtn.hidden = true;
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
      }

      renderGallery(data.hits);

      onImagesFound(data);
      galleryImg.refresh();
      observer.observe(guard);
    })
    .catch(error => console.log(error))
    .finally(form.reset());
}

const options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(onLoadMore, options);

function onLoadMore(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      fetchPixabayAPI(query, page, perPage).then(({ data }) => {
        renderGallery(data.hits);
        galleryImg.refresh();

        if (Number(page * perPage) >= data.totalHits) {
          observer.unobserve(guard);
          onCollectionEnd();
        }
      });
    }
  });
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

let galleryImg = new SimpleLightbox('.gallery a', {
  captions: true,
  captionSelector: 'img',
  captionPosition: 'bottom',
  captionType: 'attr',
  captionsData: 'alt',
  captionDelay: 250,
});
galleryImg.refresh();
