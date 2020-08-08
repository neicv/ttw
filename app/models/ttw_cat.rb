class TtwCat < ActiveRecord::Base
  include Redmine::SubclassFactory
  unloadable
  validates_presence_of :category
  validates_uniqueness_of :category
  validates_length_of :category, :maximum => 64

  validates_presence_of :sub_category
  serialize :sub_category

  scope :sorted, lambda { order(:category) }
  scope :enabled, -> { where(enabled: true) }

  def to_s; category end

  def sub_category
    values = read_attribute(:sub_category)
    if values.is_a?(Array)
      values.each do |value|
        value.to_s.force_encoding('UTF-8')
      end
      values
    else
      []
    end
  end

  # Makes possible_values accept a multiline string
  def sub_category=(arg)
    if arg.is_a?(Array)
      values = arg.compact.map {|a| a.to_s.strip}.reject(&:blank?)
      write_attribute(:sub_category, values)
    else
      self.sub_category = arg.to_s.split(/[\n\r]+/)
    end
  end

end
