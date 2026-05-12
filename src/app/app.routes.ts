import { Routes } from '@angular/router';
import { UserLayoutComponent } from './layouts/user-layout/user-layout';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';

// --- USER SIDE IMPORTS ---
import { HomeComponent } from './user-module/home/home.component';
import { CategoryComponent as UserCategory } from './user-module/category/category.component';
import { ItemsComponent } from './user-module/items/items.component';
import { ItemDetailComponent } from './user-module/item-detail/item-detail.component';
import { LoginComponent } from './user-module/login/login.component';
import { RegisterComponent } from './user-module/register/register.component';
import { OrderAddressComponent } from './user-module/order-address/order-address.component';
import { ProfileComponent } from './user-module/profile/profile.component';
import { CartComponent } from './user-module/cart/cart.component';
import { OrderConfirmationComponent } from './user-module/orderConfirmation/orderConfirmation.component';
import { OrderSummaryComponent } from './user-module/orderSummary/orderSummary.component';
import { MyOrdersComponent } from './user-module/myOrders/myOrders.component';
import { SearchComponent } from './user-module/search/search.component';
import { cartGuard } from './user-module/cart/cart.guard';

import { CategoryComponent as AdminCategory } from './admin-module/category/category.component';
import { ProductComponent } from './admin-module/product/product.component';
import { VariantComponent } from './admin-module/product-variant/product-variant.component';
import { OrderComponent } from './admin-module/orders/orders.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
      { path: 'categories', component: AdminCategory },
      { path: 'products', component: ProductComponent },
      { path: 'variants', component: VariantComponent },
      { path: 'orders', component: OrderComponent },
    ],
  },

  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'category/:categoryId', component: UserCategory },
      { path: 'category/:categoryId/:productId', component: ItemsComponent },
      { path: 'category/:categoryId/:productId/:itemId', component: ItemDetailComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'cart/order-address', component: OrderAddressComponent },
      { path: 'cart', component: CartComponent, canActivate: [cartGuard] },
      { path: 'cart/orderConfirmation', component: OrderConfirmationComponent },
      { path: 'cart/orderSummary', component: OrderSummaryComponent },
      { path: 'profile/myOrders', component: MyOrdersComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'search/:query', component: SearchComponent },
    ],
  },

  { path: '**', redirectTo: '' },
];
