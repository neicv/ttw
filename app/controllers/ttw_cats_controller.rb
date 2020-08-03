class TtwCatsController < ApplicationController
  unloadable

  layout 'admin'
  # self.main_menu = false

  before_filter :require_admin, :except => :index
  before_filter :require_admin_or_api_request, :only => :index
  accept_api_auth :index

  helper :queries
  include QueriesHelper
  helper :sort
  include SortHelper

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

  def create
    #@ttw_cat = TtwCat.new(params[:ttw_cat])
    @ttw_cat = TtwCat.new(ttw_params)
    if @ttw_cat.save
      flash[:notice] = l(:notice_successful_create)
      redirect_to ttw_cats_path
    else
      render :action => 'new'
    end
    rescue
    flash[:error] = l(:error_unable_create_category)
    redirect_to ttw_cats_path
  end

  def edit
    @ttw_cat = TtwCat.find(params[:id])
  end

  def update
    @ttw_cat = TtwCat.find(params[:id])
    if @ttw_cat.update_attributes(ttw_params)
      respond_to do |format|
        format.html {
          flash[:notice] = l(:notice_successful_update)
          redirect_to ttw_cats_path(:page => params[:page])
        }
        format.js { render :nothing => true }
      end
    else
      respond_to do |format|
        format.html { render :action => 'edit' }
        format.js { render :nothing => true, :status => 422 }
      end
    end
  end

  def destroy
    TtwCat.find(params[:id]).destroy
    redirect_to ttw_cats_path
  rescue
    flash[:error] = l(:error_unable_delete_category)
    redirect_to ttw_cats_path
  end
  
  private

  def ttw_params
    params.require(:ttw_cat).permit(:category, :sub_category, :enabled)
  end
end
