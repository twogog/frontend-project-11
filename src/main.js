import i18n from 'i18next';
import _ from 'lodash';
import onChange from 'on-change';
import * as yup from 'yup';
import { renderForm, renderPostsaFeeds } from './view.js';
import resources from './locales/index.js';
import parser from './parser.js';

export default () => {
  const mainstate = {
    formInput: {
      validation: 'valid',
      onSubmit: 1,
      addedLinks: [],
      errors: [],
    },
    postsAndFeeds: {
      feeds: [],
      posts: [],
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
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const state = onChange(mainstate, (path) => {
    if (path === 'formInput.onSubmit') {
      renderForm(elements, mainstate, newInstance);
    }
    if (path === 'postsAndFeeds.posts') {
      renderPostsaFeeds(elements, mainstate, newInstance);
    }
  });

  elements.mainForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const form = new FormData(ev.target);
    const inputValue = form.get('url');

    const schema = yup.string().url(newInstance.t('mainForm.errors.wrongLink')).notOneOf(mainstate.formInput.addedLinks, newInstance.t('mainForm.errors.sameLink'));
    schema.validate(inputValue)
      .then((result) => {
        state.formInput.addedLinks.push(result);
        parser(mainstate.formInput.addedLinks.at(-1))
          .then((parsedDoc) => {
            const errorNode = parsedDoc.querySelector('parsererror');
            if (errorNode) {
              throw new Error('parsererror');
            } else {
              const channel = parsedDoc.querySelector('channel');
              const { children } = channel;
              const [feedTitle, description] = children;
              const feedTitleText = feedTitle.textContent;
              const descriptionText = description.textContent;
              state.postsAndFeeds.feeds.push({ id: _.uniqueId(), feedTitleText, descriptionText });
              const posts = [...children].map((element) => {
                if (element.nodeName === 'item') {
                  const { children: [postTitle,, link, postDescription] } = element;
                  const postTitleText = postTitle.textContent;
                  const linkText = link.textContent;
                  const postDescriptionText = postDescription.textContent;
                  return {
                    id: _.uniqueId(), postTitleText, postDescriptionText, linkText,
                  };
                }
                return '';
              }).filter((element) => element !== '');
              state.formInput.validation = 'valid';
              state.formInput.onSubmit = Math.random();
              state.postsAndFeeds.posts.push(posts);
            }
          })
          .catch((e) => {
            state.formInput.validation = 'invalid';
            state.formInput.addedLinks.pop();
            const error = (e.message === 'Ошибка сети.') ? e.message : newInstance.t('mainForm.errors.wrongFormat');
            state.formInput.errors.push(error);
            state.formInput.onSubmit = Math.random();
          });
      })
      .catch((e) => {
        state.formInput.validation = 'invalid';
        state.formInput.errors.push(e.errors[0]);
        state.formInput.onSubmit = Math.random();
      });
  });
};
