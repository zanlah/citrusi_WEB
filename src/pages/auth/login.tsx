import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import securityImage from "../../assets/Data-security.svg"
import networkErrorImage from "../../assets/Network-error.svg"
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [authError, setAuthError] = useState(false)
    const userContext = useContext(UserContext);
    const navigate = useNavigate();
    const [sse, setSse] = useState<any>(null);
    const [nextStep, setNextStep] = useState(false);

    const signInAfter2FA = async () => {
        try {
            const response = await axios.post(import.meta.env.VITE_SERVER_URL + "/users/verified-login", {
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
                setError("Napačno uporabniško ime ali geslo");
            }
        } catch (error) {
            console.error('Login Failed:', error);
            setError("Login request failed");
        }
    }


    const setupSSE = (token: any) => {
        const eventSource = new EventSource(`${import.meta.env.VITE_SERVER_URL}/notifications/events?token=${token}`);

        eventSource.onmessage = function (event) {
            const data = JSON.parse(event.data);
            console.log('Event received:', data);
            if (data.type === "verification") {

                if (data.message === "success") {
                    signInAfter2FA();
                } else {
                    setAuthError(true);
                    setError("Face verification failed");
                }
            }
        };

        eventSource.onerror = function (event) {
            console.error('EventSource failed:', event);
            eventSource.close();
        };

        setSse(eventSource);
    };

    useEffect(() => {
        return () => {
            if (sse) {
                sse.close();
                console.log('EventSource closed');
            }
        };
    }, [sse]);

    const restart = () => {
        setAuthError(false);
        setNextStep(false);
    }
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
                //userContext.setUser(response.data.user);
                //userContext.setToken(response.data.token);
                //navigate(`/statistics`);
                if (response.data.nextStep) {
                    setNextStep(true)
                }
                setupSSE(response.data.token);
            } else {
                setEmail("");
                setPassword("");
                setError("Napačno uporabniško ime ali geslo");
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
        <> {authError && <div className="flex h-full min-h-screen justify-center items-center flex-col">
            <img src={networkErrorImage} className="h-[300px] w-[300px]" />
            <h2 className="text-2xl">Verifikacija ni uspela.</h2>
            <p className="text-gray-600">Poskusite ponovno.</p>
            <button
                type="submit"
                className="flex mt-5 max-w-96 justify-center rounded-md bg-indigo-600  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={restart}
            >
                Poskusi ponovno
            </button>
        </div> || nextStep &&
            <div className="flex h-full min-h-screen justify-center items-center flex-col">
                <img src={securityImage} className="h-[300px] w-[300px]" />
                <svg className="text-gray-300  my-5 animate-spin" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24">
                    <path
                        d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                        stroke="currentColor" strokeWidth="5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path
                        d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                        stroke="currentColor" strokeWidth="5" stroke-linecap="round" stroke-linejoin="round" className="text-gray-900">
                    </path>
                </svg>
                <h2 className="text-2xl">Prosim preverite mobilno aplikacijo</h2>
                <p className="text-gray-600">Za 2-faktorsko avtorizacijo potrebujemo vaš obraz.</p>
            </div>
            ||

            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">

                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-16 w-auto"
                        src={import.meta.env.VITE_SERVER_URL + "/uploads/image.png"}
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
        }
        </>
    );
}

export default Login;
