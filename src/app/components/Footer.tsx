import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <div className="footer-title">
              <span className="text-secondary-600">■</span> Quran Reading System.
            </div>
            <p className="text-gray-300 mb-4">
              Dedicated to excellence in Quranic education and Islamic studies. 
              We provide comprehensive learning programs for students of all ages 
              in a nurturing spiritual environment.
            </p>
            <ul className="footer-links">
              <li><a href="tel:+923215507499">+92 321 5507499</a></li>
              <li><a href="tel:+923145683317">+92 314 5683317</a></li>
              <li><a href="mailto:info@quranreadingsystem.com">info@quranreadingsystem.com</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="footer-title">About Us</h3>
            <ul className="footer-links">
              <li><Link href="/about">About Academy</Link></li>
              <li><Link href="/courses">Quran Courses</Link></li>
              <li><Link href="/courses">Islamic Studies</Link></li>
              <li><Link href="/about">Our Teachers</Link></li>
              <li><Link href="/contact">Join as Teacher</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="footer-title">Useful Links</h3>
            <ul className="footer-links">
              <li><Link href="/courses">Quran Library</Link></li>
              <li><Link href="/courses">Islamic Resources</Link></li>
              <li><Link href="/about">Partners</Link></li>
              <li><Link href="/about">News & Updates</Link></li>
              <li><Link href="/contact">FAQ</Link></li>
              <li><Link href="/courses">Learning Guides</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="footer-title">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Get the latest Quran Reading System news and Islamic education updates
            </p>
            <div className="newsletter-input">
              <input type="email" placeholder="Enter your email" />
              <button className="newsletter-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} <Link href="/" className="text-white">Quran Reading System.</Link> All Rights Reserved</div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Follow us</span>
            <ul className="social-links">
              <li>
                <Link href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z"/></svg>
                </Link>
              </li>
              <li>
                <Link href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 3h3.8l5.2 6.9L17.6 3H21l-7.1 9.3L21 21h-3.8l-5.4-7.2L6.4 21H3l7.5-9.7L3 3Z"/></svg>
                </Link>
              </li>
              <li>
                <Link href="https://whatsapp.com/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Channel">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>
                </Link>
              </li>
              <li>
                <Link href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.6.2 1 .4 1.5.8.5.4.8.9 1 1.5.2.4.3 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1.1-1 1.5-.4.4-.9.7-1.5.9-.4.2-1.1.3-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1.1-.5-1.5-.9-.4-.4-.7-.9-.9-1.5-.2-.4-.3-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.3.2-.6.5-1.1.9-1.5.4-.4.9-.7 1.5-.9.4-.2 1.1-.3 2.3-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.2 0-3.6 0-4.8.1-1.1.1-1.7.2-2 .3-.5.2-.8.3-1 .6-.3.3-.5.6-.6 1-.1.3-.2.9-.3 2-.1 1.2-.1 1.6-.1 4.8s0 3.6.1 4.8c.1 1.1.2 1.7.3 2 .1.4.3.7.6 1 .3.3.6.5 1 .6.3.1.9.2 2 .3 1.2.1 1.6.1 4.8.1s3.6 0 4.8-.1c1.1-.1 1.7-.2 2-.3.4-.1.7-.3 1-.6.3-.3.5-.6.6-1 .1-.3.2-.9.3-2 .1-1.2.1-1.6.1-4.8s0-3.6-.1-4.8c-.1-1.1-.2-1.7-.3-2-.1-.4-.3-.7-.6-1-.3-.3-.6-.5-1-.6-.3-.1-.9-.2-2-.3-1.2-.1-1.6-.1-4.8-.1Zm0 3.3A6.7 6.7 0 1 1 12 20a6.7 6.7 0 0 1 0-12.7Zm0 11A4.3 4.3 0 1 0 12 7.3a4.3 4.3 0 0 0 0 8.6Zm6.9-11.9a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0Z"/></svg>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


