# Plugin's routes
# See: http://guides.rubyonrails.org/routing.html

#get 'ttw_cats', :to => 'ttw_cats#index'
#post 'ttw_cats/list_themes', :to => 'ttw_cats#list_themes'

RedmineApp::Application.routes.draw do

    # create attchment categories in administration menu
    resources :ttw_cats, :except => :show 
    #do

    #   post 'list_themes', :to => 'ttw_cats#list_themes'
    # end
      
    # auto completes for hints for description
    # match 'auto_completes/attachment', :to => 'auto_completes#attachment_descriptions', :via => :get, :as => 'auto_complete_attachment_descriptions'

    resources :ttw_cats, only: %i[load preview list_themes] do
      get 'load', on: :collection
      post 'list_themes', on: :collection
    end
  
  end