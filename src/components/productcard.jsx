export default function ProductCard({ product, addToCart, removeFromCart, cart, onProductClick }) {
    const isInCart = cart.find(item => item._id === product._id)
    return (
        <>
            {/* FIRST CARD */}
            <div onClick={() => onProductClick(product)} className="flex flex-col w-full max-w-[280px] rounded-2xl border border-gray-200 overflow-hidden bg-white">
                {/* IMAGE AREA */}
                <div className="relative h-[220px]">
                    {/* FULL IMAGE */}
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* CONTENT AREA */}
                <div className="flex flex-col p-4 gap-2">
                    <h3 className="font-bold text-[#1a1a1a] text-[16px]">
                        {product.name}
                    </h3>
                    <p className="text-gray-500 text-[13px] leading-snug">
                        {product.description}
                    </p>
                    <div className="flex flex-row items-center justify-between mt-2">
                        <span className="font-bold text-[#1a1a1a] text-[16px]">£{product.price.toFixed(2)}</span>
                        {/* SHOW REMOVE BUTTON IF IN CART, ADD BUTTON IF NOT */}
                        {isInCart ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    removeFromCart(product._id)
                                }}

                                className="bg-red-500 text-white text-[13px] px-4 py-2 rounded-xl hover:bg-red-600"
                            >
                                − Remove
                            </button>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    addToCart(product)
                                }}
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