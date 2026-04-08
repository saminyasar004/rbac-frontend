"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
	const router = useRouter();
	const { register, getBootstrapStatus, isBootstrapped } = useAuthStore();

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
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
			await register(formData);
			router.push("/dashboard");
		} catch (err: any) {
			setError(err.message || "Registration failed");
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

			{/* Left Side - Signup Form Context */}
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

				{/* Centered Signup Form Card */}
				<div className="flex-1 flex items-center justify-center p-6 md:p-12">
					<div className="w-full max-w-[420px] bg-white rounded-[20px] border-10 border-gray-100/50 shadow-[0_16px_34px_rgba(194,194,194,0.1),0_62px_62px_rgba(194,194,194,0.09)] p-10">
						{/* Title & Subtitle */}
						<div className="mb-10 text-center">
							{!isBootstrapped && (
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
									<Shield size={12} />
									System Bootstrap Mode
								</div>
							)}
							<h1 className="text-[32px] font-bold text-gray-900 mb-2 tracking-tight">
								{isBootstrapped ? "Sign Up" : "Init System Admin"}
							</h1>
							<p className="text-gray-400 font-medium text-sm">
								{isBootstrapped 
									? "Enter your details to create an account"
									: "The first account will have full Admin privileges."}
							</p>
						</div>

						{/* Error Message */}
						{error && (
							<div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-semibold">
								{error}
							</div>
						)}

						{/* Signup Form */}
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-2 gap-4">
								<div className="flex flex-col gap-2">
									<Label htmlFor="firstName" className="text-sm font-semibold text-gray-600 ml-1">
										First Name
									</Label>
									<Input
										id="firstName"
										placeholder="John"
										value={formData.firstName}
										onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
										required
										className="h-[52px] rounded-xl border-gray-200 focus:border-[#FD6D3F] focus:ring-1 focus:ring-[#FD6D3F] text-gray-900 placeholder:text-gray-400 px-4 transition-all"
									/>
								</div>
								<div className="flex flex-col gap-2">
									<Label htmlFor="lastName" className="text-sm font-semibold text-gray-600 ml-1">
										Last Name
									</Label>
									<Input
										id="lastName"
										placeholder="Doe"
										value={formData.lastName}
										onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
										required
										className="h-[52px] rounded-xl border-gray-200 focus:border-[#FD6D3F] focus:ring-1 focus:ring-[#FD6D3F] text-gray-900 placeholder:text-gray-400 px-4 transition-all"
									/>
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="email" className="text-sm font-semibold text-gray-600 ml-1">
									Email
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="example@email.com"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									required
									className="h-[52px] rounded-xl border-gray-200 focus:border-[#FD6D3F] focus:ring-1 focus:ring-[#FD6D3F] text-gray-900 placeholder:text-gray-400 px-4 transition-all"
								/>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor="password" className="text-sm font-semibold text-gray-600 ml-1">
									Password
								</Label>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Minimum 6 characters"
										value={formData.password}
										onChange={(e) => setFormData({ ...formData, password: e.target.value })}
										required
										minLength={6}
										className="h-[52px] rounded-xl border-gray-200 focus:border-[#FD6D3F] focus:ring-1 focus:ring-[#FD6D3F] pr-12 text-gray-900 placeholder:text-gray-400 px-4 transition-all"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
									>
										{showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
									</button>
								</div>
							</div>

							<Button
								type="submit"
								disabled={isLoading}
								className="w-full h-10 bg-[#FD6D3F] hover:bg-[#ff5d29] text-white font-bold text-[14px] rounded-xl shadow-lg shadow-[#FD6D3F]/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:scale-100 mt-4 cursor-pointer"
							>
								{isLoading ? (
									<div className="flex items-center gap-2">
										<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
										<span>{isBootstrapped ? "Creating..." : "Bootstrapping..."}</span>
									</div>
								) : (
									isBootstrapped ? "Sign Up" : "Bootstrap System"
								)}
							</Button>
						</form>

						{/* Login Link */}
						<div className="mt-10 text-center">
							<span className="text-gray-500 text-sm font-medium">
								Already have an account?{" "}
							</span>
							<Link
								href="/login"
								className="text-black hover:text-[#FD6D3F] font-bold text-sm transition-colors"
							>
								Login here
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
