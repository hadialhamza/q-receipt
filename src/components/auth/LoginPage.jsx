import Logo from "@/components/Logo";
import BrandingPanel from "@/components/auth/BrandingPanel";
import LoginForm from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex relative">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left Side - Branding & Info (Client Component) */}
      <BrandingPanel />

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-6 left-1/2 -translate-x-1/2">
          <Logo size="md" />
        </div>

        {/* Login Form (Client Component) */}
        <LoginForm />
      </div>
    </div>
  );
}
