"use client";

import Link from "next/link"
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoaderSpinner from "@/components/loader-spinner";
import BaseAlert from "@/components/base-alert";

export default function Page(){
  const router = useRouter(); // tambahkan ini
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({
    type: "",
    message: "",
    isShow: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      console.log("Login error:", res.error);
      setAlert({
        type: "error",
        message: res.error,
        isShow: true
      });
      setIsLoading(false);
    } else {
      router.push("/dashboard"); // ganti ke halaman tujuanmu
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    const res = await signIn("google", {
      callbackUrl: "/dashboard", // arahkan ke dashboard setelah login berhasil
    });
    console.log(res, "Google sign-in response");
    if (res?.error) {
      setAlert({
        type: "error",
        message: res.error,
        isShow: true
      });
      setIsLoadingGoogle(false);
    } else {
      router.push("/dashboard"); // ganti ke halaman tujuanmu
      setIsLoadingGoogle(false);
    }
  };

  return (
    <section className="h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8">
        <form className="" action="#">
            <h5 className="text-xl font-medium text-gray-900 mb-6">Sign in to our platform</h5>
            <div className="mb-6">
              {alert.isShow && <BaseAlert alert={alert} />}
            </div>
            <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Your password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button
              type="button"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center gap-3 cursor-pointer"
              disabled={isLoading}
              onClick={handleLogin}
            >
              { isLoading ? 'Loading' : 'Login to your account' }
              { isLoading && (<LoaderSpinner />) }
            </button>
            <span className="mt-2 text-center flex w-full mb-2 justify-center">or</span>
            <button
              type="button"
              className="w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center gap-3 cursor-pointer mb-6"
              disabled={isLoadingGoogle}
              onClick={handleGoogleLogin}
            >
              { isLoadingGoogle ? 'Loading' : 'Login to your account Google' }
              { isLoadingGoogle && (<LoaderSpinner />) }
            </button>
            <div className="text-sm font-medium text-gray-500">
                Not registered? <Link href="/signup" className="text-blue-700 hover:underline">Create account</Link>
            </div>
        </form>
      </div>
    </section>
  )
}