import onChange from 'on-change';
import * as yup from 'yup';

const renderForm = (elements, state, messageValue) => {
  const formInput = elements.mainForm.querySelector('input');
  const errorNode = elements.mainForm.parentNode.lastElementChild;
  switch (state.formInput.validation) {
    case 'invalid':
      formInput.classList.add('is-invalid');
      errorNode.classList.add('text-danger');
      errorNode.classList.remove('text-success');
      errorNode.textContent = messageValue;
      break;
    case 'valid':
      formInput.classList.remove('is-invalid');
      errorNode.classList.remove('text-danger');
      errorNode.classList.add('text-success');
      errorNode.textContent = 'RSS успешно загружен';
      elements.mainForm.focus();
      elements.mainForm.reset();
      break;
    default:
  }
};

export default () => {
  const mainstate = {
    formInput: {
      validation: 'valid',
      addedLinks: [],
      errors: [],
    },
  };

  const elements = {
    mainForm: document.querySelector('.rss-form'),
  };

  const state = onChange(mainstate, (path, value) => {
    if (path === 'formInput.errors' || path === 'formInput.validation') {
      renderForm(elements, mainstate, value.at(-1));
    }
  });

  elements.mainForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const form = new FormData(ev.target);
    const inputValue = form.get('url');

    const schema = yup.string().url('Ссылка должна быть валидным URL').notOneOf(mainstate.formInput.addedLinks, 'RSS уже существует');
    schema.validate(inputValue)
      .then((result) => {
        state.formInput.validation = 'valid';
        state.formInput.addedLinks.push(result);
      })
      .catch((e) => {
        state.formInput.validation = 'invalid';
        state.formInput.errors.push(e.errors[0]);
      });
  });
};
