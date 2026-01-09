import DodoPayments from "dodopayments";

/**
 * DodoPayments client instance
 *
 * Environment variables required:
 * - DODO_PAYMENTS_API_KEY: Your DodoPayments API key
 * - DODO_PAYMENTS_MODE: "test" or "live" (defaults to "test")
 */
export const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY ?? "",
  environment:
    process.env.DODO_PAYMENTS_MODE === "live" ? "live_mode" : "test_mode",
});

/**
 * Check if DodoPayments is configured
 */
export function isDodoConfigured(): boolean {
  return !!process.env.DODO_PAYMENTS_API_KEY;
}

/**
 * Get the current DodoPayments mode
 */
export function getDodoMode(): "test" | "live" {
  return process.env.DODO_PAYMENTS_MODE === "live" ? "live" : "test";
}
