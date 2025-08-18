export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id?: string;
  handler(response: any): void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: { [key: string]: any };
  theme?: { color?: string };
}

export interface RazorpayInstance {
  open(): void;
  on(event: string, handler: (...args: any[]) => void): void;
  close(): void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
