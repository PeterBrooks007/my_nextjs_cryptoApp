// types/user.ts

// export interface Asset {
//   symbol: string;
//   name: string;
//   balance: number;
//   ManualFiatbalance: number;
//   Manualbalance: number;
//   image: string;
//   lastUpdated: string; // ISO date string
// }

export interface UserAsset {
  _id: string;
  name: string;
  symbol: string;
  image: string;
  balance: number;
  Manualbalance: number;
  ManualFiatbalance: number;
  price: number;
  totalValue: number;
  lastUpdated: string; // ISO date string
}

export interface GiftReward {
  _id: string;
  subject: string;
  message: string;
  amount: number;
  createdAt: string; // ISO date string
}

export interface Currency {
  code: string;
  flag: string;
}

export interface Address {
  address: string;
  state: string;
  country: string;
  countryFlag: string;
}

export type VerificationStatus = "NOT VERIFIED" | "PENDING" | "VERIFIED";

export interface AutoTradeSettings {
  isAutoTradeActivated: boolean;
  type: string;
  winLoseValue: string;
}

export interface WithdrawalLocked {
  isWithdrawalLocked: boolean;
  lockCode: number;
  lockSubject: string;
  lockComment: string;
}

export interface AccountLock {
  generalLock: boolean;
  upgradeLock: boolean;
  signalLock: boolean;
}

export interface IdVerificationPhoto {
  front: string;
  back: string;
}

export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: "customer" | "admin";
  photo: string;
  phone: string;
  address: Address;
  balance: number;
  password: string;
  walletBalance: number;
  isManualAssetMode: boolean;
  assets: UserAsset[];
  currency: Currency;
  demoBalance: number;
  accounttype: string;
  package: string;
  earnedTotal: number;
  totalDeposit: number;
  totalWithdrew: number;
  referralBonus: number;
  pin: string;
  lastAccess: string; // ISO date string
  pinRequired: boolean;

  myTraders: string[]; // ObjectId[] from ExpertTraders
  myNfts: string[]; // ObjectId[] from NftSettings
  myTradingBots: string[]; // ObjectId[] from TradingBots
  myTradingSignals: string[]; // ObjectId[] from TradingSignals

  isTwoFactorEnabled: boolean;
  idVerificationPhoto: IdVerificationPhoto;
  isIdVerified: VerificationStatus;
  residencyVerificationPhoto: string;
  isResidencyVerified: VerificationStatus;
  isEmailVerified: boolean;
  isDemoAccountActivated: boolean;
  autoTradeSettings: AutoTradeSettings;
  withdrawalLocked: WithdrawalLocked;
  accountLock: AccountLock;
  customizeEmailLogo: string;
  giftRewards: GiftReward[];
  otp: string | null;
  otpExpires: string | null;
  socketId: string | null;
  isOnline: boolean;
  lastSeen: string | null;
  resetToken: string | null;
  tokenExpiry: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CoinpaprikaQuote {
  price: number;
  volume_24h: number;
  market_cap: number;
  ath_price: number;
  ath_date: string;
  percent_change_1h: number;
  percent_change_6h: number;
  percent_change_12h: number;
  percent_change_15m: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  percent_change_30m: number;
  percent_change_1y: number;
  percent_from_price_ath: number;
  market_cap_change_24h: number;
  volume_24h_change_24h: number;
}

export interface CoinpaprikaCoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  max_supply: number | null;
  total_supply: number | null;
  quotes: Record<string, CoinpaprikaQuote>; // ✅ supports arbitrary currencies (USD, NGN, EUR, etc.)
}

export interface WalletAddressType {
  _id: string;
  walletName: string;
  walletSymbol: string;
  walletAddress: string;
  walletPhoto: string;
  walletQrcode: string;
  createdAt: string; // or Date if you convert it
  updatedAt: string; // or Date if you convert it
  __v: number;
}

