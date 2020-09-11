class CreateTtwTopLvls < ActiveRecord::Migration
  def self.up
    create_table :ttw_top_lvls do |t|
      t.column :name,  :string,  :limit => 64, :default => "", :null => false
      t.column :enabled, :boolean
    end
  end

  def self.down
    drop_table :ttw_top_lvls
  end
end
