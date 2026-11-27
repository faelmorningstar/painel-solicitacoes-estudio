import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { CampoTexto } from './CampoTexto'

type FormularioSolicitacaoProps = {
  onCriar: (titulo: string) => Promise<void>
  enviando: boolean
}

export function FormularioSolicitacao({ onCriar, enviando }: FormularioSolicitacaoProps) {
  const [titulo, setTitulo] = useState('')
  const [erro, setErro] = useState('')
  const campo = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (erro) campo.current?.focus()
  }, [erro])

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (enviando) return
    if (!titulo.trim()) {
      setErro('Informe um título para a solicitação.')
      campo.current?.focus()
      return
    }

    try {
      await onCriar(titulo.trim())
      setTitulo('')
      setErro('')
    } catch {
      // A fila exibe o erro da API. O título fica disponível para outra tentativa.
    }
  }

  return (
    <form className="formulario" aria-labelledby="titulo-formulario" noValidate onSubmit={enviar}>
      <h2 id="titulo-formulario">Nova solicitação</h2>
      <CampoTexto
        ref={campo}
        rotulo="Título da solicitação"
        required
        readOnly={enviando}
        maxLength={160}
        value={titulo}
        erro={erro}
        onChange={(event) => {
          setTitulo(event.target.value)
          if (event.target.value.trim()) setErro('')
        }}
      />
      <button type="submit" disabled={enviando}>{enviando ? 'Criando…' : 'Criar solicitação'}</button>
    </form>
  )
}
