import Image from "next/image";
import { Faq1 } from "./Faq/FaqQA";

// GRADIENT FLOATING AROUND FAQ
export function Gradient() {
  return (
    <div
      aria-hidden
      className="
        absolute
        left-1/2
        lg:top-[22rem]
        -translate-x-1/2
        -translate-y-1/2
        pointer-events-none
        z-0
      "
    >
      <Image
        src="/gradient_rectangle.png"
        width={1200}
        height={200}
        alt="gradient"
        className="opacity-80 blur-3xl rounded-[12rem]"
      />
    </div>
  );
}

export function Faq() {
  return (
    <section
      className="
        relative
        w-full
        mt-60
      "
    >
      <Gradient />

      <div
        className="
          relative
          bg-background
          border-t
          border-muted-fg
          pt-16
          pb-32
        "
      >
        <div
          className="
            absolute
            left-1/2
            -top-6              
            -translate-x-1/2
            z-20
          "
        >
          <div
            className="
              px-6
              py-2
              rounded-full
              bg-white/10
              border
              border-muted-fg
              text-sm
              text-white
              backdrop-blur-md
            "
          >
            Our FAQ
          </div>
        </div>

        {/* centered content on desktop */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl font-display text-center">
            Frequently Asked Questions
          </h2>

          <p className="text-center text-muted-fg">
            Get answer to the most questions about DrillRecord and our services.
          </p>

          <Faq1 />
        </div>
      </div>
    </section>
  );
}
