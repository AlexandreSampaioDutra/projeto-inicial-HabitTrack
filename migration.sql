-- =====================================================
-- MIGRAÇÃO HabitTrack — Novas funcionalidades
-- Execute no Supabase: SQL Editor → New query
-- =====================================================

-- 1. Adiciona colunas de meta na tabela habits
ALTER TABLE habits
  ADD COLUMN IF NOT EXISTS goal  INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS unit  VARCHAR(30) NOT NULL DEFAULT 'vez';

-- 2. Adiciona colunas de contagem e nota na tabela habit_logs
ALTER TABLE habit_logs
  ADD COLUMN IF NOT EXISTS count INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS note  TEXT;

-- 3. Garante que não existam duplicatas de (habit_id, date)
--    (um único registro por hábito por dia, atualizado via UPDATE)
ALTER TABLE habit_logs
  DROP CONSTRAINT IF EXISTS habit_logs_habit_id_date_key;

ALTER TABLE habit_logs
  ADD CONSTRAINT habit_logs_habit_id_date_key UNIQUE (habit_id, date);

-- 4. (Opcional) Atualiza registros antigos que tinham count = 0
UPDATE habit_logs SET count = 1 WHERE count = 0;
