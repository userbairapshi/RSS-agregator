import * as yup from 'yup';

const schema = (urls) => yup.string()
    .url('Ссылка должна быть валидным URL')
    .notOneOf(urls, 'Ссылка уже добавлена')
    .required('Поле обязательно для заполнения');

export default schema;