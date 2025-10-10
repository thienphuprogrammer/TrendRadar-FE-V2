import { useRouter } from 'next/router';
import NavItem from './NavItem';
import NavGroup from './NavGroup';
import type { NavItem as NavItemType } from '@/config/navigation';

interface NavigationMenuProps {
  items: NavItemType[];
}

export default function NavigationMenu({ items }: NavigationMenuProps) {
  const router = useRouter();

  const renderNavItem = (item: NavItemType) => {
    const isActive = router.pathname === item.path || router.pathname.startsWith(item.path + '/');

    if (item.children && item.children.length > 0) {
      return (
        <NavGroup 
          key={item.key} 
          title={item.label} 
          icon={item.icon}
          defaultExpanded={item.children.some(child => 
            router.pathname === child.path || router.pathname.startsWith(child.path + '/')
          )}
        >
          {item.children.map(child => renderNavItem(child))}
        </NavGroup>
      );
    }

    return (
      <NavItem
        key={item.key}
        icon={item.icon}
        label={item.label}
        path={item.path}
        active={isActive}
        badge={item.key === 'chatbot' ? 'Beta' : undefined}
      />
    );
  };

  return (
    <div className="space-y-1">
      {items.map(item => renderNavItem(item))}
    </div>
  );
}

