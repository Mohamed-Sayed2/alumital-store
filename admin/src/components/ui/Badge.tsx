import React from 'react';
import { ProductStatus, ContactRequestStatus } from '../../types';

interface BadgeProps {
  status: ProductStatus | ContactRequestStatus | string;
  label?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, label }) => {
  let badgeStyles = 'bg-slate-100 text-slate-700 border-slate-200';
  let text = label || status;

  switch (status) {
    case 'active':
      badgeStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200/60 font-semibold';
      text = label || 'نشط';
      break;
    case 'draft':
      badgeStyles = 'bg-amber-50 text-amber-700 border-amber-200/60 font-semibold';
      text = label || 'مسودة';
      break;
    case 'new':
      badgeStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200/60 font-semibold';
      text = label || 'جديد';
      break;
    case 'replied':
      badgeStyles = 'bg-sky-50 text-sky-700 border-sky-200/60 font-semibold';
      text = label || 'تم الرد';
      break;
    case 'in_progress':
      badgeStyles = 'bg-amber-50 text-amber-700 border-amber-200/60 font-semibold';
      text = label || 'قيد المتابعة';
      break;
    case 'closed':
      badgeStyles = 'bg-slate-100 text-slate-600 border-slate-200 font-semibold';
      text = label || 'مغلق';
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md text-xs border ${badgeStyles}`}
    >
      {text}
    </span>
  );
};
