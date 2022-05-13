import { memo, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import InfoTooltip from './InfoTooltip';
import * as auth from '../utils/auth';
import { AppContext } from '../contexts/AppContext';

function Register(props) {
  const { onLogin } = props;
  const { history, showError } = useContext(AppContext)

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTooltipOpen, setTooltipOpen] = useState(false);
  const [isRegistered, setRegistered] = useState(false);

  // Закрытие модального окна уведомления о статусе регистрации
  function closePopup() {
    setTooltipOpen(false);
  }

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
    auth.register(email, password) // регистрируем пользователя
      .then(res => {
        if (res.statusCode !== '400') {
          setRegistered(true);
          setTooltipOpen(true);
          auth.authorize(email, password) // авторизуем пользователя после успешной регистрации
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
      })
      .catch(() => {
        setRegistered(false);
        setTooltipOpen(true);
      });
  }


  return (
    <div className="content">
      <InfoTooltip isOpen={isTooltipOpen} onClose={closePopup} isRegistered={isRegistered} />
      <div className="authorization">
        <form className="popup__inputs popup__inputs_place_authorization" noValidate onSubmit={handleSubmit}>
          <h2 className="popup__heading popup__heading_place_authorization">Регистрация</h2>
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
          <button className="popup__submit-btn popup__submit-btn_place_authorization" type="submit">Зарегистрироваться</button>
        </form>
        {<Link to="/sign-in" className="authorization__link">Уже зарегистрированы? Войти</Link>}
      </div>
    </div>
  );
}

export default memo(Register);