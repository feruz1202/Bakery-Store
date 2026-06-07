import { useState } from "react"

export default function Login({ setPage, setUser }) {
  const [tab, setTab] = useState("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState("")

  const handleSignIn = () => {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    // Later: replace with real API call
    setUser({ name: firstName || email.split("@")[0], email })
    setPage("home")
  }

  const handleRegister = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (!agreed) {
      setError("Please agree to the terms")
      return
    }
    // Later: replace with real API call
    setUser({ name: firstName, email })
    setPage("home")
  }

  return (
    <div className="w-full min-h-screen bg-[#f2ede3] flex items-center justify-center py-10">
      <div className="bg-white rounded-2xl p-8 w-full max-w-[440px] shadow-sm border border-gray-100">

        {/* LOGO */}
        <div className="text-center mb-6">
          <p className="font-[Playfair_Display] text-[28px] text-[#3b2314]">
            Farine <span className="text-[#c8973a] italic">&</span> Co.
          </p>
          <p className="text-gray-400 text-[14px] mt-1">Your bakery account</p>
        </div>

        {/* TABS */}
        <div className="flex bg-[#f2ede3] rounded-xl p-1 mb-6">
          <button
            onClick={() => { setTab("signin"); setError("") }}
            className={`flex-1 py-2 rounded-lg text-[14px] font-semibold transition
              ${tab === "signin" ? "bg-white text-[#3b2314] shadow-sm" : "text-gray-400"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab("register"); setError("") }}
            className={`flex-1 py-2 rounded-lg text-[14px] font-semibold transition
              ${tab === "register" ? "bg-white text-[#3b2314] shadow-sm" : "text-gray-400"}`}
          >
            Create Account
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-[13px] mb-4 text-center">{error}</p>
        )}

        {/* SIGN IN FORM */}
        {tab === "signin" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[13px] font-semibold text-[#3b2314] mb-1 block">Email Address</label>
              <input
                type="email"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#c8973a]"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#3b2314] mb-1 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#c8973a]"
              />
            </div>
            <div className="text-right">
              <button className="text-[#c8973a] text-[13px] font-semibold">Forgot password?</button>
            </div>
            <button
              onClick={handleSignIn}
              className="w-full bg-[#3b2314] text-white py-3 rounded-xl font-bold text-[15px] hover:bg-[#5a3520] transition"
            >
              Sign In
            </button>
            <div className="flex items-center gap-3">
              <hr className="flex-1 border-gray-200" />
              <span className="text-gray-400 text-[12px]">or continue with</span>
              <hr className="flex-1 border-gray-200" />
            </div>
            <button className="w-full border border-gray-200 rounded-xl py-3 text-[14px] font-semibold text-[#3b2314] hover:border-[#c8973a] transition">
              🌐 Continue with Google
            </button>
          </div>
        )}

        {/* REGISTER FORM */}
        {tab === "register" && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[13px] font-semibold text-[#3b2314] mb-1 block">First Name</label>
                <input
                  type="text"
                  placeholder="Sophie"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#c8973a]"
                />
              </div>
              <div className="flex-1">
                <label className="text-[13px] font-semibold text-[#3b2314] mb-1 block">Last Name</label>
                <input
                  type="text"
                  placeholder="Martin"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#c8973a]"
                />
              </div>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#3b2314] mb-1 block">Email Address</label>
              <input
                type="email"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#c8973a]"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#3b2314] mb-1 block">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#c8973a]"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#3b2314] mb-1 block">Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#c8973a]"
              />
            </div>
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 accent-[#c8973a]"
              />
              <label htmlFor="terms" className="text-[13px] text-gray-400">
                I agree to the <span className="text-[#c8973a] cursor-pointer">Terms of Service</span> and <span className="text-[#c8973a] cursor-pointer">Privacy Policy</span>
              </label>
            </div>
            <button
              onClick={handleRegister}
              className="w-full bg-[#3b2314] text-white py-3 rounded-xl font-bold text-[15px] hover:bg-[#5a3520] transition"
            >
              Create Account
            </button>
            <div className="flex items-center gap-3">
              <hr className="flex-1 border-gray-200" />
              <span className="text-gray-400 text-[12px]">or continue with</span>
              <hr className="flex-1 border-gray-200" />
            </div>
            <button className="w-full border border-gray-200 rounded-xl py-3 text-[14px] font-semibold text-[#3b2314] hover:border-[#c8973a] transition">
              🌐 Continue with Google
            </button>
          </div>
        )}

      </div>
    </div>
  )
}