/* eslint-disable sonarjs/no-identical-functions */
/// <reference types="../../../../types/cypress" />

import { ref } from 'vue'
import { Application } from '../../../../cypress/templates'
import { VForm } from '../'
import { VTextField } from '@/components'

describe('VForm', () => {
  it('should emit when inputs are updated', () => {
    cy.mount(() => (
      <Application>
        <VForm>
          <VTextField label="Name" rules={ [v => v.length > 10 || 'Name should be longer than 10 characters'] }></VTextField>
        </VForm>
      </Application>
    ))

    cy.get('.v-text-field').type('Something')

    cy.vue().then(wrapper => {
      const emits = wrapper.findComponent('.v-form').emitted('update:modelValue')

      expect(emits).to.deep.equal([
        [false],
      ])
    })

    cy.get('.v-text-field').type(' and something else')

    cy.vue().then(wrapper => {
      const emits = wrapper.findComponent('.v-form').emitted('update:modelValue')

      expect(emits).to.deep.equal([
        [false],
        [true],
      ])
    })
  })

  it.only('should only emit true if all inputs are explicitly valid', () => {
    cy.mount(() => (
      <Application>
        <VForm>
          <VTextField label="Name" rules={ [v => v.length < 10 || 'Name should be longer than 10 characters'] }></VTextField>
          <VTextField label="Email" rules={ [v => v.length < 10 || 'E-mail should be longer than 10 characters'] }></VTextField>
        </VForm>
      </Application>
    ))

    cy.get('.v-text-field').eq(0).type('Valid')

    cy.vue().then(wrapper => {
      const emits = wrapper.findComponent('.v-form').emitted('update:modelValue')

      expect(emits).to.be.undefined
    })

    cy.get('.v-text-field').eq(1).type('Valid')

    cy.vue().then(wrapper => {
      const emits = wrapper.findComponent('.v-form').emitted('update:modelValue')

      expect(emits).to.deep.equal([
        [true],
      ])
    })
  })

  it('should expose validate function', () => {
    const form = ref()
    cy.mount(() => (
      <Application>
        <VForm ref={ form }>
          <VTextField label="Name" rules={ [v => !!v || 'Name required'] }></VTextField>
        </VForm>
      </Application>
    ))

    cy.get('.v-form').then(async () => {
      const { valid } = await form.value.validate()
      expect(valid).to.equal(false)
    })

    cy.get('.v-text-field').should('have.class', 'v-input--error')
  })

  it('should expose reset function', () => {
    const form = ref()
    cy.mount(() => (
      <Application>
        <VForm ref={ form }>
          <VTextField label="Name" rules={ [v => v.length > 10 || 'Name should be longer than 10 characters'] }></VTextField>
        </VForm>
      </Application>
    ))

    cy.get('.v-text-field').type('Something').should('have.class', 'v-input--error')

    cy.vue().then(wrapper => {
      const emits = wrapper.findComponent('.v-form').emitted('update:modelValue')

      expect(emits).to.deep.equal([[false]])
    })

    cy.get('.v-form').then(() => {
      form.value.reset()
    })

    cy.get('.v-text-field').should('have.not.class', 'v-input--error').find('input').should('have.value', '')

    cy.vue().then(wrapper => {
      const emits = wrapper.findComponent('.v-form').emitted('update:modelValue')

      expect(emits).to.deep.equal([[false], [null]])
    })
  })

  it('should expose resetValidation function', () => {
    const form = ref()
    cy.mount(() => (
      <Application>
        <VForm ref={ form }>
          <VTextField label="Name" rules={ [v => v.length > 10 || 'Name should be longer than 10 characters'] }></VTextField>
        </VForm>
      </Application>
    ))

    cy.get('.v-text-field').type('Something').should('have.class', 'v-input--error')

    cy.vue().then(wrapper => {
      const emits = wrapper.findComponent('.v-form').emitted('update:modelValue')

      expect(emits).to.deep.equal([[false]])
    })

    cy.get('.v-form').then(() => {
      form.value.resetValidation()
    })

    cy.get('.v-text-field').should('have.not.class', 'v-input--error').find('input').should('have.value', 'Something')

    cy.vue().then(wrapper => {
      const emits = wrapper.findComponent('.v-form').emitted('update:modelValue')

      expect(emits).to.deep.equal([[false], [null]])
    })
  })
})