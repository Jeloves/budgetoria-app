import React from 'react'
import { EditPage } from './edit-page'

describe('<EditPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<EditPage />)
  })
})