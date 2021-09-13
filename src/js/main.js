const remote = require("electron").remote;
let moment = require("moment");

let rowsAllTypeVK = [];
let rowsAllUnit = [];
let rowsAllWorker = [];
let rowsAllUnitRoom = [];
let rowsAllVK = [];

let statusReadCreate = 0;
let idReadCreate = 0;
let statusVKToUnitShow = 0;

window.onload = function () {
  // ____________________________________________________________ навигация в меню
  document
    .querySelector("#button-menu-vktype")
    .addEventListener("click", async () =>
      DisplayShowCondition("#condition-vktype")
    );
  document
    .querySelector("#button-menu-vk")
    .addEventListener("click", async () =>
      DisplayShowCondition("#condition-vk")
    );
  document
    .querySelector("#button-menu-worker")
    .addEventListener("click", async () =>
      DisplayShowCondition("#condition-worker")
    );
  document
    .querySelector("#button-menu-unit")
    .addEventListener("click", async () =>
      DisplayShowCondition("#condition-unit")
    );
  document
    .querySelector("#button-menu-unitpattern")
    .addEventListener("click", async () =>
      DisplayShowCondition("#condition-unitpattern")
    );
  document
    .querySelector("#button-menu-unitroom")
    .addEventListener("click", async () =>
      DisplayShowCondition("#condition-unitroom")
    );
  document
    .querySelector("#button-menu-vktounit")
    .addEventListener("click", async () =>
      DisplayShowCondition("#condition-vktounit")
    );
  // ____________________________________________________________ навигация в меню

  // ____________________________________________________________ Сотрудники
  document
    .querySelector("#butt-create-worker")
    .addEventListener("click", async (evt) => await CreateWorker(evt));

  document
    .querySelector("#butt-show-worker")
    .addEventListener("click", async (evt) => {
      evt.preventDefault();

      showWorker();
    });

  document
    .querySelector("#butt-show-report-boss-unit")
    .addEventListener("click", async (evt) => await ShowBossUnit(evt));
  // ____________________________________________________________ Сотрудники

  // ____________________________________________________________ Паттерны сотрудников
  document
    .querySelector("#butt-create-unitpattern")
    .addEventListener("click", async (evt) => await CreateUnitPattern(evt));
  // ____________________________________________________________ Паттерны сотрудников

  // ____________________________________________________________ Типы техники
  document
    .querySelector("#butt-create-vktype")
    .addEventListener("click", async (evt) => await CreateVKType(evt));
  // ____________________________________________________________ Типы техники

  // ____________________________________________________________ Техника
  document
    .querySelector("#butt-create-vk")
    .addEventListener("click", async (evt) => await CreateVK(evt));

  document
    .querySelector("#butt-show-vk")
    .addEventListener("click", async (evt) => {
      evt.preventDefault();

      await showVK();
    });

  document
    .querySelector("#butt-show-report-vkmoving-tounit")
    .addEventListener("click", async (evt) => await ShowVKMovingToUnit(evt));
  // ____________________________________________________________ Техника

  // ____________________________________________________________ Подразделения
  document
    .querySelector("#butt-create-unit")
    .addEventListener("click", async (evt) => await CreateUnit(evt));

  document.querySelector("#butt-show-unit").addEventListener("click", (evt) => {
    evt.preventDefault();

    showUnit();
  });

  document
    .querySelector("#butt-show-report-vk-tounit-date")
    .addEventListener("click", async (evt) => await ShowVKToUnitDate(evt));

  document
    .querySelector("#butt-show-report-vk-tounit-mol-date")
    .addEventListener("click", async (evt) => await ShowVKToUnitMolDate(evt));

  document
    .querySelector("#butt-show-report-quantvk-tounit-date")
    .addEventListener("click", async (evt) => await ShowQuantVKToUnitDate(evt));
  // ____________________________________________________________ Подразделения

  // ____________________________________________________________ Комнаты
  document
    .querySelector("#butt-create-unitroom")
    .addEventListener("click", async (evt) => await CreateUnitRoom(evt));
  // ____________________________________________________________ Комнаты

  // ____________________________________________________________ Перемещение техники
  document
    .querySelector("#butt-move-VKToUnit")
    .addEventListener("click", async (evt) => await MoveVKToUnit(evt));

  document
    .querySelector("#butt-show-report-vktounit")
    .addEventListener("click", async (evt) => {
      evt.preventDefault();

      if (statusVKToUnitShow == 0) await showVKToUnit("all");
      else if (statusVKToUnitShow == 1) await showVKToUnit("five");
      else if (statusVKToUnitShow == 2) await showVKToUnit("ten");
    });
  // ____________________________________________________________ Перемещение техники
};

function DisplayShowCondition(selectorCondition) {
  document
    .querySelectorAll("section")
    .forEach((htmlElement) => (htmlElement.style.display = "none"));

  document.querySelector(selectorCondition).style.display = "block";

  statusReadCreate = 0;
  idReadCreate = 0;
  statusVKToUnitShow = 0;

  switch (selectorCondition) {
    case "#condition-vktype":
      showVKType();
      break;
    case "#condition-vk":
      showVK();
      break;
    case "#condition-worker":
      showWorker();
      break;
    case "#condition-unit":
      showUnit();
      break;
    case "#condition-unitpattern":
      showUnitPattern();
      break;
    case "#condition-unitroom":
      showUnitRoom();
      break;
    case "#condition-vktounit":
      showVKToUnit("five");
      break;
  }
}

// показать тип техники
async function showVKType() {
  const [rowsVKType] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from vktype");

  let displayPrint = `
  <table style="font-size: 14px;">
    <thead>
      <tr>
        <th>ID</th>
        <th>Название типа</th>
      </tr>
    </thead>
    <tbody>
  `;

  if (rowsVKType.length) {
    for (let i = 0; i < rowsVKType.length; i++) {
      displayPrint += `
      <tr>
        <td>${rowsVKType[i]["ID"]} | <button onclick="DeleteVKType(${rowsVKType[i]["ID"]})">X</button><button onclick="modeReadVKType(${rowsVKType[i]["ID"]})">R</button></td>
        <td>${rowsVKType[i]["Name"]}</td>
      </tr>
      `;
    }
  } else {
    displayPrint += `
    <tr>
      <td colspan="2">Нет информации для вывода</td>
    </tr>
    `;
  }

  displayPrint += `
    </tbody>
  </table>
  `;

  document.querySelector("#condition-vktype .display-print").innerHTML =
    displayPrint;

  statusReadCreate = 0;

  document.querySelector("#butt-create-vktype").innerHTML = "Создать";
  document.querySelector("#condition-vktype h2").innerHTML =
    "Создать новый тип";
}

