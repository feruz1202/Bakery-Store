import { FaCartShopping } from "react-icons/fa6";

export default function Navbar({ setPage, cartCount }) {
    return (
        <>
            <div className="sticky top-0 z-100 h-[8vh] bg-[#fffdf9] flex items-center justify-between px-10 ">
                <span className="font-[Playfair_Display] text-[18px] lg:text-[25px] cursor-pointer">FARINE <strong className="text-[#c8973a] italic">&</strong> CO</span>
                <div className="flex gap-5 hidden md:flex">
                    <span onClick={() => setPage("home")} className="font-[DM_Sans] relative cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[3px] after:bg-[#c8973a] after:transition-all after:duration-300 hover:after:w-full">HOME</span>
                    <span onClick={() => setPage("shop")} className="font-[DM_Sans] relative cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[3px] after:bg-[#c8973a] after:transition-all after:duration-300 hover:after:w-full">SHOP</span>
                    <span onClick={() => setPage("about")} className="font-[DM_Sans] relative cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[3px] after:bg-[#c8973a] after:transition-all after:duration-300 hover:after:w-full">ABOUT</span>
                    <span onClick={() => setPage("login")} className="font-[DM_Sans] relative cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[3px] after:bg-[#c8973a] after:transition-all after:duration-300 hover:after:w-full">LOGIN</span>
                </div>
                <button className="flex w-26 h-10 md:h-13 bg-[#3b2314] p-3 gap-2 text-[22px] rounded-[10px] text-white items-center cursor-pointer relative">
                    <FaCartShopping size="1.5rem" />
                    <span className="text-[16px]">Cart</span>

                    {/* COUNTER BADGE */}
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[#c8973a] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>

        </>
    );
}