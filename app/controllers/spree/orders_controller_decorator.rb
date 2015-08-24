Spree::OrdersController.class_eval do
  respond_to :html, :js

  # override populate method
  #TODO if variant.is_master and has other variants #don't sell
#if has_variants? ? variants.any?(&:in_stock?) : master.in_stock?
  def populate
    order = current_order(create_order_if_necessary: true)

    if params[:variant_ids].present? && request.format.json? #request.xhr?
      variant_ids = params[:variant_ids].split(",").map(&:to_i).reject{|i| i < 1 }
#TODO reject variants that shouldn't be shown
#product.variants.select{|v| v.can_supply? && v.taxons.any?{|t| @taxon.self_and_descendants.include?(t)} }
      variants = variant_ids.map do |variant_id|
        variant = Spree::Variant.find(variant_id)
        product = variant.product
        variant_name = variant.option_values.present? ? "#{product.name} (#{variant.options_text})" : product.name
        images = product.variant_images.select{|i| i.viewable_id  == variant.id }
#product.images.first
#view_context.link_to(image_tag, product, class: "dialog-image-link", itemprop: 'url')
        { name: variant_name, image: (images.any? ? view_context.image_tag(images.first.attachment.url(:mini), {alt: variant_name}) : view_context.mini_image(product, itemprop: "image")), price: variant.price_in(current_currency).display_price, link: view_context.link_to_with_icon('icon-basket', variant_name, view_context.add_to_cart_path(variant_id: variant.id), { id: 'add_to_cart_button_' + variant.id.to_s, class: 'icon-basket button product-option-link', remote: true, method: :put, "data-type" => :json }) }
      end

      populate_json = { option: "choosevariant", variants: variants}
    else
      variant  = Spree::Variant.find(params[:variant_id])
      params[:quantity] ||= 1
      quantity = params[:quantity].to_i
      options  = params[:options] || {}#options.merge(currency: currency)

      # 2,147,483,647 is crazy. See issue #2695.
      if quantity.between?(1, 2_147_483_647)
        begin
          order.contents.add(variant, quantity, options)

          if request.format.json?
            product = variant.product
            variant_name = variant.option_values.present? ? "#{product.name} (#{variant.options_text})" : product.name
            images = product.variant_images.select{|i| i.viewable_id  == variant.id }
            populate_json = { option: "addedtocart", name: variant_name, image: view_context.link_to(images.any? ? view_context.image_tag(images.first.attachment.url(:product), {alt: variant_name}) : view_context.product_image(product, itemprop: "image"), product, class: "dialog-image-link", itemprop: 'url'), price: view_context.display_price(variant), original_price: '' }

            line_item = order.find_line_item_by_variant(variant)

            unless line_item.price == variant.price
              populate_json[:original_price] = populate_json[:price]
              populate_json[:price] = line_item.single_money.to_html
            end
          end
        rescue ActiveRecord::RecordInvalid => e
          flash[:error] = e.record.errors.full_messages.join(", ")
        end
      else
        flash[:error] = Spree.t(:please_enter_reasonable_quantity)
      end
    end

    respond_with(order) do |format|
      format.html { redirect_to flash[:error] ? :back : cart_path }#redirect_back_or_default(spree.root_path)
      format.json { render json: flash[:error] ? {error: flash.discard(:error)} : populate_json }
    end
  end

private

    #flash[:notice] = "Added #{variant.name} to cart"
      #format.js { render :action => 'edit' }
end