// создать / редактировать тип техники
async function CreateVKType(evt) {
  evt.preventDefault();

  let vkType = document.querySelector("#input-vktype-vktype-create").value;

  if (statusReadCreate == 0 /* создать */) {
    await remote
      .getGlobal("connectMySQL")
      .execute(`insert into vktype (Name) values ('${vkType}')`);
  } else if (statusReadCreate == 1 /* изменить */) {
    if (idReadCreate == 0) {
      window.alert("Не выбран тип техники");
      return;
    }
    await remote
      .getGlobal("connectMySQL")
      .execute(
        `UPDATE vktype SET Name = '${vkType}' WHERE ID = ${idReadCreate}`
      );
  }

  await showVKType();
}

// измененить тип на создание или редактирование
async function modeReadVKType(unitPatternID) {
  if (idReadCreate !== unitPatternID) {
    idReadCreate = unitPatternID;

    statusReadCreate = 1;

    document.querySelector("#butt-create-vktype").innerHTML = "Изменить";
    document.querySelector(
      "#condition-vktype h2"
    ).innerHTML = `Изменить тип ID: ${unitPatternID}`;
  } else {
    statusReadCreate = !statusReadCreate;

    if (statusReadCreate == 0) {
      document.querySelector("#butt-create-vktype").innerHTML = "Создать";
      document.querySelector("#condition-vktype h2").innerHTML =
        "Создать новый тип";
    } else if (statusReadCreate == 1) {
      document.querySelector("#butt-create-vktype").innerHTML = "Изменить";
      document.querySelector(
        "#condition-vktype h2"
      ).innerHTML = `Изменить тип техники ID: ${unitPatternID}`;
    }
  }
}

// удалить тип техники
async function DeleteVKType(vkTypeID) {
  const [rowsVK] = await remote
    .getGlobal("connectMySQL")
    .execute(`SELECT * FROM vk WHERE TypeID = ${vkTypeID}`);

  if (rowsVK.length) {
    let tempAllIDsVK = [];

    for (let i = 0; i < rowsVK.length; i++) {
      tempAllIDsVK.push(rowsVK[i]["ID"]);
    }

    for (let i = 0; i < tempAllIDsVK.length; i++) {
      const [rowsVKToUnit] = await remote
        .getGlobal("connectMySQL")
        .execute(`SELECT * FROM vktounit WHERE VKID = ${tempAllIDsVK[i]}`);

      if (rowsVKToUnit.length) {
        for (let j = 0; j < rowsVKToUnit.length; j++) {
          await remote
            .getGlobal("connectMySQL")
            .execute(
              `DELETE FROM vktounit WHERE ID = ${rowsVKToUnit[j]["ID"]}`
            );
        }
      }

      await remote
        .getGlobal("connectMySQL")
        .execute(`DELETE FROM vk WHERE ID = ${tempAllIDsVK[i]}`);
    }
  }

  await remote
    .getGlobal("connectMySQL")
    .execute(`DELETE FROM vktype WHERE ID = ${vkTypeID}`);

  await showVKType();
}

// показать технику
async function showVK() {
  const [rowsVK] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from vk");

  [rowsAllTypeVK] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from vktype");

  document.querySelector("#input-DatePurchase-vk-create").placeholder =
    moment().format("YYYY-MM-DD");

  document.querySelector("#input-DatePurchase-vk-create").value =
    moment().format("YYYY-MM-DD");

  for (
    let i =
      document.querySelector("select[name=FromVKTypeVKCrt]").options.length - 1;
    i >= 0;
    i--
  ) {
    document.querySelector("select[name=FromVKTypeVKCrt]").options[i] = null;
  } // Очищаем выпадающие списки

  if (rowsAllTypeVK.length) {
    for (let j = 0; j < rowsAllTypeVK.length; j++) {
      let newOption1 = new Option(
        rowsAllTypeVK[j]["Name"],
        rowsAllTypeVK[j]["ID"]
      );

      document.querySelector("select[name=FromVKTypeVKCrt]").options[
        document.querySelector("select[name=FromVKTypeVKCrt]").length
      ] = newOption1;
    }
  }

  let displayPrint = `
    <table style="font-size: 14px;">
      <thead>
        <tr>
          <th>ID</th>
          <th>Название техники</th>
          <th>Модель</th>
          <th>Дата прихода</th>
          <th>Цена</th>
          <th>Тип техники</th>
        </tr>
      </thead>
      <tbody>
    `;

  if (rowsVK.length) {
    for (let i = 0; i < rowsVK.length; i++) {
      let tempNameVKType = "";

      for (let j = 0; j < rowsAllTypeVK.length; j++) {
        if (rowsAllTypeVK[j]["ID"] === rowsVK[i]["TypeID"])
          tempNameVKType = rowsAllTypeVK[j]["Name"];
      }

      displayPrint += `
      <tr>
        <td>${rowsVK[i]["ID"]} | <button onclick="DeleteVK(${
        rowsVK[i]["ID"]
      })">X</button><button onclick="modeReadVK(${
        rowsVK[i]["ID"]
      })">R</button></td>
        <td>${rowsVK[i]["Name"]}</td>
        <td>${rowsVK[i]["Model"]}</td>
        <td>${moment(rowsVK[i]["DatePurchase"]).format("YYYY-MM-DD")}</td>
        <td>${rowsVK[i]["Cost"]}</td>
        <td>${tempNameVKType}</td>
      </tr>
      `;
    }
  } else {
    displayPrint += `
    <tr>
      <td colspan="6">Нет информации для вывода</td>
    </tr>
    `;
  }

  displayPrint += `
    </tbody>
  </table>
  `;

  document.querySelector("#condition-vk .display-print").innerHTML =
    displayPrint;

  document.querySelector("#butt-create-vk").innerHTML = "Создать";
  statusReadCreate = 0;
  document.querySelector("#condition-vk h2").innerHTML =
    "Создать новую технику";
}

async function ShowVKMovingToUnit(evt) {
  evt.preventDefault();

  if (idReadCreate === 0) {
    window.alert("Не выбрана техника");
    return;
  }

  document.querySelector("form[name=formFromCreateVK] h2").innerHTML =
    "ОТЧЕТ: Все движения техники ID: " + idReadCreate + " по подразделениям";

  const [rowsAllVKMovingToUnit] = await remote
    .getGlobal("connectMySQL")
    .execute(
      `SELECT vk.Name as 'Техника', unit.Name as 'Подразделение', vktounit.DateTransfer as 'Дата получения' FROM unit LEFT JOIN unitroom ON unitroom.UnitID = unit.ID LEFT JOIN vktounit ON vktounit.RoomID = unitroom.ID LEFT JOIN vk ON vk.ID = vktounit.VKID where vk.id = ${idReadCreate} order by vktounit.DateTransfer`
    );

  let displayPrint = `
  <table style="font-size: 14px;">
    <thead>
      <tr>
        <th>Техника</th>
        <th>Подразделение</th>
        <th>Дата получения</th>
      </tr>
    </thead>
    <tbody>
  `;

  if (rowsAllVKMovingToUnit.length) {
    for (let i = 0; i < rowsAllVKMovingToUnit.length; i++) {
      displayPrint += `
      <tr>
        <td>${rowsAllVKMovingToUnit[i]["Техника"]}</td>
        <td>${rowsAllVKMovingToUnit[i]["Подразделение"]}</td>
        <td>${moment(rowsAllVKMovingToUnit[i]["Дата получения"]).format(
          "YYYY-MM-DD"
        )}</td>
      </tr>
      `;
    }
  } else {
    displayPrint += `
    <tr>
      <td colspan="3">Нет информации для вывода</td>
    </tr>
    `;
  }

  displayPrint += `
    </tbody>
  </table>
  `;

  document.querySelector("#condition-vk .display-print").innerHTML =
    displayPrint;
}

