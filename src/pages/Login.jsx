import { useRef, useState } from "react";
import { axiosClient } from "../utils/axiosClient";
import { login } from "../features/userSlice";
import { toast } from "sonner";

import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input"; // ShadCN Input component
import { Button } from "@/components/ui/button"; // ShadCN Button component
import { Link } from "react-router-dom"; // React Router for navigation

function Login() {
  const loginRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      username: loginRef.current.value,
      password: passwordRef.current.value,
    });
    setLoading(true);

    axiosClient
      .post("/auth/login", {
        username: loginRef.current.value,
        password: passwordRef.current.value,
      })
      .then((data) => {
        dispatch(login(data.data));
        window.localStorage.setItem("token", data.data.access_token);
        window.localStorage.setItem("refresh_token", data.data.refresh_token);
        toast.success("Login successful!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Login failed. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-base shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <Input
          type="text"
          placeholder="Enter your username"
          ref={loginRef}
          className="w-full"
        />
        <Input
          type="password"
          placeholder="Enter your password"
          ref={passwordRef}
          className="w-full"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
        <p className="text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
