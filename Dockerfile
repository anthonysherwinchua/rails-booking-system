# Use the Ruby 2.7.1 image as the base image
FROM ruby:2.7.1

# Update the package lists before installing any packages
RUN apt-get update -qq

# Install essential dependencies
RUN apt-get install -y \
    build-essential \
    ca-certificates \
    netcat-traditional \
    vim \
    libpq-dev

# Install Node.js 14.x from nodesource
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

# Install Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
  && apt-get update -qq \
  && apt-get install -y yarn \
  && apt-get install -y --no-install-recommends apt-utils

# Clean and trim down the size of the image by removing unnecessary data
RUN apt-get clean autoclean
RUN apt-get autoremove -y
RUN rm -Rf /var/lib/apt
RUN rm -Rf /var/lib/dpkg
RUN rm -Rf /var/lib/cache
RUN rm -Rf /var/lib/log

# Set the working directory for the application
ENV APP_HOME /rails_booking_system
RUN mkdir ${APP_HOME}
WORKDIR ${APP_HOME}

# Copy the Gemfile and Gemfile.lock to the container
COPY Gemfile ${APP_HOME}/Gemfile
COPY Gemfile.lock ${APP_HOME}/Gemfile.lock

# Ensure Bundler version 2.0 is installed
RUN gem install bundler -v 2.0.2

# Install Ruby gems
RUN bundle install

# Copy the entire Rails application into the container
COPY . ${APP_HOME}

# Expose the port specified in the environment variable PORT
EXPOSE ${PORT}

# Set environment variables
ARG RAILS_ENV
ARG RAILS_MASTER_KEY

ENV RAILS_ENV=$RAILS_ENV
ENV RAILS_MASTER_KEY=$RAILS_MASTER_KEY

# Precompile assets
RUN RAILS_ENV=${RAILS_ENV} RAILS_MASTER_KEY=${RAILS_MASTER_KEY} bundle exec rake assets:precompile

# Define the ENTRYPOINT and CMD as needed for your Rails application
# ENTRYPOINT ["sh", "./entrypoint.sh"]
# CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
