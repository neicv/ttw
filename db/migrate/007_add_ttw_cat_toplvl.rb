class AddTtwCatToplvl < ActiveRecord::Migration
  def self.up
    add_column :ttw_cats, :toplvl, :integer
  end

  def self.down
    remove_column :ttw_cats, :toplvl
  end
end
