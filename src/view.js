/* global bootstrap */

import onChange from 'on-change';
import i18next from 'i18next';

export default (state) => {
  const formElement = document.querySelector('form');
  const inputElement = document.querySelector('input[name="url"]');
  const feedbackElement = document.querySelector('.feedback');
  const feedsContainer = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');
  const modalElement = document.getElementById('modal');
  const modalTitle = modalElement.querySelector('.modal-title');
  const modalBody = modalElement.querySelector('.modal-body');
  const fullArticleLink = modalElement.querySelector('.full-article');

  const showModal = (post) => {
    modalTitle.textContent = post.title;
    modalBody.textContent = post.description;
    fullArticleLink.href = post.link;

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  };

  const renderError = (error) => {
    if (error) {
      inputElement.classList.add('is-invalid');
      feedbackElement.textContent = error;
      feedbackElement.classList.remove('text-success');
      feedbackElement.classList.add('text-danger');
    } else {
      inputElement.classList.remove('is-invalid');
      feedbackElement.textContent = i18next.t('success');
      feedbackElement.classList.remove('text-danger');
      feedbackElement.classList.add('text-success');
    }
  };

  const renderFormValid = () => {
    if (state.form.isValid) {
      inputElement.value = '';
      feedbackElement.textContent = i18next.t('success');
      feedbackElement.classList.remove('text-danger');
      feedbackElement.classList.add('text-success');
      inputElement.focus();
      formElement.reset();
    } else {
      inputElement.classList.add('is-invalid');
      feedbackElement.classList.remove('text-success');
      feedbackElement.classList.add('text-danger');
    }
  };

  const renderFeeds = () => {
    feedsContainer.innerHTML = '';
    const feedDivTitle = document.createElement('div');
    const feedDivTitleH2 = document.createElement('h2');
    const feedList = document.createElement('ul');

    feedDivTitle.classList.add('card-body', 'card', 'border-0');
    feedDivTitleH2.classList.add('card-title', 'h4');

    feedDivTitleH2.textContent = 'Фиды';
    feedDivTitle.appendChild(feedDivTitleH2);
    state.feeds.forEach((feed) => {
      const feedItem = document.createElement('li');
      const feedTitle = document.createElement('h3');
      const feedDescription = document.createElement('p');

      feedTitle.classList.add('h6', 'm-0', 'fw-bold');

      feedTitle.textContent = feed.title;
      feedDescription.textContent = feed.description;
      feedItem.append(feedTitle, feedDescription);
      feedList.appendChild(feedItem);
    });
    feedsContainer.appendChild(feedDivTitle);
    feedsContainer.appendChild(feedList);
  };

  const renderPosts = () => {
    postsContainer.innerHTML = '';
    const postDivTitle = document.createElement('div');
    const postTitle = document.createElement('h2');
    const postList = document.createElement('ul');
    postDivTitle.appendChild(postTitle);
    postsContainer.appendChild(postDivTitle);

    postDivTitle.classList.add('card-body', 'fw-bold');
    postTitle.classList.add('card-title', 'h4');

    postTitle.textContent = 'Посты';
    state.posts.forEach((post) => {
      const postItem = document.createElement('li');
      const postLink = document.createElement('a');
      const postButton = document.createElement('button');

      postItem.classList.add('item-list');

      const postLinkClass = post.isRead ? ['fw-normal', 'text-muted'] : ['fw-bold'];
      postLink.classList.add(...postLinkClass);

      postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');

      postLink.setAttribute('href', post.link);
      postLink.setAttribute('target', '_blank');
      postLink.setAttribute('data-id', post.id);
      postLink.textContent = post.title;
      postButton.textContent = 'Просмотр';

      postLink.addEventListener('click', (e) => {
        e.preventDefault();
        const updatedPost = { ...post, isRead: true };
        renderPosts();
        const link = document.createElement('a');
        link.href = updatedPost.link;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });

      postButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const updatedPost = { ...post, isRead: true };
        showModal(updatedPost);
        renderPosts();
      });

      postItem.append(postLink, postButton);
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
