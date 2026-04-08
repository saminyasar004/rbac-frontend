"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, History, Filter, User as UserIcon, Activity, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditLog {
	id: string;
	userId: string;
	action: string;
	resource: string;
	details: any;
	ipAddress: string;
	createdAt: string;
	user?: {
		firstName: string;
		lastName: string;
		email: string;
	};
}

export default function AuditLogsPage() {
	const [logs, setLogs] = useState<AuditLog[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		fetchLogs();
	}, []);

	const fetchLogs = async () => {
		try {
			const { data } = await api.get("/audit-logs");
			setLogs(data);
		} catch (error) {
			console.error("Failed to fetch logs:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const filteredLogs = logs.filter(log => 
		log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
		log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
		log.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
		log.user?.firstName.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const getActionBadge = (action: string) => {
		const method = action.split(" ")[0];
		switch (method) {
			case "POST": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold">CREATE</Badge>;
			case "PATCH": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-bold">UPDATE</Badge>;
			case "PUT": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-bold">UPDATE</Badge>;
			case "DELETE": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none font-bold">DELETE</Badge>;
			default: return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none font-bold">{method}</Badge>;
		}
	};

	return (
		<div className="space-y-6 max-w-full overflow-hidden">
			<div>
				<h1 className="text-2xl font-black text-gray-900 tracking-tight">System Audit Logs</h1>
				<p className="text-gray-500 text-sm font-medium">Traceable append-only history of administrative actions</p>
			</div>

			<Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
				<CardHeader className="pb-4">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Filter logs by action, resource or user..."
								className="pl-10 h-11 bg-gray-50 border-none rounded-xl font-medium"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<div className="flex items-center gap-2">
							<Button variant="outline" className="rounded-xl font-bold text-gray-500 h-11 border-gray-100">
								<Filter className="mr-2 h-4 w-4" /> Export CSV
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<div className="overflow-x-auto custom-scrollbar">
						<Table>
							<TableHeader className="bg-gray-50/50">
								<TableRow className="hover:bg-transparent border-b border-gray-50">
									<TableHead className="text-xs font-bold text-gray-400 uppercase h-12 px-6">Timestamp</TableHead>
									<TableHead className="text-xs font-bold text-gray-400 uppercase h-12 px-6">User</TableHead>
									<TableHead className="text-xs font-bold text-gray-400 uppercase h-12 px-6">Action</TableHead>
									<TableHead className="text-xs font-bold text-gray-400 uppercase h-12 px-6">Resource</TableHead>
									<TableHead className="text-xs font-bold text-gray-400 uppercase h-12 px-6">IP Address</TableHead>
									<TableHead className="text-xs font-bold text-gray-400 uppercase h-12 px-6 text-right">Details</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={6} className="h-64 text-center">
											<div className="flex flex-col items-center gap-3">
												<div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
												<p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Retrieving logs...</p>
											</div>
										</TableCell>
									</TableRow>
								) : filteredLogs.length === 0 ? (
									<TableRow>
										<TableCell colSpan={6} className="h-64 text-center">
											<div className="flex flex-col items-center gap-4">
												<div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
													<Activity className="text-gray-300 h-8 w-8" />
												</div>
												<div>
													<p className="text-gray-900 font-bold">No logs found</p>
													<p className="text-gray-400 text-sm">System activity will appear here as it happens.</p>
												</div>
											</div>
										</TableCell>
									</TableRow>
								) : (
									filteredLogs.map((log) => (
										<TableRow key={log.id} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50">
											<TableCell className="px-6 py-4">
												<div className="flex flex-col">
													<span className="text-sm font-bold text-gray-900">{new Date(log.createdAt).toLocaleDateString()}</span>
													<span className="text-[10px] text-gray-400 font-black">{new Date(log.createdAt).toLocaleTimeString()}</span>
												</div>
											</TableCell>
											<TableCell className="px-6 py-4">
												<div className="flex items-center gap-2">
													<div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
														<UserIcon size={14} />
													</div>
													<div className="flex flex-col">
														<span className="text-sm font-bold text-gray-700">{log.user ? `${log.user.firstName} ${log.user.lastName}` : "System"}</span>
														<span className="text-[11px] text-gray-400 font-medium">{log.user?.email || "internal_process"}</span>
													</div>
												</div>
											</TableCell>
											<TableCell className="px-6 py-4">{getActionBadge(log.action)}</TableCell>
											<TableCell className="px-6 py-4 uppercase">
												<span className="text-xs font-black text-gray-400 tracking-widest">{log.resource}</span>
											</TableCell>
											<TableCell className="px-6 py-4">
												<code className="text-[11px] font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{log.ipAddress || "0.0.0.0"}</code>
											</TableCell>
											<TableCell className="px-6 py-4 text-right">
												<Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary transition-all">
													<ExternalLink size={14} className="mr-1" /> Inspect
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
