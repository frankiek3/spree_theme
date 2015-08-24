class AddToVariant < ActiveRecord::Migration

	def up
		#add_column :spree_variants, :description, :text
		#add_column :spree_variants, :available_on, :datetime

		add_reference :spree_variants, :shipping_category, index: true
		Spree::Product.all.each{|p| p.master.update_attribute(:shipping_category_id, p.read_attribute(:shipping_category_id))}#if !.nil?

		add_reference :spree_products_taxons, :variant, index: true
		#Spree::Classification.all.each{|c| c.update_attribute(:variant_id, c.product_id)}
		#remove_reference :spree_products_taxons, :product
		add_index :spree_products_taxons, [ :variant_id, :taxon_id ], unique: true
	end

	def down
		#remove_column :spree_variants, :description
		#remove_column :spree_variants, :available_on

		Spree::Product.all.each{|p| p.update_attribute(:shipping_category_id, p.master.shipping_category_id)}#if !.nil?
		remove_reference :spree_variants, :shipping_category

		#add_reference :spree_products_taxons, :product, index: true
		#Spree::Classification.all.each{|c| c.update_attribute(:product_id, c.variant_id)}
		remove_reference :spree_products_taxons, :variant
	end

end
