create table Holiday
(
    Id          int auto_increment primary key,
    Name        nvarchar(50) not null,
    Description text         not null
);

create table Guide
(
    Id        int auto_increment primary key,
    Firstname nvarchar(50) not null,
    Lastname  nvarchar(50) not null,
    Email     nvarchar(50) not null,
    PhoneNr   nvarchar(50) not null,
    Bio       text         not null
);

create table HolidayTrip
(
    Id              int auto_increment primary key,
    FromDate        timestamp,
    ToDate          timestamp,
    PriceSingleRoom decimal(7, 2),
    PriceDoubleRoom decimal(7, 2),
    Currency        nvarchar(3),
    HolidayId       int references Holiday (Id),
    GuideId         int references Guide (Id)
);
