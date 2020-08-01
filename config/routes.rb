# Plugin's routes
# See: http://guides.rubyonrails.org/routing.html

#get 'ttw_cats', :to => 'ttw_cats#index'

RedmineApp::Application.routes.draw do

    # create attchment categories in administration menu
    resources :ttw_cats, :except => :show
      
    # auto completes for hints for description
    # match 'auto_completes/attachment', :to => 'auto_completes#attachment_descriptions', :via => :get, :as => 'auto_complete_attachment_descriptions'
  
  end