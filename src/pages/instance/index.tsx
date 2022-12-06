import {
  applicationAdmin,
  applicationAdminInstance, instanceDown,
  instanceUp,
  removeApplicationAdmin
} from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable
} from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.ApplicationAdmin[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    console.log(selectedRows)
    await removeApplicationAdmin({
      key: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败');
    return false;
  }
};

const TableList: React.FC = () => {

  // const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();

  const actionRefInstance = useRef<ActionType>();

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentRow, setCurrentRow] = useState<API.ApplicationAdmin>();

  const [selectedRowsState, setSelectedRows] = useState<API.ApplicationAdmin[]>([]);

  const columns: ProColumns<API.ApplicationAdmin>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      hideInSearch: true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              // setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
      valueType: 'textarea',
    },
    {
      title: '可用区',
      dataIndex: 'availabilityZone',
      sorter: true,
      hideInForm: true
    },
    {
      title: '状态',
      dataIndex: 'appStatus',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '默认',
          status: 'Default',
        },
        1: {
          text: '进行中',
          status: 'Processing',
        },
        2: {
          text: '成功',
          status: 'Success',
        },
        3: {
          text: '错误',
          status: 'Error',
        },
      },
    },
    {
      title: '实例数量',
      dataIndex: 'appInstance'
    },
    {
      title: '创建时间',
      sorter: true,
      hideInSearch: true,
      dataIndex: 'createDate',
      valueType: 'dateTime',
    },
    {
      title: '更新时间',
      hideInSearch: true,
      sorter: true,
      dataIndex: 'updateDate',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            setCurrentRow(record);
            handleModalVisible(true);
            if (actionRefInstance.current) {
              actionRefInstance.current.reload();
            }
          }}
        >
          详情
        </a>,
      ],
    },
  ];

  const columnsInstance: ProColumns<API.ApplicationAdminInstance>[] = [
    {
      title: '应用名称',
      ellipsis: true,
      dataIndex: 'appName',
      valueType: 'textarea',
    },
    {
      title: '状态',
      width: 100,
      dataIndex: 'appStatus',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '在线',
          status: 'Processing',
        },
        1: {
          text: '下线',
          status: 'Error',
        },
        2: {
          text: '正在启动',
          status: 'Default',
        },
        3: {
          text: '过期服务',
          status: 'Error',
        },
        4: {
          text: '未知',
          status: 'Default',
        },
      },
    },
    {
      title: '实例ID',
      copyable: true,
      ellipsis: true,
      dataIndex: 'appInstanceId'
    },
    {
      title: '创建时间',
      sorter: true,
      hideInSearch: true,
      dataIndex: 'createDate',
      valueType: 'dateTime',
    },
    {
      title: '更新时间',
      hideInSearch: true,
      sorter: true,
      dataIndex: 'updateDate',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_, record) => [
        <a
          key="up"
          onClick={() => {
            instanceUp({
              id: record.id,
            },{});
          }}
        >
          上线
        </a>,
        <a
          key="down"
          onClick={() => {
            instanceDown({
              id: record.id,
            },{});
          }}
        >
          下线
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.ApplicationAdmin, API.PageParams>
        headerTitle='服务列表'
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 100,
        }}
        toolBarRender={() => [
        ]}
        request={applicationAdmin}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            type="primary"
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <Modal
        title='实例信息'
        width="90%"
        open={createModalVisible}
        onOk={async (value) => {
          console.log(value)
          const success = true;
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleModalVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
        footer={[
          <Button key="back" onClick={() => {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }}>
            关闭
          </Button>
        ]}
      >
        <ProTable<API.ApplicationAdminInstance, API.PageParams>
          headerTitle='实例列表'
          actionRef={actionRefInstance}
          rowKey="id"
          search={{
            labelWidth: 100,
          }}
          request={applicationAdminInstance}
          columns={columnsInstance}
        />
      </Modal>
    </PageContainer>
  );
};

export default TableList;
