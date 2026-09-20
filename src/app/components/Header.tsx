'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      {/* Top Bar - Hidden on mobile */}
      <div className="topbar hidden md:block">
        <div className="container">
          <div className="topbar-content">
            <div className="topbar-contact">
              <a href="tel:+923215507499">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                +92 321 5507499
              </a>
              <a href="tel:+923145683317">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                +92 314 5683317
              </a>
              <a href="mailto:info@quranreadingsystem.com">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                info@quranreadingsystem.com
              </a>
            </div>
            
            <ul className="social-links">
              <li><Link href="/about"><span>📘</span></Link></li>
              <li><Link href="/about"><span>🐦</span></Link></li>
              <li><Link href="/about"><span>💼</span></Link></li>
              <li><Link href="/about"><span>📷</span></Link></li>
            </ul>
          </div>
        </div>
      </div>
      
             {/* Main Navigation */}
       <div className="navbar">
         <div className="container">
           <div className="nav-content">
             {/* Logo - Left side */}
             <Link href="/" className="logo" aria-label="Quran Reading System Home">
               <Image src="/images/logo.png" alt="Quran Reading System" width={120} height={28} priority />
             </Link>
             
             {/* Desktop Navigation Menu */}
             <ul className="nav-menu desktop-menu">
               <li><Link href="/">Home</Link></li>
               <li><Link href="/about">About</Link></li>
               <li><Link href="/courses">Courses</Link></li>
               <li><Link href="/contact">Contact</Link></li>
             </ul>
             
             {/* Desktop Buttons */}
             <div className="search-section desktop-search">
               <div className="auth-buttons flex gap-3">
                {session?.user ? (
                  <Link href={(session.user as { role?: string })?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="btn btn-primary">Dashboard</Link>
                ) : (
                  <>
                    <Link href="/auth/signin" className="btn btn-outline">Login</Link>
                    <Link href="/auth/signup" className="btn btn-primary">Join Now</Link>
                  </>
                )}
               </div>
             </div>
             
             {/* Mobile Menu Toggle - Right side */}
             <button 
               className="mobile-menu-toggle"
               onClick={toggleMenu}
               aria-label="Toggle menu"
             >
               <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
               <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
               <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
             </button>
           </div>
          
          {/* Mobile Menu Dropdown */}
          <div className={`mobile-menu-dropdown ${isMenuOpen ? 'open' : ''}`}>
            <ul className="mobile-nav-menu">
              <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
              <li><Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
              <li><Link href="/courses" onClick={() => setIsMenuOpen(false)}>Courses</Link></li>
              <li><Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
            </ul>
            
                         <div className="mobile-search-section">
               <div className="auth-buttons flex gap-3">
                {session?.user ? (
                  <Link href={(session.user as { role?: string })?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="btn btn-primary mobile-btn" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                ) : (
                  <>
                    <Link href="/auth/signin" className="btn btn-outline mobile-btn" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    <Link href="/auth/signup" className="btn btn-primary mobile-btn" onClick={() => setIsMenuOpen(false)}>Join Now</Link>
                  </>
                )}
               </div>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
