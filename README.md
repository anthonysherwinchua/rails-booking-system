##### Prerequisites

The setups steps expect following tools installed on the system.

- Git
- Postgres
- Ruby [3.0.0](https://www.ruby-lang.org/en/news/2020/12/25/ruby-3-0-0-released/)
- Rails [7.0.8](https://rubyonrails.org/2023/9/9/Rails-7-0-8-has-been-released/)

##### 1. Check out the repository

```bash
git clone https://github.com/anthonysherwinchua/rails-booking-system
```

##### 2. Create and setup the database

For localhost, run the following commands via psql

```
CREATE DATABASE "rails-booking-system-development";
CREATE USER "booking-system-user" WITH ENCRYPTED PASSWORD '<strong-password>';
GRANT ALL PRIVILEGES ON DATABASE "rails-booking-system-development" TO "booking-system-user";
ALTER USER "rails-booking-system-development" CREATEDB;
```

note: you can get the <strong-password> in the development's credential via the following command
`EDITOR=cat rails credentials:edit -e development`

For staging/production, after you create the database in Amazon, you need to update the
database configuration in the respective credentials

Run the following commands to setup the database.

```ruby
bundle exec rake db:setup
```

##### 3. Start the Rails server

You can start the rails server using the command given below.

```ruby
bundle exec rails s
```

And now you can visit the site with the URL http://localhost:3000