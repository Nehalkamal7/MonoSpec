import { Company, StageDefinition } from '@/types';

export const COMPANIES: Record<string, Company> = {
  awamer: {
    id: 'awamer',
    name: 'Awamer Alshabaka',
    nameAr: 'أوامر الشبكة',
    tagline: 'Enterprise Digital Transformation & Web Platforms',
    code: 'AWM',
  },
  creative: {
    id: 'creative',
    name: 'Creative System',
    nameAr: 'النظام الإبداعي',
    tagline: 'High-Performance FinTech & SaaS Product Engineering',
    code: 'CRT',
  },
};

export const STAGES: StageDefinition[] = [
  {
    id: 'tech_analysis',
    index: 1,
    labelEn: 'Technical Analysis',
    labelAr: 'التحليل الفني',
    shortDesc: 'System architecture, data schemas, security boundaries & integrations',
    badge: 'ARCH-01',
  },
  {
    id: 'ui_ux',
    index: 2,
    labelEn: 'UI/UX Design & Figma',
    labelAr: 'تصميم واجهات',
    shortDesc: 'Design tokens, layout wireframes, interactive flows & Figma sync',
    badge: 'DSGN-02',
  },
  {
    id: 'engineering',
    index: 3,
    labelEn: 'Engineering',
    labelAr: 'برمجة وتطوير',
    shortDesc: 'Full-stack implementation, API endpoints, state logic & ORM models',
    badge: 'CODE-03',
  },
  {
    id: 'qa_testing',
    index: 4,
    labelEn: 'QA & Testing',
    labelAr: 'اختبار وجودة',
    shortDesc: 'End-to-end assertions, load testing, regression suite & security audits',
    badge: 'TEST-04',
  },
  {
    id: 'content',
    index: 5,
    labelEn: 'Content',
    labelAr: 'محتوى رقمي',
    shortDesc: 'Multilingual copy, microcopy, API documentation & compliance texts',
    badge: 'COPY-05',
  },
  {
    id: 'devops',
    index: 6,
    labelEn: 'Support & DevOps',
    labelAr: 'دعم وتشغيل',
    shortDesc: 'Kubernetes manifests, CI/CD pipeline, telemetry, observability & SLA runbooks',
    badge: 'OPS-06',
  },
];
