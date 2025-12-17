import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface Faq1Props {
  heading?: string;
  items?: FaqItem[];
}

export const Faq1 = ({
  items = [
    {
      id: "what-is-Weekday",
      question: "What is Weekday?",
      answer:
        "A music website where artists upload songs and listeners discover new tracks.",
    },
    {
      id: "create-account",
      question: "How do I create an account?",
      answer: "Click Sign Up, fill your details, and confirm your email.",
    },
    {
      id: "reset-password",
      question: "How can I reset my password?",
      answer:
        "On the login page click “Forgot Password” and follow the email link.",
    },
    {
      id: "become-artist",
      question: "How do I become an artist?",
      answer: "Go to Profile → “Become an Artist” and complete the setup.",
    },
    {
      id: "upload-song",
      question: "How do I upload a song?",
      answer:
        "Dashboard → My Songs → Upload Song, add a title and select your file.",
    },
    {
      id: "song-requirements",
      question: "What audio files are allowed?",
      answer: "mp3, m4a, wav, ogg. Max size is 15MB per song.",
    },
    {
      id: "pending-review",
      question: "Why is my song pending?",
      answer: "Uploads are reviewed before going public.",
    },
    {
      id: "edit-delete-song",
      question: "Can I edit or delete my song?",
      answer: "Yes, from My Songs you can update title or delete it.",
    },
    {
      id: "copyright",
      question: "Can I upload copyrighted music?",
      answer: "No. Only upload music you own or have permission to share.",
    },
    {
      id: "support",
      question: "How do I contact support?",
      answer: "Use the Help/Contact page to send us a message.",
    },
  ],
}: Faq1Props) => {
  const mid = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, mid);
  const rightItems = items.slice(mid);

  return (
    <section className="py-20 font-sans">
      <div className="container max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Left column */}
          <Accordion type="single" collapsible className="space-y-2">
            {leftItems.map((item, index) => (
              <AccordionItem key={item.id ?? index} value={item.id}>
                <AccordionTrigger className="font-medium hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-extralight">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Right column */}
          <Accordion type="single" collapsible className="space-y-2">
            {rightItems.map((item, index) => (
              <AccordionItem key={item.id ?? index} value={item.id}>
                <AccordionTrigger className="font-medium hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
