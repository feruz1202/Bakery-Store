import { AiFillFire } from "react-icons/ai"
import { GiWheat } from "react-icons/gi"
import { TbTruckDelivery } from "react-icons/tb"


export default function About({ setPage }) {
    return (
        <>
            {/* HEADER */}
            <div className="w-full bg-[#3b2314] py-16 flex flex-col items-center">
                <h1 className="font-[Playfair_Display] text-[40px] text-[#c8973a]">Our Story</h1>
                <p className="text-white/70 text-[15px] px-5 max-w-md text-center mt-2">A family tradition rooted in craftsmanship, community, and the simple joy of a perfectly baked loaf. Since 1987.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-16 items-center px-10 lg:px-20 py-16 lg:pl-30">

                {/* LEFT COLUMN - photo */}
                <div className="w-full lg:w-[45%]">
                    <img src="./about-photo.jpg" className="w-full h-[400px] object-cover rounded-2xl" />
                </div>

                {/* RIGHT COLUMN - text */}
                <div className="w-full lg:w-[55%] flex flex-col">
                    <div className="flex flex-col">
                        <span className="text-[#c8973a] text-[13px] font-[DM_Sans]">EST. 1987</span>
                        <span className="text-[32px] font-[Playfair_Display] text-[#3b2314]">From a Small Kitchen to Your Neighbourhood</span>
                    </div>

                    <div className="text-[16px] font-[DM_Sans] text-[#7a6855] flex flex-col gap-3 mt-3">
                        <p className="max-w-xl">It all started when Marie Fontaine began baking sourdough in her Montmartre apartment, sharing loaves with neighbours who quickly became devoted fans. Her passion grew into a craft, and her craft grew into Farine & Co.</p>
                        <p className="max-w-xl">Today, our team of 18 bakers continues Marie's legacy with the same dedication: every single item is made by hand, every morning, using recipes passed down through three generations.</p>
                        <p className="max-w-xl">We believe great bread isn't just food — it's a ritual, a comfort, and a connection to something timeless.</p>
                    </div>

                    <div className="flex flex-row gap-10 mt-6">
                        <div className="flex flex-col">
                            <span className="font-[Playfair_Display] text-[32px] text-[#c8973a] font-bold">37+</span>
                            <span className="text-[13px] text-gray-400 font-[DM_Sans]">Years baking</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="font-[Playfair_Display] text-[32px] text-[#c8973a] font-bold">18</span>
                            <span className="text-[13px] text-gray-400 font-[DM_Sans]">Master bakers</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="font-[Playfair_Display] text-[32px] text-[#c8973a] font-bold">5k+</span>
                            <span className="text-[13px] text-gray-400 font-[DM_Sans]">Happy regulars</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* OUR VALUES */}
            {/* HEADING */}
            <div className="flex flex-col leading-[1] lg:leading-[1.5] px-10 lg:pl-30">
                <span className="mt-10 font-[DM_Sans] font-serif text-[#c8973a]">WHY CHOOSE US</span>
                <span className=" mt-3 lg:mt-0 font-[Playfair_Display] text-[40px]">The Farine Promise</span>
                <span className="mt-3 lg:mt-0 font-[DM_Sans] text-[#7a6855] text-[16px]">Quality you can taste in every single bite.</span>
            </div>

            {/* 3 CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-10 lg:pl-30 gap-5 max-w-[1650px] mt-8">
                {/* FIRST CARD */}
                <div className="border border-gray-300 flex flex-col items-center justify-center p-3 rounded-[20px]">
                    <AiFillFire size="2.5rem" />
                    <span className="mt-3 text-[18px]">Stone-Hearth Baked</span>
                    <span className="px-8 mt-3 text-[15px] text-[#7a6855]">100% compostable packaging and zero food waste through daily donation partnerships.</span>
                </div>

                {/* SECOND CARD */}
                <div className="border border-gray-300 flex flex-col items-center justify-center p-3 rounded-[20px]">
                    <GiWheat size="2.5rem" />
                    <span className="mt-3 text-[18px]">Heritage Grains</span>
                    <span className="px-8 mt-3 text-[15px] text-[#7a6855]">Proudly local. We source from farms within 50 miles and employ from the neighbourhood.</span>
                </div>

                {/* THIRD CARD */}
                <div className="border border-gray-300 flex flex-col items-center justify-center p-3 rounded-[20px]">
                    <TbTruckDelivery size="2.5rem" />
                    <span className="mt-3 text-[18px]">Same-Day Delivery</span>
                    <span className="px-8 mt-3 text-[15px] text-[#7a6855]">No shortcuts. Every step from flour to finish is done by human hands with care.</span>
                </div>

                {/* FOURTH CARD */}
                <div className="border border-gray-300 flex flex-col items-center justify-center p-3 rounded-[20px]">
                    <TbTruckDelivery size="2.5rem" />
                    <span className="mt-3 text-[18px]">Same-Day Delivery</span>
                    <span className="px-8 mt-3 text-[15px] text-[#7a6855]">We bake to bring people together. Every purchase supports a place of joy and belonging.</span>
                </div>
            </div>

            {/* PEOPLE BEHIND THE BAKERY */}
            {/* MEET THE BAKERS */}
            <div className="py-16 px-10 lg:pl-30">

                {/* HEADING */}
                <span className="text-[#c8973a] text-[13px] font-bold uppercase tracking-widest">Meet the Bakers</span>
                <h2 className="font-[Playfair_Display] text-[32px] text-[#3b2314] mt-2 mb-8">The People Behind the Bread</h2>

                {/* 3 CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* CARD 1 */}
                    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                        {/* EMOJI AREA */}
                        <div className="h-[200px] overflow-hidden">
                            <img
                                src="./employee.jpg"
                                alt="Marie Fontaine"
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                        {/* TEXT AREA */}
                        <div className="p-5 text-center">
                            <h3 className="font-bold text-[#3b2314] text-[16px]">Marie Fontaine</h3>
                            <p className="text-[#c8973a] text-[14px] font-semibold mt-1">Founder & Head Baker</p>
                            <p className="text-gray-400 text-[13px] mt-2">37 years of sourdough mastery</p>
                        </div>
                    </div>

                    {/* CARD 2 */}
                    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                        <div className="h-[200px] overflow-hidden">
                            <img
                                src="./employee.jpg"
                                alt="Marie Fontaine"
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                        <div className="p-5 text-center">
                            <h3 className="font-bold text-[#3b2314] text-[16px]">Pierre Dubois</h3>
                            <p className="text-[#c8973a] text-[14px] font-semibold mt-1">Pastry Chef</p>
                            <p className="text-gray-400 text-[13px] mt-2">Trained at Le Cordon Bleu, Paris</p>
                        </div>
                    </div>

                    {/* CARD 3 */}
                    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                        <div className="h-[200px] overflow-hidden">
                            <img
                                src="./employee.jpg"
                                alt="Marie Fontaine"
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                        <div className="p-5 text-center">
                            <h3 className="font-bold text-[#3b2314] text-[16px]">Leila Hassan</h3>
                            <p className="text-[#c8973a] text-[14px] font-semibold mt-1">Cake Artisan</p>
                            <p className="text-gray-400 text-[13px] mt-2">Award-winning wedding cake designer</p>
                        </div>
                    </div>
                </div>
            </div>


            {/* FOOTER */}
            <div className="bg-[#3b2314] h-fit">
                <div className="flex flex-col items-center justify-center gap-2 px-5">
                    <h2 className="text-[#e8b85a] text-[30px] font-[Playfair_Dsiplay] mt-4">Come Visit Us</h2>
                    <p className="text-[#ffffffb3] text-[16px]">12 Baker Street, London W1U 3BQ</p>
                    <p className="text-[#ffffffb3] text-[16px] text-center">Mon–Fri: 6AM–7PM · Sat: 6AM–8PM · Sun: 7AM–5PM</p>
                    <button onClick={() => setPage("shop")} className="bg-[#c8973a] text-[#3b2314] font-[DM_Sans] text-[16px] font-bold rounded-[5px] p-3 mt-2 cursor-pointer">Order Online</button>
                </div>
                <br />
                <br />
                <span className="flex items-center justify-center font-[Playfair_Dsiplay] text-[#e8b85a] text-[24px]">Farine & Co.</span>

                <div className="py-5">
                    <hr className="max-w-[1650px] border-top border-[1px] mx-30 mt-5 border-[#ffffff1a]" />
                    <p className="flex itemsc-center justify-center text-[#ffffff99] text-[14px] font-[DM_Sans] mt-3">&copy; 2026 Farine & Co. Bakery. All rights reserved.</p>
                </div>
            </div>
        </>
    )
}