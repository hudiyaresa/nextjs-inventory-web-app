"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Components
import LoaderSpinner from "@/components/loader-spinner";
import BaseAlert from "@/components/base-alert";

export default function Page(){
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [alert, setAlert] = useState({
    type: "",
    message: "",
    isShow: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    setIsLoading(true);
    console.log("Registering user:", { email: registerEmail, password: registerPassword, name: registerName });
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: registerEmail,
        password: registerPassword,
        name: registerName,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (res.ok) {
      setAlert({
        type: "success",
        message: "Register success, please check your email to verify your account",
        isShow: true
      });
      setIsLoading(false);
      localStorage.setItem("pendingVerifyEmail", registerEmail);
      setTimeout(() => {
        router.push("/verify");
      }, 1000);
    } else {
      setAlert({
        type: "error",
        message: data.error || "Register failed",
        isShow: true
      });
      setIsLoading(false);
    }
  };

  return (
    <section className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8">
        <form className="space-y-6">
            <h5 className="text-xl font-medium text-gray-900">Sign up to our platform</h5>
            { alert.isShow && (
              <BaseAlert alert={{ type: alert.type, message: alert.message }} />
            )}
            <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Your name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="John Doe"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
            </div>
            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="name@company.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
            </div>
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Your password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
            </div>
            <button
              onClick={handleRegister}
              type="button"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer flex items-center gap-3 justify-center"
            >
              { isLoading ? 'Loading' : 'Register to your account' }
              { isLoading && (<LoaderSpinner />) }
            </button>
            <div className="text-sm font-medium text-gray-500">
                Already have account? <Link href="/signin" className="text-blue-700 hover:underline">Signin to your account</Link>
            </div>
        </form>
      </div>
    </section>
  )
}