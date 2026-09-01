export type ProductStatus = 'active' | 'draft';

export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  material: string;
  description: string;
  features?: string[];
  status: ProductStatus;
  isVisible?: boolean;
  createdAt: string;
  image: string;
  gallery?: string[];
  specs?: {
    color?: string;
    dimensions?: string;
    glassType?: string;
    openingSystem?: string;
    thermalInsulation?: boolean;
    soundInsulation?: boolean;
  };
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
  image: string;
  iconName: string;
  description?: string;
}

export type ContactRequestStatus = 'new' | 'replied' | 'in_progress' | 'closed';

export interface ContactRequest {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  requestType: string;
  message: string;
  date: string;
  status: ContactRequestStatus;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead?: boolean;
  read?: boolean;
  createdAt?: string;
  timeAgo?: string;
  dateGroup?: string;
  relatedId?: string;
  relatedType?: string;
}

export interface WorkingHours {
  days: string;
  open: string;
  close: string;
  closedDays: string;
}

export interface AppSettings {
  companyName?: string;
  mainSiteName?: string;
  subtitle?: string;
  phone?: string;
  whatsapp?: string;
  phoneWhatsapp?: string;
  email?: string;
  address?: string;
  companyAddress?: string;
  description?: string;
  copyright?: string;
  workingHours?: WorkingHours;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
  };
}

export interface AboutValue {
  title: string;
  description: string;
  icon?: string;
}

export interface AboutStat {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
}

export interface WhyUsFeature {
  title: string;
  description: string;
}

export interface WhyUsSection {
  eyebrow?: string;
  title?: string;
  description?: string;
  features?: WhyUsFeature[];
  image?: string;
}

export interface AboutSettings {
  badge?: string;
  mainTitle?: string;
  subtitle?: string;
  description?: string;
  overlayTitle?: string;
  overlayText?: string;
  vision?: string;
  mission?: string;
  values?: AboutValue[];
  whyUs?: WhyUsSection;
  statistics?: AboutStat[];
  mainImage?: string;
}

export interface StatMetric {
  id: string;
  title: string;
  value: number | string;
  change: string;
  isPositive: boolean;
  icon: string;
}
