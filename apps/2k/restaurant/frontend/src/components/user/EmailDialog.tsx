"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface EmailDialogProps {
  open: boolean;
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export function EmailDialog({ open, value, onChange, onClose, onSave }: EmailDialogProps) {
     const handleSave = () => {
    alert(`Email амжилттай шинэчлэгдлээ`); 
    onSave(); 
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[350px]">
         <DialogClose
          asChild
          className="absolute text-gray-500 cursor-pointer right-3 top-3 hover:text-gray-800"
        >
          <button aria-label="Close">
            <X size={20} />
          </button>
        </DialogClose>

        <DialogHeader>
          <DialogTitle>Имэйл хаяг</DialogTitle>
        </DialogHeader>
        <Input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Шинэ имэйл хаяг"
        />
        <DialogFooter className="flex justify-end gap-2 mt-1">
          <button className="bg-[#441500] hover:bg-[#5a1a00] text-white px-4 py-2 rounded-md transition-colors w-full" onClick={handleSave}>Шинэчлэх</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
