export default (url, signal) => {
  const parse = new DOMParser();
  return fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`, { signal })
    .then((result) => {
      if (result.ok) { return result.json(); }
      throw new Error('Ошибка сети');
    })
    .then((data) => parse.parseFromString(`${data.contents}`, 'application/xml'));
};
