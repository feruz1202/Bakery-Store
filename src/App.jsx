import { FaCartShopping } from "react-icons/fa6";
import { GiWheat } from "react-icons/gi";
import { AiFillFire } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";
import Navbar from "./navbar.jsx";

export default function App() {
  return (
    <>
      <Navbar></Navbar>
      {/* HERO SECTION */}
      <div className="w-full h-fit lg:h-[560px] bg-[#f2ede3] flex items-center">
        <div className="flex flex-row gap-20 w-full items-center">
          {/* LEFT COLUMN */}
          <div className="flex flex-row w-[50%] lg:pl-20">
            <div className="flex flex-col px-10 mt-7">
              <span className="bg-[#e8b85a] text-[12px] font-[DM_Sans] p-2 rounded-[20px] w-fit">BAKED FRESHLY DAILY</span>
              <h1 className="text-[56px] max-w-md leading-[1.2] mt-4 font-[Playfair_Display]">Artisan Bread & <strong className="text-[#c8973a]">Pastries</strong> Crafted with Love</h1>
              <p className="text-[#7a6855] text-[17px] max-w-md sm:max-w-lg mt-4">From our stone-hearth ovens to your table — every loaf, croissant, and cake is made with heritage grains and time-honoured techniques since 1987.</p>
              <div className="flex flex-row gap-5 mt-5 mb-5">
                <button className="mb-3 font-bold bg-[#3b2314] text-white p-3 text-[15px] rounded-[16px] w-[120px] hover:bg-[#995F2F]">Shop Now</button>
                <button className="mb-3 font-bold border border-[#3b2314] p-3 rounded-[16px] w-[120px] hover:bg-[#3b2314] hover:text-white">Our Story</button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-[50%] h-[450px] px-10">
            <img
              className="hidden md:flex w-full h-full object-cover rounded-2xl"
              src="images/yeh-xintong-go3DT3PpIw4-unsplash.jpg"
              alt="MAIN PAGE PHOTO"
            />
          </div>
        </div>
      </div>


      {/* WHY US AND BESTSELLERS SECTION */}
      <div className="min-h-screen bg-[#FFF6F6]">
        {/* HEADING */}
        <div className="flex flex-col leading-[1] lg:leading-[1.5] px-10 lg:pl-30">
          <span className="mt-10 font-[DM_Sans] font-serif text-[#c8973a]">WHY CHOOSE US</span>
          <span className=" mt-3 lg:mt-0 font-[Playfair_Display] text-[40px]">THE Farine Promise</span>
          <span className="mt-3 lg:mt-0 font-[DM_Sans] text-[#7a6855] text-[16px]">Quality you can taste in every single bite.</span>
        </div>

        {/* 3 CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-10 lg:pl-30 gap-5 max-w-[1650px] mt-8">
          {/* FIRST CARD */}
          <div className="border border-gray-300 flex flex-col items-center justify-center p-3 rounded-[20px]">
            <AiFillFire size="2.5rem" />
            <span className="mt-3 text-[18px]">Stone-Hearth Baked</span>
            <span className="px-8 mt-3 text-[15px] text-[#7a6855]">Our wood-fired stone ovens create that perfect crust that no modern oven can replicate.</span>
          </div>

          {/* SECOND CARD */}
          <div className="border border-gray-300 flex flex-col items-center justify-center p-3 rounded-[20px]">
            <GiWheat size="2.5rem" />
            <span className="mt-3 text-[18px]">Heritage Grains</span>
            <span className="px-8 mt-3 text-[15px] text-[#7a6855]">We source only organic, stone-milled heritage flours from local farms for deeper flavour.</span>
          </div>

          {/* THIRD CARD */}
          <div className="border border-gray-300 flex flex-col items-center justify-center p-3 rounded-[20px]">
            <TbTruckDelivery size="2.5rem" />
            <span className="mt-3 text-[18px]">Same-Day Delivery</span>
            <span className="px-8 mt-3 text-[15px] text-[#7a6855]">Order before 10 AM and receive fresh-baked goods at your doorstep by afternoon.</span>
          </div>
        </div>

        {/* HEADING */}
        <div className="flex flex-col leading-[1] lg:leading-[1.5] px-10 lg:pl-30">
          <span className="mt-10 font-[DM_Sans] font-serif text-[#c8973a]">Our Favourites</span>
          <span className=" mt-3 lg:mt-0 font-[Playfair_Display] text-[40px]">The Best Sellers</span>
          <span className="mt-3 lg:mt-0 font-[DM_Sans] text-[#7a6855] text-[16px]">Tried, Loved and Ordered again - every week</span>
        </div>

        {/* BESTSELLER CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-10 lg:pl-30 max-w-[1650px] mt-8 gap-5 flex-wrap ">
          {/* FIRST CARD */}
          <div className="flex flex-col w-[330px] min-h-[300px] rounded-2xl border border-gray-200 overflow-hidden bg-white">
            {/* IMAGE AREA */}
            <div className="relative h-[180px]">
              {/* BADGE - top left */}
              <span className="absolute top-3 left-3 bg-[#F5C842] text-[#3b2314] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide z-10">
                Bestseller
              </span>
              {/* FULL IMAGE */}
              <img
                src="images/sourdough.jpg"
                alt="Classic Sourdough"
                className="w-full h-full object-cover"
              />
            </div>
            {/* CONTENT AREA */}
            <div className="flex flex-col p-4 gap-2">
              <h3 className="font-bold text-[#1a1a1a] text-[16px]">
                Classic Sourdough
              </h3>
              <p className="text-gray-500 text-[13px] leading-snug">
                Slow-fermented 48h, heritage wheat, perfect crust
              </p>
              <div className="flex flex-row items-center justify-between mt-2">
                <span className="font-bold text-[#1a1a1a] text-[16px]">£6.50</span>
                <button className="bg-[#3b2314] text-white text-[13px] font-semibold px-4 py-2 rounded-xl hover:bg-[#5a3520]">
                  + Add
                </button>
              </div>
            </div>
          </div>

          {/* SECOND CARD */}
          <div className="flex flex-col w-[330px] rounded-2xl border border-gray-200 overflow-hidden bg-white">
            <div className="relative h-[180px]">
              {/* BADGE - top left */}
              <span className="absolute top-3 left-3 bg-[#F5C842] text-[#3b2314] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide z-10">
                New
              </span>
              {/* FULL IMAGE */}
              <img
                src="images/crossaint.jpg"
                alt="Butter Crossaint"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col p-4 gap-2">
              <span className="font-bold text-[#1a1a1a] text-[16px]">Butter Crossaint</span>
              <p className="text-gray-500 text-[13px] leading-snug">French laminated dough, pure Irish butter, 72 layers</p>

              <div className="flex flex-row justify-between items-center mt-2">
                <span className="font-bold text-[#1a1a1a] text-[16px]">£12</span>
                <button className="bg-[#3b2314] text-white text-[13px] font-semibold px-4 py-2 rounded-xl hover:bg-[#5a3520]">
                  + Add
                </button>
              </div>
            </div>
          </div>

          {/* THIRD CARD */}
          <div className="flex flex-col w-[330px] rounded-2xl border border-gray-200 overflow-hidden bg-white">
            <div className="relative h-[180px]">
              {/* BADGE - top left */}
              <span className="absolute top-3 left-3 bg-[#F5C842] text-[#3b2314] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide z-10">
                Bestseller
              </span>
              {/* FULL IMAGE */}
              <img
                src="images/cupcake.jpg"
                alt="Butter Crossaint"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col p-4 gap-2">
              <span className="font-bold text-[#1a1a1a] text-[16px]">Cupcake</span>
              <p className="text-gray-500 text-[13px] leading-snug">Zingy curd, buttery shortcrust, Italian meringue</p>

              <div className="flex flex-row justify-between items-center mt-2">
                <span className="font-bold text-[#1a1a1a] text-[16px]">£8.99</span>
                <button className="bg-[#3b2314] text-white text-[13px] font-semibold px-4 py-2 rounded-xl hover:bg-[#5a3520]">
                  + Add
                </button>
              </div>
            </div>
          </div>

          {/* FOURTH CARD */}
          <div className="flex flex-col w-[330px] rounded-2xl border border-gray-200 overflow-hidden bg-white mb-5">
            <div className="relative h-[180px]">
              {/* BADGE - top left */}
              <span className="absolute top-3 left-3 bg-[#F5C842] text-[#3b2314] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide z-10">
                New
              </span>
              {/* FULL IMAGE */}
              <img
                src="images/crossaint.jpg"
                alt="Butter Crossaint"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col p-4 gap-2">
              <span className="font-bold text-[#1a1a1a] text-[16px]">Butter Crossaint</span>
              <p className="text-gray-500 text-[13px] leading-snug">French laminated dough, pure Irish butter, 72 layers</p>

              <div className="flex flex-row justify-between items-center mt-2">
                <span className="font-bold text-[#1a1a1a] text-[16px]">£12</span>
                <button className="bg-[#3b2314] text-white text-[13px] font-semibold px-4 py-2 rounded-xl hover:bg-[#5a3520]">
                  + Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
