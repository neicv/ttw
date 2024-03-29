Redmine::Plugin.register :task_theme_wizard do
  begin
    name 'Task Theme Wizard plugin'
    author 'Friendly-IT'
    description 'This is a plugin for Redmine'
    version '0.2.3'
    url 'http://localhost/redmine/plugin/task_theme_wizard'
    author_url 'https://friendly-it.ru/redmine'
    requires_redmine :version_or_higher => '3.1.0'
    settings 	:partial => 'settings/task_theme_wizard/plugin_settings',
        :default => { 'ttw_templates_enabled' => true, 
                      'ttw_api_key' => nil,
                      'ttw_assign_to_author' => false }


    menu :project_menu, :ttw_user_report, { controller: 'ttw_user_report', action: 'index' },
                                            caption: :label_user_report, 
                                            param: :project_id,
                                            after: :calendar

    menu :admin_menu, :ttw_cats, { controller: 'ttw_cats', action: 'index' },
                                    after:   :enumerations, 
                                    caption: :label_ttw_admin_title, html: { class: 'icon icon-attachment' }

    # permissions 
    project_module :task_theme_wizard do
      permission :edit_task_theme_wizard, task_theme_wizard: %i[new create edit update destroy move list_themes]
      permission :show_task_theme_wizard, task_theme_wizard: %i[index show load list_themes], ttw_user_report: %i[index show]
      permission :manage_task_theme_wizard, { task_theme_wizard_settings: %i[index edit] }, require: :member

      # permission :view_agile_queries, {:agile_boards => [:index, :create_issue], :agile_queries => :index}
      # permission :show_issue_templates, issue_templates: %i[index show load set_pulldown list_templates orphaned_templates]      
  
  end
  rescue ::Redmine::PluginRequirementError => e
    raise ::Redmine::PluginRequirementError.new(ttw_task_theme_message(e.message)) # rubocop:disable Style/RaiseArgs
  end
end
require 'task_theme_wizard'