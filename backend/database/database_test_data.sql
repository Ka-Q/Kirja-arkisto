
-- Testidataa tietokantaan 

insert into rooli values (1, "Admin", "admin-rooli");
insert into rooli values (2, "Käyttäjä", "käyttäjä-rooli");

insert into kayttaja values(1, "admin", "admin", "abc123", 1);
insert into kayttaja values(2, "käyttäjä", "käyttäjä", "abc1234", 2);

-- Kuvien tyypit
insert into kuva_tyyppi values(1, "etukansi");
insert into kuva_tyyppi values(2, "takakansi");
insert into kuva_tyyppi values(3, "sivu");

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

-- Harry Potter -sarja
insert into sarja values(3,"Harry Potter","Harry Potter -sarjan 9 osaa");
-- Harry Potter -kirjat
insert into kirja values(11, "Harry Potter ja viisasten kivi", 1, "Ensimmäinen osa Harry Potter -sarjaa", "J.K. Rowling", "-", 1997, 50);
INSERT INTO kirja VALUES (12, 'Harry Potter ja salaisuuksien kammio', 2, 'Toinen osa Harry Potter -sarjaa', 'J.K. Rowling', '-', 1998, 50);
INSERT INTO kirja VALUES (13, 'Harry Potter ja Azkabanin vanki', 3, 'Kolmas osa Harry Potter -sarjaa', 'J.K. Rowling', '-', 1999, 50);
INSERT INTO kirja VALUES (14, 'Harry Potter ja liekehtivä pikari', 4, 'Neljäs osa Harry Potter -sarjaa', 'J.K. Rowling', '-', 2000, 50);
INSERT INTO kirja VALUES (15, 'Harry Potter ja Feeniksin kilta', 5, 'Viides osa Harry Potter -sarjaa', 'J.K. Rowling', '-', 2003, 50);
INSERT INTO kirja VALUES (16, 'Harry Potter ja puoliverinen prinssi', 6, 'Kuudes osa Harry Potter -sarjaa', 'J.K. Rowling', '-', 2005, 50);
INSERT INTO kirja VALUES (17, 'Harry Potter ja kuoleman varjelukset', 7, 'Viimeinen osa Harry Potter -sarjaa', 'J.K. Rowling', '-', 2007, 50);

-- young samurai -sarja
Insert into sarja values(4,"Young Samurai","9-osaa");
-- Young samurai -kirjat
INSERT INTO kirja VALUES (18, 'Young Samurai: The Way of the Warrior', 1, 'First book in the Young Samurai series', 'Chris Bradford', '-', 2008, 25);
INSERT INTO kirja VALUES (19, 'Young Samurai: The Way of the Sword', 2, 'Second book in the Young Samurai series', 'Chris Bradford', '-', 2009, 25);
INSERT INTO kirja VALUES (20, 'Young Samurai: The Way of the Dragon', 3, 'Third book in the Young Samurai series', 'Chris Bradford', '-', 2010, 25);
INSERT INTO kirja VALUES (21, 'Young Samurai: The Ring of Water', 4, 'Fourth book in the Young Samurai series', 'Chris Bradford', '-', 2011, 25);
INSERT INTO kirja VALUES (22, 'Young Samurai: The Ring of Earth', 5, 'Fifth book in the Young Samurai series', 'Chris Bradford', '-', 2012, 25);
INSERT INTO kirja VALUES (23, 'Young Samurai: The Ring of Fire', 6, 'Sixth book in the Young Samurai series', 'Chris Bradford', '-', 2013, 25);
INSERT INTO kirja VALUES (24, 'Young Samurai: The Ring of Wind', 7, 'Seventh book in the Young Samurai series', 'Chris Bradford', '-', 2014, 25);

-- Muita kirjoja
insert into kirja values(25, "The Shining", NULL, "A horror novel about a family staying at an isolated hotel", "Stephen King", "-", 1977, 30);
insert into kirja values(26, "Watchmen", NULL, "A graphic novel exploring the dark side of superheroes", "Alan Moore", "Dave Gibbons", 1986, 10);
insert into kirja values(27, "Murder on the Orient Express", NULL, "A classic murder mystery novel set on a train", "Agatha Christie", "-", 1934, 40);
insert into kirja values(28, "A Game of Thrones", 1, "The first book in the A Song of Ice and Fire series", "George R.R. Martin", "-", 1996, 20);
insert into kirja values(29, "The Old Man and the Sea", NULL, "A short novel about an aging fisherman's struggle with a giant marlin", "Ernest Hemingway", "-", 1952, 25);



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
insert into oma_kirja values(10, 4, 12.90, "Kirpputorilöytö", 2002, "2019-10-12", 1, 2);
insert into oma_kirja values(20, 3, 7.50, "Kirpputorilöytö", 2004, "2021-11-11", 2, 2);
insert into oma_kirja values(30, 4, 6.50, "Kirpputorilöytö", 2004, "2021-11-11", 1, 2);

	-- Narnia:
