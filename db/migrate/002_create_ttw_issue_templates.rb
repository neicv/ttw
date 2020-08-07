class CreateTtwIssueTemplates < ActiveRecord::Migration
  def self.up
    create_table :ttw_issue_templates do |t|
      t.column :name, :string, :limit => 64, :default => "", :null => false
      t.column :description, :text
      t.column :tracker_str, :string, :limit => 32, :default => "", :null => false
      t.column :enabled, :boolean
    end
  end

  def self.down
    drop_table :ttw_issue_templates
  end
end 