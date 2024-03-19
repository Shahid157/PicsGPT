export interface photoAIStyle {
  Hidden: boolean | null;
  created_at: string;
  id: number;
  img_url: string;
  prompt: string;
  prompt_category: string;
  prompt_name: string;
  style_id: string;
  tags?: string[] | null;
}

export interface photoAIModel {
  '3d-url'?: string;
  First?: string;
  Last?: string;
  collection?: string[];
  full_name?: string;
  gender?: string;
  hidden?: boolean;
  id?: number;
  order_by?: number;
  person_id?: string;
  url?: string;
  name?: string;
  img_url?: string;
}

export interface jobUsedItems {
  usedModel: photoAIModel;
  usedStyle: photoAIStyle;
}

export interface jobDetails {
  files: string[];
  status: string;
}

export interface jobInterface {
  Delete?: boolean;
  created_at?: string;
  id?: number;
  user_id: string;
  generate_id: string;
  job_id: string;
  results?: string[] | null;
  usedItems: jobUsedItems;
  priority: number;
  private: boolean;
  emailed?: string | null;
  status: string;
  credit_status: string;
  user_email: string;
}

export interface userPayment {
  credit_left: number;
  email_id: string;
  id: string;
  invoice_id: null;
  mode: string;
  model_limit: number;
  model_used: number;
  payment_intent: string | null;
  payment_method_id: string | null;
  plan_name: string | null;
  priority: number;
  session_id: string | null;
  subscription_id: string | null;
  user_id: number;
}
