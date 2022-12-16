// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}


/** 获取服务列表 GET /api/applicationAdmin */
export async function applicationAdmin(
  params: {
    // query
    /** 当前的页码 */
    currentPage?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.ApplicationAdmin>('/api/applicationAdmin/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取实例列表 GET /api/applicationAdminInstance */
export async function applicationAdminInstance(
  params: {
    // query
    /** 当前的页码 */
    currentPage?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.ApplicationAdmin>('/api/applicationAdminInstance/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除服务 DELETE /api/removeApplicationAdmin */
export async function removeApplicationAdmin(options?: { [key: string]: any }) {
  // @ts-ignore
  return request<Record<string, any>>('/api/applicationAdmin/delete/multiple', {
    method: 'DELETE',
    params:{
      ids: options.key.join(',')
    },
    ...(options || {}),
  });
}

/** 删除选择器或者规则 */
export async function removeStrategy(options?: string) {
  return request<Record<string, any>>('/api/strategyConfig/delete/'+ options, {
    method: 'DELETE'
  });
}

/** 实例上线 */
export async function instanceUp(
  params: {
    id?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.ApplicationAdminInstance>(`/api/discovery/status/up/${params.id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 实例下线 */
export async function instanceDown(
  params: {
    id?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.ApplicationAdminInstance>(`/api/discovery/status/down/${params.id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 新增策略或者规则 */
export async function addStrategyConfig(body: any, options?: { [key: string]: any }) {
  return request<API.StrategyConfig>('/api/strategyConfig/save', {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

export async function getStrategyGroupList(body: any, options?: { [key: string]: any }) {
  return request<API.GetStrategyGroupList>('/api/strategyConfig/listGroup', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 查询策略规则列表 */
export async function getStrategyRuleList(body: any, options?: { [key: string]: any }) {
  return request<API.GetStrategyRuleList>('/api/strategyConfig/listRule', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 更新策略或者规则 */
export async function updateStrategyConfig(body: any, options?: { [key: string]: any }) {
  return request<API.GetStrategyGroupList>('/api/strategyConfig/update', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function getStrategyConfig(
  params: {
    id?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.StrategyConfigList>('/api/strategyConfig/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
