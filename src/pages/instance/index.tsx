import {
  addRule, removeRule, addStrategyConfig, updateStrategyConfig,
  applicationAdmin,
  applicationAdminInstance, getStrategyConfig, instanceDown, getStrategyGroupList, getStrategyRuleList, removeStrategy,
  instanceUp,
  removeApplicationAdmin
} from '@/services/ant-design-pro/api';
import {ActionType, ProColumns, ProFormInstance,ProCard, ProFormSelect, ProFormSwitch } from '@ant-design/pro-components';
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

/**
 *  Delete node
 * @zh-CN 删除选择器或者规则
 *
 * @param selectedRows
 */
const handleRemoveStrategy = async (params) => {
  const hide = message.loading('正在删除');
  try {
    await removeStrategy(params.id);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败');
    return false;
  }
};

const handleAdd = async (fields: API.StrategyConfig, app: API.ApplicationAdmin, groupState: string | undefined, groupRow: API.GetStrategyGroupList) => {
  const hide = message.loading('正在添加');
  try {
    console.log(fields)
    console.log(groupState === 'rule')
    console.log(groupState)
    if (fields.availableStatus) {
      fields.availableStatus = 1
    } else {
      fields.availableStatus = 0
    }
    if (groupState === 'rule') {
      fields.parentId = groupRow.id
    }
    console.log(fields)
    await addStrategyConfig({...fields, appName: app.appName});
    hide();
    message.success('增加成功');
    return true;
  } catch (error) {
    hide();
    message.error('增加失败!');
    return false;
  }
};

const handleUpdate = async (fields: API.StrategyConfig, app: API.ApplicationAdmin) => {
  const hide = message.loading('正在更新');
  try {
    await updateStrategyConfig({...fields, appName: app.appName});
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败!');
    return false;
  }
};

