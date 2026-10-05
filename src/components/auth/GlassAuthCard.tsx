import React, { useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusAlert } from "@/components/StatusAlert";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { SignUpTab, SignUpFormValues } from "./SignUpTab";
import { SignInTab, SignInFormValues } from "./SignInTab";
import { supabase } from "@/lib/supabase";
import { Button } from "../ui/button";
import { toast } from "@/components/ui/toast";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  isWebAuthnAvailable,
  registerBiometricPasskey,
  authenticateWithBiometrics,
  getStoredBiometricCredential,
} from "@/lib/webauthn";

interface AuthCardProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export const GlassAuthCard: React.FC<AuthCardProps> = ({ onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<string>("signin");
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  // Check if WebAuthn / Windows Hello is available
  React.useEffect(() => {
    isWebAuthnAvailable().then((available) => {
      setIsBiometricAvailable(available);
      const stored = getStoredBiometricCredential();
      if (stored?.email) {
        signInForm.setValue("email", stored.email);
      }
    });
  }, []);

  const signUpForm = useForm<SignUpFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+1",
      phone: "",
      password: "",
    },
  });

  const signInForm = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignUp = async (values: SignUpFormValues) => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const generatedPassword = values.password || "Password@123456";
      const fullPhone = values.phone ? `${values.countryCode} ${values.phone}` : "";
      const { error, data } = await supabase.auth.signUp({
        email: values.email,
        password: generatedPassword,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            phone: fullPhone,
          },
        },
      });

      if (error) throw error;

      // Register Windows Hello Passkey credential if available
      if (isBiometricAvailable) {
        try {
          await registerBiometricPasskey(values.email);
        } catch {
          // Non-blocking if cancelled
        }
      }

      if (data.session) {
        setStatusMessage({ type: "success", text: "Account created and logged in!" });
        toast.add({
          type: "success",
          title: "Account Created",
          description: "Welcome! Your account was created and you are now signed in.",
        });
      } else {
        setStatusMessage({
          type: "success",
          text: "Verification email sent! Check your inbox to activate.",
        });
        toast.add({
          type: "info",
          title: "Verify Your Email",
          description: "Verification link sent! Check your inbox to activate your account.",
        });
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      const errMsg = error.message || "Failed to create account";
      setStatusMessage({ type: "error", text: errMsg });
      toast.add({
        type: "error",
        title: "Registration Failed",
        description: errMsg,
        priority: "high",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (values: SignInFormValues) => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      // Offer / register biometric passkey for this email if not yet registered
      if (isBiometricAvailable) {
        const stored = getStoredBiometricCredential();
        if (!stored || stored.email !== values.email) {
          try {
            await registerBiometricPasskey(values.email);
          } catch {
            // User can cancel enrollment without blocking signin
          }
        }
      }

      setStatusMessage({ type: "success", text: "Signed in successfully!" });
      toast.add({
        type: "success",
        title: "Welcome Back",
        description: "You have signed in successfully.",
      });
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const error = err as { message?: string };
      const errMsg = error.message || "Invalid credentials";
      setStatusMessage({ type: "error", text: errMsg });
      toast.add({
        type: "error",
        title: "Sign In Failed",
        description: errMsg,
        priority: "high",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricSignIn = async () => {
    setBiometricLoading(true);
    setStatusMessage(null);
    try {
      const email = signInForm.getValues("email");
      const result = await authenticateWithBiometrics(email);

      if (result.success) {
        // Authenticated natively via Windows Hello
        setStatusMessage({
          type: "success",
          text: "Windows Hello biometric verified successfully!",
        });
        toast.add({
          type: "success",
          title: "Biometric Verified",
          description: "Windows Hello authentication succeeded.",
        });
        if (onSuccess) onSuccess();
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      const errMsg = error.message || "Windows Hello biometric verification cancelled.";
      setStatusMessage({
        type: "error",
        text: errMsg,
      });
      toast.add({
        type: "error",
        title: "Biometric Error",
        description: errMsg,
        priority: "high",
      });
    } finally {
      setBiometricLoading(false);
    }
  };

  return (
    <div
      className="relative w-full max-w-[460px] rounded-[32px] p-8 sm:p-9 text-white shadow-2xl overflow-hidden border border-white/[0.08]"
      style={{
        background: "rgba(23, 23, 27, 0.65)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
      }}
    >
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          if (val) {
            setActiveTab(val);
            setStatusMessage(null);
          }
        }}
        className="w-full gap-0"
      >
        {/* Top Header: TabsList with Sliding Active Indicator & Close Button */}
        <div className="flex items-center justify-between mb-8">
          <TabsList className="h-11! p-1 bg-black/40 border border-white/[0.06] rounded-full gap-1 relative">
            <TabsTrigger
              value="signup"
              className="relative z-10 px-5 py-2 rounded-full text-[13px] font-medium transition-colors cursor-pointer data-active:text-white text-zinc-400 hover:text-white"
            >
              Sign up
              {activeTab === "signup" && (
                <motion.div
                  layoutId="active-pill"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  className="absolute inset-0 bg-[#25252b] rounded-full -z-10 shadow-sm border border-white/[0.06]"
                />
              )}
            </TabsTrigger>

            <TabsTrigger
              value="signin"
              className="relative z-10 px-5 py-2 rounded-full text-[13px] font-medium transition-colors cursor-pointer data-active:text-white text-zinc-400 hover:text-white"
            >
              Sign in
              {activeTab === "signin" && (
                <motion.div
                  layoutId="active-pill"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  className="absolute inset-0 bg-[#25252b] rounded-full -z-10 shadow-sm border border-white/[0.06]"
                />
              )}
            </TabsTrigger>
          </TabsList>

          {/* Circular Close Button with Reusable ConfirmDialog */}
          <ConfirmDialog
            title="Exit Application?"
            description="Are you sure you want to close the desktop application? Any unsaved progress will be lost."
            confirmText="Close App"
            cancelText="Cancel"
            variant="destructive"
            onConfirm={async () => {
              toast.add({
                type: "info",
                title: "Exiting Application",
                description: "Closing the application window...",
              });
              try {
                await getCurrentWindow().close();
              } catch {
                if (onClose) onClose();
              }
            }}
            trigger={
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="size-9 rounded-full bg-white/[0.06] hover:bg-white/[0.08] focus-within:bg-white/[0.1] border border-white/[0.08] focus-within:border-white/20 text-white placeholder:text-zinc-500 text-[13.5px] outline-none transition-all cursor-pointer"
                aria-label="Close"
              >
                <X size={15} />
              </Button>
            }
          />
        </div>

        {/* Title */}
        <motion.h2
          key={activeTab}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-[26px] sm:text-[28px] font-semibold text-white tracking-tight mb-6"
        >
          {activeTab === "signup" ? "Create an account" : "Welcome back"}
        </motion.h2>

        {/* Status Feedback Notification Alert */}
        {statusMessage && (
          <StatusAlert
            variant={statusMessage.type}
            message={statusMessage.text}
            onDismiss={() => setStatusMessage(null)}
          />
        )}

        {/* Animated Tab Panels with AnimatePresence */}
        <AnimatePresence mode="wait">
          {activeTab === "signup" ? (
            <TabsContent key="signup-content" value="signup" className="mt-0 outline-none">
              <SignUpTab
                form={signUpForm}
                onSubmit={handleSignUp}
                loading={loading}
              />
            </TabsContent>
          ) : (
            <TabsContent key="signin-content" value="signin" className="mt-0 outline-none">
              <SignInTab
                form={signInForm}
                onSubmit={handleSignIn}
                loading={loading}
                onBiometricSignIn={handleBiometricSignIn}
                biometricLoading={biometricLoading}
                isBiometricAvailable={isBiometricAvailable}
              />
            </TabsContent>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default GlassAuthCard;
