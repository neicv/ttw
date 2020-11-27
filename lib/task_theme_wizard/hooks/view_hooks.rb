module TaskThemeWizard # TtwCats
    module Hooks
      class Hooks  < Redmine::Hook::ViewListener
        render_on( :view_issues_form_details_top, :partial => 'hooks/ttw_cats/button_add')
        # File.open("some_file_name.txt", "w") { |file| file.puts "I wrote this with ruby!"}
      end
    end
  end