import React from 'react';


const Footer = () => {
  return (
    <footer className="w-full bg-panel text-text mt-8 py-4 px-6 flex flex-col md:flex-row justify-between items-center gap-4">
      
      {}
      <a
        href="https://www.lu.lv/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-light text-text hover:no-underline"
        style={{ textDecoration: 'none' }}
      >
        Made for LU
      </a>

      {}
      {}
      {}
      {}
      <div className="w-full flex flex-col sm:flex-row gap-3">
        {['email', 'phone number', 'Telegram', 'Discord'].map((label) => (
          <a
            key={label}
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // rickroll. Sorry for this. This works on every page
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-black px-4 py-2 rounded-xl flex-grow text-center no-underline hover:no-underline"
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
