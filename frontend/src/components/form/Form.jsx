import { useState } from 'react';
import Cookies from 'js-cookie';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN} from '../../constants';
import './form.css';


const Form = ({route, method}) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [Loading, setLoading] = useState(false);

    const title = method === 'login' ? 'Login' : 'Register';

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const payload = { username, password };
            if (method === "register") {
                payload.email = email;
                payload.confirm_password = confirmPassword;
            }

            const csrfToken = Cookies.get('csrftoken');

            // const response = await api.post(route, {email, username, password});
            const response = await api.post(route, payload, {
                headers: {
                    'X-CSRFToken': csrfToken,
                },
            });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            };
        } catch (error) {
            alert(error);
        };
        setLoading(false);
    };

    return (
        <section className="form-container">
            <form onSubmit={handleSubmit}>
            <div className="title">
                <h1>{title}</h1>
            </div>
            {method === "register" && (
                <>
                    <div>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </>
            )}
            <div>
                <input
                    className="form-input"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                /> 
            </div>
            <div>
                <input
                    className="form-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {method === "register" && (
                <>
                    <div>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </>
            )}
            <button type="submit" disabled={Loading}>
                {Loading ? "Loading..." : title}
            </button>       
        </form>
        </section>
    );
};

export default Form;
