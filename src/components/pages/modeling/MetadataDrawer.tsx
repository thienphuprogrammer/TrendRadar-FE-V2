import { Button, Drawer } from 'antd';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { NODE_TYPE } from '@/utils/enum';
import EditOutlined from '@ant-design/icons/EditOutlined';
import { DrawerAction } from '@/hooks/useDrawerAction';
import ModelMetadata, {
  Props as ModelMetadataProps,
} from './metadata/ModelMetadata';
import ViewMetadata, {
  Props as ViewMetadataProps,
} from './metadata/ViewMetadata';
import GradientButton from '@/components/common/GradientButton';

const StyledDrawer = styled(Drawer)`
  .ant-drawer-content {
    background: var(--bg-primary);
  }
  
  .ant-drawer-header {
    background: linear-gradient(135deg, 
      rgba(16, 185, 129, 0.05) 0%, 
      rgba(5, 150, 105, 0.05) 100%);
    border-bottom: 1px solid var(--border-primary);
    
    .ant-drawer-title {
      font-size: 20px;
      font-weight: 700;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  
  .ant-drawer-body {
    padding: 24px;
  }
`;

type Metadata = {
  nodeType: NODE_TYPE;
} & ModelMetadataProps &
  ViewMetadataProps;

type Props = DrawerAction<Metadata> & { onEditClick: (value?: any) => void };

export default function MetadataDrawer(props: Props) {
  const { visible, defaultValue, onClose, onEditClick } = props;
  const { displayName, nodeType = NODE_TYPE.MODEL } = defaultValue || {};
  const isModel = nodeType === NODE_TYPE.MODEL;
  const isView = nodeType === NODE_TYPE.VIEW;

  return (
    <StyledDrawer
      visible={visible}
      title={displayName}
      width={760}
      closable
      destroyOnClose
      onClose={onClose}
      extra={
        <GradientButton
          variant="secondary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => onEditClick(defaultValue)}
        >
          Edit
        </GradientButton>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isModel && <ModelMetadata {...defaultValue} />}
        {isView && <ViewMetadata {...defaultValue} />}
      </motion.div>
    </StyledDrawer>
  );
}
