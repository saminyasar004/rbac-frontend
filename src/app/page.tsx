import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { Github, Mail, Terminal, Layers, Zap, Palette } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
	return (
		<div className="min-h-screen bg-background text-foreground transition-colors duration-300">
			{/* Header */}
			<header className="container mx-auto p-4 flex justify-between items-center">
				<div className="font-bold text-xl flex items-center gap-2">
					<Zap className="h-6 w-6 text-primary" />
					<span>Next.js Starter</span>
				</div>
				<div className="flex items-center gap-4">
					<Link
						href="https://github.com/saminyasar004"
						target="_blank"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						<Github className="h-5 w-5" />
					</Link>
					<ModeToggle />
				</div>
			</header>

			{/* Hero Section */}
			<main className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
				<div className="bg-muted/50 p-2 rounded-full mb-6 backdrop-blur-sm border border-border/50">
					<span className="text-sm font-medium px-3 py-1">
						v1.0.0 Public Template
					</span>
				</div>
				<h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
					Build Faster with <br /> Modern Defaults
				</h1>
				<p className="text-xl text-muted-foreground max-w-2xl mb-10">
					A comprehensive starter template for Next.js 15, TypeScript,
					Tailwind CSS v4, and shadcn/ui. Designed to get you up and
					running in seconds.
				</p>
				<div className="flex gap-4 flex-col sm:flex-row">
					<Button size="lg" asChild className="gap-2">
						<Link
							href="https://github.com/saminyasar004/next-ts-tailwind-boilerplate"
							target="_blank"
						>
							<Github className="h-4 w-4" /> Use this Template
						</Link>
					</Button>
					<Button size="lg" variant="outline" asChild>
						<Link href="#features">Explore Features</Link>
					</Button>
				</div>

				{/* Tech Stack Grid */}
				<div
					id="features"
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 w-full text-left"
				>
					<FeatureCard
						icon={<Terminal className="h-8 w-8 text-blue-500" />}
						title="Next.js 15"
						description="App Router, Server Components, and the latest features from Next.js."
					/>
					<FeatureCard
						icon={<Palette className="h-8 w-8 text-cyan-500" />}
						title="Tailwind CSS v4"
						description="Utility-first CSS framework for rapid UI development."
					/>
					<FeatureCard
						icon={
							<Layers className="h-8 w-8 text-slate-900 dark:text-slate-100" />
						}
						title="shadcn/ui"
						description="Re-usable components built using Radix UI and Tailwind CSS."
					/>
					<FeatureCard
						icon={<Zap className="h-8 w-8 text-yellow-500" />}
						title="TypeScript"
						description="Static type checking for better developer experience and code quality."
					/>
				</div>

				{/* Author Section */}
				<div className="mt-32 w-full max-w-4xl bg-card border rounded-2xl p-8 md:p-12 shadow-sm">
					<div className="flex flex-col md:flex-row items-center justify-between gap-8">
						<div className="text-left">
							<h2 className="text-3xl font-bold mb-2">
								Meet the Author
							</h2>
							<p className="text-muted-foreground mb-4">
								Crafted with love by Samin Yasar.
							</p>
							<div className="flex gap-4">
								<Button variant="outline" size="sm" asChild>
									<Link
										href="https://github.com/saminyasar004"
										target="_blank"
										className="gap-2"
									>
										<Github className="h-4 w-4" />{" "}
										@saminyasar004
									</Link>
								</Button>
								<Button variant="outline" size="sm" asChild>
									<Link
										href="mailto:yasarsamin57@gmail.com"
										className="gap-2"
									>
										<Mail className="h-4 w-4" /> Contact Me
									</Link>
								</Button>
							</div>
						</div>
						<div className="relative h-32 w-32 rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-slate-800">
							<Image
								src="https://avatars.githubusercontent.com/u/67989825?v=4"
								alt="Samin Yasar"
								fill
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="border-t py-8 mt-20">
				<div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
					<p>
						&copy; {new Date().getFullYear()} Next.js Starter
						Template. Open source under MIT License.
					</p>
				</div>
			</footer>
		</div>
	);
}

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<Card className="bg-card/50 backdrop-blur-sm border-muted transition-all hover:border-primary/50 hover:shadow-md">
			<CardHeader>
				<div className="mb-2">{icon}</div>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<CardDescription className="text-base">
					{description}
				</CardDescription>
			</CardContent>
		</Card>
	);
}
