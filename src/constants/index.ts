import {
  AiOutlineUserAdd,
  AiOutlineFileText,
  AiOutlineSend,
} from "react-icons/ai";
import { HiOutlineCalculator } from "react-icons/hi";
import { MdOutlineMail, MdOutlinePayments } from "react-icons/md";
import { TbFileInvoice } from "react-icons/tb";

// Navbar links
export const navbarLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact Us", href: "/contact-us" },
];

// Routes to hide the footer
export const pagesWithoutFooter = ["/invoices/preview-invoice"];

// Accounts page links
export const accountsPageLinks = [
  { name: "Account Overview", href: "/account" },
  { name: "Update Info", href: "/account/update-info" },
  { name: "Invoices", href: "/account/invoices" },
];

// FAQ items
export const faqItems = [
  {
    id: "what-is-invoico",
    question: "What is Invoico and how can it help me?",
    answer:
      "Invoico is a user-friendly invoicing platform designed to streamline your billing process. It helps you create, send, and manage professional invoices quickly and efficiently, saving you time and improving your cash flow.",
  },
  {
    id: "how-to-create-invoice",
    question: "How do I create an invoice using Invoico?",
    answer:
      "Creating an invoice with Invoico is easy. You have two options: 1) Click the 'Create Your First Invoice' button in the hero section on our homepage, or 2) Navigate to the /invoices route where you'll find the invoice table, and click the button to create a new invoice. Our intuitive interface will guide you through each step, ensuring your invoice is accurate and complete.",
  },
  {
    id: "invoice-limitations",
    question:
      "Are there any limitations on the number of invoices I can create?",
    answer:
      "The number of invoices you can create depends on your plan. As a guest user, you can create up to 5 invoices to try out our service. For continued use and additional features, we recommend creating an account and choosing a plan that suits your needs.",
  },
  {
    id: "pricing-plans",
    question: "What pricing plans does Invoico offer?",
    answer:
      "We offer three flexible plans to cater to different needs: Free, Pro, and Business. Our Free plan is available to all registered users and allows for the creation of up to 10 invoices per month. The Pro and Business plans offer additional features and higher invoice limits to support growing businesses.",
  },
];

// How it works steps
export const howItWorksSteps = [
  {
    title: "1. Sign Up or Start as Guest",
    description:
      "Create an account to unlock more features or start as a guest to create up to 5 free invoices.",
    link: "/create-account",
    buttonText: "Create an account",
    icon: AiOutlineUserAdd,
  },
  {
    title: "2. Create and Customize Your Invoice",
    description:
      "Fill in the invoice form with your business details, add items, and specify payment terms. The system will automatically calculate tax and totals.",
    icon: AiOutlineFileText,
  },
  {
    title: "3. Send, Track, and Get Paid",
    description:
      "Send invoices directly via email, track payment statuses, and manage your invoices easily from your dashboard. Upgrade your plan for more invoices and premium features.",
    icon: AiOutlineSend,
  },
];

export const features = [
  {
    title: "Easy Invoice Creation",
    shortDescription: "Create professional invoices quickly.",
    detailedDescription:
      "Quickly create professional invoices. Add your business details, line items, and tax information to generate an invoice effortlessly.",
    icon: TbFileInvoice,
  },
  {
    title: "Automatic Calculations",
    shortDescription: "Accurate tax and total calculations.",
    detailedDescription:
      "Automatically calculate taxes, discounts, and totals for your invoices, ensuring accuracy and eliminating manual calculations.",
    icon: HiOutlineCalculator,
  },
  {
    title: "Email Invoicing",
    shortDescription: "Send invoices directly via email.",
    detailedDescription:
      "Send invoices directly to your clients via email with a single click. Keep track of sent invoices and follow up easily.",
    icon: MdOutlineMail,
  },
  {
    title: "Payment Tracking",
    shortDescription: "Track payment statuses effortlessly.",
    detailedDescription:
      "Monitor payment statuses and overdue invoices. Get notified about pending payments and keep your cash flow on track.",
    icon: MdOutlinePayments,
  },
];