async function DeleteVK(vkID) {
  const [rowsVKToUnit] = await remote
    .getGlobal("connectMySQL")
    .execute(`SELECT * FROM vktounit WHERE VKID = ${vkID}`);

  if (rowsVKToUnit.length) {
    for (let j = 0; j < rowsVKToUnit.length; j++) {
      await remote
        .getGlobal("connectMySQL")
        .execute(`DELETE FROM vktounit WHERE ID = ${rowsVKToUnit[j]["ID"]}`);
    }
  }
  await remote
    .getGlobal("connectMySQL")
    .execute(`DELETE FROM vk WHERE ID = ${vkID}`);

  await showVK();
}

async function modeReadVK(vkID) {
  if (idReadCreate !== vkID) {
    idReadCreate = vkID;
    statusReadCreate = 1;
    document.querySelector("#butt-create-vk").innerHTML = "Изменить";
    document.querySelector(
      "#condition-vk h2"
    ).innerHTML = `Изменить тип техники ID: ${vkID}`;
  } else {
    statusReadCreate = !statusReadCreate;
    if (statusReadCreate == 0) {
      document.querySelector("#butt-create-vk").innerHTML = "Создать";
      document.querySelector("#condition-vk h2").innerHTML =
        "Создать новую технику";
    } else if (statusReadCreate == 1) {
      document.querySelector("#butt-create-vk").innerHTML = "Изменить";
      document.querySelector(
        "#condition-vk h2"
      ).innerHTML = `Изменить технику ID: ${vkID}`;
    }
  }
}

async function CreateVK(evt) {
  evt.preventDefault();

  let nameVK = document.querySelector("#input-name-vk-create").value;
  let modelVK = document.querySelector("#input-model-vk-create").value;
  let datePurchaseVK = document.querySelector(
    "#input-DatePurchase-vk-create"
  ).value;
  let costVK = document.querySelector("#input-cost-vk-create").value;

  let indexTypeVKVK = document.querySelector("select[name=FromVKTypeVKCrt]")
    .options.selectedIndex;
  let valueTypeVKVK = document.querySelector("select[name=FromVKTypeVKCrt]")
    .options[indexTypeVKVK].value;

  if (statusReadCreate == 0 /* создать */) {
    await remote
      .getGlobal("connectMySQL")
      .execute(
        `INSERT INTO vk (Name, Model, DatePurchase, Cost, TypeID) VALUES ('${nameVK}', '${modelVK}', '${datePurchaseVK}', '${costVK}', '${valueTypeVKVK}')`
      );
  } else if (statusReadCreate == 1 /* изменить */) {
    if (idReadCreate == 0) {
      window.alert("Не выбрана техника");
      return;
    }

    await remote
      .getGlobal("connectMySQL")
      .execute(
        `update vk set Name = '${nameVK}', Model = '${modelVK}', DatePurchase = '${datePurchaseVK}', Cost = '${costVK}', TypeID = '${valueTypeVKVK}' where id = ${idReadCreate}`
      );
  }

  await showVK();
}

// показать сотрудников
async function showWorker() {
  const [rowsWorker] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from worker");

  let displayPrint = `
  <table style="font-size: 14px;">
    <thead>
      <tr>
        <th>ID</th>
        <th>ФИО</th>
      </tr>
    </thead>
    <tbody>
  `;

  if (rowsWorker.length) {
    for (let i = 0; i < rowsWorker.length; i++) {
      displayPrint += `
      <tr>
        <td>${rowsWorker[i]["ID"]} | <button onclick="DeleteWorker(${rowsWorker[i]["ID"]})">X</button><button onclick="modeReadWorker(${rowsWorker[i]["ID"]})">R</button></td>
        <td>${rowsWorker[i]["FIO"]}</td>
      </tr>
      `;
    }
  } else {
    displayPrint += `
    <tr>
      <td colspan="2">Нет информации для вывода</td>
    </tr>
    `;
  }

  displayPrint += `
    </tbody>
  </table>
  `;

  document.querySelector("#condition-worker .display-print").innerHTML =
    displayPrint;

  statusReadCreate = 0;

  document.querySelector("#butt-create-worker").innerHTML = "Создать";
  document.querySelector("#condition-worker h2").innerHTML =
    "Создать нового сотрудника";
}

async function ShowBossUnit(evt) {
  evt.preventDefault();

  const [rowsAllBossUnit] = await remote
    .getGlobal("connectMySQL")
    .execute(
      `SELECT  unit.Name as 'Подразделение', worker.FIO as 'Сотрудник' FROM unitpattern LEFT JOIN worker ON worker.ID = unitpattern.WorkerID  LEFT JOIN unit ON unit.ID = unitpattern.UnitID where unitpattern.IsBoss = 1`
    );

  let displayPrint = `
  <table style="font-size: 14px;">
    <thead>
      <tr>
        <th>Подразделение</th>
        <th>Сотрудник</th>
      </tr>
    </thead>
    <tbody>
  `;

  if (rowsAllBossUnit.length) {
    for (let i = 0; i < rowsAllBossUnit.length; i++) {
      displayPrint += `
      <tr>
        <td>${rowsAllBossUnit[i]["Подразделение"]}</td>
        <td>${rowsAllBossUnit[i]["Сотрудник"]}</td>
      </tr>
      `;
    }
  } else {
    displayPrint += `
    <tr>
      <td colspan="2">Нет информации для вывода</td>
    </tr>
    `;
  }

  displayPrint += `
    </tbody>
  </table>
  `;

  document.querySelector("#condition-worker .display-print").innerHTML =
    displayPrint;
}

// создать / редактировать сотрудника
async function CreateWorker(evt) {
  evt.preventDefault();

  let fioWorker = document.querySelector("#input-fio-worker-create").value;

  if (statusReadCreate == 0 /* создать */) {
    await remote
      .getGlobal("connectMySQL")
      .execute(`insert into worker (FIO) values ('${fioWorker}')`);
  } else if (statusReadCreate == 1 /* изменить */) {
    if (idReadCreate == 0) {
      window.alert("Не выбран сотрудник");
      return;
    }
    await remote
      .getGlobal("connectMySQL")
      .execute(
        `update worker set FIO = '${fioWorker}' where id = ${idReadCreate}`
      );
  }

  await showWorker();
}

