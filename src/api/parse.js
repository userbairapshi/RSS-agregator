const domParsingData = (data) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, 'text/xml');

  const parseError = xml.querySelector('parsererror');
  if (parseError) {
    throw new Error('invalidRss');
  }

  const title = xml.querySelector('channel > title')?.textContent || 'No title';
  const description = xml.querySelector('channel > description')?.textContent || 'No description';

  const posts = Array.from(xml.querySelectorAll('item')).map((item) => ({
    title: item.querySelector('title')?.textContent || 'No title',
    link: item.querySelector('link')?.textContent || '#',
    description: item.querySelector('description')?.textContent || 'No description',
  }));

  return { title, description, posts };
};

export default domParsingData;
