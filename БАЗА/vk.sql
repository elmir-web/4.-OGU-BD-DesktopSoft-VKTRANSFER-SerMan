-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Сен 03 2021 г., 08:22
-- Версия сервера: 8.0.23
-- Версия PHP: 7.3.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `vk`
--
CREATE DATABASE IF NOT EXISTS `vk` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `vk`;

-- --------------------------------------------------------

--
-- Структура таблицы `unit`
--

DROP TABLE IF EXISTS `unit`;
CREATE TABLE `unit` (
  `ID` int UNSIGNED NOT NULL,
  `Number` int UNSIGNED NOT NULL,
  `Name` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `NameShort` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `unit`
--

INSERT INTO `unit` (`ID`, `Number`, `Name`, `NameShort`) VALUES
(1, 1, 'Отдел кадров', 'ОК'),
(2, 2, 'Отдел снабжения', 'ОС'),
(3, 3, 'Комерческий отдел', 'КО');

-- --------------------------------------------------------

--
-- Структура таблицы `unitpattern`
--

DROP TABLE IF EXISTS `unitpattern`;
CREATE TABLE `unitpattern` (
  `ID` int UNSIGNED NOT NULL,
  `UnitID` int UNSIGNED NOT NULL,
  `Function` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `WorkerID` int UNSIGNED NOT NULL,
  `IsBoss` int NOT NULL DEFAULT '0',
  `IsMOL` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `unitpattern`
--

INSERT INTO `unitpattern` (`ID`, `UnitID`, `Function`, `WorkerID`, `IsBoss`, `IsMOL`) VALUES
(1, 1, 'Руководитель', 1, 1, 0),
(2, 1, 'Кладовщик', 2, 0, 1),
(3, 2, 'Начальник', 3, 1, 1),
(4, 3, 'Инженер', 4, 0, 1),
(5, 3, 'Босс', 5, 1, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `unitroom`
--

DROP TABLE IF EXISTS `unitroom`;
CREATE TABLE `unitroom` (
  `ID` int UNSIGNED NOT NULL,
  `UnitID` int UNSIGNED NOT NULL,
  `Name` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `unitroom`
--

INSERT INTO `unitroom` (`ID`, `UnitID`, `Name`) VALUES
(1, 1, '№1'),
(2, 1, '№2'),
(3, 2, '№3'),
(4, 2, '№4'),
(5, 3, '№5');

-- --------------------------------------------------------

--
-- Структура таблицы `vk`
--

DROP TABLE IF EXISTS `vk`;
CREATE TABLE `vk` (
  `ID` int UNSIGNED NOT NULL,
  `Name` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `Model` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `DatePurchase` date NOT NULL,
  `Cost` decimal(20,2) NOT NULL,
  `TypeID` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `vk`
--

INSERT INTO `vk` (`ID`, `Name`, `Model`, `DatePurchase`, `Cost`, `TypeID`) VALUES
(1, 'Компьютер №1', 'Крутая', '2021-08-01', '10000.00', 1),
(2, 'Компьютер №2', 'Нормальная', '2021-08-08', '8000.00', 1),
(3, 'Компьютер №3', 'Крутая', '2021-08-04', '13000.00', 1),
(4, 'Компьютер №4', 'Нормальная', '2021-08-10', '9000.00', 1),
(5, 'Принтер №1', 'Нормальная', '2021-08-13', '7000.00', 2),
(6, 'Принтер №2', 'Нормальная', '2021-08-10', '7000.00', 2),
(7, 'Принтер №3', 'Нормальная', '2021-08-10', '5000.00', 2),
(8, 'Компьютер №5', 'Крутая', '2021-08-13', '10000.00', 1),
(9, 'Компьютер №6', 'Супер', '2021-08-10', '16000.00', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `vktounit`
--

DROP TABLE IF EXISTS `vktounit`;
CREATE TABLE `vktounit` (
  `ID` int UNSIGNED NOT NULL,
  `VKID` int UNSIGNED NOT NULL,
  `DateTransfer` date NOT NULL,
  `RoomID` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `vktounit`
--

INSERT INTO `vktounit` (`ID`, `VKID`, `DateTransfer`, `RoomID`) VALUES
(1, 1, '2021-08-16', 1),
(2, 2, '2021-08-16', 2),
(3, 3, '2021-08-16', 3),
(4, 4, '2021-08-16', 4),
(5, 5, '2021-08-18', 1),
(6, 6, '2021-08-18', 4),
(7, 7, '2021-08-18', 3),
(8, 8, '2021-08-18', 2),
(9, 9, '2021-08-18', 5),
(10, 1, '2021-08-23', 3),
(11, 1, '2021-09-01', 5),
(12, 9, '2021-09-01', 2),
(13, 6, '2021-08-30', 5),
(14, 1, '2021-09-03', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `vktype`
--

DROP TABLE IF EXISTS `vktype`;
CREATE TABLE `vktype` (
  `ID` int UNSIGNED NOT NULL,
  `Name` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `vktype`
--

INSERT INTO `vktype` (`ID`, `Name`) VALUES
(1, 'Компьютер'),
(2, 'Принтер');

-- --------------------------------------------------------

--
-- Структура таблицы `worker`
--

DROP TABLE IF EXISTS `worker`;
CREATE TABLE `worker` (
  `ID` int UNSIGNED NOT NULL,
  `FIO` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `worker`
--

INSERT INTO `worker` (`ID`, `FIO`) VALUES
(1, 'Иванов Иван Иванович'),
(2, 'Петров Петр Петрович'),
(3, 'Сидоров С.С.'),
(4, 'Кузнецов А.Б.'),
(5, 'Федоров А.В.');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `unit`
--
ALTER TABLE `unit`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `unitpattern`
--
ALTER TABLE `unitpattern`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `UnitID` (`UnitID`),
  ADD KEY `WorkerID` (`WorkerID`);

--
-- Индексы таблицы `unitroom`
--
ALTER TABLE `unitroom`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `UnitID` (`UnitID`);

--
-- Индексы таблицы `vk`
--
ALTER TABLE `vk`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `TypeID` (`TypeID`);

--
-- Индексы таблицы `vktounit`
--
ALTER TABLE `vktounit`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `VKID` (`VKID`),
  ADD KEY `RoomID` (`RoomID`);

--
-- Индексы таблицы `vktype`
--
ALTER TABLE `vktype`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `worker`
--
ALTER TABLE `worker`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `unit`
--
ALTER TABLE `unit`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `unitpattern`
--
ALTER TABLE `unitpattern`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `unitroom`
--
ALTER TABLE `unitroom`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `vk`
--
ALTER TABLE `vk`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT для таблицы `vktounit`
--
ALTER TABLE `vktounit`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT для таблицы `vktype`
--
ALTER TABLE `vktype`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `worker`
--
ALTER TABLE `worker`
  MODIFY `ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `unitpattern`
--
ALTER TABLE `unitpattern`
  ADD CONSTRAINT `unitpattern_ibfk_1` FOREIGN KEY (`UnitID`) REFERENCES `unit` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `unitpattern_ibfk_2` FOREIGN KEY (`WorkerID`) REFERENCES `worker` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `unitroom`
--
ALTER TABLE `unitroom`
  ADD CONSTRAINT `unitroom_ibfk_1` FOREIGN KEY (`UnitID`) REFERENCES `unit` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `vk`
--
ALTER TABLE `vk`
  ADD CONSTRAINT `vk_ibfk_1` FOREIGN KEY (`TypeID`) REFERENCES `vktype` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `vktounit`
--
ALTER TABLE `vktounit`
  ADD CONSTRAINT `vktounit_ibfk_1` FOREIGN KEY (`VKID`) REFERENCES `vk` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `vktounit_ibfk_2` FOREIGN KEY (`RoomID`) REFERENCES `unitroom` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