// измененить тип на создание или редактирование
async function modeReadWorker(workerID) {
  if (idReadCreate !== workerID) {
    idReadCreate = workerID;

    statusReadCreate = 1;

    document.querySelector("#butt-create-worker").innerHTML = "Изменить";
    document.querySelector(
      "#condition-worker h2"
    ).innerHTML = `Изменить сотрудника ID: ${workerID}`;
  } else {
    statusReadCreate = !statusReadCreate;

    if (statusReadCreate == 0) {
      document.querySelector("#butt-create-worker").innerHTML = "Создать";
      document.querySelector("#condition-worker h2").innerHTML =
        "Создать нового сотрудника";
    } else if (statusReadCreate == 1) {
      document.querySelector("#butt-create-worker").innerHTML = "Изменить";
      document.querySelector(
        "#condition-worker h2"
      ).innerHTML = `Изменить сотрудника ID: ${workerID}`;
    }
  }
}

// удалить сотрудника
async function DeleteWorker(workerID) {
  const [rowsUnitPattern] = await remote
    .getGlobal("connectMySQL")
    .execute(`SELECT * FROM unitpattern WHERE WorkerID = ${workerID}`);

  if (rowsUnitPattern.length) {
    await remote
      .getGlobal("connectMySQL")
      .execute(
        `DELETE FROM unitpattern WHERE ID = ${rowsUnitPattern[0]["ID"]}`
      );
  }

  await remote
    .getGlobal("connectMySQL")
    .execute(`DELETE FROM worker WHERE ID = ${workerID}`);

  await showWorker();
}

// показать подразделения
async function showUnit() {
  const [rowsUnit] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from unit");

  let displayPrint = `
  <table style="font-size: 14px;">
    <thead>
      <tr>
        <th>ID</th>
        <th>Номер</th>
        <th>Название</th>
        <th>Сокращение</th>
      </tr>
    </thead>
    <tbody>
  `;

  if (rowsUnit.length) {
    for (let i = 0; i < rowsUnit.length; i++) {
      displayPrint += `
      <tr>
        <td>${rowsUnit[i]["ID"]} | <button onclick="DeleteUnit(${rowsUnit[i]["ID"]})">X</button><button onclick="modeReadUnit(${rowsUnit[i]["ID"]})">R</button></td>
        <td>${rowsUnit[i]["Number"]}</td>
        <td>${rowsUnit[i]["Name"]}</td>
        <td>${rowsUnit[i]["NameShort"]}</td>
      </tr>
      `;
    }
  } else {
    displayPrint += `
    <tr>
      <td colspan="4">Нет информации для вывода</td>
    </tr>
    `;
  }

  displayPrint += `
    </tbody>
  </table>
  `;

  document.querySelector("#condition-unit .display-print").innerHTML =
    displayPrint;

  statusReadCreate = 0;

  document.querySelector("#butt-create-unit").innerHTML = "Создать";
  document.querySelector("#condition-unit h2").innerHTML =
    "Создать новое подразделение";
  document.querySelector("form[name=formFromCreateUnit] h2").innerHTML =
    "ОТЧЕТ: Покажет всю технику в подразделении на дату";

  document.querySelector("#input-date-showvk-tounit").value =
    moment().format("YYYY-MM-DD");
  document.querySelector("#input-date-showvk-tounit").placeholder =
    moment().format("YYYY-MM-DD");
}

async function ShowVKToUnitDate(evt) {
  evt.preventDefault();

  if (idReadCreate === 0) {
    window.alert("Не выбрано подразделение");
    return;
  }

  let tempDate = document.querySelector("#input-date-showvk-tounit").value;

  document.querySelector("form[name=formFromCreateUnit] h2").innerHTML =
    "ОТЧЕТ: Покажет всю технику в подразделении ID: " +
    idReadCreate +
    " на дату: " +
    tempDate;

  await remote
    .getGlobal("connectMySQL")
    .execute(`set @DateTransfer = '${tempDate}';`);

  const [rowsAllVKToUnitDate] = await remote
    .getGlobal("connectMySQL")
    .execute(
      `SELECT unit.Name as 'Подразделение', unitroom.Name as 'Комната', vktounit.DateTransfer as 'Дата перемещения', vk.Name as 'Техника', vktype.Name as 'Тип техники', vk.Cost as 'Стоимость' FROM unit INNER JOIN unitroom ON unit.ID = unitroom.UnitID INNER JOIN vktounit ON unitroom.ID = vktounit.RoomID and vktounit.DateTransfer = (SELECT max(vu.DateTransfer) from vktounit as vu where vu.VKID = vktounit.VKID and vu.DateTransfer <= @DateTransfer) INNER JOIN vk ON vk.ID = vktounit.VKID INNER JOIN vktype ON vktype.ID = vk.TypeID where 1 = 1 and unit.ID = ${idReadCreate} and vktounit.DateTransfer <= @DateTransfer order by unit.Name, unitroom.Name, vktounit.DateTransfer;`
    );

  let displayPrint = `
  <table style="font-size: 14px;">
    <thead>
      <tr>
        <th>Подразделение</th>
        <th>Комната</th>
        <th>Дата перемещения</th>
        <th>Техника</th>
        <th>Тип техники</th>
        <th>Стоимость</th>
      </tr>
    </thead>
    <tbody>
  `;

  if (rowsAllVKToUnitDate.length) {
    for (let i = 0; i < rowsAllVKToUnitDate.length; i++) {
      displayPrint += `
      <tr>
        <td>${rowsAllVKToUnitDate[i]["Подразделение"]}</td>
        <td>${rowsAllVKToUnitDate[i]["Комната"]}</td>
        <td>${moment(rowsAllVKToUnitDate[i]["Дата перемещения"]).format(
          "YYYY-MM-DD"
        )}</td>
        <td>${rowsAllVKToUnitDate[i]["Техника"]}</td>
        <td>${rowsAllVKToUnitDate[i]["Тип техники"]}</td>
        <td>${rowsAllVKToUnitDate[i]["Стоимость"]}</td>
      </tr>
      `;
    }
  } else {
    displayPrint += `
    <tr>
      <td colspan="6">Нет информации для вывода</td>
    </tr>
    `;
  }

  displayPrint += `
    </tbody>
  </table>
  `;

  document.querySelector("#condition-unit .display-print").innerHTML =
    displayPrint;
}

