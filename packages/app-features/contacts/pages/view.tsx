import * as React from 'react'

import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useGetContactActivitiesQuery,
  useGetContactQuery,
} from '@app/graphql'

import {
  Box,
  Heading,
  HStack,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react'
import { ErrorBoundary, Loader } from '@saas-ui/react'
import { FiSidebar } from 'react-icons/fi'

import { Page, Toolbar, ToolbarButton } from '@saas-ui/pro'

import { useCurrentUser } from '@app/features/core/hooks/use-current-user'
import { usePath } from '@app/features/core/hooks/use-path'
import { Breadcrumbs } from '@app/features/core/components/breadcrumbs'

import { ContactSidebar } from '../components/contact-sidebar'
import { Activities, ActivityTimeline } from '../components/activity-timeline'
import { useQueryClient } from '@tanstack/react-query'
import { number } from 'yup'

interface ContactsViewPageProps {
  id: string
}

export function ContactsViewPage({ id }: ContactsViewPageProps) {
  const { data, isLoading, error } = useGetContactQuery({
    id: Number(id),
  })

  const contact = data ?.  contactsCollection ?.edges[0]["node"];
  console.log(contact);

  const sidebar = useDisclosure({
    defaultIsOpen: true,
  })

  const breadcrumbs = (
    <Breadcrumbs
      items={[
        { href: usePath('/contacts'), title: 'Contacts' },
        { title: contact?.fullName },
      ]}
    />
  )

  const toolbar = (
    <Toolbar>
      <Spacer />
      <ToolbarButton
        icon={<FiSidebar />}
        label={sidebar.isOpen ? 'Hide sidebar' : 'Show sidebar'}
        onClick={sidebar.onToggle}
      />
    </Toolbar>
  )

  return (
    <Page title={breadcrumbs} toolbar={toolbar} isLoading={isLoading} fullWidth>
      <HStack alignItems="stretch" height="100%" overflowX="hidden" spacing="0">
        <Tabs
          colorScheme="primary"
          isLazy
          flex="1"
          minH="0"
          display="flex"
          flexDirection="column"
        >
          <TabList borderBottomWidth="1px" height="12">
            <Tab>Activity</Tab>
          </TabList>
          <TabPanels
            py="8"
            px="20"
            overflowY="auto"
            maxW="container.xl"
            margin="0 auto"
            flex="1"
          >
            <TabPanel>
              <ErrorBoundary>
                <ActivitiesPanel contactId={Number(id)} />
              </ErrorBoundary>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <ContactSidebar contact={contact} isOpen={sidebar.isOpen} />
      </HStack>
    </Page>
  )
}

const ActivitiesPanel: React.FC<{ contactId: number }> = ({ contactId }) => {
  const currentUser = useCurrentUser()
  console.log('currentUser', currentUser);

  const { data, isLoading } = useGetContactActivitiesQuery({
    id: contactId,
  })

  const activities = data ?.  activityCommentCollection ?.edges ?. map((activity : any) => {return activity["node"]});
  const queryClient = useQueryClient()

  const addMutation = useAddCommentMutation({
    onSettled: () => {
      queryClient.invalidateQueries(['GetContactActivities', { id: contactId }])
    },
  })

  const deleteMutation = useDeleteCommentMutation({
    onSettled: () => {
      queryClient.invalidateQueries(['GetContactActivities', { id: contactId }])
    },
  })

  return (
    <>
      {!currentUser || isLoading ? (
        <Loader />
      ) : (
        <>
          <Heading size="md" mb="8">
            Activity
          </Heading>
          <ActivityTimeline
            activities={(activities || []) as Activities}
            currentUser={currentUser}
            onAddComment={async (data) => {
              return addMutation.mutate({
                contactId,
                comment: data.comment,
              })
            }}
            onDeleteComment={async (id) => {
              return deleteMutation.mutate({
                id: id as string,
              })
            }}
          />
        </>
      )}
    </>
  )
}
