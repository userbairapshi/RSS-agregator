import axios from 'axios';
import domParsingData from './parse.js';

const rssFeeds = (url) => {
  return axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`)
    .then(response => {
      if (response.status === 200) {
        const feedData = domParsingData(response.data.contents);
        if (!feedData || !feedData.posts) {
          throw new Error('Ресурс не содержит валидный RSS');
        }
        return feedData;
      }
      throw new Error('Ресурс не содержит валидный RSS');
    })
    .catch(error => {
      if (error.request) {
        console.error('Ошибка сети: не удалось загрузить ресурс');
        throw new Error('Ошибка сети');
      } else {
        console.error('Ошибка:', error.message);
      }
      throw new Error('Ресурс не содержит валидный RSS');
    });
};

export default rssFeeds;
