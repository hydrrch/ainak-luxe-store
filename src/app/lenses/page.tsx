import React from "react";
import Link from "next/link";
import {
  Glasses,
  Shield,
  Sun,
  Eye,
  Monitor,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  UploadCloud,
  FileText,
  Phone,
  HelpCircle,
  Clock,
  Layers,
  Award,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Precision Optical Lenses & Prescription Solutions | Ainak Luxe Pakistan",
  description:
    "Explore our premium certified optical lenses: Blue Cut Computer Lenses, Photochromic Transition Lenses, Progressive Multi-Focals, and Anti-Glare Night Driving coatings. Digital laboratory glazing in Pakistan.",
};

const LENS_TECHNOLOGIES = [
  {
    id: "blue-cut",
    name: "Blue Cut / Computer Screen Lenses",
    tagline: "Essential Protection for Modern Digital Lifestyles",
    price: 1500,
    badge: "Most Popular in Pakistan",
    icon: Monitor,
    bgGradient: "from-blue-900 via-indigo-950 to-slate-950",
    accentColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    description:
      "Engineered specifically for screen workers, students, programmers, and gamers who spend 5+ hours daily in front of laptops, monitors, smartphones, and LED lights. Our Blue Cut lenses block up to 99.8% of high-energy visible (HEV) blue-violet light at 420nm, eliminating digital eye fatigue, dry eyes, and evening headaches.",
    highlights: [
      "99.8% HEV 420nm blue light absorption",
      "Full UV400 ultraviolet solar radiation shield",
      "Green multi-layer anti-reflective (AR) coating",
      "Hydrophobic topcoat repelling fingerprints, grease, and rain droplets",
      "Available in zero-power (plano) and custom optical eyesight numbers",
    ],
    idealFor: "IT professionals, bank staff, students, gamers, remote workers",
  },
  {
    id: "transition",
    name: "Photochromic / Smart Transition Lenses",
    tagline: "2-in-1 Convenience: Clear Indoors, Dark Sunglasses Outdoors",
    price: 3500,
    badge: "Smart Light-Adaptive",
    icon: Sun,
    bgGradient: "from-amber-950 via-stone-900 to-black",
    accentColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    description:
      "Tired of switching between your eyesight eyeglasses and prescription sunglasses? Our high-grade photochromic lenses contain billions of light-reactive photochromic molecules. Indoors, they remain 100% crystal clear. As soon as you step outside into Pakistani sunshine, they rapidly react to UV rays, darkening to a stylish deep sunglass tint within 30 seconds.",
    highlights: [
      "Fast 30-second transition from indoor clear to outdoor sunglass tint",
      "100% UVA & UVB blocking in both clear and dark states",
      "Reduces glare, eye squinting, and bright sunlight discomfort",
      "Scratch-resistant ceramic hard-coat protection",
      "High temperature stability designed for Pakistan's summer climate",
    ],
    idealFor: "Commuters, drivers, outdoor enthusiasts, anyone needing one pair all day",
  },
  {
    id: "progressive",
    name: "Progressive Multi-Focal (Digital Free-Form)",
    tagline: "Seamless Distance, Computer & Reading Vision — Without Any Line",
    price: 6500,
    badge: "Advanced Free-Form Tech",
    icon: Eye,
    bgGradient: "from-purple-950 via-slate-900 to-black",
    accentColor: "text-purple-400",
    borderColor: "border-purple-500/30",
    description:
      "Say goodbye to outdated bifocal glasses with visible dividing lines. Our digital free-form progressives utilize sub-micron diamond point robotic surfacing to provide three natural viewing corridors: Distance (driving/walking), Intermediate (computer screen/car dashboard), and Near (reading your phone/books). Enjoy smooth, continuous focus across all distances.",
    highlights: [
      "No visible dividing line — looks exactly like modern single-vision eyewear",
      "Digital freeform point-by-point back-surface calculation",
      "35% wider reading and intermediate corridor compared to traditional progressives",
      "Includes premium anti-reflective and anti-scratch coatings",
      "Rapid visual adaptation period for first-time progressive wearers",
    ],
    idealFor: "Adults 40+ needing reading correction alongside distance vision",
  },
  {
    id: "antiglare",
    name: "Anti-Glare High Clarity AR Lenses",
    tagline: "Crystal Visual Clarity & Glare-Free Night Driving",
    price: 1200,
    badge: "High Clarity Coating",
    icon: Sparkles,
    bgGradient: "from-emerald-950 via-slate-900 to-black",
    accentColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    description:
      "Uncoated optical lenses reflect up to 14% of ambient light, causing glare, halos around streetlamps, and reflections in photos. Our vacuum-sputtered multi-layer AR coating allows 99.4% light transmission directly through the lens. Experience razor-sharp contrast, safe night driving against oncoming high-beams, and crystal-clear photos without distracting glare.",
    highlights: [
      "99.4% luminous light transmission for razor-sharp visual clarity",
      "Cuts oncoming high-beam headlight reflections on highways (M-2, GT Road)",
      "Eliminates reflections in photos, Zoom meetings, and video calls",
      "Anti-static coating repels airborne dust and lint particles",
      "Super-hydrophobic lotus-leaf water and smudge repellent layer",
    ],
    idealFor: "Night drivers, video conference speakers, photographers, general daily wear",
  },
];

