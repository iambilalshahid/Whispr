import React from "react";
import { useForm } from "react-hook-form";
import { UserPlus } from "lucide-react";
import InputField from "@/components/CustomFields/InputField";
import { Button } from "@/components/ui/button";
import LatticeLoader from "@/components/LatticeLoader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { observer } from "mobx-react-lite";
import { chatStore } from "@/stores";

interface AddFriendFormValues {
  publicId: string;
}

export const AddFriendDialog: React.FC = observer(() => {
  const form = useForm<AddFriendFormValues>({
    defaultValues: { publicId: "" },
  });

  const onSubmit = async (values: AddFriendFormValues) => {
    await chatStore.addFriend(values.publicId);
    form.reset();
  };

  return (
    <Dialog
      open={chatStore.isAddFriendOpen}
      onOpenChange={(open) => chatStore.setIsAddFriendOpen(open)}
    >
      <DialogContent className="bg-[#181c24] border-white/10 text-white rounded-3xl max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-white">
            Add Friend by Public ID
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Enter your friend's unique public ID (e.g.{" "}
            <code className="text-emerald-400 font-mono">user_2fd4b2b2</code>) to
            connect instantly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <InputField<AddFriendFormValues>
            form={form}
            name="publicId"
            placeholder="user_8f92a1"
            fieldName="Friend's Public ID"
            isRequired={true}
            Icon={UserPlus}
          />

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                chatStore.setIsAddFriendOpen(false);
                form.reset();
              }}
              className="rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={chatStore.addLoading}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold cursor-pointer h-9 px-4 flex items-center justify-center"
            >
              {chatStore.addLoading ? (
                <LatticeLoader
                  status="working"
                  label="Adding"
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
                "Add Friend"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
);

AddFriendDialog.displayName = "AddFriendDialog";
