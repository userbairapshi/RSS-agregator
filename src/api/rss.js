import axios from 'axios';
import domParsingData from './parse.js';

const rssFeeds = (url) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`)
  .then((response) => {
    if (response.status === 200) {
      const feedData = domParsingData(response.data.contents);
      if (!feedData || !feedData.posts) {
        throw new Error('invalidRss');
      }
      return feedData;
    }
    throw new Error('invalidRss');
  })
  .catch((error) => {
    if (error.isAxiosError) {
      throw new Error('networkError');
    }
    throw error;
  });

export default rssFeeds;
