import { useRef, useState } from "react";
import { axiosClient } from "../utils/axiosClient";
import { register } from "../features/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input"; // ShadCN Input component
import { Button } from "@/components/ui/button"; // ShadCN Button component
import { toast } from "sonner"; // Sonner for notifications

function Register() {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    });
    setLoading(true);

    axiosClient
      .post("/auth/register", {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
      .then((data) => {
        dispatch(register(data.data));
        toast.success("Registration successful!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Registration failed. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-base shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <Input
          type="text"
          placeholder="Enter your username"
          ref={usernameRef}
          className="w-full"
        />
        <Input
          type="email"
          placeholder="Enter your email"
          ref={emailRef}
          className="w-full"
        />
        <Input
          type="password"
          placeholder="Create a password"
          ref={passwordRef}
          className="w-full"
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
