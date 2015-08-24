Spree::HomeController.class_eval do

  def index
    slider = Spree::Taxon.find_by_name('Slider')
    @slider_products = slider.products.active if slider

    featured = Spree::Taxon.find_by_name('Featured')
    @featured_products = featured.products.active if featured

    latest = Spree::Taxon.find_by_name('Latest')
    @latest_products = latest.products.active if latest
  end

end
