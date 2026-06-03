export default function ProductCard({ product, addToCart, removeFromCart, cart }) {
    const isInCart = cart.find(item => item.id === product.id)
    return (
        <>
            {/* FIRST CARD */}
            <div className="flex flex-col max-w-[320px] rounded-2xl border border-gray-200 overflow-hidden bg-white">
                {/* IMAGE AREA */}
                <div className="relative h-[220px]">
                    {/* FULL IMAGE */}
                    <img
                        src="/sourdough.jpg"
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
                        {/* SHOW REMOVE BUTTON IF IN CART, ADD BUTTON IF NOT */}
                        {isInCart ? (
                            <button
                                onClick={() => removeFromCart(product.id)}
                                className="bg-red-500 text-white text-[13px] px-4 py-2 rounded-xl hover:bg-red-600"
                            >
                                − Remove
                            </button>
                        ) : (
                            <button
                                onClick={() => addToCart(product)}
                                className="bg-[#3b2314] text-white text-[13px] px-4 py-2 rounded-xl hover:bg-[#5a3520]"
                            >
                                + Add
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}