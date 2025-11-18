import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex mt-32 w-full justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl p-8 md:border">
        <LoginForm />
      </div>
    </div>
  );
}
