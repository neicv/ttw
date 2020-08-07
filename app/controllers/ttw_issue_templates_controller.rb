class TtwIssueTemplatesController < ApplicationController
    unloadable
  
    layout 'admin'

    before_filter :require_admin, :except => :index, :except => :list_templates
    before_filter :require_admin_or_api_request, :only => :index
    accept_api_auth :index, :list_templates, :load

  

    def index
      @ttw_issue_templates = TtwIssueTemplate.sorted.to_a
      respond_to do |format|
        format.html { render :layout => false if request.xhr? }
        format.api
      end
    end
  
    def new
      @ttw_issue_template = TtwIssueTemplate.new
      @ttw_trackers = Tracker.all
    end
  
    def create
      @ttw_issue_template = TtwIssueTemplate.new(ttw_params)
      if @ttw_issue_template.save
        flash[:notice] = l(:notice_successful_create)
        redirect_to ttw_issue_templates_path
      else
        render :action => 'new'
      end
      rescue
      flash[:error] = l(:error_unable_create_issue_template)
      redirect_to ttw_issue_templates_path
    end
  
    def edit
      @ttw_issue_template = TtwIssueTemplate.find(params[:id])
      @ttw_trackers = Tracker.all
    end
  
    def update
      @ttw_issue_template = TtwIssueTemplate.find(params[:id])
      if @ttw_issue_template.update_attributes(ttw_params)
        respond_to do |format|
          format.html {
            flash[:notice] = l(:notice_successful_update)
            redirect_to ttw_issue_templates_path(:page => params[:page])
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
  
    def list_templates
      @ttw_issue_templates = TtwIssueTemplate.sorted.to_a
      respond_to do |format|
        format.html do
          render action: '_list_templates',
                 layout: false,
                 locals: { ttw_issue_templates: @ttw_issue_templates,
                          }
        end
        format.api do
          render action: '_list_templates',
                 layout: false,
                 locals: { ttw_issue_templates: @ttw_issue_templates,
                          }
        end
        format.json { render json: @ttw_issue_templates }
      end
    end
  
    def destroy
      TtwIssueTemplate.find(params[:id]).destroy
      redirect_to ttw_issue_templates_path
    rescue
      flash[:error] = l(:error_unable_delete_template)
      redirect_to ttw_issue_templates_path
    end
    
    private
  
    def ttw_params
      params.require(:ttw_issue_template).permit(:name, :description, :tracker_str, :enabled)
    end
 
    def plugin_setting
      Setting.plugin_task_theme_wizard
    end

    def find_tracker
      @tracker = Tracker.find(params[:issue_tracker_id])
    end

    def find_project
      @project = Project.find(params[:project_id])
    rescue ActiveRecord::RecordNotFound
      render_404
    end 

  end
  