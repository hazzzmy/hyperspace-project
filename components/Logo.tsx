import React from "react";

function Logo() {
  return (
      <a href="/" className="flex items-center gap-2">
        <svg width="20" height="50" viewBox="0 0 28 50" fill="#bababa" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_23_3" style={{maskType:"luminance"}} maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="50">
          <path d="M0.749268 0H27.2333V50H0.749268V0Z" fill="#bababa"/>
          </mask>
          <g mask="url(#mask0_23_3)">
          <path d="M11.9175 26.9846H16.0682V50L0.758301 41.2909V8.97489L8.77656 13.4799V17.8254L4.91188 15.6174V38.8758L11.9206 42.8629L11.9175 26.9846ZM11.9294 0V23.0148H16.0801V7.13714L23.0887 11.1213V34.3816L19.2234 32.1734V36.5189L27.2423 41.0239V8.70852L11.9294 0Z" 
          fill="#bababa"/>
          </g>
        </svg>
        <p className="bg-gradient-to-r from-gray-700 to-gray-300 dark:from-white dark:to-gray-700  bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
          Hyperspace
        </p>
      </a>
  );
}

export function LogoMobile() {
  return (
    <a href="/" className="flex items-center gap-2">
      <svg width="20" height="50" viewBox="0 0 28 50" fill="#bababa" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_23_3" style={{maskType:"luminance"}} maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="50">
          <path d="M0.749268 0H27.2333V50H0.749268V0Z" fill="#bababa"/>
          </mask>
          <g mask="url(#mask0_23_3)">
          <path d="M11.9175 26.9846H16.0682V50L0.758301 41.2909V8.97489L8.77656 13.4799V17.8254L4.91188 15.6174V38.8758L11.9206 42.8629L11.9175 26.9846ZM11.9294 0V23.0148H16.0801V7.13714L23.0887 11.1213V34.3816L19.2234 32.1734V36.5189L27.2423 41.0239V8.70852L11.9294 0Z" fill="#bababa"/>
          </g>
      </svg>
      <p className="bg-gradient-to-r from-white to-gray-700 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        Hyperspace
      </p>
    </a>
  );
}

export default Logo;
