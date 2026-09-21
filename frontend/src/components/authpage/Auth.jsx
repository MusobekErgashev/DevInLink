'use client'

import api from '@/api/axios';
import { ArrowRight, AtSign, EyeOff, Lock, Mail, Sparkles, Terminal, User, Zap } from 'lucide-react';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import toast from 'react-hot-toast'

const Auth = () => {
    const router = useRouter();
    const [page, setPage] = useState("login");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [loginInput, setLoginInput] = useState("");

    const [error, setError] = useState("");

    if (error) setTimeout(() => setError(""), 2500);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (page === "register") {
                await api.post('/auth/register', {
                    username,
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    password_hash: password,
                });
                toast.success("Muvaffaqiyatli ro'yxatdan o'tingiz");
                // eslint-disable-next-line
                window.location.href = '/profile';
            } else {
                await api.post('/auth/login', {
                    username: loginInput.includes('@gmail.com') ? null : loginInput,
                    email: loginInput.includes('@gmail.com') ? loginInput : null,
                    password_hash: password,
                });
                toast.success("Muvaffaqiyatli tizimga kirdingiz");
                // eslint-disable-next-line
                window.location.href = '/profile';
            }
        } catch (err) {
            setError(err?.response?.data?.message)
        }
    }

    function validatorError(message) {
        if (error && typeof error === 'string' && error.toLowerCase().includes(message.toLowerCase())) {
            return error.split(',').map((item, key) => (
                <p key={key} className='text-sm text-red-400 leading-1'> {item} </p>
            ));
        }
    }

    return (
        <div className="min-h-screen fixed top-0 z-50 left-0 w-full bg-zinc-950 text-zinc-100 flex items-center justify-center overflow-hidden font-sans">
            {/* Grid patternli orqa fon va neon nur effekti */}
            <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Asosiy Container */}
            <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
                <div className="grid grid-cols-1 w-max lg:w-full mx-auto lg:mx-0 lg:grid-cols-12 sm:p-10 gap-8 items-center bg-transparent lg:bg-background lg:border border-zinc-800/80 lg:backdrop-blur-2xl lg:shadow-2xl overflow-hidden">
                    <div className="col-span-6 py-6 hidden lg:flex flex-col justify-between space-y-8 ">
                        <div>
                            <Image src="/logo.png" alt="Logo" width={200} height={200} />
                        </div>

                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300">
                                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Anti-Resume *</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                                {`Resume va portfolio so'rashsa,`} <br />
                                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                                    Ularga profil linkingizni bering...
                                </span>
                            </h1>
                            <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                                {`Haliyam ishga topshirishda PDF resume yuborib, portfolio uchun alohida sayt yasab yuribsizmi xoji aka?
                                Devinlinkda ro'yxatdan o'tib bu muammolarga yechim toping.`}
                            </p>
                        </div>

                        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 font-mono text-xs shadow-inner space-y-3">
                            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <div className="flex items-center gap-1 text-zinc-500 text-[10px]">
                                    <Terminal className="w-3 h-3" />
                                    <span>devinlink.config.js</span>
                                </div>
                            </div>

                            <div className="space-y-1 text-zinc-300">
                                <p><span className="text-purple-400">const</span> <span className="text-blue-400">developer</span> = &#123;</p>
                                <p className="pl-4"><span className="text-zinc-500">platform:</span> <span className="text-emerald-400">&apos;DevInLink&apos;</span>,</p>
                                <p className="pl-4"><span className="text-zinc-500">skills:</span> [<span className="text-amber-300">&apos;React&apos;</span>, <span className="text-amber-300">&apos;Node Js&apos;</span>, <span className="text-amber-300">&apos;AI&apos;</span>],</p>
                                <p className="pl-4"><span className="text-zinc-500">connected:</span> <span className="text-indigo-400">true</span></p>
                                <p>&#125;;</p>
                            </div>
                        </div>
                    </div>

                    {/* ================= O'NG TOMON: Authentifikatsiya Formasi ================= */}
                    <div className="lg:col-span-6 px-4 sm:px-10 py-10 border border-zinc-800/80 rounded-3xl backdrop-blur-2xl shadow-2xl overflow-hidden bg-zinc-950/40">
                        {/* Header Switcher (Register / Login Switch) */}
                        <div className="relative flex w-full p-1 bg-zinc-900/90 border border-zinc-800/80 rounded-2xl mb-8 backdrop-blur-xl shadow-inner">
                            <button
                                type="button"
                                onClick={() => setPage("login")}
                                className={`relative z-10 flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${page === "login"
                                    ? "text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-600/30"
                                    : "text-zinc-400 hover:text-zinc-200"
                                    }`}
                            >
                                <span>Kirish</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPage("register")}
                                className={`relative z-10 flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${page === "register"
                                    ? "text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-600/30"
                                    : "text-zinc-400 hover:text-zinc-200"
                                    }`}
                            >
                                <span>{`Ro'yxatdan o'tish`}</span>
                            </button>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {page === "register" ? "Hisob yaratish" : "Tizimga kirish"}
                                </h2>
                                <p className="text-xs text-zinc-400 mt-1">
                                    {page === "register"
                                        ? `Barcha imkoniyatlardan foydalanish uchun ma'lumotlarni kiriting`
                                        : `DevInLink hisobingizga kirish uchun ma'lumotlarni kiriting`
                                    }
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-4">
                            {page === "register" && (
                                <>
                                    {/* Ism va Familiya */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                                            <input
                                                type="text"
                                                placeholder="Ism"
                                                className="w-full pl-10 pr-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                                            <input
                                                type="text"
                                                placeholder="Familiya"
                                                className="w-full pl-10 pr-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className='text-center'>
                                        {validatorError('ism')}
                                        {validatorError('familya')}
                                    </div>

                                    {/* Username */}
                                    <div className="relative">
                                        <AtSign className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                                        <input
                                            type="text"
                                            placeholder="Username (masalan: alex_dev)"
                                            className="w-full pl-10 pr-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>

                                    {validatorError('username')}
                                </>
                            )}

                            {/* Email Input */}
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder={page === "register" ? "Email manzil" : "Email yoki username"}
                                    className="w-full pl-10 pr-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                    value={page === 'register' ? email : loginInput}
                                    onChange={(e) => page === 'register' ? setEmail(e.target.value) : setLoginInput(e.target.value)}
                                />

                            </div>

                            {validatorError('email')}

                            {/* Password Input */}
                            <div className="space-y-1.5">
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="password"
                                        placeholder="Parol"
                                        className="w-full pl-10 pr-10 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div className='mt-3'>
                                    {validatorError('parol')}
                                </div>

                                {page === "login" && (
                                    <div className="flex justify-end pt-1">
                                        <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer">
                                            Parolni unutdingizmi?
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Asosiy Yuborish Tugmasi */}
                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 group cursor-pointer mt-2"
                            >
                                <span>{page === "register" ? `Ro'yxatdan o'tish` : "Kirish"}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        {/* Ajratuvchi Chiziq */}
                        <div className="flex mt-6 items-center gap-3">
                            <span className='w-full h-[1px] bg-zinc-800'></span>
                            <p className="text-center whitespace-nowrap text-xs text-zinc-400">
                                <span>{page === "register" ? "Akkauntingiz bormi?" : "Akkauntingiz yo'qmi?"}</span>
                                <button
                                    type="button"
                                    onClick={() => setPage(page === "register" ? "login" : "register")}
                                    className="text-indigo-400 hover:underline font-semibold cursor-pointer ml-1.5"
                                >
                                    {page === "register" ? "Kirish" : `Ro'yxatdan o'tish`}
                                </button>
                            </p>
                            <span className='w-full h-[1px] bg-zinc-800'></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth