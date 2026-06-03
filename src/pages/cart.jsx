import { useState } from "react"

export default function Cart({ cart, setCart, setPage }) {

  const updateQty = (id, delta) => {
    setCart(prev => prev
      .map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
      .filter(item => item.quantity > 0)
    )
  }

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const delivery = subtotal >= 20 ? 0 : 2.95
  const total = subtotal + delivery

  return (
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
              <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-row gap-4 items-center">

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
                    £{(item.price * item.quantity).toFixed(2)}
                  </p>

                  {/* QTY CONTROLS */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center font-bold text-[#3b2314] hover:bg-[#3b2314] hover:text-white transition"
                    >
                      −
                    </button>
                    <span className="font-semibold text-[15px]">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center font-bold text-[#3b2314] hover:bg-[#3b2314] hover:text-white transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() => removeItem(item.id)}
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
              <span>£{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-[14px] text-gray-500 mb-1">
              <span>Delivery</span>
              <span>{delivery === 0 ? <span className="text-green-500 font-semibold">Free</span> : `£${delivery.toFixed(2)}`}</span>
            </div>

            {delivery > 0 && (
              <p className="text-[12px] text-[#c8973a] mb-4">
                Spend £{(20 - subtotal).toFixed(2)} more for free delivery
              </p>
            )}

            {/* COUPON */}
            <div className="flex gap-2 my-4">
              <input
                type="text"
                placeholder="Coupon code"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#c8973a]"
              />
              <button className="bg-[#c8973a] text-white px-4 py-2 rounded-lg text-[13px] font-semibold hover:bg-[#b07d2a]">
                Apply
              </button>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-[#3b2314] text-[16px] mb-5">
              <span>Total</span>
              <span>£{total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => setPage("checkout")}
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
  )
}