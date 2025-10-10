import clsx from 'clsx';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Path } from '@/utils/enum';
import FundViewOutlined from '@ant-design/icons/FundViewOutlined';
import SidebarTree, {
  StyledTreeNodeLink,
  useSidebarTreeState,
} from './SidebarTree';
import ThreadTree, { ThreadData } from './home/ThreadTree';

export interface Props {
  data: {
    threads: ThreadData[];
  };
  onSelect: (selectKeys) => void;
  onDelete: (id: string) => Promise<void>;
  onRename: (id: string, newName: string) => Promise<void>;
}

export const StyledSidebarTree = styled(SidebarTree)`
  .adm-treeNode {
    &.adm-treeNode__thread {
      padding: 0px 16px 0px 4px !important;
      margin: 4px 0;
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        background: var(--bg-hover);
        transform: translateX(4px);
      }

      .ant-tree-title {
        flex-grow: 1;
        display: inline-flex;
        align-items: center;
        span:first-child,
        .adm-treeTitle__title {
          flex-grow: 1;
        }
      }
    }
  }
`;

const ModernDashboardLink = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin: 8px 0;
  border-radius: 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    background: var(--bg-hover);
    border-color: rgba(16, 185, 129, 0.2);
    transform: translateX(6px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
    color: var(--accent-600);

    &::before {
      left: 100%;
    }

    .dashboard-icon {
      transform: scale(1.1);
      color: var(--accent-500);
    }
  }

  &.adm-treeNode--selected {
    background: var(--accent-gradient);
    color: white;
    border-color: rgba(16, 185, 129, 0.3);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);

    .dashboard-icon {
      color: white;
    }
  }

  .dashboard-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
    color: var(--accent-600);
    font-size: 16px;
    transition: all 0.3s ease;
  }
`;

export default function Home(props: Props) {
  const { data, onSelect, onRename, onDelete } = props;
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { threads } = data;

  const { treeSelectedKeys, setTreeSelectedKeys } = useSidebarTreeState();

  useEffect(() => {
    params?.id && setTreeSelectedKeys([params.id] as string[]);
  }, [params?.id]);

  const onDeleteThread = async (threadId: string) => {
    try {
      await onDelete(threadId);
      if (params?.id == threadId) {
        router.push(Path.Home);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onTreeSelect = (selectedKeys: React.Key[], _info: any) => {
    // prevent deselected
    if (selectedKeys.length === 0) return;

    setTreeSelectedKeys(selectedKeys);
    onSelect(selectedKeys);
  };

  return (
    <>
      <ModernDashboardLink
        className={clsx({
          'adm-treeNode--selected': router.pathname === Path.HomeDashboard,
        })}
        onClick={() => router.push(Path.HomeDashboard)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="dashboard-icon">
          <FundViewOutlined />
        </div>
        <span className="text-medium">Dashboard</span>
      </ModernDashboardLink>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <ThreadTree
          threads={threads}
          selectedKeys={treeSelectedKeys}
          onSelect={onTreeSelect}
          onRename={onRename}
          onDeleteThread={onDeleteThread}
        />
      </motion.div>
    </>
  );
}
