import React from 'react';
import { Lightbulb, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Lightbulb className="h-6 w-6 mr-2" />
            <span className="font-bold text-xl">StartupValidator</span>
          </div>
          
          <div className="flex space-x-4 items-center mb-4 md:mb-0">
            <a href="#" className="hover:text-blue-400 transition duration-300">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-blue-400 transition duration-300">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-blue-400 transition duration-300">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
          
          <div className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} StartupValidator. All rights reserved.
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>Validate your startup ideas with honest feedback from the community.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;