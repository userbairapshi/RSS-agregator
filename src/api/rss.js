import axios from "axios";
import domParsingData from "./parse.js";

const rssFeeds = (url) => {
    return axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
      .then(response => {
        if (response.status === 200) {
          const feedData = domParsingData(response.data.contents);
          return feedData;
        }
        throw new Error('Invalid response status');
      })
      .catch(error => {
        console.error('Error fetching RSS feed:', error.message);
        return Promise.reject(error);
      });
  };

export default rssFeeds;
