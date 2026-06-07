import { useState } from "react"
import { FaCartShopping } from "react-icons/fa6"
import { RiMenu3Line, RiCloseLine } from "react-icons/ri"

export default function Navbar({ setPage, cartCount, user, setUser }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const navigate = (page) => {
    setPage(page)
    setShowSidebar(false)
  }

  return (
    <>
      {/* MAIN NAVBAR */}
      <div className="sticky top-0 z-50 h-[8vh] bg-[#fffdf9] flex items-center justify-between px-6 lg:px-10 border-b border-gray-100">

        {/* LOGO */}
        <span
          onClick={() => navigate("home")}
          className="font-[Playfair_Display] text-[18px] lg:text-[25px] cursor-pointer"
        >
          FARINE <strong className="text-[#c8973a] italic">&</strong> CO
        </span>

        {/* NAV LINKS — desktop only */}
        <div className="hidden md:flex gap-5">
          <span onClick={() => navigate("home")} className="font-[DM_Sans] cursor-pointer hover:text-[#c8973a] transition">Home</span>
          <span onClick={() => navigate("shop")} className="font-[DM_Sans] cursor-pointer hover:text-[#c8973a] transition">Shop</span>
          <span onClick={() => navigate("about")} className="font-[DM_Sans] cursor-pointer hover:text-[#c8973a] transition">About</span>
          <span onClick={() => navigate("login")} className="font-[DM_Sans] cursor-pointer hover:text-[#c8973a] transition">Login</span>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* ACCOUNT — only when logged in */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-[#f2ede3] border border-gray-200 rounded-full px-4 py-2 text-[14px] font-semibold text-[#3b2314] cursor-pointer hover:border-[#c8973a] transition"
              >
                👤 {user.name}
              </button>
              {showDropdown && (
                <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg p-2 w-[180px] z-50">
                  <p className="text-[12px] text-gray-400 px-3 py-1 truncate">{user.email}</p>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={() => { setUser(null); setShowDropdown(false); setPage("home") }}
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
            className="flex items-center gap-2 h-10 bg-[#3b2314] px-4 rounded-[10px] text-white cursor-pointer relative"
          >
            <FaCartShopping size="1.2rem" />
            <span className="text-[15px]">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#c8973a] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* HAMBURGER — mobile only */}
          <button
            onClick={() => setShowSidebar(true)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-[#3b2314]"
          >
            <RiMenu3Line size="1.4rem" />
          </button>

        </div>
      </div>

      {/* OVERLAY — dark background behind sidebar */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 bg-black/40 z-50 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div className={`fixed top-0 right-0 h-full w-[280px] bg-white z-50 shadow-2xl transform transition-transform duration-300 md:hidden
        ${showSidebar ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <span className="font-[Playfair_Display] text-[20px] text-[#3b2314]">
            FARINE <strong className="text-[#c8973a] italic">&</strong> CO
          </span>
          <button
            onClick={() => setShowSidebar(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-[#3b2314]"
          >
            <RiCloseLine size="1.3rem" />
          </button>
        </div>

        {/* SIDEBAR LINKS */}
        <div className="flex flex-col px-6 py-6 gap-2">
          {[
            { label: "Home", page: "home" },
            { label: "Shop", page: "shop" },
            { label: "About", page: "about" },
            { label: "Login", page: "login" },
          ].map(item => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className="text-left px-4 py-3 rounded-xl font-[DM_Sans] font-semibold text-[#3b2314] hover:bg-[#f2ede3] hover:text-[#c8973a] transition text-[16px]"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* SIDEBAR FOOTER */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 px-6 py-5 border-t border-gray-100">
            <p className="text-[13px] text-gray-400 mb-3">Signed in as {user.email}</p>
            <button
              onClick={() => { setUser(null); setShowSidebar(false); setPage("home") }}
              className="w-full py-2 text-red-400 border border-red-200 rounded-xl text-[14px] font-semibold hover:bg-red-50 transition"
            >
              Sign Out
            </button>
          </div>
        )}

      </div>
    </>
  )
}