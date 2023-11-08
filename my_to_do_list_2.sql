create database `my_to_do_list`;
use `my_to_do_list`;
show tables;
SELECT * FROM`user_data`;
SELECT * FROM`list_data`;
SELECT * FROM`items_data`; 
SELECT * FROM`list_tag`;
SELECT * FROM`list_tag_association`;



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
`tag_content` varchar(50) NOT NULL -- tag內容
);

create table  `list_tag_association` (
`id` int auto_increment primary key, -- ＩＤ
`list_id` int, -- 清單ＩＤ(FK)
`tag_id` int, -- 標籤ＩＤ(FK)
FOREIGN KEY (`list_id`) REFERENCES `list_data`(`id`) ON DELETE CASCADE -- 外鍵listId子關聯性
FOREIGN KEY (`tag_id`) REFERENCES `list_tag`(`id`) ON DELETE CASCADE -- 外鍵listId子關聯性
)


-- 觸發器 增加項目時更新清單項目總數list_total
DELIMITER //
CREATE TRIGGER update_list_total AFTER INSERT ON items_data FOR EACH ROW
BEGIN
    -- 計算新的 list_total 
    SET @new_list_total = (SELECT COUNT(*) FROM items_data WHERE list_id = NEW.list_id);

    -- 更新 list_total 
    UPDATE list_data SET list_total = @new_list_total WHERE id = NEW.list_id;
END;
//
DELIMITER ;

-- 觸發器 更新為未完成項目時更新清單項目總數list_total
DELIMITER //
CREATE TRIGGER delete_list_total AFTER DELETE ON items_data FOR EACH ROW
BEGIN
    -- 計算新的 list_total 
    SET @new_list_total = (SELECT COUNT(*) FROM items_data WHERE list_id = OLD.list_id);

    -- 更新 list_total 
    UPDATE list_data SET list_total = @new_list_total WHERE id = OLD.list_id;
END;
//
DELIMITER ;


-- 觸發器 當項目改為完成時更新list_finsh
DELIMITER //
CREATE TRIGGER tick_list_finsh AFTER UPDATE ON items_data FOR EACH ROW
BEGIN
    -- 檢查新插入的行的 items_schedule 
    IF NEW.items_schedule = 1 THEN
        -- 增加 list_data 表中 list_finsh ，且id = list_id 
        UPDATE list_data
        SET list_finsh = list_finsh + 1
        WHERE id = NEW.list_id;
    END IF;
END;
//
DELIMITER ;

-- 觸發器 當完成項目被刪除時更新list_finsh
DELIMITER //
CREATE TRIGGER delete_list_finsh AFTER DELETE ON items_data FOR EACH ROW
BEGIN
    -- 檢查刪除的 items_schedule
    IF OLD.items_schedule = 1 THEN
        -- 减少 list_data 表中 list_finsh 值，且id = list_id
        UPDATE list_data
        SET list_finsh = list_finsh - 1
        WHERE id = OLD.list_id;
    END IF;
END;
//
DELIMITER ;

-- 觸發器 當完成項目改為完成時更新list_finsh
DELIMITER //
CREATE TRIGGER cross_list_finsh AFTER UPDATE ON items_data FOR EACH ROW
BEGIN
    -- 檢查新插入的行的 items_schedule 
    IF OLD.items_schedule = 1 THEN
        -- 增加 list_data 表中 list_finsh 值，且id = list_id
        UPDATE list_data
        SET list_finsh = list_finsh -1
        WHERE id = OLD.list_id;
    END IF;
END;
//
DELIMITER //;