const TableList: React.FC = () => {

  // const [showDetail, setShowDetail] = useState<boolean>(false);
  const restFormRef = useRef<ProFormInstance>();

  const restFormDateRef = useRef<ProFormInstance>();

  const actionRef = useRef<ActionType>();

  const actionRefInstance = useRef<ActionType>();
  const actionRefStrategy = useRef<ActionType>();
  const actionRefGroup = useRef<ActionType>();
  const actionRefRule = useRef<ActionType>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createModalStrategyVisible, setModalStrategyVisible] = useState<boolean>(false);
  const [createModalStrategy2Visible, setModalStrategy2Visible] = useState<boolean>(false);

  const [groupState, setGroupState] = useState<string>('group');

  const [flagGroup, setGroupFlag] = useState<string>('add');

  const [flagRule, setRuleFlag] = useState<string>('add');

  const [now, setNow] = useState(() => Date.now())

  const [groupNow, setGroupNow] = useState(() => Date.now())

  const [ruleNow, setRuleNow] = useState(() => Date.now())
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentRow, setCurrentRow] = useState<API.ApplicationAdmin>();

  const [currentGroupRow, setCurrentGroupRow] = useState<API.GetStrategyGroupList[]>([]);

  const [currentGroupUpdateRow, setCurrentGroupUpdateRow] = useState<API.GetStrategyGroupList>();


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
            setGroupNow(Date.now)
            setRuleNow(Date.now)
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
          key="upDownQy"
          onClick={() => {}
        }
        >
          启用
        </a>,
      ]
    },
  ];

  const columnsSelector: ProColumns<API.GetStrategyGroupList>[] = [
    {
      title: '名称',
      ellipsis: true,
      width: 100,
      dataIndex: 'strategyName',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: '状态',
      width: 100,
      hideInSearch: true,
      dataIndex: 'availableStatus',
      valueEnum: {
        0: {
          text: '停用',
          status: '1',
        },
        1: {
          text: '启用',
          status: '0',
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
          key="upDownxg"
          onClick={() => {
            setGroupFlag('update')
            setCurrentGroupUpdateRow(record)
            setModalStrategy2Visible(true)
          }
        }
        >
          修改
        </a>,
        <a
        key="upDownsc"
        onClick={async () => {
          await handleRemoveStrategy(record);
          actionRefGroup.current?.reloadAndRest?.();
          actionRefRule.current?.reloadAndRest?.();
        }
      }
      >
        删除
      </a>,
      ]
    },
  ];

  const columnsRule: ProColumns<API.GetStrategyGroupList>[] = [
    {
      title: '规则名称',
      ellipsis: true,
      width: 100,
      dataIndex: 'strategyName',
      hideInSearch: true,
    },
    {
      title: '状态',
      width: 100,
      hideInSearch: true,
      dataIndex: 'availableStatus',
      valueEnum: {
        0: {
          text: '停用',
          status: '1',
        },
        1: {
          text: '启用',
          status: '0',
        },
      },
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
          key="upDownxcc"
          onClick={() => {
            setRuleFlag('update')
            setCurrentGroupUpdateRow(record)
            setModalStrategy2Visible(true)
          }
        }
        >
          修改
        </a>,
        <a
        key="upDowndleel"
        onClick={async () => {
          await handleRemoveStrategy(record);
          actionRefRule.current?.reloadAndRest?.();
        }
      }
      >
        删除
      </a>,
      ]
    },
  ];

  const onExpand = (expanded: boolean) => {
    if (expanded) {
      setNow(Date.now())
    }
  };

  return (
    <PageContainer>
      <ProTable<API.ApplicationAdmin, API.PageParams>
        expandable={{
          onExpand,
          // expandedRowRender
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
      <Modal
        title='策略'
        width= '90%'
        open={createModalStrategyVisible}
        onCancel={() => {
          setModalStrategyVisible(false);
          if (actionRefStrategy.current) {
            actionRefStrategy.current.reload();
          }
        }}
        footer={[
          <Button key="back" onClick={() => {
            setModalStrategyVisible(false);
            if (actionRefStrategy.current) {
              actionRefStrategy.current.reload();
            }
          }}>
            关闭
          </Button>
        ]}
      >
        <ProCard gutter={24}>
          <ProCard colSpan={10}>
            <ProTable<API.GetStrategyGroupList, API.PageParams>
              pagination={false}
              headerTitle='选择器列表'
              params={{groupNow}}
              search={false}
              options={false}
              cardBordered={true}
              toolBarRender={() => [
                <Button key="button" type="primary" onClick={() => {
                  setGroupState('group')
                  setGroupFlag('add')
                  setModalStrategy2Visible(true)
                  restFormDateRef.current?.resetFields();
                }}>
                  添加选择器
                </Button>,
              ]}
              actionRef={actionRefGroup}
              rowKey="id"
              // request={getStrategyGroupList}
              request={async () => {
                return {
                  ...await getStrategyGroupList({
                    appName: (currentRow as API.ApplicationAdmin).appName,
                  }),
                  success: true,
                }
              }}
              columns={columnsSelector}
              rowSelection={{
                onChange: (keys, selectedRows) => {
                  if (keys.length > 1){
                    keys.shift()
                    selectedRows.shift()
                    setCurrentGroupRow(selectedRows);
                    actionRefRule?.current?.reload();
                  } else if (keys.length === 1){
                    setCurrentGroupRow(selectedRows);
                    actionRefRule?.current?.reload();
                  }
                },
              }}
            />
          </ProCard>
          <ProCard colSpan={14}>
            <ProTable<API.GetStrategyRuleList, API.PageParams>
              pagination={false}
              headerTitle='选择器规则列表'
              params={{ruleNow}}
              search={false}
              options={false}
              cardBordered={true}
              toolBarRender={() => [
                <Button key="button" type="primary" onClick={ () => {
                  if (!currentGroupRow || currentGroupRow.length === 0) {
                    message.error('请选择选择器')
                    return
                  }
                  setGroupState('rule')
                  setRuleFlag('add')
                  setModalStrategy2Visible(true)
                  restFormDateRef.current?.resetFields();
                }}>
                  添加规则
                </Button>,
              ]}
              actionRef={actionRefRule}
              rowKey="id"
              // request={getStrategyRuleList}
              request={async () => {
                return {
                  ...await getStrategyRuleList({
                    parentId: currentGroupRow[0].id,
                    appName: (currentRow as API.ApplicationAdmin).appName,
                  }),
                  success: true,
                }
              }}
              columns={columnsRule}
            /></ProCard>
          </ProCard>
      </Modal>
      <ModalForm
        formRef={restFormDateRef}
        title={ 'group' === groupState ? '添加选择器' : '添加规则'}
        width='850px'
        layout='horizontal'
        open={createModalStrategy2Visible}
        onOpenChange={setModalStrategy2Visible}
        // request={async () => {
        //   return {
        //     ...await getStrategyConfig({
        //       id: ('group' === groupState ? currentGroupUpdateRow.id : currentRuleUpdateRow.id),
        //     }),
        //     success: true,
        //   }
        // }}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            console.log(123123)
            setModalStrategy2Visible(false);
            setCurrentGroupUpdateRow(undefined)
          }
        }}
        initialValues={currentGroupUpdateRow}
        onFinish={async (value) => {
          const success =  await handleAdd(value as API.StrategyConfig, currentRow as API.ApplicationAdmin, groupState, currentGroupRow[0] as API.GetStrategyGroupList);
          if (success) {
            setModalStrategy2Visible(false);
            actionRefStrategy.current?.reload();
            restFormRef.current?.resetFields();
            setNow(Date.now)
            setGroupNow(Date.now)
            setRuleNow(Date.now)
          }
          restFormDateRef.current?.resetFields();
        }}
      >
        <ProFormText hidden={true} name="id" initialValue={currentGroupUpdateRow?.id}/>
        <ProFormText hidden={true} name="parentId" initialValue={currentGroupUpdateRow?.parentId}/>
        <ProFormText
            rules={[
              {
                required: true,
                message: '必填',
                max: 24
              },
            ]}
            name="strategyName"
            label="策略名称"
            labelCol={{ style: { width: 100 } }}
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
                value: 'all',
                label: 'all',
              },
              {
                value: 'any',
                label: 'any',
              },
            ]}
            width='md'
            labelCol={{ style: { width: 100 } }}
            name="strategy"
            label="策略类型"
            placeholder="请选择"
          />
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
                value: 'ip',
                label: 'ip',
              },
              {
                value: 'host',
                label: 'host',
              },
              {
                value: 'uri',
                label: 'uri',
              },
              {
                value: 'domain',
                label: 'domain',
              },
              {
                value: 'header',
                label: 'header',
              }
            ]}
            labelCol={{ style: { width: 100 } }}
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
                value: 'equals',
                label: 'equals',
              },
              {
                value: 'match',
                label: 'match',
              },
              {
                value: 'path',
                label: 'path',
              },
              {
                value: 'exclude',
                label: 'exclude',
              },
              {
                value: 'contains',
                label: 'contains',
              }
            ]}
            label=""
            name="operator"
            placeholder="请选择"
          />
          <ProFormText
            rules={[
              {
                required: true,
                message: '必填',
              },
            ]}
            width={250}
            label=""
            name="paramValue"
            placeholder="请输入"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSwitch name="availableStatus" label="是否开启" labelCol={{ style: { width: 100 } }} />
        </ProForm.Group>
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
