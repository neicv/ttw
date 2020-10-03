module TaskThemeWizard
  module Hooks
    class ControllerIssuesNewBeforeSaveHook < Redmine::Hook::ViewListener
      def controller_issues_new_before_save(context={})
        if context[:params] && context[:params][:issue]
          if (not context[:params][:issue][:assigned_to_id].nil?) and context[:params][:issue][:assigned_to_id].to_s==''
            context[:issue].assigned_to_id = context[:issue].author_id if context[:issue].new_record? and Setting.plugin_task_theme_wizard['ttw_assign_to_author']
          end 
        end
      end
    end
  end
end
