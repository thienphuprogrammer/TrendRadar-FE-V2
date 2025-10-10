import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { attachLoading } from '@/utils/helper';
import SendOutlined from '@ant-design/icons/SendOutlined';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import SparklesOutlined from '@ant-design/icons/StarOutlined';

const InputWrapper = styled(motion.div)`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-primary);
  border: 2px solid var(--border-primary);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus-within {
    border-color: var(--accent-500);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  &.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TextAreaWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 24px;
  max-height: 200px;
  padding: 0;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.6;
  resize: none;
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: var(--text-muted);
    transition: opacity 0.2s ease;
  }

  &:focus::placeholder {
    opacity: 0.5;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const CharCounter = styled(motion.div)`
  position: absolute;
  bottom: -20px;
  right: 0;
  font-size: 11px;
  color: var(--text-muted);
  pointer-events: none;
`;

const IconWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.1),
    rgba(5, 150, 105, 0.1)
  );
  color: var(--accent-600);
  font-size: 16px;
`;

const SendButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  background: var(--accent-gradient);
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon {
    font-size: 18px;
    transition: transform 0.2s ease;
  }

  &:hover:not(:disabled) .icon {
    transform: translateX(2px);
  }
`;

interface Props {
  question: string;
  isProcessing: boolean;
  onAsk: (value: string) => Promise<void>;
  inputProps: {
    placeholder?: string;
  };
}

export default function PromptInput(props: Props) {
  const { onAsk, isProcessing, question, inputProps } = props;
  const $promptInput = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [innerLoading, setInnerLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (question) setInputValue(question);
  }, [question]);

  useEffect(() => {
    if (!isProcessing) {
      $promptInput.current?.focus();
      setInputValue('');
    }
  }, [isProcessing]);

  useEffect(() => {
    // Auto-resize textarea
    if ($promptInput.current) {
      $promptInput.current.style.height = 'auto';
      $promptInput.current.style.height = `${$promptInput.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const syncInputValue = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleAsk = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;
    const startAsking = attachLoading(onAsk, setInnerLoading);
    startAsking(trimmedValue);
  };

  const inputEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.shiftKey) return;
    event.preventDefault();
    handleAsk();
  };

  const isDisabled = innerLoading || isProcessing;
  const charCount = inputValue.length;
  const maxChars = 2000;

  return (
    <InputWrapper
      className={isDisabled ? 'is-disabled' : ''}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <IconWrapper
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <SparklesOutlined />
      </IconWrapper>

      <TextAreaWrapper>
        <StyledTextArea
          ref={$promptInput}
          data-gramm="false"
          value={inputValue}
          onChange={syncInputValue}
          onKeyDown={inputEnter}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isDisabled}
          rows={1}
          placeholder={
            inputProps?.placeholder || 'Ask me anything about your data...'
          }
        />
        <AnimatePresence>
          {charCount > 0 && (
            <CharCounter
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {charCount}/{maxChars}
            </CharCounter>
          )}
        </AnimatePresence>
      </TextAreaWrapper>

      <SendButton
        onClick={handleAsk}
        disabled={!inputValue.trim() || isDisabled}
        whileHover={{ scale: inputValue.trim() ? 1.05 : 1 }}
        whileTap={{ scale: inputValue.trim() ? 0.95 : 1 }}
      >
        {innerLoading || isProcessing ? (
          <LoadingOutlined className="icon animate-spin" />
        ) : (
          <SendOutlined className="icon" />
        )}
      </SendButton>
    </InputWrapper>
  );
}
