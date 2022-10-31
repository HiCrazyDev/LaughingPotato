import * as React from 'react'

import { Box, Spacer, useBreakpointValue, Badge } from '@chakra-ui/react'

import {
  FiHome,
  FiPlus,
  FiInbox,
  FiHelpCircle,
  FiHash,
  FiUsers,
  FiSearch,
  FiZap,
  FiDollarSign,
  FiGitPullRequest,
} from 'react-icons/fi'

import { Command, Resizer, ResizeHandle, ResizeHandler } from '@saas-ui/pro'

import {
  Sidebar,
  SidebarProps,
  SidebarOverlay,
  SidebarSection,
  SidebarToggleButton,
  NavItem,
  NavItemProps,
  NavGroup,
} from '@saas-ui/sidebar'

import { useActivePath, useNavigate } from '@saas-ui/router'

import {
  IconButton,
  MenuItem,
  MenuDivider,
  useModals,
  useLocalStorage,
  useHotkeysShortcut,
} from '@saas-ui/react'

import { BillingStatus } from '../billing-status'
import { TenantMenu } from '../tenant-menu'
import { UserMenu } from '../user-menu'
import { ElectronNav } from '../electron-nav'

import { MembersInviteDialog } from '@app/features/organizations/components/members-invite-dialog'
import { usePath } from '@app/features/core/hooks/use-path'

import { GlobalSearchInput } from '../global-search'

export interface AppSidebarProps extends SidebarProps {}

export const AppSidebar: React.FC<AppSidebarProps> = (props) => {
  const modals = useModals()
  const [width, setWidth] = useLocalStorage('app.sidebar.width', 280)

  const { variant, colorScheme } = props
  const isCondensed = variant === 'condensed'

  const onResize: ResizeHandler = ({ width }) => {
    setWidth(width)
  }

  return (
    <Resizer
      defaultWidth={width}
      onResize={onResize}
      isResizable={useBreakpointValue({ base: false, lg: true })}
    >
      <Sidebar variant={variant} colorScheme={colorScheme} {...props}>
        <SidebarToggleButton />
        <ElectronNav />
        <SidebarSection direction="row">
          <TenantMenu title="Organizations">
            <MenuDivider />
            <MenuItem
              href={usePath('settings/organization')}
              label="Organization settings"
            />
            <MenuItem
              href="/app/getting-started"
              label="Create an organization"
            />
          </TenantMenu>
          {!isCondensed && (
            <>
              <Spacer />
              <UserMenu />
            </>
          )}
        </SidebarSection>
        <Box px={4}>
          {isCondensed ? (
            <IconButton icon={<FiSearch />} aria-label="Search" />
          ) : (
            <GlobalSearchInput />
          )}
        </Box>
        <SidebarSection overflowY="auto" flex="1">
          <NavGroup>
            <AppSidebarLink
              href={usePath()}
              label="Automations"
              icon={<FiZap />}
              hotkey="navigation.dashboard"
              isActive
            />
            <AppSidebarLink
              href={usePath('inbox')}
              label="Inbox"
              icon={<FiInbox />}
              hotkey="navigation.inbox"
            />
            <AppSidebarLink
              href={usePath('contacts')}
              isActive={useActivePath('contacts', { end: false })}
              label="Contacts"
              icon={<FiUsers />}
              hotkey="navigation.contacts"
            />
            <AppSidebarLink
              href={usePath('inbox')}
              label="Integrations"
              icon={<FiGitPullRequest />}
              hotkey="navigation.inbox"
            />
            <AppSidebarLink
              href={usePath('inbox')}
              label="Billing"
              icon={<FiDollarSign />}
              hotkey="navigation.inbox"
            />
          </NavGroup>

          {!isCondensed && (
            <NavGroup title="Tags" isCollapsible>
              <NavItem
                href={usePath('contacts/tag/ready')}
                label="Complete"
                icon={<Badge bg="green.500" boxSize="2" borderRadius="full" />}
              />
              <NavItem
                href={usePath('contacts/incomplete')}
                label="Incomplete"
                icon={<Badge bg="red.500" boxSize="2" borderRadius="full" />}
              />
              <NavItem
                href={usePath('contacts/tag/new')}
                label="New"
                inset={5}
                icon={<FiHash />}
              />
              <NavItem
                href={usePath('contacts/tag/in-progress')}
                label="In Progress"
                inset={5}
                icon={<FiHash />}
              />
            </NavGroup>
          )}

          <Spacer />

          <NavGroup>
            <NavItem
              onClick={() =>
                modals.open({
                  title: 'Invite people',
                  component: MembersInviteDialog,
                })
              }
              label="Invite people"
              color="sidebar-muted"
              icon={<FiPlus />}
            />
          </NavGroup>
        </SidebarSection>

        {isCondensed ? (
          <SidebarSection>
            <UserMenu />
          </SidebarSection>
        ) : (
          <BillingStatus />
        )}

        <SidebarOverlay />
        <ResizeHandle />
      </Sidebar>
    </Resizer>
  )
}

interface AppSidebarlink extends NavItemProps {
  hotkey: string
  href: string
}

const AppSidebarLink: React.FC<AppSidebarlink> = (props) => {
  const { href, label, hotkey, ...rest } = props
  const navigate = useNavigate()

  const command = useHotkeysShortcut(
    hotkey,
    () => {
      navigate(href)
    },
    [href],
  )

  return (
    <NavItem
      href={href}
      label={label}
      {...rest}
      tooltip={
        <>
          {label} <Command>{command}</Command>
        </>
      }
    />
  )
}
