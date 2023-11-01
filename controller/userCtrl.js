const tools = require('../tool');
const userModel = require('../model/userModel');

//登入
async function login(req, res) {
  const { account, password } = req.body;
  try {
    const chekMemberResult = await userModel.checkIsMember(account, password);
    if (!chekMemberResult.success) {
      console.log('帳號或密碼有誤！');
      return res.send({
        loginStatus: false,
        message: '登入失敗,帳號或密碼有誤！',
      });
    }
    ///給與權限動作
    const userId = await chekMemberResult.userId;
    const token = tools.makeToken({ userId }, 1200); //20min過期
    req.session.token = token;

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
  try {
    const isUserRepeat = await userModel.userIsRepeat(account);
    if (isUserRepeat) {
      return res.json({ registerResult: false, message: '帳號已存在' });
    }
    await userModel.createUser(account, password);
    return res.json({ registerResult: true, message: '註冊成功' });
  } catch (error) {
    return res
      .status(500)
      .json({ registerResult: false, message: '伺服器錯誤' });
  }
}

//登出
function logOut(req, res) {
  delete req.session.token;
  console.log('已登出');
  res.json({ loginStatus: false, message: '登出成功' });
}

module.exports = {
  login,
  logOut,
  register,
};
