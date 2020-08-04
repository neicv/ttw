module TtwCats
    module Hooks
      class Hooks  < Redmine::Hook::ViewListener
        render_on( :view_issues_form_details_top, :partial => 'hooks/ttw_cats/button_add')
      end
    end
  end