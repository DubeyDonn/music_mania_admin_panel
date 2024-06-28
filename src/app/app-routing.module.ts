import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './helpers/auth/auth.guard';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SongsComponent } from './pages/songs/songs.component';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
      {
        path: 'songs',
        component: SongsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'setup',
        loadChildren: () =>
          import('./pages/setup/setup.module').then((m) => m.SetupModule),
        canActivate: [authGuard],
      },
      {
        path: 'office-management',
        loadChildren: () =>
          import('./pages/office-management/office-management.module').then(
            (m) => m.OfficeManagementModule
          ),
        canActivate: [authGuard],
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  // { path: 'signup', component: SignupComponent },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
