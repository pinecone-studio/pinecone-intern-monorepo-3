"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface PasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (oldPass: string, newPass: string, confirmPass: string) => void;
}

export function PasswordDialog({ open, onClose, onSave }: PasswordDialogProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
    const handleSave = () => {
    if (newPassword !== confirmPassword) {
      alert("Шинэ нууц үг болон давталт таарахгүй байна!");
      return;
    }

    alert("Нууц үг амжилттай шинэчлэгдлээ"); 
    onSave(oldPassword, newPassword, confirmPassword);
  };


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="relative sm:max-w-[380px]">
        <DialogClose
          asChild
          className="absolute text-gray-500 cursor-pointer right-3 top-3 hover:text-gray-800"
        >
          <button aria-label="Close">
            <X size={20} />
          </button>
        </DialogClose>

        <DialogHeader>
          <DialogTitle>Нууц үг</DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-3">
          <div>
            <Input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Хуучин нууц үгээ оруулна уу"
            />
          </div>
          <div>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Шинэ нууц үг"
            />
          </div>
          <div>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Шинэ нууц үг давтах"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end mt-4">
          <button
            className="bg-[#441500] hover:bg-[#5a1a00] text-white px-4 py-2 rounded-md transition-colors w-full"
            onClick={handleSave}
          >
            Шинэчлэх
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
