"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
	const router = useRouter();
	const { login, getBootstrapStatus, isBootstrapped } = useAuthStore();

	const [email, setEmail] = useState("admin@example.com");
	const [password, setPassword] = useState("admin123456");
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		getBootstrapStatus();
	}, [getBootstrapStatus]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			await login(email, password);
			router.push("/dashboard");
		} catch (err: any) {
			setError(err.message || "Invalid credentials");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex bg-white font-sans selection:bg-orange-100">
			{/* Autofill Style Override */}
			<style jsx global>{`
				input:-webkit-autofill,
				input:-webkit-autofill:hover,
				input:-webkit-autofill:focus,
				input:-webkit-autofill:active {
					-webkit-box-shadow: 0 0 0 30px white inset !important;
					-webkit-text-fill-color: #111827 !important;
				}
			`}</style>

			{/* Left Side - Login Form Context */}
			<div className="w-full lg:w-1/2 flex flex-col relative z-10">
				{/* Logo at Top Left */}
				<div className="pt-10 pl-10 md:pt-12 md:pl-12">
					<Image
						src="/logo.svg"
						alt="Obliq Logo"
						width={104}
						height={40}
						className="h-10 w-auto"
						priority
						unoptimized={true}
					/>
				</div>

				{/* Centered Login Form Card */}
				<div className="flex-1 flex items-center justify-center p-6 md:p-12">
					<div className="w-full max-w-[420px] bg-white rounded-[20px] border-10 border-gray-100/50 shadow-[0_16px_34px_rgba(194,194,194,0.1),0_62px_62px_rgba(194,194,194,0.09)] p-10">
						{/* Title & Subtitle */}
						<div className="mb-10 text-center">
							<h1 className="text-[32px] font-bold text-gray-900 mb-2 tracking-tight">
								Login
							</h1>
							<p className="text-gray-400 font-medium text-sm">
								Enter your details to continue
							</p>
						</div>

						{/* Error Message */}
						{error && (
							<div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-semibold">
								{error}
							</div>
						)}

						{/* Bootstrap Alert */}
						{!isBootstrapped && (
							<div className="mb-8 p-5 bg-orange-50 border border-orange-200 rounded-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
								<div className="flex gap-3">
									<div className="w-10 h-10 rounded-full bg-orange-400/10 flex items-center justify-center shrink-0">
										<AlertCircle
											className="text-orange-600"
											size={20}
										/>
									</div>
									<div className="space-y-1">
										<p className="text-[14px] font-bold text-gray-900 leading-none">
											System Not Initialized
										</p>
										<p className="text-[12px] text-gray-500 font-medium">
											Create the first Admin account to
											bootstrap the RBAC system.
										</p>
									</div>
								</div>
								<Link href="/signup">
									<Button className="w-full h-8 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black rounded-lg">
										Bootstrap Now
									</Button>
								</Link>
							</div>
						)}

						{/* Login Form */}
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="flex flex-col gap-2">
								<Label
									htmlFor="email"
									className="text-sm font-semibold text-gray-600 ml-1"
								>
									Email
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="example@email.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="h-[52px] rounded-xl border-gray-200 focus:border-[#FD6D3F] focus:ring-1 focus:ring-[#FD6D3F] text-gray-900 placeholder:text-gray-400 px-[10px] transition-all"
								/>
							</div>

							<div className="flex flex-col gap-2">
								<Label
									htmlFor="password"
									className="text-sm font-semibold text-gray-600 ml-1"
								>
									Password
								</Label>
								<div className="relative">
									<Input
										id="password"
										type={
											showPassword ? "text" : "password"
										}
										placeholder="Enter your password"
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										required
										className="h-[52px] rounded-xl border-gray-200 focus:border-[#FD6D3F] focus:ring-1 focus:ring-[#FD6D3F] pr-12 text-gray-900 placeholder:text-gray-400 px-4 transition-all"
									/>
									<button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
									>
										{showPassword ? (
											<EyeOffIcon size={20} />
										) : (
											<EyeIcon size={20} />
										)}
									</button>
								</div>
							</div>

							<div className="flex items-center justify-between px-1">
								<div className="flex items-center space-x-2">
									<Checkbox
										id="remember"
										checked={rememberMe}
										onCheckedChange={(checked) =>
											setRememberMe(checked as boolean)
										}
										className="h-5 w-5 rounded-md border-gray-300 data-[state=checked]:bg-[#FD6D3F] data-[state=checked]:border-[#FD6D3F]"
									/>
									<label
										htmlFor="remember"
										className="text-sm font-medium text-gray-400 cursor-pointer select-none"
									>
										Remember me
									</label>
								</div>
								<a
									href="#"
									className="text-sm text-[#FD6D3F] hover:opacity-80 font-bold transition-opacity"
								>
									Forgot password?
								</a>
							</div>

							<Button
								type="submit"
								disabled={isLoading}
								className="w-full h-10 bg-[#FD6D3F] hover:bg-[#ff5d29] text-white font-bold text-[14px] rounded-xl shadow-lg shadow-[#FD6D3F]/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:scale-100 mt-4 cursor-pointer"
							>
								{isLoading ? (
									<div className="flex items-center gap-2">
										<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
										<span>Logging in...</span>
									</div>
								) : (
									"Log in"
								)}
							</Button>
						</form>

						{/* Sign Up Link */}
						<div className="mt-10 text-center">
							<span className="text-gray-500 text-sm font-medium">
								Don't have an account?{" "}
							</span>
							<Link
								href="/signup"
								className="text-black hover:text-[#FD6D3F] font-bold text-sm transition-colors"
							>
								Sign up
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Right Side - Banner Image Section */}
			<div className="hidden lg:flex lg:w-1/2 p-6 h-screen overflow-hidden">
				<div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-[#FDEFEA]">
					<Image
						src="/login-banner.svg"
						alt="Obliq App Interface"
						fill
						className="object-cover"
						priority
						unoptimized={true}
					/>
				</div>
			</div>
		</div>
	);
}
