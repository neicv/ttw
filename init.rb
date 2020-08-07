Redmine::Plugin.register :task_theme_wizard do
  name 'Task Theme Wizard plugin'
  author 'neicv'
  description 'This is a plugin for Redmine'
  version '0.0.8'
  url 'http://localhost/redmine/plugin/task_theme_wizard'
  author_url 'https://friendly-it.ru/redmine'
  requires_redmine :version_or_higher => '3.1.2'
  settings :default => {'empty' => true}, :partial => 'settings/task_theme_wizard/plugin_settings'

  # this adds attachment categories to the administration menu
  menu :admin_menu, 
  :ttw_cats, # name and id
  { controller: 'ttw_cats', action: 'index' },
  after:   :enumerations, 
  html:    { class: 'icon icon-attachment' },
  caption: :label_ttw_admin_title

  # permissions 
  project_module :task_theme_wizard do
    permission :edit_task_theme_wizard, task_theme_wizard: %i[new create edit update destroy list_themes]
    permission :show_task_theme_wizard, task_theme_wizard: %i[index show load list_themes]
                                      
    permission :manage_task_theme_wizard, { task_theme_wizard_settings: %i[index edit] }, require: :member

  end

end

require 'task_theme_wizard'
