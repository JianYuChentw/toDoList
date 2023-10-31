const { connection } = require('../database/data');

// 新增使用者
async function createUser(account, password) {
  try {
    const newUser = `
          insert into user_data (account,password)
          values (?,?)`;

    const userValue = [account, password];
    const result = await connection.query(newUser, userValue);
    console.log('新增成功!');
    return true;
  } catch (error) {
    console.error('新增失敗data時發生錯誤:', error);
    throw new Error('新增失敗data時發生錯誤');
  }
}

// 重複使用者檢查
async function userIsRepeat(account) {
  try {
    const repeatResult = 'SELECT * FROM user_data WHERE account = ?';
    const [results] = await connection.execute(repeatResult, [account]);
    return results.length > 0;
  } catch (error) {
    console.error('檢查data重複使用者時發生錯誤:', error);
    throw new Error('檢查data重複使用者時發生錯誤');
  }
}

//核對是否為會員
async function checkIsMember(account, password) {
  try {
    const query = 'SELECT id FROM user_data WHERE account = ? AND password = ?';
    const [results] = await connection.execute(query, [account, password]);

    if (results.length > 0) {
      return { success: true, userId: results[0].id };
    } else {
      return { success: false, id: null };
    }
  } catch (error) {
    console.error('檢查帳號或密碼錯誤:', error);
    throw new Error('檢查帳號或密碼錯誤');
  }
}

module.exports = {
  createUser,
  userIsRepeat,
  checkIsMember,
};
