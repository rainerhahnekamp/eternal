create table customer (
  id int primary key auto_increment,
  firstname nvarchar(50),
  name nvarchar(50),
  has_gdpr tinyint,
  created_at datetime
)
