import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 0.5 * 60 * 1000, // 5 minutes
    },
  },
})

// Don't add any providers here , look for app-provider.tsx
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  )
}
