"""Inicia o FastAPI com um banco descartável para os testes de navegador."""

import os
from pathlib import Path
from tempfile import TemporaryDirectory

import uvicorn


if __name__ == "__main__":
    with TemporaryDirectory(prefix="solicitacoes-e2e-") as pasta:
        os.environ["SOLICITACOES_DB"] = str(Path(pasta) / "solicitacoes.db")
        uvicorn.run("api.main:app", host="127.0.0.1", port=8000)
