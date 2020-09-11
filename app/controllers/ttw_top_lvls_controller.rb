class TtwTopLvlsController < ApplicationController
  #unloadable

  layout 'admin'
  # self.main_menu = false

  #before_filter :global_authorize, :authorize
  before_action :require_admin, :except => :index, :except => :list_themes, 
      except: %i[move_order_higher move_order_lower move_order_to_top move_order_to_bottom move]
  before_action :require_admin_or_api_request, :only => :index
  accept_api_auth :index#, :list_themes #, :load


  helper :task_theme_wizard
  include TaskThemeWizardHelper
  #include Concerns::TaskThemeWizardCommon

  def index
    @ttw_top_lvls = TtwTopLvl.sorted
    respond_to do |format|
      format.html { render :layout => false if request.xhr? }
      format.api
    end
  end

  def new
    @ttw_top_lvl = TtwTopLvl.new
  end

  def create
    @ttw_top_lvl = TtwTopLvl.new(ttw_params)
    if @ttw_top_lvl.save
      flash[:notice] = l(:notice_successful_create)
      redirect_to ttw_top_lvls_path
    else
      render :action => 'new'
    end
    rescue
    flash[:error] = l(:error_unable_create_category)
    redirect_to ttw_top_lvls_path
  end

  def edit
    @ttw_top_lvl = TtwTopLvl.find(params[:id])
  end

  def update
    @ttw_top_lvl = TtwTopLvl.find(params[:id])
    if @ttw_top_lvl.update_attributes(ttw_params)
      respond_to do |format|
        format.html {
          flash[:notice] = l(:notice_successful_update)
          redirect_to ttw_top_lvls_path(:page => params[:page])
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
    TtwTopLvl.find(params[:id]).destroy
    redirect_to ttw_top_lvls_path
  rescue
    flash[:error] = l(:error_unable_delete_category)
    redirect_to ttw_top_lvls_path
  end
  
  private

  def ttw_params
    params.require(:ttw_top_lvl).permit(:name, :enabled, :position)
  end

  def move
    move_order(params[:to])
  end

  def global_authorize
    User.current.memberships.detect {|m| m.role.position == 1}
  end


  def plugin_setting
    Setting.plugin_task_theme_wizard
  end

  def enabled?
    enabled
  end
end
