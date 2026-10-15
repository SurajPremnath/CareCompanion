# CareCompanion Database

This folder contains all database migrations for CareCompanion.

Migration Order

001_extensions.sql
002_functions.sql
003_tables.sql
004_indexes.sql
005_triggers.sql
006_rls.sql
007_policies.sql

Every migration should be executed in sequence.

Do not modify an existing migration after it has been executed in production.

Future schema changes should always be added as a new migration.