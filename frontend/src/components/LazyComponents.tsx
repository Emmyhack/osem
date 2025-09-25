import { lazy } from 'react'

// Lazy load heavy components to improve initial bundle size
export const GroupsOverview = lazy(() => import('./GroupsOverview').then(module => ({ default: module.GroupsOverview })))
export const OnRampModal = lazy(() => import('./OnRampModal').then(module => ({ default: module.OnRampModal })))
export const ContributeModal = lazy(() => import('./ContributeModal').then(module => ({ default: module.ContributeModal })))

// Pre-load these components on user interaction
export const preloadComponents = {
    GroupsOverview: () => import('./GroupsOverview'),
    OnRampModal: () => import('./OnRampModal'),
    ContributeModal: () => import('./ContributeModal')
}