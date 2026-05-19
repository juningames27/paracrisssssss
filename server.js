const express = require("express");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "escolhas.sqlite");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS escolhas (
      id TEXT PRIMARY KEY,
      escolha TEXT NOT NULL,
      indice INTEGER NOT NULL,
      criado_em TEXT NOT NULL
    )
  `);
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/escolhas", (req, res) => {
  const { escolha, indice } = req.body;

  const escolhasPermitidas = [
    "Cartinha Secreta",
    "Vale-Presente",
    "Nosso Destino"
  ];

  if (
    typeof escolha !== "string" ||
    typeof indice !== "number" ||
    !escolhasPermitidas.includes(escolha) ||
    indice < 0 ||
    indice > 2
  ) {
    return res.status(400).json({
      error: "Escolha inválida."
    });
  }

  const id = crypto.randomUUID();
  const criadoEm = new Date().toISOString();

  db.run(
    "INSERT INTO escolhas (id, escolha, indice, criado_em) VALUES (?, ?, ?, ?)",
    [id, escolha, indice, criadoEm],
    (error) => {
      if (error) {
        return res.status(500).json({
          error: "Erro ao salvar no banco de dados."
        });
      }

      return res.status(201).json({
        id,
        escolha,
        indice,
        criado_em: criadoEm
      });
    }
  );
});

app.get("/api/escolhas", (req, res) => {
  db.all(
    "SELECT id, escolha, indice, criado_em FROM escolhas ORDER BY criado_em DESC",
    [],
    (error, rows) => {
      if (error) {
        return res.status(500).json({
          error: "Erro ao buscar escolhas."
        });
      }

      return res.json(rows);
    }
  );
});

app.get("/api/escolhas/:id", (req, res) => {
  db.get(
    "SELECT id, escolha, indice, criado_em FROM escolhas WHERE id = ?",
    [req.params.id],
    (error, row) => {
      if (error) {
        return res.status(500).json({
          error: "Erro ao buscar escolha."
        });
      }

      if (!row) {
        return res.status(404).json({
          error: "Escolha não encontrada."
        });
      }

      return res.json(row);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Site rodando em http://localhost:${PORT}`);
  console.log(`Banco SQLite em: ${dbPath}`);
});
