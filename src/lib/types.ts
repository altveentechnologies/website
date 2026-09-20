export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image_url: string | null;
  read_time: string;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
};

export type ClientRegion = "international" | "local";

export type Client = {
  id: string;
  name: string;
  sector: string;
  description: string;
  url: string | null;
  image_url: string | null;
  region: ClientRegion;
  in_marquee: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  client_name: string;
  quote: string;
  detail: string;
  rating: number;
  published: boolean;
  show_on_homepage: boolean;
  show_on_services: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ConsultationRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  source_page: string | null;
  created_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  created_at: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  source_page: string | null;
  created_at: string;
};

/** Shape returned by every form server action, consumed by useActionState. */
export type TrashKind =
  | "post"
  | "client"
  | "testimonial"
  | "consultation"
  | "contact"
  | "subscriber"
  | "finance_sale"
  | "director_entry"
  | "company_expense"
  | "other_investment";

export type TrashItem = {
  id: string;
  kind: TrashKind;
  label: string;
  detail: string;
  deleted_at: string;
};

export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string>;
};

export const IDLE_FORM_STATE: FormState = { status: "idle", message: "" };

export type FinanceCurrency = "INR" | "USD";

export type FinanceSaleType = "service" | "equipment";

export type FinancePayment = {
  amount: number;
  date: string;
};

export type FinanceSale = {
  id: string;
  client_name: string;
  sale_type: FinanceSaleType;
  item_name: string;
  currency: FinanceCurrency;
  quoted_amount: number;
  paid_amount: number;
  payments: FinancePayment[];
  costs: FinancePayment[];
  cost_amount: number;
  has_cost: boolean;
  profit: number;
  pending: number;
  notes: string;
  created_at: string;
  updated_at: string;
};

export const FINANCE_SALE_TYPE_LABELS: Record<FinanceSaleType, string> = {
  service: "Service",
  equipment: "Equipment",
};

export type DirectorName = "arfat" | "khalid";

export type DirectorEntryType = "took" | "invested";

export const DIRECTOR_LABELS: Record<DirectorName, string> = {
  arfat: "Arafat",
  khalid: "Khalid",
};

export const DIRECTOR_ENTRY_LABELS: Record<DirectorEntryType, string> = {
  took: "Took money",
  invested: "Invested money",
};

export type DirectorSaleOption = {
  id: string;
  label: string;
};

export type DirectorEntry = {
  id: string;
  director: DirectorName;
  entry_type: DirectorEntryType;
  amount: number;
  transaction_date: string;
  project_id: string | null;
  service_label: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type CompanyExpense = {
  id: string;
  description: string;
  amount: number;
  expense_date: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type OtherInvestment = {
  id: string;
  lender_name: string;
  amount: number;
  given_date: string;
  repaid_date: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
};
