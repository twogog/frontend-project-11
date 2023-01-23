import i18n from 'i18next';
import onChange from 'on-change';
import * as yup from 'yup';
import renderForm from './view.js';
import resources from './locales/index.js';

export default () => {
  const mainstate = {
    formInput: {
      validation: 'valid',
      onSubmit: 1,
      addedLinks: [],
      errors: [],
    },
  };

  const newInstance = i18n.createInstance();
  newInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  });

  const elements = {
    mainForm: document.querySelector('.rss-form'),
  };

  const state = onChange(mainstate, (path) => {
    if (path === 'formInput.onSubmit') {
      renderForm(elements, mainstate, newInstance);
    }
  });

  elements.mainForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const form = new FormData(ev.target);
    const inputValue = form.get('url');

    const schema = yup.string().url(newInstance.t('mainForm.errors.wrongFormat')).notOneOf(mainstate.formInput.addedLinks, newInstance.t('mainForm.errors.sameLink'));
    schema.validate(inputValue)
      .then((result) => {
        state.formInput.validation = 'valid';
        state.formInput.addedLinks.push(result);
        state.formInput.onSubmit = Math.random();
      })
      .catch((e) => {
        state.formInput.validation = 'invalid';
        state.formInput.errors.push(e.errors[0]);
        state.formInput.onSubmit = Math.random();
      });
  });
};
