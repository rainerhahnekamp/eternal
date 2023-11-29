create table country (
  id int primary key auto_increment,
  name nvarchar(50) not null
);

alter table customer add country_id int references country(id);
