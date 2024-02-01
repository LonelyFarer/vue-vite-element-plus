import request from '@/utils/request';

// 获取路由
export const getHomes = () => {
  return request({
    url: '/auth/captcha',
    method: 'get',
  });
};
