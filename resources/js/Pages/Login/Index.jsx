import { useForm } from "@inertiajs/react";

export default function Login() {
    const { data, setData, post } = useForm({
        username: '',
        password: '',
    });

    function login(e) {
        e.preventDefault();
        post(route('login')); // Send POST request to Laravel
    }

    return (
        <div className="min-h-screen bg-black flex justify-center items-center">
            <div className="bg-white w-80 rounded-xl">
                <p className="text-center m-4 font-bold">Login</p>
                <form onSubmit={login} className="flex flex-col">
                    <input
                        type="text"
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        placeholder="Enter Username"
                        className="rounded-full m-2 bg-slate-300"
                    />
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Enter Password"
                        className="rounded-full m-2 bg-slate-300"
                    />
                    <button
                        type="submit"
                        className="m-4 bg-red-400 hover:bg-red-800 cursor-pointer rounded-full h-10"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}