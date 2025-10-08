import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Path } from '@/utils/enum';
import { DiscordIcon, GithubIcon } from '@/utils/icons';
import { Button } from '@/components/design-system';
import {
  HomeOutlined,
  SettingOutlined,
  DatabaseOutlined,
  BookOutlined,
  ApiOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import Home, { Props as HomeSidebarProps } from './Home';
import Modeling, { Props as ModelingSidebarProps } from './Modeling';
import Knowledge from './Knowledge';
import APIManagement from './APIManagement';
import LearningSection from '@/components/learning';

type Props = (ModelingSidebarProps | HomeSidebarProps) & {
  onOpenSettings?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
};

const navigationItems = [
  {
    path: Path.Home,
    label: 'Home',
    icon: HomeOutlined,
    description: 'Dashboard & Analytics',
  },
  {
    path: Path.Modeling,
    label: 'Modeling',
    icon: DatabaseOutlined,
    description: 'Data Models & Relationships',
  },
  {
    path: Path.Knowledge,
    label: 'Knowledge',
    icon: BookOutlined,
    description: 'Documentation & Instructions',
  },
  {
    path: Path.APIManagement,
    label: 'API Management',
    icon: ApiOutlined,
    description: 'API History & Management',
  },
];

const DynamicSidebar = (
  props: Props & {
    pathname: string;
  },
) => {
  const { pathname, ...restProps } = props;

  const getContent = () => {
    if (pathname.startsWith(Path.Home)) {
      return <Home {...(restProps as HomeSidebarProps)} />;
    }

    if (pathname.startsWith(Path.Modeling)) {
      return <Modeling {...(restProps as ModelingSidebarProps)} />;
    }

    if (pathname.startsWith(Path.Knowledge)) {
      return <Knowledge />;
    }

    if (pathname.startsWith(Path.APIManagement)) {
      return <APIManagement />;
    }

    return null;
  };

  return (
    <motion.div
      className="flex-1 overflow-y-auto scrollbar-thin"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {getContent()}
    </motion.div>
  );
};

const ModernSidebar: React.FC<Props> = (props) => {
  const { onOpenSettings, isCollapsed = false, onToggleCollapse } = props;
  const router = useRouter();

  const onSettingsClick = (event: React.MouseEvent) => {
    onOpenSettings && onOpenSettings();
    event.currentTarget.blur();
  };

  const sidebarVariants = {
    expanded: {
      width: 280,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    collapsed: {
      width: 80,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        delay: 0.1,
      },
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="relative h-full bg-gradient-to-b from-secondary-50 to-white border-r border-secondary-200 flex flex-col"
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      initial="expanded"
    >
      {/* Header */}
      <div className="p-4 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                key="logo"
                className="flex items-center space-x-3"
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TR</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-secondary-900">
                    TrendRadar
                  </h1>
                  <p className="text-xs text-secondary-500">AI Analytics</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            className="p-2 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
            onClick={onToggleCollapse}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCollapsed ? (
              <MenuOutlined className="w-5 h-5 text-secondary-600" />
            ) : (
              <CloseOutlined className="w-5 h-5 text-secondary-600" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = router.pathname.startsWith(item.path);
          const IconComponent = item.icon;

          return (
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={item.path}>
                <div
                  className={`
                    flex items-center p-3 rounded-xl transition-all duration-200 cursor-pointer group
                    ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-sm'
                        : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                    }
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                >
                  <IconComponent
                    className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${
                      isActive
                        ? 'text-primary-600'
                        : 'text-secondary-500 group-hover:text-secondary-700'
                    }`}
                  />

                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        variants={contentVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="flex-1"
                      >
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-secondary-500 mt-0.5">
                          {item.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isActive && !isCollapsed && (
                    <motion.div
                      className="w-2 h-2 bg-primary-600 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic Content */}
      <DynamicSidebar {...props} pathname={router.pathname} />

      {/* Learning Section */}
      <div className="p-4">
        <LearningSection />
      </div>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-secondary-200 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          icon={<SettingOutlined />}
          onClick={onSettingsClick}
          className="justify-start"
        >
          {!isCollapsed && 'Settings'}
        </Button>

        {/* Social Links - Hidden when collapsed */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              className="flex space-x-2"
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
            >
              <Button
                variant="ghost"
                size="sm"
                icon={<DiscordIcon className="w-4 h-4" />}
                className="flex-1"
                asChild
              >
                <Link
                  href="https://discord.com/invite/5DvshJqG8Z"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                icon={<GithubIcon className="w-4 h-4" />}
                className="flex-1"
                asChild
              >
                <Link
                  href="https://github.com/Canner/WrenAI"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ModernSidebar;
