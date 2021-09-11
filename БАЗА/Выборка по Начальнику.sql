SELECT  `unit`.`Name` as 'Подразделение', `worker`.`FIO` as 'Работник'
FROM `unitpattern`
LEFT JOIN `worker` ON `worker`.`ID` = `unitpattern`.`WorkerID` 
LEFT JOIN `unit` ON `unit`.`ID` = `unitpattern`.`UnitID`
where `unitpattern`.`IsBoss`= 1