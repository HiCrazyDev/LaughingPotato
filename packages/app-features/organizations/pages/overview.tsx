import { useGetOrganizationQuery } from '@app/graphql'

import { useState } from "react";

import { Grid, GridItem } from '@chakra-ui/react'

import { FaGithub, FaLinkedin } from 'react-icons/fa'

import {
  Form,
  FormLayout,
  Field,
  DisplayIf,
  SubmitButton,
  ButtonGroup,
} from '@saas-ui/react'

import {
  Page,
  ErrorPage,
  Toolbar,
  ToolbarButton,
  useTenant,
  PageBody,
} from '@saas-ui/pro'

import { Today } from '../components/metrics/today'

export function OverviewPage() {
  const tenant = useTenant()
  const { data, isLoading } = useGetOrganizationQuery({
    slug: tenant,
  })

  const organization = data ?.organizationsCollection ?.edges ?.map ((organization: any) => {return organization["node"]});

  if (!isLoading && !organization) {
    return (
      <ErrorPage
        title="No organization found"
        description={`We couldn't find a organization named ${tenant}`}
      />
    )
  }

  const toolbar = (
    <Toolbar className="overview-toolbar">
      <ToolbarButton
        as="a"
        href="https://https://www.linkedin.com/in/nicholas-manske"
        icon={<FaLinkedin />}
        label="Share on Linkedin"
      />
      <ToolbarButton
        as="a"
        href="https://github.com/nicholasmanske/laughing-potato"
        icon={<FaGithub />}
        label="View on Github"
      />
      <ToolbarButton
        as="a"
        href="https://www.stripe.com"
        label="Pre-order"
        colorScheme="primary"
        variant="solid"
        className="pre-order"
      />
    </Toolbar>
  )

  return (
    <Page title={organization ?.name} toolbar={toolbar} isLoading={isLoading}>
      <PageBody pt="8">
        <Grid
          templateColumns={['repeat(1, 1fr)', null, 'repeat(1, 1fr)']}g
          width="100%"
          gap="4"
          p="4"
        >
          <GridItem>
            <Today />
          </GridItem>
          <GridItem>
            <Form onSubmit={() => null}>
              <FormLayout>
                <Field
                  type="select"
                  name="role"
                  label="Workflow"
                  options={[
                    { value: 'Generate Candidate Introduction' },
                    { value: 'Scan Candidate Message' },
                    { value: 'Scrape Web for Candidate Info' },
                    { value: 'Setup Custom Automation' },
                    { value: 'Other' },
                  ]}
                  value="Generate Candidate Introduction"
                />
                <Field
                  type="textarea"
                  name="description"
                  label="Prompt"
                  rows={8}
                />
                <Field type="textarea" name="description" label="Result" rows={5} />
                <ButtonGroup w="full">
                  <SubmitButton type="submit" />
                </ButtonGroup>

              </FormLayout>
            </Form>
          </GridItem>
        </Grid>
      </PageBody>
    </Page>
  )
}
