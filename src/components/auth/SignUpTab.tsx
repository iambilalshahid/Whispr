import CustomInputField from "@/components/CustomFields/CustomInputField";
import DropdownMenuField from "@/components/CustomFields/DropdownMenuField";
import PasswordField from "@/components/CustomFields/PasswordField";
import { Button } from "@/components/ui/button";
import { countryCodeOptions } from "@/constant";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import LatticeLoader from "@/components/LatticeLoader";

export interface SignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  password?: string;
}

interface SignUpTabProps {
  form: UseFormReturn<SignUpFormValues>;
  onSubmit: (values: SignUpFormValues) => void;
  loading: boolean;
}

export const SignUpTab: React.FC<SignUpTabProps> = ({ form, onSubmit, loading }) => {
  return (
    <motion.div
      key="signup-tab"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="w-full"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <CustomInputField<SignUpFormValues>
            form={form}
            name="firstName"
            autoComplete="given-name"
            fieldName="First Name"
            placeholder="John"
            isRequired={true}
            isDisabled={false}
          />
          <CustomInputField<SignUpFormValues>
            form={form}
            name="lastName"
            autoComplete="family-name"
            fieldName="Last Name"
            placeholder="Last name"
            isRequired={false}
            isDisabled={false}
          />
        </div>

        {/* Email */}
        <CustomInputField<SignUpFormValues>
          form={form}
          name="email"
          type="email"
          autoComplete="email"
          fieldName="Email"
          placeholder="Enter your email"
          isRequired={true}
          isDisabled={false}
        />

        {/* Country Code & Phone Number */}
        <div className="grid grid-cols-[130px_1fr] gap-2 items-start">
          <DropdownMenuField<SignUpFormValues>
            form={form}
            name="countryCode"
            fieldName="Country"
            placeholder="Country"
            options={countryCodeOptions}
            isRequired={false}
          />
          <CustomInputField<SignUpFormValues>
            form={form}
            name="phone"
            type="tel"
            autoComplete="tel-national"
            fieldName="Phone"
            placeholder="(775) 351-6501"
            isRequired={false}
            isDisabled={false}
          />
        </div>

        {/* Password */}
        <PasswordField<SignUpFormValues>
          form={form}
          name="password"
          autoComplete="new-password"
          fieldName="Password (optional)"
          placeholder="Create password"
          isRequired={false}
          labelClassName="text-zinc-400 text-xs font-normal"
          Icon={Lock}
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-[46px] mt-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-[14px] transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center"
        >
          {loading ? (
            <LatticeLoader
              status="working"
              label="Creating account"
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
            <span>Create an account</span>
          )}
        </Button>

        {/* Footer */}
        <p className="text-[11.5px] text-zinc-500 text-center pt-2 leading-relaxed">
          By creating an account, you agree to our{" "}
          <a
            href="#terms"
            className="text-zinc-400 hover:text-white transition-colors underline underline-offset-2"
          >
            Terms & Service
          </a>
        </p>
      </form>
    </motion.div>
  );
};