async function ShowVKToUnitMolDate(evt) {
  evt.preventDefault();

  if (idReadCreate === 0) {
    window.alert("Не выбрано подразделение");
    return;
  }

  let tempDate = document.querySelector("#input-date-showvk-tounit").value;

  document.querySelector("form[name=formFromCreateUnit] h2").innerHTML =
    "ОТЧЕТ: Покажет всю технику в подразделении ID: " +
    idReadCreate +
    " на дату: " +
    tempDate +
    " + Материально-ответственное лицо";

  await remote
    .getGlobal("connectMySQL")
    .execute(`set @DateTransfer = '${tempDate}';`);

  const [rowsAllVKToUnitMOLDate] = await remote
    .getGlobal("connectMySQL")
    .execute(
      `SELECT unit.Name as 'Подразделение', unitroom.Name as 'Комната', worker.FIO as 'Материально-ответственное лицо', vktounit.DateTransfer as 'Дата перемещения', vk.Name as 'Техника', vktype.Name as 'Тип техники', vk.Cost as 'Стоимость' FROM unit INNER JOIN unitroom ON unit.ID = unitroom.UnitID INNER JOIN vktounit ON unitroom.ID = vktounit.RoomID and vktounit.DateTransfer = (SELECT max(vu.DateTransfer) from vktounit as vu where vu.VKID = vktounit.VKID and vu.DateTransfer <= @DateTransfer) INNER JOIN vk ON vk.ID = vktounit.VKID INNER JOIN vktype ON vktype.ID = vk.TypeID INNER JOIN unitpattern ON unit.ID = unitpattern.UnitID INNER JOIN worker ON worker.ID = unitpattern.ID where unit.ID = ${idReadCreate} and vktounit.DateTransfer <= @DateTransfer and unitpattern.IsMOL = 1 order by unit.Name, unitroom.Name, worker.FIO, vktounit.DateTransfer`
    );

  let displayPrint = `
  <table style="font-size: 14px;">
    <thead>
      <tr>
        <th>Подразделение</th>
        <th>Комната</th>
        <th>Материально-ответственное лицо</th>
        <th>Дата перемещения</th>
        <th>Техника</th>
        <th>Тип техники</th>
        <th>Стоимость</th>
      </tr>
    </thead>
    <tbody>
  `;

  if (rowsAllVKToUnitMOLDate.length) {
    for (let i = 0; i < rowsAllVKToUnitMOLDate.length; i++) {
      displayPrint += `
      <tr>
        <td>${rowsAllVKToUnitMOLDate[i]["Подразделение"]}</td>
        <td>${rowsAllVKToUnitMOLDate[i]["Комната"]}</td>
        <td>${rowsAllVKToUnitMOLDate[i]["Материально-ответственное лицо"]}</td>
        <td>${moment(rowsAllVKToUnitMOLDate[i]["Дата перемещения"]).format(
          "YYYY-MM-DD"
        )}</td>
        <td>${rowsAllVKToUnitMOLDate[i]["Техника"]}</td>
        <td>${rowsAllVKToUnitMOLDate[i]["Тип техники"]}</td>
        <td>${rowsAllVKToUnitMOLDate[i]["Стоимость"]}</td>
      </tr>
      `;
    }
  } else {
    displayPrint += `
    <tr>
      <td colspan="7">Нет информации для вывода</td>
    </tr>
    `;
  }

  displayPrint += `
    </tbody>
  </table>
  `;

  document.querySelector("#condition-unit .display-print").innerHTML =
    displayPrint;
}

async function ShowQuantVKToUnitDate(evt) {
  evt.preventDefault();

  if (idReadCreate === 0) {
    window.alert("Не выбрано подразделение");
    return;
  }

  let tempDate = document.querySelector("#input-date-showvk-tounit").value;

  document.querySelector("form[name=formFromCreateUnit] h2").innerHTML =
    "ОТЧЕТ: Покажет количество техники в подразделении ID: " +
    idReadCreate +
    " на дату: " +
    tempDate;

  await remote
    .getGlobal("connectMySQL")
    .execute(`set @DateTransfer = '${tempDate}';`);

  const [rowsAllQuantVKToUnitDate] = await remote
    .getGlobal("connectMySQL")
    .execute(
      `select unit.Name as 'Имя подразделения', vktype.Name as 'Имя типа', COUNT(*) as kolvo
      from unit
      inner JOIN unitroom on unitroom.UnitID = unit.ID
      INNER JOIN vktounit on  vktounit.RoomID = unitroom.ID
      and vktounit.DateTransfer = (SELECT max(vu.DateTransfer) from vktounit as vu where vu.VKID = vktounit.VKID and vu.DateTransfer <= @DateTransfer)
      INNER join vk on vk.ID = vktounit.VKID
      INNER join vktype on vktype.ID = vk.TypeID
      where vktounit.DateTransfer <= @DateTransfer
      and unit.id = ${idReadCreate}
      GROUP by unit.Name, vktype.Name
      order by unit.Name, vktype.Name`
    );

  let displayPrint = `
    <table style="font-size: 14px;">
      <thead>
        <tr>
          <th>Имя подразделения</th>
          <th>Имя типа</th>
          <th>Колличество</th>
        </tr>
      </thead>
      <tbody>
    `;

  if (rowsAllQuantVKToUnitDate.length) {
    for (let i = 0; i < rowsAllQuantVKToUnitDate.length; i++) {
      displayPrint += `
        <tr>
          <td>${rowsAllQuantVKToUnitDate[i]["Имя подразделения"]}</td>
          <td>${rowsAllQuantVKToUnitDate[i]["Имя типа"]}</td>
          <td>${rowsAllQuantVKToUnitDate[i]["kolvo"]}</td>
        </tr>
        `;
    }
  } else {
    displayPrint += `
      <tr>
        <td colspan="3">Нет информации для вывода</td>
      </tr>
      `;
  }

  displayPrint += `
    </tbody>
  </table>
  `;

  document.querySelector("#condition-unit .display-print").innerHTML =
    displayPrint;
}

async function CreateUnit(evt) {
  evt.preventDefault();

  let numberUnit = document.querySelector("#input-number-unit-create").value;
  let nameUnit = document.querySelector("#input-name-unit-create").value;
  let nameShortUnit = document.querySelector(
    "#input-NameShort-unit-create"
  ).value;

  if (statusReadCreate == 0 /* создать */) {
    await remote
      .getGlobal("connectMySQL")
      .execute(
        `insert into unit (Number, Name, NameShort) values ('${numberUnit}', '${nameUnit}', '${nameShortUnit}')`
      );
  } else if (statusReadCreate == 1 /* изменить */) {
    if (idReadCreate == 0) {
      window.alert("Не выбрано подразделение");
      return;
    }
    await remote
      .getGlobal("connectMySQL")
      .execute(
        `update unit set Number = '${numberUnit}', Name = '${nameUnit}', NameShort = '${nameShortUnit}' where id = ${idReadCreate}`
      );
  }

  await showUnit();
}

async function modeReadUnit(unitID) {
  if (idReadCreate !== unitID) {
    idReadCreate = unitID;

    statusReadCreate = 1;

    document.querySelector("#butt-create-unit").innerHTML = "Изменить";
    document.querySelector(
      "#condition-unit h2"
    ).innerHTML = `Изменить подразделение ID: ${unitID}`;
  } else {
    statusReadCreate = !statusReadCreate;

    if (statusReadCreate == 0) {
      document.querySelector("#butt-create-unit").innerHTML = "Создать";
      document.querySelector("#condition-unit h2").innerHTML =
        "Создать новое подразделение";
    } else if (statusReadCreate == 1) {
      document.querySelector("#butt-create-unit").innerHTML = "Изменить";
      document.querySelector(
        "#condition-unit h2"
      ).innerHTML = `Изменить подразделение ID: ${unitID}`;
    }
  }
}

