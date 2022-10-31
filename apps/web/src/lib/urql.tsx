import React from "react";
import { createClient, Provider } from "urql";
import { useSupabaseClient } from "./supabaseProvider";

export function UrqlProvider(props: { children: React.ReactNode }) {
  const supabaseClient = useSupabaseClient();

  function getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    };
    const authorization = supabaseClient.auth.session()?.access_token;

    if (authorization) {
      headers["authorization"] = `Bearer ${authorization}`;
    }

    return headers;
  }

  const [client] = React.useState(function createUrqlClient() {
    return createClient({
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/graphql/v1`,
      fetchOptions: function createFetchOptions() {
        return { headers: getHeaders() };
      },
    });
  });
  return <Provider value={client}>{props.children}</Provider>;
}



// Prepare API key and Authorization header
const headers = {
  apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  // authorization: `Bearer ${<SUPABASE_ANON_KEY}`>
}

// Create GraphQL client
// See: https://formidable.com/open-source/urql/docs/basics/react-preact/#setting-up-the-client
export const client = createClient({
  url: 'process.env.NEXT_PUBLIC_SUPABASE_URL/graphql/v1',
  fetchOptions: function createFetchOptions() {
    return { headers }
  },
})