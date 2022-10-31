import * as React from 'react'

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { createClient, Provider } from "urql";

import { IconContext } from 'react-icons'

import {
  SaasProvider,
  AuthProvider,
  AuthProviderProps,
  ModalsProvider,
  Form,
} from '@saas-ui/react'
import { yupResolver, yupFieldResolver } from '@saas-ui/forms/yup'
import { AnyObjectSchema } from 'yup'

import { TenancyProvider, Tenant } from '@saas-ui/pro'
import { FeaturesProvider } from '@saas-ui/features'

import { I18nProvider } from '@app/i18n'

import { theme } from '@ui/theme'

import features from '@app/config/feature-flags'

// const queryClient = new QueryClient()

/**
 * Use the Yup resolver as default in all forms
 */

const headers = {
  apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  // authorization: `Bearer ${<SUPABASE_ANON_KEY}`>
}

// Create GraphQL client
// See: https://formidable.com/open-source/urql/docs/basics/react-preact/#setting-up-the-client
const client = createClient({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL + '/graphql/v1',
  fetchOptions: function createFetchOptions() {
    return { headers }
  },
})

Form.getResolver = (schema: AnyObjectSchema) => yupResolver(schema)
Form.getFieldResolver = (schema: AnyObjectSchema) => yupFieldResolver(schema)

export interface AppProviderProps {
  linkComponent?: React.ElementType<any>
  authService?: AuthProviderProps
  tenant?: Tenant | null
  onTenantChange?: (key: string) => void
  onError?: (error: Error, info: any) => void
  children: React.ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = (props) => {
  const {
    linkComponent,
    tenant,
    onTenantChange,
    onError,
    authService,
    children,
  } = props

  return (
      <IconContext.Provider value={{ className: 'react-icon', size: '1.1em' }}>
        <SaasProvider
          linkComponent={linkComponent}
          onError={onError}
          theme={theme}
        >
          <AuthProvider {...authService}>
            <FeaturesProvider value={features}>
              <I18nProvider>
                <TenancyProvider tenant={tenant} onChange={onTenantChange}>
                  <ModalsProvider>{children}</ModalsProvider>
                </TenancyProvider>
              </I18nProvider>
            </FeaturesProvider>
          </AuthProvider>
        </SaasProvider>
      </IconContext.Provider>
  )
}