export interface ExpertTraderType {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  photo: string;
  comment: string;
  profitShare: string; // e.g., "25%"
  winRate: string; // e.g., "95%"
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface TradingBotType {
  _id: string;
  name: string;
  comment: string;
  photo: string;
  price: number;
  dailyTrades: number;
  winRate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NftSettingsType {
  _id: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  nftCode: string;
  nftName: string;
  nftPrice: number;
  photo: string;
  __v: number;
}

export interface ConnectWalletsType {
  _id: string;
  name: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TradeSettingsType {
  _id: string;
  exchangeType: string;
  photo: string;
  tradingPairs: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface DepositRequestType {
  _id: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  depositProof: string;
  method: string;
  methodIcon: string;
  status: string;
  typeOfDeposit: string;
  __v: number;
  userId: User;
}

export type WithdrawalRequestType = {
  _id: string;
  amount: number;
  bankAccount: string;
  bankName: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  method: string;
  methodIcon: string;
  routingCode: string;
  status: string;
  typeOfWithdrawal: string;
  userId: User;
  walletAddress: string;
  __v: number;
};

export interface MailboxType {
  _id: string;
  content: string;
  createdAt: string; // ISO date string
  folder: string; // extend as needed
  from: string;
  to: string;
  subject: string;
  isRead: boolean;
  isStarred: boolean;
  isUserStarred: boolean;
  userId: User;
}

export interface EditUserProfileType {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;

  accounttype: string;
  address: {
    address: string;
    country: string;
    state: string;
  };

  balance: number;
  demoBalance: number;
  earnedTotal: number;

  isTwoFactorEnabled: string;
  pinRequired: string;

  package: string;
  password: string;
  pin: string;

  referralBonus: number;
  role: string;
  totalDeposit: number;
  totalWithdrew: number;
}

export interface combinedAssetsTypes {
  _id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  balance: number;
  Manualbalance: number;
  totalValue: number;
  ManualFiatbalance: number;
  lastUpdated: string;
}

export interface ExchangeItemType {
  _id: string;
  exchangeType: string;
  photo: string;
  tradingPairs: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TradeFormData {
  userId: string;
  tradeData: {
    amount: number;
    buyOrSell: string;
    close: string;
    exchangeType: string;
    exchangeTypeIcon: string;
    expireTime: string;
    longOrShortUnit: string;
    open: string;
    price: number;
    profitOrLossAmount: number;
    risk: string;
    riskPercentage: string;
    roi: string;
    status: string;
    symbols: string;
    ticks: string;
    tradeFrom: string;
    tradingMode: string | undefined;
    type: string;
    units: number;
  };
}

export interface DepositHistoryType {
  _id: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  depositProof: string;
  method: string;
  methodIcon: string;
  status: string;
  typeOfDeposit: string;
  __v: number;
  userId: string;
}

export interface WithdrawalHistoryType {
  _id: string;
  userId: string;
  amount: number;
  status: string;
  typeOfWithdrawal: string;
  description: string;
  method: string;
  methodIcon: string;
  walletAddress: string;
  bankName: string;
  bankAccount: string;
  routingCode: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  __v: number;
}

export type WalletTransactionType = {
  _id: string;
  amount: number;
  createdAt: string; // ISO date string
  description: string;
  method: string;
  methodIcon: string;
  status: string;
  symbol: string;
  typeOfTransaction: string;
  walletAddress: string;
};

export type CombinedAssetsTransactionType = {
  _id: string;
  amount: number;
  createdAt: string; // ISO timestamp
  description: string;
  method: string;
  methodIcon: string;
  price: number;
  status: string;
  symbol: string;
  totalValue: number; // can be NaN but still typed as number
  typeOfTransaction: string;
  walletAddress: string;
};

export interface TradeHistoryType {
  amount: number;
  buyOrSell: string;
  close: string;
  createdAt: string;
  exchangeType: string;
  exchangeTypeIcon: string;
  expireTime: number;
  isProcessed: boolean;
  longOrShortUnit: string;
  open: string;
  price: number;
  profitOrLossAmount: number;
  risk: string;
  riskPercentage: string;
  roi: string;
  status: string;
  symbols: string;
  ticks: string;
  tradeFrom: string;
  tradingMode: string;
  type: string;
  units: number;
  _id: string;
}

export interface AutoTradeUpdateInAdminPayloadType {
  userId: string | undefined;
  tradeData: {
    tradeId: string;
    exchangeType: string;
    exchangeTypeIcon: string;
    symbols: string;
    type: string;
    buyOrSell: string;
    price: number | string;
    ticks: string;
    units: number | string;
    risk: string;
    riskPercentage: string | number;
    expireTime: string;
    amount: number | string;
    open: number | string;
    close: number | string;
    longOrShortUnit: string;
    roi: string;
    profitOrLossAmount: number | string;
    status: string;
    tradingMode: string;
    tradeFrom: string;
    createdAt: string;
    isProcessed: boolean;
  };
}

export interface UpdateTradeHistoryPayload {
  userId: string;
  tradeData: {
    symbols: string;
    type: string;
    buyOrSell: string;
    price: number;
    ticks: string;
    tradingMode: string;
    units: number;
    risk: string;
    riskPercentage: string;
    expireTime: string;
    amount: number;
    open: string;
    close: string;
    longOrShortUnit: string;
    roi: string;
    createdAt: Date;
    profitOrLossAmount: number;
    status: string;
    tradeId: string | undefined;
    exchangeType: string | undefined;
    exchangeTypeIcon: string | undefined;
    isProcessed: boolean;
    tradeFrom: string;
  };
}

export interface NotificationType {
  _id: string;
  createdAt: string;
  from: string;
  to: string;
  title: string;
  message: string;
  notificationIcon: string;
  route: string;
  isRead: boolean;
}


export interface CoinGeckoCoin  {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string; // ISO date
  atl: number;
  atl_change_percentage: number;
  atl_date: string; // ISO date
  roi: null | {
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated: string; // ISO date
  sparkline_in_7d: {
    price: number[];
  };
};

export interface DepositSessionType  {
  amountCrypto: string;
  amountFiat: string;
  countdownEndTime: string; // ISO date string
  typeOfDeposit: "Trade" | "Deposit" | string;
  walletAddress: string;
  walletName: string;
  walletPhoto: string;
  walletQRCode: string;
  walletSymbol: string;
};


export interface ConversionRateType  {
  code: string;
  rate?: number;
  flag: string;
};


