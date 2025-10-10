import React, { useState, useRef, useEffect } from 'react';
import {
  SendOutlined,
  PaperClipOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

interface PromptInputProps {
  question: string;
  isProcessing: boolean;
  onAsk: (value: string) => Promise<void>;
  inputProps: {
    placeholder?: string;
  };
}

export default function PromptInput({
  question,
  isProcessing,
  onAsk,
  inputProps,
}: PromptInputProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (question) {
      setValue(question);
    }
  }, [question]);

  useEffect(() => {
    if (!isProcessing) {
      textareaRef.current?.focus();
      setValue('');
    }
  }, [isProcessing]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Typing indicator
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 500);

    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = () => {
    if (value.trim() && !isProcessing) {
      onAsk(value.trim());
      setValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="prompt-input-container">
      <motion.div
        className={`prompt-input-wrapper ${isFocused ? 'is-focused' : ''} ${isTyping ? 'is-typing' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ scale: 1.01 }}
        style={{
          position: 'relative',
          background: 'var(--bg-primary)',
          border: isFocused
            ? '3px solid var(--accent-500)'
            : '2px solid var(--border-primary)',
          borderRadius: '24px',
          boxShadow: isFocused
            ? '0 25px 80px rgba(16, 185, 129, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.1)'
            : '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(16, 185, 129, 0.05)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          transform: isFocused ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        <div
          className="input-glow"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '150%',
            height: '150%',
            background:
              'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
            opacity: isFocused ? 1 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }}
        ></div>

        <div
          className="prompt-input-content"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '16px',
            padding: '16px 20px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Left Actions */}
          <div
            className="input-actions-left"
            style={{ display: 'flex', gap: '8px' }}
          >
            <motion.button
              className="action-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Attach file"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '12px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              <PaperClipOutlined style={{ fontSize: '20px' }} />
            </motion.button>
          </div>

          {/* Input Field */}
          <div
            className="input-field-wrapper"
            style={{ flex: 1, position: 'relative' }}
          >
            <textarea
              ref={textareaRef}
              className="input-field"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={
                inputProps?.placeholder || 'Ask me anything about your data...'
              }
              disabled={isProcessing}
              rows={1}
              style={{
                width: '100%',
                minHeight: '48px',
                maxHeight: '200px',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '16px',
                lineHeight: '1.6',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            {value.length > 0 && (
              <AnimatePresence>
                <motion.div
                  className="char-counter"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '16px',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    pointerEvents: 'none',
                  }}
                >
                  {value.length}/2000
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Right Actions */}
          <div
            className="input-actions-right"
            style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
          >
            <motion.button
              className={`send-button ${isProcessing ? 'is-loading' : ''}`}
              onClick={handleSubmit}
              disabled={!value.trim() || isProcessing}
              whileHover={{ scale: value.trim() ? 1.05 : 1 }}
              whileTap={{ scale: value.trim() ? 0.95 : 1 }}
              title="Send message (Enter)"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '52px',
                height: '52px',
                background: 'var(--accent-gradient)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {isProcessing ? (
                <LoadingOutlined style={{ fontSize: '22px' }} />
              ) : (
                <SendOutlined style={{ fontSize: '22px' }} />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
