set @DateTransfer = '2021-09-10';
select unit.Name as 'Имя подразделения', vktype.Name as 'Имя типа', COUNT(*) as kolvo
from unit
inner JOIN unitroom on unitroom.UnitID = unit.ID
INNER JOIN vktounit on  vktounit.RoomID = unitroom.ID
  and vktounit.DateTransfer = (SELECT max(vu.DateTransfer) from vktounit as vu where vu.VKID = vktounit.VKID and vu.DateTransfer <= @DateTransfer)

INNER join vk on vk.ID = vktounit.VKID
INNER join vktype on vktype.ID = vk.TypeID

where vktounit.DateTransfer <= @DateTransfer
--  and vk.id = 1
--  and unit.id = 1
GROUP by unit.Name, vktype.Name
order by unit.Name, vktype.Name

// количество техники в подразделениях по их типу
// покажет количество техники во всех подразделениях