import { Search, Zap, Shield, Sparkles, FileText, Image as ImageIcon, Code, ArrowRight, LayoutGrid, CheckCircle2, Target, Type, Wrench } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  tools: Tool[];
}

export const toolsData: Category[] = [
  {
    id: "ai-tools",
    name: "AI Tools",
    description: "Next-gen AI powered tools for creators and professionals.",
    icon: Sparkles,
    href: "/ai-tools",
    tools: [
      {
        id: "ai-image-generator",
        title: "AI Image Generator",
        description: "Generate stunning AI images, thumbnails, and logos from text prompts.",
        icon: ImageIcon,
        href: "/ai-tools/ai-image-generator",
        isNew: true,
        isPopular: true,
      },
      {
        id: "ai-content-summarizer",
        title: "AI Content Summarizer",
        description: "Instantly summarize long articles, documents, and text into key points.",
        icon: FileText,
        href: "/ai-tools/ai-content-summarizer",
      },
      {
        id: "ai-background-remover",
        title: "AI Image Background Remover",
        description: "Remove background from any image instantly using AI.",
        icon: ImageIcon,
        href: "/ai-tools/background-remover",
        isNew: true,
      },
      {
        id: "ai-image-upscaler",
        title: "AI Image Upscaler",
        description: "Enlarge images up to 8x with face restoration, noise reduction, and detail reconstruction.",
        icon: ImageIcon,
        href: "/image-tools/ai-image-upscaler",
        isNew: true,
      }
    ],
  },
  {
    id: "pdf-tools",
    name: "PDF Utilities",
    description: "Essential tools to manage, convert, and edit PDF documents.",
    icon: FileText,
    href: "/pdf-tools",
    tools: [
      {
        id: "merge-pdf",
        title: "Merge PDF",
        description: "Combine multiple PDF files instantly and securely.",
        icon: FileText,
        href: "/pdf-tools/merge-pdf",
        isNew: true,
        isPopular: true,
      },
      {
        id: "rotate-pdf",
        title: "Rotate PDF",
        description: "Rotate PDF pages individually or all at once.",
        icon: FileText,
        href: "/pdf-tools/rotate-pdf",
      },
      {
        id: "delete-pdf-pages",
        title: "Delete PDF Pages",
        description: "Remove unwanted pages from your PDF file.",
        icon: FileText,
        href: "/pdf-tools/delete-pdf-pages",
      },
      {
        id: "extract-pdf-pages",
        title: "Extract PDF Pages",
        description: "Extract one or multiple pages from PDF files online.",
        icon: FileText,
        href: "/pdf-tools/extract-pdf-pages",
        isNew: true,
      },
      {
        id: "unlock-pdf",
        title: "Unlock PDF",
        description: "Remove passwords and security restrictions from PDF files.",
        icon: FileText,
        href: "/pdf-tools/unlock-pdf",
        isNew: true,
      },
      {
        id: "protect-pdf",
        title: "Protect PDF",
        description: "Secure PDF files with password encryption and permissions.",
        icon: FileText,
        href: "/pdf-tools/protect-pdf",
        isNew: true,
      },
      {
        id: "sign-pdf",
        title: "Sign PDF",
        description: "Add digital, drawn, and image signatures to PDF files.",
        icon: FileText,
        href: "/pdf-tools/sign-pdf",
        isNew: true,
      },
      {
        id: "watermark-pdf",
        title: "Watermark PDF",
        description: "Add text or image watermarks to your PDF documents.",
        icon: FileText,
        href: "/pdf-tools/watermark-pdf",
        isNew: true,
      },
      {
        id: "reorder-pdf-pages",
        title: "Reorder PDF Pages",
        description: "Reorder, copy, and duplicate pages in a PDF file.",
        icon: FileText,
        href: "/pdf-tools/reorder-pdf-pages",
        isNew: true,
      },
      {
        id: "image-to-pdf",
        title: "Image to PDF",
        description: "Convert JPG, PNG, WEBP, and HEIC images to PDF.",
        icon: FileText,
        href: "/pdf-tools/image-to-pdf",
        isPopular: true,
      },
      {
        id: "pdf-to-jpg",
        title: "PDF to JPG",
        description: "Convert PDF pages to high-quality JPG images.",
        icon: FileText,
        href: "/pdf-tools/pdf-to-jpg",
      },
      {
        id: "pdf-editor",
        title: "PDF Editor",
        description: "Edit PDF online with AI-powered text editing, image editing, OCR, and annotations.",
        icon: FileText,
        href: "/pdf-tools/pdf-editor",
        isNew: true,
        isPopular: true,
      },
      {
        id: "ocr-pdf",
        title: "OCR PDF",
        description: "Extract editable text from scanned PDF files using AI OCR.",
        icon: FileText,
        href: "/pdf-tools/ocr-pdf",
        isNew: true,
        isPopular: true,
      },
      {
        id: "split-pdf",
        title: "Split PDF",
        description: "Extract pages from PDF or split PDFs instantly.",
        icon: FileText,
        href: "/pdf-tools/split-pdf",
        isNew: true,
      },
      {
        id: "compress-pdf",
        title: "Compress PDF",
        description: "Reduce PDF file size while maintaining quality.",
        icon: FileText,
        href: "/pdf-tools/compress-pdf",
        isNew: true,
      },
      {
        id: "pdf-to-word",
        title: "PDF to Word",
        description: "Convert PDF files to editable Word documents.",
        icon: FileText,
        href: "/pdf-tools/pdf-to-word",
        isNew: true,
      },
      {
        id: "word-to-pdf",
        title: "Word to PDF",
        description: "Convert Word documents to professional PDF files.",
        icon: FileText,
        href: "/pdf-tools/word-to-pdf",
        isNew: true,
      },
      {
        id: "pdf-to-excel",
        title: "PDF to Excel",
        description: "Convert PDF tables into editable Excel spreadsheets.",
        icon: FileText,
        href: "/pdf-tools/pdf-to-excel",
        isNew: true,
      },
      {
        id: "powerpoint-to-pdf",
        title: "PowerPoint to PDF",
        description: "Convert PowerPoint presentations into professional PDF documents.",
        icon: FileText,
        href: "/pdf-tools/powerpoint-to-pdf",
        isNew: true,
      },
      {
        id: "pdf-to-powerpoint",
        title: "PDF to PowerPoint",
        description: "Convert PDF files into editable PowerPoint presentations.",
        icon: FileText,
        href: "/pdf-tools/pdf-to-powerpoint",
        isNew: true,
      },
      {
        id: "pdf-to-image",
        title: "PDF to Image",
        description: "Convert PDF pages into high-resolution JPG, PNG, WebP, and TIFF images.",
        icon: FileText,
        href: "/pdf-tools/pdf-to-image",
        isNew: true,
      }
    ],
  },
  {
    id: "image-tools",
    name: "Image Tools",
    description: "Compress, resize, and optimize images for the web.",
    icon: ImageIcon,
    href: "/image-tools",
    tools: [
      {
        id: "ai-image-upscaler",
        title: "AI Image Upscaler",
        description: "Enlarge images up to 8x with face restoration, noise reduction, and detail reconstruction.",
        icon: ImageIcon,
        href: "/image-tools/ai-image-upscaler",
        isNew: true,
        isPopular: true,
      },
      {
        id: "background-remover",
        title: "AI Background Remover",
        description: "Remove image backgrounds instantly with AI. Export as transparent PNG.",
        icon: ImageIcon,
        href: "/image-tools/background-remover",
        isNew: true,
        isPopular: true,
      },
      {
        id: "crop-image",
        title: "Smart Image Cropper",
        description: "Crop images online using AI Smart Crop, face detection, and social media presets.",
        icon: ImageIcon,
        href: "/image-tools/crop-image",
        isNew: true,
        isPopular: true,
      },
      {
        id: "resize-image",
        title: "AI Image Resizer",
        description: "Resize, optimize, and scale images for web and social media.",
        icon: ImageIcon,
        href: "/image-tools/resize-image",
        isNew: true,
        isPopular: true,
      },
      {
        id: "image-converter",
        title: "Universal Image Converter",
        description: "Convert images between JPG, PNG, WebP, AVIF, BMP, and more.",
        icon: ImageIcon,
        href: "/image-tools/image-converter",
        isNew: true,
        isPopular: true,
      },
      {
        id: "image-compressor",
        title: "AI Image Compressor",
        description: "Smartly compress JPG, PNG, WebP & AVIF images online without losing quality.",
        icon: ImageIcon,
        href: "/image-tools/image-compressor",
        isNew: true,
        isPopular: true,
      }
    ],
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    description: "Handy tools for developers: formatters, validators, and testers.",
    icon: Code,
    href: "/developer-tools",
    tools: [
      {
        id: "json-beautifier",
        title: "JSON Beautifier",
        description: "Format, validate, and beautify JSON data.",
        icon: Code,
        href: "/developer-tools/json-beautifier",
        isNew: true,
      },
      {
        id: "regex-tester",
        title: "Regex Tester",
        description: "Test and debug Regular Expressions in real-time.",
        icon: Code,
        href: "/developer-tools/regex-tester",
      }
    ],
  },
  {
    id: "seo-tools",
    name: "SEO Tools",
    description: "Boost your website's visibility with SEO generators and analyzers.",
    icon: Target,
    href: "/seo-tools",
    tools: [
      {
        id: "seo-meta-generator",
        title: "AI SEO Meta Generator",
        description: "Generate complete SEO meta tags, Open Graph, and JSON-LD schema.",
        icon: Target,
        href: "/seo-tools/seo-meta-generator",
        isNew: true,
      }
    ],
  },
  {
    id: "text-tools",
    name: "Text Tools",
    description: "Format, count, and manipulate text easily.",
    icon: Type,
    href: "/text-tools",
    tools: [],
  },
  {
    id: "utility-tools",
    name: "Utility Tools",
    description: "Everyday utility tools and calculators.",
    icon: Wrench,
    href: "/utility-tools",
    tools: [],
  }
];

export const allTools: Tool[] = toolsData.flatMap(category => category.tools);

export function searchTools(query: string): Tool[] {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return allTools.filter(tool => 
    tool.title.toLowerCase().includes(lowerQuery) || 
    tool.description.toLowerCase().includes(lowerQuery)
  );
}
