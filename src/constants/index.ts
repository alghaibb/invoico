// Navbar links 
export const navbarLinks = [
  { label: "Features", href: "/features", },
  { label: "Pricing", href: "/pricing", },
  { label: "Contact Us", href: "/contact-us", },
]

// Routes to hide the footer 
export const pagesWithoutFooter = [
  "/invoices/preview-invoice",
]

// Accounts page links
export const accountsPageLinks = [
  { name: "Account Overview", href: "/account" },
  { name: "Update Info", href: "/account/update-info" },
  { name: "Invoices", href: "/account/invoices" },
]

// FAQ items 
export const faqItems = [
  {
    id: "what-is-invoico",
    question: "What is Invoico and how can it help me?",
    answer: "Invoico is a user-friendly invoicing platform designed to streamline your billing process. It helps you create, send, and manage professional invoices quickly and efficiently, saving you time and improving your cash flow.",
  },
  {
    id: "how-to-create-invoice",
    question: "How do I create an invoice using Invoico?",
    answer: "Creating an invoice with Invoico is easy. You have two options: 1) Click the 'Create Your First Invoice' button in the hero section on our homepage, or 2) Navigate to the /invoices route where you'll find the invoice table, and click the button to create a new invoice. Our intuitive interface will guide you through each step, ensuring your invoice is accurate and complete.",
  },
  {
    id: "invoice-limitations",
    question: "Are there any limitations on the number of invoices I can create?",
    answer: "The number of invoices you can create depends on your plan. As a guest user, you can create up to 5 invoices to try out our service. For continued use and additional features, we recommend creating an account and choosing a plan that suits your needs.",
  },
  {
    id: "pricing-plans",
    question: "What pricing plans does Invoico offer?",
    answer: "We offer three flexible plans to cater to different needs: Free, Pro, and Business. Our Free plan is available to all registered users and allows for the creation of up to 10 invoices per month. The Pro and Business plans offer additional features and higher invoice limits to support growing businesses."
  },
]