insert into oma_kirja values(40, 5, 9.25, "Poistomyynnistä", 2010, "2021-11-12", 4, 1);
insert into oma_kirja values(50, 5, 9.25, "Poistomyynnistä", 2010, "2021-11-12", 5, 1);
insert into oma_kirja values(60, 5, 9.25, "Poistomyynnistä", 2010, "2021-11-12", 6, 1);
insert into oma_kirja values(70, 3, 5.00, "Antikvariaatista", 2007, "2022-06-08", 10, 1);


-- Kirjojen kuvat
insert into kuva values(1, "sormuksen_ritarit_etukansi.gif",  1, 1999, "Kalle", "Maalaus", "Kuva Sormuksen ritareiden etukannesta");
insert into kuva values(2, "sormuksen_ritarit_takakansi.gif", 2, 1999, "Kalle", "Maalaus", "Kuva Sormuksen ritareiden etukannesta");
insert into kuva values(3, "kaksi_tornia_etukansi.gif", 1, 1999, "Kalle", "Maalaus", "Kuva kaksi tornia etukannesta");
insert into kuva values(4, "kaksi_tornia_etukansi.gif", 2, 1999, "Kalle", "Maalaus", "Kuva kaksi tornia etukannesta");
insert into kuva values(5, "kuninkaan_paluu_etukansi.gif", 3, 1999, "Kalle", "Maalaus", "Kuva Kuninkaan paluun etukannesta");

insert into kuva values(6, "Taru_sormusten_herrasta_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva Sormuksen ritareiden etukannesta");
insert into kuva values(7, "Taru_sormusten_herrasta_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva Sormuksen ritareiden etukannesta");

insert into kuva values(8, "prinssi_kaspian_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuvaprinssi kaspian etukannesta");
insert into kuva values(9, "kaspianin_matka_maailman_aariin_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva kaspianin matka maailman ääriin etukannesta");

insert into kuva values(10, "kaksi_tornia_etukansi.gif", 3, 1999, "Kalle", "Maalaus", "Testikuva");
insert into kuva values(11, "Taru_sormusten_herrasta_etukansi.jpg", 3, 1999, "Kalle", "Maalaus", "Testikuva");
insert into kuva values(12, "prinssi_kaspian_etukansi.jpg", 3, 1999, "Kalle", "Maalaus", "Testikuva");
insert into kuva values(13, "kaspianin_matka_maailman_aariin_etukansi.jpg", 3, 1999, "Kalle", "Maalaus", "Testikuva");

-- kuvat paikoilleen
insert into kirjan_kuvat values(1, 1);
insert into kirjan_kuvat values(1, 2);
insert into kirjan_kuvat values(1, 10);
insert into kirjan_kuvat values(1, 11);
insert into kirjan_kuvat values(1, 12);
insert into kirjan_kuvat values(1, 13);

insert into kirjan_kuvat values(1, 3);

insert into kirjan_kuvat values(2, 3);
insert into kirjan_kuvat values(2, 4);
insert into kirjan_kuvat values(3, 5);

insert into kirjan_kuvat values(4, 6);
insert into kirjan_kuvat values(10, 7);

insert into kirjan_kuvat values(5, 8);
insert into kirjan_kuvat values(6, 9);

insert into valokuva values(1, "paras_valokuva.png", 1234, "testivalokuva");
insert into valokuva values(2, "paras_valokuva.png", 1235, "testivalokuva2");
insert into valokuva values(3, "paras_valokuva.png", 1236, "testivalokuva3");
insert into valokuva values(4, "paras_valokuva.png", 1237, "testivalokuva4");

insert into oman_kirjan_valokuvat values(10, 1);
insert into oman_kirjan_valokuvat values(10, 2);
insert into oman_kirjan_valokuvat values(20, 3);
insert into oman_kirjan_valokuvat values(30, 4);

-- Omat sarjat
insert into oma_sarja values(1, "Taru sormusten Herrasta (oma)", "Kokoelmani Taru Sormusten Herrasta - kirjoja", 1, 2);
insert into oma_sarja values(2, "Narnian tarinoita (oma)", "Kokoelmani Narnia -kirjoja", 2, 1);

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

