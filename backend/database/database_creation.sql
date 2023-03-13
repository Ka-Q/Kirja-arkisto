-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8mb3 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`kirjahylly`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`kirjahylly` ;

CREATE TABLE IF NOT EXISTS `mydb`.`kirjahylly` (
  `kirjahylly_id` INT NOT NULL AUTO_INCREMENT,
  `nimi` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`kirjahylly_id`),
  UNIQUE INDEX `kirjahylly_id_UNIQUE` (`kirjahylly_id` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`sarja`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`sarja` ;

CREATE TABLE IF NOT EXISTS `mydb`.`sarja` (
  `sarja_id` INT NOT NULL AUTO_INCREMENT,
  `nimi` VARCHAR(45) NULL DEFAULT NULL,
  `kuvaus` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`sarja_id`),
  UNIQUE INDEX `sarja_id_UNIQUE` (`sarja_id` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`oma_sarja`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`oma_sarja` ;

CREATE TABLE IF NOT EXISTS `mydb`.`oma_sarja` (
  `oma_sarja_id` INT NOT NULL AUTO_INCREMENT,
  `nimi` VARCHAR(45) NULL DEFAULT NULL,
  `kuvaus` VARCHAR(200) NULL DEFAULT NULL,
  `sarja_sarja_id` INT NOT NULL,
  PRIMARY KEY (`oma_sarja_id`),
  UNIQUE INDEX `oma_sarja_id_UNIQUE` (`oma_sarja_id` ASC) VISIBLE,
  INDEX `fk_oma_sarja_sarja1_idx` (`sarja_sarja_id` ASC) VISIBLE,
  CONSTRAINT `fk_oma_sarja_sarja1`
    FOREIGN KEY (`sarja_sarja_id`)
    REFERENCES `mydb`.`sarja` (`sarja_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`hyllyn_sarjat`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`hyllyn_sarjat` ;

CREATE TABLE IF NOT EXISTS `mydb`.`hyllyn_sarjat` (
  `kirjahylly_id` INT NOT NULL,
  `oma_sarja_id` INT NOT NULL,
  PRIMARY KEY (`kirjahylly_id`, `oma_sarja_id`),
  INDEX `fk_kirjahylly_has_oma_sarja_oma_sarja1_idx` (`oma_sarja_id` ASC) VISIBLE,
  INDEX `fk_kirjahylly_has_oma_sarja_kirjahylly_idx` (`kirjahylly_id` ASC) VISIBLE,
  CONSTRAINT `fk_kirjahylly_has_oma_sarja_kirjahylly`
    FOREIGN KEY (`kirjahylly_id`)
    REFERENCES `mydb`.`kirjahylly` (`kirjahylly_id`),
  CONSTRAINT `fk_kirjahylly_has_oma_sarja_oma_sarja1`
    FOREIGN KEY (`oma_sarja_id`)
    REFERENCES `mydb`.`oma_sarja` (`oma_sarja_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`kirja`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`kirja` ;

CREATE TABLE IF NOT EXISTS `mydb`.`kirja` (
  `kirja_id` INT NOT NULL AUTO_INCREMENT,
  `nimi` VARCHAR(45) NULL DEFAULT NULL,
  `jarjestysnumero` INT NULL DEFAULT NULL,
  `kuvaus` VARCHAR(200) NULL DEFAULT NULL,
  `kirjailijat` VARCHAR(200) NULL DEFAULT NULL,
  `piirtajat` VARCHAR(200) NULL DEFAULT NULL,
  `ensipainosvuosi` INT NULL DEFAULT NULL,
  `painokset` INT NULL DEFAULT NULL,
  PRIMARY KEY (`kirja_id`),
  UNIQUE INDEX `kirja_id_UNIQUE` (`kirja_id` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 22
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`kuva_tyyppi`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`kuva_tyyppi` ;

CREATE TABLE IF NOT EXISTS `mydb`.`kuva_tyyppi` (
  `kuva_tyyppi_id` INT NOT NULL,
  `selite` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`kuva_tyyppi_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`kuva`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`kuva` ;

CREATE TABLE IF NOT EXISTS `mydb`.`kuva` (
  `kuva_id` INT NOT NULL AUTO_INCREMENT,
  `kuva` VARCHAR(200) NULL DEFAULT NULL,
  `kuva_tyyppi_id` INT NOT NULL,
  `julkaisuvuosi` INT NULL DEFAULT NULL,
  `taiteilija` VARCHAR(45) NULL DEFAULT NULL,
  `tyyli` VARCHAR(45) NULL DEFAULT NULL,
  `kuvaus` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`kuva_id`),
  UNIQUE INDEX `kuva_id_UNIQUE` (`kuva_id` ASC) VISIBLE,
  INDEX `fk_kuva_kuva_tyyppi1_idx` (`kuva_tyyppi_id` ASC) VISIBLE,
  CONSTRAINT `fk_kuva_kuva_tyyppi1`
    FOREIGN KEY (`kuva_tyyppi_id`)
    REFERENCES `mydb`.`kuva_tyyppi` (`kuva_tyyppi_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`kirjan_kuvat`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`kirjan_kuvat` ;

CREATE TABLE IF NOT EXISTS `mydb`.`kirjan_kuvat` (
  `kirja_kirja_id` INT NOT NULL,
  `kuva_kuva_id` INT NOT NULL,
  PRIMARY KEY (`kirja_kirja_id`, `kuva_kuva_id`),
  INDEX `fk_kirja_has_kuva_kuva1_idx` (`kuva_kuva_id` ASC) VISIBLE,
  INDEX `fk_kirja_has_kuva_kirja1_idx` (`kirja_kirja_id` ASC) VISIBLE,
  CONSTRAINT `fk_kirja_has_kuva_kirja1`
    FOREIGN KEY (`kirja_kirja_id`)
    REFERENCES `mydb`.`kirja` (`kirja_id`),
  CONSTRAINT `fk_kirja_has_kuva_kuva1`
    FOREIGN KEY (`kuva_kuva_id`)
    REFERENCES `mydb`.`kuva` (`kuva_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`oma_kirja`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`oma_kirja` ;

CREATE TABLE IF NOT EXISTS `mydb`.`oma_kirja` (
  `oma_kirja_id` INT NOT NULL AUTO_INCREMENT,
  `kuntoluokka` INT NULL DEFAULT NULL,
  `hankintahinta` DOUBLE NULL DEFAULT NULL,
  `esittelyteksti` VARCHAR(200) NULL DEFAULT NULL,
  `painosvuosi` INT NULL DEFAULT NULL,
  `hankinta_aika` DATE NULL DEFAULT NULL,
  `kirja_id` INT NOT NULL,
  PRIMARY KEY (`oma_kirja_id`),
  UNIQUE INDEX `oma_kirja_id_UNIQUE` (`oma_kirja_id` ASC) VISIBLE,
  INDEX `fk_oma_kirja_kirja1_idx` (`kirja_id` ASC) VISIBLE,
  CONSTRAINT `fk_oma_kirja_kirja1`
    FOREIGN KEY (`kirja_id`)
    REFERENCES `mydb`.`kirja` (`kirja_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 71
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`valokuva`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`valokuva` ;

CREATE TABLE IF NOT EXISTS `mydb`.`valokuva` (
  `valokuva_id` INT NOT NULL AUTO_INCREMENT,
  `sivunumero` INT NULL DEFAULT NULL,
  `nimi` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`valokuva_id`),
  UNIQUE INDEX `valokuva_id_UNIQUE` (`valokuva_id` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`oman_kirjan_valokuvat`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`oman_kirjan_valokuvat` ;

CREATE TABLE IF NOT EXISTS `mydb`.`oman_kirjan_valokuvat` (
  `oma_kirja_id` INT NOT NULL,
  `valokuva_id` INT NOT NULL,
  PRIMARY KEY (`oma_kirja_id`, `valokuva_id`),
  INDEX `fk_oma_kirja_has_valokuva_valokuva1_idx` (`valokuva_id` ASC) VISIBLE,
  INDEX `fk_oma_kirja_has_valokuva_oma_kirja1_idx` (`oma_kirja_id` ASC) VISIBLE,
  CONSTRAINT `fk_oma_kirja_has_valokuva_oma_kirja1`
    FOREIGN KEY (`oma_kirja_id`)
    REFERENCES `mydb`.`oma_kirja` (`oma_kirja_id`),
  CONSTRAINT `fk_oma_kirja_has_valokuva_valokuva1`
    FOREIGN KEY (`valokuva_id`)
    REFERENCES `mydb`.`valokuva` (`valokuva_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`oman_sarjan_kirjat`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`oman_sarjan_kirjat` ;

CREATE TABLE IF NOT EXISTS `mydb`.`oman_sarjan_kirjat` (
  `oma_sarja_id` INT NOT NULL,
  `oma_kirja_id` INT NOT NULL,
  PRIMARY KEY (`oma_sarja_id`, `oma_kirja_id`),
  INDEX `fk_oma_sarja_has_oma_kirja_oma_kirja1_idx` (`oma_kirja_id` ASC) VISIBLE,
  INDEX `fk_oma_sarja_has_oma_kirja_oma_sarja1_idx` (`oma_sarja_id` ASC) VISIBLE,
  CONSTRAINT `fk_oma_sarja_has_oma_kirja_oma_kirja1`
    FOREIGN KEY (`oma_kirja_id`)
    REFERENCES `mydb`.`oma_kirja` (`oma_kirja_id`),
  CONSTRAINT `fk_oma_sarja_has_oma_kirja_oma_sarja1`
    FOREIGN KEY (`oma_sarja_id`)
    REFERENCES `mydb`.`oma_sarja` (`oma_sarja_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`sarjan_kirjat`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`sarjan_kirjat` ;

CREATE TABLE IF NOT EXISTS `mydb`.`sarjan_kirjat` (
  `sarja_id` INT NOT NULL,
  `kirja_id` INT NOT NULL,
  PRIMARY KEY (`sarja_id`, `kirja_id`),
  INDEX `fk_sarja_has_kirja_kirja1_idx` (`kirja_id` ASC) VISIBLE,
  INDEX `fk_sarja_has_kirja_sarja1_idx` (`sarja_id` ASC) VISIBLE,
  CONSTRAINT `fk_sarja_has_kirja_kirja1`
    FOREIGN KEY (`kirja_id`)
    REFERENCES `mydb`.`kirja` (`kirja_id`),
  CONSTRAINT `fk_sarja_has_kirja_sarja1`
    FOREIGN KEY (`sarja_id`)
    REFERENCES `mydb`.`sarja` (`sarja_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

USE `mydb` ;

-- -----------------------------------------------------
-- Placeholder table for view `mydb`.`oma_kirja_kaikella`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`oma_kirja_kaikella` (`oma_kirja_id` INT, `kuntoluokka` INT, `hankintahinta` INT, `esittelyteksti` INT, `painosvuosi` INT, `hankinta_aika` INT, `valokuva_id` INT, `sivunumero` INT, `valokuvan_nimi` INT, `kirja_id` INT, `kirjan_nimi` INT, `jarjestysnumero` INT, `kirjan_kuvaus` INT, `kirjailijat` INT, `piirtajat` INT, `ensipainosvuosi` INT, `painokset` INT, `kuva_id` INT, `kuva` INT, `kuva_tyyppi_id` INT, `julkaisuvuosi` INT, `taiteilija` INT, `tyyli` INT, `kuvan_kuvaus` INT);

-- -----------------------------------------------------
-- View `mydb`.`oma_kirja_kaikella`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`oma_kirja_kaikella`;
DROP VIEW IF EXISTS `mydb`.`oma_kirja_kaikella` ;
USE `mydb`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `mydb`.`oma_kirja_kaikella` AS select `mydb`.`oma_kirja`.`oma_kirja_id` AS `oma_kirja_id`,`mydb`.`oma_kirja`.`kuntoluokka` AS `kuntoluokka`,`mydb`.`oma_kirja`.`hankintahinta` AS `hankintahinta`,`mydb`.`oma_kirja`.`esittelyteksti` AS `esittelyteksti`,`mydb`.`oma_kirja`.`painosvuosi` AS `painosvuosi`,`mydb`.`oma_kirja`.`hankinta_aika` AS `hankinta_aika`,`mydb`.`valokuva`.`valokuva_id` AS `valokuva_id`,`mydb`.`valokuva`.`sivunumero` AS `sivunumero`,`mydb`.`valokuva`.`nimi` AS `valokuvan_nimi`,`mydb`.`kirja`.`kirja_id` AS `kirja_id`,`mydb`.`kirja`.`nimi` AS `kirjan_nimi`,`mydb`.`kirja`.`jarjestysnumero` AS `jarjestysnumero`,`mydb`.`kirja`.`kuvaus` AS `kirjan_kuvaus`,`mydb`.`kirja`.`kirjailijat` AS `kirjailijat`,`mydb`.`kirja`.`piirtajat` AS `piirtajat`,`mydb`.`kirja`.`ensipainosvuosi` AS `ensipainosvuosi`,`mydb`.`kirja`.`painokset` AS `painokset`,`mydb`.`kuva`.`kuva_id` AS `kuva_id`,`mydb`.`kuva`.`kuva` AS `kuva`,`mydb`.`kuva`.`kuva_tyyppi_id` AS `kuva_tyyppi_id`,`mydb`.`kuva`.`julkaisuvuosi` AS `julkaisuvuosi`,`mydb`.`kuva`.`taiteilija` AS `taiteilija`,`mydb`.`kuva`.`tyyli` AS `tyyli`,`mydb`.`kuva`.`kuvaus` AS `kuvan_kuvaus` from (((((`mydb`.`oma_kirja` left join `mydb`.`oman_kirjan_valokuvat` on((`mydb`.`oma_kirja`.`oma_kirja_id` = `mydb`.`oman_kirjan_valokuvat`.`oma_kirja_id`))) left join `mydb`.`valokuva` on((`mydb`.`oman_kirjan_valokuvat`.`valokuva_id` = `mydb`.`valokuva`.`valokuva_id`))) left join `mydb`.`kirja` on((`mydb`.`oma_kirja`.`kirja_id` = `mydb`.`kirja`.`kirja_id`))) left join `mydb`.`kirjan_kuvat` on((`mydb`.`kirja`.`kirja_id` = `mydb`.`kirjan_kuvat`.`kirja_kirja_id`))) left join `mydb`.`kuva` on((`mydb`.`kirjan_kuvat`.`kuva_kuva_id` = `mydb`.`kuva`.`kuva_id`)));

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
