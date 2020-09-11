class TtwTopLvl < ActiveRecord::Base
    include Redmine::SubclassFactory
    include Redmine::SafeAttributes
    include Concerns::TtwCat::Common
    unloadable
    validates_presence_of :name
    validates_uniqueness_of :name
    validates_length_of :name, :maximum => 64
    safe_attributes 'name',
                    'enabled'
    
    scope :sorted, lambda { order(:position) }
    #scope :sorted, lambda { order(:name) }
    scope :enabled, -> { where(enabled: true) }

    def to_s; name end
  end