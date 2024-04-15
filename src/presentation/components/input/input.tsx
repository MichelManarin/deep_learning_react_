import React, { useContext } from 'react'
import Context from '@/presentation/contexts/form/form-context'

type Props = {
  label: string
  inputProps: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  labelProps: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>
}

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(Context)
  const error = state[`${props.inputProps.name}Error`]
  const getTitle = (): string => {
    return error || 'Tudo certo!'
  }
  const handleChange = (event: React.FocusEvent<HTMLInputElement>): void => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    })
  }
  return (
    <div>
      <label {...props.labelProps}>
        {props.label}
      </label>
      <div className="mt-2">
        <input
          {...props.inputProps}
          onChange={handleChange}
          data-testid={props.inputProps.name}
          style={{ padding: '0.6rem' }}
        />
        <span data-testid={`${props.inputProps.name}-status`} title={getTitle()} className="text-red-500 right-0"></span>
      </div>
    </div>
  )
}

export default Input
