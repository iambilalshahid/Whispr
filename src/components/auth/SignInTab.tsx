import React from "react";
import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CustomInputField from "@/components/CustomFields/CustomInputField";
import PasswordField from "@/components/CustomFields/PasswordField";
import LatticeLoader from "@/components/LatticeLoader";
import { Fingerprint } from "lucide-react";

export interface SignInFormValues {
  email: string;
  password: string;
}

interface SignInTabProps {
  form: UseFormReturn<SignInFormValues>;
  onSubmit: (values: SignInFormValues) => void;
  loading: boolean;
  onBiometricSignIn?: () => void;
  biometricLoading?: boolean;
  isBiometricAvailable?: boolean;
}

export const SignInTab: React.FC<SignInTabProps> = ({
  form,
  onSubmit,
  loading,
  onBiometricSignIn,
  biometricLoading,
  isBiometricAvailable,
}) => {
  return (
    <motion.div
      key="signin-tab"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="w-full"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <CustomInputField<SignInFormValues>
          form={form}
          name="email"
          type="email"
          autoComplete="email"
          fieldName="Email"
          placeholder="Enter your email"
          isRequired={true}
          isDisabled={false}
        />

        {/* Password */}
        <PasswordField<SignInFormValues>
          form={form}
          name="password"
          autoComplete="current-password"
          fieldName="Password"
          placeholder="Enter your password"
          isRequired={true}
          labelClassName="text-zinc-400 text-xs font-normal"
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading || biometricLoading}
          className="w-full h-[46px] mt-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-[14px] transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center"
        >
          {loading ? (
            <LatticeLoader
              status="working"
              label="Signing in"
              doneLabel="Done in"
              errorLabel="Failed after"
              pattern="orbit"
              grid={3}
              shape="round"
              doneColor="#22c55e"
              errorColor="#ef4444"
              cellSize={4}
              gap={2}
              fontSize={13}
              step={90}
              idleOpacity={0.15}
              glow={false}
              glowColor=""
              showTimer={false}
              color="#09090b"
            />
          ) : (
            <span>Sign in</span>
          )}
        </Button>

        {/* Windows Hello / Fingerprint Biometric Sign In */}
        {isBiometricAvailable && (
          <div className="pt-2">
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-white/[0.08] w-full" />
              <span className="bg-[#17171b] px-2 text-[10.5px] uppercase tracking-wider text-zinc-500 font-semibold absolute">
                or
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={loading || biometricLoading}
              onClick={onBiometricSignIn}
              className="w-full h-[44px] rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/20 text-white font-medium text-[13px] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {biometricLoading ? (
                <LatticeLoader
                  status="working"
                  label="Verifying Biometrics"
                  doneLabel="Done in"
                  errorLabel="Failed after"
                  pattern="orbit"
                  grid={3}
                  shape="round"
                  doneColor="#22c55e"
                  errorColor="#ef4444"
                  cellSize={4}
                  gap={2}
                  fontSize={12}
                  step={90}
                  idleOpacity={0.15}
                  glow={false}
                  glowColor=""
                  showTimer={false}
                  color="#ffffff"
                />
              ) : (
                <>
                  <Fingerprint size={16} className="text-emerald-400" />
                  <span>Sign in with Windows Hello / Fingerprint</span>
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </motion.div>
  );
};
