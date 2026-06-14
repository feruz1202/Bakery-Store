import { useState, useEffect } from "react"
import { FaCartShopping } from "react-icons/fa6";
import { HiArrowNarrowRight } from "react-icons/hi";
import { GiWheat } from "react-icons/gi";
import { AiFillFire } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";
import Navbar from "./components/navbar.jsx";
import Shop from "./pages/shop.jsx";
import Cart from "./pages/cart.jsx"
import { products } from "./data/productdata"
import ProductCard from "./components/productcard"
import About from "./pages/about.jsx"
import Login from "./pages/login.jsx"
import API_URL from "./config"

export default function App() {
  console.log("API URL:", import.meta.env.VITE_API_URL)
  // ADD at top of App function
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setFeaturedProducts(data.slice(0, 4)))
  }, [])

  // Then in home best sellers section replace:
  // products.slice(0, 4).map(...)
  // With:
  // featuredProducts.map(...)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data._id) {
            setUser({
              name: data.firstName,
              email: data.email,
              role: data.role,
              token
            })
          }
        })
        .catch(() => localStorage.removeItem("token"))
    }
  }, [])


  const [page, setPage] = useState("home")
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(null)
  const addToCart = (product) => {
    setCart(prevCart => {
      // check if product already exists in cart
      const exists = prevCart.find(item => item._id === product._id)

      if (exists) {
        // if yes, just increase quantity
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // if no, add new item with quantity 1
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  const navigate = (page) => {
    setPage(page)
    window.scrollTo(0, 0)
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId))
  }
  return (
    <>
      <Navbar
        setPage={navigate}        // ← change setPage to navigate
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        user={user}
        setUser={setUser}
      />

      {page === "shop" && <Shop addToCart={addToCart} removeFromCart={removeFromCart} cart={cart} />}
      {page === "cart" && <Cart cart={cart} setCart={setCart} setPage={navigate} user={user} />}
      {page === "about" && <About setPage={navigate} />}
      {page === "login" && <Login setPage={navigate} setUser={setUser} />}

      {page === "home" && (
        <>
          {/* HERO SECTION */}
          <div className="w-full h-fit lg:h-[560px] bg-[#f2ede3] flex items-center overflow-x-hidden">
            <div className="flex flex-row gap-20 w-full items-center">
              {/* LEFT COLUMN */}
              <div className="flex flex-row w-[50%] lg:pl-50">
                <div className="flex flex-col px-15 lg:px-10 mt-7">
                  <span className="bg-[#e8b85a] text-[12px] font-[DM_Sans] p-2 rounded-[20px] w-fit">BAKED FRESHLY DAILY</span>
                  <h1 className="text-[56px] max-w-md leading-[1.2] mt-4 font-[Playfair_Display]">Artisan Bread <strong className="text-[#c8973a]">& Pastries</strong> Crafted with Love</h1>
                  <p className="text-[#7a6855] text-[17px] max-w-md sm:max-w-lg mt-4">From our stone-hearth ovens to your table — every loaf, croissant, and cake is made with heritage grains and time-honoured techniques since 1987.</p>
                  <div className="flex flex-row gap-5 mt-5 mb-5">
                    <button onClick={() => setPage("shop")} className="mb-3 font-bold bg-[#3b2314] text-white p-3 text-[15px] rounded-[16px] w-[120px] hover:bg-[#995F2F]">Shop Now</button>
                    <button onClick={() => setPage("about")} className="mb-3 font-bold border border-[#3b2314] p-3 rounded-[16px] w-[120px] hover:bg-[#3b2314] hover:text-white">Our Story</button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="w-[50%] h-[450px] px-10 lg:mr-45">
                <img
                  className="hidden md:flex w-full h-full object-cover rounded-2xl"
                  src="/yeh-xintong-go3DT3PpIw4-unsplash.jpg"
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
              <span className=" mt-3 lg:mt-0 font-[Playfair_Display] text-[40px]">The Farine Promise</span>
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
              {featuredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  cart={cart}
                />
              ))}
            </div>
            <div className="flex items-center justify-center mt-10">
              <button onClick={() => setPage("shop")} className="flex mb-7 border border-[#3b2314] p-3 rounded-[16px] w-fit hover:bg-[#3b2314] hover:text-white gap-3 cursor-pointer text-[#3b2314] font-[DM_Sans]">View All Products<HiArrowNarrowRight size="1.5rem" /></button>
            </div>
          </div>
          {/* WHAT OUR CUSTOMERS SAY */}
          <div className="bg-[#3b2314] w-full h-fit py-10">
            <span className="font-[Playfair_Display] text-[33px] text-[#e8b85a] flex items-center justify-center px-10">What Our Customers Say</span>
            {/* FEEDBACK CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-10 lg:pl-30 flex items-center justify-center gap-7 max-w-[1650px] mt-10">
              {/* CARD 1 */}
              <div className="flex flex-col border border-gray-500 gap-5 p-5 bg-[#ffffff12] rounded-[20px]">
                <span className="text-[#c8973a] text-[18px] tracking-wide font-bold">★★★★★</span>
                <span className="font-[DM_Sans] text-[15px] text-[#ffffffd9] italic">"The sourdough is absolutely life-changing. I've ordered every week for the past two years!"</span>
                <span className="text-[#c8973a] text-[14px] font-[DM_Sans] font-bold">Alex Spaghetti</span>
              </div>

              {/* CARD 2 */}
              <div className="flex flex-col border border-gray-500 gap-5 p-5 bg-[#ffffff12] rounded-[20px]">
                <span className="text-[#c8973a] text-[18px] tracking-wide font-bold">★★★★★</span>
                <span className="font-[DM_Sans] text-[15px] text-[#ffffffd9] italic">"The sourdough is absolutely life-changing. I've ordered every week for the past two years!"</span>
                <span className="text-[#c8973a] text-[14px] font-[DM_Sans] font-bold">Alex Spaghetti</span>
              </div>

              {/* CARD 3 */}
              <div className="flex flex-col border border-gray-500 gap-5 p-5 bg-[#ffffff12] rounded-[20px]">
                <span className="text-[#c8973a] text-[18px] tracking-wide font-bold">★★★★★</span>
                <span className="font-[DM_Sans] text-[15px] text-[#ffffffd9] italic">"The sourdough is absolutely life-changing. I've ordered every week for the past two years!"</span>
                <span className="text-[#c8973a] text-[14px] font-[DM_Sans] font-bold">Alex Spaghetti</span>
              </div>
            </div>
          </div>

          {/* EMAIL SUBSCRIPTION */}
          <div className="bg-[#f2ede3] w-full h-fit py-10 px-5">
            <div className="flex flex-col items-center justify-center p-3 ">
              <span className="font-[Playfair_Display] text-[30px] text-[#3b2314] text-bold">Get Fresh Deals Weekly</span>
              <p className="text-[#7a6855] font-[DM_Sans] text-[16px] max-w-md text-center mt-3">Subscribe for early access to seasonal specials, new items, and exclusive subscriber discounts.</p>
              <div className="flex flex-row gap-5 mt-5">
                <input type="text" placeholder="your@email.com" className="border border-gray-300 rounded-[10px] p-3 w-full focus:outline-[#FF9D23] bg-white shadow-md" />
                <button className="font-bold bg-[#3b2314] text-white p-3 text-[15px] rounded-[10px] w-[120px] hover:bg-[#995F2F] shadow-md">Subscribe</button>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="bg-[#3b2314] w-full h-fit py-10">
            <div className="flex flex-col items-center justify-center px-10">
              <span className="text-[#e8b85a] text-[25px] font-[Playfair_Display]">Farine & Co</span>
              <p className="text-[#ffffff99] text-[16px] font-[DM_Sans] mt-2">12 Baker Street, London W1U 3BQ</p>
            </div>
            <div className="flex flex-row gap-7 px-10 text-center items-center justify-center mt-2">
              <a href=""><span className="text-[#ffffff99] text-[14px] font-[DM_Sans] hover:text-[#c8973a] duration-100 cursor-pointer">Shop</span></a>
              <a href=""><span className="text-[#ffffff99] text-[14px] font-[DM_Sans] hover:text-[#c8973a] duration-100 cursor-pointer">About</span></a>
              <a href=""><span className="text-[#ffffff99] text-[14px] font-[DM_Sans] hover:text-[#c8973a] duration-100 cursor-pointer">Privacy Policy</span></a>
              <a href=""><span className="text-[#ffffff99] text-[14px] font-[DM_Sans] hover:text-[#c8973a] duration-100 cursor-pointer">Terms</span></a>
            </div>

            <hr className="max-w-[1650px] border-top border-[1px] mx-30 mt-5 border-[#ffffff1a]" />
            <p className="flex itemsc-center justify-center text-[#ffffff99] text-[14px] font-[DM_Sans] mt-3">&copy; 2026 Farine & Co. Bakery. All rights reserved.</p>
          </div>
        </>
      )}
    </>
  )
}
