"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignupMutation } from "../../../generated";

const emailOnly = z.string().min(1, "Шаардлагатай").email("Зөв имэйл оруулна уу");

const schema = z.object({
  contact: emailOnly,
  password: z.string().min(6, "Дор хаяж 6 тэмдэгт"),
  fullName: z.string().min(2, "Дор хаяж 2 тэмдэгт"),
  username: z
    .string()
    .min(3, "Дор хаяж 3 тэмдэгт")
    .max(30, "30 тэмдэгтээс хэтрэхгүй")
    .regex(/^[a-z0-9._]+$/i, "Зөвхөн латин, тоо, _ .")
    .refine((v) => !/[_.]{2,}/.test(v), "Дараалсан _ эсвэл . хориотой")
    .refine((v) => !/^[_\.]|[_\.]$/.test(v), "Эхэнд/төгсгөлд _ эсвэл . байж болохгүй"),
});
type FormValues = z.infer<typeof schema>;

function useDebouncedAsync<T extends (...a: any[]) => Promise<any>>(fn: T, delay = 400) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  return (...args: Parameters<T>) =>
    new Promise<Awaited<ReturnType<T>>>((resolve) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        const result = await fn(...args);
        resolve(result);
      }, delay);
    });
}

export default function SignupPage() {
  const router = useRouter();
  const [signup, { loading: signingUp }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { contact: "", password: "", fullName: "", username: "" },
  });

  const [checking, setChecking] = useState(false);
  const username = watch("username");

  const checkUsernameCore = async (v: string) => {
    if (!v || v.length < 3) return true;
    setChecking(true);
    const start = Date.now();
    await new Promise((r) => setTimeout(r, 300));
    const ok = true;
    const elapsed = Date.now() - start;
    if (elapsed < 200) await new Promise((r) => setTimeout(r, 200 - elapsed));
    setChecking(false);
    return ok ? true : "A user with that username already exists.";
  };

  const debouncedValidateUsername = useDebouncedAsync(checkUsernameCore, 400);

  const usernameRegister = register("username", {
    validate: (v) => debouncedValidateUsername(v),
  });

  const onSubmit = async (values: FormValues) => {

    const email = values.contact;
    try {
      const res = await signup({
        variables: {

          input: {
            contact: email,
            password: values.password,
            fullName: values.fullName,
            username: values.username,
          },
        },
      });

      if (res.data?.signup?.user.id) router.push("/(auth)/login");
    } catch (e: any) {
      const msg =
        e?.graphQLErrors?.[0]?.message ||
        e?.networkError?.message ||
        e?.message ||
        "Something went wrong.";
      if (/username/i.test(msg) && /(exist|taken|duplicate|already)/i.test(msg)) {
        setError("username", { type: "server", message: "A user with that username already exists." });
      } else if (/email|contact/i.test(msg) && /(exist|taken|duplicate|already)/i.test(msg)) {
        setError("contact", { type: "server", message: "An account with that email already exists." });
      } else {
        setError("password", { type: "server", message: msg });
      }
    }
  };

  const disabled = isSubmitting || signingUp || checking || !isValid || !isDirty;

  return (
    <div className="min-h-screen grid place-items-center bg-[#FAFAFA] px-4">
      <div className="w-[364px]">
        <div className="w-[364px] bg-white border border-[#DBDBDB] rounded-[12px] flex flex-col items-center pt-6 pb-6">
          <Image
            src="/logo.png"
            alt="Instagram"
            width={186}
            height={53}
            priority
            className="w-[186px] h-[53px] select-none pointer-events-none"
          />

          <p className="mt-2 w-[316px] text-center text-[12px] leading-4 text-[#737373]">
            <span>Sign up to see photos and videos</span>
            <br />
            <span>from your friends</span>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-3 w-full flex flex-col items-center gap-5" noValidate>
            <input
              autoComplete="email"
              placeholder="Mobile Number or Email"
              aria-invalid={!!errors.contact}
              className={`w-[316px] h-[36px] rounded-[8px] border px-3 text-[14px] placeholder:text-[#A8A8A8]
                          bg-[#FAFAFA] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#DBDBDB]
                          ${errors.contact ? "border-red-400" : "border-[#DBDBDB]"}`}
              {...register("contact")}
            />
            {errors.contact && <p className="w-[316px] text-[12px] text-red-600">{errors.contact.message}</p>}

            <input
              type="password"
              autoComplete="new-password"
              placeholder="Password"
              aria-invalid={!!errors.password}
              className={`w-[316px] h-[36px] rounded-[8px] border px-3 text-[14px] placeholder:text-[#A8A8A8]
                          bg-[#FAFAFA] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#DBDBDB]
                          ${errors.password ? "border-red-400" : "border-[#DBDBDB]"}`}
              {...register("password")}
            />
            {errors.password && <p className="w-[316px] text-[12px] text-red-600">{errors.password.message}</p>}

            <input
              autoComplete="name"
              placeholder="Full Name"
              aria-invalid={!!errors.fullName}
              className={`w-[316px] h-[36px] rounded-[8px] border px-3 text-[14px] placeholder:text-[#A8A8A8]
                          bg-[#FAFAFA] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#DBDBDB]
                          ${errors.fullName ? "border-red-400" : "border-[#DBDBDB]"}`}
              {...register("fullName")}
            />
            {errors.fullName && <p className="w-[316px] text-[12px] text-red-600">{errors.fullName.message}</p>}

            <div className="relative w-[316px]">
              <input
                autoComplete="username"
                placeholder="Username"
                aria-invalid={!!errors.username}
                aria-busy={checking || undefined}
                className={`w-full h-[36px] rounded-[8px] border px-3 text-[14px] placeholder:text-[#A8A8A8]
                            bg-[#FAFAFA] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#DBDBDB]
                            ${errors.username ? "border-red-400" : "border-[#DBDBDB]"}`}
                {...usernameRegister}
              />
              {checking && (
                <span role="status" className="pointer-events-none absolute inset-0 grid place-items-center">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  <span className="sr-only">Checking…</span>
                </span>
              )}
            </div>
            {errors.username && <p className="w-[316px] text-[12px] text-red-600">{errors.username.message}</p>}

            <div className="w-[316px] text-center">
              <p className="text-[12px] leading-4 text-[#737373]">
                <span>People who use our service may have uploaded</span><br />
                <span>your contact information to Instagram. </span>
                <a href="#" className="text-[#0095F6] font-medium hover:underline">
                  Learn<br />More.
                </a>
              </p>
            </div>

            <p className="w-[316px] text-center text-[12px] leading-4 text-[#737373]">
              By signing up, you agree to our{" "}
              <a href="#" className="text-[#0095F6] hover:underline">Terms</a>
              <span>{' '} , {' '}</span>
              <a href="#" className="text-[#0095F6] hover:underline">
                Privacy<br />Policy
              </a>
              <span>{' '}</span>
              and{" "}
              <a href="#" className="text-[#0095F6] hover:underline">Cookies&nbsp;Policy</a>.
            </p>

            <button
              type="submit"
              disabled={disabled}
              aria-disabled={disabled}
              className={`w-[316px] h-[36px] rounded-[10px] text-white text-[14px] font-semibold transition
                ${disabled ? "bg-[#2563EB]/50 cursor-not-allowed" : "bg-[#2563EB] hover:bg-[#1D4ED8]"}`}
            >
              {(isSubmitting || signingUp || checking) ? "Signing up..." : "Sign up"}
            </button>
          </form>
        </div>

        <div className="mt-3 w-[364px] h-[72px] bg-white border border-[#DBDBDB] rounded-[12px] grid place-items-center">
          <div>
            <span className="text-[14px] text-[#262626]">Have an account? </span>
            <Link href="/(auth)/login" className="text-[14px] text-[#0095F6] font-medium">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
