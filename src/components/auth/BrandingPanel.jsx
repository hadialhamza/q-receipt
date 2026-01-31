import Logo from "@/components/Logo";

const features = [
  "Instant QR code generation",
  "Secure cloud storage",
  "Easy sharing & tracking",
  "Professional templates",
];

export default function BrandingPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-size-[32px_32px]" />
      <div className="absolute top-0 right-0 size-96 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 size-96 bg-primary-foreground/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
        {/* Logo */}
        <div>
          <Logo size="lg" variant="inverted" />
        </div>

        {/* Main Content */}
        <div className="space-y-6 max-w-md">
          <h1 className="font-heading text-4xl xl:text-5xl font-bold leading-tight">
            Streamline Your Receipt Management
          </h1>
          <p className="text-lg text-primary-foreground/90 leading-relaxed">
            Generate, manage, and share QR-enabled receipts with ease. Perfect
            for businesses of all sizes.
          </p>

          {/* Features */}
          <div className="space-y-4 pt-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="size-1.5 rounded-full bg-secondary" />
                <span className="text-primary-foreground/80">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-sm text-primary-foreground/60">
          © 2026 QReceipt. All rights reserved.
        </p>
      </div>
    </div>
  );
}
