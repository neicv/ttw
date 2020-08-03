module TtwCatsHelper

    def ttw_count
        TtwCats.all.pluck(:id)).count
    end

end #module
