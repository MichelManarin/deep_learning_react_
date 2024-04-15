import React, { useContext } from 'react'
import Context from '@/presentation/contexts/form/form-context'

type Props = {
  text: string
  className?: string
}

const SubmitButton: React.FC<Props> = ({ text, className }: Props) => {
  const { state } = useContext(Context)
  return (
    <button className={className} data-testid="submit" disabled={state.isFormInvalid} type="submit">{text}</button>
  )
}

export default SubmitButton
