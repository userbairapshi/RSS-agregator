import schema from './validators.js';
import initView from './view.js';
import i18next from 'i18next';
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
      };
  
      const watchedState = initView(state);
  
      const element = document.querySelector('form');
      element.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url').trim();
  
        const rssSchema = schema(state.feeds.map(feed => feed.url));
  
        rssSchema.validate(url, { abortEarly: false })
          .then((validatedUrl) => {
            state.feeds.push({ url: validatedUrl });
            watchedState.form.isValid = true;
            watchedState.form.error = null;
          })
          .catch((error) => {
            const translatedErrors = error.errors.map((err) => i18next.t(err.key));
            watchedState.form.isValid = false;
            watchedState.form.error = translatedErrors[0];
          });
      });
    }).catch((err) => {
      console.error('Ошибка инициализации i18next:', err);
    });
  };
  
  export default app;
