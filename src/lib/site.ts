// Company details shown in the footer, contact page and policies.
// Fill these in before sharing the site with Stripe.
export const site = {
  name: "TableCause",
  company: process.env.NEXT_PUBLIC_COMPANY_NAME || "[Company legal name] Pte. Ltd.",
  companyAddress: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "[Registered address], Singapore",
  uen: process.env.NEXT_PUBLIC_COMPANY_UEN || "[UEN]",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@[domain]",
  policiesUpdated: "October 14, 2026",
};
