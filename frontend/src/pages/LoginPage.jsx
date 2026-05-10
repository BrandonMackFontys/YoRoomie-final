import { useState } from "react";
import { loginUser } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const result = await loginUser(form);

        if (result.token && result.user) {
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
            navigate("/dashboard");
        } else {
            setMessage(result.message || "Login failed");
        }
    }

    return (
        <div className="auth-shell">
            <div className="auth-phone">
                <div className="auth-top">
                    <div className="auth-top-shape" />
                    <div className="auth-top-content">
                        <div className="auth-logo">
                            <img src="../src/assets/logo-wit.png" width="300"></img>
                        </div>
                    </div>
                </div>

                <div className="auth-panel">
                    <form onSubmit={handleSubmit} className="form auth-form">
                        <label className="field-group">
                            <span>E-mailadres</span>
                            <input
                                type="email"
                                name="email"
                                placeholder="naam@email.com"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="field-group">
                            <span>Wachtwoord</span>
                            <input
                                type="password"
                                name="password"
                                placeholder="•••••••••"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </label>

                        <button type="submit" className="primary-button">
                            Inloggen
                        </button>
                    </form>

                    {message && <p className="message-card">{message}</p>}

                    <div className="auth-footer">
                        <p>Nog geen account?</p>
                        <Link to="/register" className="text-link">
                            Registreren
                        </Link>
                    </div>

                    <div className="other">
                        <span className="other-method">of gebruik een andere methode</span>
                    </div>

                    <div className="social-login">
                        <button type="button" className="social-button">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.8 3.59-.76 1.58.05 2.76.68 3.5 1.76-2.95 1.63-2.45 5.56.55 6.78-.69 1.72-1.57 3.32-2.72 4.39zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                            </svg>
                            Ga verder met Apple
                        </button>
                        <button type="button" className="social-button">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Ga verder met Google
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default LoginPage;