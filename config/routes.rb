Spree::Core::Engine.routes.draw do
  match '/cart/add/(:variant_id)', to: 'orders#populate', via: :put, as: :add_to_cart
  match '/ajax_cart', to: 'orders#ajax_cart', via: :get, as: :ajax_cart
end
