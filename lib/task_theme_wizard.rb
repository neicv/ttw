Rails.configuration.to_prepare do

  # redmine core plugin
  # require 'task_theme_wizard/patches/acts_as_attachable_patch'

  # patch helpers and controllers  
  # require 'task_theme_wizard/patches/application_helper_patch'  
   
  # link hooks
  require 'task_theme_wizard/hooks/view_hooks'

end