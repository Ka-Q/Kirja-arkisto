
-- Testidataa tietokantaan 

-- Roolit
	insert into rooli values (1, "Admin", "admin-rooli");
	insert into rooli values (2, "Käyttäjä", "käyttäjä-rooli");

-- Käyttäjät
	insert into kayttaja values(1, "admin", "admin", 1);
	insert into kayttaja values(2, "käyttäjä", "käyttäjä", 2);

-- Kuvien tyypit
	insert into kuva_tyyppi values(1, "etukansi");
	insert into kuva_tyyppi values(2, "takakansi");
	insert into kuva_tyyppi values(3, "sivu");

-- Oletuskirja:
	insert into kirja values(-1, "Poistettu kirja", 1, "Tämä kirja on poistettu tietokannasta", "-", "-", 0000, 0);

-- Sarjat ja kirjat kuvineen:

-- Taru sormusten Herrasta

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

	-- Taru Sormusten Herrasta -kirjojen kuvat
	insert into kuva values(1, "sormuksen_ritarit_etukansi.gif",  1, 1999, "Kalle", "Maalaus", "Kuva Sormuksen ritareiden etukannesta");
	insert into kuva values(2, "sormuksen_ritarit_takakansi.gif", 2, 1999, "Kalle", "Maalaus", "Kuva Sormuksen ritareiden takakanesta");
	insert into kuva values(3, "kaksi_tornia_etukansi.gif", 1, 1999, "Kalle", "Maalaus", "Kuva kaksi tornia etukannesta");
	insert into kuva values(4, "kaksi_tornia_takakansi.gif", 2, 1999, "Kalle", "Maalaus", "Kuva kaksi tornia takakannesta");
	insert into kuva values(5, "kuninkaan_paluu_etukansi.gif", 1, 1999, "Kalle", "Maalaus", "Kuva Kuninkaan paluun etukannesta");

	-- Taru Sormusten Herrasta kuvat kirjoille
	insert into kirjan_kuvat values(1, 1);
	insert into kirjan_kuvat values(1, 2);
	insert into kirjan_kuvat values(2, 3);
	insert into kirjan_kuvat values(2, 4);
	insert into kirjan_kuvat values(3, 5);

-- Narnia

	-- Narnia -sarja
	insert into sarja values(2, "Narnian tarinat", "Narnian tarinat on seitsemän lapsille suunnatun fantasiakirjan muodostama sarja");

	-- Narnia -kirjat
	insert into kirja values(4, "Velho ja leijona", 1, "Ensimmäinen osa Narnia-sarjaa", "C. S. Lewis", "-", 1950, 16);
	insert into kirja values(5, "Prinssi Kaspian", 2, "Toinen osa Narnia-sarjaa", "C. S. Lewis", "-", 1951, 16);
	insert into kirja values(6, "Kaspianin matka maailman ääriin", 3, "Kolmas osa Narnia-sarjaa", "C. S. Lewis", "-", 1952, 15);
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

	-- Narnia -kuvat
	insert into kuva values(6, "velho_ja_leijona_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva Velhon ja leijonan etukannesta");
	insert into kuva values(7, "narnian_viimeinen_taistelu_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva Narnian viimeinen taistelu etukannesta");
	insert into kuva values(8, "prinssi_kaspian_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva prinssi kaspian etukannesta");
	insert into kuva values(9, "kaspianin_matka_maailman_aariin_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva kaspianin matka maailman ääriin etukannesta");
	insert into kuva values(10, "Taru_sormusten_herrasta_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva Hopeinen tuoli etukannesta");
	insert into kuva values(11, "Taru_sormusten_herrasta_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva Hevonen ja poika etukannesta");
	insert into kuva values(12, "Taru_sormusten_herrasta_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva Taikurin sisarenpoika etukannesta");

	-- Narnia kuvat kirjoille
	insert into kirjan_kuvat values(4, 6);
	insert into kirjan_kuvat values(10, 7);
	insert into kirjan_kuvat values(5, 8);
	insert into kirjan_kuvat values(6, 9);
	insert into kirjan_kuvat values(7, 10);
	insert into kirjan_kuvat values(8, 11);
	insert into kirjan_kuvat values(9, 12);

-- Harry Potter

	-- Harry Potter -sarja
		insert into sarja values(3,"Harry Potter","Harry Potter -sarjan 7 osaa");
        
	-- Harry Potter -kirjat
		insert into kirja values(11, "Harry Potter ja viisasten kivi", 1, "Ensimmäinen osa Harry Potter -sarjaa", "J.K. Rowling", "-", 1997, 50);
		INSERT INTO kirja VALUES (12, 'Harry Potter ja salaisuuksien kammio', 2, 'Toinen osa Harry Potter -sarjaa', 'J.K. Rowling', '-', 1998, 50);
		INSERT INTO kirja VALUES (13, 'Harry Potter ja Azkabanin vanki', 3, 'Kolmas osa Harry Potter -sarjaa', 'J.K. Rowling', '-', 1999, 50);
		INSERT INTO kirja VALUES (14, 'Harry Potter ja liekehtivä pikari', 4, 'Neljäs osa Harry Potter -sarjaa', 'J.K. Rowling', '-', 2000, 50);
		INSERT INTO kirja VALUES (15, 'Harry Potter ja Feeniksin kilta', 5, 'Viides osa Harry Potter -sarjaa', 'J.K. Rowling', '-', 2003, 50);
		INSERT INTO kirja VALUES (16, 'Harry Potter ja puoliverinen prinssi', 6, 'Kuudes osa Harry Potter -sarjaa', 'J.K. Rowling', '-', 2005, 50);
		INSERT INTO kirja VALUES (17, 'Harry Potter ja kuoleman varjelukset', 7, 'Viimeinen osa Harry Potter -sarjaa', 'J.K. Rowling', '-', 2007, 50);

	-- Harry Potter -kirjat sarjaan
		insert into sarjan_kirjat values(3,11);
		insert into sarjan_kirjat values(3,12);
		insert into sarjan_kirjat values(3,13);
		insert into sarjan_kirjat values(3,14);
		insert into sarjan_kirjat values(3,15);
		insert into sarjan_kirjat values(3,16);
		insert into sarjan_kirjat values(3,17);

	-- Harry Potter -kuvat
		insert into kuva values(13, "HP1_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva Viisasten kiven etukannesta");
		insert into kuva values(14, "HP2_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva Salaisuuksien kammion etukannesta");
		insert into kuva values(15, "HP3_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva Azkabanin vangin etukannesta");
		insert into kuva values(16, "HP4_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva Liekehtivän pikarin etukannesta");
		insert into kuva values(17, "HP5_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva Feeniksin killan etukannesta");
		insert into kuva values(18, "HP6_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva Puoliverisen prinssin etukannesta");
		insert into kuva values(19, "HP7_etukansi.jpg", 1, 1999, "Kalle", "Maalaus", "Kuva Kuoleman varjelusten etukannesta");

	-- Harry Potter kuvat kirjoille
		insert into kirjan_kuvat values(11, 13);
		insert into kirjan_kuvat values(12, 14);
		insert into kirjan_kuvat values(13, 15);
		insert into kirjan_kuvat values(14, 16);
		insert into kirjan_kuvat values(15, 17);
		insert into kirjan_kuvat values(16, 18);
		insert into kirjan_kuvat values(17, 19);

-- Young samurai
	-- young samurai -sarja
		Insert into sarja values(4,"Young Samurai","7-osaa");
        
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


-- Omat kirjat
	-- Käyttäjä
		-- Taru Sormusten Herrasta:
			insert into oma_kirja values(10, 2, 12.90, "Kirpputorilöytö. Aika huonossa kunnossa ja muutama sivu irtonaisina välissä.", 2002, "2019-10-12", 1, 2); 
			insert into oma_kirja values(20, 5, 7.50, "Antikvariaatista. Hyvä hinta ja kirja on priimakunnossa.", 2004, "2021-11-11", 2, 2);
			insert into oma_kirja values(30, 4, 6.50, "Kirpputorilöytö. Suurehko repeämä kolmannen sivun alalaidassa, mutta korjattu huolella.", 2004, "2021-11-11", 1, 2);
            insert into oma_kirja values(80, 5, 12.90, "Antikvariaatista. Varjeltu kappale toiselta keräilijältä. Kuin uusi", 2002, "2019-10-12", 3, 2); 
			insert into oma_kirja values(90, 1, 7.50, "Kirpputorilöytö. Hirveässä kunnossa ja maksoin tästä ryöstöhinnan. En ollut huomannut, että keskelä olevat sivut olivat liimattuna yhteen... ;_;", 2004, "2021-11-11", 2, 2);
			insert into oma_kirja values(100, 4, 6.50, "Kirpputorilöytö.", 2004, "2021-11-11", 1, 2);
            
	-- Admin
		-- Narnia:
			insert into oma_kirja values(40, 5, 9.25, "Poistomyynnistä", 2010, "2021-11-12", 4, 1);
			insert into oma_kirja values(50, 5, 9.25, "Poistomyynnistä", 2010, "2021-11-12", 5, 1);
			insert into oma_kirja values(60, 5, 9.25, "Poistomyynnistä", 2010, "2021-11-12", 6, 1);
			insert into oma_kirja values(70, 3, 5.00, "Antikvariaatista", 2007, "2022-06-08", 10, 1);

