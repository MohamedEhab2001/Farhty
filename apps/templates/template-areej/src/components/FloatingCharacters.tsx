'use client'

import { useTemplateFields } from '@farhty/template-sdk'

function GroomSVG() {
  return (
    <svg viewBox="0 0 160 360" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      {/* Head */}
      <ellipse cx="80" cy="52" rx="28" ry="30" fill="#FDDCC4" />
      {/* Hair */}
      <path d="M52,38 Q80,16 108,38 Q112,46 108,54 L52,54 Q48,46 52,38Z" fill="#3C2A2A" />
      {/* Ears */}
      <ellipse cx="52" cy="54" rx="6" ry="8" fill="#F5C5A0" />
      <ellipse cx="108" cy="54" rx="6" ry="8" fill="#F5C5A0" />
      {/* Eyes */}
      <circle cx="70" cy="55" r="3.5" fill="#4A3535" />
      <circle cx="90" cy="55" r="3.5" fill="#4A3535" />
      <circle cx="71.5" cy="53.5" r="1.2" fill="white" />
      <circle cx="91.5" cy="53.5" r="1.2" fill="white" />
      {/* Eyebrows */}
      <path d="M63,47 Q70,43 77,47" stroke="#3C2A2A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M83,47 Q90,43 97,47" stroke="#3C2A2A" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Smile */}
      <path d="M70,66 Q80,73 90,66" stroke="#D4627F" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Neck */}
      <rect x="72" y="81" width="16" height="14" fill="#FDDCC4" />
      {/* White shirt */}
      <path d="M65,88 L58,100 L102,100 L95,88 Z" fill="white" />
      {/* Bow tie */}
      <path d="M73,91 L77,96 L73,101 L80,97 L87,101 L83,96 L87,91 L80,95 Z" fill="#D4627F" />
      {/* Suit jacket */}
      <path d="M50,98 L38,105 L32,185 L128,185 L122,105 L110,98 L95,100 L80,96 L65,100 Z" fill="#3C2A2A" />
      {/* Lapels */}
      <path d="M80,96 L65,100 L60,118 L80,110 Z" fill="#4A3535" />
      <path d="M80,96 L95,100 L100,118 L80,110 Z" fill="#4A3535" />
      {/* Buttons */}
      <circle cx="80" cy="148" r="3" fill="#4A3535" />
      <circle cx="80" cy="163" r="3" fill="#4A3535" />
      {/* Boutonniere */}
      <circle cx="100" cy="122" r="7" fill="#D4627F" />
      <circle cx="100" cy="122" r="4" fill="#F5D5DE" />
      <circle cx="100" cy="122" r="2" fill="#D4627F" />
      {/* Pocket square */}
      <path d="M93,104 L99,104 L97,112 L91,112 Z" fill="#F5D5DE" />
      {/* Trousers */}
      <path d="M32,183 L24,290 L70,290 L80,240 L90,290 L136,290 L128,183 Z" fill="#2A2A3C" />
      {/* Shoes */}
      <ellipse cx="46" cy="292" rx="22" ry="8" fill="#1A1A2A" />
      <ellipse cx="114" cy="292" rx="22" ry="8" fill="#1A1A2A" />
    </svg>
  )
}

