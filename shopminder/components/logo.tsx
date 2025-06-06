"use client"

import { ShoppingCart, Bell } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        {/* Cercle principal avec gradient moderne */}
        <div
          className={`relative ${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-2 shadow-lg`}
        >
          <ShoppingCart className="w-full h-full text-white" />
        </div>

        {/* Icône de rappel (bell) en overlay */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-md">
          <Bell className="w-2.5 h-2.5 text-white" />
        </div>

        {/* Effet de brillance */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-xl"></div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <h1
            className={`font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ${textSizeClasses[size]} leading-none`}
          >
            ShopMinder
          </h1>
          <p className="text-xs text-gray-500 leading-none">Listes de courses intelligentes</p>
        </div>
      )}
    </div>
  )
}
