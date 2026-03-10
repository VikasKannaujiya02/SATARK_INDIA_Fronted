"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Shield, Mail, Lock, CheckCircle2, Smartphone, LogIn } from "lucide-react"
import Link from "next/link"
import { auth, googleProvider } from "@/lib/firebase"
import { signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import toast from "react-hot-toast"

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [loginMethod, setLoginMethod] = useState("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState("")
  const [emailInput, setEmailInput] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Neutralized to stop auto-redirect loops
      // if (user) {
      //   router.replace('/');
      // }
    });
    return () => unsubscribe();
  }, []);

  // Resend OTP timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return
    const interval = setInterval(() => setResendTimer((p) => Math.max(0, p - 1)), 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  const setupRecaptcha = () => {
    if (!auth) {
      toast.error("Authentication service not initialized");
      return;
    }
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          console.log("Recaptcha resolved");
        }
      });
    }
  }

  const handleSendOtp = async () => {
    if (!auth) {
      toast.error("Authentication service not initialized");
      return;
    }
    if (!phone.trim() || phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number")
      return
    }
    setError("")
    setSending(true)
    
    try {
      setupRecaptcha()
      const appVerifier = (window as any).recaptchaVerifier
      const formatPhone = `+91${phone.trim()}`
      
      const confirmation = await signInWithPhoneNumber(auth, formatPhone, appVerifier)
      setConfirmationResult(confirmation)
      
      setLoginMethod("phone")
      setStep(2)
      setResendTimer(30)
      setOtp(["", "", "", "", "", ""])
      toast.success("OTP sent successfully!")
      setTimeout(() => otpInputsRef.current[0]?.focus(), 100)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Could not send OTP. Please try again.")
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear()
        delete (window as any).recaptchaVerifier
      }
    } finally {
      setSending(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (!auth) {
      toast.error("Authentication service not initialized");
      return;
    }
    try {
      // Use new GoogleAuthProvider() as requested to fix silent refresh/reload
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      toast.success("Login Successful!");

      const user = result.user;

      // Non-blocking backend sync
      (async () => {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'https://satark-india-backend.onrender.com'}/api/auth/firebase-sync`,
            {
              uid: user.uid,
              email: user.email,
              name: user.displayName,
              photoURL: user.photoURL,
            }
          );

          if (res.data?.token) {
            localStorage.setItem("satark_token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
          }
        } catch (syncError) {
          console.error("Backend sync failed, proceeding with login:", syncError);
        }
      })();

      router.push("/");

    } catch (err: any) {
      console.error(err);
      toast.error("Google login failed");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleanedValue = value.replace(/\D/g, '')
    if (cleanedValue.length > 1) return
    
    const next = [...otp]
    next[index] = cleanedValue
    setOtp(next)
    setError("")

    if (cleanedValue && index < otp.length - 1) {
      otpInputsRef.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        otpInputsRef.current[index - 1]?.focus()
      }
    }
  }

  const handleVerifyOtp = async () => {
    const otpStr = otp.join("")
    if (otpStr.length !== 6) {
      setError("Enter 6-digit OTP")
      return
    }
    setError("")
    setVerifying(true)
    
    try {
      if (confirmationResult) {
        const result = await confirmationResult.confirm(otpStr)
        toast.success("Verification Successful!");
        const user = result.user
        
        // Non-blocking backend sync
        (async () => {
          try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'https://satark-india-backend.onrender.com'}/api/auth/firebase-sync`, {
              uid: user.uid,
              phoneNumber: user.phoneNumber
            });

            if (res.data?.token) {
              localStorage.setItem("satark_token", res.data.token);
              localStorage.setItem("user", JSON.stringify(res.data.user));
            }
          } catch (syncError) {
            console.error("Backend sync failed, proceeding with login:", syncError);
          }
        })();

        router.push("/");
      }
    } catch (err: any) {
      console.error(err)
      setError("Invalid OTP. Try again.")
    } finally {
      setVerifying(false)
    }
  }

  const goBack = () => {
    setStep(1)
    setOtp(["", "", "", "", "", ""])
    setError("")
    setResendTimer(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div id="recaptcha-container"></div>
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="relative">
              <Shield className="w-14 h-14 text-blue-400" fill="currentColor" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-black text-white tracking-tight">SATARK</h1>
              <p className="text-xs text-blue-300 font-semibold tracking-wider">INDIA</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm">
            <Lock className="w-3.5 h-3.5 text-blue-300" />
            <span className="text-xs font-semibold text-blue-200">Securing Digital India</span>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            {step === 1 
              ? "Login to access your secure dashboard" 
              : `Enter the 6-digit OTP sent to your phone`
            }
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide px-1">
                Phone Number
              </label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError("") }}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800/80 border-2 border-slate-700 focus:border-blue-500 focus:bg-slate-800 outline-none transition-all text-white placeholder:text-slate-500 text-lg font-medium shadow-lg shadow-black/20"
                />
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sending || phone.length !== 10}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Send OTP</span>
                </>
              )}
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
              <span className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">OR</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3.5 bg-white/10 hover:bg-white/15 border-2 border-white/20 hover:border-white/30 rounded-2xl font-semibold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.69-2.23 1.1-3.71 1.1-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.69-.35-1.43-.35-2.18s.13-1.49.35-2.18V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="pt-8 text-center border-t border-slate-800/50">
              <Link 
                href="/admin/login" 
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-400 transition-all group"
              >
                <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>Admin Portal Login</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide px-1">
                Enter OTP
              </label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpInputsRef.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 rounded-xl bg-slate-800/80 border-2 border-slate-700 focus:border-blue-500 text-center text-2xl font-bold outline-none transition-all text-white shadow-lg shadow-black/20"
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={verifying || otp.join("").length !== 6}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Verify & Access Dashboard</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={resendTimer > 0 || sending}
              className={`w-full py-3 rounded-2xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
                resendTimer > 0
                  ? "bg-slate-800/50 text-slate-400 cursor-not-allowed"
                  : "bg-slate-800/80 hover:bg-slate-800 border-2 border-slate-700 hover:border-slate-600 text-white"
              }`}
            >
              {resendTimer > 0 ? (
                <span>Resend OTP in {resendTimer}s</span>
              ) : (
                <span>Resend OTP</span>
              )}
            </button>

            <button
              onClick={goBack}
              className="w-full py-3 text-slate-400 hover:text-white text-sm font-medium transition-colors underline"
            >
              Change Phone Number
            </button>
          </div>
        )}

        <div className="pt-6 text-center">
          <p className="text-xs text-slate-500">
            Protected by <span className="font-semibold text-blue-400">256-bit encryption</span> • 
            <span className="mx-1">ISO 27001 certified</span>
          </p>
        </div>
      </div>
    </div>
  )
}
