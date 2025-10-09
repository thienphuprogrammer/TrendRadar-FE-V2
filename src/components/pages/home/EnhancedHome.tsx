import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RocketOutlined, 
  BarChartOutlined, 
  BulbOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  StarOutlined
} from '@ant-design/icons';

interface Question {
  id: string;
  icon: React.ReactNode;
  category: string;
  text: string;
  description: string;
  variant: 'data' | 'analytics' | 'insights';
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
}

export default function EnhancedHome({ 
  questions = defaultQuestions,
  onQuestionSelect 
}: EnhancedHomeProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
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
        >
          <span className="badge-dot"></span>
          <span>AI-Powered Analytics</span>
        </motion.div>

        <div className="welcome-icon-wrapper">
          <div className="welcome-icon">
            <RocketOutlined />
          </div>
        </div>

        <div className="welcome-heading">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            What would you like to know?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Ask questions about your data, generate insights, or explore your analytics dashboard
          </motion.p>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="home-questions-grid">
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            className={`question-card variant-${question.variant}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.4 + (index * 0.1),
              type: 'spring',
              stiffness: 100
            }}
            onClick={() => onQuestionSelect?.(question)}
            onMouseMove={(e) => handleMouseMove(e, index)}
          >
            <div className="question-header">
              <div className="question-icon">
                {question.icon}
              </div>
              <div className="question-category">
                {question.category}
              </div>
            </div>

            <div className="question-content">
              <div className="question-text">
                {question.text}
              </div>
              <div className="question-description">
                {question.description}
              </div>
            </div>

            <div className="question-footer">
              <div className="question-meta">
                <span className="meta-item">
                  <ThunderboltOutlined /> Quick answer
                </span>
              </div>
              <div className="question-arrow">
                <ArrowRightOutlined />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
