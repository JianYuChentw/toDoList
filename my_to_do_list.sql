create database `my_to_do_list`;
use `my_to_do_list`;
show tables;
SELECT * FROM`user_data`;
SELECT * FROM`list_data`;
SELECT * FROM`items_data`; 
SELECT * FROM`list_tag`;



create table `user_data` (
`id` int auto_increment primary key, -- 使用者ＩＤ
`account` varchar(20) NOT NULL, -- 帳號
`password` varchar(16) NOT NULL, -- 密碼
`use_state`	boolean default true -- 使用者狀態
);


create table `list_data` (
`id` int auto_increment primary key, -- 清單ＩＤ
`user_id` int, -- 使用者ＩＤ(FK)
`list_title` varchar(100) NOT NULL, -- 清單標題
`list_total` int default 0 , -- 項目總數
`list_finsh` int default 0, -- 完成項目
`list_create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 清單創建時間
`list_update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 清單最後更新時間
`list_data`int default 0,
FOREIGN KEY (`user_id`) REFERENCES `user_data`(`id`) ON DELETE CASCADE -- 外鍵userId子關聯性
);


create table `items_data` (
`id` int auto_increment primary key, -- 項目ＩＤ
`list_id` int, -- 清單ＩＤ(FK)
`items_sort_order` int default 0, -- 項目排序
`items_title` varchar(50) NOT NULL, -- 項目標題
`items_schedule` boolean default false, -- 項目完成狀態
`items_create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 項目創建時間
`items_update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 項目最後更新時間
FOREIGN KEY (`list_id`) REFERENCES `list_data`(`id`) ON DELETE CASCADE -- 外鍵listId子關聯性
);


create table `list_tag`(
`id` int auto_increment primary key, -- 標籤ＩＤ
`user_id` int, -- 使用者ＩＤ(FK)
`list_id` int, -- 清單ＩＤ(FK)
`tag_content` varchar(50) NOT NULL, -- tag內容
FOREIGN KEY (`user_id`) REFERENCES `user_data`(`id`), -- 外鍵userId
FOREIGN KEY (`list_id`) REFERENCES `list_data`(`id`) ON DELETE CASCADE -- 外鍵listId子關聯性
);