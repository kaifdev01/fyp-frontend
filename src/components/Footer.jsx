import Link from 'next/link';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold">WorkDeck</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Connect talented freelancers with amazing projects. Build your career or find the perfect talent for your next project.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Freelancers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/find-work" className="hover:text-white transition-colors">Find Work</Link></li>
              <li><Link href="/how-to-freelance" className="hover:text-white transition-colors">How to Freelance</Link></li>
              <li><Link href="/success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Clients</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/find-talent" className="hover:text-white transition-colors">Find Talent</Link></li>
              <li><Link href="/post-project" className="hover:text-white transition-colors">Post a Project</Link></li>
              <li><Link href="/enterprise" className="hover:text-white transition-colors">Enterprise</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 WorkDeck. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/support" className="text-gray-400 hover:text-white text-sm transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}