const COMPARISON_ROWS = [
  {
    feature: "Starting Glazing Price",
    frameOnly: "Rs. 0",
    blueCut: "Rs. 1,500",
    antiGlare: "Rs. 1,200",
    transition: "Rs. 3,500",
    progressive: "Rs. 6,500",
  },
  {
    feature: "Digital Screen Blue Light Blocking",
    frameOnly: "Standard",
    blueCut: "99.8% Certified",
    antiGlare: "Standard AR",
    transition: "Enhanced",
    progressive: "Customizable",
  },
  {
    feature: "UV400 Solar Ray Shield",
    frameOnly: "Basic",
    blueCut: "Full UV400",
    antiGlare: "Full UV400",
    transition: "Full UV400",
    progressive: "Full UV400",
  },
  {
    feature: "Outdoor Sun Darkening (Transitions)",
    frameOnly: "No",
    blueCut: "No",
    antiGlare: "No",
    transition: "Yes (Darkens in 30s)",
    progressive: "Optional add-on",
  },
  {
    feature: "Multi-Distance Focal Zones (Reading + Dist)",
    frameOnly: "No",
    blueCut: "Single Vision",
    antiGlare: "Single Vision",
    transition: "Single Vision",
    progressive: "Triple Freeform (No Line)",
  },
  {
    feature: "Night Driving Glare Suppression",
    frameOnly: "Low",
    blueCut: "High",
    antiGlare: "Maximum Clarity",
    transition: "High",
    progressive: "High",
  },
  {
    feature: "Hydrophobic & Scratch-Proof Coating",
    frameOnly: "Demo acrylic",
    blueCut: "Included",
    antiGlare: "Included",
    transition: "Included",
    progressive: "Included",
  },
];

