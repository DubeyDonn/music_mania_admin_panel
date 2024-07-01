import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './helpers/auth/auth.guard';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SongsComponent } from './pages/songs/songs.component';
import { ArtistsComponent } from './pages/artists/artists.component';
import { AlbumsComponent } from './pages/albums/albums.component';
import { UsersComponent } from './pages/users/users.component';
import { AdminsComponent } from './pages/admins/admins.component';
import { PlansComponent } from './pages/plans/plans.component';

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
        path: 'artists',
        component: ArtistsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'albums',
        component: AlbumsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [authGuard],
      },
      {
        path: 'admins',
        component: AdminsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'plans',
        component: PlansComponent,
        canActivate: [authGuard],
      },
    ],
  },
  { path: 'login', component: LoginComponent },
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
