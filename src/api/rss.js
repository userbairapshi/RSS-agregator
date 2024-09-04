import axios from "axios";
import domParsingData from "./parse.js";

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
      throw new Error('Неверный статус ответа');
    })
    .catch(error => {
      console.error('Ошибка при загрузке RSS-ленты:', error.message);
      return Promise.reject(new Error('Ресурс не содержит валидный RSS'));
    });
};

export default rssFeeds;
