declare module "midtrans-client" {
  interface MidtransClientOptions {
    isProduction: boolean;
    serverKey: string;
    clientKey?: string;
  }

  interface SnapTransactionResponse {
    token: string;
    redirect_url: string;
  }

  class Snap {
    constructor(options: MidtransClientOptions);
    createTransaction(parameter: Record<string, unknown>): Promise<SnapTransactionResponse>;
  }

  class CoreApi {
    constructor(options: MidtransClientOptions);
    transaction: {
      status(orderId: string): Promise<Record<string, unknown>>;
      notification(payload: Record<string, unknown>): Promise<Record<string, unknown>>;
    };
  }

  class Iris {
    constructor(options: { isProduction: boolean; serverKey: string });
    ping(): Promise<Record<string, unknown>>;
    createPayouts(parameter: Record<string, unknown>): Promise<Record<string, unknown>>;
    approvePayouts(parameter: Record<string, unknown>): Promise<Record<string, unknown>>;
    rejectPayouts(parameter: Record<string, unknown>): Promise<Record<string, unknown>>;
    getBeneficiaryBanks(): Promise<Record<string, unknown>>;
    validateBankAccount(parameter: Record<string, unknown>): Promise<Record<string, unknown>>;
  }

  const midtransClient: { Snap: typeof Snap; CoreApi: typeof CoreApi; Iris: typeof Iris };
  export default midtransClient;
}
