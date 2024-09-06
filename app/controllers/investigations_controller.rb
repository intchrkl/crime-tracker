class InvestigationsController < ApplicationController
    # A callback to set up an @investigation object to work with
    before_action :set_investigation, only: [:show, :edit, :update, :close]
    before_action :check_login
    authorize_resource

    def index
        @open_investigations = Investigation.is_open
        @closed_investigations = Investigation.is_closed
        @closed_unsolved = Investigation.where(date_closed: nil, solved: false)
        @with_batman = Investigation.with_batman
        @unassigned_cases = Investigation.unassigned
    end

    def new
        @investigations = Investigation.new
    end

    def create
        @investigation = Investigation.new(investigation_params)
        if @investigation.save
            flash[:notice] = "Successfully added '#{investigation_params[:title]}' to GCPD."
            redirect_to investigation_path(@investigation)
        else
            render action: 'new'
        end
    end

    def show
        @current_assignments = @investigation.assignments.where(end_date: nil)
    end

    def edit
    end

    def update
        if @investigation.update(investigation_params)
            redirect_to investigation_path(@investigation)
        else
            render :edit
        end
    end

    def close
        if @investigation.update(date_closed: Date.current, solved: true) 
            flash[:notice] = "Investigation has been closed."
            redirect_to investigations_path
        else
            redirect_to investigation_path
        end
    end

    private
    def set_investigation
        @investigation = Investigation.find(params[:id])
    end

    def investigation_params
        params.require(:investigation).permit(:title, :description, :crime_location, :date_opened, :date_closed, :solved, :batman_involved)
    end
end