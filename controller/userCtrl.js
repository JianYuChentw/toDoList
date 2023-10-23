const tools = require('../model/tool');
const userModel = require('../model/userModel');

//登入
async function login(req, res) {
  const { account, password } = req.body;
  const chekAccountResult = await userModel.repeatUser(account);
  const chekPasswordResult = await userModel.chekPassword(password);
  try {
    if (chekAccountResult.success || !chekPasswordResult.success) {
      console.log('帳號或密碼有誤！');
      return res.send({
        loginStatus: false,
        message: '登入失敗,帳號或密碼有誤！',
      });
    }
    ///給與權限動作
    const userId = await userModel.getUserById(account);
    const token = tools.makeToken({ userId }, 1200); //20min過期
    req.header.Authorization = token;
    console.log('登入成功');
    return res.json({ loginStatus: true, message: '登入成功' });
  } catch (error) {
    console.error('失敗:', error);
    return res.status(500).send('未預期失敗');
  }
}

//註冊
async function register(req, res) {
  const { account, password } = req.body;
  const chekAccountResult = await userModel.repeatUser(account);
  if (!chekAccountResult.success) {
    return res.json({ registerResult: false, message: '帳號已存在' });
  }
  userModel.createUser(account, password);
  return res.json({ registerResult: true, message: '註冊成功' });
}

//登出
function logOut(req, res) {
  const userKey = req.header.Authorization;
  if (userKey === null)
    return res.json({ loginStatus: false, message: '非登入狀態' });
  delete req.header.Authorization;
  console.log('已登出');
  res.json({ loginStatus: false, message: '登出成功' });
}

module.exports = {
  login,
  logOut,
  register,
};
