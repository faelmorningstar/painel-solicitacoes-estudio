import os
import sqlite3
from contextlib import asynccontextmanager, closing
from pathlib import Path
from typing import Annotated, Literal
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, StringConstraints

Status = Literal["aberto", "concluido"]
Titulo = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=160)]
BANCO = Path(os.environ.get("SOLICITACOES_DB", Path(__file__).with_name("solicitacoes.db")))


class NovaSolicitacao(BaseModel):
    titulo: Titulo


class AlteracaoStatus(BaseModel):
    status: Status


class Solicitacao(NovaSolicitacao, AlteracaoStatus):
    id: str


def conectar():
    banco = sqlite3.connect(BANCO)
    banco.row_factory = sqlite3.Row
    return banco


@asynccontextmanager
async def lifespan(_: FastAPI):
    with closing(conectar()) as banco, banco:
        banco.execute("""
            CREATE TABLE IF NOT EXISTS solicitacoes (
                id TEXT PRIMARY KEY,
                titulo TEXT NOT NULL,
                status TEXT NOT NULL CHECK (status IN ('aberto', 'concluido'))
            )
        """)
        banco.execute(
            "INSERT OR IGNORE INTO solicitacoes VALUES (?, ?, ?)",
            ("exemplo", "O texto sobre a animação da página inicial está difícil de ler", "aberto"),
        )
    yield


app = FastAPI(lifespan=lifespan)


def buscar(banco: sqlite3.Connection, id: str):
    registro = banco.execute(
        "SELECT id, titulo, status FROM solicitacoes WHERE id = ?", (id,)
    ).fetchone()
    if registro is None:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada.")
    return dict(registro)


@app.get("/api/solicitacoes", response_model=list[Solicitacao])
def listar():
    with closing(conectar()) as banco:
        registros = banco.execute(
            "SELECT id, titulo, status FROM solicitacoes ORDER BY rowid DESC"
        ).fetchall()
        return [dict(registro) for registro in registros]


@app.get("/api/solicitacoes/{id}", response_model=Solicitacao)
def detalhes(id: str):
    with closing(conectar()) as banco:
        return buscar(banco, id)


@app.post("/api/solicitacoes", response_model=Solicitacao, status_code=201)
def criar(pedido: NovaSolicitacao):
    id = str(uuid4())
    with closing(conectar()) as banco, banco:
        banco.execute("INSERT INTO solicitacoes VALUES (?, ?, ?)", (id, pedido.titulo, "aberto"))
        return buscar(banco, id)


@app.patch("/api/solicitacoes/{id}", response_model=Solicitacao)
def atualizar(id: str, alteracao: AlteracaoStatus):
    with closing(conectar()) as banco, banco:
        banco.execute("UPDATE solicitacoes SET status = ? WHERE id = ?", (alteracao.status, id))
        return buscar(banco, id)


@app.get("/healthz", include_in_schema=False)
def saude():
    return {"status": "ok"}


diretorio_painel = os.environ.get("SOLICITACOES_WEB_DIR")
if diretorio_painel:
    app.mount("/", StaticFiles(directory=diretorio_painel, html=True), name="painel")
