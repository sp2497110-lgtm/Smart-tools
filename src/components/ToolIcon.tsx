import React from 'react';
import {
  Minimize2,
  FileDown,
  Scaling,
  ArrowRightLeft,
  Zap,
  Crop,
  RotateCw,
  FileText,
  Layers,
  Scissors,
  FileImage,
  Images,
  Hash,
  Type,
  Filter,
  Braces,
  CheckCircle2,
  Minimize,
  Binary,
  Link as LinkIcon,
  Link2,
  QrCode,
  Percent,
  Calendar,
  Activity,
  CreditCard,
  TrendingUp,
  Receipt,
  DollarSign,
  PieChart,
  Tag,
  Globe,
  Bot,
  Network,
  Palette,
  Fingerprint,
  Clock,
  Image as ImageIcon,
  Code,
  Calculator,
  Search,
  RefreshCw,
  Wrench,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

export interface ToolIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  className?: string;
}

export default function ToolIcon({ name, ...props }: ToolIconProps) {
  switch (name) {
    case 'Minimize2':
      return <Minimize2 {...props} />;
    case 'FileDown':
      return <FileDown {...props} />;
    case 'Scaling':
      return <Scaling {...props} />;
    case 'ArrowRightLeft':
      return <ArrowRightLeft {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'Crop':
      return <Crop {...props} />;
    case 'RotateCw':
      return <RotateCw {...props} />;
    case 'FileText':
      return <FileText {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    case 'Scissors':
      return <Scissors {...props} />;
    case 'FileImage':
      return <FileImage {...props} />;
    case 'Images':
      return <Images {...props} />;
    case 'Hash':
      return <Hash {...props} />;
    case 'Type':
      return <Type {...props} />;
    case 'Filter':
      return <Filter {...props} />;
    case 'Braces':
      return <Braces {...props} />;
    case 'CheckCircle2':
      return <CheckCircle2 {...props} />;
    case 'Minimize':
      return <Minimize {...props} />;
    case 'Binary':
      return <Binary {...props} />;
    case 'Link':
      return <LinkIcon {...props} />;
    case 'Link2':
      return <Link2 {...props} />;
    case 'QrCode':
      return <QrCode {...props} />;
    case 'Percent':
      return <Percent {...props} />;
    case 'Calendar':
      return <Calendar {...props} />;
    case 'Activity':
      return <Activity {...props} />;
    case 'CreditCard':
      return <CreditCard {...props} />;
    case 'TrendingUp':
      return <TrendingUp {...props} />;
    case 'Receipt':
      return <Receipt {...props} />;
    case 'DollarSign':
      return <DollarSign {...props} />;
    case 'PieChart':
      return <PieChart {...props} />;
    case 'Tag':
      return <Tag {...props} />;
    case 'Globe':
      return <Globe {...props} />;
    case 'Bot':
      return <Bot {...props} />;
    case 'Network':
      return <Network {...props} />;
    case 'Palette':
      return <Palette {...props} />;
    case 'Fingerprint':
      return <Fingerprint {...props} />;
    case 'Clock':
      return <Clock {...props} />;
    case 'ImageIcon':
      return <ImageIcon {...props} />;
    case 'Code':
      return <Code {...props} />;
    case 'Calculator':
      return <Calculator {...props} />;
    case 'Search':
      return <Search {...props} />;
    case 'RefreshCw':
      return <RefreshCw {...props} />;
    case 'Wrench':
      return <Wrench {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
}
