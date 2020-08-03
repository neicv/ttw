# task_theme_wizard

Description goes here

![image](https://pagekit.friendly-it.ru/storage/img/ttw.jpg)

### Install
download plugin and copy plugin folder task_theme_wizard go to Redmine's plugins folder

go to redmine root folder

bundle exec rake redmine:plugins:migrate RAILS_ENV=production NAME=task_theme_wizard

restart server f.i.
sudo /etc/init.d/apache2 restart

### Uninstall
go to redmine root folder
bundle exec rake redmine:plugins:migrate RAILS_ENV=production NAME=task_theme_wizard VERSION=0

go to plugins folder, delete plugin folder task_theme_wizard
rm -r redmine_attributes_quickies

restart server f.i.
sudo /etc/init.d/apache2 restart


### How to

add value in db:

Goto console:
ruby bin/rails console

Add:
TtwCat.create(:category => "Last Us", :sub_category => "One\n Two\n Six\n", :enabled => true)