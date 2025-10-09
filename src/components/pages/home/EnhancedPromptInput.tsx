import React, { useState, useRef, useEffect } from 'react';
import { SendOutlined, PaperClipOutlined, SmileOutlined, LoadingOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedPromptInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function EnhancedPromptInput({
  value: controlledValue,
  onChange,
  onSubmit,
  placeholder = 'Ask me anything about your data...',
  isLoading = false,
  disabled = false,
}: EnhancedPromptInputProps) {
  const [value, setValue] = useState(controlledValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);

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
    if (value.trim() && !isLoading && !disabled) {
      onSubmit?.(value.trim());
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
      >
        <div className="input-glow"></div>
        
        <div className="prompt-input-content">
          {/* Left Actions */}
          <div className="input-actions-left">
            <motion.button
              className="action-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Attach file"
            >
              <PaperClipOutlined />
            </motion.button>
          </div>

          {/* Input Field */}
          <div className="input-field-wrapper">
            <textarea
              ref={textareaRef}
              className="input-field"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled || isLoading}
              rows={1}
            />
            {value.length > 0 && (
              <AnimatePresence>
                <motion.div
                  className="char-counter"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {value.length}/2000
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Right Actions */}
          <div className="input-actions-right">
            <motion.button
              className={`send-button ${isLoading ? 'is-loading' : ''}`}
              onClick={handleSubmit}
              disabled={!value.trim() || isLoading || disabled}
              whileHover={{ scale: value.trim() ? 1.05 : 1 }}
              whileTap={{ scale: value.trim() ? 0.95 : 1 }}
              title="Send message (Enter)"
            >
              {isLoading ? <LoadingOutlined /> : <SendOutlined />}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
