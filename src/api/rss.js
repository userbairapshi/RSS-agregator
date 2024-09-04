import axios from 'axios';
import domParsingData from './parse.js';

const rssFeeds = (url) => {
  return axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`)
    .then(response => {
      if (response.status === 200) {
        try {
          const feedData = domParsingData(response.data.contents);
          if (!feedData || !feedData.posts) {
            throw new Error('Ресурс не содержит валидный RSS');
          }
          return feedData;
        } catch (e) {
          throw new Error('Ресурс не содержит валидный RSS');
        }
      }
      throw new Error('Ресурс не содержит валидный RSS');
    })
    .catch(error => {
      if (error.response) {
        console.error('Ошибка при загрузке RSS-ленты:', error.message);
      }
      throw new Error('Ресурс не содержит валидный RSS');
    });
};

export default rssFeeds;
