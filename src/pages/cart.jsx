import { useState } from "react"
import API_URL from "../config"

export default function Cart({ cart, setCart, setPage, user }) {
  const [appliedCoupon, setAppliedCoupon] = useState(null)  // ← add this
  const [couponInput, setCouponInput] = useState("")         // ← add this
  const [couponError, setCouponError] = useState("")
  const [showToast, setShowToast] = useState(false)

  // ADD THESE CALCULATIONS
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? (subtotal * appliedCoupon.discount) / 100
      : appliedCoupon.discount
    : 0
  const delivery = subtotal >= 100000 ? 0 : 15000
  const total = subtotal - discount + delivery

  const COUPONS = {
    "WELCOME10": { discount: 10, type: "percent", label: "10% off" },
    "SAVE50000": { discount: 50000, type: "fixed", label: "50,000 so'm off" },
    "FRESH20": { discount: 20, type: "percent", label: "20% off" },
    "BAKERY30": { discount: 30, type: "percent", label: "30% off" },
  }

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase()
    const found = COUPONS[code]
    if (found) {
      setAppliedCoupon({ code, ...found })
      setCouponError("")
    } else {
      setAppliedCoupon(null)
      setCouponError("Invalid coupon code")
    }
  }

  const updateQty = (id, delta) => {
    setCart(prev => prev
      .map(item => item._id === id ? { ...item, quantity: item.quantity + delta } : item)
      .filter(item => item.quantity > 0)
    )
  }

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item._id !== id))
  }

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to checkout")
      setPage("login")
      return
    }

    try {
      const token = localStorage.getItem("token")
      console.log("Token:", token)
      console.log("User:", user)
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalPrice: total,
        deliveryAddress: {
          firstName: user.name || "Customer",
          lastName: "",
          address: "To be filled",
          city: "To be filled",
          postcode: "To be filled",
          phone: "To be filled"
        },
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        discount: discount || 0
      }

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()

      if (response.ok) {
        setCart([])
        alert("✅ Order placed successfully! Thank you for your order. 🥐")
        setPage("home")
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.log("Error:", err)
      alert("Something went wrong. Try again.")
    }
  }

  return (
    <>
      <div className="w-full bg-[#f2ede3] min-h-screen px-6 lg:px-20 py-10">

        {/* TITLE */}
        <h1 className="font-[Playfair_Display] text-[32px] text-[#3b2314] mb-8">
          Your Cart
          <span className="font-[DM_Sans] text-[16px] text-gray-400 font-normal ml-2">
            ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
          </span>
        </h1>

        {cart.length === 0 ? (

          /* EMPTY CART */
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[60px]">🛒</p>
            <h2 className="font-[Playfair_Display] text-[24px] text-[#3b2314]">Your cart is empty</h2>
            <p className="text-gray-400 text-[15px]">Add some delicious items to get started</p>
            <button
              onClick={() => setPage("shop")}
              className="bg-[#3b2314] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#5a3520] mt-2"
            >
              Browse Our Bakery
            </button>
          </div>

        ) : (

          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* CART ITEMS */}
            <div className="flex-1 flex flex-col gap-4">
              {cart.map(item => (
                <div key={item._id} className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-row gap-4 items-center">

                  {/* IMAGE */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[80px] h-[80px] object-cover rounded-xl"
                  />

                  {/* INFO */}
                  <div className="flex-1">
                    <h3 className="font-bold text-[#3b2314] text-[16px]">{item.name}</h3>
                    <p className="text-gray-400 text-[13px]">{item.description}</p>
                    <p className="font-bold text-[#3b2314] text-[15px] mt-1">
                      {(item.price * item.quantity).toLocaleString()} so'm
                    </p>

                    {/* QTY CONTROLS */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQty(item._id, -1)}
                        className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center font-bold text-[#3b2314] hover:bg-[#3b2314] hover:text-white transition"
                      >
                        −
                      </button>
                      <span className="font-semibold text-[15px]">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item._id, 1)}
                        className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center font-bold text-[#3b2314] hover:bg-[#3b2314] hover:text-white transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-gray-300 hover:text-red-400 text-[20px] transition self-start"
                  >
                    ✕
                  </button>

                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="w-full lg:w-[320px] bg-white rounded-2xl border border-gray-200 p-6 sticky top-20">
              <h2 className="font-[Playfair_Display] text-[20px] text-[#3b2314] mb-5">Order Summary</h2>

              <div className="flex justify-between text-[14px] text-gray-500 mb-3">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()} so'm</span>
              </div>

              {/* DISCOUNT ROW — only shows when coupon applied */}
              {appliedCoupon && (
                <div className="flex justify-between text-[14px] text-green-500 mb-3">
                  <span>Discount ({appliedCoupon.label})</span>
                  <span>− {discount.toLocaleString()} so'm</span>
                </div>
              )}

              <div className="flex justify-between text-[14px] text-gray-500 mb-1">
                <span>Delivery</span>
                <span>{delivery === 0 ? <span className="text-green-500 font-semibold">Free</span> : `${delivery.toLocaleString()} so'm`}</span>
              </div>

              {delivery > 0 && (
                <p className="text-[12px] text-[#c8973a] mb-4">
                  Spend {(100000 - subtotal).toLocaleString()} so'm more for free delivery
                </p>
              )}

              {/* COUPON */}
              <div className="flex gap-2 my-4">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#c8973a]"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-[#c8973a] text-white px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#b07d2a]"
                >
                  Apply
                </button>
              </div>

              {/* ERROR */}
              {couponError && (
                <p className="text-red-400 text-[12px] mb-2">{couponError}</p>
              )}

              {/* SUCCESS */}
              {appliedCoupon && (
                <div className="flex justify-between items-center bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-3">
                  <p className="text-green-600 text-[13px] font-semibold">
                    ✓ {appliedCoupon.code} — {appliedCoupon.label} applied!
                  </p>
                  <button
                    onClick={() => { setAppliedCoupon(null); setCouponInput("") }}
                    className="text-gray-400 hover:text-red-400 text-[12px]"
                  >
                    Remove
                  </button>
                </div>
              )}
              <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-[#3b2314] text-[16px] mb-5">
                <span>Total</span>
                <span>{total.toLocaleString()} so'm</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#c8973a] text-white py-3 rounded-xl font-bold text-[15px] hover:bg-[#b07d2a] transition"
              >
                Proceed to Checkout →
              </button>

              <p className="text-center text-[12px] text-gray-400 mt-3">
                🔒 Secure checkout · Free returns
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}