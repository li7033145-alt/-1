import React, { useState } from 'react';

export interface CoverPreset {
  key: string;
  label: string;
  subtitle: string;
}

export const COVER_PRESETS: CoverPreset[] = [
  { key: 'music', label: '草坪音乐节', subtitle: '舞台灯光 · 乐队演出' },
  { key: 'photo', label: '光影摄影展', subtitle: '画廊展厅 · 纪实影像' },
  { key: 'basketball', label: '热血篮球赛', subtitle: '落日球场 · 院系对抗' },
  { key: 'design', label: '校园设计赛', subtitle: '创意工坊 · 模型作品' },
  { key: 'market', label: '林荫创意市集', subtitle: '手作摊位 · 社团文创' },
  { key: 'lecture', label: '前沿学术讲堂', subtitle: '报告大厅 · 思想交锋' },
  { key: 'debate', label: '思辨华语辩论', subtitle: '唇枪舌剑 · 决赛现场' },
  { key: 'gala', label: '星光迎新晚会', subtitle: '礼堂舞台 · 节目海选' },
];

interface CoverArtworkProps {
  cover: string;
  title?: string;
  className?: string;
}

export const CoverArtwork: React.FC<CoverArtworkProps> = ({
  cover,
  title = '校园活动封面',
  className = 'w-full h-full',
}) => {
  const [imgError, setImgError] = useState(false);

  const isUrlOrData =
    (cover.startsWith('data:image/') || cover.startsWith('http') || cover.startsWith('/')) &&
    !imgError;

  if (isUrlOrData) {
    return (
      <div className={`relative overflow-hidden bg-[#EAE9E7] ${className}`}>
        <img
          src={cover}
          alt={title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  switch (cover) {
    case 'music':
      return (
        <div className={`relative overflow-hidden bg-[#241B2F] ${className}`} role="img" aria-label={title}>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <defs>
              <linearGradient id="musicSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E1836" />
                <stop offset="55%" stopColor="#5D2E46" />
                <stop offset="100%" stopColor="#FF5A4F" />
              </linearGradient>
              <radialGradient id="stageGlow" cx="50%" cy="62%" r="45%">
                <stop offset="0%" stopColor="#FFB88C" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#FF5A4F" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#1E1836" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="600" height="360" fill="url(#musicSky)" />
            <circle cx="300" cy="215" r="195" fill="url(#stageGlow)" />
            {/* String lights */}
            <path d="M0,55 Q150,95 300,65 T600,75" fill="none" stroke="#FFF0ED" strokeWidth="1.2" strokeOpacity="0.5" />
            {[60, 125, 190, 255, 325, 395, 465, 535].map((cx, idx) => (
              <circle key={idx} cx={cx} cy={idx % 2 === 0 ? 74 : 69} r="4.5" fill="#FFE3B3" />
            ))}
            {/* Stage truss & arch */}
            <path d="M135,265 L165,125 L435,125 L465,265 Z" fill="#171326" fillOpacity="0.72" stroke="#FF9278" strokeWidth="2" />
            {/* Spotlights */}
            <polygon points="210,128 140,280 250,280" fill="#FFE5C4" fillOpacity="0.18" />
            <polygon points="390,128 350,280 460,280" fill="#FFE5C4" fillOpacity="0.18" />
            <polygon points="300,128 245,280 355,280" fill="#FF7B6B" fillOpacity="0.24" />
            {/* Band silhouettes on stage */}
            <circle cx="300" cy="198" r="11" fill="#FFF0ED" />
            <path d="M286,248 L292,211 L308,211 L314,248 Z" fill="#FFF0ED" />
            <line x1="278" y1="224" x2="326" y2="212" stroke="#FF5A4F" strokeWidth="4" strokeLinecap="round" />
            <circle cx="235" cy="206" r="9" fill="#FFD1C2" />
            <path d="M224,248 L229,217 L241,217 L246,248 Z" fill="#FFD1C2" />
            <circle cx="368" cy="210" r="9" fill="#FFD1C2" />
            <rect x="352" y="226" width="32" height="20" rx="4" fill="#FFD1C2" fillOpacity="0.85" />
            {/* Campus lawn & cheering crowd silhouettes */}
            <path d="M0,255 Q300,235 600,255 L600,360 L0,360 Z" fill="#191321" />
            {[45, 92, 140, 188, 236, 285, 334, 382, 430, 478, 526, 565].map((x, i) => (
              <g key={i} transform={`translate(${x}, ${285 + (i % 3) * 8})`}>
                <circle cx="0" cy="0" r="13" fill="#2A2035" />
                <path d="M-18,45 Q-16,14 0,14 Q16,14 18,45 Z" fill="#231A2D" />
              </g>
            ))}
          </svg>
        </div>
      );

    case 'photo':
      return (
        <div className={`relative overflow-hidden bg-[#EFECE6] ${className}`} role="img" aria-label={title}>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <rect width="600" height="360" fill="#F3EFEA" />
            {/* Sunlight window beam */}
            <polygon points="0,0 260,0 440,360 110,360" fill="#FFFDF9" fillOpacity="0.78" />
            {/* Gallery floor */}
            <rect x="0" y="268" width="600" height="92" fill="#D8C8B8" />
            <line x1="0" y1="268" x2="600" y2="268" stroke="#C2B09E" strokeWidth="2" />
            {/* Framed photographs on gallery wall */}
            <g transform="translate(76, 66)">
              <rect width="124" height="148" rx="4" fill="#262322" />
              <rect x="8" y="8" width="108" height="132" fill="#FAF8F5" />
              <rect x="22" y="22" width="80" height="92" fill="#D97F6C" />
              <circle cx="48" cy="52" r="12" fill="#FFF3EB" />
              <path d="M22,94 L54,68 L78,86 L102,62 L102,114 L22,114 Z" fill="#4A3B39" />
            </g>
            <g transform="translate(238, 54)">
              <rect width="136" height="164" rx="4" fill="#262322" />
              <rect x="9" y="9" width="118" height="146" fill="#FAF8F5" />
              <rect x="24" y="24" width="88" height="104" fill="#3D5A6C" />
              <path d="M24,106 Q68,72 112,102 L112,128 L24,128 Z" fill="#E7A977" />
              <circle cx="84" cy="54" r="14" fill="#FDEBD0" />
            </g>
            <g transform="translate(412, 72)">
              <rect width="114" height="140" rx="4" fill="#262322" />
              <rect x="8" y="8" width="98" height="124" fill="#FAF8F5" />
              <rect x="20" y="20" width="74" height="86" fill="#7CA08A" />
              <circle cx="57" cy="63" r="21" fill="#F7F4EA" fillOpacity="0.85" />
            </g>
            {/* Student viewer silhouette */}
            <circle cx="215" cy="214" r="16" fill="#2E2927" />
            <path d="M192,330 C192,262 200,238 215,238 C230,238 238,262 238,330 Z" fill="#3B3330" />
            <circle cx="385" cy="222" r="15" fill="#514744" />
            <path d="M364,335 C364,270 371,244 385,244 C399,244 406,270 406,335 Z" fill="#FF5A4F" />
          </svg>
        </div>
      );

    case 'basketball':
      return (
        <div className={`relative overflow-hidden bg-[#D96B43] ${className}`} role="img" aria-label={title}>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <defs>
              <linearGradient id="courtSunset" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF865E" />
                <stop offset="55%" stopColor="#E0533C" />
                <stop offset="100%" stopColor="#3B2737" />
              </linearGradient>
            </defs>
            <rect width="600" height="360" fill="url(#courtSunset)" />
            <circle cx="465" cy="92" r="46" fill="#FFE6B8" fillOpacity="0.85" />
            {/* Court floor */}
            <path d="M0,228 L600,228 L600,360 L0,360 Z" fill="#2E4756" />
            <path d="M80,228 L520,228 L585,360 L15,360 Z" fill="#3A5A6B" stroke="#F7F7F5" strokeWidth="2.5" strokeOpacity="0.65" />
            <ellipse cx="300" cy="292" rx="95" ry="28" fill="none" stroke="#F7F7F5" strokeWidth="2.5" strokeOpacity="0.65" />
            {/* Backboard and hoop */}
            <line x1="152" y1="115" x2="152" y2="255" stroke="#1E1E24" strokeWidth="8" />
            <rect x="132" y="82" width="58" height="44" rx="4" fill="#FFF8F2" stroke="#1E1E24" strokeWidth="3" />
            <rect x="150" y="98" width="22" height="16" fill="none" stroke="#FF5A4F" strokeWidth="2.5" />
            <line x1="172" y1="114" x2="196" y2="114" stroke="#FF5A4F" strokeWidth="4" />
            <path d="M174,114 L179,136 L191,136 L194,114" fill="none" stroke="#FFF0ED" strokeWidth="2" strokeDasharray="3,2" />
            {/* Basketball in mid-air */}
            <circle cx="242" cy="96" r="16" fill="#FF6B35" stroke="#231917" strokeWidth="2" />
            <path d="M228,96 Q242,84 256,96 M242,80 L242,112" fill="none" stroke="#231917" strokeWidth="1.8" />
            {/* Players */}
            <circle cx="290" cy="168" r="13" fill="#231917" />
            <path d="M268,242 L282,184 L304,184 L314,242 Z" fill="#FFF0ED" />
            <circle cx="364" cy="186" r="13" fill="#231917" />
            <path d="M346,258 L354,202 L376,202 L384,258 Z" fill="#FF5A4F" />
          </svg>
        </div>
      );

    case 'design':
      return (
        <div className={`relative overflow-hidden bg-[#F3ECE6] ${className}`} role="img" aria-label={title}>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <rect width="600" height="360" fill="#F4EFEA" />
            {/* Architectural grid lines */}
            <g stroke="#E2D9D0" strokeWidth="1">
              <line x1="0" y1="90" x2="600" y2="90" />
              <line x1="0" y1="180" x2="600" y2="180" />
              <line x1="0" y1="270" x2="600" y2="270" />
              <line x1="150" y1="0" x2="150" y2="360" />
              <line x1="300" y1="0" x2="300" y2="360" />
              <line x1="450" y1="0" x2="450" y2="360" />
            </g>
            {/* Geometric poster boards & architectural models */}
            <rect x="85" y="52" width="175" height="236" rx="12" fill="#FFFFFF" stroke="#D9CEC3" strokeWidth="2" />
            <circle cx="172" cy="134" r="46" fill="#FF5A4F" />
            <path d="M126,180 L218,180 L172,112 Z" fill="#232B38" fillOpacity="0.88" />
            <rect x="118" y="210" width="108" height="10" rx="5" fill="#514744" />
            <rect x="118" y="230" width="72" height="8" rx="4" fill="#9A8984" />

            <rect x="296" y="76" width="218" height="212" rx="12" fill="#232B38" />
            <circle cx="452" cy="136" r="34" fill="#FFB88C" />
            <rect x="326" y="114" width="84" height="84" rx="10" fill="#FF5A4F" fillOpacity="0.9" />
            <rect x="358" y="148" width="94" height="78" rx="8" fill="#FFF0ED" />
            <text x="328" y="262" fill="#FFF0ED" fontSize="15" fontWeight="700" fontFamily="sans-serif">
              CAMPUS DESIGN STUDIO
            </text>
          </svg>
        </div>
      );

    case 'market':
      return (
        <div className={`relative overflow-hidden bg-[#E5EFE9] ${className}`} role="img" aria-label={title}>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <rect width="600" height="360" fill="#EBF3ED" />
            {/* Campus trees canopy */}
            <circle cx="95" cy="48" r="95" fill="#76A085" fillOpacity="0.55" />
            <circle cx="515" cy="36" r="110" fill="#648F73" fillOpacity="0.55" />
            <circle cx="310" cy="22" r="85" fill="#89B096" fillOpacity="0.45" />
            {/* Market booth awning */}
            <g transform="translate(115, 92)">
              <line x1="18" y1="48" x2="18" y2="210" stroke="#7A553E" strokeWidth="6" />
              <line x1="352" y1="48" x2="352" y2="210" stroke="#7A553E" strokeWidth="6" />
              {/* Striped canopy */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
                <path
                  key={idx}
                  d={`M${idx * 46},0 L${(idx + 1) * 46},0 L${(idx + 1) * 46},48 Q${idx * 46 + 23},62 ${idx * 46},48 Z`}
                  fill={idx % 2 === 0 ? '#FF5A4F' : '#FFFDF9'}
                />
              ))}
              {/* Craft table & handmade goods */}
              <rect x="0" y="158" width="370" height="68" rx="8" fill="#D59B6E" />
              <rect x="14" y="168" width="342" height="44" rx="4" fill="#FFF6EC" />
              {/* Ceramics, tote bags, plants */}
              <rect x="48" y="122" width="34" height="36" rx="6" fill="#FF5A4F" />
              <circle cx="118" cy="138" r="18" fill="#E9B872" />
              <path d="M168,158 L178,118 L212,118 L222,158 Z" fill="#4E7D63" />
              <rect x="255" y="116" width="42" height="42" rx="6" fill="#3B4E5C" />
              <circle cx="322" cy="140" r="16" fill="#E07A5F" />
            </g>
          </svg>
        </div>
      );

    case 'lecture':
      return (
        <div className={`relative overflow-hidden bg-[#222B35] ${className}`} role="img" aria-label={title}>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <rect width="600" height="360" fill="#1F2933" />
            {/* Wooden acoustic wall panels */}
            <rect x="30" y="24" width="540" height="210" rx="10" fill="#313D4B" />
            {/* Presentation screen */}
            <rect x="145" y="46" width="310" height="154" rx="8" fill="#F8FAFC" />
            <rect x="168" y="68" width="130" height="14" rx="4" fill="#FF5A4F" />
            <rect x="168" y="94" width="195" height="10" rx="3" fill="#475569" />
            <rect x="168" y="114" width="165" height="10" rx="3" fill="#94A3B8" />
            {/* Chart graphic on slide */}
            <rect x="380" y="112" width="16" height="58" rx="3" fill="#FF857A" />
            <rect x="404" y="88" width="16" height="82" rx="3" fill="#FF5A4F" />
            {/* Speaker at podium */}
            <rect x="106" y="176" width="38" height="62" rx="4" fill="#9A6B4C" />
            <circle cx="125" cy="142" r="11" fill="#FDE2CE" />
            <path d="M110,176 Q125,156 140,176 Z" fill="#FF5A4F" />
            {/* Tiered auditorium audience silhouettes */}
            {[90, 155, 220, 285, 350, 415, 480].map((x, idx) => (
              <g key={idx} transform={`translate(${x}, 278)`}>
                <circle cx="0" cy="0" r="14" fill="#435264" />
                <path d="M-24,48 Q-20,16 0,16 Q20,16 24,48 Z" fill="#364454" />
              </g>
            ))}
          </svg>
        </div>
      );

    case 'debate':
      return (
        <div className={`relative overflow-hidden bg-[#2C2229] ${className}`} role="img" aria-label={title}>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <rect width="600" height="360" fill="#2A2128" />
            <circle cx="300" cy="145" r="150" fill="#FF5A4F" fillOpacity="0.18" />
            {/* Pro vs Con podiums */}
            <rect x="85" y="190" width="150" height="90" rx="8" fill="#3E323B" stroke="#FF5A4F" strokeWidth="2" />
            <rect x="365" y="190" width="150" height="90" rx="8" fill="#3E323B" stroke="#9A8984" strokeWidth="2" />
            <text x="132" y="242" fill="#FF5A4F" fontSize="22" fontWeight="700">正方</text>
            <text x="412" y="242" fill="#F7F7F5" fontSize="22" fontWeight="700">反方</text>
            <circle cx="300" cy="135" r="38" fill="#FFF0ED" />
            <text x="282" y="143" fill="#FF5A4F" fontSize="22" fontWeight="700">VS</text>
          </svg>
        </div>
      );

    default:
      return (
        <div className={`relative overflow-hidden bg-[#31243E] ${className}`} role="img" aria-label={title}>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <defs>
              <linearGradient id="galaGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#261C35" />
                <stop offset="50%" stopColor="#723854" />
                <stop offset="100%" stopColor="#FF5A4F" />
              </linearGradient>
            </defs>
            <rect width="600" height="360" fill="url(#galaGrad)" />
            <circle cx="300" cy="180" r="120" fill="#FFF0ED" fillOpacity="0.14" />
            <circle cx="300" cy="180" r="72" fill="#FFF0ED" fillOpacity="0.22" />
            <path d="M245,235 L300,115 L355,235 Z" fill="#FFF0ED" fillOpacity="0.85" />
          </svg>
        </div>
      );
  }
};