-- Omat sarjat
	-- Käyttäjä
		-- Taru sormusten herrasta (kaikki)
			insert into oma_sarja values(1, "Taru sormusten Herrasta (kaikki)", "Kokoelmani Taru Sormusten Herrasta - kirjoja", 1, 2);
			
            -- Omaan sarjaan kirjat
			insert into oman_sarjan_kirjat values(1, 10, 2);
			insert into oman_sarjan_kirjat values(1, 20, 2);
			insert into oman_sarjan_kirjat values(1, 30, 2);
            insert into oman_sarjan_kirjat values(1, 80, 2);
			insert into oman_sarjan_kirjat values(1, 90, 2);
			insert into oman_sarjan_kirjat values(1, 100, 2);
            
		-- Taru Sormuseten herrasta (hyväkuntoinen)
            insert into oma_sarja values(3, "Taru sormusten Herrasta (hyväkuntoinen)", "Omistamani hyväkuntoiset Taru Sormusten Herrasta - kirjat. Ehkäpä näitä kehtaisi jopa myydä jollekin...", 1, 2);
            
            -- Omaan sarjaan kirjat
            insert into oman_sarjan_kirjat values(3, 100, 2);
			insert into oman_sarjan_kirjat values(3, 80, 2);
            insert into oman_sarjan_kirjat values(3, 20, 2);
			insert into oman_sarjan_kirjat values(3, 30, 2);
            
   -- Admin
		-- Narnian tarinoita (oma)
			insert into oma_sarja values(2, "Narnian tarinoita (oma)", "Kokoelmani Narnia -kirjoja", 2, 1);
			
			-- Omaan sarjaan kirjat
			insert into oman_sarjan_kirjat values(2, 40, 1);
			insert into oman_sarjan_kirjat values(2, 50, 1);
			insert into oman_sarjan_kirjat values(2, 60, 1);
			insert into oman_sarjan_kirjat values(2, 70, 1);
       
       
-- Valokuvat
	-- Sormuksen ritarit
	insert into valokuva values(1, "sormuksenritarit_etukansi_vkuva.jpg", -200, "valokuva etukannesta", 2);
	insert into valokuva values(2, "sormuksenritarit_takakansi_vkuva.jpg", -100, "valokuva takakannesta", 2);
    insert into valokuva values(7, "sormuksenritarit_s0_vkuva.jpg", 0, "valokuva ensimmäiseltä aukeamalta", 2);
    
    -- omalle kirjalle
    insert into oman_kirjan_valokuvat values(10, 1, 2);
	insert into oman_kirjan_valokuvat values(10, 2, 2);
	insert into oman_kirjan_valokuvat values(10, 7, 2);

	-- Kaksi tornia
	insert into valokuva values(3, "kaksitornia_etukansi_vkuva.jpg", -200, "valokuva etukannesta", 2);
	insert into valokuva values(4, "kaksitornia_takakansi_vkuva.jpg", -100, "valokuva takakannesta", 2);
    
    insert into valokuva values(8, "kaksitornia_etukansi_vkuva2.jpg", -200, "valokuva etukannesta", 2);
    
    -- omalle kirjalle
    insert into oman_kirjan_valokuvat values(20, 3, 2);
	insert into oman_kirjan_valokuvat values(20, 4, 2);
    
    insert into oman_kirjan_valokuvat values(90, 8, 2);
    
    -- Kuninkaan paluu
	insert into valokuva values(5, "kuninkaanpaluu_etukansi_vkuva.jpg", -200, "valokuva etukannesta", 2);
	insert into valokuva values(6, "kuninkaanpaluu_takakansi_vkuva.jpg", -100, "valokuva takakannesta", 2);
    
    
    -- omalle kirjalle
    insert into oman_kirjan_valokuvat values(80, 5, 2);
	insert into oman_kirjan_valokuvat values(80, 6, 2);
	
    -- vkuva 8 omakirja 100 



