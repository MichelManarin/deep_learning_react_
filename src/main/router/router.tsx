
import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { makeVideo } from '@/main/factories/pages/video/video-factory'
import { makeHistoric } from '@/main/factories/pages/historic/historic-factory'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={makeVideo} />
        <Route exact path="/historic" component={makeHistoric} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
