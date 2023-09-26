namespace :after_party do
  desc 'Deployment task: create_first_admin'
  task create_first_admin: :environment do
    puts "Running deploy task 'create_first_admin'"

    User.create(
      email: 'admin@localhost',
      name: 'Admin',
      password: 'password', # this is only for ease of demonstration
      admin: true
    )

    # Update task as completed.  If you remove the line below, the task will
    # run with every deploy (or every time you call after_party:run).
    AfterParty::TaskRecord
      .create version: AfterParty::TaskRecorder.new(__FILE__).timestamp
  end
end