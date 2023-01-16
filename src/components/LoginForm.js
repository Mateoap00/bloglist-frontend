import { useState } from 'react'
import Message from './Message'

const LoginForm = ({ newLogin }) => {
    const [message, setMessage] = useState({});
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            await newLogin(username, password);
            setUsername('');
            setPassword('');
        } catch (exception) {
            setMessage({
                text: `Wrong username or password.`,
                class: 'failure'
            });
            setTimeout(() => {
                setMessage({})
            }, 5000);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h3>Login with your username and password</h3>

            <Message message={message} />

            <div>
                Username:
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                Password:
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginForm;