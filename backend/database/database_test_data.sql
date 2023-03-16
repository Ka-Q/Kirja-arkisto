
-- Testidataa tietokantaan 

-- Kuvien tyypit
insert into kuva_tyyppi values(1, "etukansi");
insert into kuva_tyyppi values(2, "takakansi");
insert into kuva_tyyppi values(3, "sivu");

-- Kirjahyllyt
insert into kirjahylly values (1, "Pekan kirjahylly");


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
insert into kirja values(11, "Harry Potter ja viisasten kivi", 1, "Ensimmäinen osa Harry Potter -sarjaa", "J.K. Rowling", "-", 1997, 50);
insert into kirja values(12, "The Shining", NULL, "A horror novel about a family staying at an isolated hotel", "Stephen King", "-", 1977, 30);
insert into kirja values(13, "Watchmen", NULL, "A graphic novel exploring the dark side of superheroes", "Alan Moore", "Dave Gibbons", 1986, 10);
insert into kirja values(14, "Murder on the Orient Express", NULL, "A classic murder mystery novel set on a train", "Agatha Christie", "-", 1934, 40);
insert into kirja values(15, "A Game of Thrones", 1, "The first book in the A Song of Ice and Fire series", "George R.R. Martin", "-", 1996, 20);
insert into kirja values(16, "The Old Man and the Sea", NULL, "A short novel about an aging fisherman's struggle with a giant marlin", "Ernest Hemingway", "-", 1952, 25);


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


-- Kirjojen kuvat
insert into kuva values(1, "sormuksen_ritarit_etukansi.gif",  1, 1999, "Kalle", "Maalaus", "Kuva Sormuksen ritareiden etukannesta");
insert into kuva values(2, "sormuksen_ritarit_etukansi.gif", 2, 1999, "Kalle", "Maalaus", "Kuva Sormuksen ritareiden etukannesta");
insert into kuva values(3, "kaksi_tornia_etukansi.gif", 1, 1999, "Kalle", "Maalaus", "Kuva kaksi tornia etukannesta");
insert into kuva values(4, "kaksi_tornia_etukansi.gif", 2, 1999, "Kalle", "Maalaus", "Kuva kaksi tornia etukannesta");
insert into kuva values(5, "kuninkaan_paluu_etukansi.gif", 3, 1999, "Kalle", "Maalaus", "Kuva Kuninkaan paluun etukannesta");

insert into kuva values(6, "Taru_sormusten_herrasta_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva Sormuksen ritareiden etukannesta");
insert into kuva values(7, "Taru_sormusten_herrasta_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva Sormuksen ritareiden etukannesta");

insert into kuva values(8, "prinssi_kaspian_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuvaprinssi kaspian etukannesta");
insert into kuva values(9, "kaspianin_matka_maailman_aariin_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva kaspianin matka maailman ääriin etukannesta");

-- kuvat paikoilleen
insert into kirjan_kuvat values(1, 1);
insert into kirjan_kuvat values(1, 2);
insert into kirjan_kuvat values(2, 3);
insert into kirjan_kuvat values(2, 4);
insert into kirjan_kuvat values(3, 5);

insert into kirjan_kuvat values(4, 6);
insert into kirjan_kuvat values(10, 7);

insert into kirjan_kuvat values(5, 8);
insert into kirjan_kuvat values(6, 9);

insert into valokuva values(1, "testivalokuva", 1234, "testivalokuva");
insert into valokuva values(2, "testivalokuva2", 1235, "testivalokuva2");
insert into valokuva values(3, "testivalokuva3", 1236, "testivalokuva3");
insert into valokuva values(4, "testivalokuva4", 1237, "testivalokuva4");

insert into oman_kirjan_valokuvat values(10, 1);
insert into oman_kirjan_valokuvat values(10, 2);
insert into oman_kirjan_valokuvat values(20, 3);
insert into oman_kirjan_valokuvat values(30, 4);

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

-- Sarjat hyllyyn
insert into hyllyn_sarjat values(1, 1);
insert into hyllyn_sarjat values(1, 2);