async function DeleteUnit(unitID) {
  const [rowsUnitPattern] = await remote
    .getGlobal("connectMySQL")
    .execute(`SELECT * FROM unitpattern WHERE UnitID = ${unitID}`);

  if (rowsUnitPattern.length) {
    let tempAllIDsUnitPattern = [];

    for (let i = 0; i < rowsUnitPattern.length; i++) {
      tempAllIDsUnitPattern.push(rowsUnitPattern[i]["ID"]);
    }

    for (let i = 0; i < tempAllIDsUnitPattern.length; i++) {
      await remote
        .getGlobal("connectMySQL")
        .execute(
          `DELETE FROM unitpattern WHERE ID = ${tempAllIDsUnitPattern[i]}`
        );
    }
  }

  const [rowsUnitRoom] = await remote
    .getGlobal("connectMySQL")
    .execute(`SELECT * FROM unitroom WHERE UnitID = ${unitID}`);

  if (rowsUnitRoom.length) {
    let tempAllIDsUnitRoom = [];

    for (let i = 0; i < rowsUnitRoom.length; i++) {
      tempAllIDsUnitRoom.push(rowsUnitRoom[i]["ID"]);
    }

    for (let i = 0; i < tempAllIDsUnitRoom.length; i++) {
      const [rowsVKToUnit] = await remote
        .getGlobal("connectMySQL")
        .execute(
          `SELECT * FROM vktounit WHERE RoomID = ${tempAllIDsUnitRoom[i]}`
        );

      if (rowsVKToUnit.length) {
        let tempAllIDsVKToUnit = [];

        for (let j = 0; j < rowsVKToUnit.length; j++) {
          tempAllIDsVKToUnit.push(rowsVKToUnit[j]["ID"]);
        }

        for (let j = 0; j < tempAllIDsVKToUnit.length; j++) {
          await remote
            .getGlobal("connectMySQL")
            .execute(
              `DELETE FROM vktounit WHERE ID = ${tempAllIDsVKToUnit[j]}`
            );
        }
      }

      await remote
        .getGlobal("connectMySQL")
        .execute(`DELETE FROM unitroom WHERE ID = ${tempAllIDsUnitRoom[i]}`);
    }
  }

  await remote
    .getGlobal("connectMySQL")
    .execute(`DELETE FROM unit WHERE ID = ${unitID}`);

  await showUnit();
}

// показать принадлежность сотрудников
async function showUnitPattern() {
  const [rowsUnitPattern] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from unitpattern");

  [rowsAllUnit] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from unit");

  [rowsAllWorker] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from worker");

  for (
    let i =
      document.querySelector("select[name=FromUnitUnitPatternCrt]").options
        .length - 1;
    i >= 0;
    i--
  ) {
    document.querySelector("select[name=FromUnitUnitPatternCrt]").options[i] =
      null;
  } // Очищаем выпадающие списки

  if (rowsAllUnit.length) {
    for (let j = 0; j < rowsAllUnit.length; j++) {
      let newOption1 = new Option(rowsAllUnit[j]["Name"], rowsAllUnit[j]["ID"]);

      document.querySelector("select[name=FromUnitUnitPatternCrt]").options[
        document.querySelector("select[name=FromUnitUnitPatternCrt]").length
      ] = newOption1;
    }
  }

  for (
    let i =
      document.querySelector("select[name=FromWorkerUnitPatternCrt]").options
        .length - 1;
    i >= 0;
    i--
  ) {
    document.querySelector("select[name=FromWorkerUnitPatternCrt]").options[i] =
      null;
  } // Очищаем выпадающие списки

  if (rowsAllWorker.length) {
    for (let j = 0; j < rowsAllWorker.length; j++) {
      let newOption1 = new Option(
        rowsAllWorker[j]["FIO"],
        rowsAllWorker[j]["ID"]
      );

      document.querySelector("select[name=FromWorkerUnitPatternCrt]").options[
        document.querySelector("select[name=FromWorkerUnitPatternCrt]").length
      ] = newOption1;
    }
  }

  let displayPrint = `
  <table style="font-size: 14px;">
    <thead>
      <tr>
        <th>ID</th>
        <th>Подразделение</th>
        <th>Должность</th>
        <th>Сотрудник</th>
        <th>Босс</th>
        <th>Матер.отвец.</th>
      </tr>
    </thead>
    <tbody>
  `;

  if (rowsUnitPattern.length) {
    for (let i = 0; i < rowsUnitPattern.length; i++) {
      let tempUnitName = "";
      let tempWorkerFIO = "";
      let tempBossStatus = "";
      let tempMOL = "";

      for (let j = 0; j < rowsAllUnit.length; j++) {
        if (rowsAllUnit[j]["ID"] === rowsUnitPattern[i]["UnitID"])
          tempUnitName = rowsAllUnit[j]["Name"];
      }

      for (let j = 0; j < rowsAllWorker.length; j++) {
        if (rowsAllWorker[j]["ID"] === rowsUnitPattern[i]["WorkerID"])
          tempWorkerFIO = rowsAllWorker[j]["FIO"];
      }

      if (rowsUnitPattern[i]["IsBoss"] === 1) tempBossStatus = "Главный";
      if (rowsUnitPattern[i]["IsMOL"] === 1) tempMOL = "Да";

      displayPrint += `
      <tr>
        <td>${rowsUnitPattern[i]["ID"]} | <button onclick="DeleteUnitPattern(${rowsUnitPattern[i]["ID"]})">X</button><button onclick="modeReadUnitPattern(${rowsUnitPattern[i]["ID"]})">R</button></td>
        <td>${tempUnitName}</td>
        <td>${rowsUnitPattern[i]["Function"]}</td>
        <td>${tempWorkerFIO}</td>
        <td>${tempBossStatus}</td>
        <td>${tempMOL}</td>
      </tr>
      `;
    }
  } else {
    displayPrint += `
    <tr>
      <td colspan="6">Нет информации для вывода</td>
    </tr>
    `;
  }

  displayPrint += `
    </tbody>
  </table>
  `;

  document.querySelector("#condition-unitpattern .display-print").innerHTML =
    displayPrint;

  document.querySelector("#butt-create-unitpattern").innerHTML = "Создать";
  statusReadCreate = 0;
  document.querySelector("#condition-unitpattern h2").innerHTML =
    "Создать новые паттерны сотрудников";
}

