import Image from 'next/image';
import { Button } from 'antd';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Icon from '@/import/icon';
import { IterableComponent } from '@/utils/iteration';
import { ButtonOption } from './utils';
import { SampleDatasetName } from '@/apollo/client/graphql/__types__';

const StyledButton = styled(motion.button)<{ $isSelected: boolean; $disabled: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  background: var(--bg-primary);
  border: 2px solid var(--border-primary);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  ${props => props.$isSelected && `
    background: var(--accent-gradient);
    border-color: rgba(16, 185, 129, 0.3);
    color: white;
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
  `}

  ${props => !props.$isSelected && !props.$disabled && `
    &:hover {
      background: var(--bg-hover);
      border-color: var(--accent-300);
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(16, 185, 129, 0.15);
    }
  `}

  ${props => props.$disabled && `
    opacity: 0.5;
    cursor: not-allowed;
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--accent-gradient);
    opacity: ${props => props.$isSelected ? '1' : '0'};
    transition: opacity 0.3s ease;
  }

  &:hover:not(:disabled)::before {
    opacity: 1;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const IconContainer = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$isSelected 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))'};
  transition: all 0.3s ease;
  flex-shrink: 0;
`;

const StyledIcon = styled(Icon)`
  width: 24px;
  height: 24px;
  font-size: 24px;
  color: ${props => props.$isSelected ? 'white' : 'var(--accent-600)'};
`;

const PlainImage = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
`;

const LabelText = styled.span<{ $isSelected: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.$isSelected ? 'white' : 'var(--text-primary)'};
  flex: 1;
`;

const ComingSoon = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--bg-tertiary);
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  border: 1px solid var(--border-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

type Props = ButtonOption & {
  selectedTemplate: SampleDatasetName;
  onSelect: (value: string) => void;
};

export default function ButtonItem(props: IterableComponent<Props>) {
  const {
    value,
    disabled,
    submitting,
    logo,
    IconComponent,
    label,
    onSelect,
    selectedTemplate,
  } = props;

  const isSelected = selectedTemplate === value;
  const loading = isSelected && submitting;

  return (
    <StyledButton
      $isSelected={isSelected}
      $disabled={disabled || submitting}
      disabled={disabled || submitting}
      onClick={() => onSelect(value)}
      whileHover={{ scale: disabled || submitting ? 1 : 1.02 }}
      whileTap={{ scale: disabled || submitting ? 1 : 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ContentWrapper>
        <IconContainer $isSelected={isSelected}>
          {logo ? (
            <Image
              src={logo}
              alt={label}
              width="24"
              height="24"
              style={{ borderRadius: '6px' }}
            />
          ) : IconComponent ? (
            <StyledIcon component={IconComponent} $isSelected={isSelected} />
          ) : (
            <PlainImage />
          )}
        </IconContainer>
        <LabelText $isSelected={isSelected}>
          {label}
        </LabelText>
        {loading && <LoadingSpinner />}
      </ContentWrapper>
      {disabled && <ComingSoon />}
    </StyledButton>
  );
}
