// app/(marketing)/register/page.tsx

import RegisterForm from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div className="flex mt-32 w-full justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl p-8 md:border">
        <RegisterForm />
      </div>
    </div>
  );
}
