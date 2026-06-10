import { useState, useEffect } from "react"
import { products } from "../data/productdata"
import ProductCard from "../components/productcard"

export default function Shop({ addToCart, removeFromCart, cart }) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("default")
  const [maxPrice, setMaxPrice] = useState(50)
  const [dietary, setDietary] = useState({ vegan: false, glutenFree: false, nutFree: false })
  const [availability, setAvailability] = useState({ inStock: true, preOrder: false })
  const [categoryFilters, setCategoryFilters] = useState({
    breads: true, pastries: true, cakes: true, cookies: true, drinks: true
  })

  const filtered = products
    .filter(p => activeCategory === "all" ? true : p.category === activeCategory)
    .filter(p => p.price <= maxPrice)
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return 0
    })

  const handleReset = () => {
    setMaxPrice(50)
    setSortBy("default")
    setActiveCategory("all")
    setDietary({ vegan: false, glutenFree: false, nutFree: false })
    setAvailability({ inStock: true, preOrder: false })
    setCategoryFilters({ breads: true, pastries: true, cakes: true, cookies: true, drinks: true })
  }



  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 10
  const totalPages = Math.ceil(filtered.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = filtered.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory, sortBy, maxPrice])

  return (
    <div className="w-full bg-[#f2ede3] min-h-screen">

      {/* HEADER */}
      <div className="w-full bg-[#3b2314] py-16 flex flex-col items-center">
        <h1 className="font-[Playfair_Display] text-[40px] text-[#c8973a]">Our Bakery</h1>
        <p className="text-white/70 text-[15px] px-5">Hand-crafted breads, pastries, cakes & more — baked fresh every morning</p>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-10 py-8">

        {/* SIDEBAR */}
        <div className="w-full lg:w-[260px] shrink-0 bg-white rounded-2xl border border-gray-200 p-5 h-fit lg:sticky lg:top-20">
          <h3 className="font-[Playfair_Display] text-[18px] text-[#3b2314] mb-4">Filter & Sort</h3>

          {/* CATEGORY CHECKBOXES */}
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Category</p>
            {Object.keys(categoryFilters).map(key => (
              <div key={key} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id={key}
                  checked={categoryFilters[key]}
                  onChange={() => setCategoryFilters(prev => ({ ...prev, [key]: !prev[key] }))}
                  className="accent-[#c8973a] w-4 h-4 cursor-pointer"
                />
                <label htmlFor={key} className="text-[14px] text-[#3b2314] capitalize cursor-pointer">
                  {key}
                </label>
              </div>
            ))}
          </div>

          {/* DIVIDER */}
          <div className="border-t border-gray-100 mb-5" />

          {/* DIETARY */}
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Dietary</p>
            {[
              { key: "vegan", label: "Vegan" },
              { key: "glutenFree", label: "Gluten-Free" },
              { key: "nutFree", label: "Nut-Free" }
            ].map(item => (
              <div key={item.key} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id={item.key}
                  checked={dietary[item.key]}
                  onChange={() => setDietary(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className="accent-[#c8973a] w-4 h-4 cursor-pointer"
                />
                <label htmlFor={item.key} className="text-[14px] text-[#3b2314] cursor-pointer">
                  {item.label}
                </label>
              </div>
            ))}
          </div>

          {/* DIVIDER */}
          <div className="border-t border-gray-100 mb-5" />

          {/* PRICE RANGE */}
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Price Range</p>
            <input
              type="range"
              min="1"
              max="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#c8973a]"
            />
            <div className="flex justify-between text-[12px] text-gray-400 mt-1">
              <span>£1</span>
              <span>£{maxPrice}</span>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-gray-100 mb-5" />

          {/* AVAILABILITY */}
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Availability</p>
            {[
              { key: "inStock", label: "In Stock" },
              { key: "preOrder", label: "Pre-Order" }
            ].map(item => (
              <div key={item.key} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id={item.key}
                  checked={availability[item.key]}
                  onChange={() => setAvailability(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className="accent-[#c8973a] w-4 h-4 cursor-pointer"
                />
                <label htmlFor={item.key} className="text-[14px] text-[#3b2314] cursor-pointer">
                  {item.label}
                </label>
              </div>
            ))}
          </div>

          {/* APPLY & RESET BUTTONS */}
          <button
            className="w-full bg-[#3b2314] text-white py-2 rounded-xl text-[13px] font-semibold hover:bg-[#5a3520] mb-2"
          >
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="w-full border border-[#3b2314] text-[#3b2314] py-2 rounded-xl text-[13px] font-semibold hover:bg-[#3b2314] hover:text-white transition"
          >
            Reset Filters
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1">

          {/* CATEGORY TABS */}
          <div className="flex flex-row gap-2 mb-5 flex-wrap">
            {["all", "bread", "pastry", "cake", "cookie", "drink"].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full border text-[14px] font-semibold capitalize transition
                  ${activeCategory === cat
                    ? "bg-[#3b2314] text-white border-[#3b2314]"
                    : "bg-white text-[#3b2314] border-gray-300 hover:border-[#3b2314]"
                  }`}
              >
                {cat === "all" ? "All Items" : cat}
              </button>
            ))}
          </div>

          {/* SORT + COUNT ROW */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <p className="text-[14px] text-gray-400">{filtered.length} items</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#3b2314] outline-none bg-white"
            >
              <option value="default">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 justify-items-center">
            {currentProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                cart={cart}
              />
            ))}
          </div>
          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">

              {/* PREV BUTTON */}
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-xl border text-[14px] font-semibold transition
        ${currentPage === 1
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-[#3b2314] text-[#3b2314] hover:bg-[#3b2314] hover:text-white"
                  }`}
              >
                ← Prev
              </button>

              {/* PAGE NUMBERS */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-xl border text-[14px] font-semibold transition
          ${currentPage === pageNum
                      ? "bg-[#3b2314] text-white border-[#3b2314]"
                      : "border-gray-200 text-[#3b2314] hover:border-[#3b2314]"
                    }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* NEXT BUTTON */}
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-xl border text-[14px] font-semibold transition
        ${currentPage === totalPages
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-[#3b2314] text-[#3b2314] hover:bg-[#3b2314] hover:text-white"
                  }`}
              >
                Next →
              </button>

            </div>
          )}

          {/* PAGE INFO */}
          <p className="text-center text-[13px] text-gray-400 mt-3">
            Page {currentPage} of {totalPages} — showing {currentProducts.length} of {filtered.length} products
          </p>
        </div>
      </div>
    </div>
  )
}