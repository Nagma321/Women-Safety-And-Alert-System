import React from 'react'
import { Home, Map, MessageSquare, User } from 'lucide-react'
import { Link } from 'react-router-dom'

function BottomNav() {
  return (
    <div className="w-full sticky bottom-0 z-20 bg-white shadow-lg md:flex md:items-center md:justify-center">
        <div className="w-full border-2 border-red-300 rounded-lg p-4 flex items-center justify-between md:w-[50%]">
          <Link
            to={"/HomePage"}
            className="flex items-center justify-center flex-col gap-2 hover:text-red-500 transition-colors"
          >
            <Home className="w-5 h-5 text-red-400" />
            <span className="font-medium text-sm text-gray-600">Home</span>
          </Link>

          <Link
            to={"/map"}
            className="flex items-center justify-center flex-col gap-2 hover:text-red-500 transition-colors"
          >
            <Map className="w-5 h-5 text-red-400" />
            <span className="font-medium text-sm text-gray-600">Map</span>
          </Link>

          <Link
            to={"/reviews"}
            className="flex items-center justify-center flex-col gap-2 hover:text-red-500 transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-red-400" />
            <span className="font-medium text-sm text-gray-600">Reviews</span>
          </Link>

          <Link
            to={"/profile"}
            className="flex items-center justify-center flex-col gap-2 hover:text-red-500 transition-colors"
          >
            <User className="w-5 h-5 text-red-400" />
            <span className="font-medium text-sm text-gray-600">Profile</span>
          </Link>
        </div>
      </div>
  )
}

export default BottomNav