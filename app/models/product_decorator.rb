Spree::Product.class_eval do
	#belongs_to :shipping_category, through: :master
	#delegate :shipping_category, :to => :master
	delegate :shipping_category_id, :shipping_category, to: :master
	#has_one :shipping_category, :through => :master
	#has_many :variant_shipping_categories, class_name: 'Spree::ShippingCategory', inverse_of: :variants, through: :variants_including_master

	#def shipping_category_id
	#	master.shipping_category_id
	#end

	#def shipping_category_id=(value)
	#	master.update_attribute(:shipping_category_id, value)
	#	update_attribute(:shipping_category_id, value)
	#end

end
