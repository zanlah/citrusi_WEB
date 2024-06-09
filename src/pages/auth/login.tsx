import { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    async function handleLogin(e: any) {
        e.preventDefault();

        try {
            const response = await axios.post(import.meta.env.VITE_SERVER_URL + "/users/loginDesktop", {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    username: email,
                    password: password
                }
            });

            console.log('Login Successful:', response.data);

            if (response.data) {
                userContext.setUser(response.data.user);
                userContext.setToken(response.data.token);
                navigate(`/statistics`);
            } else {
                setEmail("");
                setPassword("");
                setError("Invalid username or password");
            }
        } catch (error) {
            console.error('Login Failed:', error);
            setError("Login request failed");
        }
    }
    if (userContext.user) {
        return <>
            <div className="h-full w-full bg-white absolute ">
                ste že prijavljeni
                <button onClick={userContext.logout}>odjava</button>
            </div>
        </>
    }
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">

            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-10 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Prijavite se v svoj račun
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Uporabniško ime
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="text"
                                autoComplete="email"
                                required
                                className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Geslo
                            </label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Pozabljeno geslo?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full  px-2  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Prijava
                        </button>
                    </div>
                </form>
                {error}
                <p className="mt-10 text-center text-sm text-gray-500">
                    Niste še član?{' '}
                    <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Prenestite si aplikacijo
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Login;
