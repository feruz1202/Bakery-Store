import { useState } from "react"
import { FaCartShopping } from "react-icons/fa6"

export default function Navbar({ setPage, cartCount, user, setUser }) {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="sticky top-0 z-100 h-[8vh] bg-[#fffdf9] flex items-center justify-between px-10">

      {/* LOGO */}
      <span
        onClick={() => setPage("home")}
        className="font-[Playfair_Display] text-[18px] lg:text-[25px] cursor-pointer"
      >
        FARINE <strong className="text-[#c8973a] italic">&</strong> CO
      </span>

      {/* NAV LINKS */}
      <div className="flex gap-5 hidden md:flex">
        <span onClick={() => setPage("home")} className="font-[DM_Sans] cursor-pointer">Home</span>
        <span onClick={() => setPage("shop")} className="font-[DM_Sans] cursor-pointer">Shop</span>
        <span onClick={() => setPage("about")} className="font-[DM_Sans] cursor-pointer">About</span>
        <span onClick={() => setPage("login")} className="font-[DM_Sans] cursor-pointer">Login</span>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">

        {/* ACCOUNT — only shows when logged in */}
        {user && (
          <div className="relative">

            {/* ACCOUNT BUTTON */}
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-[#f2ede3] border border-gray-200 rounded-full px-4 py-2 text-[14px] font-semibold text-[#3b2314] cursor-pointer hover:border-[#c8973a] transition"
            >
              👤 {user.name}
            </button>

            {/* DROPDOWN */}
            {showDropdown && (
              <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg p-2 w-[180px] z-50">
                <p className="text-[12px] text-gray-400 px-3 py-1 truncate">{user.email}</p>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={() => {
                    setUser(null)
                    setShowDropdown(false)
                    setPage("home")
                  }}
                  className="w-full text-left px-3 py-2 text-[13px] text-red-400 hover:bg-red-50 rounded-lg font-semibold"
                >
                  Sign Out
                </button>
              </div>
            )}

          </div>
        )}

        {/* CART BUTTON */}
        <button
          onClick={() => setPage("cart")}
          className="flex items-center gap-2 h-10 md:h-13 bg-[#3b2314] px-4 rounded-[10px] text-white cursor-pointer relative"
        >
          <FaCartShopping size="1.2rem" />
          <span className="text-[15px]">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#c8973a] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

      </div>
    </div>
  )
}