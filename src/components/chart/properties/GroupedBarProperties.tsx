import { Col, Form, Row, Select } from 'antd';
import {
  AxisProperty,
  ChartTypeProperty,
  getChartTypeOptions,
  getColumnOptions,
  PropertiesProps,
} from './BasicProperties';

export default function GroupedBarProperties(props: PropertiesProps) {
  const { columns, titleMap } = props;
  const chartTypeOptions = getChartTypeOptions();
  const columnOptions = getColumnOptions(columns, titleMap);
  return (
    <>
      <Row className="mb-2" gutter={16}>
        <Col span={12}>
          <ChartTypeProperty options={chartTypeOptions} />
        </Col>
        <Col span={12}>
          <Form.Item className="mb-0" label="Sub-category" name="xOffset">
            <Select
              size="small"
              options={columnOptions}
              placeholder="Select sub-category"
            />
          </Form.Item>
        </Col>
      </Row>
      <AxisProperty options={columnOptions} />
    </>
  );
}
