module TaskThemeWizardHelper

  def ttw_count
    TtwCat.all.pluck(:id).count
  end
  #
  # TODO: This is a workaround to keep compatibility against Redmine3.1 and 3.2.
  # rubocop:disable Lint/ShadowingOuterLocalVariable
  def method_missing(name, *args)
    if Redmine::VERSION::MINOR > 3
      super
    else
      class_eval do
        define_method name.to_s do |*args|
          object = args[0]
          options = args[1]
          data = {
            reorder_url: options[:url] || url_for(object),
            reorder_param: options[:param] || object.class.name.underscore
          }
          content_tag('span', '',
                      class: 'sort-handle',
                      data: data,
                      title: l(:button_sort))
        end
      end
      send(name, *args)
    end
  end
  # rubocop:enable Lint/ShadowingOuterLocalVariable

  def respond_to_missing?(method_name, include_private = false)
    method_name.to_s == 'reorder_handle' || super
  end

end #module
