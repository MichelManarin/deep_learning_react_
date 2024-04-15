
import React from 'react'
import { RenderResult, render, cleanup } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import Wrapper from './wrapper'

type SutTypes = {
  sut: RenderResult
}

type SutParams = {
  id: string
}

const history = createMemoryHistory({ initialEntries: ['/'] })
const makeSut = (params: SutParams): SutTypes => {
  const sut = render(
    <Router history={history}>
      <Wrapper>
        <h1>{params.id}</h1>
      </Wrapper>
    </Router>
  )
  return {
    sut
  }
}

describe('SignUp Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const id = 'fake-id'
    const { sut } = makeSut({ id })
    const childElement = sut.getByTestId('children-wrapper')
    expect(childElement.firstChild.textContent).toContain(id)
  })
})
