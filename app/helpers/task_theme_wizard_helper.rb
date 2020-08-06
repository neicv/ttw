module TaskThemeWizardHelper

    def ttw_count
        TtwCat.all.pluck(:id).count
    end

end #module
