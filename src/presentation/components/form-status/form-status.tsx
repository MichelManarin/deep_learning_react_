import React, { useContext } from 'react'
import Context from '@/presentation/contexts/form/form-context'

const FormStatus: React.FC = () => {
  const { state } = useContext(Context)
  const { isLoading, mainError } = state
  return (
    <div data-testid='error-wrap'>
      { isLoading && <div><span data-testid='spinner' className='text-sm font-medium leading-6 text-gray-900'>Carregando..</span></div>}
      { mainError && <div><span data-testid='main-error' className='text-sm font-medium leading-6 text-red-500'>{mainError}</span></div>}
    </div>
  )
}

export default FormStatus
