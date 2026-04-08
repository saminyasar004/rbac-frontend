"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface User {
	id: string;
	firstName: string;
	lastName: string;
}

interface Task {
	id: string;
	title: string;
	description: string;
	status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
	priority: "LOW" | "MEDIUM" | "HIGH";
	dueDate: string;
	assignedTo: string;
	assignedUser?: {
		id: string;
		firstName: string;
		lastName: string;
	};
}

export default function TasksPage() {
	const { hasPermission } = useAuthStore();
	const [tasks, setTasks] = useState<Task[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [showAddDialog, setShowAddDialog] = useState(false);
	const [newTask, setNewTask] = useState({
		title: "",
		description: "",
		priority: "MEDIUM" as const,
		status: "PENDING" as const,
		dueDate: "",
	});

	useEffect(() => {
		fetchTasks();
		fetchUsers();
	}, []);

	const fetchTasks = async () => {
		try {
			const { data } = await api.get("/tasks");
			setTasks(data);
		} catch (error) {
			console.error("Failed to fetch tasks:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchUsers = async () => {
		try {
			const { data } = await api.get("/users");
			setUsers(data);
		} catch (error) {
			console.error("Failed to fetch users:", error);
		}
	};

	const handleCreateTask = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await api.post("/tasks", newTask);
			setShowAddDialog(false);
			fetchTasks();
			setNewTask({ title: "", description: "", priority: "MEDIUM", status: "PENDING", dueDate: "" });
		} catch (error) {
			console.error("Failed to create task:", error);
		}
	};

	const updateTaskStatus = async (taskId: string, status: string) => {
		try {
			await api.patch(`/tasks/${taskId}`, { status });
			fetchTasks();
		} catch (error) {
			console.error("Failed to update task status:", error);
		}
	};

	const handleAssignTask = async (taskId: string, userId: string) => {
		try {
			await api.patch(`/tasks/${taskId}`, { assignedTo: userId === "unassigned" ? null : userId });
			fetchTasks();
		} catch (error) {
			console.error("Failed to assign task:", error);
		}
	};

	const filteredTasks = tasks.filter(task => 
		task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		task.description.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "COMPLETED": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold">Completed</Badge>;
			case "IN_PROGRESS": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-bold">In Progress</Badge>;
			case "CANCELLED": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none font-bold">Cancelled</Badge>;
			default: return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none font-bold">Pending</Badge>;
		}
	};

	const getPriorityBadge = (priority: string) => {
		switch (priority) {
			case "HIGH": return <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 font-bold">High</Badge>;
			case "MEDIUM": return <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-50 font-bold">Medium</Badge>;
			default: return <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50 font-bold">Low</Badge>;
		}
	};

	return (
		<div className="space-y-6 max-w-full overflow-hidden">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-black text-gray-900 tracking-tight">Tasks Management</h1>
					<p className="text-gray-500 text-sm font-medium">Track and manage your team workflow items</p>
				</div>
				{hasPermission("tasks.manage") && (
					<Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
						<DialogTrigger asChild>
							<Button className="bg-[#FD6D3F] hover:bg-[#ff5d29] shadow-lg shadow-orange-200 text-white font-bold h-11 rounded-xl px-6 transition-all active:scale-95">
								<Plus className="mr-2 h-5 w-5" /> New Task
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-2xl border-none shadow-2xl">
							<DialogHeader>
								<DialogTitle className="text-xl font-bold">Create New Task</DialogTitle>
								<DialogDescription className="font-medium">Define the work item and set its priority.</DialogDescription>
							</DialogHeader>
							<form onSubmit={handleCreateTask} className="space-y-4 pt-4">
								<div className="space-y-2">
									<Label htmlFor="title" className="text-xs font-bold text-gray-500 uppercase ml-1">Task Title</Label>
									<Input 
										id="title" 
										placeholder="e.g. Update user permissions" 
										className="h-12 rounded-xl"
										value={newTask.title}
										onChange={(e) => setNewTask({...newTask, title: e.target.value})}
										required 
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="description" className="text-xs font-bold text-gray-500 uppercase ml-1">Description</Label>
									<Input 
										id="description" 
										placeholder="Brief details..." 
										className="h-12 rounded-xl"
										value={newTask.description}
										onChange={(e) => setNewTask({...newTask, description: e.target.value})}
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label className="text-xs font-bold text-gray-500 uppercase ml-1">Priority</Label>
										<Select value={newTask.priority} onValueChange={(v: any) => setNewTask({...newTask, priority: v})}>
											<SelectTrigger className="h-12 rounded-xl font-bold">
												<SelectValue />
											</SelectTrigger>
											<SelectContent className="rounded-xl">
												<SelectItem value="LOW">Low</SelectItem>
												<SelectItem value="MEDIUM">Medium</SelectItem>
												<SelectItem value="HIGH">High</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label className="text-xs font-bold text-gray-500 uppercase ml-1">Due Date</Label>
										<Input 
											type="date" 
											className="h-12 rounded-xl font-medium"
											value={newTask.dueDate}
											onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
										/>
									</div>
								</div>
								<DialogFooter className="pt-4">
									<Button type="submit" className="w-full h-12 bg-[#FD6D3F] hover:bg-[#ff5d29] font-bold rounded-xl text-white">
										Create Task
									</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				)}
			</div>

			<Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
				<CardHeader className="pb-4">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Search tasks..."
								className="pl-10 h-11 bg-gray-50 border-none rounded-xl font-medium"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<div className="flex items-center gap-2">
							<Button variant="outline" className="rounded-xl font-bold text-gray-500 h-11 border-gray-100">
								<Filter className="mr-2 h-4 w-4" /> Filter
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<div className="overflow-x-auto custom-scrollbar">
						<Table>
							<TableHeader className="bg-gray-50/50">
								<TableRow className="hover:bg-transparent border-b border-gray-50">
									<TableHead className="text-xs font-bold text-gray-400 uppercase h-12 px-6">Task</TableHead>
									<TableHead className="text-xs font-bold text-gray-400 uppercase h-12 px-6">Priority</TableHead>
									<TableHead className="text-xs font-bold text-gray-400 uppercase h-12 px-6">Status</TableHead>
									<TableHead className="text-xs font-bold text-gray-400 uppercase h-12 px-6">Assignee</TableHead>
									<TableHead className="text-xs font-bold text-gray-400 uppercase h-12 px-6">Due Date</TableHead>
									<TableHead className="text-xs font-bold text-gray-400 uppercase h-12 px-6 text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={6} className="h-64 text-center">
											<div className="flex flex-col items-center gap-3">
												<div className="w-10 h-10 border-4 border-[#FD6D3F] border-t-transparent rounded-full animate-spin"></div>
												<p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading tasks...</p>
											</div>
										</TableCell>
									</TableRow>
								) : filteredTasks.length === 0 ? (
									<TableRow>
										<TableCell colSpan={6} className="h-64 text-center">
											<div className="flex flex-col items-center gap-4">
												<div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
													<Clock className="text-gray-300 h-8 w-8" />
												</div>
												<div>
													<p className="text-gray-900 font-bold">No tasks found</p>
													<p className="text-gray-400 text-sm">Create a new task to get started.</p>
												</div>
											</div>
										</TableCell>
									</TableRow>
								) : (
									filteredTasks.map((task) => (
										<TableRow key={task.id} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50">
											<TableCell className="px-6 py-4">
												<div>
													<p className="font-bold text-gray-900 text-sm">{task.title}</p>
													<p className="text-xs text-gray-400 font-medium line-clamp-1">{task.description}</p>
												</div>
											</TableCell>
											<TableCell className="px-6 py-4">{getPriorityBadge(task.priority)}</TableCell>
											<TableCell className="px-6 py-4">
												<Select value={task.status} onValueChange={(v) => updateTaskStatus(task.id, v)}>
													<SelectTrigger className="w-auto h-8 bg-transparent border-none p-0 focus:ring-0 shadow-none font-bold hover:scale-105 transition-transform">
														{getStatusBadge(task.status)}
													</SelectTrigger>
													<SelectContent className="rounded-xl font-bold">
														<SelectItem value="PENDING">Pending</SelectItem>
														<SelectItem value="IN_PROGRESS">In Progress</SelectItem>
														<SelectItem value="COMPLETED">Completed</SelectItem>
														<SelectItem value="CANCELLED">Cancelled</SelectItem>
													</SelectContent>
												</Select>
											</TableCell>
											<TableCell className="px-6 py-4">
												<Select 
													value={task.assignedTo || "unassigned"} 
													onValueChange={(userId) => handleAssignTask(task.id, userId)}
												>
													<SelectTrigger className="w-full bg-transparent border-none p-0 focus:ring-0 shadow-none hover:bg-gray-100/50 rounded-lg transition-colors px-2 -ml-2">
														<div className="flex items-center gap-2">
															<div className="w-7 h-7 bg-primary/10 text-primary text-[10px] font-black rounded-lg flex items-center justify-center uppercase shrink-0">
																{task.assignedUser?.firstName?.[0] || "U"}
															</div>
															<span className="text-sm font-bold text-gray-700 truncate max-w-[120px]">
																{task.assignedUser ? `${task.assignedUser.firstName} ${task.assignedUser.lastName}` : "Unassigned"}
															</span>
														</div>
													</SelectTrigger>
													<SelectContent className="rounded-xl font-bold">
														<SelectItem value="unassigned" className="text-gray-400">Unassigned</SelectItem>
														{users.map((u) => (
															<SelectItem key={u.id} value={u.id}>
																{u.firstName} {u.lastName}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</TableCell>
											<TableCell className="px-6 py-4">
												<span className="text-sm font-bold text-gray-500">
													{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
												</span>
											</TableCell>
											<TableCell className="px-6 py-4 text-right">
												<Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary transition-all">
													Details
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
