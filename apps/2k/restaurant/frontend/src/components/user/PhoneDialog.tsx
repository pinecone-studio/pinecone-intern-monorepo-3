"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";


interface PhoneDialogProps {
  open: boolean;
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export function PhoneDialog({ open, value, onChange, onClose, onSave }: PhoneDialogProps) {
    const handleSave = () => {
    alert(`${value} амжилттай шинэчлэгдлээ`); 
    onSave(); 
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="relative sm:max-w-[350px]">
        <DialogClose
          asChild
          className="absolute text-gray-500 cursor-pointer right-3 top-3 hover:text-gray-800"
        >
          <button aria-label="Close">
            <X size={20} />
          </button>
        </DialogClose>

        <DialogHeader>
          <DialogTitle>Утас</DialogTitle>
        </DialogHeader>

        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0000-0000"
        />

        <DialogFooter className="flex justify-end gap-2 mt-1">
          <button className="bg-[#441500] hover:bg-[#5a1a00] text-white px-4 py-2 rounded-md transition-colors w-full" onClick={handleSave}>Шинэчлэх</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
