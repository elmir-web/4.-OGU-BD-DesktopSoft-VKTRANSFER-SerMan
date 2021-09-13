set @DateTransfer = '2021-09-10';
SELECT
    `unit`.`Name` as 'Подразделение',
    `unitroom`.`Name` as 'Комната',
    `vktounit`.`DateTransfer` as 'Дата перемещения',
    `vk`.`Name` as 'Техника',
    `vktype`.`Name` as 'Тип техники',
    `vk`.`Cost`as 'Стоимость'
FROM
    `unit`
INNER JOIN `unitroom` ON `unit`.`ID` = `unitroom`.`UnitID`
INNER JOIN `vktounit` ON `unitroom`.`ID` = `vktounit`.`RoomID` 
  and vktounit.DateTransfer = (SELECT max(vu.DateTransfer) from vktounit as vu where vu.VKID = vktounit.VKID and vu.DateTransfer <= @DateTransfer)
INNER JOIN `vk` ON `vk`.`ID` = `vktounit`.`VKID`
INNER JOIN `vktype` ON `vktype`.`ID` = `vk`.`TypeID`
where 1 = 1
  and unit.ID = 1
  and vktounit.DateTransfer <= @DateTransfer
order by `unit`.`Name`, `unitroom`.`Name`, `vktounit`.`DateTransfer`




// покажет всю технику в подразделении на эту дату без матотвецлица
--  and unit.ID = 1 



///////////////////////////////////////// original //////////////////////////////////////
set @DateTransfer = '2021-09-10';
SELECT
    `unit`.`Name` as 'Подразделение',
    `unitroom`.`Name` as 'Комната',
    `vktounit`.`DateTransfer` as 'Дата перемещения',
    `vk`.`Name` as 'Техника',
    `vktype`.`Name` as 'Тип техники',
    `vk`.`Cost`as 'Стоиомсть'
FROM
    `unit`
INNER JOIN `unitroom` ON `unit`.`ID` = `unitroom`.`UnitID`
INNER JOIN `vktounit` ON `unitroom`.`ID` = `vktounit`.`RoomID` 
  and vktounit.DateTransfer = (SELECT max(vu.DateTransfer) from vktounit as vu where vu.VKID = vktounit.VKID and vu.DateTransfer <= @DateTransfer)
INNER JOIN `vk` ON `vk`.`ID` = `vktounit`.`VKID`
INNER JOIN `vktype` ON `vktype`.`ID` = `vk`.`TypeID`
where 1 = 1
  and unit.ID = 1 
--  and unit.ID = 1 
--  and vk.ID = 1
  and vktounit.DateTransfer <= @DateTransfer
order by `unit`.`Name`, `unitroom`.`Name`, `vktounit`.`DateTransfer`
///////////////////////////////////////// original //////////////////////////////////////