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
async function repeatUser(account) {
  try {
    const repeatResult = 'SELECT * FROM user_data WHERE account = ?';
    const [results] = await connection.execute(repeatResult, [account]);
    if (results.length > 0) {
      return { success: false, message: '帳號已重複' };
    } else {
      return { success: true, message: '帳號尚無使用' };
    }
  } catch (error) {
    console.error('檢查data重複使用者時發生錯誤:', error);
    throw new Error('檢查data重複使用者時發生錯誤');
  }
}

//密碼核對
async function chekPassword(password) {
  try {
    const repeatResult = 'SELECT * FROM user_data WHERE password = ?';
    const [results] = await connection.execute(repeatResult, [password]);
    if (results.length > 0) {
      return { success: true, message: '密碼正確' };
    } else {
      return { success: false, message: '密碼錯誤' };
    }
  } catch (error) {
    console.error('檢查密碼data時出錯:', error);
    throw new Error('檢查密碼data時出錯');
  }
}

//取得userId
async function getUserById(account) {
  try {
    const selectQuery = 'SELECT id FROM user_data WHERE account = ?';
    const [rows] = await connection.execute(selectQuery, [account]);
    return rows[0].id;
  } catch (error) {
    console.error('取得user_id發生錯誤:', error);
    return null;
  }
}

module.exports = {
  createUser,
  repeatUser,
  chekPassword,
  getUserById,
};
