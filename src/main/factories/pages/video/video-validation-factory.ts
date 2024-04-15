import { ValidationComposite } from '@/validation/validators'
import { ValidationBuilder as Builder } from '@/validation/validators/builder/validation-builder'

export const makeVideoValidation = (): ValidationComposite => {
  return ValidationComposite.build([
    ...Builder.field('ioc').required().build(),
    ...Builder.field('confidence').required().build()
  ])
}
