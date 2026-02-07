"use client";

export default function Hero() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden py-12">
      {/* Background gradient + blur */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1A2F23] to-[#F5F2ED]" />
      <div className="absolute top-20 right-20 -z-10 h-96 w-96 rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      <div className="absolute bottom-20 left-20 -z-10 h-96 w-96 rounded-full bg-primary/10 opacity-20 blur-[100px]" />

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          {/* Headline */}
          <div className="space-y-4">
            <h1 className="font-bold text-5xl tracking-tight sm:text-6xl md:text-7xl">
              Find Your Perfect
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Clinical Trial
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed sm:text-xl md:text-2xl">
              AI-powered symptom matching to discover oncology trials tailored
              to you
            </p>
          </div>

          {/* CTA - Chat box teaser */}
          <div className="w-full max-w-2xl pt-8">
            <div className="rounded-2xl border border-muted-foreground/20 bg-background/50 p-1 shadow-2xl backdrop-blur-sm">
              <div className="space-y-4 rounded-xl bg-background p-6">
                <p className="text-muted-foreground text-sm">
                  Tell us about your symptoms
                </p>
                <input
                  className="w-full rounded-lg bg-muted/50 px-4 py-3 text-sm transition-all placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="I've been feeling exhausted and losing weight..."
                  readOnly
                  type="text"
                />
                <p className="text-muted-foreground text-xs">
                  Start chatting below
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer badge */}
          <div className="mt-8 max-w-lg text-muted-foreground text-xs">
            ⚕️ Always consult with a healthcare provider before making medical
            decisions. This tool is for discovery, not diagnosis.
          </div>
        </div>
      </div>
    </section>
  );
}
