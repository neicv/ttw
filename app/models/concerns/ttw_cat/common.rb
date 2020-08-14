module Concerns
  module TtwCat
    module Common
      extend ActiveSupport::Concern
      #
      # Common scope both category and template.
      #
      included do

        # FIXME: Porting a part of lib/redmine/acts/positioned.rb, in order to support
        #    Redmine 3.0 to 3.4 compatibility
        before_save :set_default_position
        after_save :update_position
        after_destroy :remove_position

      end

      def enabled?
        enabled
      end

      def <=>(other)
        position <=> other.position
      end

      private

      # NOTE: set_default_position to reset_positions_in_list should be removed when this plugin's target Redmine
      #   version is changed to Redmine4.

      def set_default_position
        return unless position.nil?
        position = self.class.maximum(:position).to_i + (new_record? ? 1 : 0)
      end

      def update_position
        if position_changed?
          position_was.nil? ? insert_position : shift_positions
        end
      end

      def remove_position
        self.class.where('position >= ?', position_was).update_all('position = position - 1')
      end

      def insert_position
        self.class.where('position >= ?', position).update_all('position = position + 1')
      end

      def shift_positions
        offset = position_was <=> position
        min, max = [position, position_was].sort
        r = self.class.where('id <> ? AND position BETWEEN ? AND ?', id, min, max)
                .update_all(['position = position + ?', offset])
        reset_positions_in_list if r != max - min
      end

      def reset_positions_in_list
        self.class.reorder(:position).pluck(:id).each_with_index do |record_id, p|
           self.class.where(id: record_id).update_all(position: p + 1)
        end
      end
    end
  end
end
