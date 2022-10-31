import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Link from 'next/link'

import '@fontsource/inter/variable.css'

import { NProgressNextRouter } from '@saas-ui/react'
import { NextRouterProvider } from '@app/nextjs'
import { AppProvider } from '@app/features/core/providers/app'
import { AppLayout } from '@app/features/core/layouts/app-layout'

import { authService } from '../lib/supabase'
import { SupabaseProvider } from "../lib/supabaseProvider";
// import { Provider } from 'urql'
// import { authService } from '../lib/magic'
// import { authService } from '@app/config/mock-auth-service'

import { Paddle } from '../lib/paddle'

// Normally you only run this on development.
// import { worker } from '@app/mock-graphql'
// if (worker) {
//   worker.start()
// }

import Head from 'next/head'

// Prepare API key and Authorization header

// Create GraphQL client
// See: https://formidable.com/open-source/urql/docs/basics/react-preact/#setting-up-the-client

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  const tenant = router.query.tenant ? (router.query.tenant as string) : null

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <NextRouterProvider>
        <AppProvider
          authService={authService}
          linkComponent={Link}
          onError={(error, info) => console.error(error, info)}
          tenant={tenant}
          onTenantChange={(key) => {
            router.push({
              ...router,
              query: {
                ...router.query,
                tenant: key,
              },
            })
          }}
        >
          <AppLayout
            publicRoutes={['/']}
            isPublic={Component.isPublic}
            layout={Component.layout}
            sidebar={pageProps.sidebar}
          >
            <Paddle />
            <NProgressNextRouter router={router} />

              <Component {...pageProps} />
          </AppLayout>
        </AppProvider>
      </NextRouterProvider>
    </>
  )
}

export default App
