Spree::Classification.class_eval do
  belongs_to :variant, class_name: "Spree::Variant", inverse_of: :classifications#, touch: true
  clear_validators!
  validates_uniqueness_of :taxon_id, scope: :product_id, message: :already_linked, unless: Proc.new { |c| c.product.nil? }
  validates_uniqueness_of :taxon_id, scope: :variant_id, message: :already_linked, unless: Proc.new { |c| c.variant.nil? }
end
