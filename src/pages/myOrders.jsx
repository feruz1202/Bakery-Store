import { useState, useEffect } from "react"
import API_URL from "../config"

export default function Orders({ user, setPage }) {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    if (!user) {
      setPage("login")
      return
    }
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok) {
        setOrders(data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return
    setCancelling(orderId)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setOrders(prev => prev.map(o =>
          o._id === orderId ? { ...o, status: "cancelled" } : o
        ))
        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: "cancelled" })
        }
      } else {
        alert(data.message)
      }
    } catch (err) {
      alert("Failed to cancel order")
    } finally {
      setCancelling(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-400" }
      case "confirmed": return { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-400" }
      case "preparing": return { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-400" }
      case "delivered": return { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-400" }
      case "cancelled": return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-400" }
      default: return { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" }
    }
  }

  const getStatusStep = (status) => {
    const steps = ["pending", "confirmed", "preparing", "delivered"]
    return steps.indexOf(status)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit", month: "long", year: "numeric"
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit", minute: "2-digit"
    })
  }

  const canCancel = (status) => status === "pending" || status === "confirmed"

  if (loading) return (
    <div className="w-full bg-[#f2ede3] min-h-screen flex items-center justify-center">
      <p className="text-[#c8973a] font-semibold text-[18px]">Loading your orders...</p>
    </div>
  )

  if (error) return (
    <div className="w-full bg-[#f2ede3] min-h-screen flex items-center justify-center">
      <p className="text-red-400 font-semibold">{error}</p>
    </div>
  )

  return (
    <div className="w-full bg-[#f2ede3] min-h-screen">

      {/* HEADER */}
      <div className="w-full bg-[#3b2314] py-12 px-6 lg:px-20">
        <h1 className="font-[Playfair_Display] text-[36px] text-[#c8973a] font-bold">My Orders</h1>
        <p className="text-white/60 text-[15px] mt-1">Track and manage all your orders</p>
      </div>

      <div className="px-6 lg:px-20 py-10">

        {orders.length === 0 ? (

          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-[60px]">📦</p>
            <h2 className="font-[Playfair_Display] text-[24px] text-[#3b2314]">No orders yet</h2>
            <p className="text-gray-400 text-[15px]">You haven't placed any orders yet</p>
            <button
              onClick={() => setPage("shop")}
              className="bg-[#3b2314] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#5a3520] mt-2"
            >
              Start Shopping
            </button>
          </div>

        ) : (

          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ORDERS LIST */}
            <div className="flex-1 flex flex-col gap-4">

              {/* STATS ROW */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {[
                  { label: "Total Orders", value: orders.length, icon: "📦" },
                  { label: "Delivered", value: orders.filter(o => o.status === "delivered").length, icon: "✅" },
                  { label: "In Progress", value: orders.filter(o => ["pending", "confirmed", "preparing"].includes(o.status)).length, icon: "⏳" },
                  { label: "Cancelled", value: orders.filter(o => o.status === "cancelled").length, icon: "❌" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                    <p className="text-[24px] mb-1">{stat.icon}</p>
                    <p className="font-[Playfair_Display] text-[22px] font-bold text-[#3b2314]">{stat.value}</p>
                    <p className="text-[12px] text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* ORDER CARDS */}
              {orders.map(order => {
                const colors = getStatusColor(order.status)
                const isSelected = selectedOrder?._id === order._id

                return (
                  <div
                    key={order._id}
                    className={`bg-white rounded-2xl border transition cursor-pointer ${isSelected ? "border-[#c8973a] shadow-md" : "border-gray-200 hover:border-[#c8973a]"}`}
                    onClick={() => setSelectedOrder(isSelected ? null : order)}
                  >
                    {/* ORDER HEADER */}
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#f2ede3] rounded-xl flex items-center justify-center text-[22px]">
                          🥐
                        </div>
                        <div>
                          <p className="font-bold text-[#3b2314] text-[15px]">
                            Order #{order._id.slice(-6).toUpperCase()}
                          </p>
                          <p className="text-gray-400 text-[13px]">
                            {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                          </p>
                          <p className="text-[13px] text-gray-500 mt-0.5">
                            {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`${colors.bg} ${colors.text} text-[12px] font-bold px-3 py-1 rounded-full capitalize flex items-center gap-1.5`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
                          {order.status}
                        </span>
                        <p className="font-bold text-[#3b2314] text-[15px]">
                          {order.totalPrice?.toLocaleString()} so'm
                        </p>
                      </div>
                    </div>

                    {/* EXPANDED DETAILS */}
                    {isSelected && (
                      <div className="border-t border-gray-100 p-5">

                        {/* PROGRESS TRACKER — only for non-cancelled */}
                        {order.status !== "cancelled" && (
                          <div className="mb-6">
                            <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-4">Order Progress</p>
                            <div className="flex items-center">
                              {["Pending", "Confirmed", "Preparing", "Delivered"].map((step, i) => {
                                const currentStep = getStatusStep(order.status)
                                const isDone = i <= currentStep
                                const isActive = i === currentStep
                                return (
                                  <div key={step} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition
                                        ${isDone ? "bg-[#3b2314] text-white" : "bg-gray-100 text-gray-400"}`}>
                                        {isDone && i < currentStep ? "✓" : i + 1}
                                      </div>
                                      <p className={`text-[10px] mt-1 font-semibold ${isActive ? "text-[#3b2314]" : isDone ? "text-gray-500" : "text-gray-300"}`}>
                                        {step}
                                      </p>
                                    </div>
                                    {i < 3 && (
                                      <div className={`flex-1 h-0.5 mx-1 ${i < currentStep ? "bg-[#3b2314]" : "bg-gray-200"}`} />
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* CANCELLED BANNER */}
                        {order.status === "cancelled" && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-center gap-3">
                            <span className="text-[22px]">❌</span>
                            <div>
                              <p className="font-bold text-red-700 text-[14px]">Order Cancelled</p>
                              <p className="text-red-500 text-[12px]">This order has been cancelled.</p>
                            </div>
                          </div>
                        )}

                        {/* ORDER ITEMS */}
                        <div className="mb-5">
                          <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-3">Items Ordered</p>
                          <div className="flex flex-col gap-2">
                            {order.items?.map((item, i) => (
                              <div key={i} className="flex items-center gap-3 bg-[#f2ede3] rounded-xl p-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <p className="font-semibold text-[#3b2314] text-[14px]">{item.name}</p>
                                  <p className="text-gray-400 text-[12px]">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-bold text-[#3b2314] text-[14px]">
                                  {(item.price * item.quantity).toLocaleString()} so'm
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* ORDER SUMMARY */}
                        <div className="bg-[#f2ede3] rounded-xl p-4 mb-5">
                          <div className="flex justify-between text-[13px] text-gray-500 mb-2">
                            <span>Subtotal</span>
                            <span>{order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()} so'm</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-[13px] text-green-500 mb-2">
                              <span>Discount</span>
                              <span>− {order.discount?.toLocaleString()} so'm</span>
                            </div>
                          )}
                          <div className="flex justify-between text-[13px] text-gray-500 mb-2">
                            <span>Delivery</span>
                            <span>Included</span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-[#3b2314] text-[15px]">
                            <span>Total</span>
                            <span>{order.totalPrice?.toLocaleString()} so'm</span>
                          </div>
                        </div>

                        {/* ORDER INFO */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                          <div className="bg-[#f2ede3] rounded-xl p-3">
                            <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Order Date</p>
                            <p className="font-semibold text-[#3b2314] text-[13px]">{formatDate(order.createdAt)}</p>
                            <p className="text-gray-400 text-[12px]">{formatTime(order.createdAt)}</p>
                          </div>
                          <div className="bg-[#f2ede3] rounded-xl p-3">
                            <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Order ID</p>
                            <p className="font-semibold text-[#3b2314] text-[13px]">#{order._id.slice(-6).toUpperCase()}</p>
                          </div>
                          {order.couponCode && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                              <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Coupon Used</p>
                              <p className="font-semibold text-green-600 text-[13px]">{order.couponCode}</p>
                            </div>
                          )}
                        </div>

                        {/* CANCEL BUTTON */}
                        {canCancel(order.status) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCancel(order._id)
                            }}
                            disabled={cancelling === order._id}
                            className="w-full py-3 border-2 border-red-300 text-red-500 rounded-xl font-bold text-[14px] hover:bg-red-50 transition disabled:opacity-50"
                          >
                            {cancelling === order._id ? "Cancelling..." : "Cancel Order"}
                          </button>
                        )}

                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* RIGHT SIDEBAR — quick summary */}
            <div className="w-full lg:w-[280px] flex flex-col gap-4 sticky top-20">

              {/* RECENT STATUS */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-[Playfair_Display] text-[16px] text-[#3b2314] font-bold mb-4">Recent Activity</h3>
                <div className="flex flex-col gap-3">
                  {orders.slice(0, 5).map(order => {
                    const colors = getStatusColor(order.status)
                    return (
                      <div key={order._id} className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${colors.dot} shrink-0`}></span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#3b2314] truncate">
                            #{order._id.slice(-6).toUpperCase()}
                          </p>
                          <p className="text-[11px] text-gray-400">{formatDate(order.createdAt)}</p>
                        </div>
                        <span className={`${colors.bg} ${colors.text} text-[10px] font-bold px-2 py-0.5 rounded-full capitalize shrink-0`}>
                          {order.status}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* HELP CARD */}
              <div className="bg-[#3b2314] rounded-2xl p-5">
                <p className="text-[#c8973a] font-[Playfair_Display] text-[16px] font-bold mb-2">Need Help?</p>
                <p className="text-white/60 text-[13px] mb-4">Contact us if you have any issues with your order.</p>
                <button className="w-full bg-[#c8973a] text-white py-2 rounded-xl text-[13px] font-bold hover:bg-[#b07d2a] transition">
                  Contact Support
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}