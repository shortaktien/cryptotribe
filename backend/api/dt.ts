import { createKysely } from '@vercel/postgres-kysely';
import { Kysely, Generated } from 'kysely';

// Definiere deine Tabellenstrukturen
interface PlayersTable {
  id: Generated<number>;
  address: string;
}

interface BuildingsTable {
  id: Generated<number>;
  player_id: number;
  type: string;
  level: number;
  position: string;
}

interface UnitsTable {
  id: Generated<number>;
  player_id: number;
  type: string;
  count: number;
}

// Definiere die gesamte Datenbankstruktur
interface Database {
  players: PlayersTable;
  buildings: BuildingsTable;
  units: UnitsTable;
}

// Erstelle die Kysely-Datenbankinstanz
const db = createKysely<Database>();

export default db;
