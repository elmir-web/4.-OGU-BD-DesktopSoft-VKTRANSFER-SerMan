SELECT
    `vk`.`Name` as 'Техника' ,
    `unit`.`Name` as 'Подразделение',
    `vktounit`.`DateTransfer` as 'Дата получения'
FROM
    `unit`
LEFT JOIN `unitroom` ON `unitroom`.`UnitID` = `unit`.`ID`    
LEFT JOIN `vktounit` ON `vktounit`.`RoomID` = `unitroom`.`ID`
LEFT JOIN `vk` ON `vk`.`ID` = `vktounit`.`VKID`    
where vk.id = 1
order by `vktounit`.`DateTransfer`