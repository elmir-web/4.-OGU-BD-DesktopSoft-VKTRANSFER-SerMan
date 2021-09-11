const remote = require("electron").remote;
let moment = require("moment");

let rowsAllTypeVK = [];
let rowsAllUnit = [];
let rowsAllWorker = [];
let rowsAllUnitRoom = [];
let rowsAllVK = [];

let statusReadCreate = 0;
let idReadCreate = 0;

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
  // ____________________________________________________________ Сотрудники
};

function DisplayShowCondition(selectorCondition) {
  document
    .querySelectorAll("section")
    .forEach((htmlElement) => (htmlElement.style.display = "none"));

  document.querySelector(selectorCondition).style.display = "block";

  statusReadCreate = 0;
  idReadCreate = 0;

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
      showVKToUnit();
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
        <td>${rowsVKType[i]["ID"]}</td>
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
}

// показать технику
async function showVK() {
  const [rowsVK] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from vk");

  [rowsAllTypeVK] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from vktype");

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
      displayPrint += `
      <tr>
        <td>${rowsVK[i]["ID"]}</td>
        <td>${rowsVK[i]["Name"]}</td>
        <td>${rowsVK[i]["Model"]}</td>
        <td>${moment(rowsVK[i]["DatePurchase"]).format("YYYY-MM-DD")}</td>
        <td>${rowsVK[i]["Cost"]}</td>
        <td>${rowsAllTypeVK[rowsVK[i]["TypeID"] - 1]["Name"]}</td>
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
    document.querySelector("#condition-worker h2").innerHTML =
      "Изменить сотрудника";
  } else {
    statusReadCreate = !statusReadCreate;

    if (statusReadCreate == 0) {
      document.querySelector("#butt-create-worker").innerHTML = "Создать";
      document.querySelector("#condition-worker h2").innerHTML =
        "Создать нового сотрудника";
    } else if (statusReadCreate == 1) {
      document.querySelector("#butt-create-worker").innerHTML = "Изменить";
      document.querySelector("#condition-worker h2").innerHTML =
        "Изменить сотрудника";
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
        <td>${rowsUnit[i]["ID"]}</td>
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
}

// показать принадлежность сотрудников
async function showUnitPattern() {
  const [rowsUnitPattern] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from unitpattern");

  [rowsAllUnit] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from unit");

  // продолжить тут
  [rowsAllWorker] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from worker");

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
}

// показать комнаты подразделений
async function showUnitRoom() {
  const [rowsUnitRoom] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from unitroom");

  [rowsAllUnit] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from unit");

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
          <td>${rowsUnitRoom[i]["ID"]}</td>
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
}

// показать все перемещения техники
async function showVKToUnit() {
  const [rowsVKToUnit] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from vktounit");

  [rowsAllUnitRoom] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from unitroom");

  [rowsAllVK] = await remote
    .getGlobal("connectMySQL")
    .execute("select * from vk");

  let displayPrint = `
      <table style="font-size: 14px;">
        <thead>
          <tr>
            <th>ID</th>
            <th>Техника</th>
            <th>Дата перемещения</th>
            <th>Комната</th>
          </tr>
        </thead>
        <tbody>
      `;

  if (rowsVKToUnit.length) {
    for (let i = 0; i < rowsVKToUnit.length; i++) {
      let tempUnitRoomName = "";
      let tempVKName = "";

      for (let j = 0; j < rowsAllUnitRoom.length; j++) {
        if (rowsVKToUnit[i]["RoomID"] === rowsAllUnitRoom[j]["ID"]) {
          tempUnitRoomName = rowsAllUnitRoom[j]["Name"];
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
            <td>${tempUnitRoomName}</td>
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
