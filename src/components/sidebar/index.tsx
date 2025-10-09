import { useRouter } from 'next/router';
import { Button } from 'antd';
import styled from 'styled-components';
import { Path } from '@/utils/enum';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import Home, { Props as HomeSidebarProps } from './Home';
import Modeling, { Props as ModelingSidebarProps } from './Modeling';
import Knowledge from './Knowledge';
import APIManagement from './APIManagement';
import LearningSection from '@/components/learning';

const Layout = styled.div`
  position: relative;
  height: 100%;
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);\n  border-right: 1px solid var(--border-primary);\n  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);\n  padding-bottom: 12px;\n  overflow-x: hidden;\n  transition: all 0.3s ease;\n\n  .dark & {\n    background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);\n    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.3);\n  }
`;

const Content = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px 12px;
`;

const StyledButton = styled(Button)`
  cursor: pointer;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 16px;\n  margin: 4px 8px;\n  border-radius: 8px;\n  color: var(--text-secondary) !important;\n  font-weight: 500;\n  transition: all 0.3s ease;\n  border: none;\n\n  .anticon {\n    font-size: 16px;\n  }\n\n  &:hover,\n  &:focus {\n    background: var(--bg-hover) !important;\n    color: var(--primary-600) !important;\n    transform: translateX(4px);\n  }\n\n  &:active {\n    transform: translateX(2px) scale(0.98);\n  }
`;

type Props = (ModelingSidebarProps | HomeSidebarProps) & {
  onOpenSettings?: () => void;
};

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

  return <Content>{getContent()}</Content>;
};

export default function Sidebar(props: Props) {
  const { onOpenSettings } = props;
  const router = useRouter();

  const onSettingsClick = (event) => {
    onOpenSettings && onOpenSettings();
    event.target.blur();
  };

  return (
    <Layout className="d-flex flex-column">
      <DynamicSidebar {...props} pathname={router.pathname} />
      <LearningSection />
      <div className="border-t border-gray-4 pt-2">
        <StyledButton type="text" block onClick={onSettingsClick}>
          <SettingOutlined className="text-md" />
          Settings
        </StyledButton>
        {/* <StyledButton type="text" block>
          <Link
            className="d-flex align-center"
            href="https://discord.com/invite/5DvshJqG8Z"
            target="_blank"
            rel="noopener noreferrer"
            data-ph-capture="true"
            data-ph-capture-attribute-name="cta_go_to_discord"
          >
            <DiscordIcon className="mr-2" style={{ width: 16 }} /> Discord
          </Link>
        </StyledButton> */}
        {/* <StyledButton type="text" block>
          <Link
            className="d-flex align-center"
            href="https://github.com/Canner/WrenAI"
            target="_blank"
            rel="noopener noreferrer"
            data-ph-capture="true"
            data-ph-capture-attribute-name="cta_go_to_github"
          >
            <GithubIcon className="mr-2" style={{ width: 16 }} /> GitHub
          </Link>
        </StyledButton> */}
      </div>
    </Layout>
  );
}
