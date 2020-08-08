class TtwCatsController < ApplicationController
  unloadable

  layout 'admin'
  # self.main_menu = false

  #before_filter :global_authorize, :authorize
  before_action :require_admin, :except => :index, :except => :list_themes
  before_action :require_admin_or_api_request, :only => :index
  accept_api_auth :index, :list_themes, :load

  helper :task_theme_wizard
  include TaskThemeWizardHelper
  #include Concerns::TaskThemeWizardCommon

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

  def list_themes
    @ttw_issue_templates = TtwIssueTemplate.enabled.sorted.to_a
    @ttw_trackers = Tracker.sorted.to_a 
    @ttw_cats = TtwCat.enabled.sorted.to_a
    respond_to do |format|
      format.html do
        render action: '_list_themes',
               layout: false,
               locals: { ttw_cats: @ttw_cats,
                        ttw_issue_templates: @ttw_issue_templates,
                        ttw_trackers: @ttw_trackers
                        }
      end
      format.api do
        render action: '_list_themes',
               layout: false,
               locals: { ttw_cats: @ttw_cats,
                        ttw_issue_templates: @ttw_issue_templates,
                        ttw_trackers: @ttw_trackers
                        }
      end

      #format.json { render json: @ttw_cats }
      format.json do
        render action: '_list_themes',
               layout: false,
               locals: { ttw_cats: @ttw_cats,
                        ttw_issue_templates: @ttw_issue_templates,
                        ttw_trackers: @ttw_trackers
                        }
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

  def global_authorize
    User.current.memberships.detect {|m| m.role.position == 1}
  end

  def templates_enable?
    plugin_setting['empty'].to_s == 'true'
  end

  def plugin_setting
    Setting.plugin_task_theme_wizard
  end

  def enabled?
    enabled
  end
end
