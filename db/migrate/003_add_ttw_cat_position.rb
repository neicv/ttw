class AddTtwCatPosition < ActiveRecord::Migration
  def self.up
    add_column :ttw_cats, :position, :integer, :default => 1
    TtwCat.all.each_with_index {|cat, i| cat.update_attribute(:position, i+1)}
  end

  def self.down
    remove_column :ttw_cats, :position
  end
end
