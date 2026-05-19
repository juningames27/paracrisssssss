const crypto = require("crypto");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS escolhas (
      id TEXT PRIMARY KEY,
      escolha TEXT NOT NULL,
      indice INTEGER NOT NULL,
      criado_em TIMESTAMP NOT NULL
    )
  `);
}

module.exports = async function handler(req, res) {
  try {
    await initDatabase();

    if (req.method === "GET") {
      const result = await pool.query(`
        SELECT id, escolha, indice, criado_em
        FROM escolhas
        ORDER BY criado_em DESC
      `);

      return res.status(200).json(result.rows);
    }

    if (req.method === "POST") {
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
      const criadoEm = new Date();

      await pool.query(
        `
        INSERT INTO escolhas (id, escolha, indice, criado_em)
        VALUES ($1, $2, $3, $4)
        `,
        [id, escolha, indice, criadoEm]
      );

      return res.status(201).json({
        id,
        escolha,
        indice,
        criado_em: criadoEm.toISOString()
      });
    }

    return res.status(405).json({
      error: "Método não permitido."
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro interno no servidor."
    });
  }
};