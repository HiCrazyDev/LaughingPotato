import * as React from 'react'
import router from 'next/router'

import { useAuth, Loader } from '@saas-ui/react'
import { createPage } from '@app/nextjs'
import { LoginPage } from '@app/features/auth'

/**
 * Enable isPublic to use the custom login screen
 * Defaults to the default Auth component in AppLayout
 */

export default createPage({
  title: 'Login',
  layout: 'auth',
  // isPublic: true,
  renderComponent: () => {
    const { isAuthenticated } = useAuth()

    React.useEffect(() => {
      if (isAuthenticated) {
        router.push('/app')
      }
    }, [isAuthenticated])

    return (<LoginPage />)
  },
})
