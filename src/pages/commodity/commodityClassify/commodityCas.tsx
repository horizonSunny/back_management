import React from 'react';
import { Table, Row, Col } from 'antd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import styles from './commodityCas.less';

let dragingIndex = -1;

class BodyRow extends React.Component {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
    const style = {
      ...restProps.style,
      cursor: 'move',
      textAlign: 'center',
      height: '25px',
      lineHeight: '25px',
    };

    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(<li {...restProps} className={className} style={style} />),
    );
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
);

const columns = [
  {
    title: '新建一级分类',
    dataIndex: 'name',
    key: 'name',
  },
];

export default class DragSortingTable extends React.Component {
  state = {
    dataOne: [
      {
        name: 'John Brown1',
      },
      {
        name: 'Jim Green1',
      },
      {
        name: 'Joe Black1',
      },
    ],
    dataTwo: [
      {
        name: 'John Brown2',
      },
      {
        name: 'Jim Green2',
      },
      {
        name: 'Joe Black2',
      },
    ],
    dataThree: [
      {
        name: 'John Brown3',
      },
      {
        name: 'Jim Green3',
      },
      {
        name: 'Joe Black3',
      },
    ],
  };

  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  moveRow = (data, dataName, dragIndex, hoverIndex) => {
    // const { data } = this.state;
    debugger;
    const dragRow = data[dragIndex];
    const obj = new Object();
    obj[dataName] = {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow],
      ],
    };
    this.setState(update(this.state, obj));
  };

  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <Row className={styles['main']}>
          <Col span={6}>
            <Table
              columns={columns}
              pagination={false}
              dataSource={this.state.dataOne}
              components={this.components}
              onRow={(record, index) => ({
                index,
                moveRow: this.moveRow.bind(this, this.state.dataOne, 'dataOne'),
              })}
            />
          </Col>
          <Col span={6}>
            <Table
              columns={columns}
              pagination={false}
              dataSource={this.state.dataTwo}
              components={this.components}
              onRow={(record, index) => ({
                index,
                moveRow: this.moveRow.bind(this, this.state.dataTwo, 'dataTwo'),
              })}
            />
          </Col>
          <Col span={6}>
            <Table
              columns={columns}
              pagination={false}
              dataSource={this.state.dataThree}
              components={this.components}
              onRow={(record, index) => ({
                index,
                moveRow: this.moveRow.bind(this, this.state.dataThree, 'dataThree'),
              })}
            />
          </Col>
        </Row>
      </DndProvider>
    );
  }
}
