CREATE TABLE Books (
    title VARCHAR(1000),
    author VARCHAR(500),
    ISBN VARCHAR(120),
    cover VARCHAR(1000), --Store file path of cover image
    publishingDate DATE,
    publisher VARCHAR(500),
    PRIMARY KEY (title,author)

);

CREATE TABLE Users (
    username VARCHAR(100) PRIMARY KEY,
    pswd VARCHAR(100), --Password
    email VARCHAR(500)
);

CREATE TABLE ReadingStats (
    username VARCHAR(100),
    book VARCHAR(1000),
	author VARCHAR(100),
    dateStarted DATE,
    dateCompleted DATE,
    formatRead VARCHAR(100),
    pageNum INT,
    audioLength TIME,
    currentPage INT,
    Rating FLOAT,
    readingStatus VARCHAR(100), --TBR, Currently Reading, Completed
    cover VARCHAR(1000),
	PRIMARY KEY(username, book, dateStarted),
    FOREIGN KEY(username) REFERENCES Users(username),
    FOREIGN KEY(book, author) REFERENCES Books(title, author)
    
);

CREATE TABLE Discussions (
    book VARCHAR(1000) PRIMARY KEY,
	author VARCHAR(100),
    FOREIGN KEY(book, author) REFERENCES Books(title, author)
);

CREATE TABLE postComments (
    discussion VARCHAR(100),
    username VARCHAR(100),
    postComment VARCHAR(1500),
	PRIMARY KEY(discussion, username, postComment),
    FOREIGN KEY(discussion) REFERENCES Discussions(book),
    FOREIGN KEY(username) REFERENCES Users(username)
);

INSERT INTO Books (title, author, ISBN, cover, publishingDate, publisher)
VALUES ('The Invisible Life of Addie Larue', 'V.E. Schwab', '9780765387561', '/images/AddieLarueCover.jpg', '2020-10-06', 'Tor Books');

INSERT INTO Books (title, author, ISBN, cover, publishingDate, publisher)
VALUES ('Pageboy', 'Elliot Page', '9781250878359', '/images/Pageboy.jpg', '2023-06-06', 'Flat');

INSERT INTO Books (title, author, ISBN, cover, publishingDate, publisher)
VALUES ('Carrie Soto Is Back', 'Taylor Jenkins Reid', '9780593158685', '/images/Carrie-Soto-Is-Back.jpg', '2022-08-30', 'Ballantine Books');

INSERT INTO Books (title, author, ISBN, cover, publishingDate, publisher)
VALUES ('Pachinko', 'Min Jin Lee', '9781455563920', '/images/Pachinko.jpg', '2017-11-14', 'Grand Central Publishing');

INSERT INTO Books (title, author, ISBN, cover, publishingDate, publisher)
VALUES ('Mistborn: The Final Empire', 'Brandon Sanderson', '9781250868282', '/images/Mistborn.jpg', '2006-07-17', 'Tor Books');

INSERT INTO Books (title, author, ISBN, cover, publishingDate, publisher)
VALUES ('Daisy Jones & the Six', 'Taylor Jenkins Reid', '9781524798628 ', '/images/Daisy-Jones-and-the-Six.jpg', '2019-03-05', 'Ballantine Books');

INSERT INTO Books (title, author, ISBN, cover, publishingDate, publisher)
VALUES ('The Midnight Library', 'Matt Haig', '9780525559474', '/images/The-Midnight-Library.jpg', '2020-09-29', 'Viking');

INSERT INTO Books (title, author, ISBN, cover, publishingDate, publisher)
VALUES ('The Song of Achilles', 'Madeline Miller', '9781408816035', '/images/The-Song-of-Achilles.jpg', '2011-09-20', 'Bloomsbury Publishing');

INSERT INTO Books (title, author, ISBN, cover, publishingDate, publisher)
VALUES ('Vinland Saga Omnibus, Vol. 1', 'Makoto Yukimura', '9781612624204', '/images/Vinland-Saga-volume-1.jpg', '2013-10-14', 'Kodansha Comics');

INSERT INTO Books (title, author, ISBN, cover, publishingDate, publisher)
VALUES ('Lessons in Chemistry', 'Bonnie Garmus', '9780593314487', '/images/LessonsInChemistry.jpg', '2022-04-05', 'Doubleday');

INSERT INTO Books (title, author, ISBN, cover, publishingDate, publisher)
VALUES ('The Poppy War', 'R.F. Kuang', '9780062662590 ', '/images/PoppyWarCover.jpg', '2018-05-1', 'Harper Voyager');

INSERT INTO Books (title, author, ISBN, cover, publishingDate, publisher)
VALUES ('Tress of the Emerald Sea', 'Brandon Sanderson', '9781250899651', '/images/TressOfTheEmeraldSea.jpg', '2023-04-04', 'Tor Books');

INSERT INTO Books (title, author, cover)
VALUES ('Aesop''s Fables', 'Aesop', '/images/Aesops-Fables.jpg');


INSERT INTO Discussions(book, author) VALUES ('The Invisible Life of Addie Larue', 'V.E. Schwab');
INSERT INTO Discussions(book, author) VALUES ('Lessons in Chemistry', 'Bonnie Garmus');
INSERT INTO Discussions(book, author) VALUES ('Pageboy', 'Elliot Page');
INSERT INTO Discussions(book, author) VALUES ('The Poppy War', 'R.F. Kuang');
INSERT INTO Discussions(book, author) VALUES ('Tress of the Emerald Sea', 'Brandon Sanderson');

INSERT INTO Users(username, pswd, email) VALUES ('example', 'examplepass', 'example@email.com');

INSERT INTO ReadingStats(username, book, author, dateStarted, pageNum, currentPage, readingStatus, cover) VALUES ('example', 'Pageboy', 'Elliot Page', '2025-10-28', 400, 45, 'Currently Reading', '\images\Pageboy.jpg');
INSERT INTO ReadingStats(username, book, author, dateStarted, dateCompleted, pageNum, readingStatus, cover) VALUES ('example', 'The Poppy War', 'R.F. Kuang', '2025-9-12', '2025-9-22', 492, 'Completed', '\images\PoppyWarCover.jpg');
