Spree::Product.class_eval do
	#belongs_to :shipping_category, through: :master
	#delegate :shipping_category, :to => :master
      #delegate_belongs_to :master, :shipping_category_id, :shipping_category
	#delegate :shipping_category_id, :shipping_category, to: :master
	#has_one :shipping_category, :through => :master
	#has_many :variant_shipping_categories, class_name: 'Spree::ShippingCategory', inverse_of: :variants, through: :variants_including_master

#	def shipping_category_id
#		if master
#			master.shipping_category_id
#		else
#			1
#		end
#	end

#	def shipping_category_id=(value)
#		if master
#			master.update_column(:shipping_category_id, value)
#		end
#		update_column(:shipping_category_id, value)
#	end

#	def shipping_category
#		if master
#			master.shipping_category
#		else
#			Spree::ShippingCategory.first
#		end
#	end

	#def shipping_category=(value)
	#	if master
	#		master.update_column(:shipping_category_id, value)
	#	end
	#	update_column(:shipping_category_id, value)
	#end


#validates :shipping_category_id, presence: true
  def self.remove_validation(val)
    #UniquenessValidator
    vals = _validators[val].find{ |validator| validator.is_a? ActiveRecord::Validations::PresenceValidator }
    skip_callback :validate, _validate_callbacks.find{ |c| c.raw_filter == vals }.filter
    _validators[val].delete(vals)
  end

  #remove_validation :shipping_category_id

end