function BrideSVG() {
  return (
    <svg viewBox="0 0 160 380" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      {/* Veil */}
      <path d="M80,28 Q115,20 148,50 Q155,80 145,130 Q135,175 120,215 L100,210 Q115,170 122,130 Q130,85 118,58 Q104,38 80,40 Z" fill="#FFF0F5" opacity="0.9" />
      {/* Head */}
      <ellipse cx="80" cy="52" rx="27" ry="30" fill="#FDDCC4" />
      {/* Hair */}
      <ellipse cx="80" cy="26" rx="16" ry="10" fill="#7B3F00" />
      <path d="M53,38 Q80,18 107,38 Q110,48 107,58 L53,58 Q50,48 53,38Z" fill="#7B3F00" />
      {/* Flower in hair */}
      <circle cx="100" cy="30" r="7" fill="#D4627F" />
      <circle cx="100" cy="30" r="4" fill="#F9CFD8" />
      <circle cx="100" cy="30" r="2" fill="#D4627F" />
      {/* Ear */}
      <ellipse cx="53" cy="54" rx="5" ry="7" fill="#F5C5A0" />
      {/* Eyes */}
      <circle cx="70" cy="56" r="3.5" fill="#4A3535" />
      <circle cx="90" cy="56" r="3.5" fill="#4A3535" />
      <circle cx="71.5" cy="54.5" r="1.2" fill="white" />
      <circle cx="91.5" cy="54.5" r="1.2" fill="white" />
      {/* Lashes */}
      <path d="M67,53 L65,50 M70,52 L69,49 M73,53 L73,50" stroke="#3C2A2A" strokeWidth="1" />
      <path d="M87,53 L87,50 M90,52 L91,49 M93,53 L95,50" stroke="#3C2A2A" strokeWidth="1" />
      {/* Eyebrows */}
      <path d="M63,48 Q70,44 77,48" stroke="#7B3F00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M83,48 Q90,44 97,48" stroke="#7B3F00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Smile */}
      <path d="M70,68 Q80,75 90,68" stroke="#D4627F" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="62" cy="64" rx="8" ry="5" fill="#F4A8BA" opacity="0.4" />
      <ellipse cx="98" cy="64" rx="8" ry="5" fill="#F4A8BA" opacity="0.4" />
      {/* Neck */}
      <rect x="72" y="81" width="16" height="13" fill="#FDDCC4" />
      {/* Necklace */}
      <path d="M65,90 Q80,97 95,90" stroke="#D4A0B0" strokeWidth="1.5" fill="none" />
      <circle cx="80" cy="95" r="3" fill="#E8A0B4" />
      {/* Dress bodice */}
      <path d="M55,92 L42,106 L38,155 L122,155 L118,106 L105,92 Q94,96 80,94 Q66,96 55,92Z" fill="#F5D5DE" />
      {/* Lace trim */}
      <path d="M55,92 Q80,100 105,92" stroke="#E8A0B4" strokeWidth="1.5" fill="none" />
      <path d="M43,115 Q80,120 117,115" stroke="#E8A0B4" strokeWidth="1" fill="none" opacity="0.7" />
      <path d="M40,135 Q80,140 120,135" stroke="#E8A0B4" strokeWidth="1" fill="none" opacity="0.7" />
      {/* Skirt */}
      <path d="M38,153 Q18,185 8,240 Q20,250 80,252 Q140,250 152,240 Q142,185 122,153Z" fill="white" />
      <path d="M33,170 Q18,195 12,225 Q50,232 80,232 Q110,232 148,225 Q142,195 127,170Z" fill="#FFF0F5" />
      <path d="M28,195 Q20,215 18,240 Q50,248 80,248 Q110,248 142,240 Q140,215 132,195Z" fill="white" opacity="0.8" />
      {/* Skirt details */}
      <path d="M28,185 Q80,195 132,185" stroke="#F5D5DE" strokeWidth="2" fill="none" />
      <path d="M20,210 Q80,222 140,210" stroke="#F5D5DE" strokeWidth="2" fill="none" />
      <path d="M16,232 Q80,245 144,232" stroke="#F5D5DE" strokeWidth="1.5" fill="none" />
      {/* Bouquet */}
      <circle cx="46" cy="170" r="14" fill="#D4627F" opacity="0.85" />
      <circle cx="58" cy="160" r="10" fill="#E8A0B4" opacity="0.9" />
      <circle cx="36" cy="162" r="9" fill="#B84464" opacity="0.85" />
      <circle cx="50" cy="178" r="8" fill="#F4A8BA" opacity="0.8" />
      <line x1="48" y1="184" x2="44" y2="210" stroke="#D4627F" strokeWidth="2" strokeLinecap="round" />
      <path d="M42,208 Q44,218 46,210" stroke="#D4627F" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

export default function FloatingCharacters() {
  const { get } = useTemplateFields()

  const groomImg = get('groom_character') as string | undefined
  const brideImg = get('bride_character') as string | undefined

  const sideStyle: React.CSSProperties = {
    width: 'clamp(90px, 12vw, 180px)',
  }

  return (
    <>
      {/* Groom — left side */}
      <div
        className="fixed left-0 top-0 h-full pointer-events-none z-0 flex items-center justify-start"
        style={sideStyle}
      >
        <div style={{ animation: 'floatSlow 9s ease-in-out infinite', opacity: 0.1, width: '100%' }}>
          {groomImg ? (
            <img
              src={groomImg}
              alt=""
              style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '70vh' }}
            />
          ) : (
            <GroomSVG />
          )}
        </div>
      </div>

      {/* Bride — right side */}
      <div
        className="fixed right-0 top-0 h-full pointer-events-none z-0 flex items-center justify-end"
        style={sideStyle}
      >
        <div style={{ animation: 'floatSlow 11s ease-in-out infinite 1.5s', opacity: 0.1, width: '100%' }}>
          {brideImg ? (
            <img
              src={brideImg}
              alt=""
              style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '70vh' }}
            />
          ) : (
            <BrideSVG />
          )}
        </div>
      </div>
    </>
  )
}
