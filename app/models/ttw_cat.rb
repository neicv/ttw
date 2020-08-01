class TtwCat < ActiveRecord::Base
  unloadable
  validates_presence_of :category
  validates_uniqueness_of :category
  validates_length_of :category, :maximum => 64

  scope :sorted, lambda { order(:category) }

end
