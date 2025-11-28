import Image from "next/image";
import { Faq1 } from "./components/faq/FaqQA";
import { TextBar } from "../../components/core/TextBar";
import { Button } from "../../components/ui/button";

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

        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl font-display text-center">
            Frequently Asked Questions
          </h2>

          <p className="text-center text-muted-fg">
            Get answer to the most questions about The Weekday and our services.
          </p>

          <Faq1 />
        </div>

        <div className=" z-10 max-w-5xl mx-auto  mt-10 w-80 lg:w-auto  lg:h-80 rounded-[2rem] lg:rounded-[4rem] border border-muted-fg/50 bg-surface inset-shadow- inset-shadow-black/80 px-2 md:px-8 ">
          <div className="flex flex-col items-center gap-4 p-4 lg:p-12">
            <h1 className="lg:text-3xl text-lg font-display text-center">
              Be an Artist Today!
            </h1>
            <p className="text-xs text-center text-muted-fg ">
              Join The Weekday and take your first step towards becoming a
              recognized artist. <br />
              Upload your tracks, grow your audience, and rise through the
              ranks.
            </p>
            <TextBar
              text="Be an artist and upload you artwork instantly"
              icon
            />
            <Button>Get Started</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
