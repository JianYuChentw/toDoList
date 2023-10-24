create database `MyToDoList`;
use `MyToDoList`;
show tables;
SELECT * FROM`userData`;
SELECT * FROM`listData`;
SELECT * FROM`itemsData`;
SELECT * FROM`listTag`;

UPDATE `listData` SET `listTotal` = 1 WHERE `id` = 12;

create table `userData` (
`id` int auto_increment primary key, -- 使用者ＩＤ
`account` varchar(20) NOT NULL, -- 帳號
`password` varchar(16) NOT NULL, -- 密碼
`userState`	boolean default true -- 使用者狀態
);


create table `listData` (
`id` int auto_increment primary key, -- 清單ＩＤ
`userId` int, -- 使用者ＩＤ(FK)
`listTitle` varchar(100) NOT NULL, -- 清單標題
`listTotal` int default 0 , -- 項目總數
`listFinsh` int default 0, -- 完成項目
`listCreateTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 清單創建時間
`listUpdateTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 清單最後更新時間
`listData`int default 0,
FOREIGN KEY (`userId`) REFERENCES `userData`(`id`) ON DELETE CASCADE -- 外鍵userId子關聯性
);


create table `itemsData` (
`id` int auto_increment primary key, -- 項目ＩＤ
`listId` int, -- 清單ＩＤ(FK)
`itemsSortOder` int default 0, -- 項目排序
`itemsTitle` varchar(50) NOT NULL, -- 項目標題
`itemsSchedule` boolean default false, -- 項目完成狀態
`itemsCreateTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 項目創建時間
`itemsUpdateTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 項目最後更新時間
FOREIGN KEY (`listId`) REFERENCES `listData`(`id`) ON DELETE CASCADE -- 外鍵listId子關聯性
);




create table `listTag`(
`id` int auto_increment primary key, -- 標籤ＩＤ
`userId` int, -- 使用者ＩＤ(FK)
`listId` int, -- 清單ＩＤ(FK)
`tagContent` varchar(50) NOT NULL, -- tag內容
FOREIGN KEY (`userId`) REFERENCES `userData`(`id`), -- 外鍵userId
FOREIGN KEY (`listId`) REFERENCES `listData`(`id`) ON DELETE CASCADE -- 外鍵listId子關聯性
);


