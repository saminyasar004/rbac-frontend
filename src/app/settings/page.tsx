"use client";

import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Shield, Key, Bell, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
	const { user } = useAuthStore();

	return (
		<div className="max-w-4xl mx-auto space-y-8 pb-12">
			<div>
				<h1 className="text-3xl font-black text-gray-900 tracking-tight">System Settings</h1>
				<p className="text-gray-500 font-medium">Manage your personal profile and application preferences</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Sidebar Navigation */}
				<div className="space-y-1">
					<Button variant="ghost" className="w-full justify-start rounded-xl font-bold bg-orange-50 text-[#FD6D3F] hover:bg-orange-100 hover:text-[#FD6D3F]">
						<User className="mr-3 h-5 w-5" /> Profile Info
					</Button>
					<Button variant="ghost" className="w-full justify-start rounded-xl font-bold text-gray-500 hover:bg-gray-50">
						<Key className="mr-3 h-5 w-5" /> Password & Security
					</Button>
					<Button variant="ghost" className="w-full justify-start rounded-xl font-bold text-gray-500 hover:bg-gray-50">
						<Bell className="mr-3 h-5 w-5" /> Notifications
					</Button>
					<Button variant="ghost" className="w-full justify-start rounded-xl font-bold text-gray-500 hover:bg-gray-50">
						<Globe className="mr-3 h-5 w-5" /> Language & Region
					</Button>
				</div>

				{/* Main Content */}
				<div className="md:col-span-2 space-y-6">
					<Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
						<CardHeader className="border-b border-gray-50">
							<CardTitle className="text-xl font-bold">Personal Information</CardTitle>
							<CardDescription className="font-medium">Update your account details and how others see you.</CardDescription>
						</CardHeader>
						<CardContent className="p-8 space-y-6">
							<div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-gray-50">
								<div className="w-20 h-20 bg-[#FD6D3F]/10 text-[#FD6D3F] text-2xl font-black rounded-3xl flex items-center justify-center uppercase shadow-inner">
									{user?.firstName?.[0] || "U"}
								</div>
								<div className="text-center sm:text-left space-y-2">
									<div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
										<p className="text-xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
										<Badge className="bg-primary/10 text-primary border-none font-black text-[10px] tracking-widest px-2 py-0.5 rounded-full uppercase">
											{user?.role}
										</Badge>
									</div>
									<p className="text-gray-400 font-medium text-sm">Public profile photo and role details</p>
									<Button size="sm" variant="outline" className="rounded-xl font-bold text-xs h-8 border-gray-100">Change Avatar</Button>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<div className="space-y-2">
									<Label className="text-xs font-bold text-gray-400 uppercase ml-1">First Name</Label>
									<Input defaultValue={user?.firstName} className="h-12 rounded-xl bg-gray-50/50 border-transparent focus:bg-white transition-all font-medium" />
								</div>
								<div className="space-y-2">
									<Label className="text-xs font-bold text-gray-400 uppercase ml-1">Last Name</Label>
									<Input defaultValue={user?.lastName} className="h-12 rounded-xl bg-gray-50/50 border-transparent focus:bg-white transition-all font-medium" />
								</div>
							</div>

							<div className="space-y-2">
								<Label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</Label>
								<Input defaultValue={user?.email} disabled className="h-12 rounded-xl bg-gray-50/50 border-transparent opacity-60 font-medium" />
								<p className="text-[10px] text-gray-400 font-bold ml-1 italic">* Email cannot be changed for security reasons</p>
							</div>

							<div className="pt-4 flex justify-end">
								<Button className="bg-[#FD6D3F] hover:bg-[#ff5d29] shadow-lg shadow-orange-200 text-white font-black h-12 rounded-xl px-10 transition-all active:scale-95">
									Save Changes
								</Button>
							</div>
						</CardContent>
					</Card>

					<Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
						<CardHeader className="border-b border-gray-50">
							<CardTitle className="text-xl font-bold flex items-center gap-2">
								<Shield size={20} className="text-primary" /> System Permissions
							</CardTitle>
							<CardDescription className="font-medium">Active permissions assigned to your account.</CardDescription>
						</CardHeader>
						<CardContent className="p-8">
							<div className="flex flex-wrap gap-2">
								{user?.permissions.map((perm) => (
									<Badge key={perm} variant="outline" className="bg-gray-50 border-gray-100 text-gray-600 font-bold px-3 py-1 rounded-lg">
										{perm}
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
