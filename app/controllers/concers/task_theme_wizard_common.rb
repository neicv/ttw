# frozen_string_literal: true

module Concerns
    module TaskThemeWizardCommon
      extend ActiveSupport::Concern
  
      class InvalidTemplateFormatError < StandardError; end
  
 
      def list_themes
        #tracker_id = params[:tracker_id]
        #project_id = params[:project_id]
        #render plain: {} && return if tracker_id.blank?
  
        #custom_fields = core_fields_map_by_tracker_id(tracker_id: tracker_id, project_id: project_id).merge(custom_fields_map_by_tracker_id(tracker_id))
        render plain: { ttw_cats: ttw_cats }.to_json
      end
  

  
    #   def builtin_fields_json
    #     value = template_params[:builtin_fields].blank? ? {} : JSON.parse(template_params[:builtin_fields])
    #     return value if value.is_a?(Hash)
  
    #     raise InvalidTemplateFormatError
    #   end

  
      def destroy
        raise NotImplementedError, "You must implement #{self.class}##{__method__}"
      end

    end
  end
  