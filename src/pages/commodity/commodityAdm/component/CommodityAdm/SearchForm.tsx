import { Form, Row, Col, Input, Button, DatePicker, Select, TreeSelect } from 'antd';
import React from 'react';
import styles from './SearchForm.less';
import router from 'umi/router';
import moment from 'moment';
import { connect } from 'dva';
import filterProperty from '@/utils/filterProperty';

const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(({ commodity }) => ({ commodity }))
class AdvancedSearchForm extends React.Component {
  state = {
    expand: false,
    sellingStatus: null,
    // productType: this.props.commodity.allProductType,
    selectedRowKeys: [],
  };

  // 查询
  handleSearch = e => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const rangeValue = fieldsValue['range-picker'];
      const values = {
        ...fieldsValue,
        'range-picker': [
          rangeValue && rangeValue.length !== 0
            ? Date.parse(rangeValue[0].format('YYYY-MM-DD HH:mm'))
            : undefined,
          rangeValue && rangeValue.length !== 0
            ? Date.parse(rangeValue[1].format('YYYY-MM-DD HH:mm'))
            : undefined,
        ],
      };
      const searchParams = {
        startTime: values['range-picker'][0],
        endTime: values['range-picker'][1],
        recommandStatus: values.recommandStatus,
        productType: values.status,
        productCommonName: values.keyword,
        approvalNumber: values.approvalNumber,
      };
      const searchInfo = filterProperty(searchParams);
      console.log('searchInfo_', searchInfo);

      async function search() {
        await dispatch({
          type: 'commodity/saveSearchForm',
          payload: searchInfo,
        });
        await dispatch({
          type: 'commodity/getList',
        });
      }
      search();
      // this.props.saveSearchInfo(searchInfo);
    });
  };

  handleReset = () => {
    console.log('reset');
    this.props.form.resetFields();
    // 保留tab
    const { dispatch } = this.props;
    dispatch({
      type: 'commodity/resetForm',
    });
  };

  // 新增产品
  handleNew = () => {
    router.push('/commodityAdm/management/chooseProducts');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const rangeConfig = {
      rules: [{ type: 'array', message: 'Please select time!' }],
    };
    const { allProductType, searchForm } = this.props.commodity;
    const productType = allProductType;
    return (
      <Form className={styles['ant-advanced-search-form']} onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col
            span={11}
            style={{
              maxWidth: '500px',
            }}
          >
            <Form.Item label="创建时间">
              {getFieldDecorator('range-picker', {
                initialValue:
                  searchForm.startTime && searchForm.endTime
                    ? [moment(searchForm.startTime), moment(searchForm.endTime)]
                    : '',
              })(<RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />)}
            </Form.Item>
          </Col>
          <Col span={7} style={{}}>
            <Form.Item label="商品名">
              {getFieldDecorator('keyword', {
                initialValue: searchForm.productCommonName,
                rules: [],
              })(<Input placeholder="输入商品名" />)}
            </Form.Item>
          </Col>
          <Col span={6} style={{}}>
            <Form.Item label="批准文号">
              {getFieldDecorator('approvalNumber', {
                rules: [],
                initialValue: searchForm.approvalNumber,
              })(<Input placeholder="输入批准文号" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col
            span={8}
            style={{
              maxWidth: '500px',
              background: '@title-background',
            }}
          >
            <Form.Item label="商品分类">
              {getFieldDecorator('status', {
                rules: [],
                initialValue: searchForm.productType,
              })(
                <TreeSelect
                  allowClear
                  placeholder="选择商品分类"
                  treeData={productType}
                  onChange={this.onChange}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="是否推荐商品">
              {getFieldDecorator('recommandStatus', {
                rules: [],
                initialValue: searchForm.recommandStatus,
              })(
                <Select style={{ width: 120 }}>
                  <Option value={3}>全部</Option>
                  <Option value={1}>推荐商品</Option>
                  <Option value={0}>非推荐商品</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col
            span={8}
            style={{
              textAlign: 'right',
              position: 'relative',
              top: '5px',
              left: '-20px',
              float: 'right',
            }}
          >
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              重置
            </Button>
            <Button style={{ marginLeft: 8, background: '#F5AB1C' }} onClick={this.handleNew}>
              + 添加
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedAdvancedSearchForm = Form.create({ name: 'advanced_search' })(AdvancedSearchForm);
export default WrappedAdvancedSearchForm;
