"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
	const [open, setOpen] = useState(false);
	const { data: session, status } = useSession();

	const handleSignOut = () => {
		signOut({ callbackUrl: '/' });
	};

	return (
		<header className="w-full bg-white/95 backdrop-blur border-b border-black/[.06] sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
				<Link href="/" className="flex items-center gap-2">
					<Image src="/images/resources/logo.svg" alt="Quran Reading System" width={32} height={32} />
					<span className="font-semibold text-[18px] tracking-tight">Quran Reading System</span>
				</Link>
				<nav className="hidden md:flex items-center gap-6 text-[14px]">
					<Link href="/" className="hover:text-emerald-700">Home</Link>
					<Link href="/about" className="hover:text-emerald-700">About</Link>
					<Link href="/courses" className="hover:text-emerald-700">Courses</Link>
					<Link href="/contact" className="hover:text-emerald-700">Contact</Link>
				</nav>
				<div className="hidden md:flex items-center gap-3">
					{status === 'loading' ? (
						<div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
					) : session ? (
						<>
							<Link 
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								href={(session.user as any)?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} 
								className="text-[14px] px-4 py-2 rounded-md border border-emerald-600 text-emerald-700 hover:bg-emerald-50"
							>
								Dashboard
							</Link>
							<button 
								onClick={handleSignOut}
								className="text-[14px] px-4 py-2 rounded-md bg-secondary-600 text-white hover:bg-secondary-700"
							>
								Sign Out
							</button>
						</>
					) : (
						<>
							<Link href="/auth/signin" className="text-[14px] px-4 py-2 rounded-md border border-emerald-600 text-emerald-700 hover:bg-emerald-50">Login</Link>
							<Link href="/auth/signup" className="text-[14px] px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Join Now</Link>
						</>
					)}
				</div>
				<button aria-label="Menu" className="md:hidden inline-flex items-center p-2" onClick={() => setOpen(!open)}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
				</button>
			</div>
			{open && (
				<div className="md:hidden border-t border-black/[.06] bg-white">
					<div className="px-4 py-3 flex flex-col gap-3 text-[15px]">
						<Link href="/" onClick={() => setOpen(false)}>Home</Link>
						<Link href="/about" onClick={() => setOpen(false)}>About</Link>
						<Link href="/courses" onClick={() => setOpen(false)}>Courses</Link>
						<Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
						<div className="flex gap-3 pt-2">
							{status === 'loading' ? (
								<div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
							) : session ? (
								<>
									<Link 
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										href={(session.user as any)?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} 
										className="text-[14px] px-4 py-2 rounded-md border border-emerald-600 text-emerald-700"
										onClick={() => setOpen(false)}
									>
										Dashboard
									</Link>
									<button 
										onClick={() => {
											handleSignOut();
											setOpen(false);
										}}
										className="text-[14px] px-4 py-2 rounded-md bg-secondary-600 text-white"
									>
										Sign Out
									</button>
								</>
							) : (
								<>
									<Link href="/auth/signin" className="text-[14px] px-4 py-2 rounded-md border border-emerald-600 text-emerald-700">Login</Link>
									<Link href="/auth/signup" className="text-[14px] px-4 py-2 rounded-md bg-emerald-600 text-white">Join Now</Link>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</header>
	);
}


