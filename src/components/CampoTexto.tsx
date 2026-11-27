import { useId } from 'react'
import type { ComponentProps } from 'react'

type CampoTextoProps = Omit<ComponentProps<'input'>, 'id' | 'type' | 'aria-invalid' | 'aria-describedby'> & {
  rotulo: string
  erro?: string
}

export function CampoTexto({ rotulo, erro, ...inputProps }: CampoTextoProps) {
  const id = useId()

  return (
    <div className="campo-texto">
      <label htmlFor={id}>{rotulo}</label>
      <input
        {...inputProps}
        id={id}
        type="text"
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
      />
      {erro && <p id={`${id}-erro`} className="erro-campo">{erro}</p>}
    </div>
  )
}