// создать / редактировать принадлежность сотрудников
async function CreateUnitPattern(evt) {
  evt.preventDefault();

  let indexUnitUnitPattern = document.querySelector(
    "select[name=FromUnitUnitPatternCrt]"
  ).options.selectedIndex;
  let valueUnitUnitPattern = document.querySelector(
    "select[name=FromUnitUnitPatternCrt]"
  ).options[indexUnitUnitPattern].value;

  let functionUnitPattern = document.querySelector(
    "#input-function-unitpattern-create"
  ).value;

  let indexWorkerUnitPattern = document.querySelector(
    "select[name=FromWorkerUnitPatternCrt]"
  ).options.selectedIndex;
  let valueWorkerUnitPattern = document.querySelector(
    "select[name=FromWorkerUnitPatternCrt]"
  ).options[indexWorkerUnitPattern].value;

  let indexBossUnitPattern = document.querySelector(
    "select[name=FromBossUnitPatternCrt]"
  ).options.selectedIndex;
  let valueBossUnitPattern = document.querySelector(
    "select[name=FromBossUnitPatternCrt]"
  ).options[indexBossUnitPattern].value;

  let indexMOLUnitPattern = document.querySelector(
    "select[name=FromMOLUnitPatternCrt]"
  ).options.selectedIndex;
  let valueMOLUnitPattern = document.querySelector(
    "select[name=FromMOLUnitPatternCrt]"
  ).options[indexMOLUnitPattern].value;

  if (statusReadCreate == 0 /* создать */) {
    await remote
      .getGlobal("connectMySQL")
      .execute(
        `INSERT INTO unitpattern (UnitID, unitpattern.Function, WorkerID, IsBoss, IsMOL) VALUES ('${valueUnitUnitPattern}', '${functionUnitPattern}', '${valueWorkerUnitPattern}', '${valueBossUnitPattern}', '${valueMOLUnitPattern}')`
      );
  } else if (statusReadCreate == 1 /* изменить */) {
    if (idReadCreate == 0) {
      window.alert("Не выбран паттерн сотрудников");
      return;
    }

    await remote
      .getGlobal("connectMySQL")
      .execute(
        `update unitpattern set UnitID = '${valueUnitUnitPattern}', unitpattern.Function = '${functionUnitPattern}', WorkerID = '${valueWorkerUnitPattern}', IsBoss = '${valueBossUnitPattern}', IsMOL = '${valueMOLUnitPattern}' where id = ${idReadCreate}`
      );
  }

  await showUnitPattern();
}

// измененить тип на создание или редактирование
async function modeReadUnitPattern(unitPatternID) {
  if (idReadCreate !== unitPatternID) {
    idReadCreate = unitPatternID;

    statusReadCreate = 1;

    document.querySelector("#butt-create-unitpattern").innerHTML = "Изменить";
    document.querySelector(
      "#condition-unitpattern h2"
    ).innerHTML = `Изменить паттерны сотрудника ID:${unitPatternID}`;
  } else {
    statusReadCreate = !statusReadCreate;
    if (statusReadCreate == 0) {
      document.querySelector("#butt-create-unitpattern").innerHTML = "Создать";
      document.querySelector("#condition-unitpattern h2").innerHTML =
        "Создать новый паттерн сотрудника";
    } else if (statusReadCreate == 1) {
      document.querySelector("#butt-create-unitpattern").innerHTML = "Изменить";
      document.querySelector(
        "#condition-unitpattern h2"
      ).innerHTML = `Изменить паттерны сотрудника ID:${unitPatternID}`;
    }
  }
}

// удалить паттерны сотрудника
async function DeleteUnitPattern(unitPatternID) {
  await remote
    .getGlobal("connectMySQL")
    .execute(`DELETE FROM unitpattern WHERE ID = ${unitPatternID}`);

  await showUnitPattern();
}

// показать комнаты подразделений
async function showUnitRoom() {
  const [rowsUnitRoom] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from unitroom");

  [rowsAllUnit] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from unit");

  for (
    let i =
      document.querySelector("select[name=FromUnitUnitRoom]").options.length -
      1;
    i >= 0;
    i--
  ) {
    document.querySelector("select[name=FromUnitUnitRoom]").options[i] = null;
  } // Очищаем выпадающие списки

  if (rowsAllUnit.length) {
    for (let j = 0; j < rowsAllUnit.length; j++) {
      let newOption1 = new Option(rowsAllUnit[j]["Name"], rowsAllUnit[j]["ID"]);

      document.querySelector("select[name=FromUnitUnitRoom]").options[
        document.querySelector("select[name=FromUnitUnitRoom]").length
      ] = newOption1;
    }
  }

  let displayPrint = `
    <table style="font-size: 14px;">
      <thead>
        <tr>
          <th>ID</th>
          <th>Подразделение</th>
          <th>Название</th>
        </tr>
      </thead>
      <tbody>
    `;

  if (rowsUnitRoom.length) {
    for (let i = 0; i < rowsUnitRoom.length; i++) {
      let tempUnitName = "";

      for (let j = 0; j < rowsAllUnit.length; j++) {
        if (rowsAllUnit[j]["ID"] === rowsUnitRoom[i]["UnitID"])
          tempUnitName = rowsAllUnit[j]["Name"];
      }

      displayPrint += `
        <tr>
          <td>${rowsUnitRoom[i]["ID"]} | <button onclick="DeleteUnitRoom(${rowsUnitRoom[i]["ID"]})">X</button><button onclick="modeReadUnitRoom(${rowsUnitRoom[i]["ID"]})">R</button></td>
          <td>${tempUnitName}</td>
          <td>${rowsUnitRoom[i]["Name"]}</td>
        </tr>
        `;
    }
  } else {
    displayPrint += `
      <tr>
        <td colspan="3">Нет информации для вывода</td>
      </tr>
      `;
  }

  displayPrint += `
      </tbody>
    </table>
    `;

  document.querySelector("#condition-unitroom .display-print").innerHTML =
    displayPrint;

  document.querySelector("#butt-create-unitroom").innerHTML = "Создать";
  statusReadCreate = 0;
  document.querySelector("#condition-unitroom h2").innerHTML =
    "Создать новую комнату";
}

async function DeleteUnitRoom(unitroomID) {
  const [rowsVKToUnit] = await remote
    .getGlobal("connectMySQL")
    .execute(`SELECT * FROM vktounit WHERE RoomID = ${unitroomID}`);

  if (rowsVKToUnit.length) {
    for (let j = 0; j < rowsVKToUnit.length; j++) {
      await remote
        .getGlobal("connectMySQL")
        .execute(`DELETE FROM vktounit WHERE ID = ${rowsVKToUnit[j]["ID"]}`);
    }
  }
  await remote
    .getGlobal("connectMySQL")
    .execute(`DELETE FROM unitroom WHERE ID = ${unitroomID}`);

  await showUnitRoom();
}

async function modeReadUnitRoom(unitroomID) {
  if (idReadCreate !== unitroomID) {
    idReadCreate = unitroomID;

    statusReadCreate = 1;

    document.querySelector("#butt-create-unitroom").innerHTML = "Изменить";
    document.querySelector(
      "#condition-unitroom h2"
    ).innerHTML = `Изменить комнату ID: ${unitroomID}`;
  } else {
    statusReadCreate = !statusReadCreate;
    if (statusReadCreate == 0) {
      document.querySelector("#butt-create-unitroom").innerHTML = "Создать";
      document.querySelector("#condition-unitroom h2").innerHTML =
        "Создать новую комнату";
    } else if (statusReadCreate == 1) {
      document.querySelector("#butt-create-unitroom").innerHTML = "Изменить";
      document.querySelector(
        "#condition-unitroom h2"
      ).innerHTML = `Изменить комнату ID: ${unitroomID}`;
    }
  }
}

