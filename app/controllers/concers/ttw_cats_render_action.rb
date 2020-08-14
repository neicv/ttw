module Concerns
  module TtwCatsRenderAction
    extend ActiveSupport::Concern
    # included do
    #   unloadable
    #   before_action :log_action, only: [:destroy]

    #   # logging action
    #   def log_action
    #     logger.info "[#{self.class}] #{action_name} called by #{User.current.name}" if logger
    #   end
    # end

    def render_for_move_with_format
      respond_to do |format|
        format.html { redirect_to action: 'index' }
        format.xml  { head :ok }
      end
    end

    # def plugin_setting
    #   @plugin_setting ||= Setting.plugin_redmine_issue_templates
    # end

    # def apply_all_projects?
    #   plugin_setting['apply_global_template_to_all_projects'].to_s == 'true'
    # end
  end
end
