class TtwCatsController < ApplicationController
  unloadable

  layout 'admin'
  # self.main_menu = false

  before_filter :require_admin, :except => :index
  before_filter :require_admin_or_api_request, :only => :index
  accept_api_auth :index

  def index
    @ttw_cats = TtwCat.sorted.to_a
    respond_to do |format|
      format.html { render :layout => false if request.xhr? }
      format.api
    end
  end

  def new
    @ttw_cat = TtwCat.new
  end
  
end
