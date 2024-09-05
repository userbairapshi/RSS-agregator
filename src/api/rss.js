import axios from 'axios';
import domParsingData from './parse.js';

const rssFeeds = (url) => {
  return axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`, {
    timeout: 10000,
  })
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
    .catch((error) => {
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
        throw new Error('Ошибка сети');
      } else if (error.response && (error.response.status === 404 || error.response.status === 500)) {
        throw new Error('Ошибка сети');
      } else {
        throw new Error('Ресурс не содержит валидный RSS');
      }
    });
};

export default rssFeeds;
