import {
  addRule, addStrategyConfig,
  applicationAdmin,
  applicationAdminInstance, getStrategyConfig, instanceDown,
  instanceUp,
  removeApplicationAdmin
} from '@/services/ant-design-pro/api';
import {ActionType, ProColumns, ProFormInstance, ProFormSelect } from '@ant-design/pro-components';
import {
  FooterToolbar, ModalForm,
  PageContainer, ProFormText, ProForm,
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

const handleAdd = async (fields: API.StrategyConfig, app: API.ApplicationAdmin) => {
  const hide = message.loading('正在添加');
  try {
    await addStrategyConfig({...fields, applicationId: app.id, appName: app.appName});
    hide();
    message.success('增加成功');
    return true;
  } catch (error) {
    hide();
    message.error('增加失败!');
    return false;
  }
};

const TableList: React.FC = () => {

  // const [showDetail, setShowDetail] = useState<boolean>(false);
  const restFormRef = useRef<ProFormInstance>();

  const actionRef = useRef<ActionType>();

  const actionRefInstance = useRef<ActionType>();

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createModalStrategyVisible, setModalStrategyVisible] = useState<boolean>(false);
  const [now, setNow] = useState(() => Date.now())
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentRow, setCurrentRow] = useState<API.ApplicationAdmin>();

  const [selectedRowsState, setSelectedRows] = useState<API.ApplicationAdmin[]>([]);

  const columns: ProColumns<API.ApplicationAdmin>[] = [
    {
      title: '序号',
      width: 50,
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
      ellipsis: true,
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
      width: 200,
      hideInSearch: true,
      dataIndex: 'createDate',
      valueType: 'dateTime',
    },
    {
      title: '更新时间',
      width: 200,
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
        <a
          key="addStrategy"
          onClick={() => {
            setCurrentRow(record);
            setModalStrategyVisible(true)
          }}>
          策略
        </a>
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
      width: 100,
      dataIndex: 'option',
      valueType: 'option',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_, record) => [
        <a
          key="upDown"
          onClick={() => {
            const hide = message.loading('正在处理');
            try {
              if (record.appStatus !== 1) {
                instanceDown({
                  id: record.id,
                }, {}).then(() => {
                  hide();
                  message.success('下线成功');
                  if (actionRefInstance.current) {
                    actionRefInstance.current.reload();
                  }
                });
              } else {
                hide();
                message.success('上线成功');
                instanceUp({
                  id: record.id,
                }, {}).then(() => {
                  if (actionRefInstance.current) {
                    actionRefInstance.current.reload();
                  }
                });
              }
            } catch (e) {
              hide();
              message.error('处理失败');
            }
          }
        }
        >
          { record.appStatus !== 1 ? '下线':'上线' }
        </a>,
      ],
    },
  ];

  const columnsStrategyConfig: ProColumns<API.StrategyConfig>[] = [
    {
      title: '策略名称',
      ellipsis: true,
      dataIndex: 'strategyName',
    },
    {
      title: '策略类型',
      ellipsis: true,
      dataIndex: 'strategy',
    },
    {
      title: '匹配方式',
      ellipsis: true,
      dataIndex: 'paramType',
    },
    {
      title: '状态',
      ellipsis: true,
      dataIndex: 'availableStatus',
      valueEnum: {
        0: {
          text: '停用',
          status: 'Default',
        },
        1: {
          text: '启用',
          status: 'Processing',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_, record) => [
        <a
          key="upDown"
          onClick={() => {}
        }
        >
          启用
        </a>,
      ]
    },
  ];

  const onExpand = (expanded: boolean) => {
    if (expanded) {
      setNow(Date.now())
    }
  };
  const expandedRowRender = (record: API.ApplicationAdmin) => {
    return (
      <ProTable
        params={{now}}
        rowKey="id"
        columns={columnsStrategyConfig}
        headerTitle={false}
        search={false}
        options={false}
        request={async () => {
          return {
            ...await getStrategyConfig({
              id: record.id,
            }),
            success: true,
          }
        }}
        pagination={false}
      />
    );
  };

  return (
    <PageContainer>
      <ProTable<API.ApplicationAdmin, API.PageParams>
        expandable={{
          onExpand,
          expandedRowRender
        }}
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
      <ModalForm
        title='策略'
        width='780px'
        formRef={restFormRef}
        open={createModalStrategyVisible}
        onOpenChange={setModalStrategyVisible}
        onFinish={async (value) => {
          console.log(value)
          const success = await handleAdd(value as API.StrategyConfig, currentRow as API.ApplicationAdmin);
          if (success) {
            setModalStrategyVisible(false);
            actionRef.current?.reload();
            restFormRef.current?.resetFields();
            setNow(Date.now)
          }
        }}
      >
        <ProForm.Group>
          <ProFormText
            rules={[
              {
                required: true,
                message: '必填',
                max: 24
              },
            ]}
            width="md"
            name="strategyName"
            label="策略名称"
            tooltip="最长为 24 位"
            placeholder="请输入名称"
          />
          <ProFormSelect
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
            request={async () => [
              {
                value: 'and',
                label: 'and',
              },
              {
                value: 'or',
                label: 'or',
              },
            ]}
            width="md"
            name="strategy"
            label="策略类型"
            placeholder="请选择"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
            request={async () => [
              {
                value: 'post',
                label: 'post',
              },
              {
                value: 'uri',
                label: 'uri',
              },
              {
                value: 'host',
                label: 'host',
              },
              {
                value: 'ip',
                label: 'ip',
              },
            ]}
            width="md"
            name="paramType"
            label="条件"
            placeholder="请选择"
          />
          <ProFormSelect
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
            request={async () => [
              {
                value: 'match',
                label: 'match',
              },
              {
                value: '=',
                label: '=',
              }
            ]}
            width="md"
            name="operator"
            label="匹配"
            placeholder="请选择"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
            width="md"
            name="paramValue"
            label="匹配表达式"
            placeholder="请选择"
          />
        </ProForm.Group>
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
