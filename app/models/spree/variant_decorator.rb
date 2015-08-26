Spree::Variant.class_eval do

	#remove_method :description
	#remove_method :description=

	#remove_method :available_on
	#remove_method :available_on=

	remove_method :shipping_category_id
	remove_method :shipping_category_id=

	remove_method :shipping_category
	remove_method :shipping_category=

	#undef_method :shipping_category

	belongs_to :shipping_category, class_name: 'Spree::ShippingCategory', inverse_of: :variants

	has_many :classifications, dependent: :delete_all, inverse_of: :variant
	has_many :taxons, through: :classifications

	#validates :shipping_category_id, presence: true

	def options_text(remove_value = nil)
		values = self.option_values.sort do |a, b|
			a.option_type.position <=> b.option_type.position
		end

		values.to_a.map! do |ov|
			"#{ov.option_type.presentation}: #{ov.presentation}" unless ov.option_type.name == remove_value
		end

		values.reject(&:blank?).to_sentence({ words_connector: ", ", two_words_connector: ", " })
	end

end
