"use client";

import { 
  BarChart3, 
  FileText, 
  Users, 
  Settings, 
  Bell, 
  Calendar,
  TrendingUp,
  PlusCircle,
  Activity,
  Target,
  LogOut,
  User,
  Home
} from "lucide-react";
import { useState } from "react";
import { useNavbar } from "@/contexts/navbar-context";
import styles from './vertical-navbar.module.css';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home size={20} />,
    href: '/dashboard'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 size={20} />,
    href: '/analytics'
  },
  {
    id: 'posts',
    label: 'Posts',
    icon: <FileText size={20} />,
    href: '/posts'
  },
  {
    id: 'create',
    label: 'Criar Post',
    icon: <PlusCircle size={20} />,
    href: '/posts/new'
  },
  {
    id: 'accounts',
    label: 'Contas',
    icon: <Users size={20} />,
    href: '/accounts'
  },
  {
    id: 'calendar',
    label: 'Calendário',
    icon: <Calendar size={20} />,
    href: '/calendar'
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: <TrendingUp size={20} />,
    href: '/performance'
  },
  {
    id: 'goals',
    label: 'Metas',
    icon: <Target size={20} />,
    href: '/goals'
  }
];

const bottomItems: NavItem[] = [
  {
    id: 'notifications',
    label: 'Notificações',
    icon: <Bell size={20} />,
    href: '/notifications',
    badge: 3
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: <Settings size={20} />,
    href: '/settings'
  }
];

export function VerticalNavbar() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const { isCollapsed, toggleCollapsed } = useNavbar();

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  return (
    <nav className={`${styles.navbar} ${isCollapsed ? styles.collapsed : ''}`}>
      {/* Header da Navbar */}
      <div className={styles.navHeader}>
        <div className={styles.logo}>
          <Activity size={28} className={styles.logoIcon} />
          {!isCollapsed && (
            <span className={styles.logoText}>AithosReach</span>
          )}
        </div>
        <button 
          className={styles.collapseButton}
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          <div className={`${styles.hamburger} ${isCollapsed ? styles.hamburgerActive : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Perfil do usuário */}
      <div className={styles.userProfile}>
        <div className={styles.userAvatar}>
          <User size={20} />
        </div>
        {!isCollapsed && (
          <div className={styles.userInfo}>
            <span className={styles.userName}>Pedro Silva</span>
            <span className={styles.userRole}>Administrador</span>
          </div>
        )}
      </div>

      {/* Navegação principal */}
      <div className={styles.navSection}>
        <ul className={styles.navList}>
          {navigationItems.map((item) => (
            <li key={item.id} className={styles.navItem}>
              <a
                href={item.href}
                className={`${styles.navLink} ${activeItem === item.id ? styles.active : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item.id);
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <span className={styles.navIcon}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <>
                    <span className={styles.navLabel}>{item.label}</span>
                    {item.badge && (
                      <span className={styles.badge}>{item.badge}</span>
                    )}
                  </>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Seção inferior */}
      <div className={styles.navBottom}>
        <ul className={styles.navList}>
          {bottomItems.map((item) => (
            <li key={item.id} className={styles.navItem}>
              <a
                href={item.href}
                className={`${styles.navLink} ${activeItem === item.id ? styles.active : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item.id);
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <span className={styles.navIcon}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <>
                    <span className={styles.navLabel}>{item.label}</span>
                    {item.badge && (
                      <span className={styles.badge}>{item.badge}</span>
                    )}
                  </>
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Botão de logout */}
        <div className={styles.logoutSection}>
          <button className={styles.logoutButton} title={isCollapsed ? "Sair" : undefined}>
            <span className={styles.navIcon}>
              <LogOut size={20} />
            </span>
            {!isCollapsed && (
              <span className={styles.navLabel}>Sair</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}