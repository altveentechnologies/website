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
  | "subscriber";

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
  /** Field-level errors keyed by input name. */
  errors?: Record<string, string>;
};

export const IDLE_FORM_STATE: FormState = { status: "idle", message: "" };
