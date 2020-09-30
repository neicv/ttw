# Plugin's routes
# See: http://guides.rubyonrails.org/routing.html

#get 'ttw_cats', :to => 'ttw_cats#index'
#post 'ttw_cats/list_themes', :to => 'ttw_cats#list_themes'

RedmineApp::Application.routes.draw do

  resources :ttw_cats, :except => :show
  resources :ttw_top_lvls, :except => :show
  resources :ttw_user_report, :except => :show
  get 'projects/:project_id/ttw_user_report', to: 'ttw_user_report#index'
    #do

    #   post 'list_themes', :to => 'ttw_cats#list_themes'
    # end
      
    # auto completes for hints for description
    # match 'auto_completes/attachment', :to => 'auto_completes#attachment_descriptions', :via => :get, :as => 'auto_complete_attachment_descriptions'
    # match 'ttw_cats/:ttw_cat_id/ttw_cat/move/:id', to: 'ttw_cats#move_to', via: [:get, :post, :patch, :put]

    resources :ttw_cats, only: %i[load preview list_themes] do
      get 'load', on: :collection
      post 'list_themes', on: :collection
    end

    # resources :ttw_cats, :except => :show  do
    #   collection do
    #     #match 'fields', :via => [:get, :post]
    #   end
    # end


    resources :ttw_issue_templates, :except => :show 

    

    resources :ttw_issue_templates, only: %i[load preview list_templates] do
      get 'load', on: :collection
      post 'list_templates', on: :collection
    end
  
  end