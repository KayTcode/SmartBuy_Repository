function Icon({ className, children, stroke = 'currentColor', fill = 'none', viewBox = '0 0 24 24' }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      stroke={stroke}
      fill={fill}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function IconSearch({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="m21 21-4.35-4.35M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
    </Icon>
  );
}

export function IconHeart({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className} fill="currentColor" stroke="none" viewBox="0 0 24 24">
      <path d="M21 8.5c0 4.28-3.4 7.36-8.995 12.07a1 1 0 0 1-1.01 0C5.4 15.86 2 12.78 2 8.5 2 5.42 4.42 3 7.5 3 9.24 3 10.91 3.81 12 5.09 13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5Z" />
    </Icon>
  );
}

export function IconCart({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M3 3h2l1.68 8.39a2 2 0 0 0 1.97 1.61h7.05a2 2 0 0 0 1.97-1.61L18 6H6" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="15" cy="19" r="1.5" />
    </Icon>
  );
}

export function IconChevronDown({ className = 'h-4 w-4' }) {
  return (
    <Icon className={className}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  );
}

export function IconPhone({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M3 5c0-1.105.895-2 2-2h2c.845 0 1.598.528 1.873 1.324l1.02 3.06a1.75 1.75 0 0 1-.455 1.79l-1.145 1.145a14.75 14.75 0 0 0 6.438 6.438l1.145-1.145c.469-.468 1.168-.651 1.79-.455l3.06 1.02A1.948 1.948 0 0 1 21 17v2c0 1.105-.895 2-2 2C9.611 21 3 14.389 3 6Z" />
    </Icon>
  );
}

export function IconMapPin({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M12 21s-6-4.686-6-10a6 6 0 0 1 12 0c0 5.314-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </Icon>
  );
}

export function IconArrowRight({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Icon>
  );
}

export function IconArrowLeft({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </Icon>
  );
}
export const IconCamera = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7h3l1.5-2h9L18 7h3v12H3V7z"
    />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export const IconMap = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 20l-6-3V4l6 3 6-3 6 3v13l-6-3-6 3z"
    />
  </svg>
);
export function IconInfo({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" x2="12" y1="8" y2="8.01" />
      <path d="M11 12h1v4h1" />
    </Icon>
  );
}

export function IconCheckCircle({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="9" />
    </Icon>
  );
}

export function IconShare({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
      <path d="m16 6-4-4-4 4" />
      <path d="M12 2v13" />
    </Icon>
  );
}

export function IconStar({ className = 'h-4 w-4' }) {
  return (
    <Icon className={className} fill="currentColor" stroke="none" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.21 3.717a1 1 0 0 0 .95.69h3.905c.969 0 1.371 1.24.588 1.81l-3.16 2.297a1 1 0 0 0-.364 1.118l1.21 3.717c.3.921-.755 1.688-1.54 1.118l-3.16-2.297a1 1 0 0 0-1.176 0l-3.16 2.297c-.784.57-1.838-.197-1.539-1.118l1.21-3.717a1 1 0 0 0-.364-1.118L2.3 9.144c-.783-.57-.38-1.81.588-1.81h3.905a1 1 0 0 0 .95-.69l1.21-3.717Z" />
    </Icon>
  );
}

export function IconMenu({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </Icon>
  );
}

export function IconGrid({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M3 3h7v7H3z" />
      <path d="M14 3h7v7h-7z" />
      <path d="M3 14h7v7H3z" />
      <path d="M14 14h7v7h-7z" />
    </Icon>
  );
}

export function IconFilter({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M4 6h16" />
      <circle cx="10" cy="6" r="2" />
      <path d="M4 12h16" />
      <circle cx="14" cy="12" r="2" />
      <path d="M4 18h16" />
      <circle cx="8" cy="18" r="2" />
    </Icon>
  );
}

export function IconCompare({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M10 3h4" />
      <path d="M12 21v-18" />
      <path d="M6 7h4m4 0h4" />
      <path d="M8 21v-10" />
      <path d="M16 17h-4m-4 0H4" />
      <path d="M16 21v-6" />
    </Icon>
  );
}

export function IconLock({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <path d="M12 16v2" />
    </Icon>
  );
}

export function IconTrash({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </Icon>
  );
}

export function IconUser({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" />
    </Icon>
  );
}

export function IconLogout({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </Icon>
  );
}

export function IconDashboard({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M3 3h8v8H3z" />
      <path d="M13 3h8v8h-8z" />
      <path d="M3 13h8v8H3z" />
      <path d="M13 13h8v8h-8z" />
    </Icon>
  );
}

export function IconUsers({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  );
}

export function IconPackage({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v2a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 10Z" />
      <path d="M3.29 7 12 12l8.71-5" />
      <path d="M12 22V12" />
    </Icon>
  );
}

export function IconFolder({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </Icon>
  );
}

export function IconDollar({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </Icon>
  );
}

export function IconClock({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </Icon>
  );
}

export function IconTruck({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M16 3h5l1 7h-4M16 3H8m8 0v13m0-13l-1-4M8 3l1 4m0 0H3m6 0h5m-6 13v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
      <path d="M3 10h6" />
    </Icon>
  );
}

export function IconCelebration({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M12 2v4m0 12v4M5.64 5.64l2.83 2.83m9.9 9.9l2.83 2.83M2 12h4m12 0h4M5.64 18.36l2.83-2.83m9.9-9.9l2.83-2.83" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  );
}

export function IconFileText({ className = 'h-5 w-5' }) {
  return (
    <Icon className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </Icon>
  );
}
