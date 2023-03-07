import { useState } from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({ newLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        await newLogin(username, password);
        setUsername('');
        setPassword('');
    };

    return (
        <form onSubmit={handleLogin}>
            <h3>Login with your username and password</h3>

            <div>
                Username:
                <input
                    type="text"
                    id='username'
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                Password:
                <input
                    type="password"
                    id='password'
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button
                type="submit"
                id='loginBtn'
            >
                Login
            </button>
        </form>
    );
};

LoginForm.propTypes = {
    newLogin: PropTypes.func.isRequired
};

export default LoginForm;