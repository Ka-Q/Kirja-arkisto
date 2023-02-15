
-- Testidataa tietokantaan 

-- Kuvien tyypit
insert into kuva_tyyppi values(1, "etukansi");
insert into kuva_tyyppi values(2, "takakansi");
insert into kuva_tyyppi values(3, "sivu");

-- Kirjahyllyt
insert into kirjahylly values (0, "Pekan kirjahylly");


-- Taru sormusten Herrasta -sarja
insert into sarja values(1, "Taru Sormusten Herrasta", "Tolkienin Taru Sormusten Herrasta - trilogian kolme osaa");

-- Taru Sormusten herrasta -kirjat
insert into kirja values(1, "Sormuksen ritarit", 1, "Ensimmäinen osa Taru Sormusten Herra - sarjaa", "J. R. R. Tolkien", "-", 1954, 11);
insert into kirja values(2, "Kaksi tornia", 2, "Toinen osa Taru Sormusten Herra - sarjaa", "J. R. R. Tolkien", "-", 1954, 11);
insert into kirja values(3, "Kuninkaan paluu", 3, "Kolmas ja viimeinen osa Taru Sormusten Herra - sarjaa", "J. R. R. Tolkien", "-", 1955, 11);

-- Taru Sormusten Herrasta -kirjat sarjaan
insert into sarjan_kirjat values(1,1);
insert into sarjan_kirjat values(1,2);
insert into sarjan_kirjat values(1,3);

-- Narnia -sarja
insert into sarja values(2, "Narnian tarinat", "Narnian tarinat on seitsemän lapsille suunnatun fantasiakirjan muodostama sarja");

-- Narnia -kirjat
insert into kirja values(4, "Velho ja leijona", 1, "Ensimmäinen osa Narnia-sarjaa", "C. S. Lewis", "-", 1950, 16);
insert into kirja values(5, "Prinssi Kaspian", 2, "Toinen osa Narnia-sarjaa", "C. S. Lewis", "-", 1951, 16);
insert into kirja values(6, "Kaspainin matka maailman ääriin", 3, "Kolmas osa Narnia-sarjaa", "C. S. Lewis", "-", 1952, 15);
insert into kirja values(7, "Hopeinen tuoli", 4, "Neljäs osa Narnia-sarjaa", "C. S. Lewis", "-", 1953, 15);
insert into kirja values(8, "Hevonen ja poika", 5, "Viides osa Narnia-sarjaa", "C. S. Lewis", "-", 1954, 15);
insert into kirja values(9, "Taikurin sisarenpoika", 6, "Kuudes osa Narnia-sarjaa", "C. S. Lewis", "-", 1955, 14);
insert into kirja values(10, "Narnian viimeinen taistelu", 7, "Seitsemäs ja viimeinen osa Narnia-sarjaa", "C. S. Lewis", "-", 1956, 14);

-- Narnia -kirjat sarjaan
insert into sarjan_kirjat values(2,4);
insert into sarjan_kirjat values(2,5);
insert into sarjan_kirjat values(2,6);
insert into sarjan_kirjat values(2,7);
insert into sarjan_kirjat values(2,8);
insert into sarjan_kirjat values(2,9);
insert into sarjan_kirjat values(2,10);

-- Omat kirjat
	-- Taru Sormusten Herrasta:
insert into oma_kirja values(10, 4, 12.90, "Kirpputorilöytö", 2002, "2019-10-12", 1);
insert into oma_kirja values(20, 3, 7.50, "Kirpputorilöytö", 2004, "2021-11-11", 2);
insert into oma_kirja values(30, 4, 6.50, "Kirpputorilöytö", 2004, "2021-11-11", 1);

	-- Narnia:
insert into oma_kirja values(40, 5, 9.25, "Poistomyynnistä", 2010, "2021-11-12", 4);
insert into oma_kirja values(50, 5, 9.25, "Poistomyynnistä", 2010, "2021-11-12", 5);
insert into oma_kirja values(60, 5, 9.25, "Poistomyynnistä", 2010, "2021-11-12", 6);
insert into oma_kirja values(70, 3, 5.00, "Antikvariaatista", 2007, "2022-06-08", 10);


-- Omien kirjojen kuvat
insert into kuva values(1, "Kuva Sormuksen ritareiden etukannesta", 1);
insert into kuva values(2, "Kuva Sormuksen ritareiden takakannesta", 2);
insert into kuva values(3, "Kuva Kaksi tornia etukannesta", 1);
insert into kuva values(4, "Kuva Kaksi tornia takakannesta", 2);
insert into kuva values(5, "Kuva Kaksi tornia sivulta 4", 3);

insert into kuva values(6, "Kuva Velho ja Leijona etukannesta", 1);
insert into kuva values(7, "Kuva Narnian viimeinen taistelu etukannesta", 1);

-- Omien kirjojen kuvat paikoilleen
insert into oman_kirjan_kuvat values(20, 1);
insert into oman_kirjan_kuvat values(20, 2);
insert into oman_kirjan_kuvat values(30, 3);
insert into oman_kirjan_kuvat values(30, 4);
insert into oman_kirjan_kuvat values(30, 5);

insert into oman_kirjan_kuvat values(40, 6);
insert into oman_kirjan_kuvat values(70, 7);

-- Omat sarjat
insert into oma_sarja values(1, "Taru sormusten Herrasta (oma)", "Kokoelmani Taru Sormusten Herrasta - kirjoja", 1);
insert into oma_sarja values(2, "Narnian tarinoita (oma)", "Kokoelmani Narnia -kirjoja", 2);

-- Omien sarjojen kirjat
	-- Taru Sormusten Herrasta:
insert into oman_sarjan_kirjat values(1, 10);
insert into oman_sarjan_kirjat values(1, 20);
insert into oman_sarjan_kirjat values(1, 30);

	-- Narnia:
insert into oman_sarjan_kirjat values(2, 40);
insert into oman_sarjan_kirjat values(2, 50);
insert into oman_sarjan_kirjat values(2, 60);
insert into oman_sarjan_kirjat values(2, 70);

