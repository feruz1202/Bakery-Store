import { useState, useEffect } from "react"
import ProductCard from "../components/productcard"
import API_URL from "../config"

export default function Shop({ addToCart, removeFromCart, cart }) {
  console.log("API URL being used:", API_URL)
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("default")
  const [showFilters, setShowFilters] = useState(false)
  // ADD these inside Shop function
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dietary, setDietary] = useState({ vegan: false, glutenFree: false, nutFree: false })
  const [availability, setAvailability] = useState({ inStock: true, preOrder: false })
  // Change states to strings
  const [minPrice, setMinPrice] = useState("0")
  const [maxPrice, setMaxPrice] = useState("1000000")
  const [filterSuccess, setFilterSuccess] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const filtered = products
    .filter(p => activeCategory === "all" ? true : p.category === activeCategory)
    .filter(p => p.price >= Number(minPrice || 0) && p.price <= Number(maxPrice || 9999))
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return 0
    })

  const handleReset = () => {
    setMaxPrice(1000000)
    setMinPrice(0)
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
  console.log("Filtered:", filtered)
  console.log("CurrentProducts:", currentProducts)

  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory, sortBy, maxPrice, minPrice])

  useEffect(() => {
    if (filterSuccess) {
      const timer = setTimeout(() => {
        setFilterSuccess(false)
      }, 2500)
      return () => clearTimeout(timer)  // cleanup
    }
  }, [filterSuccess])

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        console.log("Products from backend:", data)
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        console.log("Products from backend:", data)
        setError("Failed to load products")
        setLoading(false)
      })
  }, [])

  return (
    <>
      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}  // close when clicking backdrop
        >
          <div
            className="bg-white rounded-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}  // prevent closing when clicking modal
          >

            {/* CLOSE BUTTON */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="flex flex-col md:flex-row gap-6 px-6 pb-6">

              {/* LEFT — IMAGE */}
              <div className="w-full md:w-[45%]">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-[280px] object-cover rounded-xl"
                />
              </div>

              {/* RIGHT — INFO */}
              <div className="w-full md:w-[55%] flex flex-col gap-4">

                {/* BADGE */}
                {selectedProduct.badge && (
                  <span className="w-fit bg-[#F5C842] text-[#3b2314] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {selectedProduct.badge}
                  </span>
                )}

                {/* NAME */}
                <h2 className="font-[Playfair_Display] text-[24px] text-[#3b2314] font-bold">
                  {selectedProduct.name}
                </h2>

                {/* PRICE */}
                <p className="text-[22px] font-bold text-[#c8973a]">
                  {selectedProduct.price.toLocaleString()} so'm
                </p>

                {/* DESCRIPTION */}
                <p className="text-gray-500 text-[14px] leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* CATEGORY */}
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold uppercase tracking-widest text-gray-400">Category:</span>
                  <span className="bg-[#f2ede3] text-[#3b2314] text-[12px] font-semibold px-3 py-1 rounded-full capitalize">
                    {selectedProduct.category}
                  </span>
                </div>

                {/* DIETARY */}
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.dietary?.vegan && (
                    <span className="bg-green-100 text-green-700 text-[11px] font-bold px-3 py-1 rounded-full">
                      🌱 Vegan
                    </span>
                  )}
                  {selectedProduct.dietary?.glutenFree && (
                    <span className="bg-yellow-100 text-yellow-700 text-[11px] font-bold px-3 py-1 rounded-full">
                      🌾 Gluten-Free
                    </span>
                  )}
                  {selectedProduct.dietary?.nutFree && (
                    <span className="bg-blue-100 text-blue-700 text-[11px] font-bold px-3 py-1 rounded-full">
                      🥜 Nut-Free
                    </span>
                  )}
                </div>

                {/* IN STOCK */}
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${selectedProduct.inStock ? "bg-green-500" : "bg-red-400"}`}></span>
                  <span className="text-[13px] text-gray-500">
                    {selectedProduct.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* ADD TO CART BUTTON */}
                <div className="mt-auto pt-4">
                  {cart && cart.find(item => item._id === selectedProduct._id) ? (
                    <button
                      onClick={() => {
                        removeFromCart(selectedProduct._id)
                        setSelectedProduct(null)
                      }}
                      className="w-full bg-red-500 text-white py-3 rounded-xl font-bold text-[15px] hover:bg-red-600 transition"
                    >
                      − Remove from Cart
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        addToCart(selectedProduct)
                        setSelectedProduct(null)
                      }}
                      className="w-full bg-[#3b2314] text-white py-3 rounded-xl font-bold text-[15px] hover:bg-[#5a3520] transition"
                    >
                      + Add to Cart
                    </button>
                  )}
                </div>

                {selectedProduct.ingredients?.length > 0 && (
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-2">Ingredients</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.ingredients.map((ing, i) => (
                        <span key={i} className="bg-[#f2ede3] text-[#3b2314] text-[12px] px-3 py-1 rounded-full">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}


      {/* GREEN SUCCESS ALERT */}
      {filterSuccess && (
        <div className="z-999 fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-800 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[280px]">
          <span className="text-[20px]">✅</span>
          <div>
            <p className="font-bold text-[14px]">Filters Applied!</p>
            <p className="text-[12px] text-green-600">Your filters have been applied successfully.</p>
          </div>
          <button
            onClick={() => setFilterSuccess(false)}
            className="ml-auto text-green-600 hover:text-green-800 font-bold text-[16px]"
          >
            ✕
          </button>
        </div>
      )}
      <div className="w-full bg-[#f2ede3] min-h-screen">
        {/* HEADER */}
        <div className="w-full bg-[#3b2314] py-16 flex flex-col items-center">
          <h1 className="font-[Playfair_Display] text-[40px] text-[#c8973a]">Our Bakery</h1>
          <p className="text-white/70 text-[15px] px-5">Hand-crafted breads, pastries, cakes & more — baked fresh every morning</p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-[#c8973a] font-semibold text-[18px]">Loading products...</p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="flex items-center justify-center py-20">
            <p className="text-red-400 font-semibold text-[18px]">{error}</p>
          </div>
        )}

        {/* MAIN CONTENT */}
        {!loading && !error && (
          < div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-10 py-8">

            {/* FILTER TOGGLE BUTTON — mobile only */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#3b2314] font-semibold text-[14px]"
              >
                <span>Filter & Sort</span>
                <span>{showFilters ? "▲" : "▼"}</span>
              </button>

              {/* DROPDOWN CONTENT — mobile */}
              {showFilters && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 mt-2">

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
                          id={`mob-${item.key}`}
                          checked={dietary[item.key]}
                          onChange={() => setDietary(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                          className="accent-[#c8973a] w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor={`mob-${item.key}`} className="text-[14px] text-[#3b2314] cursor-pointer">
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 mb-5" />

                  {/* PRICE RANGE */}
                  <div className="mb-5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Price Range</p>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full accent-[#c8973a]"
                    />
                    <div className="flex justify-between text-[12px] text-gray-400 mt-1">
                      <span>10000</span>
                      <span>{Number(maxPrice).toLocaleString()} so'm</span>
                    </div>
                  </div>

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
                          id={`mob-${item.key}`}
                          checked={availability[item.key]}
                          onChange={() => setAvailability(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                          className="accent-[#c8973a] w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor={`mob-${item.key}`} className="text-[14px] text-[#3b2314] cursor-pointer">
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* BUTTONS */}
                  <button
                    onClick={() => setFilterSuccess(true)}
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
              )}
            </div>

            {/* SIDEBAR — desktop only */}
            <div className="hidden lg:block w-[260px] shrink-0 bg-white rounded-2xl border border-gray-200 p-5 h-fit sticky top-20">
              <h3 className="font-[Playfair_Display] text-[18px] text-[#3b2314] mb-4">Filter & Sort</h3>

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

              <div className="border-t border-gray-100 mb-5" />

              {/* PRICE RANGE */}
              <div className="mb-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Price Range</p>

                {/* MIN MAX INPUTS */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1">
                    <label className="text-[11px] text-gray-400 mb-1 block">Min</label>
                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#3b2314] outline-none focus:border-[#c8973a]"
                      placeholder="0"
                    />
                  </div>
                  <span className="text-gray-400 mt-4">—</span>
                  <div className="flex-1">
                    <label className="text-[11px] text-gray-400 mb-1 block">Max</label>
                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#3b2314] outline-none focus:border-[#c8973a]"
                      placeholder="50"
                    />
                  </div>
                </div>

                {/* SLIDER */}
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full accent-[#c8973a]"
                />
                <div className="flex justify-between text-[12px] text-gray-400 mt-1">
                  <span>{minPrice} so'm</span>
                  <span>{maxPrice} so'm</span>
                </div>
              </div>

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

              <div className="border-t border-gray-100 mb-5" />

              {/* SORT */}
              <div className="mb-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Sort By</p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-[#3b2314] outline-none"
                >
                  <option value="default">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A–Z</option>
                </select>
              </div>

              {/* BUTTONS */}
              <button
                onClick={() => setFilterSuccess(true)}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 justify-items-center">
                {currentProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                    cart={cart}
                    onProductClick={(product) => setSelectedProduct(product)}
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
        )}
      </div >
    </>
  )
}