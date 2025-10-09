import React from 'react';
import styled from 'styled-components';
import { Menu, MenuProps } from 'antd';

const StyledMenu = styled(Menu)`
  &.ant-menu {
    background-color: transparent;
    border-right: 0;
    color: var(--text-primary);

    &:not(.ant-menu-horizontal) {
      .ant-menu-item-selected {
        color: var(--primary-600);
        background: rgba(14, 165, 233, 0.08);
        border-radius: 8px;
        font-weight: 600;
      }
    }

    .ant-menu-item-group {
      margin-top: 20px;

      &:first-child {
        margin-top: 0;
      }
    }

    .ant-menu-item-group-title {
      font-size: 12px;
      font-weight: 700;
      padding: 5px 16px;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .ant-menu-item {
      line-height: 28px;
      height: auto;
      margin: 4px 8px;
      padding: 8px 12px;
      font-weight: 500;
      border-radius: 8px;
      transition: all 0.3s ease;

      &:not(last-child) {
        margin-bottom: 4px;
      }

      &:not(.ant-menu-item-disabled):hover {
        color: var(--primary-600);
        background: var(--bg-hover);
        transform: translateX(4px);
      }

      &:not(.ant-menu-item-disabled):active {
        background: rgba(14, 165, 233, 0.12);
      }

      &:active {
        background-color: transparent;
      }

      &-selected {
        color: var(--primary-600);
        position: relative;

        &:after {
          display: none;
        }

        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          background: var(--primary-600);
          border-radius: 0 2px 2px 0;
        }

        &:hover {
          color: var(--primary-600);
        }
      }
    }
  }
`;

export default function SidebarMenu({
  items,
  selectedKeys,
  onSelect,
}: MenuProps) {
  return (
    <StyledMenu
      mode="inline"
      items={items}
      selectedKeys={selectedKeys}
      onSelect={onSelect}
    />
  );
}
