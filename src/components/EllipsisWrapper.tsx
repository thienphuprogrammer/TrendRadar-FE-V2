import { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface Props {
  text?: string;
  children?: ReactNode;
  multipleLine?: number;
  minHeight?: number;
  showMoreCount?: boolean;
}

const Wrapper = styled.div<{
  multipleLine?: number;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  title?: string;
  style?: React.CSSProperties;
}>`
  overflow: hidden;
  text-overflow: ellipsis;
  ${(props) =>
    props.multipleLine
      ? `
  display: -webkit-box;
  -webkit-line-clamp: ${props.multipleLine};
  -webkit-box-orient: vertical;
`
      : `
  white-space: nowrap;
`}
`;

export default function EllipsisWrapper(props: Props) {
  const { text, multipleLine, minHeight, children, showMoreCount } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number | string | undefined>(undefined);
  const hasWidth = width !== undefined;
  // Stage for counting the children that will be shown
  const [stage, setStage] = useState<ReactNode[]>([]);

  const isStageEnd = useRef(false);
  const calculateStageShow = () => {
    if (isStageEnd.current) return;
    const remainSpace = 60; // remain space for showing more tip
    const stageWidth = stageRef.current?.clientWidth;
    const canPrintNext =
      (stageWidth ?? 0) < (typeof width === 'number' ? width : 0) - remainSpace;

    if (canPrintNext) {
      const hasMoreChildren = (children as ReactNode[])?.length > stage.length;
      hasMoreChildren &&
        children &&
        setStage([...stage, (children as ReactNode[])[stage.length]]);
    } else {
      setStage(stage.slice(0, stage.length - 1));
      isStageEnd.current = true;
    }
  };

  // Auto setup client width itself
  useEffect(() => {
    if (ref.current && !hasWidth) {
      const cellWidth = ref.current.clientWidth;
      cellWidth === 0 ? setWidth('auto') : setWidth(cellWidth);
    }

    // Reset state when unmount
    return () => {
      isStageEnd.current = false;
      setStage([]);
      setWidth(undefined);
    };
  }, []);

  // Only work when showMoreCount is provided
  useEffect(() => {
    if (!showMoreCount) return;
    // Run only once when showMoreCount is true
    if (stage.length === 0) {
      children && setStage([(children as ReactNode[])[0]]);
      return;
    }
    calculateStageShow();
  }, [showMoreCount, stage]);

  const renderContent = () => {
    if (!children) return text || '-';

    // Turn another template if showMoreCount is provided
    if (showMoreCount) {
      const moreCount = (children as ReactNode[]).length - stage.length;
      return (
        <span className="d-inline-block" ref={stageRef}>
          {stage}
          {moreCount > 0 && <span className="gray-7">...{moreCount} more</span>}
        </span>
      );
    }

    return children;
  };

  // Convert to string if React pass its children as array type to props
  const title = Array.isArray(text) ? text.join('') : text;

  return (
    <Wrapper
      ref={ref}
      title={title}
      multipleLine={multipleLine}
      style={{ width, minHeight }}
    >
      {hasWidth ? renderContent() : null}
    </Wrapper>
  );
}
