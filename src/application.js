import i18next from 'i18next';
import _ from 'lodash';
import schema from './validators.js';
import initView from './view.js';
import rssFeeds from './api/rss.js';
import checkUpdates from './api/timeRss.js';
import ru from './locales/ru.js';

const app = () => {
  i18next.init({
    lng: 'ru',
    resources: {
      ru: {
        translation: ru,
      },
    },
  }).then(() => {
    const state = {
      form: {
        isValid: false,
        error: null,
      },
      feeds: [],
      posts: [],
    };

    const watchedState = initView(state);

    const formElement = document.querySelector('form');

    formElement.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const url = formData.get('url').trim();

      const rssSchema = schema(state.feeds.map((feed) => feed.url));

      rssSchema.validate(url, { abortEarly: false })
        .then((validatedUrl) => rssFeeds(validatedUrl))
        .then(({ title, description, posts }) => {
          const newFeed = { title, description, url };

          const postsWithIds = posts.map((post) => ({
            ...post,
            id: _.uniqueId(),
            isRead: false,
          }));

          watchedState.feeds = [...state.feeds, newFeed];
          watchedState.posts = [...state.posts, ...postsWithIds];
          watchedState.form.isValid = true;
          watchedState.form.error = null;
        })
        .catch((error) => {
          console.error('Error processing RSS:', error);
          if (error.message === 'invalidRss') {
            watchedState.form.error = i18next.t('invalidRss');
          } else if (error.message === 'networkError') {
            watchedState.form.error = i18next.t('networkError');
          } else {
            watchedState.form.error = i18next.t('validation.url');
          }
          watchedState.form.isValid = false;
        });
    });

    const postsContainer = document.querySelector('.posts');
    postsContainer.addEventListener('click', (e) => {
      const { target } = e;
      const postId = target.getAttribute('data-id') || target.previousElementSibling?.getAttribute('data-id');

      if (postId) {
        const post = state.posts.find((p) => p.id === postId);
        if (post && !post.isRead) {
          watchedState.posts = state.posts.map((p) => {
            if (p.id === postId) {
              return { ...p, isRead: true };
            }
            return p;
          });
        }
      }
    });

    checkUpdates(state, watchedState);
  }).catch((err) => {
    console.error('Ошибка инициализации i18next:', err);
  });
};

export default app;
