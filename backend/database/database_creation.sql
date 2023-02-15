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
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`kirjahylly`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`kirjahylly` ;

CREATE TABLE IF NOT EXISTS `mydb`.`kirjahylly` (
  `kirjahylly_id` INT NOT NULL AUTO_INCREMENT,
  `nimi` VARCHAR(45) NULL,
  PRIMARY KEY (`kirjahylly_id`),
  UNIQUE INDEX `kirjahylly_id_UNIQUE` (`kirjahylly_id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`sarja`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`sarja` ;

CREATE TABLE IF NOT EXISTS `mydb`.`sarja` (
  `sarja_id` INT NOT NULL AUTO_INCREMENT,
  `nimi` VARCHAR(45) NULL,
  `kuvaus` VARCHAR(200) NULL,
  PRIMARY KEY (`sarja_id`),
  UNIQUE INDEX `sarja_id_UNIQUE` (`sarja_id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`oma_sarja`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`oma_sarja` ;

CREATE TABLE IF NOT EXISTS `mydb`.`oma_sarja` (
  `oma_sarja_id` INT NOT NULL AUTO_INCREMENT,
  `nimi` VARCHAR(45) NULL,
  `kuvaus` VARCHAR(200) NULL,
  `sarja_sarja_id` INT NOT NULL,
  PRIMARY KEY (`oma_sarja_id`),
  UNIQUE INDEX `oma_sarja_id_UNIQUE` (`oma_sarja_id` ASC) VISIBLE,
  INDEX `fk_oma_sarja_sarja1_idx` (`sarja_sarja_id` ASC) VISIBLE,
  CONSTRAINT `fk_oma_sarja_sarja1`
    FOREIGN KEY (`sarja_sarja_id`)
    REFERENCES `mydb`.`sarja` (`sarja_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`kirja`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`kirja` ;

CREATE TABLE IF NOT EXISTS `mydb`.`kirja` (
  `kirja_id` INT NOT NULL AUTO_INCREMENT,
  `nimi` VARCHAR(45) NULL,
  `jarjestusnumero` INT NULL,
  `kuvaus` VARCHAR(200) NULL,
  `kirjailijat` VARCHAR(200) NULL,
  `piirtajat` VARCHAR(200) NULL,
  `ensipainosvuosi` INT NULL,
  `painokset` INT NULL,
  PRIMARY KEY (`kirja_id`),
  UNIQUE INDEX `kirja_id_UNIQUE` (`kirja_id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`oma_kirja`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`oma_kirja` ;

CREATE TABLE IF NOT EXISTS `mydb`.`oma_kirja` (
  `oma_kirja_id` INT NOT NULL AUTO_INCREMENT,
  `kuntoluokka` INT NULL,
  `hankintahinta` DOUBLE NULL,
  `esittelyteksti` VARCHAR(200) NULL,
  `painosvuosi` INT NULL,
  `hankinta_aika` DATE NULL,
  `kirja_kirja_id` INT NOT NULL,
  PRIMARY KEY (`oma_kirja_id`),
  INDEX `fk_oma_kirja_kirja1_idx` (`kirja_kirja_id` ASC) VISIBLE,
  UNIQUE INDEX `oma_kirja_id_UNIQUE` (`oma_kirja_id` ASC) VISIBLE,
  CONSTRAINT `fk_oma_kirja_kirja1`
    FOREIGN KEY (`kirja_kirja_id`)
    REFERENCES `mydb`.`kirja` (`kirja_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`kuva_tyyppi`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`kuva_tyyppi` ;

CREATE TABLE IF NOT EXISTS `mydb`.`kuva_tyyppi` (
  `kuva_tyyppi_id` INT NOT NULL,
  `selite` VARCHAR(45) NULL,
  PRIMARY KEY (`kuva_tyyppi_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`kuva`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`kuva` ;

CREATE TABLE IF NOT EXISTS `mydb`.`kuva` (
  `kuva_id` INT NOT NULL AUTO_INCREMENT,
  `kuva` VARCHAR(200) NULL,
  `kuva_tyyppi_kuva_tyyppi_id` INT NOT NULL,
  PRIMARY KEY (`kuva_id`),
  INDEX `fk_kuva_kuva_tyyppi1_idx` (`kuva_tyyppi_kuva_tyyppi_id` ASC) VISIBLE,
  UNIQUE INDEX `kuva_id_UNIQUE` (`kuva_id` ASC) VISIBLE,
  CONSTRAINT `fk_kuva_kuva_tyyppi1`
    FOREIGN KEY (`kuva_tyyppi_kuva_tyyppi_id`)
    REFERENCES `mydb`.`kuva_tyyppi` (`kuva_tyyppi_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`hyllyn_sarjat`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`hyllyn_sarjat` ;

CREATE TABLE IF NOT EXISTS `mydb`.`hyllyn_sarjat` (
  `kirjahylly_kirjahylly_id` INT NOT NULL,
  `oma_sarja_oma_sarja_id` INT NOT NULL,
  PRIMARY KEY (`kirjahylly_kirjahylly_id`, `oma_sarja_oma_sarja_id`),
  INDEX `fk_kirjahylly_has_oma_sarja_oma_sarja1_idx` (`oma_sarja_oma_sarja_id` ASC) VISIBLE,
  INDEX `fk_kirjahylly_has_oma_sarja_kirjahylly_idx` (`kirjahylly_kirjahylly_id` ASC) VISIBLE,
  CONSTRAINT `fk_kirjahylly_has_oma_sarja_kirjahylly`
    FOREIGN KEY (`kirjahylly_kirjahylly_id`)
    REFERENCES `mydb`.`kirjahylly` (`kirjahylly_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_kirjahylly_has_oma_sarja_oma_sarja1`
    FOREIGN KEY (`oma_sarja_oma_sarja_id`)
    REFERENCES `mydb`.`oma_sarja` (`oma_sarja_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`sarjan_kirjat`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`sarjan_kirjat` ;

CREATE TABLE IF NOT EXISTS `mydb`.`sarjan_kirjat` (
  `sarja_sarja_id` INT NOT NULL,
  `kirja_kirja_id` INT NOT NULL,
  PRIMARY KEY (`sarja_sarja_id`, `kirja_kirja_id`),
  INDEX `fk_sarja_has_kirja_kirja1_idx` (`kirja_kirja_id` ASC) VISIBLE,
  INDEX `fk_sarja_has_kirja_sarja1_idx` (`sarja_sarja_id` ASC) VISIBLE,
  CONSTRAINT `fk_sarja_has_kirja_sarja1`
    FOREIGN KEY (`sarja_sarja_id`)
    REFERENCES `mydb`.`sarja` (`sarja_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_sarja_has_kirja_kirja1`
    FOREIGN KEY (`kirja_kirja_id`)
    REFERENCES `mydb`.`kirja` (`kirja_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`oman_sarjan_kirjat`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`oman_sarjan_kirjat` ;

CREATE TABLE IF NOT EXISTS `mydb`.`oman_sarjan_kirjat` (
  `oma_sarja_oma_sarja_id` INT NOT NULL,
  `oma_kirja_oma_kirja_id` INT NOT NULL,
  PRIMARY KEY (`oma_sarja_oma_sarja_id`, `oma_kirja_oma_kirja_id`),
  INDEX `fk_oma_sarja_has_oma_kirja_oma_kirja1_idx` (`oma_kirja_oma_kirja_id` ASC) VISIBLE,
  INDEX `fk_oma_sarja_has_oma_kirja_oma_sarja1_idx` (`oma_sarja_oma_sarja_id` ASC) VISIBLE,
  CONSTRAINT `fk_oma_sarja_has_oma_kirja_oma_sarja1`
    FOREIGN KEY (`oma_sarja_oma_sarja_id`)
    REFERENCES `mydb`.`oma_sarja` (`oma_sarja_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_oma_sarja_has_oma_kirja_oma_kirja1`
    FOREIGN KEY (`oma_kirja_oma_kirja_id`)
    REFERENCES `mydb`.`oma_kirja` (`oma_kirja_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`oman_kirjan_kuvat`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`oman_kirjan_kuvat` ;

CREATE TABLE IF NOT EXISTS `mydb`.`oman_kirjan_kuvat` (
  `oma_kirja_oma_kirja_id` INT NOT NULL,
  `kuva_kuva_id` INT NOT NULL,
  PRIMARY KEY (`oma_kirja_oma_kirja_id`, `kuva_kuva_id`),
  INDEX `fk_oma_kirja_has_kuva_kuva1_idx` (`kuva_kuva_id` ASC) VISIBLE,
  INDEX `fk_oma_kirja_has_kuva_oma_kirja1_idx` (`oma_kirja_oma_kirja_id` ASC) VISIBLE,
  CONSTRAINT `fk_oma_kirja_has_kuva_oma_kirja1`
    FOREIGN KEY (`oma_kirja_oma_kirja_id`)
    REFERENCES `mydb`.`oma_kirja` (`oma_kirja_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_oma_kirja_has_kuva_kuva1`
    FOREIGN KEY (`kuva_kuva_id`)
    REFERENCES `mydb`.`kuva` (`kuva_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


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
    REFERENCES `mydb`.`kirja` (`kirja_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_kirja_has_kuva_kuva1`
    FOREIGN KEY (`kuva_kuva_id`)
    REFERENCES `mydb`.`kuva` (`kuva_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


-- Näkymiä:
-- -----------------------------------------------------
-- View `mydb`.`oma_kirja_etukannella`
-- -----------------------------------------------------
CREATE VIEW oma_kirja_etukannella 
AS 
SELECT oma_kirja_id, kuntoluokka, hankinta_aika, esittelyteksti, painosvuosi, kirja_kirja_id, kuva_kuva_id, kuva_tyyppi_id, kuva
FROM oma_kirja
JOIN oman_kirjan_kuvat 
ON oma_kirja_id = oma_kirja_oma_kirja_id
JOIN kuva 
ON kuva_kuva_id = kuva_id
JOIN kuva_tyyppi 
ON kuva_tyyppi_kuva_tyyppi_id = kuva_tyyppi_id 
WHERE kuva_tyyppi_id = 1;