export default function LensesPage() {
  return (
    <div className="space-y-16 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-luxury-dark to-slate-950 text-white py-16 sm:py-24 border-b border-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/30 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-700/20 border border-brand-500/30 text-gold-400 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Award className="w-4 h-4 text-gold-400" />
            Certified Optical Laboratory Glazing
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Precision Optical Lenses Tailored to Your Prescription
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            From certified Blue Light screen filters to smart photochromic transition lenses and digital freeform progressives. Glazed using German computerized edgers in our optical lab and delivered nationwide across Pakistan.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/products?category=eyeglasses"
              className="px-8 py-3.5 bg-brand-700 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-xl transition-all flex items-center gap-2"
            >
              <span>Browse Frames & Add Lenses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#lens-comparison"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-2xl backdrop-blur-md border border-white/20 transition-all"
            >
              Compare All Lenses
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-white/10">
            <div className="text-center">
              <span className="block text-2xl font-extrabold text-gold-400">99.8%</span>
              <span className="text-[11px] text-gray-400 uppercase tracking-wider">Blue Light HEV Cut</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-extrabold text-gold-400">48 Hours</span>
              <span className="text-[11px] text-gray-400 uppercase tracking-wider">Glazing & Dispatch</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-extrabold text-gold-400">100%</span>
              <span className="text-[11px] text-gray-400 uppercase tracking-wider">UV400 Solar Block</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-extrabold text-gold-400">200+</span>
              <span className="text-[11px] text-gray-400 uppercase tracking-wider">Pakistani Cities Served</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Optical Lens Tiers Detailed Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
            Laboratory Excellence
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Our Certified Optical Lens Technologies
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto">
            Select any optical tier during product purchase. Upload your doctor&apos;s prescription slip, enter manual eyesight parameters, or send your card via WhatsApp.
          </p>
        </div>

        <div className="space-y-8">
          {LENS_TECHNOLOGIES.map((tech, idx) => {
            const Icon = tech.icon;
            const isReversed = idx % 2 === 1;

            return (
              <div
                key={tech.id}
                id={tech.id}
                className={`rounded-3xl border ${tech.borderColor} bg-gradient-to-br ${tech.bgGradient} text-white p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row ${
                  isReversed ? "lg:flex-row-reverse" : ""
                } items-center justify-between gap-8 scroll-mt-28`}
              >
                {/* Text Content */}
                <div className="space-y-4 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-gold-400 backdrop-blur-md border border-white/20">
                      {tech.badge}
                    </span>
                    <span className="text-xs font-bold text-gray-300">
                      From {formatPrice(tech.price)}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {tech.name}
                  </h3>

                  <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    {tech.tagline}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    {tech.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2 pt-2">
                    {tech.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-200">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${tech.accentColor}`} />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-[11px] text-gray-400">
                    <strong className="text-white">Recommended For:</strong> {tech.idealFor}
                  </div>

                  <div className="pt-4 flex flex-wrap gap-3">
                    <Link
                      href="/products?category=eyeglasses"
                      className="px-6 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
                    >
                      <span>Choose Frame for this Lens</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Right Visual Feature Box */}
                <div className="w-full lg:w-96 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 space-y-4 shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-2">
                    <Icon className={`w-7 h-7 ${tech.accentColor}`} />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Laboratory Surcharge
                    </span>
                    <div className="text-3xl font-extrabold text-white">
                      +{formatPrice(tech.price)}
                    </div>
                    <span className="text-[11px] text-emerald-400 font-semibold block">
                      ✓ Fits Any Optical Frame
                    </span>
                  </div>

                  <div className="pt-4 border-t border-white/15 space-y-2 text-xs text-gray-300">
                    <div className="flex justify-between">
                      <span>Coating:</span>
                      <span className="font-semibold text-white">Vacuum Multi-Layer AR</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Index:</span>
                      <span className="font-semibold text-white">1.56 / 1.61 High-Index</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Warranty:</span>
                      <span className="font-semibold text-white">1 Year Glazing Warranty</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fitting:</span>
                      <span className="font-semibold text-white">Robotic Computerized</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Matrix Table */}
      <section id="lens-comparison" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
              Side-by-Side Review
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Optical Lens Comparison Matrix
            </h2>
            <p className="text-xs text-gray-500">
              Compare features, coatings, and pricing to decide which lens matches your vision prescription.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-y">
                <tr>
                  <th className="py-4 px-4 font-bold text-gray-900">Feature</th>
                  <th className="py-4 px-3 text-center">Frame Only</th>
                  <th className="py-4 px-3 text-center bg-blue-50/50 text-blue-900 font-bold">Blue Cut</th>
                  <th className="py-4 px-3 text-center">Anti-Glare</th>
                  <th className="py-4 px-3 text-center bg-amber-50/50 text-amber-900 font-bold">Transitions</th>
                  <th className="py-4 px-3 text-center bg-purple-50/50 text-purple-900 font-bold">Progressives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-3 text-center text-gray-600">
                      {row.frameOnly}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-brand-700 bg-blue-50/30">
                      {row.blueCut}
                    </td>
                    <td className="py-3.5 px-3 text-center text-gray-700 font-medium">
                      {row.antiGlare}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-amber-800 bg-amber-50/30">
                      {row.transition}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-purple-900 bg-purple-50/30">
                      {row.progressive}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Step-by-Step "How Prescription Ordering Works" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-luxury-dark to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              How Ordering Prescription Glasses Works
            </h2>
            <p className="text-xs text-gray-300">
              No need to travel to an optical bazaar. Order custom glazed eyewear from home in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-700 text-white font-extrabold text-sm flex items-center justify-center shadow">
                1
              </div>
              <h4 className="font-extrabold text-base text-white">Select Any Frame & Test Try-On</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Browse our designer catalogue of acetate, titanium, and metal frames. Use our real-time Virtual Try-On camera to see how it fits your face shape.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-700 text-white font-extrabold text-sm flex items-center justify-center shadow">
                2
              </div>
              <h4 className="font-extrabold text-base text-white">Pick Lens & Attach Prescription</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Choose your lens type (Blue Cut, Transitions, Progressives). Snap a photo of your doctor&apos;s slip, type your numbers, or select &quot;Send via WhatsApp Later&quot;.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-700 text-white font-extrabold text-sm flex items-center justify-center shadow">
                3
              </div>
              <h4 className="font-extrabold text-base text-white">Doorstep COD Delivery</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Our optical lab cuts and glazes your lenses with robotic precision. Your finished glasses are delivered to your doorstep via TCS / Leopards with Cash on Delivery.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/products?category=eyeglasses"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-brand-900 hover:bg-gray-100 font-bold text-xs rounded-xl shadow transition-all"
            >
              <span>Explore All Optical Eyeglasses</span>
              <ArrowRight className="w-4 h-4 text-brand-700" />
            </Link>
          </div>
        </div>
      </section>

      {/* Eyesight Prescription Guide & Anatomy of an Rx Slip */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
            Optometrist Education
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            How to Read Your Doctor&apos;s Prescription Card
          </h2>
          <p className="text-xs text-gray-500">
            Confused by SPH, CYL, Axis, and PD? Here is a breakdown of ophthalmology terms.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
              <span className="font-bold text-brand-700 text-sm block">OD (Oculus Dexter)</span>
              <p className="text-gray-600">
                Latin for <strong>Right Eye</strong>. All parameters listed on the OD row correspond to your right lens.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
              <span className="font-bold text-brand-700 text-sm block">OS (Oculus Sinister)</span>
              <p className="text-gray-600">
                Latin for <strong>Left Eye</strong>. All parameters on the OS row correspond to your left lens.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
              <span className="font-bold text-gray-900 text-sm block">SPH (Sphere)</span>
              <p className="text-gray-600">
                The optical strength of the lens. Minus (<strong>-</strong>) means nearsightedness (myopia), plus (<strong>+</strong>) means farsightedness (hyperopia).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
              <span className="font-bold text-gray-900 text-sm block">CYL & Axis (Astigmatism)</span>
              <p className="text-gray-600">
                <strong>CYL</strong> indicates astigmatism correction. <strong>Axis</strong> is a number between 1° and 180° specifying the angle of the cylinder curve.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
              <span className="font-bold text-gray-900 text-sm block">ADD (Reading Addition)</span>
              <p className="text-gray-600">
                The magnifying power added to the bottom of progressive or bifocal lenses for comfortable reading. Usually between +1.00 and +3.00.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
              <span className="font-bold text-gray-900 text-sm block">PD (Pupillary Distance)</span>
              <p className="text-gray-600">
                The distance in millimeters between the centers of your two pupils. Standard adult PD ranges from 58mm to 68mm (average is 62–64mm).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-xs text-brand-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-bold block">Don&apos;t worry if you don&apos;t know your numbers!</span>
              <p className="text-brand-800 text-[11px]">
                Simply take a photo of your doctor&apos;s slip when adding to cart, or WhatsApp it to our certified optician at <strong>0300-1234567</strong>.
              </p>
            </div>
            <Link
              href="/products?category=eyeglasses"
              className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl shadow shrink-0"
            >
              Order with Slip
            </Link>
          </div>
        </div>
      </section>

      {/* Optical FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
            Answers & Clarity
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Questions About Optical Lenses
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-2">
            <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-700" />
              Do I need a prescription to order Blue Cut computer glasses?
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              No! You can choose &quot;Zero Power (Plano)&quot; when selecting Blue Cut lenses. You will get the full 99.8% blue light filtering and anti-glare screen protection with zero magnification, ideal for anyone using digital screens with normal 20/20 eyesight.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-2">
            <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-700" />
              How dark do the Photochromic Transition lenses get in Pakistan?
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              In outdoor sunlight across Pakistani cities, our photochromic lenses darken to approximately Category 3 sunglasses (75% to 80% tint) in under 30 seconds. They quickly fade back to 100% transparent clarity once you enter a home, office, or vehicle.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-2">
            <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-700" />
              Can I upload a picture of my doctor&apos;s prescription slip?
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Yes! On any product page, click &quot;Select Lenses & Prescription&quot;, choose &quot;Upload Doctor Slip Photo&quot;, and attach a photo from your phone or PC. Our optometrists will read the handwriting, verify the parameters, and glaze your lenses accurately.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-2">
            <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-700" />
              What if my prescription glasses arrive with an incorrect number?
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              We offer a 100% Accuracy Guarantee. If the glazed lenses do not match your submitted prescription slip, we will re-glaze and replace them completely free of charge under our 7-Day Optical Guarantee.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
