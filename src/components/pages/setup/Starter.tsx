import Link from 'next/link';
import { ComponentProps, useState } from 'react';
import { Typography, Row, Col } from 'antd';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { getDataSources, getTemplates } from './utils';
import { makeIterable } from '@/utils/iteration';
import ButtonItem from './ButtonItem';
import {
  DataSourceName,
  SampleDatasetName,
} from '@/apollo/client/graphql/__types__';

const SectionContainer = styled(motion.div)`
  margin-bottom: 48px;
`;

const SectionTitle = styled(Typography.Title)`
  &.ant-typography {
    font-size: 28px !important;
    font-weight: 700 !important;
    background: var(--accent-gradient) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
    margin-bottom: 16px !important;
  }
`;

const SectionDescription = styled(Typography.Text)`
  &.ant-typography {
    font-size: 16px !important;
    color: var(--text-tertiary) !important;
    line-height: 1.6 !important;
    margin-bottom: 32px !important;
    display: block !important;
  }
`;

const GridContainer = styled(Row)`
  gap: 16px 0;
`;

const ButtonTemplate = (props: ComponentProps<typeof ButtonItem>) => {
  return (
    <Col xs={24} sm={12} md={8} lg={6} key={props.label}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ButtonItem {...props} />
      </motion.div>
    </Col>
  );
};

const DataSourceIterator = makeIterable(ButtonTemplate);
const TemplatesIterator = makeIterable(ButtonTemplate);

export default function Starter(props) {
  const { onNext, submitting } = props;

  const [template, setTemplate] = useState<SampleDatasetName>();

  const dataSources = getDataSources();
  const templates = getTemplates();

  const onSelectDataSource = (value: DataSourceName) => {
    onNext && onNext({ dataSource: value });
  };

  const onSelectTemplate = (value: string) => {
    setTemplate(value as SampleDatasetName);
    onNext && onNext({ template: value });
  };

  return (
    <>
      <SectionContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SectionTitle level={1}>
          Connect a data source
        </SectionTitle>
        <SectionDescription>
          Choose from our supported data sources or start with sample data to explore TrendRadar AI.{' '}
          <Link
            href="https://github.com/Canner/WrenAI/discussions/327"
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              color: 'var(--accent-600)', 
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Vote for your favorite data sources on GitHub →
          </Link>
        </SectionDescription>
        <GridContainer gutter={[16, 16]}>
          <DataSourceIterator
            data={dataSources}
            onSelect={onSelectDataSource}
            submitting={submitting}
          />
        </GridContainer>
      </SectionContainer>

      <SectionContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <SectionTitle level={1}>
          Or try sample data
        </SectionTitle>
        <SectionDescription>
          Get started quickly with our curated sample datasets. Perfect for exploring features and testing your setup.
        </SectionDescription>
        <GridContainer gutter={[16, 16]}>
          <TemplatesIterator
            data={templates}
            onSelect={onSelectTemplate}
            submitting={submitting}
            selectedTemplate={template}
          />
        </GridContainer>
      </SectionContainer>
    </>
  );
}
