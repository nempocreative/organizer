import midtransClient from "midtrans-client";

const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
const clientKey = process.env.MIDTRANS_CLIENT_KEY ?? "";

// Sandbox server/client keys are prefixed with "SB-Mid-"; production keys are not.
export const isProduction = serverKey.length > 0 && !serverKey.startsWith("SB-");

export const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
});

export const coreApi = new midtransClient.CoreApi({
  isProduction,
  serverKey,
  clientKey,
});

export function getClientConfig() {
  return { clientKey, isProduction };
}

/* ── Iris (Disbursement/Payout API) — kredensial terpisah dari Snap/Core, opsional.
   Tanpa MIDTRANS_IRIS_KEY, pencairan saldo mitra jatuh ke jalur transfer manual. ── */
const irisKey = process.env.MIDTRANS_IRIS_KEY ?? "";
export const irisConfigured = irisKey.length > 0;

export const iris = irisConfigured
  ? new midtransClient.Iris({ isProduction, serverKey: irisKey })
  : null;
