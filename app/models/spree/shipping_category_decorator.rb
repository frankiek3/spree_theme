Spree::ShippingCategory.class_eval do
  has_many :variants, inverse_of: :shipping_category
  has_many :products, through: :variants
end
