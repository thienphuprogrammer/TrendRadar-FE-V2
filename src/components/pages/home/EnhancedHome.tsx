import React from 'react';
import { motion } from 'framer-motion';
import {
  RocketOutlined,
  BarChartOutlined,
  BulbOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  StarOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

interface Question {
  id: string;
  icon: React.ReactNode;
  category: string;
  text: string;
  description: string;
  variant: 'data' | 'analytics' | 'insights';
  sql?: string; // For recommended questions
}

const defaultQuestions: Question[] = [
  {
    id: '1',
    icon: <RocketOutlined />,
    category: 'Getting Started',
    text: 'What data do I have access to?',
    description: 'Explore your available datasets and sources',
    variant: 'data',
  },
  {
    id: '2',
    icon: <BarChartOutlined />,
    category: 'Analysis',
    text: 'Show me recent trends',
    description: 'Visualize patterns and changes over time',
    variant: 'analytics',
  },
  {
    id: '3',
    icon: <BulbOutlined />,
    category: 'Insights',
    text: 'What are the key insights?',
    description: 'Discover important findings in your data',
    variant: 'insights',
  },
  {
    id: '4',
    icon: <ThunderboltOutlined />,
    category: 'Performance',
    text: 'Identify top performing metrics',
    description: 'Find your best performing indicators',
    variant: 'data',
  },
  {
    id: '5',
    icon: <StarOutlined />,
    category: 'Reports',
    text: 'Generate summary report',
    description: 'Create comprehensive data overview',
    variant: 'analytics',
  },
];

interface EnhancedHomeProps {
  questions?: Question[];
  onQuestionSelect?: (question: Question) => void;
  loading?: boolean;
  isSampleDataset?: boolean;
  sampleQuestions?: any[];
  recommendedQuestions?: any[];
  onSelectSampleQuestion?: (data: { label: string; question: string }) => void;
  onSelectRecommendedQuestion?: (data: {
    question: string;
    sql: string;
  }) => void;
}

export default function EnhancedHome({
  questions = defaultQuestions,
  onQuestionSelect,
  loading = false,
  isSampleDataset = false,
  sampleQuestions = [],
  recommendedQuestions = [],
  onSelectSampleQuestion,
  onSelectRecommendedQuestion,
}: EnhancedHomeProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  // Map sample questions to Question format
  const mappedSampleQuestions: Question[] = sampleQuestions.map(
    (item, index) => ({
      id: `sample-${index}`,
      icon: <BulbOutlined />,
      category: item.label || 'Sample',
      text: item.question,
      description: 'Try this sample question to get started',
      variant: 'data' as const,
    }),
  );

  // Map recommended questions to Question format
  const mappedRecommendedQuestions: Question[] = recommendedQuestions.map(
    (item, index) => ({
      id: `recommended-${index}`,
      icon: <StarOutlined />,
      category: item.category || 'Recommended',
      text: item.question,
      description: 'AI-generated question based on your data',
      variant: 'analytics' as const,
      sql: item.sql,
    }),
  );

  // Determine which questions to display
  const displayQuestions = isSampleDataset
    ? mappedSampleQuestions
    : mappedRecommendedQuestions;
  const finalQuestions =
    displayQuestions.length > 0 ? displayQuestions : questions;

  // Handle question selection
  const handleQuestionClick = (question: Question) => {
    if (isSampleDataset && onSelectSampleQuestion) {
      onSelectSampleQuestion({
        label: question.category,
        question: question.text,
      });
    } else if (
      !isSampleDataset &&
      onSelectRecommendedQuestion &&
      question.sql
    ) {
      onSelectRecommendedQuestion({
        question: question.text,
        sql: question.sql,
      });
    } else {
      onQuestionSelect?.(question);
    }
  };

  return (
    <div className="home-container">
      {/* Welcome Section */}
      <div className="home-welcome-section">
        <motion.div
          className="welcome-badge"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '20px',
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--accent-600)',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-500)',
              animation: 'pulse 2s infinite',
            }}
          ></span>
          <span>AI-Powered Analytics</span>
        </motion.div>

        <div className="welcome-icon-wrapper">
          <div
            className="welcome-icon"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '96px',
              height: '96px',
              marginBottom: '24px',
              borderRadius: '24px',
              background: 'var(--accent-gradient)',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            <RocketOutlined style={{ fontSize: '56px', color: 'white' }} />
          </div>
        </div>

        <div className="welcome-heading" style={{ textAlign: 'center' }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '12px',
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            What would you like to know?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: '16px',
              color: 'var(--text-tertiary)',
              marginBottom: '32px',
              maxWidth: '600px',
              margin: '0 auto 32px',
            }}
          >
            Ask questions about your data, generate insights, or explore your
            analytics dashboard
          </motion.p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <motion.div
          className="loading-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            padding: '24px',
            color: 'var(--text-secondary)',
            fontSize: '14px',
          }}
        >
          <LoadingOutlined style={{ marginRight: '8px' }} />
          Thinking of good questions for you... (about 1 minute)
        </motion.div>
      )}

      {/* Questions Grid */}
      <div
        className="home-questions-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          padding: '24px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {finalQuestions.map((question, index) => (
          <motion.div
            key={question.id}
            className={`question-card variant-${question.variant}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.4 + index * 0.1,
              type: 'spring',
              stiffness: 100,
            }}
            onClick={() => handleQuestionClick(question)}
            onMouseMove={handleMouseMove}
            style={{
              position: 'relative',
              padding: '20px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
            }}
          >
            <div className="question-header" style={{ marginBottom: '16px' }}>
              <div
                className="question-icon"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  marginBottom: '12px',
                  borderRadius: '10px',
                  background:
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                  color: 'var(--accent-600)',
                  fontSize: '20px',
                  transition: 'all 0.3s ease',
                }}
              >
                {question.icon}
              </div>
              <div
                className="question-category"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--accent-600)',
                }}
              >
                {question.category}
              </div>
            </div>

            <div className="question-content">
              <div
                className="question-text"
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  lineHeight: '1.6',
                  margin: '0 0 8px 0',
                }}
              >
                {question.text}
              </div>
              <div
                className="question-description"
                style={{
                  fontSize: '12px',
                  color: 'var(--text-tertiary)',
                  lineHeight: '1.5',
                }}
              >
                {question.description}
              </div>
            </div>

            <div
              className="question-footer"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '16px',
              }}
            >
              <div className="question-meta">
                <span
                  className="meta-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                  }}
                >
                  <ThunderboltOutlined /> Quick answer
                </span>
              </div>
              <div
                className="question-arrow"
                style={{
                  color: 'var(--accent-500)',
                  fontSize: '16px',
                }}
              >
                <ArrowRightOutlined />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
