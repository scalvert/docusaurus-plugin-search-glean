export interface AuthTokenDetails {
  expirationTime: number;
  token: string;
}

export interface BoxCustomizations {
  border?: string;
  borderRadius?: number;
  boxShadow?: string;
  horizontalMargin?: number;
  verticalMargin?: number;
}

export interface Theme {
  background?: string;
  backgroundLight?: string;
  backgroundMid?: string;
  backgroundSuccess?: string;
  bannerErrorBackground?: string;
  bannerErrorText?: string;
  bannerPrimaryBackground?: string;
  bannerSecondaryBackground?: string;
  bannerSuccessBackground?: string;
  bannerSuccessText?: string;
  borderDark?: string;
  borderLight?: string;
  chatBackground?: string;
  companyBackgroundTextPrimary?: string;
  disabled?: string;
  error?: string;
  hover?: string;
  navBarBackground?: string;
  navBarForeground?: string;
  navigationFlyoutBackground?: string;
  navigationInPageBackground?: string;
  primaryHighlight?: string;
  primaryHover?: string;
  selected?: string;
  success?: string;
  textPrimary?: string;
  textSecondary?: string;
  visited?: string;
  warning?: string;
  warningDark?: string;
  warningLight?: string;
  warningText?: string;
}

export type ThemeVariant = 'light' | 'dark';
export type ThemeVariantOrAuto = ThemeVariant | 'auto';

export interface ChatCustomizations {
  container?: BoxCustomizations;
}

export type FilterValue = {
  key: string;
  value: string;
};

export interface ModalSearchOptions {
  authToken?: AuthTokenDetails;
  backend?: string;
  datasource?: string;
  datasourcesFilter?: string[];
  disableAnalytics?: boolean;
  domainsToOpenInCurrentTab?: string[];
  enableActivityLogging?: boolean;
  hideAutocomplete?: boolean;
  initialFilters?: FilterValue[];
  key?: string;
  locale?: string;
  onAuthTokenRequired?: () => void;
  onChat?: (chatId?: number) => void;
  onDetach?: () => void;
  onSearch: (query: string) => void;
  query?: string;
  showNativeSearchToggle?: boolean;
  theme?: Partial<Record<ThemeVariant, Theme>>;
  themeVariant?: ThemeVariantOrAuto;
  urlsToOpenInCurrentTab?: string[];
  webAppUrl?: string;
}

export interface ChatOptions {
  agent?: string;
  applicationId?: string;
  authToken?: AuthTokenDetails;
  backend?: string;
  chatId?: string;
  customizations?: ChatCustomizations;
  disableAnalytics?: boolean;
  domainsToOpenInCurrentTab?: string[];
  enableActivityLogging?: boolean;
  initialMessage?: string;
  key?: string;
  locale?: string;
  onAuthTokenRequired?: () => void;
  onChat?: (chatId?: number) => void;
  onSearch?: (query: string) => void;
  source?: string;
  theme?: Partial<Record<ThemeVariant, Theme>>;
  themeVariant?: ThemeVariantOrAuto;
  urlsToOpenInCurrentTab?: string[];
  webAppUrl?: string;
}

export type ThemeConfig = {
  glean: {
    searchOptions: ModalSearchOptions;
    chatOptions: ChatOptions;
  };
};
