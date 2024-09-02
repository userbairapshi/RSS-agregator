import * as yup from 'yup';

yup.setLocale({
    mixed: {
      required: () => ({ key: 'validation.required' }),
      notOneOf: () => ({ key: 'validation.notOneOf' }),
    },
    string: {
      url: () => ({ key: 'validation.url' }),
    },
});

const schema = (urls) => yup.string()
    .url()
    .notOneOf(urls)
    .required();

export default schema;
