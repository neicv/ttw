class AddTtwTopLvlsPosition < ActiveRecord::Migration
  def self.up
    add_column :ttw_top_lvls, :position, :integer, :default => 1
    TtwTopLvl.all.each_with_index {|lvl, i| lvl.update_attribute(:position, i+1)}
  end

  def self.down
    remove_column :ttw_top_lvls, :position
  end
end
