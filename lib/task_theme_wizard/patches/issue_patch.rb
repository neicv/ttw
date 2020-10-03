require_dependency 'issue'
module TaskThemeWizard
  module Patches
    module IssuePatch
      def self.included(base)
        # base.send(:extend, ClassMethods)
        # base.send(:include, InstanceMethods)
        base.class_eval do
          unloadable

          # validate :due_date_in_future

          # protected
          # def due_date_in_future
          #   return true if due_date.nil?

          #   if due_date.to_time < Date.today.beginning_of_day
          #     errors.add :due_date, :not_in_future
          #   end

          # end

          # validate :estimated_hours_fill

          # protected
          # def estimated_hours_fill
          #   if estimated_hours.nil?
          #     errors.add :estimated_hours, :estimated_hours_fill
          #   end

          # end

          validate :notes_fill

          protected
          def notes_fill
            # return true if lambda {|issue| issue.new_record? }
            return true if new_record?

            arg = TaskThemeWizard.issue_status_for_validate
            return true if arg.nil? || arg.empty? || status_id.nil?

            if arg.is_a?(Array)
              # logger.info "- - - - --  Arg attributes hash: #{arg}"
              if arg.include? status_id.to_s

                if notes.empty? # notes == "" 
                  errors.add :notes, :notes_fill
                  return false
                end
    
                if notes.size < 16 || notes.split(' ').count < 3
                  errors.add :notes, :notes_fill_size
                  return false
                end

              end
            else
              errors.add :notes, :notes_fill_some_error
            end

          end
        end
      end
    end
  end
end

unless Issue.included_modules.include?(TaskThemeWizard::Patches::IssuePatch)
  Issue.send(:include, TaskThemeWizard::Patches::IssuePatch)
end
