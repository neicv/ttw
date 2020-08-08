class TtwIssueTemplate < ActiveRecord::Base
    include Redmine::SubclassFactory
    include Redmine::SafeAttributes
    unloadable
    validates_presence_of :name
    validates_uniqueness_of :name
    validates_length_of :name, :maximum => 64
    validates_presence_of :description
    #validates_presence_of :tracker_str, :maximum => 32
    safe_attributes 'name',
                    'description',
                    'tracker_id',
                    'enabled'
    
    scope :sorted, lambda { order(:name) }

    def to_s; name end
  end