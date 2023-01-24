export default (url) => {
  const parse = new DOMParser();
  const response = fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`);
  return response.then((result) => {
    if (result.ok) { return result.json(); }
    throw new Error('Ошибка сети.');
  })
    .then((data) => parse.parseFromString(`${data.contents}`, 'application/xml'));
};
