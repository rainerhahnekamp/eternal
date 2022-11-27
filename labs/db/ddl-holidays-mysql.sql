create table holiday
(
  id          int auto_increment primary key,
  name        nvarchar(50) not null,
  description text         not null,
  cover_path  text         null
);

create table guide
(
  id        int auto_increment primary key,
  firstname nvarchar(50) not null,
  lastname  nvarchar(50) not null,
  email     nvarchar(50) not null,
  phone_nr  nvarchar(50) not null,
  bio       text         not null
);

create table holiday_trip
(
  id                int auto_increment primary key,
  from_date         timestamp,
  to_date           timestamp,
  price_single_room decimal(7, 2),
  price_double_room decimal(7, 2),
  currency          nvarchar(3),
  holiday_id        int references holiday (id),
  guide_id          int references guide (id)
);
