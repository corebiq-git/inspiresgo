import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'color' | 'white' | 'dark';
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const InspireGoLogo: React.FC<LogoProps> = ({
  className = '',
  variant = 'color',
  showSubtitle = true,
  size = 'md'
}) => {
  // Height presets
  const heightMap = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16'
  };

  const isWhite = variant === 'white';
  const navyColor = isWhite ? '#FFFFFF' : '#051b34';
  const cyanColor = isWhite ? '#7dd3fc' : '#0ea5e9';
  const subtitleColor = isWhite ? '#bae6fd' : '#0284c7';

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 460 140"
        className={`${heightMap[size]} w-auto max-w-full drop-shadow-2xs`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isWhite ? '#93c5fd' : '#0369a1'} />
            <stop offset="50%" stopColor={isWhite ? '#38bdf8' : '#0284c7'} />
            <stop offset="100%" stopColor={isWhite ? '#e0f2fe' : '#38bdf8'} />
          </linearGradient>

          <linearGradient id="orbitGradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor={isWhite ? '#7dd3fc' : '#0284c7'} stopOpacity="0.4" />
            <stop offset="50%" stopColor={isWhite ? '#ffffff' : '#0369a1'} stopOpacity="0.9" />
            <stop offset="100%" stopColor={isWhite ? '#38bdf8' : '#38bdf8'} stopOpacity="1" />
          </linearGradient>

          <linearGradient id="arrowArchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={cyanColor} />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* --- Main Wordmark "Inspire" in Navy --- */}
        <g id="word-inspire" fill={navyColor}>
          {/* I */}
          <rect x="24" y="38" width="13" height="52" rx="6.5" />
          
          {/* n with top arch arrow */}
          <path
            d="M52 50 C52 44 57 38 67 38 C77 38 82 44 82 52 V90 H71 V53 C71 47 68 45 63 45 C58 45 55 48 55 54 V90 H44 V42 H52 V50 Z"
          />
          {/* Cyan Arch Arrow above n */}
          <path
            d="M48 35 C52 28 62 25 72 27 C78 28 82 32 84 36"
            stroke="url(#arrowArchGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* s with smooth curves */}
          <path
            d="M93 76 C93 84 100 91 112 91 C124 91 129 85 129 77 C129 67 118 64 109 61 C101 58 97 55 97 48 C97 41 103 37 112 37 C121 37 127 42 127 49 H116 C116 45 113 43 109 43 C105 43 103 45 103 48 C103 52 108 54 114 56 C123 59 135 63 135 76 C135 88 124 96 110 96 C96 96 87 88 87 76 H93 Z"
          />

          {/* p with upward arrow tip in stem */}
          <path
            d="M138 38 H149 V46 C153 40 160 37 169 37 C181 37 190 47 190 64 C190 81 180 91 168 91 C160 91 154 87 149 82 V108 H138 V38 Z M164 47 C155 47 149 54 149 64 C149 74 155 81 164 81 C173 81 179 74 179 64 C179 54 173 47 164 47 Z"
          />
          {/* Up arrow head inside p counter/stem */}
          <polygon points="143.5,33 139,40 148,40" fill={navyColor} />

          {/* i with dot */}
          <rect x="201" y="44" width="12" height="46" rx="6" />
          <circle cx="207" cy="31" r="6" />

          {/* r with curved directional turn */}
          <path
            d="M225 44 H236 V53 C239 46 246 42 254 42 C257 42 259 43 261 44 V56 C258 54 254 53 250 53 C242 53 237 58 237 67 V90 H225 V44 Z"
          />

          {/* e */}
          <path
            d="M294 65 H268 C269 75 275 81 285 81 C291 81 295 78 297 74 H307 C303 84 295 91 283 91 C269 91 257 80 257 64 C257 48 268 37 282 37 C296 37 306 48 306 65 Z M269 57 H294 C293 49 288 44 281 44 C274 44 270 49 269 57 Z"
          />
        </g>

        {/* --- "Go" with Gradient and Flight Orbit --- */}
        <g id="word-go">
          {/* G */}
          <path
            d="M366 43 C359 36 348 31 334 31 C310 31 292 48 292 73 C292 97 310 114 335 114 C353 114 366 104 371 91 H338 V78 H386 V95 C379 110 360 125 334 125 C299 125 277 101 277 73 C277 44 300 20 335 20 C354 20 369 27 379 36 L366 43 Z"
            fill="url(#goGradient)"
          />

          {/* o */}
          <path
            d="M394 65 C394 48 406 37 423 37 C440 37 452 48 452 65 C452 82 440 93 423 93 C406 93 394 82 394 65 Z M439 65 C439 53 433 46 423 46 C413 46 407 53 407 65 C407 77 413 84 423 84 C433 84 439 77 439 65 Z"
            fill="url(#goGradient)"
          />

          {/* Elliptical Flight Loop Orbit around G */}
          <ellipse
            cx="338"
            cy="52"
            rx="46"
            ry="18"
            transform="rotate(-15 338 52)"
            stroke="url(#orbitGradient)"
            strokeWidth="3.2"
            strokeDasharray="180 20"
            fill="none"
          />

          {/* Airplane Silhouette on the orbit */}
          <g transform="translate(352, 26) rotate(35) scale(0.95)">
            {/* Fuselage */}
            <path
              d="M0 -12 C1.2 -12 2 -9 2 -2 L12 4 L12 7 L2 4 L2 10 L6 13 L6 15 L0 14 L-6 15 L-6 13 L-2 10 L-2 4 L-12 7 L-12 4 L-2 -2 C-2 -9 -1.2 -12 0 -12 Z"
              fill={navyColor}
            />
          </g>
        </g>

        {/* --- Subtitle: Travel & tourism --- */}
        {showSubtitle && (
          <text
            x="230"
            y="126"
            textAnchor="middle"
            fill={subtitleColor}
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontSize="21"
            fontStyle="italic"
            fontWeight="800"
            letterSpacing="0.04em"
          >
            Travel &amp; tourism
          </text>
        )}
      </svg>
    </div>
  );
};
