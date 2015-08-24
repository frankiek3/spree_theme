Spree::Admin::VariantsController.class_eval do
  belongs_to 'spree/product', :find_by => :slug

  private

    def load_data
      @taxons = Spree::Taxon.order(:name)
      @option_types = Spree::OptionType.order(:name)
      @tax_categories = Spree::TaxCategory.order(:name)
      @shipping_categories = Spree::ShippingCategory.order(:name)
    end

end
