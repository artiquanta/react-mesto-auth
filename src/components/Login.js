import { memo, useContext, useState } from 'react';
import * as auth from '../utils/auth';
import { AppContext } from '../contexts/AppContext';

function Login(props) {
  const { onLogin } = props;
  const { history, showError } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Обработчик полей ввода
  function handleChange(evt) {
    const { name, value } = evt.target;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    };
  }

  // Обработчик отправки формы
  function handleSubmit(evt) {
    evt.preventDefault();
    if (!email || !password) {
      return;
    }
    auth.authorize(email, password)
      .then(res => {
        if (res.token) {
          setEmail('');
          setPassword('');
          onLogin(email);
          history.push('/');
        }
      })
      .catch(err => showError(err));
  }

  return (
    <div className="content">
      <div className="authorization">
        <form className="popup__inputs popup__inputs_place_authorization" noValidate onSubmit={handleSubmit}>
          <h2 className="popup__heading popup__heading_place_authorization">Вход</h2>
          <label className="popup__field popup__field_place_authorization">
            <input type="email" placeholder="Email" name="email" className="popup__input popup__input_place_authorization"
              id="author-input" minLength="2" maxLength="40" required value={email} onChange={handleChange} />
            <span className="popup__input-error"></span>
          </label>
          <label className="popup__field popup__field_place_authorization">
            <input type="password" placeholder="Пароль" name="password" className="popup__input popup__input_place_authorization"
              id="activity-input" minLength="2" maxLength="200" required value={password} onChange={handleChange} />
            <span className="popup__input-error"></span>
          </label>
          <button className="popup__submit-btn popup__submit-btn_place_authorization" type="submit">Войти</button>
        </form>
      </div>
    </div>
  );
}

export default memo(Login);