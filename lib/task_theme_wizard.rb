Rails.configuration.to_prepare do
   
  # link hooks
  require 'task_theme_wizard/hooks/view_hooks'
  # require 'task_theme_wizard/hooks/controller_issue_hook'
  require 'task_theme_wizard/hooks/controller_issues_new_before_save_hook'
  require 'task_theme_wizard/patches/issue_patch'

end

module TaskThemeWizard

  ISSUES_PER_COLUMN = 10

  class << self

    # settings[ttw_assign_to_author]

    # def issues_per_column
    #   by_settigns = Setting.plugin_task_theme_wizard['ttw_issues_per_column'].to_i
    #   by_settigns > 0 ? by_settigns : ISSUES_PER_COLUMN
    # end

    def issue_status_for_validate
      Setting.plugin_task_theme_wizard['ttw_issue_status_for_validate']
    end

  end
end