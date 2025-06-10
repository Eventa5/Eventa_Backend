declare module "ecpay_aio_nodejs" {
  interface MercProfile {
    MerchantID: string;
    HashKey: string;
    HashIV: string;
  }

  export interface Options {
    OperationMode: string;
    MercProfile: MercProfile;
    IgnorePayment: string[];
    IsProjectContractor: boolean;
  }

  interface PaymentClient {
    aio_check_out_all(params: Record<string, string | number>): string;
    helper: {
      gen_chk_mac_value: (data: Record<string, string | number>) => string;
    };
  }

  class ECPay {
    constructor(options: Options);
    payment_client: PaymentClient;
  }

  export = ECPay;
}
