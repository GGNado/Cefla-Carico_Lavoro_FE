import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'workload/new',
        loadComponent: () => import('./features/workload-new/workload-new.component').then((m) => m.WorkloadNewComponent),
      },
      {
        path: 'history',
        loadComponent: () => import('./features/history/history.component').then((m) => m.HistoryComponent),
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then((m) => m.ReportsComponent),
      },
      {
        path: 'collaborators',
        loadComponent: () => import('./features/collaborators/collaborators.component').then((m) => m.CollaboratorsComponent),
        canActivate: [roleGuard('ROLE_MANAGER', 'ROLE_ADMIN')],
      },
      {
        path: 'activity-types',
        loadComponent: () => import('./features/activity-types/activity-types.component').then((m) => m.ActivityTypesComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users.component').then((m) => m.UsersComponent),
        canActivate: [roleGuard('ROLE_ADMIN')],
      },
      {
        path: 'access-denied',
        loadComponent: () => import('./features/access-denied/access-denied.component').then((m) => m.AccessDeniedComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
