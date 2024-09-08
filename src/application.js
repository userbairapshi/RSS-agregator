import i18next from 'i18next';
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
        .then((feedData) => {
          const { title, description, posts } = feedData;
          const newFeed = { title, description, url };

          let postIdCounter = state.posts.length;
          const newPosts = posts.map((post) => {
            const id = {
              ...post,
              id: (postIdCounter += 1).toString(),
              isRead: false,
            };
            return id;
          });

          watchedState.feeds = [...state.feeds, newFeed];
          watchedState.posts = [...state.posts, ...newPosts];
          watchedState.form.isValid = true;
          watchedState.form.error = null;
        })
        .catch((error) => {
          console.error('Error processing RSS:', error);

          if (error.message === 'Ресурс не содержит валидный RSS') {
            watchedState.form.error = i18next.t('invalidRss');
          } else if (error.message === 'Ошибка сети') {
            watchedState.form.error = i18next.t('networkError');
          } else if (error.errors) {
            const translatedErrors = error.errors.map((err) => i18next.t(err.key));
            watchedState.form.error = translatedErrors[0];
          } else {
            watchedState.form.error = i18next.t('validation.url');
          }

          watchedState.form.isValid = false;
        });
    });

    const postsContainer = document.querySelector('.posts');
    postsContainer.addEventListener('click', (e) => {
      const target = e.target;

      if (target.tagName === 'A') {
        const postId = target.getAttribute('data-id');
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
      }

      if (target.tagName === 'BUTTON') {
        const postId = target.previousElementSibling.getAttribute('data-id');
        if (postId) {
          const post = state.posts.find((p) => p.id === postId);
          if (post) {
            watchedState.posts = state.posts.map((p) => {
              if (p.id === postId) {
                return { ...p, isRead: true };
              }
              return p;
            });
          }
        }
      }
    });

    checkUpdates(state, watchedState);
  }).catch((err) => {
    console.error('Ошибка инициализации i18next:', err);
  });
};

export default app;
