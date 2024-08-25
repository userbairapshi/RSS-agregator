import onChange from 'on-change';
import i18next from 'i18next';

export default (state) => {
    const formElement = document.querySelector('form');
    const inputElement = document.querySelector('input[name="url"]');
    const feedbackElement = document.querySelector('.feedback');
    const feedsContainer = document.querySelector('.feeds');
    const postsContainer = document.querySelector('.posts');

    const renderError = (error) => {
        if (error) {
            inputElement.classList.add('is-invalid');
            feedbackElement.textContent = error;
        } else {
            inputElement.classList.remove('is-invalid');
            feedbackElement.textContent = i18next.t('success');
        }
    };

    const renderFormValid = () => {
        if (state.form.isValid) {
            inputElement.value = '';
            inputElement.focus();
            formElement.reset();
        }
    };

    const renderFeeds = () => {
        feedsContainer.innerHTML = '';
        const feedList = document.createElement('ul');
        state.feeds.forEach((feed) => {
            const feedItem = document.createElement('li');
            const feedTitle = document.createElement('h3');
            const feedDescription = document.createElement('p');
            feedTitle.textContent = feed.title;
            feedDescription.textContent = feed.description;
            feedItem.append(feedTitle, feedDescription);
            feedList.appendChild(feedItem);
        });
        feedsContainer.appendChild(feedList);
    };

    const renderPosts = () => {
        postsContainer.innerHTML = '';
        const postList = document.createElement('ul');
        state.posts.forEach((post) => {
            const postItem = document.createElement('li');
            const postLink = document.createElement('a');
            postLink.setAttribute('href', post.link);
            postLink.setAttribute('target', '_blank');
            postLink.textContent = post.title;
            postItem.appendChild(postLink);
            postList.appendChild(postItem);
        });
        postsContainer.appendChild(postList);
    };

    return onChange(state, (path, value) => {
        if (path === 'form.error') {
            renderError(value);
        }
        if (path === 'form.isValid') {
            renderFormValid();
        }
        if (path === 'feeds') {
            renderFeeds();
        }
        if (path === 'posts') {
            renderPosts();
        }
    });
};
