import { useForm } from "@inertiajs/react";

export default function Login() {
  const { data, setData, post } = useForm({
    username: "",
    password: "",
  });

  function login(e) {
    e.preventDefault();
    post(route("login")); // Send POST request to Laravel
  }

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/TCU.jpg')",
      }}
    >
      <div className="w-96 rounded-xl border border-red-600 bg-white shadow-lg">
        <div className="bg-red-600 rounded-t-xl py-6">
          <p className="text-center text-white font-bold text-2xl">
            Welcome to Inventory ewan
          </p>
        </div>

        <form onSubmit={login} className="flex flex-col p-6 space-y-4">
          <input
            type="text"
            value={data.username}
            onChange={(e) => setData("username", e.target.value)}
            placeholder="Enter Username"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-600 focus:ring-red-600 bg-slate-100"
          />
          <input
            type="password"
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
            placeholder="Enter Password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-600 focus:ring-red-600 bg-slate-100"
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}