create table HOLIDAY
(
  ID          int auto_increment primary key,
  NAME        nvarchar(50) not null,
  DESCRIPTION text not null,
  COVER_PATH       text null
);

create table GUIDE
(
  ID        int auto_increment primary key,
  FIRSTNAME nvarchar(50) not null,
  LASTNAME  nvarchar(50) not null,
  EMAIL     nvarchar(50) not null,
  PHONE_NR   nvarchar(50) not null,
  BIO       text not null
);

create table HOLIDAY_TRIP
(
  ID              int auto_increment primary key,
  FROM_DATE        timestamp,
  TO_DATE          timestamp,
  PRICE_SINGLE_ROOM decimal(7, 2),
  PRICE_DOUBLE_ROOM decimal(7, 2),
  CURRENCY        nvarchar(3),
  HOLIDAY_ID       int references Holiday (Id),
  GUIDE_ID         int references Guide (Id)
);
