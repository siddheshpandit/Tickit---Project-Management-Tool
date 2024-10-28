import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart, Calendar, ChevronRight, Layout } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CompanyCorousal from "../components/company-carousal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
export default function Home() {
  const faqs = [
    {
      question: "What is Tickit?",
      answer:
        "Tickit is a powerful project management tool designed to help teams organize, track, and manage their work efficiently. It combines intuitive design with robust features to streamline your workflow and boost productivity.",
    },
    {
      question: "How does Tickit compare to other project management tools?",
      answer:
        "Tickit offers a unique combination of intuitive design, powerful features, and flexibility. Unlike other tools, we focus on providing a seamless experience for both agile and traditional project management methodologies, making it versatile for various team structures and project types.",
    },
    {
      question: "Is Tickit suitable for small teams?",
      answer:
        "Absolutely! Tickit is designed to be scalable and flexible. It works great for small teams and can easily grow with your organization as it expands. Our user-friendly interface ensures that teams of any size can quickly adapt and start benefiting from Tickit's features.",
    },
    {
      question: "What key features does Tickit offer?",
      answer:
        "Tickit provides a range of powerful features including intuitive Kanban boards for visualizing workflow, robust sprint planning tools for agile teams, comprehensive reporting for data-driven decisions, customizable workflows, time tracking, and team collaboration tools. These features work seamlessly together to enhance your project management experience.",
    },
    {
      question: "Can Tickit handle multiple projects simultaneously?",
      answer:
        "Yes, Tickit is built to manage multiple projects concurrently. You can easily switch between projects, and get a bird's-eye view of all your ongoing work. This makes Tickit ideal for organizations juggling multiple projects or clients.",
    },
    {
      question: "Is there a learning curve for new users?",
      answer:
        "While Tickit is packed with features, we've designed it with user-friendliness in mind. New users can quickly get up to speed thanks to our intuitive interface, helpful onboarding process, and comprehensive documentation.",
    },
  ];
  const features = [
    {
      title: "Intuitive Kanban Boards",
      description:
        "Visualize your workflow and optimize team productivity with our easy-to-use Kanban boards.",
      icon: Layout,
    },
    {
      title: "Powerful Sprint Planning",
      description:
        "Plan and manage sprints effectively, ensuring your team stays focused on delivering value.",
      icon: Calendar,
    },
    {
      title: "Comprehensive Reporting",
      description:
        "Gain insights into your team's performance with detailed, customizable reports and analytics.",
      icon: BarChart,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto py-20 text-center">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col">
          Sprint Towards Success
          <br />
          <span className="flex mx-auto gap-3 sm:gap-4 items-center">
            With{" "}
            <Image
              src="/logo.png"
              alt=""
              width={300}
              height={80}
              className="h-16 sm:h-28 w-auto object-contain"
            />
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-10  mx-auto">
          Streamline Workflows and Empower Your Team
        </p>
        <Link href="/onboarding">
          <Button size="lg" className="mr-4">
            Get Started <ChevronRight size={18} />
          </Button>
        </Link>
        <Link href="#features">
          <Button size="lg" className="mr-4" variant={"outline"}>
            Learn More <ChevronRight size={18} className="ml-1" />
          </Button>
        </Link>
      </section>

      {/* Key Features */}
      <section id="features" className="bg-gray-900 py-20 px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Key Features</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 mb-4 text-blue-300" />
                  <h4 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Trusted by Industry Leaders
          </h3>
          <CompanyCorousal />
        </div>
      </section>

      {/* Faqs */}
      <section className="bg-gray-900 py-20 px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Frequently Asked Questions.
          </h3>
          {faqs.map((question,index)=>(
            <Accordion key={index} type="single" collapsible>
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger>{question.question}</AccordionTrigger>
              <AccordionContent>
                {question.answer}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          ))}
          
        </div>
      </section>


      <section className="py-20 text-center px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Ready to Transform your Workflow?
          </h3>
          <p className="mb-12 text-xl">
            Join thousands of teams already using Tickit to streamline their project and boost productivity.
          </p>
          <Link href={'/onboarding'}>
          <Button size={'lg'} className="animate-bounce">
            Start for free <ArrowRight className="ml-2 h-5 w-5"/>
          </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
