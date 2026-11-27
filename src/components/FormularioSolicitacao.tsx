import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { CampoTexto } from './CampoTexto'

export function FormularioSolicitacao({ onCriar }: { onCriar: (titulo: string) => void }) {
  const [titulo, setTitulo] = useState('')
  const [erro, setErro] = useState('')
  const campo = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (erro) campo.current?.focus()
  }, [erro])

  function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!titulo.trim()) {
      setErro('Informe um título para a solicitação.')
      campo.current?.focus()
      return
    }

    onCriar(titulo.trim())
    setTitulo('')
    setErro('')
  }

  return (
    <form className="formulario" aria-labelledby="titulo-formulario" noValidate onSubmit={enviar}>
      <h2 id="titulo-formulario">Nova solicitação</h2>
      <CampoTexto
        ref={campo}
        rotulo="Título da solicitação"
        required
        maxLength={160}
        value={titulo}
        erro={erro}
        onChange={(event) => {
          setTitulo(event.target.value)
          if (event.target.value.trim()) setErro('')
        }}
      />
      <button type="submit">Criar solicitação</button>
    </form>
  )
}
