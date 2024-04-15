
import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { makeVideo } from '@/main/factories/pages/video/video-factory'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={makeVideo} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
