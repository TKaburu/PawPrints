import { useState } from 'react';
import Cookies from 'js-cookie';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN} from '../../constants';
import './form.css';


const Form = ({route, method}) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [usertype, setUserType] = useState("");
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
                payload.first_name = firstName;
                payload.last_name = lastName;
                payload.confirm_password = confirmPassword;
                payload.user_type = usertype;
            }

            const csrfToken = Cookies.get('csrftoken');

            // const response = await api.post(route, {email, username, password});
            const response = await api.post(route, payload, {
                headers: {
                    'Content-Type': 'application/json',
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
        <div className='main-content'>
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
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <div>
                            <input
                                className="form-input"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                                <select
                                    className="form-input"
                                    value={usertype}
                                    onChange={(e) => setUserType(e.target.value)}
                                    placeholder="User Type"
                                >
                                    <option value="">Select User Type</option>
                                    <option value="pet_owner">Pet Owner</option>
                                    <option value="vet">Vet</option>
                                </select>
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
                <div className="form-footer">
                    {method === "login" ? (
                        <p>Don't have an account? <a href="/register">Register </a></p>
                    ) : (
                        <p>Already have an account? <a href="/login">Login </a></p>
                    )}
                </div>    
            </form>
            </section>
        </div>
    );
};

export default Form;
