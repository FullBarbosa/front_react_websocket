/* eslint-disable jsx-a11y/label-has-associated-control */
import { FormEvent, useContext, useState } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';
import { AuthContext } from '../../context/auth';
import { api } from '../../service/api';
import styles from './styles.module.scss';

export function SendMessageForm() {
  const { user, signOut } = useContext(AuthContext);
  const [message, setMessage] = useState<string>('');

  async function handleSendMessage(event:FormEvent) {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    await api.post('messages', { message });
    setMessage('');
  }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button
        type="submit"
        className={styles.singOutButton}
        onClick={() => signOut()}
      >
        <VscSignOut size="32" />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
        <strong className={styles.userName}>{user?.name}</strong>
        <span className={styles.userGithub}>
          <VscGithubInverted size="16" />
          {user?.login}
        </span>
      </header>

      <form className={styles.sendMessageForm} onSubmit={(event) => handleSendMessage(event)}>
        <label htmlFor="message">Message</label>
        <textarea
          value={message}
          name="message"
          id="message"
          placeholder="Qual sua expectativa para o evento?"
          onChange={(event) => setMessage(event.target.value)}
        />
        <button type="submit">Enviar Mensagem</button>
      </form>
    </div>
  );
}
