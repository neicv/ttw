class CreateTtwCats < ActiveRecord::Migration
  def self.up
    create_table :ttw_cats do |t|
      t.column :category,  :string,  :limit => 64, :default => "",  :null => false
      t.column :sub_category, :text
      t.column :enabled, :boolean
    end
  end

  def self.down
    drop_table :ttw_cats
  end
end
