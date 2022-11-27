-- guides

insert into guide(firstname, lastname, email, phone_nr, bio)  values('Deborah', 'McArthur', 'deb§rah.mcarthur@eternal-holidays.com', '+123321', 'Deborah visited Vancouver as a teenager and immediately fell in love with its landscape, culture, and people. She likes to share her passion for Canada with anybody who''s is interested');

insert into guide(firstname, lastname, email, phone_nr, bio)  values('Jonathan', 'Chen', 'jonanthan.chen@eternal-holidays.com', '+123321', 'Jonathan was born in Hongkong, when it was a British colony. Because of that, he can switch between West and East very easily. He enjoys introducing tourists to China and especially likes the landscape around Guilin');


-- holidays

insert into holiday(name, description) values('Canadian Rocky Mountains', 'Immerse yourself with the grandness of the Rocky Mountains. Known for its vastness, high-peeked mountains and its turquoise rivers. We start in Calgary, the entry to the Rockies. Relax and get yourself used to the Canadian flair (and the different time zone). From there, we get to our first destination, which is the popular Banff. A lots of hiking awaits and at the end, we will visit the most iconic lake: Lake Louise');

insert into holiday(name, description) values('China', 'We land in the capital, in Beijing. After getting rid of the jetlag, we visit the Great Wall, which is outside of the city. The next day, we visit the Forbidden City, which is not so forbidden anymore as it used to be. After some further sightseeing, we move on to Shanghai. This is the most "Western-style" city but still very Chinese. A must-see is the Yu Garden, the Bund, and - for the brave - the Shanghai tower. Other memorable visits of this holiday are Xian, Chengdu, and Chongqing, the largest city of China.');


-- holidayTrips

insert into holiday_trip(from_date, to_date, price_single_room, price_double_room, currency, holiday_id, guide_id) values('2023-04-12', '2023-04-25', 4210, 3899, 'EUR', 2, 2);

insert into holiday_trip(from_date, to_date, price_single_room, price_double_room, currency, holiday_id, guide_id) values('2023-10-20', '2023-11-02', 3912, 3459, 'EUR', 2, 2);

insert into holiday_trip(from_date, to_date, price_single_room, price_double_room, currency, holiday_id, guide_id) values('2023-07-15', '2023-07-30', 6500, 5399, 'EUR', 1, 1);
