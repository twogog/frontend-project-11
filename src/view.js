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
export default renderForm;
