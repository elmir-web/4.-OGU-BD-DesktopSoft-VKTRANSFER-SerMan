set @DateTransfer = '2021-09-10';
SELECT
    `unit`.`Name` as 'Подразделение',
    `unitroom`.`Name` as 'Комната',
	`worker`.`FIO` as 'Материально-ответственное лицо',
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
INNER JOIN `unitpattern` ON `unit`.`ID` = `unitpattern`.`UnitID`
INNER JOIN `worker` ON `worker`.`ID` = `unitpattern`.`ID` 

where unit.ID = 1 
  and vktounit.DateTransfer <= @DateTransfer
  and `unitpattern`.`IsMOL` = 1
order by `unit`.`Name`, `unitroom`.`Name`, `worker`.`FIO`, `vktounit`.`DateTransfer`

// изменить unit.ID, IsMOL, DateTransfer
// что делает DateTransfer

// покажет всю технику в этом подразделении на момент этой даты с материальным отвец лицом
--  and `unitpattern`.`IsMOL` = 1

// переместить технику просто создать новую запись в vktounit
// исправить баг с отображением техники