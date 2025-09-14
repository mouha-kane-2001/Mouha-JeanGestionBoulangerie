import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './side-login/side-login.component';

export const AuthenticationRoutes: Routes = [

      {
    path: '',
    component: AppSideLoginComponent,
  },
     // {path: 'register',  component: AppSideRegisterComponent,},
];
