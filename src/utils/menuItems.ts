// Navegación del header: la misma que gy-web, pero con URLs absolutas a gycoding.com
// porque Accounts vive en otro dominio.
export const GYCODING_URL = 'https://gycoding.com';

export interface MenuItem {
  title: string;
  path: string;
  icon?: string; // icono para modo oscuro
  icon_light?: string; // icono para modo claro
  description?: string;
  external?: boolean; // abre en pestaña nueva
  children?: MenuItem[]; // si tiene hijos, se muestra como desplegable
}

export const menuItems: MenuItem[] = [
  {
    title: 'Products',
    path: `${GYCODING_URL}/products`,
    children: [
      {
        title: 'Wingwords',
        path: `${GYCODING_URL}/products/wingwords`,
        icon: '/icons/wingwords.png',
        icon_light: '/icons/wingwords.png',
        description: 'Connect with readers and share literary experiences.',
      },
      {
        title: 'Heralds of Chaos',
        path: `${GYCODING_URL}/products/heralds-of-chaos`,
        icon: '/icons/heralds_of_chaos.png',
        icon_light: '/icons/heralds_of_chaos.png',
        description: 'A universe based on Norse mythology.',
      },
      {
        title: 'GY Accounts',
        path: `${GYCODING_URL}/products/gy-accounts`,
        icon: '/icons/gy_accounts.svg',
        icon_light: '/icons/gy_accounts_light.svg',
        description: 'Authentication service.',
      },
    ],
  },
  {
    title: 'Docs',
    path: 'https://docs.gycoding.com',
    children: [
      {
        title: 'Documentation',
        path: 'https://docs.gycoding.com',
        icon: '/icons/docs.svg',
        icon_light: '/icons/docs_light.svg',
        description: 'Unified documentation and API Reference.',
        external: true,
      },
      {
        title: 'Services Status',
        path: 'https://status.gycoding.com',
        icon: '/icons/status_dark.svg',
        icon_light: '/icons/status_light.svg',
        description: 'Status trace for our services.',
        external: true,
      },
    ],
  },
  {
    title: 'About',
    path: `${GYCODING_URL}/about`,
    children: [
      {
        title: 'Team',
        path: `${GYCODING_URL}/about/team`,
        icon: '/icons/team.svg',
        icon_light: '/icons/team_light.svg',
        description: 'Meet our team.',
      },
      {
        title: 'Company',
        path: `${GYCODING_URL}/about/company`,
        icon: '/icons/company.svg',
        icon_light: '/icons/company_light.svg',
        description: 'Learn more about our company.',
      },
    ],
  },
];
