import React from "react";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import InputField from "@/components/CustomFields/InputField";
import { Button } from "@/components/ui/button";

interface MessageFormValues {
  messageText: string;
}

interface MessageComposerProps {
  recipientName: string;
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = React.memo(
  ({ recipientName, onSendMessage, disabled }) => {
    const form = useForm<MessageFormValues>({
      defaultValues: { messageText: "" },
    });

    const onSubmit = async (values: MessageFormValues) => {
      const text = values.messageText.trim();
      if (!text) return;
      form.setValue("messageText", "");
      await onSendMessage(text);
    };

    return (
      <footer className="p-4 bg-[#14171d]/80 border-t border-white/[0.06]">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-3">
          <div className="flex-1">
            <InputField<MessageFormValues>
              form={form}
              name="messageText"
              placeholder={`Type your message to ${recipientName}...`}
              isLabelDisabled={true}
              disabled={disabled}
            />
          </div>

          <Button
            type="submit"
            disabled={disabled}
            className="size-11 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200 active:scale-95 shadow-md transition-all cursor-pointer shrink-0 font-semibold"
            title="Send message"
          >
            <Send size={15} />
          </Button>
        </form>
      </footer>
    );
  }
);

MessageComposer.displayName = "MessageComposer";
