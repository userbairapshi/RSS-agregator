import rssFeeds from './rss.js';

const checkUpdates = (state, watchedState) => {
  const feedUrls = state.feeds.map((feed) => feed.url);

  const fetchUpdates = (url) => {
    return rssFeeds(url)
      .then((feedData) => {
        const { posts } = feedData;
        const existingPostsLinks = state.posts.map((post) => post.link);
        const newPosts = posts.filter((post) => !existingPostsLinks.includes(post.link));

        if (newPosts.length > 0) {
          watchedState.posts.push(...newPosts);
        }
      })
      .catch((error) => {
        console.error(`Ошибка загрузки RSS ленты с URL ${url}:`, error.message);
      });
  };

  Promise.all(feedUrls.map(fetchUpdates))
    .then(() => {
      console.log('Обновление завершено.');
    })
    .catch((error) => {
      console.error('Ошибка обновления всех постов:', error.message);
    })
    .finally(() => {
      console.log('Запуск следующего цикла обновления через 5 секунд.');
      setTimeout(() => checkUpdates(state, watchedState), 5000);
    });
};


export default checkUpdates;