async function CreateUnitRoom(evt) {
  evt.preventDefault();

  let indexUnitUnitRoom = document.querySelector(
    "select[name=FromUnitUnitRoom]"
  ).options.selectedIndex;
  let valueUnitUnitRoom = document.querySelector(
    "select[name=FromUnitUnitRoom]"
  ).options[indexUnitUnitRoom].value;

  let nameUnitRoom = document.querySelector(
    "#input-name-unitroom-create"
  ).value;

  if (statusReadCreate == 0 /* создать */) {
    await remote
      .getGlobal("connectMySQL")
      .execute(
        `INSERT INTO unitroom (UnitID, Name) VALUES ('${valueUnitUnitRoom}', '${nameUnitRoom}')`
      );
  } else if (statusReadCreate == 1 /* изменить */) {
    if (idReadCreate == 0) {
      window.alert("Не выбрана комната");
      return;
    }

    await remote
      .getGlobal("connectMySQL")
      .execute(
        `update unitroom set UnitID = '${valueUnitUnitRoom}', Name = '${nameUnitRoom}' where id = ${idReadCreate}`
      );
  }

  await showUnitRoom();
}

// показать все перемещения техники
async function showVKToUnit(reportParam) {
  const [rowsVKToUnit] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from vktounit");

  [rowsAllUnitRoom] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from unitroom");

  [rowsAllUnit] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from unit");

  [rowsAllVK] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from vk");

  for (
    let i =
      document.querySelector("select[name=FromVKNameMove]").options.length - 1;
    i >= 0;
    i--
  ) {
    document.querySelector("select[name=FromVKNameMove]").options[i] = null;
  } // Очищаем выпадающие списки

  if (rowsAllVK.length) {
    for (let j = 0; j < rowsAllVK.length; j++) {
      let newOption1 = new Option(rowsAllVK[j]["Name"], rowsAllVK[j]["ID"]);

      document.querySelector("select[name=FromVKNameMove]").options[
        document.querySelector("select[name=FromVKNameMove]").length
      ] = newOption1;
    }
  }

  document.querySelector("#input-name-date-move").placeholder =
    moment().format("YYYY-MM-DD");

  document.querySelector("#input-name-date-move").value =
    moment().format("YYYY-MM-DD");

  for (
    let i =
      document.querySelector("select[name=FromUnitRoomMove]").options.length -
      1;
    i >= 0;
    i--
  ) {
    document.querySelector("select[name=FromUnitRoomMove]").options[i] = null;
  } // Очищаем выпадающие списки

  if (rowsAllUnitRoom.length) {
    for (let j = 0; j < rowsAllUnitRoom.length; j++) {
      let newOption1 = new Option(
        rowsAllUnitRoom[j]["Name"],
        rowsAllUnitRoom[j]["ID"]
      );

      document.querySelector("select[name=FromUnitRoomMove]").options[
        document.querySelector("select[name=FromUnitRoomMove]").length
      ] = newOption1;
    }
  }

  let displayPrint = `
      <table style="font-size: 14px;">
        <thead>
          <tr>
            <th>ID</th>
            <th>Техника</th>
            <th>Дата перемещения</th>
            <th>Комната : Подразделение</th>
          </tr>
        </thead>
        <tbody>
      `;

  if (rowsVKToUnit.length) {
    let i;

    if (reportParam === "all") {
      document.querySelector("#butt-show-report-vktounit").innerHTML =
        "Последние пять";
      document.querySelector("form[name=formFromMoveVKToUnit] h2").innerHTML =
        "ОТЧЕТ: Показываются все перемещения техники";

      i = 0;

      statusVKToUnitShow = 1;
    } else if (reportParam === "five") {
      document.querySelector("#butt-show-report-vktounit").innerHTML =
        "Показать десять";
      document.querySelector("form[name=formFromMoveVKToUnit] h2").innerHTML =
        "ОТЧЕТ: Показываются последние пять перемещений техники";

      i = rowsVKToUnit.length - 5;

      statusVKToUnitShow = 2;
    } else if (reportParam === "ten") {
      document.querySelector("#butt-show-report-vktounit").innerHTML =
        "Показать все";
      document.querySelector("form[name=formFromMoveVKToUnit] h2").innerHTML =
        "ОТЧЕТ: Показываются последние десять перемещений техники";

      i = rowsVKToUnit.length - 10;

      statusVKToUnitShow = 0;
    }

    for (; i < rowsVKToUnit.length; i++) {
      let tempUnitRoomName = "";
      let tempUnitName = "";
      let tempVKName = "";

      for (let j = 0; j < rowsAllUnitRoom.length; j++) {
        if (rowsVKToUnit[i]["RoomID"] === rowsAllUnitRoom[j]["ID"]) {
          tempUnitRoomName = rowsAllUnitRoom[j]["Name"];
          tempUnitName = rowsAllUnitRoom[j]["UnitID"];

          for (let k = 0; k < rowsAllUnit.length; k++) {
            if (tempUnitName === rowsAllUnit[k]["ID"])
              tempUnitName = rowsAllUnit[k]["Name"];
          }
        }
      }

      for (let j = 0; j < rowsAllVK.length; j++) {
        if (rowsVKToUnit[i]["VKID"] === rowsAllVK[j]["ID"]) {
          tempVKName = rowsAllVK[j]["Name"];
        }
      }

      displayPrint += `
          <tr>
            <td>${rowsVKToUnit[i]["ID"]}</td>
            <td>${tempVKName}</td>
            <td>${moment(rowsVKToUnit[i]["DateTransfer"]).format(
              "YYYY-MM-DD"
            )}</td>
            <td>${tempUnitRoomName} : ${tempUnitName}</td>
          </tr>
          `;
    }
  } else {
    displayPrint += `
        <tr>
          <td colspan="4">Нет информации для вывода</td>
        </tr>
        `;
  }

  displayPrint += `
        </tbody>
      </table>
      `;

  document.querySelector("#condition-vktounit .display-print").innerHTML =
    displayPrint;
}

async function MoveVKToUnit(evt) {
  evt.preventDefault();
  let indexVKNameMove = document.querySelector("select[name=FromVKNameMove]")
    .options.selectedIndex;
  let valueVKNameMove = document.querySelector("select[name=FromVKNameMove]")
    .options[indexVKNameMove].value;

  let dateMove = document.querySelector("#input-name-date-move").value;

  let indexUnitRoomMoveVK = document.querySelector(
    "select[name=FromUnitRoomMove]"
  ).options.selectedIndex;
  let valueUnitRoomMoveVK = document.querySelector(
    "select[name=FromUnitRoomMove]"
  ).options[indexUnitRoomMoveVK].value;

  await remote
    .getGlobal("connectMySQL")
    .execute(
      `insert into vktounit (VKID, DateTransfer, RoomID) values ('${valueVKNameMove}', '${dateMove}', '${valueUnitRoomMoveVK}')`
    );

  await showVKToUnit("five");
}
