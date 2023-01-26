export default (url) => {
  const parse = new DOMParser();
  return fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
    .then((response) => {
      if (response.ok) { return response.json(); }
      throw new Error('Ошибка сети.');
    })
    .then((data) => parse.parseFromString(`${data.contents}`, 'application/xml'));
};
