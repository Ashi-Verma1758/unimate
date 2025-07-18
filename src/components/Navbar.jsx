import { Bell, Home, Settings, User } from 'lucide-react'
import React from 'react'

const Navbar = () => {
  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-2">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          {/*Logo*/}
          <div className="flex items-center spac-x-8">
            <div className="text-2xl font-bold text-blue-600 border-2 border-blue-600 px-3 py-1 rounded">
              UNimate
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className='text-gray-700 hover:text-blue-600 transition-colors'>
                <Home size={18} />
                <span>Home</span>
              </a>
              <a href="#" className='text-gray-700 hover:text-blue-600 transition-colors'>
                <Home size={18} />
                <span>Teams</span>
              </a>
              <a href="#" className='text-gray-700 hover:text-blue-600 transition-colors'>
                <Home size={18} />
                <span>About Us</span>
              </a>
              <a href="#" className='text-gray-700 hover:text-blue-600 transition-colors'>
              <Home size={18} />
              <span>Help me</span>
            </a>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 gap-2">
          <button className='p-2 text-gray-700 hover:text-blue-600 transition-colors'> 
            <User size={20} />
          </button>
          <button className='p-2 bg-red-600 text-white-700 hover:bg-red-900 transition-colors gap-2'> 
            <span>LogOut</span>
            <LogOut size={20} />
          </button>
         
          
        </div>

      </nav>
    </>
  )
}

export default Navbar;