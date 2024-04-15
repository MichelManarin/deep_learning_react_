
import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '../adapters/current-account-adapter'
import ApiContext from '@/presentation/contexts/api/api-context'
import Player from '@/presentation/components/flows/builder/builder'

const Router: React.FC = () => {
  return (
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountAdapter,
        getCurrentAccount: getCurrentAccountAdapter
      }}>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Player} />
        </Switch>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}

export default Router
