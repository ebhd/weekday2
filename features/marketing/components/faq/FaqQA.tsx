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
      id: "How Can I reset my password?",
      question: "What is a FAQ?",
      answer:
        " To reset your password, go to the login page and click on the 'Forgot Password' link. Follow the instructions to reset your password via email.",
    },
    {
      id: "faq-2",
      question: "How Can I reset my password?",
      answer:
        " To reset your password, go to the login page and click on the 'Forgot Password' link. Follow the instructions to reset your password via email.",
    },
    {
      id: "faq-3",
      question: "How Can I reset my password?",
      answer:
        " To reset your password, go to the login page and click on the 'Forgot Password' link. Follow the instructions to reset your password via email.",
    },
    {
      id: "faq-4",
      question: "How Can I reset my password?",
      answer:
        "To reset your password, go to the login page and click on the 'Forgot Password' link. Follow the instructions to reset your password via email.",
    },
    {
      id: "faq-5",
      question: "How Can I reset my password?",
      answer:
        "To reset your password, go to the login page and click on the 'Forgot Password' link. Follow the instructions to reset your password via email.",
    },
    {
      id: "faq-6",
      question: "How Can I reset my password?",
      answer:
        " To reset your password, go to the login page and click on the 'Forgot Password' link. Follow the instructions to reset your password via email.",
    },
    {
      id: "faq-7",
      question: "How Can I reset my password?",
      answer:
        " To reset your password, go to the login page and click on the 'Forgot Password' link. Follow the instructions to reset your password via email.",
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
