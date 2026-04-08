"use client";

import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, LayoutDashboard, Settings } from "lucide-react";

export default function CustomerPortalPage() {
	const { user } = useAuthStore();

	return (
		<div className="space-y-8 max-w-6xl mx-auto pb-12">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
				<div>
					<h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back, {user?.firstName}!</h1>
					<p className="text-gray-500 font-medium">Your personal workspace and interaction history.</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" className="rounded-xl font-bold border-gray-100 h-11 text-gray-500">
						<MessageSquare className="mr-2 h-4 w-4" /> Support
					</Button>
					<Button className="bg-primary hover:bg-primary/90 text-white font-black h-11 px-6 rounded-xl shadow-lg shadow-orange-200">
						New Inquiry
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{[
					{ label: "Active Inquiries", value: "2", icon: MessageSquare, color: "blue" },
					{ label: "Recent Documents", value: "14", icon: FileText, color: "orange" },
					{ label: "Service Level", value: "Premium", icon: LayoutDashboard, color: "green" },
					{ label: "Account Settings", value: "Manage", icon: Settings, color: "gray" },
				].map((stat, idx) => (
					<Card key={idx} className="border-none shadow-sm bg-white rounded-2xl group hover:shadow-lg transition-all duration-300 cursor-pointer">
						<CardContent className="pt-8">
							<div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
								<stat.icon size={24} />
							</div>
							<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
							<p className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</p>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<Card className="lg:col-span-2 border-none shadow-sm bg-white rounded-3xl overflow-hidden">
					<CardHeader className="border-b border-gray-50 bg-gray-50/30 p-8">
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-xl font-bold">Recent Communications</CardTitle>
								<CardDescription className="font-medium">Stay updated with your latest support interactions.</CardDescription>
							</div>
							<Button variant="ghost" className="text-primary font-bold">View All</Button>
						</div>
					</CardHeader>
					<CardContent className="p-0">
						<div className="divide-y divide-gray-50">
							{[1, 2, 3].map((i) => (
								<div key={i} className="p-8 hover:bg-gray-50/50 transition-colors cursor-pointer group">
									<div className="flex items-center justify-between mb-2">
										<div className="flex items-center gap-2">
											<span className="text-sm font-bold text-gray-900">Support Ticket #002{i}</span>
											<Badge className="bg-orange-100 text-orange-700 border-none font-bold text-[10px]">Pending</Badge>
										</div>
										<span className="text-[10px] font-black text-gray-400 uppercase">Oct 24, 2024</span>
									</div>
									<p className="text-sm text-gray-500 font-medium mb-4 line-clamp-1">
										Hello, I was wondering about the recent changes to my user permissions and...
									</p>
									<div className="flex items-center gap-2">
										<div className="w-6 h-6 rounded-full bg-gray-100 border border-white -mr-3" />
										<div className="w-6 h-6 rounded-full bg-gray-200 border border-white -mr-3" />
										<span className="text-[11px] font-bold text-gray-400 ml-4">+2 replies</span>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden self-start">
					<CardHeader className="p-8 pb-4">
						<CardTitle className="text-xl font-bold">Quick Access</CardTitle>
					</CardHeader>
					<CardContent className="p-8 pt-0 space-y-4">
						<div className="p-4 bg-gray-50 rounded-2xl hover:bg-orange-50 transition-colors cursor-pointer group">
							<p className="text-sm font-bold text-gray-900 mb-1 group-hover:text-primary">Download Invoices</p>
							<p className="text-xs text-gray-400 font-medium">Access your billing history</p>
						</div>
						<div className="p-4 bg-gray-50 rounded-2xl hover:bg-orange-50 transition-colors cursor-pointer group">
							<p className="text-sm font-bold text-gray-900 mb-1 group-hover:text-primary">Knowledge Base</p>
							<p className="text-xs text-gray-400 font-medium">Read our documentation</p>
						</div>
						<div className="p-4 bg-gray-50 rounded-2xl hover:bg-orange-50 transition-colors cursor-pointer group">
							<p className="text-sm font-bold text-gray-900 mb-1 group-hover:text-primary">Security Audit</p>
							<p className="text-xs text-gray-400 font-medium">Check your login history</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
