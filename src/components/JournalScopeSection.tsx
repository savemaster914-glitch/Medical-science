import React, { useState } from 'react';
import { 
  Stethoscope, 
  Microscope, 
  Activity, 
  Pill, 
  Smile, 
  HeartPulse, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Target, 
  BookOpen, 
  GraduationCap, 
  Globe,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface JournalScopeSectionProps {
  onNavigateToArticles?: () => void;
}

export const JournalScopeSection: React.FC<JournalScopeSectionProps> = ({ onNavigateToArticles }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const scopeSections = [
    {
      id: 1,
      title: "1. Clinical Medicine",
      icon: Stethoscope,
      badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
      description: "Comprehensive clinical subspecialties, patient care, surgical protocols, and disease management.",
      subdisciplines: [
        "Internal medicine and clinical subspecialties",
        "Cardiology and cardiovascular medicine",
        "Endocrinology and metabolic diseases",
        "Gastroenterology and hepatology",
        "Nephrology and respiratory medicine",
        "Neurology and psychiatry",
        "Oncology and hematology",
        "Infectious diseases",
        "Surgery and surgical specialties",
        "Pediatrics and neonatology",
        "Obstetrics and gynecology",
        "Emergency and critical care medicine",
        "Dermatology, ophthalmology, and otolaryngology"
      ]
    },
    {
      id: 2,
      title: "2. Biomedical and Laboratory Sciences",
      icon: Microscope,
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      description: "Fundamental medical microbiology, laboratory diagnostics, pathology, and cellular biology.",
      subdisciplines: [
        "Microbiology, virology, mycology, and parasitology (الأحياء المجهرية والدقيقة)",
        "Biochemistry, molecular biology, and clinical chemistry",
        "Pathology, histopathology, and cytopathology",
        "Genetics, genomics, and molecular diagnostics",
        "Immunology, serology, and inflammation",
        "Anatomy, histology, and physiology",
        "Clinical hematology and blood banking",
        "Diagnostic, prognostic, and predictive biomarkers"
      ]
    },
    {
      id: 3,
      title: "3. Medical Physics, Biophysics, and Medical Imaging",
      icon: Activity,
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
      description: "Advanced diagnostic imaging technologies, biophysics, radiotherapy, and image analysis.",
      subdisciplines: [
        "Medical physics and clinical medical physics",
        "Biophysics and biomedical physics",
        "Diagnostic radiology and medical imaging",
        "Computed tomography (CT) and magnetic resonance imaging (MRI)",
        "Ultrasound and other diagnostic imaging modalities",
        "Nuclear medicine and molecular imaging",
        "Radiation oncology and radiotherapy physics",
        "Radiation dosimetry, protection, and safety",
        "Medical image analysis and quantitative imaging",
        "Quality assurance in medical imaging and radiotherapy"
      ]
    },
    {
      id: 4,
      title: "4. Pharmacology and Pharmaceutical Sciences",
      icon: Pill,
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      description: "Drug discovery, therapeutics, pharmacotherapy, pharmacokinetics, and novel delivery systems.",
      subdisciplines: [
        "Experimental and clinical pharmacology",
        "Clinical pharmacy and pharmacotherapy",
        "Pharmacokinetics and pharmacodynamics",
        "Toxicology",
        "Drug discovery and development",
        "Pharmaceutical biotechnology",
        "Natural products and medicinal plants",
        "Drug-delivery systems and nanomedicine"
      ]
    },
    {
      id: 5,
      title: "5. Dentistry and Oral Health",
      icon: Smile,
      badgeColor: "bg-teal-100 text-teal-900 border-teal-300",
      description: "Oral sciences, maxillofacial pathology and surgery, periodontics, and dental microbiology.",
      subdisciplines: [
        "Oral medicine and oral pathology",
        "Oral and maxillofacial surgery",
        "Periodontology and endodontics",
        "Orthodontics and prosthodontics",
        "Restorative and pediatric dentistry",
        "Dental materials and oral microbiology",
        "Oral and dental radiology"
      ]
    },
    {
      id: 6,
      title: "6. Health Sciences and Medical Technology",
      icon: HeartPulse,
      badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
      description: "Epidemiology, public health, digital medical AI applications, and community health.",
      subdisciplines: [
        "Public health, epidemiology, and preventive medicine",
        "Biomedical and healthcare technologies",
        "Artificial intelligence and digital applications in medicine",
        "Environmental, occupational, and community health",
        "Nutrition and health-related sciences"
      ]
    }
  ];

  const targetContributors = [
    "Researchers",
    "Clinicians",
    "Biomedical Scientists",
    "Medical Physicists",
    "Radiologists",
    "Laboratory Specialists",
    "Pharmacists",
    "Dentists",
    "Healthcare Professionals Worldwide"
  ];

  return (
    <section className="py-10 bg-slate-50 border-b border-slate-200 font-sans text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title & Preamble Banner */}
        <div className="bg-[#081F45] text-white p-6 sm:p-8 rounded-2xl shadow-md border border-[#184A87] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C79A3D]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#C79A3D]/20 border border-[#C79A3D]/40 text-[#C79A3D] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Aim & Scope Statement</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-playfair leading-tight text-white">
              The Iraqi Journal of Biomedical and Clinical Medicine (IJBCM)
            </h1>

            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-4xl">
              <strong>The Iraqi Journal of Biomedical and Clinical Medicine (IJBCM)</strong> is an international, multidisciplinary, peer-reviewed journal dedicated to publishing high-quality research in biomedical sciences, clinical medicine, diagnostic sciences, and related health disciplines.
            </p>

            <div className="pt-2 border-t border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl space-y-2">
              <p>
                The journal aims to advance scientific knowledge and clinical practice by publishing rigorous and relevant research addressing the mechanisms, prevention, diagnosis, treatment, and management of human diseases. IJBCM particularly encourages translational and interdisciplinary research that bridges basic biomedical sciences with clinical applications, laboratory diagnostics, medical imaging, and emerging medical technologies.
              </p>
              <p className="text-[#C79A3D] font-semibold">
                The journal welcomes original and innovative contributions from researchers, clinicians, biomedical scientists, medical physicists, radiologists, laboratory specialists, pharmacists, dentists, and other healthcare professionals worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Target Contributors Pill Row */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#081F45] uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-[#C79A3D]" />
            <span>Welcomed Authors & Scientific Contributors Worldwide</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {targetContributors.map((role, idx) => (
              <span
                key={idx}
                className="text-xs font-medium bg-slate-100 text-[#081F45] border border-slate-200 px-3 py-1 rounded-full flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>{role}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Major Scope Areas Title */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C79A3D]">Discipline Breakdown</span>
              <h2 className="text-2xl font-extrabold font-playfair text-[#081F45]">
                Major Scope Areas & Subdisciplines
              </h2>
            </div>
            {onNavigateToArticles && (
              <button
                onClick={onNavigateToArticles}
                className="bg-[#081F45] hover:bg-[#184A87] text-[#C79A3D] font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Browse Published Articles in these Scopes</span>
              </button>
            )}
          </div>
          <p className="text-xs text-slate-600 max-w-3xl">
            IJBCM publishes rigorous original research, review papers, case studies, and clinical communications across 6 primary scientific domains:
          </p>
        </div>

        {/* 6 Major Scope Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {scopeSections.map((sec) => {
            const IconComponent = sec.icon;
            const isExpanded = expandedSection === sec.id;

            return (
              <div
                key={sec.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-[#081F45]/5 text-[#081F45] group-hover:bg-[#081F45] group-hover:text-[#C79A3D] transition-colors flex items-center justify-center">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${sec.badgeColor}`}>
                      Domain #{sec.id}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold font-playfair text-[#081F45] group-hover:text-[#184A87] transition-colors">
                    {sec.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sec.description}
                  </p>

                  <div className="border-t border-slate-100 pt-3 space-y-1.5">
                    <div className="text-[11px] font-bold text-[#081F45] uppercase tracking-wider mb-2">
                      Subdisciplines & Topics:
                    </div>
                    <ul className="space-y-1">
                      {sec.subdisciplines.slice(0, isExpanded ? sec.subdisciplines.length : 5).map((item, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                          <span className="text-[#C79A3D] font-bold mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {sec.subdisciplines.length > 5 && (
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : sec.id)}
                    className="mt-4 pt-2 border-t border-slate-100 text-xs font-bold text-[#081F45] hover:text-[#C79A3D] flex items-center gap-1 w-full justify-center transition-colors"
                  >
                    <span>{isExpanded ? 'Show Less' : `Show All ${sec.subdisciplines.length} Subdisciplines`}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Interdisciplinary & Translational Research Section */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-50/50 to-blue-50 border-2 border-[#C79A3D]/40 p-6 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-[#C79A3D]" />
            <h3 className="text-lg font-extrabold font-playfair text-[#081F45]">
              Interdisciplinary and Translational Research
            </h3>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>IJBCM</strong> encourages interdisciplinary and translational studies that integrate biomedical sciences with clinical medicine, laboratory diagnostics, medical physics, biophysics, radiology, pharmacology, and health sciences.
            </p>
            <p className="bg-white/80 p-3.5 rounded-lg border border-amber-200 text-[#081F45] font-medium">
              The journal particularly welcomes research addressing <strong>disease mechanisms, molecular and clinical biomarkers, innovative diagnostic methods, medical imaging, precision medicine, therapeutic approaches</strong>, and <strong>emerging biomedical technologies</strong> with clear relevance to human health.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

