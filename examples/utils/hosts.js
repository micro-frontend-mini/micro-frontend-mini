export const generateHostByHostName = (hostname) => {
  const { host } = window.location;
  const isTestEnv = host.indexOf('mistong.com') !== -1;
  if (isTestEnv) {
    // 支持本地开发环境(*.mistong.com)，手动拼接域名
    return `//${hostname}.test.demo.com`;
  }
  return `//${hostname}.demo.com`;
};
export const passport = generateHostByHostName('passport');

export default {
  passport,
};
