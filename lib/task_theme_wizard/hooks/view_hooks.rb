module TaskThemeWizard # TtwCats
    module Hooks
      class Hooks  < Redmine::Hook::ViewListener
        render_on( :view_issues_form_details_top, 
        :partial => 'hooks/ttw_cats/button_add')
        
        render_on :view_layouts_base_html_head,
        :partial => "hooks/ttw_cats/headers"
      end
    end
  end