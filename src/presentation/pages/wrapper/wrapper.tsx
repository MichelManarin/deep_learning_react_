import React, { useState } from 'react'
import { Sidebar, Header, SidebarMobile } from '@/presentation/components'
import Context from '@/presentation/contexts/wrapper/wrapper-context'

function classNamesHelper (...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

interface Team {
  id: number
  name: string
  href: string
  initial: string
  current: boolean
}

interface NavigationItem {
  name: string
  href: string
  current?: boolean
}

const teams: Team[] = [
  { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
  { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
  { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false }
]

const navigation: NavigationItem[] = [
  { name: 'Times', href: '#', current: true },
  { name: 'Dashboards', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
  { name: 'Reports', href: '#', current: false }
]

const userNavigation: NavigationItem[] = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' }
]

type Props = {
  children?: React.ReactNode
}

const Wrapper: React.FC<Props> = (props: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <>
      <div>
        <Context.Provider value={{ teams, navigation, userNavigation, sidebarOpen, setSidebarOpen, classNamesHelper }}>
          <Sidebar />
          <SidebarMobile />
          <div className="lg:pl-72">
            <Header />
            <main className="py-10">
              <div data-testid="children-wrapper" className="px-4 sm:px-6 lg:px-8">{props.children}</div>
            </main>
          </div>
        </Context.Provider>
      </div>
    </>
  )
}

export default Wrapper
