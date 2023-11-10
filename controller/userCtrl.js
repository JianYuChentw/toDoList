const tools = require('../tool');
const userModel = require('../model/userModel');

//登入
async function login(req, res) {
  const { account, password } = req.body;
  let ErrorResponseResult = { Status: false, message: '伺服器錯誤' };
  try {
    const chekMemberResult = await userModel.checkIsMember(account, password);
    if (!chekMemberResult.success) {
      console.log('帳號或密碼有誤！');
      throw new Error('登入失敗,帳號或密碼有誤！');
    }
    ///給與權限動作
    const userId = await chekMemberResult.userId;
    const token = tools.makeToken({ userId }, 1200); //20min過期

    console.log('登入成功');
    return res.json({
      Status: true,
      message: '登入成功',
      token: token,
    });
  } catch (error) {
    console.error('失敗:', error);
    return res.status(500).json({
      Status: ErrorResponseResult.Status,
      Message: error.message || ErrorResponseResult.message,
    });
  }
}

//註冊
async function register(req, res) {
  const { account, password } = req.body;
  let ErrorResponseResult = { Status: false, message: '伺服器錯誤' };
  try {
    const isUserRepeat = await userModel.userIsRepeat(account);
    if (isUserRepeat) {
      throw new Error('帳號已存在');
    }
    await userModel.createUser(account, password);
    return res.json({ Status: true, message: '註冊成功' });
  } catch (error) {
    return res.status(500).json({
      Status: ErrorResponseResult.Status,
      Message: error.message || ErrorResponseResult.message,
    });
  }
}

//登出
function logOut(req, res) {
  console.log('已登出');
  res.json({ loginStatus: false, message: '登出成功', token: 'yorAreLogOut' });
}

//master
module.exports = {
  login,
  logOut,
  register,
};
