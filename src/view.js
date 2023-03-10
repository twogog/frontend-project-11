const renderForm = (elements, state, newInstance) => {
  const formInput = elements.mainForm.querySelector('input');
  const errorNode = elements.mainForm.parentNode.lastElementChild;
  switch (state.formInput.validation) {
    case 'invalid':
      formInput.classList.add('is-invalid');
      errorNode.classList.add('text-danger');
      errorNode.classList.remove('text-success');
      errorNode.textContent = state.formInput.errors.at(-1);
      break;
    case 'valid':
      formInput.classList.remove('is-invalid');
      errorNode.classList.remove('text-danger');
      errorNode.classList.add('text-success');
      errorNode.textContent = newInstance.t('mainForm.success');
      elements.mainForm.focus();
      elements.mainForm.reset();
      break;
    default:
  }
};

const renderPostsaFeeds = (elements, mainstate) => {
  const { feeds, posts } = elements;
  feeds.innerHTML = `
    <div class="card border-0">
    <div class="card-body"><h2 class="card-title h4">Фиды</h2></div>
      <ul class="list-group border-0 rounded-0">
      </ul>
    </div>
  `;

  mainstate.postsAndFeeds.feeds.forEach((element) => {
    const { feedTitleText, descriptionText } = element;
    const feedsUL = feeds.querySelector('ul');
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    h3.textContent = feedTitleText;
    p.textContent = descriptionText;
    li.append(h3, p);
    feedsUL.insertBefore(li, feedsUL.firstElementChild);
  });

  posts.innerHTML = `
    <div class="card border-0">
    <div class="card-body"><h2 class="card-title h4">Посты</h2></div>
    <ul class="list-group border-0 rounded-0"></ul>
    </div>
  `;
  const setAttributes = (el, attrs) => {
    Object.entries(attrs).forEach((element) => {
      const [key, value] = element;
      el.setAttribute(key, value);
    });
  };

  const reversePosts = mainstate.postsAndFeeds.posts.map((post) => post);
  reversePosts.reverse().forEach((array) => {
    array.forEach((element) => {
      const {
        id, postTitleText, linkText, postDescriptionText,
      } = element;
      // if (mainstate.postsAndFeeds.posts.length > 1) {
      //   const onMonitorPosts = document.querySelectorAll('a');
      //   if ([...onMonitorPosts].map((link) => link.textContent).includes(postTitleText)) {
      //     return;
      //   }
      // }
      const postsUl = posts.querySelector('ul');
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const link = document.createElement('a');
      link.classList.add('fw-bold');
      setAttributes(link, {
        href: `${linkText}`, modalText: `${postDescriptionText}`, 'data-id': `${id}`, target: '_blank', rel: 'noopener noreferrer',
      });
      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      setAttributes(button, {
        type: 'button', 'data-id': `${id}`, 'data-bs-toggle': 'modal', 'data-bs-target': '#modal',
      });
      link.textContent = postTitleText;
      button.textContent = 'Просмотр';
      li.append(link, button);
      postsUl.append(li);
    });
  });

  const { visited } = mainstate.postsAndFeeds;
  if (visited.length > 0) {
    visited.forEach((id) => {
      const a = posts.querySelector(`a[data-id='${id}']`);
      a.classList.remove('fw-bold');
      a.classList.add('fw-normal', 'link-secondary');
    });

    const targetId = visited.at(-1);
    const textForModal = posts.querySelector(`a[data-id='${targetId}']`);
    const modalTitle = textForModal.textContent;
    const modalDescription = textForModal.getAttribute('modalText');
    const modalLink = textForModal.getAttribute('href');
    const { title, description, link } = elements.modal;
    title.textContent = modalTitle;
    description.textContent = modalDescription;
    link.setAttribute('href', modalLink);
  }
};

export { renderForm, renderPostsaFeeds };
