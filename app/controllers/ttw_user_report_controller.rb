class TtwUserReportController < ApplicationController
  layout 'admin'

  before_filter :require_admin, :except => :show
  before_filter :find_user, :only => [:index, :show]
  accept_api_auth :index, :show

  helper :sort
  include SortHelper
  # helper :custom_fields
  # include CustomFieldsHelper
  helper :principal_memberships

  def index
    sort_init 'login', 'asc'
    sort_update %w(login firstname lastname admin created_on last_login_on)

    unless @user.visible?
      render_404
      return
    end

    @status = params[:status] || 1
    @users = Project.find(params[:project_id]).users.to_a
    @project = Project.find(params[:project_id])
    # @users =  scope.memberships.where(:project_id => params[:project_id]).order(sort_clause) #.limit(@limit).offset(@offset).to_a

    @days = Setting.activity_days_default.to_i
    # @days = 60

    if params[:from]
      @date_to = Date.today + 1
      begin; @date_from = params[:from].to_date; rescue; end
    end

    if params[:end]
      begin; @date_to = params[:end].to_date; rescue; end
    end

    @date_to ||= Date.today + 1
    @date_from ||= @date_to - @days

    @author = @user

    # show projects based on current user visibility
    @memberships = @user.memberships.where(Project.visible_condition(User.current)).to_a

    # @safe_attributes = @issues.map(&:safe_attribute_names).reduce(:&)

    @activity = Redmine::Activity::Fetcher.new(User.current, :author => @user, :project => @project) 
    @activity.scope_select {|t| !params["show_#{t}"].nil?}
    @activity.scope = (@author.nil? ? :default : :all) if @activity.scope.empty?
    events = @activity.events(@date_from, @date_to)
    # events = @activity.events(nil, nil, :limit => 10)
    if events.empty? || stale?(:etag => [@activity.scope, @date_to, @date_from, events.first, events.size, User.current, current_language])
      respond_to do |format|
        format.html {
          # @events_by_day = events.group_by(&:event_date)
          @events_by_day = events.group_by {|event| User.current.time_to_date(event.event_datetime)}
          render :layout => 'base'
        }
        format.api
      end
    end
  end

  def show
    render_form
  end

  private

  def find_user
    if params[:user_id].present?
      if params[:user_id] == 'current'
        require_login || return
        @user = User.current
      else
        @user = User.find(params[:user_id])
        # @user = User.active.find(params[:user_id])
      end
    else @user = User.current
    end
  rescue ActiveRecord::RecordNotFound
    render_404
  end
end
