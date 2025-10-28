"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Pen, User } from "lucide-react";
import { PhoneDialog } from "./PhoneDialog";
import { PasswordDialog } from "./PasswordDialog";
import { EmailDialog } from "./EmailDialog";

const UpdateUser = () => {
  const [phone, setPhone] = useState("99780680");
  const [email, setEmail] = useState("mimosa.universe@gmail.com");
  const [password, setPassword] = useState("************");

  const [active, setActive] = useState<"phone" | "email" | "password" | null>(null);
  const [tempValue, setTempValue] = useState("");

  const openDialog = (field: "phone" | "email" | "password") => {
    setActive(field);
    setTempValue(field === "phone" ? phone : field === "email" ? email : "");
  };

  const closeDialog = () => setActive(null);

  const saveDialog = () => {
    if (active === "phone") setPhone(tempValue);
    if (active === "email") setEmail(tempValue);
    if (active === "password") setPassword("************");
    closeDialog();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-5">
      <p className="mb-6 text-xl font-medium text-center text-[#441500]">
        Хэрэглэгчийн хэсэг
      </p>

      {/* Profile icon */}
      <div className="p-5 mb-6 border rounded-full w-[100px] h-[100px] flex items-center justify-center bg-gray-50">
        <User size={60} className="text-gray-600" />
      </div>

      <div className="w-full max-w-sm">
        <div className="p-5 space-y-4">
          {/* Phone */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Утас:</p>
              <p className="text-lg text-gray-800">{phone}</p>
            </div>
            <button
              onClick={() => openDialog("phone")}
              className="p-2 transition rounded-full hover:bg-gray-100"
            >
              <Pen className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="border"></div>
          {/* Email */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Имэйл хаяг:</p>
              <p className="text-lg text-gray-800">{email}</p>
            </div>
            <button
              onClick={() => openDialog("email")}
              className="p-2 transition rounded-full hover:bg-gray-100"
            >
              <Pen className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="border"></div>
          {/* Password */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Нууц үг:</p>
              <p className="text-lg text-gray-800">{password}</p>
            </div>
            <button
              onClick={() => openDialog("password")}
              className="p-2 transition rounded-full hover:bg-gray-100"
            >
              <Pen className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <PhoneDialog
        open={active === "phone"}
        value={tempValue}
        onChange={setTempValue}
        onClose={closeDialog}
        onSave={saveDialog}
      />
      <EmailDialog
        open={active === "email"}
        value={tempValue}
        onChange={setTempValue}
        onClose={closeDialog}
        onSave={saveDialog}
      />
      <PasswordDialog
        open={active === "password"}
        onClose={closeDialog}
        onSave={saveDialog}
      />
    </div>
  );
};

export default UpdateUser;