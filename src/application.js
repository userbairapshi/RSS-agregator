import schema from './validators.js';
import initView from './view.js'

const app = () => {
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
                watchedState.form.isValid = false;
                watchedState.form.error = error.message;
            });
    });
};

export default app;
