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
    const element = document.querySelector('form');

    element.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url').trim();
      const rssSchema = schema(state.feeds.map((feed) => feed.url));
      
      rssSchema.validate(url, { abortEarly: false })
        .then((validatedUrl) => rssFeeds(validatedUrl))
        .then((feedData) => {
          const { title, description, posts } = feedData;
          const newFeed = { title, description, url };
          watchedState.feeds.push(newFeed);
          watchedState.posts.push(...posts.map(post => ({ ...post, isRead: false })));
          watchedState.form.isValid = true;
          watchedState.form.error = null;
        })
        .catch((error) => {
          console.error('Error processing RSS:', error);
          
          if (error.message === 'Ошибка сети') {
            watchedState.form.error = i18next.t('networkError');
          } else if (error.message === 'Ресурс не содержит валидный RSS') {
            watchedState.form.error = i18next.t('invalidRss');
          } else if (error.errors) {
            const translatedErrors = error.errors.map((err) => i18next.t(err.key));
            watchedState.form.error = translatedErrors[0];
          } else {
            watchedState.form.error = i18next.t('validation.url');
          }

          watchedState.form.isValid = false;
        });
    });

    document.addEventListener('click', (event) => {
      if (event.target.matches('.posts a')) {
        const postId = event.target.getAttribute('data-id');
        const post = state.posts.find(p => p.id === postId);
        if (post && !post.isRead) {
          post.isRead = true;
          watchedState.posts = [...state.posts];
        }
      }
    });

    checkUpdates(state, watchedState);
  }).catch((err) => {
    console.error('Ошибка инициализации i18next:', err);
  });
};

export default app;
