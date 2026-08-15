// Ministers Connect Official Event Flyer Asset
// Theme: "REIGNING in the STORM" - As Ministers of God, We Thrive in Trials
// Date: Third Friday 21st - 22nd August 2026 | Maitama, Abuja | Host: Pastor John EZE

const createFlyerSvg = (isLandscape: boolean = false) => {
  if (isLandscape) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGradL" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e8f4f8"/>
      <stop offset="35%" stop-color="#fdfbf7"/>
      <stop offset="70%" stop-color="#f9f5ea"/>
      <stop offset="100%" stop-color="#f0ebe0"/>
    </linearGradient>
    <linearGradient id="stormGradL" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e76f51"/>
      <stop offset="25%" stop-color="#f4a261"/>
      <stop offset="50%" stop-color="#2a9d8f"/>
      <stop offset="75%" stop-color="#264653"/>
      <stop offset="100%" stop-color="#2b9348"/>
    </linearGradient>
    <filter id="dropShadowL" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#0f172a" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1600" height="900" fill="url(#bgGradL)"/>

  <!-- Subtle cloud mist texture -->
  <circle cx="200" cy="150" r="300" fill="#ffffff" opacity="0.6" filter="blur(40px)"/>
  <circle cx="1400" cy="180" r="350" fill="#ffffff" opacity="0.6" filter="blur(40px)"/>
  <circle cx="800" cy="300" r="400" fill="#ffffff" opacity="0.5" filter="blur(50px)"/>

  <!-- Top Leaves Left & Right -->
  <g opacity="0.9">
    <path d="M-20,-20 Q80,120 180,90 Q90,20 -20,-20 Z" fill="#2d6a4f"/>
    <path d="M-10,40 Q120,160 220,110 Q110,40 -10,40 Z" fill="#40916c"/>
    <path d="M1620,-20 Q1520,120 1420,90 Q1510,20 1620,-20 Z" fill="#2d6a4f"/>
    <path d="M1610,40 Q1480,160 1380,110 Q1490,40 1610,40 Z" fill="#40916c"/>
  </g>

  <!-- Header Branding -->
  <g transform="translate(800, 90)">
    <circle cx="-160" cy="-5" r="24" fill="#0284c7" opacity="0.2"/>
    <circle cx="-160" cy="-5" r="16" fill="none" stroke="#0369a1" stroke-width="4"/>
    <circle cx="-160" cy="-12" r="5" fill="#0284c7"/>
    <circle cx="-166" cy="0" r="4" fill="#059669"/>
    <circle cx="-154" cy="0" r="4" fill="#0284c7"/>
    <text x="-120" y="5" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" fill="#0f172a" letter-spacing="3">MINISTERS</text>
    <text x="85" y="5" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="34" fill="#0284c7" letter-spacing="3">CONNECT</text>
    <text x="0" y="32" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="14" fill="#475569" letter-spacing="8">MONTHLY PROGRAM</text>
  </g>

  <!-- Main Title: REIGNING in the STORM -->
  <text x="800" y="240" text-anchor="middle" font-family="Georgia, serif" font-weight="900" font-size="108" fill="#ffffff" stroke="#94a3b8" stroke-width="3" filter="url(#dropShadowL)" letter-spacing="6">REIGNING</text>
  <text x="800" y="295" text-anchor="middle" font-family="'Brush Script MT', 'Segoe Script', cursive" font-style="italic" font-size="64" fill="#0f172a">in the</text>
  <text x="800" y="410" text-anchor="middle" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="140" fill="url(#stormGradL)" letter-spacing="12" filter="url(#dropShadowL)">STORM</text>

  <!-- Subtitle -->
  <text x="800" y="465" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="22" fill="#0f172a" letter-spacing="4">AS MINISTERS OF GOD,</text>
  <text x="800" y="495" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="26" fill="#0369a1" letter-spacing="4">WE THRIVE IN TRIALS.</text>

  <!-- 4 Pillars Section -->
  <g transform="translate(180, 530)">
    <!-- Line -->
    <line x1="0" y1="0" x2="1240" y2="0" stroke="#cbd5e1" stroke-width="1.5"/>
    
    <!-- Pillar 1 -->
    <g transform="translate(140, 30)">
      <circle cx="0" cy="0" r="20" fill="#ecfdf5"/>
      <path d="M-8,6 Q0,-12 8,6 M0,-4 Q0,10 0,10" stroke="#059669" stroke-width="2.5" fill="none"/>
      <text x="0" y="26" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="#0f172a">STAY ROOTED</text>
      <text x="0" y="42" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#64748b">IN GOD'S WORD</text>
    </g>

    <line x1="310" y1="10" x2="310" y2="70" stroke="#e2e8f0" stroke-width="1"/>

    <!-- Pillar 2 -->
    <g transform="translate(480, 30)">
      <circle cx="0" cy="0" r="20" fill="#f0fdfa"/>
      <path d="M-8,-8 L8,-8 L8,2 Q8,10 0,14 Q-8,10 -8,2 Z" stroke="#0284c7" stroke-width="2" fill="none"/>
      <text x="0" y="26" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="#0f172a">STAY FOCUSED</text>
      <text x="0" y="42" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#64748b">ON HIS PURPOSE</text>
    </g>

    <line x1="620" y1="10" x2="620" y2="70" stroke="#e2e8f0" stroke-width="1"/>

    <!-- Pillar 3 -->
    <g transform="translate(760, 30)">
      <circle cx="0" cy="0" r="20" fill="#fff7ed"/>
      <path d="M0,10 Q8,0 0,-10 Q-4,0 -2,4 Q-8,0 0,10 Z" fill="#ea580c"/>
      <text x="0" y="26" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="#0f172a">STAY FIRED</text>
      <text x="0" y="42" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#64748b">BY HIS SPIRIT</text>
    </g>

    <line x1="930" y1="10" x2="930" y2="70" stroke="#e2e8f0" stroke-width="1"/>

    <!-- Pillar 4 -->
    <g transform="translate(1100, 30)">
      <circle cx="0" cy="0" r="20" fill="#f8fafc"/>
      <path d="M-4,10 L4,10 L2,-6 L-2,-6 Z M-6,10 L6,10 M-3,-10 L3,-10" stroke="#334155" stroke-width="2" fill="none"/>
      <text x="0" y="26" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="#0f172a">STAY FAITHFUL</text>
      <text x="0" y="42" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#64748b">IN EVERY SEASON</text>
    </g>
  </g>

  <!-- Bottom Details Box (Split Left Date/Venue, Right Host) -->
  <g transform="translate(150, 640)">
    <!-- Date & Venue Card -->
    <rect x="0" y="0" width="620" height="150" rx="16" fill="#ffffff" fill-opacity="0.9" stroke="#e2e8f0" stroke-width="1.5"/>
    <text x="30" y="32" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="#b45309" letter-spacing="2">THIRD FRIDAY</text>
    <text x="30" y="70" font-family="system-ui, sans-serif" font-weight="900" font-size="34" fill="#0f172a">21<tspan font-size="20" dy="-14">ST</tspan><tspan font-size="34" dy="14"> AUGUST 2026</tspan></text>
    
    <circle cx="45" cy="105" r="10" fill="#f1f5f9"/>
    <path d="M45,98 L45,105 L50,105" stroke="#0284c7" stroke-width="2" fill="none"/>
    <text x="65" y="105" font-family="system-ui, sans-serif" font-weight="800" font-size="13" fill="#0f172a">9:00AM <tspan font-weight="500" fill="#64748b">TO 22ND AUG 12:00PM</tspan></text>

    <circle cx="340" cy="105" r="10" fill="#f1f5f9"/>
    <path d="M340,97 C336,97 333,100 333,104 C333,110 340,115 340,115 C340,115 347,110 347,104 C347,100 344,97 340,97 Z" fill="#0284c7"/>
    <text x="360" y="102" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="#0f172a">MAITAMA, ABUJA</text>
    <text x="360" y="118" font-family="system-ui, sans-serif" font-weight="500" font-size="10" fill="#64748b">(EXACT VENUE COMMUNICATED)</text>

    <!-- Host Card -->
    <rect x="650" y="0" width="360" height="150" rx="16" fill="#ffffff" fill-opacity="0.9" stroke="#e2e8f0" stroke-width="1.5"/>
    <text x="830" y="32" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="13" fill="#b45309" letter-spacing="3">HOST</text>
    <text x="830" y="80" text-anchor="middle" font-family="'Brush Script MT', cursive, Georgia" font-style="italic" font-size="40" fill="#0f172a">Pastor John</text>
    <text x="830" y="125" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="34" fill="#0f172a" letter-spacing="4">EZE</text>

    <!-- Fruit Fast Card -->
    <rect x="1030" y="0" width="270" height="150" rx="16" fill="#fefce8" stroke="#fde047" stroke-width="1.5"/>
    <text x="1165" y="32" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#854d0e" letter-spacing="1">ALL ATTENDEES</text>
    <text x="1165" y="52" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#854d0e" letter-spacing="1">WILL BE ON A</text>
    <text x="1165" y="95" text-anchor="middle" font-family="'Brush Script MT', cursive, serif" font-style="italic" font-size="32" fill="#15803d">Fruit Fast</text>
    <text x="1165" y="125" text-anchor="middle" font-size="20">🍇 🍎 🍌 🍉</text>
  </g>

  <!-- Enquiries & Motto Footer Bar -->
  <rect x="0" y="830" width="1600" height="70" fill="#0f172a"/>
  <g transform="translate(400, 870)">
    <text x="0" y="2" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="15" fill="#f8fafc" letter-spacing="1">
      📞 ENQUIRIES: <tspan fill="#38bdf8">09110376410</tspan> | <tspan fill="#38bdf8">08131587655</tspan> | <tspan fill="#38bdf8">070 31216586</tspan>
    </text>
    <text x="800" y="2" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="16" fill="#fef08a" letter-spacing="2">
      "STORMS DON'T LAST. OUR CALLING DOES."
    </text>
  </g>
</svg>
`)}`;
  }

  // Portrait (Standard Flyer Ratio 9:16 / 3:4)
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1500" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGradP" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ebf4f8"/>
      <stop offset="30%" stop-color="#faf8f2"/>
      <stop offset="65%" stop-color="#f5efe0"/>
      <stop offset="100%" stop-color="#ede3d1"/>
    </linearGradient>
    <linearGradient id="stormGradP" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e76f51"/>
      <stop offset="20%" stop-color="#f4a261"/>
      <stop offset="45%" stop-color="#0284c7"/>
      <stop offset="70%" stop-color="#0f766e"/>
      <stop offset="100%" stop-color="#2d6a4f"/>
    </linearGradient>
    <filter id="shadowP" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="2" dy="5" stdDeviation="5" flood-color="#0f172a" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1000" height="1500" fill="url(#bgGradP)"/>

  <!-- Cloud / Mist atmospheric washes -->
  <circle cx="100" cy="150" r="250" fill="#ffffff" opacity="0.6" filter="blur(30px)"/>
  <circle cx="900" cy="200" r="280" fill="#ffffff" opacity="0.6" filter="blur(30px)"/>
  <circle cx="500" cy="450" r="320" fill="#ffffff" opacity="0.5" filter="blur(40px)"/>

  <!-- Top Foliage Leaves (Left & Right) -->
  <g opacity="0.95">
    <path d="M-30,-30 Q90,130 190,90 Q90,10 -30,-30 Z" fill="#2d6a4f"/>
    <path d="M-20,40 Q110,180 230,120 Q110,30 -20,40 Z" fill="#40916c"/>
    <path d="M20,-10 Q140,80 170,180 Q80,100 20,-10 Z" fill="#1b4332"/>

    <path d="M1030,-30 Q910,130 810,90 Q910,10 1030,-30 Z" fill="#2d6a4f"/>
    <path d="M1020,40 Q890,180 770,120 Q890,30 1020,40 Z" fill="#40916c"/>
    <path d="M980,-10 Q860,80 830,180 Q920,100 980,-10 Z" fill="#1b4332"/>
  </g>

  <!-- Header Logo & Identity -->
  <g transform="translate(500, 105)">
    <circle cx="-130" cy="-4" r="22" fill="#0284c7" opacity="0.15"/>
    <circle cx="-130" cy="-4" r="15" fill="none" stroke="#0284c7" stroke-width="3.5"/>
    <circle cx="-130" cy="-11" r="4.5" fill="#0284c7"/>
    <circle cx="-136" cy="1" r="3.5" fill="#059669"/>
    <circle cx="-124" cy="1" r="3.5" fill="#0284c7"/>

    <text x="-95" y="4" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="28" fill="#0f172a" letter-spacing="2">MINISTERS</text>
    <text x="75" y="4" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="28" fill="#0284c7" letter-spacing="2">CONNECT</text>
    <text x="0" y="28" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="12" fill="#64748b" letter-spacing="6">M O N T H L Y   P R O G R A M</text>
  </g>

  <!-- Main Headline Title: REIGNING in the STORM -->
  <text x="500" y="270" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="900" font-size="105" fill="#ffffff" stroke="#94a3b8" stroke-width="2.5" filter="url(#shadowP)" letter-spacing="4">REIGNING</text>
  <text x="500" y="325" text-anchor="middle" font-family="'Brush Script MT', 'Segoe Script', cursive" font-style="italic" font-size="62" fill="#0f172a">in the</text>
  <text x="500" y="455" text-anchor="middle" font-family="Impact, Arial Black, sans-serif" font-weight="900" font-size="155" fill="url(#stormGradP)" letter-spacing="8" filter="url(#shadowP)">STORM</text>

  <!-- Sub-Theme Tagline -->
  <text x="500" y="525" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="20" fill="#0f172a" letter-spacing="3">AS MINISTERS OF GOD,</text>
  <text x="500" y="555" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="24" fill="#0369a1" letter-spacing="3">WE THRIVE IN TRIALS.</text>

  <!-- 4 Pillars Section -->
  <g transform="translate(60, 600)">
    <line x1="0" y1="0" x2="880" y2="0" stroke="#cbd5e1" stroke-width="1.5"/>

    <!-- Pillar 1 -->
    <g transform="translate(90, 35)">
      <circle cx="0" cy="0" r="18" fill="#ecfdf5"/>
      <path d="M-7,5 Q0,-10 7,5 M0,-3 L0,8" stroke="#059669" stroke-width="2.5" fill="none"/>
      <text x="0" y="26" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#0f172a">STAY ROOTED</text>
      <text x="0" y="39" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="9" fill="#64748b">IN GOD'S WORD</text>
    </g>

    <line x1="220" y1="15" x2="220" y2="75" stroke="#e2e8f0" stroke-width="1"/>

    <!-- Pillar 2 -->
    <g transform="translate(350, 35)">
      <circle cx="0" cy="0" r="18" fill="#f0f9ff"/>
      <path d="M-7,-7 L7,-7 L7,2 Q7,9 0,12 Q-7,9 -7,2 Z" stroke="#0284c7" stroke-width="2" fill="none"/>
      <text x="0" y="26" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#0f172a">STAY FOCUSED</text>
      <text x="0" y="39" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="9" fill="#64748b">ON HIS PURPOSE</text>
    </g>

    <line x1="440" y1="15" x2="440" y2="75" stroke="#e2e8f0" stroke-width="1"/>

    <!-- Pillar 3 -->
    <g transform="translate(570, 35)">
      <circle cx="0" cy="0" r="18" fill="#fff7ed"/>
      <path d="M0,9 Q7,0 0,-9 Q-3,0 -1,3 Q-7,0 0,9 Z" fill="#ea580c"/>
      <text x="0" y="26" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#0f172a">STAY FIRED</text>
      <text x="0" y="39" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="9" fill="#64748b">BY HIS SPIRIT</text>
    </g>

    <line x1="660" y1="15" x2="660" y2="75" stroke="#e2e8f0" stroke-width="1"/>

    <!-- Pillar 4 -->
    <g transform="translate(790, 35)">
      <circle cx="0" cy="0" r="18" fill="#f8fafc"/>
      <path d="M-3,8 L3,8 L2,-5 L-2,-5 Z M-5,8 L5,8 M-2,-8 L2,-8" stroke="#334155" stroke-width="2" fill="none"/>
      <text x="0" y="26" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#0f172a">STAY FAITHFUL</text>
      <text x="0" y="39" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="9" fill="#64748b">IN EVERY SEASON</text>
    </g>
  </g>

  <!-- Mid/Bottom Cards Container -->
  <g transform="translate(60, 730)">
    <!-- Left Column: Date & Schedule & Venue -->
    <rect x="0" y="0" width="460" height="340" rx="20" fill="#ffffff" fill-opacity="0.85" stroke="#e2e8f0" stroke-width="1.5"/>

    <text x="35" y="45" font-family="system-ui, sans-serif" font-weight="800" font-size="13" fill="#b45309" letter-spacing="2">THIRD FRIDAY</text>
    <text x="35" y="95" font-family="system-ui, sans-serif" font-weight="900" font-size="44" fill="#0f172a">21<tspan font-size="24" dy="-20">ST</tspan><tspan font-size="44" dy="20"> AUGUST</tspan></text>
    <text x="35" y="135" font-family="system-ui, sans-serif" font-weight="900" font-size="34" fill="#0f172a">2026</text>

    <!-- Time Block -->
    <g transform="translate(35, 175)">
      <circle cx="16" cy="16" r="14" fill="#f1f5f9"/>
      <path d="M16,8 L16,16 L22,16" stroke="#0284c7" stroke-width="2.5" fill="none"/>
      <text x="42" y="16" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#0f172a">9:00AM</text>
      <text x="42" y="32" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#64748b">TO 22ND AUGUST</text>
      <text x="42" y="52" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#0f172a">12:00PM <tspan font-size="12" font-weight="700" fill="#64748b">(AFTERNOON)</tspan></text>
    </g>

    <!-- Venue Block -->
    <g transform="translate(35, 275)">
      <circle cx="16" cy="16" r="14" fill="#f1f5f9"/>
      <path d="M16,6 C10,6 6,10 6,16 C6,24 16,30 16,30 C16,30 26,24 26,16 C26,10 22,6 16,6 Z" fill="#0284c7"/>
      <text x="42" y="14" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#0f172a">MAITAMA, ABUJA</text>
      <text x="42" y="32" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#64748b">(EXACT VENUE WILL BE COMMUNICATED)</text>
    </g>

    <!-- Right Column: Host & Fruit Fast Card -->
    <!-- Host Section -->
    <rect x="490" y="0" width="390" height="200" rx="20" fill="#ffffff" fill-opacity="0.85" stroke="#e2e8f0" stroke-width="1.5"/>
    <text x="685" y="40" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="#b45309" letter-spacing="3">H O S T</text>
    <text x="685" y="105" text-anchor="middle" font-family="'Brush Script MT', cursive, Georgia" font-style="italic" font-size="52" fill="#0f172a">Pastor John</text>
    <text x="685" y="165" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="46" fill="#0f172a" letter-spacing="4">EZE</text>

    <!-- Fruit Fast Oval Box -->
    <g transform="translate(490, 220)">
      <rect x="0" y="0" width="390" height="120" rx="20" fill="#fefce8" stroke="#fde047" stroke-width="1.5"/>
      <text x="210" y="32" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="#854d0e" letter-spacing="1">ALL ATTENDEES WILL BE ON A</text>
      <text x="210" y="75" text-anchor="middle" font-family="'Brush Script MT', cursive, serif" font-style="italic" font-size="40" fill="#15803d">Fruit Fast</text>
      <text x="70" y="75" text-anchor="middle" font-size="34">🍇🍎🍌</text>
    </g>
  </g>

  <!-- Enquiries Hotline Pill -->
  <g transform="translate(60, 1110)">
    <rect x="0" y="0" width="880" height="110" rx="24" fill="#0f172a"/>
    <circle cx="70" cy="55" r="30" fill="#0284c7"/>
    <path d="M60,45 C60,45 62,55 72,65 C82,75 92,77 92,77 L87,83 C84,86 78,86 72,83 C60,76 50,66 43,54 C40,48 40,42 43,39 Z" fill="#ffffff" transform="translate(10, 0)"/>

    <text x="130" y="42" font-family="system-ui, sans-serif" font-weight="800" font-size="13" fill="#94a3b8" letter-spacing="2">FOR ENQUIRIES:</text>
    <text x="130" y="75" font-family="system-ui, sans-serif" font-weight="900" font-size="26" fill="#38bdf8" letter-spacing="1">09110376410 <tspan fill="#64748b">|</tspan> 08131587655</text>
    <text x="610" y="75" font-family="system-ui, sans-serif" font-weight="900" font-size="26" fill="#38bdf8" letter-spacing="1">070 31216586</text>
  </g>

  <!-- Bottom Motto Banner -->
  <g transform="translate(500, 1310)">
    <text x="0" y="0" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-weight="800" font-size="22" fill="#0f172a" letter-spacing="3">STORMS DON'T LAST. OUR CALLING DOES.</text>
    <line x1="-300" y1="25" x2="300" y2="25" stroke="#cbd5e1" stroke-width="1.5"/>
  </g>
</svg>
`)}`;
};

export const MINISTERS_CONNECT_FLIER_PORTRAIT = createFlyerSvg(false);
export const MINISTERS_CONNECT_FLIER_LANDSCAPE = createFlyerSvg(true);
export const MINISTERS_CONNECT_FLIER_DEFAULT = MINISTERS_CONNECT_FLIER_LANDSCAPE;
