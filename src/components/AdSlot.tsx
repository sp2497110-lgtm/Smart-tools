import { useEffect, useRef } from 'react';

interface AdSlotProps {
  type: 'top' | 'between-content' | 'sidebar' | 'bottom';
  className?: string;
}

/* ==============================
   ADSTERRA CONFIGURATION
   ============================== */

// Native Banner
const NATIVE_SCRIPT =
  'https://pl31241886.profitableratecpmnetwork.com/54bd5ed532c372d5cbb408f6c8c105b3/invoke.js';

const NATIVE_CONTAINER =
  'container-54bd5ed532c372d5cbb408f6c8c105b3';

// 300x250 Banner
const BANNER_SCRIPT =
  'https://www.highrevenueformat.com/2f6b59d6e17576c3da519bbce42477c4/invoke.js';

// Smartlink
const SMARTLINK =
  'https://www.profitableratecpmnetwork.com/kgwappz5sn?key=6ee07f9135562b9e31322b99ed5b21ed';


export default function AdSlot({
  type,
  className = '',
}: AdSlotProps) {

  const adRef = useRef<HTMLDivElement>(null);

  const slotClass =
    type === 'top'
      ? 'ad-slot-top'
      : type === 'between-content'
      ? 'ad-slot-between-content'
      : type === 'sidebar'
      ? 'ad-slot-sidebar'
      : 'ad-slot-bottom';


  /* ==============================
     NATIVE BANNER
     ============================== */

  useEffect(() => {

    if (type !== 'top') return;
    if (!adRef.current) return;

    const container = document.createElement('div');

    container.id = NATIVE_CONTAINER;

    adRef.current.appendChild(container);


    const script = document.createElement('script');

    script.async = true;

    script.setAttribute(
      'data-cfasync',
      'false'
    );

    script.src = NATIVE_SCRIPT;

    adRef.current.appendChild(script);


    return () => {

      if (adRef.current) {
        adRef.current.innerHTML = '';
      }

    };

  }, [type]);


  /* ==============================
     300x250 BANNER
     ============================== */

  useEffect(() => {

    if (type !== 'between-content') return;
    if (!adRef.current) return;


    const configScript = document.createElement('script');

    configScript.innerHTML = `
      atOptions = {
        'key' : '2f6b59d6e17576c3da519bbce42477c4',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;


    const adScript = document.createElement('script');

    adScript.src =
      BANNER_SCRIPT;

    adRef.current.appendChild(configScript);

    adRef.current.appendChild(adScript);


    return () => {

      if (adRef.current) {
        adRef.current.innerHTML = '';
      }

    };

  }, [type]);


  /* ==============================
     SMARTLINK
     ============================== */

  if (type === 'bottom') {

    return (
      <div
        className={`${slotClass} ${className} flex justify-center`}
      >

        <a
          href={SMARTLINK}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          Sponsored Link
        </a>

      </div>
    );

  }


  /* ==============================
     AD CONTAINER
     ============================== */

  return (
    <div
      ref={adRef}
      className={`${slotClass} ${className} flex justify-center overflow-hidden`}
      data-ad-slot={type}
    />
  );
  }
